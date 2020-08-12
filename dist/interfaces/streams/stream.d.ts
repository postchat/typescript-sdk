import { StreamUser } from './streamUser';
export interface Stream {
    id: string;
    name: string;
    description?: string;
    discoverable?: boolean;
    owner?: Stream;
    streamUsers?: StreamUser[];
}
