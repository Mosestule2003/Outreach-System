// Per-carrier operational parameters — mirrors docs/16-CARRIER-POLICIES.md.
// Added 2026-07-15 after finding the classifier had a single hardcoded
// 2-attempt escalation threshold applied uniformly across all 3 original
// MVP carriers, when their actual policies differ (UPS Canada: 3
// attempts; Canada Post: 1 attempt + 15-day hold; Intelcom:
// unconfirmed/provisional). Expanded same day from 3 to 7 carriers per
// Moses's direction ("any carrier feasible for us, restricted to
// Canada") — Purolator, Canpar Express, Loomis Express, and FedEx Canada
// added after confirming each has a genuine EasyPost carrier guide and
// real Canadian-domestic last-mile service (DHL Express Canada and
// Amazon Logistics were considered and excluded — see
// 16-CARRIER-POLICIES.md §1). Values here are from public carrier policy
// pages, not real Rezlv shipment data yet — see 16-CARRIER-POLICIES.md's
// caveat.

export type CarrierId =
  | 'canada_post'
  | 'intelcom'
  | 'ups_canada'
  | 'purolator'
  | 'canpar'
  | 'loomis_express'
  | 'fedex_canada'

export interface CarrierPolicy {
  /** Delivery attempts carrier makes before RTO. Canada Post is modeled as
   * 1 (single attempt, then notice-card/hold-period flow, not repeat
   * attempts) — see 16-CARRIER-POLICIES.md §1.1. */
  maxDeliveryAttempts: number
  /** Whether this carrier can deliver to a PO Box address at all
   * (16-CARRIER-POLICIES.md §4) — only Canada Post can. */
  supportsPoBoxDelivery: boolean
  /** True if maxDeliveryAttempts is not from an official confirmed source
   * (Intelcom — 16-CARRIER-POLICIES.md §1.2) and should be treated as a
   * placeholder pending real EasyPost sandbox/tracking data. */
  attemptCountProvisional: boolean
  /** Carrier claims a formal reimbursement path even exists at all
   * (16-CARRIER-POLICIES.md §3 — Intelcom does not). */
  supportsCarrierClaim: boolean
}

export const CARRIER_POLICIES: Record<CarrierId, CarrierPolicy> = {
  canada_post: {
    maxDeliveryAttempts: 1,
    supportsPoBoxDelivery: true,
    attemptCountProvisional: false,
    supportsCarrierClaim: true,
  },
  ups_canada: {
    maxDeliveryAttempts: 3,
    supportsPoBoxDelivery: false,
    attemptCountProvisional: false,
    supportsCarrierClaim: true,
  },
  intelcom: {
    maxDeliveryAttempts: 3,
    supportsPoBoxDelivery: false,
    attemptCountProvisional: true,
    supportsCarrierClaim: false,
  },
  purolator: {
    // 1 attempt, notice left, 5-business-day hold before RTO
    maxDeliveryAttempts: 1,
    supportsPoBoxDelivery: false,
    attemptCountProvisional: false,
    supportsCarrierClaim: true,
  },
  canpar: {
    // 1 attempt per day at their discretion, then held for pickup
    maxDeliveryAttempts: 1,
    supportsPoBoxDelivery: false,
    attemptCountProvisional: false,
    supportsCarrierClaim: true,
  },
  loomis_express: {
    // 1st attempt + notice, automatic 2nd attempt next business day at no
    // charge, fee applies for any further requested redelivery
    maxDeliveryAttempts: 2,
    supportsPoBoxDelivery: false,
    attemptCountProvisional: false,
    supportsCarrierClaim: true,
  },
  fedex_canada: {
    // Similar structure to UPS Canada — modeled at 3 pending FedEx-Canada-
    // specific confirmation (only the general FedEx claims/investigation
    // timeline was confirmed, not the exact attempt count)
    maxDeliveryAttempts: 3,
    supportsPoBoxDelivery: false,
    attemptCountProvisional: true,
    supportsCarrierClaim: true,
  },
}

/**
 * Attempt count at which a repeated `failed_attempt` should escalate to
 * `access_issue` (03-EXCEPTIONS-TAXONOMY.md §4 edge case #1) — one less
 * than the carrier's own max, so escalation happens before the carrier
 * would have already returned the package to sender.
 */
export function getAccessIssueEscalationThreshold(carrier: CarrierId): number {
  return Math.max(1, CARRIER_POLICIES[carrier].maxDeliveryAttempts - 1)
}

export function isKnownCarrier(carrier: string): carrier is CarrierId {
  return carrier in CARRIER_POLICIES
}
