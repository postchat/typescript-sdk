import { Group } from '../groups/group';
import { User } from '../user';

export interface Event {
  type: string;
  eventGroup?: Pick<Group, 'id'>;
  readonly datetime?: Date;
  readonly user?: User;
  id?: string;
}
