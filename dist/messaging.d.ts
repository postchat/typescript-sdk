import { Event, Group, GroupMember, MessageEventData, Subscription, WebhookData } from './interfaces';
export declare class Messaging {
    private readonly axios;
    readonly userId: string;
    constructor(accessToken: string, userId: string, baseUrl: string);
    getWorkspaces(): Promise<Group[]>;
    getChannels(workspaceId: string): Promise<Group[]>;
    getDirectGroups(workspaceId: string): Promise<Group[]>;
    getEventStream(groupId: string): Promise<Event[]>;
    getGroupMemberships(selfOnly: boolean, groupId?: string): Promise<GroupMember[]>;
    joinGroup(groupId: string): Promise<GroupMember>;
    leaveGroup(groupId: string): Promise<void>;
    subscribeWithPusher(groupMemberId: string, eventTypes?: string[]): Promise<Subscription>;
    subscribeWithWebhook(groupMemberId: string, webhookData: WebhookData, eventTypes?: string[]): Promise<Subscription>;
    sendMessage(groupId: string, messageData: MessageEventData): Promise<Event>;
    sendTextMessage(groupId: string, text: string): Promise<Event>;
    startTyping(groupId: string): Promise<Event>;
    stopTyping(groupId: string): Promise<Event>;
}
