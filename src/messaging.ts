import {Event, Group, GroupMember, MessageEventData, Subscription, WebhookData} from './interfaces';
import Axios, {AxiosInstance} from 'axios';
import {AuthenticationClient} from 'auth0';

export class Messaging {
  private readonly axios: AxiosInstance;
  public readonly userId: string;

  constructor(accessToken: string, userId: string, baseUrl: string) {
    this.userId = userId;
    this.axios = Axios.create({
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      baseURL: baseUrl
    })
  }

  static async create(isBot: boolean, username: string, password: string): Promise<Messaging> {
    const apiBaseUri =          "https://api-bhrsx2hg5q-uc.a.run.app/api/";
    const auth0Audience =       "https://api.getpostchat.com";
    const auth0Domain =         "postchat.us.auth0.com";
    const auth0UserConnection = isBot ? "bots" : "Username-Password-Authentication";
    const auth0ClientId =       isBot ? "WHNPXkruRjkmEzWIwXedFJhCOx1x49VR" : "zT7txf5YZUBjS3iIuZxovfHl5LfcsEBr";

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
      scope: "openid"
    });

    const profile = await authenticationClient.getProfile(response.access_token);

    return new Messaging(response.access_token, profile.sub, apiBaseUri);
  }

  async getWorkspaces(): Promise<Group[]> {
    const response = await this.axios.get<Group[]>('groups', {
      params: {
        'exists[owner]': false
      }
    });

    return response.data;
  }

  async getAllChildren(workspaceId: string): Promise<Group[]> {
    const response = await this.axios.get<Group[]>('groups', {
      params: {
        owner: {
          id: workspaceId
        }
      }
    });

    return response.data;
  }

  async getChannels(workspaceId: string): Promise<Group[]> {
    const response = await this.axios.get<Group[]>('groups', {
      params: {
        owner: {
          id: workspaceId
        },
        exists: {
          name: true
        }
      }
    });

    return response.data;
  }

  async getDirectGroups(workspaceId: string): Promise<Group[]> {
    const response = await this.axios.get<Group[]>('groups', {
      params: {
        owner: {
          id: workspaceId
        },
        exists: {
          name: false
        }
      }
    });
    return response.data;
  }

  async getEventStream(groupId: string): Promise<Event[]> {
    const response = await this.axios.get<Event[]>('events', {
      params: {
        eventGroup: {
          id: groupId
        }
      }
    });

    return response.data;
  }

  async getGroupMemberships(selfOnly: boolean, groupId?: string): Promise<GroupMember[]> {
    let params: GroupMember = {};

    if(groupId) {
      params['userGroup'] = {
        id: groupId
      };
    }
    if(selfOnly) {
      params['user'] = {
        id: this.userId
      }
    }
    const response = await this.axios.get<GroupMember[]>('groupMember', {
      params: params
    });

    return response.data;
  }

  async joinGroup(groupId: string): Promise<GroupMember> {
    const [existingMembership] = await this.getGroupMemberships(true, groupId);
    if(existingMembership) {
      return existingMembership;
    }

    const response = await this.axios.post<Event>('groupMember', {
      userGroup: {
        id: groupId
      },
      user: {
        id: this.userId
      }
    });

    return response.data;
  }

  async leaveGroup(groupId: string): Promise<void> {
    const [existingMembership] = await this.getGroupMemberships(true, groupId);
    if(existingMembership) {
      await this.axios.delete('groupMembership/' + existingMembership.id);
    }
  }

  async subscribeWithPusher(groupMemberId: string, eventTypes?: string[]): Promise<Subscription> {
    const [existingSubscription]: Subscription[] = (await this.axios.get<Subscription[]>('subscriptions', {
      params: {
        groupMember: {
          id: groupMemberId
        },
        transport: 'pusher'
      }
    })).data;

    if(existingSubscription) {
      //TODO: Patch existing types?
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

  async subscribeWithWebhook(groupMemberId: string, webhookData: WebhookData, eventTypes?: string[]): Promise<Subscription> {
    const [existingSubscription]: Subscription[] = (await this.axios.get<Subscription[]>('subscriptions', {
      params: {
        groupMember: {
          id: groupMemberId
        },
        transport: 'webhook'
      }
    })).data;

    if(existingSubscription) {
      //TODO: Patch existing types/data?
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

  async subscribeWithWebhookUri(groupMemberId: string, webhookUri: string, eventTypes?: string[]): Promise<Subscription> {
    return await this.subscribeWithWebhook(groupMemberId, {uri: webhookUri}, eventTypes);
  }

  async sendMessage(groupId: string, messageData: MessageEventData): Promise<Event> {
    const response = await this.axios.post<Event>('events', {
      eventGroup: {
        id: groupId
      },
      type: 'message',
      messageEventData: messageData
    });

    return response.data;
  }

  async sendTextMessage(groupId: string, text: string): Promise<Event> {
    return this.sendMessage(groupId, {text: text});
  }

  async startTyping(groupId: string): Promise<Event> {
    const response = await this.axios.post<Event>('events', {
      eventGroup: {
        id: groupId
      },
      type: 'typing-start',
    });

    return response.data;
  }

  async stopTyping(groupId: string): Promise<Event> {
    const response = await this.axios.post<Event>('events', {
      eventGroup: {
        id: groupId
      },
      type: 'typing-stop',
    });

    return response.data;
  }
}