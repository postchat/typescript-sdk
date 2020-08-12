import { StreamUser } from './streams/streamUser';
import { WebhookData } from './webhookData';

export interface Subscription {
  transport: string;
  eventTypes?: string[];
  streamUser?: StreamUser;
  webhookData?: WebhookData;
  id?: string;
}
