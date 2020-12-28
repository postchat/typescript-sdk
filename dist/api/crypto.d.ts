/// <reference types="node" />
import * as crypto from 'crypto';
export declare function verifySignature(publicKey: object | crypto.KeyLike, signature: string, requestBody: string, webhookUri: string): boolean;
