import { Event } from '../events/event';
import { User } from '../user';
import { Group } from './group';
export interface GroupMember {
    id: string;
    user: User;
    userGroup: Group;
    lastSeenEvent?: Event;
}
