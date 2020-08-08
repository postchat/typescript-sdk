import { AuthenticationClient } from 'auth0';
import Axios, { AxiosInstance } from 'axios';
import jwt from 'jsonwebtoken';

import {
  Event,
  Group,
  GroupMember,
  MessageEvent,
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
    const response = await this.axios.get<Workspace[]>('groups', {
      params: {
        'exists[owner]': false
      }
    });

    // TODO: We'll probably need to watch performance
    const fetchWorkspaceMemberships = response.data.map(async (workspace) => {
      const groupMembership = await this.getGroupMemberships(workspace.id);
      workspace.groupMembers = groupMembership;

      return workspace;
    });

    return Promise.all(fetchWorkspaceMemberships);
  }

  /** Fetches child groups of the specified group */
  public async getGroupChildren(groupId: string): Promise<Group[]> {
    const response = await this.axios.get<Group[]>('groups', {
      params: {
        'owner.id': groupId
      }
    });

    return response.data;
  }

  /** Fetches available threads of a workspaces */
  public async getThreads(workspaceId: string, direct?: boolean): Promise<Thread[]> {
    const response = await this.axios.get<Thread[]>('groups', {
      params: {
        'owner.id': workspaceId,
        'exists.name': !direct
      }
    });

    // TODO: We'll probably need to watch performance
    const fetchThreadMemberships = response.data.map(async (thread) => {
      const groupMembership = await this.getGroupMemberships(thread.id);
      thread.groupMembers = groupMembership;
      thread.type = thread.name.length === 0 ? 'direct' : 'global';

      return thread;
    });

    return Promise.all(fetchThreadMemberships);
  }

  /** Fetches threads that the current user is a member of */
  public async getCurrentUserThreads(workspaceId: string, direct?: boolean): Promise<Thread[]> {
    const threads = await this.getThreads(workspaceId, direct);

    return threads.filter((thread) => thread.groupMembers.find((value) => value.user.id === this.userId));
  }

  /** Fetches thread by id */
  public async getThreadById(threadId: string): Promise<Thread> {
    const response = await this.axios.get('/groups/' + threadId);
    const thread = response.data;

    const groupMemberships = await this.getGroupMemberships(threadId);
    thread.groupMembers = groupMemberships;
    thread.type = thread.name.length === 0 ? 'direct' : 'global';

    return thread;
  }

  private async createGroup(
    ownerId: string,
    name: string,
    description: string,
    discoverable: boolean
  ): Promise<Group> {
    const response = await this.axios.post<Group>('groups', {
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
    const createdGroup = await this.createGroup(name, ownerId, description, discoverable);
    await this.joinGroup(createdGroup.id, this.userId);

    return this.getThreadById(createdGroup.id);
  }

  /** Fetches the event stream of a group */
  public async getEventStream(groupId: string): Promise<Event[]> {
    const response = await this.axios.get<Event[]>('events', {
      params: {
        'eventGroup.id': groupId
      }
    });

    return response.data;
  }

  /** Fetches group memberships for the specified group */
  public async getGroupMemberships(groupId: string, userId?: string): Promise<GroupMember[]> {
    const response = await this.axios.get<GroupMember[]>(`groups/${groupId}/groupMembers`, {
      params: {
        ...userId && { 'user.id': userId }
      }
    });

    return response.data;
  }

  /** Joins a group if available */
  public async joinGroup(groupId: string, userId: string): Promise<GroupMember> {
    const [existingMembership] = await this.getGroupMemberships(groupId, this.userId);
    if (existingMembership) {
      return existingMembership;
    }

    const response = await this.axios.post<GroupMember>('groupMembers', {
      userGroup: {
        id: groupId
      },
      user: {
        id: userId
      }
    });

    await this.subscribeWithPusher(response.data.id, []);
    return response.data;
  }

  /** Leaves a group */
  public async leaveGroup(groupId: string): Promise<boolean> {
    try {
      const [existingMembership] = await this.getGroupMemberships(groupId, this.userId);
      if (existingMembership) {
        await this.axios.delete('groupMembers/' + existingMembership.id);
      }

      return true;
    }
    catch (err) {
      return false;
    }
  }

  /** Subscribes to pusher transport */
  public async subscribeWithPusher(groupMemberId: string, eventTypes?: string[]): Promise<Subscription> {
    const [existingSubscription]: Subscription[] = (await this.axios.get<Subscription[]>('subscriptions', {
      params: {
        'groupMember.id': groupMemberId,
        transport: 'pusher'
      }
    })).data;

    if (existingSubscription) {
      // TODO: Patch existing types?
      return existingSubscription;
    }

    const response = await this.axios.post<Subscription>('subscriptions', {
      groupMember: {
        id: groupMemberId
      },
      transport: 'pusher',
      eventTypes: eventTypes
    });

    return response.data;
  }

  /** Subscribes to webhook transport */
  private async subscribeWithWebhook(
    groupMemberId: string,
    webhookData: WebhookData,
    eventTypes?: string[]
  ): Promise<Subscription> {
    const [existingSubscription]: Subscription[] = (await this.axios.get<Subscription[]>('subscriptions', {
      params: {
        'groupMember.id': groupMemberId,
        transport: 'webhook'
      }
    })).data;

    if (existingSubscription) {
      // TODO: Patch existing types/data?
      return existingSubscription;
    }

    const response = await this.axios.post<Subscription>('subscriptions', {
      groupMember: {
        id: groupMemberId
      },
      transport: 'webhook',
      webhookData: webhookData,
      eventTypes: eventTypes
    });

    return response.data;
  }

  /** Subscribes to webhook transport with the specified uri */
  public async subscribeWithWebhookUri(
    groupMemberId: string,
    webhookUri: string,
    eventTypes?: string[]
  ): Promise<Subscription> {
    return this.subscribeWithWebhook(groupMemberId, {uri: webhookUri}, eventTypes);
  }

  /** sends an event to the group's event stream */
  public async sendEvent<T = any>(groupId: string, type: string, data?: any): Promise<T> {
    const response = await this.axios.post('events', {
      eventGroup: {
        id: groupId
      },
      type: type,
      ...data && data
    });

    return response.data;
  }

  /** Send a message to the specified group */
  public async sendMessage(groupId: string, text: string): Promise<MessageEvent> {
    return this.sendEvent<MessageEvent>(groupId, 'message', {
      messageEventData: {
        text: text
      }
    });
  }

  /** Send a typing indication to the specified group */
  public async sendTypingEvent(groupId: string, type: 'typing-start' | 'typing-stop') {
    return this.sendEvent(groupId, type);
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