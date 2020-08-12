import { Event, Stream, StreamUser, MessageEvent, Subscription, Thread, User, Workspace } from './interfaces';
export declare class PostChat {
    private readonly axios;
    readonly userId: string;
    constructor(accessToken: string, baseUrl?: string);
    refreshToken(accessToken: string): void;
    static create(username: string, password: string, isBot: boolean): Promise<PostChat>;
    /** Fetches the current user's available workspaces */
    getWorkspaces(): Promise<Workspace[]>;
    /** Fetches child streams of the specified stream */
    getStreamChildren(streamId: string): Promise<Stream[]>;
    /** Fetches available threads of a workspaces */
    getThreads(workspaceId: string, direct?: boolean): Promise<Thread[]>;
    /** Fetches threads that the current user is a member of */
    getCurrentUserThreads(workspaceId: string, direct?: boolean): Promise<Thread[]>;
    /** Fetches thread by id */
    getThreadById(threadId: string): Promise<Thread>;
    private createStream;
    /** Creates a new thread */
    createThread(ownerId: string, name: string, description?: string, discoverable?: boolean): Promise<Thread>;
    /** Fetches the event stream of a stream */
    getEventStream(streamId: string): Promise<Event[]>;
    /** Fetches stream memberships for the specified stream */
    getStreamUsers(streamId: string, userId?: string): Promise<StreamUser[]>;
    /** Joins a stream if available */
    joinStream(streamId: string, userId: string, pusherSubscribe?: boolean): Promise<StreamUser>;
    /** Leaves a stream */
    leaveStream(streamId: string): Promise<boolean>;
    /** Subscribes to pusher transport */
    subscribeWithPusher(streamUserId: string, eventTypes?: string[]): Promise<Subscription>;
    /** Subscribes to webhook transport */
    private subscribeWithWebhook;
    /** Subscribes to webhook transport with the specified uri */
    subscribeWithWebhookUri(streamUserId: string, webhookUri: string, eventTypes?: string[]): Promise<Subscription>;
    /** sends an event to the stream's event stream */
    sendEvent<T = any>(streamId: string, type: string, data?: any): Promise<T>;
    /** Send a message to the specified stream */
    sendMessage(streamId: string, text: string): Promise<MessageEvent>;
    /** Send a typing indication to the specified stream */
    /** Send a typing indication to the specified stream */
    sendTypingEvent(streamId: string, type: 'typing-start' | 'typing-stop'): Promise<any>;
    /** Fetches user information based on the user id */
    getUserInfo(userId: string): Promise<User>;
    /** Fetches users available to the current user */
    getUsers(): Promise<User[]>;
}
