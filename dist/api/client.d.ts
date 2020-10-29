import { Event, EventTypes, Invite, Stream, StreamUser, Subscription, User } from './resources';
export * from './crypto';
export * from './resources';
/**
 * A thin client over the API. No caching, no multi request calls, etc.
 * Goal is maximum client support. Other layers can be added on top for common use cases.
 */
export declare class Client {
    private readonly axios;
    readonly userId: string;
    constructor(accessToken: string, baseUrl?: string);
    static create(username: string, password: string, isBot: boolean): Promise<Client>;
    refreshToken(accessToken: string): void;
    getRootStreams(): Promise<Stream[]>;
    getStreamsByParent(parentStreamId: string): Promise<Stream[]>;
    getStream(streamId: string): Promise<Stream>;
    createStream(name: string, description: string, discoverable: boolean, isPrivate: boolean, parentStreamId?: string): Promise<Stream>;
    getEventStream(streamId: string): Promise<Event[]>;
    createInvite(streamId: string, expiration?: Date): Promise<Invite>;
    getStreamUsers(streamId: string, userId?: string): Promise<StreamUser[]>;
    createStreamUser(streamId: string, userId: string, inviteId?: string): Promise<StreamUser>;
    deleteStreamUser(streamUserId: string): Promise<boolean>;
    getSubscriptions(streamUserId: string, transport?: string): Promise<Subscription[]>;
    createSubscription(streamUserId: string, transport: string, eventTypes?: EventTypes[] | string[], data?: any): Promise<Subscription>;
    createWebhookSubscription(streamUserId: string, webhookUri: string, eventTypes?: EventTypes[] | string[]): Promise<Subscription>;
    createEvent(streamId: string, type: EventTypes | string, data?: any): Promise<Event>;
    createMessage(streamId: string, text: string): Promise<Event>;
    createTypingEvent(streamId: string, type: EventTypes.TYPING_START | EventTypes.TYPING_STOP): Promise<Event>;
    getUser(userId: string): Promise<User>;
    getUsers(): Promise<User[]>;
}
