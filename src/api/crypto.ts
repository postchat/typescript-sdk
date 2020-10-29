import * as crypto from 'crypto';

export function verifySignature(
  publicKey: object | crypto.KeyLike,
  signature: string,
  requestBody: string,
  webhookUri: string
): boolean {
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.write(requestBody + '.' + webhookUri, 'utf8');
    verifier.end();
    return verifier.verify(publicKey, signature, 'base64');
}
