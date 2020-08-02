import { GroupMember } from './groups/groupMember';
import { WebhookData } from './webhookData';
export interface Subscription {
    transport: string;
    eventTypes?: string[];
    groupMember?: GroupMember;
    webhookData?: WebhookData;
    id?: string;
}
