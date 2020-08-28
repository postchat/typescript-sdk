import { AuthenticationClient } from 'auth0';
import Axios, { AxiosInstance } from 'axios';
import jwt from 'jsonwebtoken';

import {
  Event,
  MessageEvent,
  Stream,
  StreamUser,
  Subscription,
  Thread,
  User,
  WebhookData,
  Workspace
} from './interfaces';

export class PostChat {
  private readonly axios: AxiosInstance;
  public readonly userId: string;

  constructor(
    accessToken: string,
    baseUrl: string = 'https://api-bhrsx2hg5q-uc.a.run.app/api/'
  ) {
    const decodedToken = jwt.decode(accessToken);
    this.userId = decodedToken['sub'];
    this.axios = Axios.create({
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      baseURL: baseUrl
    });
  }

  public refreshToken(accessToken: string) {
    this.axios.defaults.headers['Authorization'] = 'Bearer ' + accessToken;
  }

  static async create(username: string, password: string, isBot: boolean) {
    const apiBaseUri =          'https://api-bhrsx2hg5q-uc.a.run.app/api/';
    const auth0Audience =       'https://api.getpostchat.com';
    const auth0Domain =         'postchat.us.auth0.com';
    const auth0UserConnection = isBot ? 'bots' : 'Username-Password-Authentication';
    const auth0ClientId =       isBot ? 'WHNPXkruRjkmEzWIwXedFJhCOx1x49VR' : 'zT7txf5YZUBjS3iIuZxovfHl5LfcsEBr';

    const authenticationClient = new AuthenticationClient({
      domain: auth0Domain,
      clientId: auth0ClientId
    });

    const response = await authenticationClient.passwordGrant({
      username: username,
      password: password,
      // @ts-ignore The library accepts this and processes it, even though it's missing from the type.
      audience: auth0Audience,
      realm: auth0UserConnection,
      scope: 'openid profile'
    });

    return new PostChat(response.access_token, apiBaseUri);
  }

  /** Fetches the current user's available workspaces */
  public async getWorkspaces(): Promise<Workspace[]> {
    const response = await this.axios.get<Workspace[]>('streams', {
      params: {
        'exists[owner]': false
      }
    });

    // TODO: We'll probably need to watch performance
    const fetchWorkspaceMemberships = response.data.map(async (workspace) => {
      workspace.streamUsers = await this.getStreamUsers(workspace.id);

      return workspace;
    });

    return Promise.all(fetchWorkspaceMemberships);
  }

  /** Fetches child streams of the specified stream */
  public async getStreamChildren(streamId: string): Promise<Stream[]> {
    const response = await this.axios.get<Stream[]>('streams', {
      params: {
        'owner.id': streamId
      }
    });

    return response.data;
  }

  /** Fetches available threads of a workspaces */
  public async getThreads(workspaceId: string, direct?: boolean): Promise<Thread[]> {
    const response = await this.axios.get<Thread[]>('streams', {
      params: {
        'owner.id': workspaceId,
        'exists.name': !direct
      }
    });

    // TODO: We'll probably need to watch performance
    const fetchThreadMemberships = response.data.map(async (thread) => {
      thread.streamUsers = await this.getStreamUsers(thread.id);
      thread.type = thread.name.length === 0 ? 'direct' : 'global';

      return thread;
    });

    return Promise.all(fetchThreadMemberships);
  }

  /** Fetches threads that the current user is a member of */
  public async getCurrentUserThreads(workspaceId: string, direct?: boolean): Promise<Thread[]> {
    const threads = await this.getThreads(workspaceId, direct);

    return threads.filter((thread) => thread.streamUsers.find((value) => value.user.id === this.userId));
  }

  /** Fetches thread by id */
  public async getThreadById(threadId: string): Promise<Thread> {
    const response = await this.axios.get('streams/' + threadId);
    const thread = response.data;

    thread.streamUsers = await this.getStreamUsers(threadId);
    thread.type = thread.name.length === 0 ? 'direct' : 'global';

    return thread;
  }

  private async createStream(
    ownerId: string,
    name: string,
    description: string,
    discoverable: boolean
  ): Promise<Stream> {
    const response = await this.axios.post<Stream>('streams', {
      name: name,
      description: description,
      discoverable: discoverable,
      owner: {
        id: ownerId
      }
    });

    return response.data;
  }

  /** Creates a new thread */
  public async createThread(ownerId: string, name: string, description: string = '', discoverable: boolean = true) {
    const createdStream = await this.createStream(ownerId, name, description, discoverable);
    await this.joinStream(createdStream.id, this.userId);

    return this.getThreadById(createdStream.id);
  }

  /** Fetches the event stream of a stream */
  public async getEventStream(streamId: string): Promise<Event[]> {
    const response = await this.axios.get<Event[]>('events', {
      params: {
        'stream.id': streamId
      }
    });

    return response.data;
  }

  /** Fetches stream memberships for the specified stream */
  public async getStreamUsers(streamId: string, userId?: string): Promise<StreamUser[]> {
    const response = await this.axios.get<StreamUser[]>(`streams/${streamId}/streamUsers`, {
      params: {
        ...userId && { 'user.id': userId }
      }
    });

    return response.data;
  }

  /** Joins a stream if available */
  public async joinStream(streamId: string, userId: string, pusherSubscribe: boolean = true): Promise<StreamUser> {
    const [existingMembership] = await this.getStreamUsers(streamId, this.userId);
    if (existingMembership) {
      return existingMembership;
    }

    const response = await this.axios.post<StreamUser>('streamUsers', {
      stream: {
        id: streamId
      },
      user: {
        id: userId
      }
    });

    if (pusherSubscribe) {
      await this.subscribeWithPusher(response.data.id, []);
    }
    return response.data;
  }

  /** Leaves a stream */
  public async leaveStream(streamId: string): Promise<boolean> {
    try {
      const [existingMembership] = await this.getStreamUsers(streamId, this.userId);
      if (existingMembership) {
        await this.axios.delete('streamUsers/' + existingMembership.id);
      }

      return true;
    }
    catch (err) {
      return false;
    }
  }

  /** Subscribes to pusher transport */
  public async subscribeWithPusher(streamUserId: string, eventTypes?: string[]): Promise<Subscription> {
    const [existingSubscription]: Subscription[] = (await this.axios.get<Subscription[]>('subscriptions', {
      params: {
        'streamUser.id': streamUserId,
        transport: 'pusher'
      }
    })).data;

    if (existingSubscription) {
      // TODO: Patch existing types?
      return existingSubscription;
    }

    const response = await this.axios.post<Subscription>('subscriptions', {
      streamUser: {
        id: streamUserId
      },
      transport: 'pusher',
      eventTypes: eventTypes
    });

    return response.data;
  }

  /** Subscribes to webhook transport */
  private async subscribeWithWebhook(
    streamUserId: string,
    webhookData: WebhookData,
    eventTypes?: string[]
  ): Promise<Subscription> {
    const [existingSubscription]: Subscription[] = (await this.axios.get<Subscription[]>('subscriptions', {
      params: {
        'streamUser.id': streamUserId,
        transport: 'webhook'
      }
    })).data;

    if (existingSubscription) {
      // TODO: Patch existing types/data?
      return existingSubscription;
    }

    const response = await this.axios.post<Subscription>('subscriptions', {
      streamUser: {
        id: streamUserId
      },
      transport: 'webhook',
      webhookData: webhookData,
      eventTypes: eventTypes
    });

    return response.data;
  }

  /** Subscribes to webhook transport with the specified uri */
  public async subscribeWithWebhookUri(
    streamUserId: string,
    webhookUri: string,
    eventTypes?: string[]
  ): Promise<Subscription> {
    return this.subscribeWithWebhook(streamUserId, {uri: webhookUri}, eventTypes);
  }

  /** sends an event to the stream's event stream */
  public async sendEvent<T = any>(streamId: string, type: string, data?: any): Promise<T> {
    const response = await this.axios.post('events', {
      stream: {
        id: streamId
      },
      type: type,
      ...data && data
    });

    return response.data;
  }

  /** Send a message to the specified stream */
  public async sendMessage(streamId: string, text: string): Promise<MessageEvent> {
    return this.sendEvent<MessageEvent>(streamId, 'message', {
      messageEventData: {
        text: text
      }
    });
  }

  /** Send a typing indication to the specified stream */
  /** Send a typing indication to the specified stream */
  public async sendTypingEvent(streamId: string, type: 'typing-start' | 'typing-stop') {
    return this.sendEvent(streamId, type);
  }

  /** Fetches user information based on the user id */
  public async getUserInfo(userId: string): Promise<User> {
    const response = await this.axios.get('users/' + userId);

    return response.data;
  }

  /** Fetches users available to the current user */
  public async getUsers(): Promise<User[]> {
    const response = await this.axios.get('users');

    return response.data;
  }
}