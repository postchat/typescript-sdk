export interface Event {
    type: string;
    eventGroup?: Group;
    messageEventData?: MessageEventData;
    commandEventData?: CommandEventData;
    readonly datetime?: Date;
    readonly user?: User;
    id?: string;
}
export interface MessageEventData {
    text: string;
}
export interface CommandEventData {
    command: string;
    parameters: any;
}
export interface Group {
    name?: string;
    description?: string;
    discoverable?: boolean;
    owner?: Group;
    id?: string;
}
export interface GroupMember {
    user?: User;
    userGroup?: Group;
    lastSeenEvent?: Event;
    id?: string;
}
export interface Subscription {
    transport: string;
    eventTypes?: string[];
    groupMember?: GroupMember;
    webhookData?: WebhookData;
    id?: string;
}
export interface WebhookData {
    uri: string;
}
export interface User {
    name?: string;
    email?: string;
    picture?: string;
    nickname?: string;
    id?: string;
}
