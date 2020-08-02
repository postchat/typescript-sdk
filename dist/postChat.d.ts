import { Event, Group, GroupMember, MessageEvent, Subscription, Thread } from './interfaces';
export declare class PostChat {
    private readonly axios;
    readonly userId: string;
    constructor(accessToken: string, baseUrl?: string);
    static create(username: string, password: string, isBot: boolean): Promise<PostChat>;
    /** Fetches the current user's available workspaces */
    getWorkspaces(): Promise<Group[]>;
    /** Fetches child groups of the specified group */
    getGroupChildren(groupId: string): Promise<Group[]>;
    /** Fetches available threads of a workspaces */
    getThreads(workspaceId: string, direct?: boolean): Promise<Thread[]>;
    private createGroup;
    /** Creates a new thread */
    createThread(ownerId: string, name: string, description?: string, discoverable?: boolean): Promise<Group>;
    /** Fetches the event stream of a group */
    getEventStream(groupId: string): Promise<Event[]>;
    /** Fetches group memberships for the specified group */
    getGroupMemberships(groupId: string, userId?: string): Promise<GroupMember[]>;
    /** Joins a group if available */
    joinGroup(groupId: string, userId: string): Promise<GroupMember>;
    /** Leaves a group */
    leaveGroup(groupId: string): Promise<boolean>;
    /** Subscribes to pusher transport */
    subscribeWithPusher(groupMemberId: string, eventTypes?: string[]): Promise<Subscription>;
    /** Subscribes to webhook transport */
    private subscribeWithWebhook;
    /** Subscribes to webhook transport with the specified uri */
    subscribeWithWebhookUri(groupMemberId: string, webhookUri: string, eventTypes?: string[]): Promise<Subscription>;
    /** sends an event to the group's event stream */
    sendEvent<T = any>(groupId: string, type: string, data?: any): Promise<T>;
    /** Send a message to the specified group */
    sendMessage(groupId: string, text: string): Promise<MessageEvent>;
    /** Send a typing indication to the specified group */
    sendTypingEvent(groupId: string, type: 'typing-start' | 'typing-stop'): Promise<any>;
}
