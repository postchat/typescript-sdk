import { Group } from './group';
export interface Thread extends Group {
    type: 'direct' | 'global';
}
