import { Stream } from './stream';
export interface Thread extends Stream {
    type: 'direct' | 'global';
}
