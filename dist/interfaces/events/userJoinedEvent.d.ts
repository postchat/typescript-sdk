import { User } from '../user';
import { Event } from './event';
export interface UserJoinedEvent extends Event {
    user: User;
}
