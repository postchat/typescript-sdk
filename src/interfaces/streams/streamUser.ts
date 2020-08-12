import { Event } from '../events/event';
import { User } from '../user';
import { Stream } from './stream';

export interface StreamUser {
  id: string;
  user: User;
  stream: Stream;
  lastSeenEvent?: Event;
}
