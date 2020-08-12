import { Stream } from '../streams/stream';
import { User } from '../user';

export interface Event {
  type: string;
  stream?: Pick<Stream, 'id'>;
  readonly datetime?: Date;
  readonly user?: User;
  id?: string;
}
