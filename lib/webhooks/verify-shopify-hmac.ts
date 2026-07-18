import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Verifies the Shopify webhook HMAC signature (SRS §3.1, §4.3).
 * Rawtext body MUST be the exact bytes received — never re-serialize
 * parsed JSON before verifying, since key order / whitespace differences
 * would break the signature.
 */
export function verifyShopifyHmac(
  rawBody: string,
  hmacHeader: string | null | undefined,
  secret: string,
): boolean {
  if (!hmacHeader) return false

  const computed = createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64')

  const computedBuf = Buffer.from(computed, 'base64')
  const providedBuf = Buffer.from(hmacHeader, 'base64')

  if (computedBuf.length !== providedBuf.length) return false
  return timingSafeEqual(computedBuf, providedBuf)
}
