import {Event, Group, GroupMember, MessageEventData, Subscription, WebhookData} from './interfaces';
import Axios, {AxiosInstance} from 'axios';

export class Messaging {
  private readonly axios: AxiosInstance;
  private readonly userId: string;

  constructor(accessToken: string, userId: string, baseUrl: string) {
    this.userId = userId;
    this.axios = Axios.create({
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      baseURL: baseUrl
    })
  }

  async getWorkspaces(): Promise<Group[]> {
    const response = await this.axios.get<Group[]>('groups', {
      params: {
        exists: {
          owner: false
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