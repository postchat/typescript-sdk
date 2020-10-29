export interface User {
    name: string;
    email: string;
    picture: string;
    nickname: string;
    id: string;
}

export interface Stream {
    id: string;
    name: string;
    direct: () => boolean; //Magic, we will define it ourselves.
    description: string;
    discoverable: boolean;
    private: boolean;
    owner?: Stream;
}

export interface StreamUser {
    id: string;
    user: User;
    stream: Stream;
    lastSeenEvent?: Event;
    invite?: Invite;
}

interface MessageEventData {
    text: string;
}

interface CommandEventData {
    command: string;
    parameters: any;
}

export enum EventTypes {
    MESSAGE      = 'message',
    TYPING_START = 'typing-start',
    TYPING_STOP  = 'typing-stop'
}

export interface Event {
    id: string;
    type: EventTypes | string;
    stream: Pick<Stream, 'id'>;
    datetime: Date;
    user: User;
    messageEventData?: MessageEventData;
    commandEventData?: CommandEventData;
}

export interface WebhookData {
    uri: string;
}

export interface Subscription {
    id: string;
    transport: string;
    eventTypes?: string[];
    streamUser: StreamUser;
    webhookData?: WebhookData;
}

export interface Invite {
    id: string;
    stream: Pick<Stream, 'id'>;
    expiration: Date;
    invitedStreamUser?: StreamUser;
}