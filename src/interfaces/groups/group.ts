import { GroupMember } from './groupMember';

export interface Group {
  id: string;
  name: string;
  description?: string;
  discoverable?: boolean;
  owner?: Group;
  groupMembers?: GroupMember[];
}
