import { Client, Stream, StreamUser, Subscription } from './api/client';

export type StreamWithStreamUsers = [Stream, StreamUser[]];
/**
 * A messaging client focused interface on the postchat api.
 */
export class PostChat {
  constructor(
    public client: Client,
  ) { }

  public refreshToken(accessToken: string) {
    this.client.refreshToken(accessToken);
  }

  static async create(username: string, password: string, isBot: boolean) {
    return new PostChat(await Client.create(username, password, isBot));
  }

  /** Fetches the current user's available workspaces, including users as most use-cases require them. */
  public async getRootStreamsWithUsers(): Promise<StreamWithStreamUsers[]> {
    const streams = await this.client.getRootStreams();

    return this.retrieveStreamUsersForStreams(streams);
  }

  public async getStreamsByParentWithUsers(parentStreamId: string): Promise<StreamWithStreamUsers[]> {
    const streams = await this.client.getStreamsByParent(parentStreamId);

    return this.retrieveStreamUsersForStreams(streams);
  }

  public async retrieveStreamUsersForStreams(streams: Stream[]): Promise<StreamWithStreamUsers[]> {
    const streamsWithStreamUsers = await streams.map(async (stream): Promise<StreamWithStreamUsers> => {
      return [stream, await this.client.getStreamUsers(stream.id)];
    });

    return Promise.all(streamsWithStreamUsers);
  }

  /** Fetches threads that the current user is a member of */
  public async getCurrentUserStreamsByParent(workspaceId: string): Promise<StreamWithStreamUsers[]> {
    const streams = await this.getStreamsByParentWithUsers(workspaceId);

    return streams.filter((streamWithStreamUsers) =>
        streamWithStreamUsers[1].find((value) => value.user.id === this.client.userId)
    );
  }

  /** Joins a stream if available */
  public async joinStream(streamId: string, userId: string, pusherSubscribe: boolean = true): Promise<StreamUser> {
    const [existingMembership] = await this.client.getStreamUsers(streamId, this.client.userId);
    if (existingMembership) {
      return existingMembership;
    }

    const newStreamUser = await this.client.createStreamUser(streamId, userId);

    if (pusherSubscribe) {
      await this.subscribeWithPusher(newStreamUser.id);
    }
    return newStreamUser;
  }

  /** Leaves a stream */
  public async leaveStream(streamId: string): Promise<boolean> {
    try {
      const [existingMembership] = await this.client.getStreamUsers(streamId, this.client.userId);
      if (existingMembership) {
        await this.client.deleteStreamUser(existingMembership.id);
      }

      return true;
    }
    catch (err) {
      return false;
    }
  }

  /** Subscribes to pusher transport */
  public async subscribeWithPusher(streamUserId: string, eventTypes?: string[]): Promise<Subscription> {
    const [existingSubscription] = await this.client.getSubscriptions(streamUserId, 'pusher');

    if (existingSubscription) {
      // TODO: Patch existing types?
      return existingSubscription;
    }

    return this.client.createSubscription(streamUserId, 'pusher', eventTypes);
  }

  /** Subscribes to webhook transport */
  public async subscribeWithWebhook(
    streamUserId: string,
    webhookUri: string,
    eventTypes?: string[]
  ): Promise<Subscription> {
    const [existingSubscription]: Subscription[] = await this.client.getSubscriptions(streamUserId, 'webhhok');

    if (existingSubscription) {
      // TODO: Patch existing types/data?
      return existingSubscription;
    }

    return this.client.createWebhookSubscription(streamUserId, webhookUri, eventTypes);
  }
}