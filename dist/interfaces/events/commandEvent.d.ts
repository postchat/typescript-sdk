import { Event } from './event';
interface CommandEventData {
    command: string;
    parameters: any;
}
export interface CommandEvent extends Event {
    commandEventData: CommandEventData;
}
export {};
