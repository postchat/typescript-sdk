import { AuthenticationClient } from 'auth0';
import Axios, {AxiosInstance} from 'axios';
import jwt from 'jsonwebtoken';

import {Event, EventTypes, Invite, Stream, StreamUser, Subscription, User} from './resources';

export * from './crypto';
export * from './resources';

/**
 * A thin client over the API. No caching, no multi request calls, etc.
 * Goal is maximum client support. Other layers can be added on top for common use cases.
 */
export class Client {
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

    return new Client(response.access_token, apiBaseUri);
  }

  public refreshToken(accessToken: string) {
    this.axios.defaults.headers['Authorization'] = 'Bearer ' + accessToken;
  }

  public async getRootStreams(): Promise<Stream[]> {
    const response = await this.axios.get<Stream[]>('streams', {
      params: {
        'exists[owner]': false
      }
    });

    return response.data;
  }

  public async getStreamsByParent(parentStreamId: string): Promise<Stream[]> {
    const response = await this.axios.get<Stream[]>('streams', {
      params: {
        'owner.id': parentStreamId
      }
    });

    return response.data;
  }

  public async getStream(streamId: string): Promise<Stream> {
    const response = await this.axios.get(`streams/${streamId}`);

    return response.data
  }

  public async createStream(
    name: string,
    description: string,
    discoverable: boolean,
    isPrivate: boolean,
    parentStreamId?: string,
  ): Promise<Stream> {
    const response = await this.axios.post<Stream>('streams', {
      name: name,
      description: description,
      discoverable: discoverable,
      private: isPrivate,
      ...parentStreamId && { owner: {id: parentStreamId}}
    });

    return response.data;
  }

  public async getEventStream(streamId: string): Promise<Event[]> {
    const response = await this.axios.get<Event[]>('events', {
      params: {
        'stream.id': streamId
      }
    });

    return response.data;
  }

  public async createInvite(
      streamId: string,
      expiration: Date = new Date("tomorrow")
  ): Promise<Invite> {
    const response = await this.axios.post<Invite>('invites', {
      stream: {
        id: streamId
      },
      expiration: expiration
    });

    return response.data;
  }

  public async getStreamUsers(streamId: string, userId?: string): Promise<StreamUser[]> {
    const response = await this.axios.get<StreamUser[]>(`streams/${streamId}/streamUsers`, {
      params: {
        ...userId && { 'user.id': userId }
      }
    });

    return response.data;
  }

  public async createStreamUser(streamId: string, userId: string, inviteId?: string): Promise<StreamUser> {
    const response = await this.axios.post<StreamUser>('streamUsers', {
      stream: {
        id: streamId
      },
      user: {
        id: userId
      },
      ...inviteId && { invite: {
          id: inviteId
      } }
    });

    return response.data;
  }

  public async deleteStreamUser(streamUserId: string): Promise<boolean> {
    try {
      await this.axios.delete(`streamUsers/${streamUserId}`);
      return true;
    }
    catch (err) {
      return false;
    }
  }

  public async getSubscriptions(streamUserId: string, transport?: string): Promise<Subscription[]> {
    const response = await this.axios.get<Subscription[]>('subscriptions', {
      params: {
        'streamUser.id': streamUserId,
        ...transport && { transport: transport }
      }
    });

    return response.data;
  }

  public async createSubscription(
      streamUserId: string,
      transport: string,
      eventTypes?: EventTypes[]|string[],
      data?: any
  ): Promise<Subscription> {
    const response = await this.axios.post<Subscription>('subscriptions', {
      streamUser: {
        id: streamUserId
      },
      transport: transport,
      eventTypes: eventTypes,
      ...data && data
    });

    return response.data;
  }

  public async createWebhookSubscription(
      streamUserId: string,
      webhookUri: string,
      eventTypes?: EventTypes[]|string[]
  ): Promise<Subscription> {
    return this.createSubscription(streamUserId, 'webhook', eventTypes, {
      webhookData: {uri: webhookUri}
    });
  }

  public async createEvent(streamId: string, type: EventTypes | string, data?: any): Promise<Event> {
    const response = await this.axios.post('events', {
      stream: {
        id: streamId
      },
      type: type,
      ...data && data
    });

    return response.data;
  }

  public async createMessage(streamId: string, text: string): Promise<Event> {
    return this.createEvent(streamId, EventTypes.MESSAGE, {
      messageEventData: {
        text: text
      }
    });
  }

  public async createTypingEvent(streamId: string, type: EventTypes.TYPING_START | EventTypes.TYPING_STOP) {
    return this.createEvent(streamId, type);
  }

  public async getUser(userId: string): Promise<User> {
    const response = await this.axios.get(`users/${userId}`);

    return response.data;
  }

  public async getUsers(): Promise<User[]> {
    const response = await this.axios.get('users');

    return response.data;
  }
}