import { Event } from './event';
interface MessageEventData {
    text: string;
}
export interface MessageEvent extends Event {
    messageEventData: MessageEventData;
    text: 'message';
}
export {};
