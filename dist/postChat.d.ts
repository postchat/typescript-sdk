import { Client, Stream, StreamUser, Subscription } from "./api/client";
declare type StreamWithStreamUsers = [Stream, StreamUser[]];
/**
 * A messaging client focused interface on the postchat api.
 */
export declare class PostChat {
    client: Client;
    constructor(client: Client);
    refreshToken(accessToken: string): void;
    static create(username: string, password: string, isBot: boolean): Promise<PostChat>;
    /** Fetches the current user's available workspaces, including users as most use-cases require them. */
    getRootStreamsWithUsers(): Promise<StreamWithStreamUsers[]>;
    getStreamsByParentWithUsers(parentStreamId: string): Promise<StreamWithStreamUsers[]>;
    retrieveStreamUsersForStreams(streams: Stream[]): Promise<StreamWithStreamUsers[]>;
    /** Fetches threads that the current user is a member of */
    getCurrentUserStreamsByParent(workspaceId: string): Promise<StreamWithStreamUsers[]>;
    /** Joins a stream if available */
    joinStream(streamId: string, userId: string, pusherSubscribe?: boolean): Promise<StreamUser>;
    /** Leaves a stream */
    leaveStream(streamId: string): Promise<boolean>;
    /** Subscribes to pusher transport */
    subscribeWithPusher(streamUserId: string, eventTypes?: string[]): Promise<Subscription>;
    /** Subscribes to webhook transport */
    subscribeWithWebhook(streamUserId: string, webhookUri: string, eventTypes?: string[]): Promise<Subscription>;
}
export {};
