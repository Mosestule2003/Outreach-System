// Rule-based NDR classifier — Sprint 1 scope per Product Roadmap
// ("Rule-based first; ML-enhanced Phase 2"). Sorts a carrier tracking event
// into one of the 8 primary categories (docs/03-EXCEPTIONS-TAXONOMY.md §1,
// §1.6-1.8 added 2026-07-15 after research confirmed EasyPost's own
// tracker.status_detail schema has damaged/lost/refused values none of the
// original 5 categories covered) plus severity (§3). Exact per-carrier NDR
// code mappings will be filled in incrementally as real EasyPost sandbox
// data becomes available — the enum and severity model are stable now, per
// rezlv-schema's "when unclear" note.
//
// MVP focus (per Moses's standing scope-discipline reminder,
// 05-LIVE-BUILD-LOG.md 2026-07-15 14:15): `address_issue` is the flagship,
// fully-automated resolution path. Other categories classify correctly and
// notify, but their write-back automation can lag address_issue's.

import { getAccessIssueEscalationThreshold, isKnownCarrier, CARRIER_POLICIES } from '../carriers/policies'
import type { ClassificationResult, OrderContext, Severity, TrackingEvent } from './types'

// Carrier status-code fragments that map to each category. Deliberately
// substring-matched and case-insensitive since exact Canada Post/Intelcom/
// UPS Canada codes aren't confirmed yet (real values come from EasyPost
// sandbox testing, per 08-ENVIRONMENT-SETUP.md §5a). The damaged/lost/
// refused fragments below intentionally include EasyPost's own
// tracker.status_detail literal values ("damaged", "lost", "refused") as
// the highest-confidence match.
const ADDRESS_ISSUE_CODES = ['invalid address', 'insufficient address', 'unrecognized address', 'po box']
const FAILED_ATTEMPT_CODES = ['delivery attempted', 'not available', 'recipient not available', '1st attempt', 'business closed']
const ACCESS_ISSUE_CODES = ['gate code', 'access restricted', 'unable to access', 'security desk']
const CUSTOMS_HOLD_CODES = ['customs', 'duties', 'held at border']
const CARRIER_DELAY_CODES = ['delay', 'weather', 'missort', 'misrouted', 'mechanical']
const DAMAGED_CODES = ['damaged', 'crushed', 'broken in transit']
const LOST_CODES = ['lost', 'cannot be located', 'missing package']
const REFUSED_CODES = ['refused']

function matchesAny(haystack: string, needles: string[]): boolean {
  const lower = haystack.toLowerCase()
  return needles.some((n) => lower.includes(n))
}

/**
 * Classifies a single carrier tracking event into a top-level exception
 * type. Does NOT apply the repeated-failed-attempt escalation (see
 * classifyWithHistory), and does NOT handle `delivered_not_received` (§1.7
 * sub-type B) — that's customer-report-triggered against an already-
 * `delivered` shipment, not derivable from a single tracking event. Use
 * `classifyNonReceiptReport` for that case.
 */
export function classifyEvent(
  event: TrackingEvent,
  isPoBoxAddress = false,
): Exclude<
  ClassificationResult['type'],
  | 'delivered_not_received'
  | 'webhook_processing_failure'
  | 'write_back_failure'
  | 'no_response'
  | 'rto_in_progress'
  | 'rto_completed'
> {
  // 03-EXCEPTIONS-TAXONOMY.md §1.1 / 16-CARRIER-POLICIES.md §4: PO Box is
  // only an address_issue for carriers that can't deliver to one — Canada
  // Post can, so a PO Box address on a Canada Post shipment is NOT an
  // exception. Checked before status-text matching since this is a
  // structural fact about the address/carrier pairing, not something a
  // carrier status code necessarily flags explicitly.
  if (isPoBoxAddress && isKnownCarrier(event.carrier) && !CARRIER_POLICIES[event.carrier].supportsPoBoxDelivery) {
    return 'address_issue'
  }

  const text = `${event.statusCode} ${event.statusDescription ?? ''}`

  if (matchesAny(text, DAMAGED_CODES)) return 'damaged_in_transit'
  if (matchesAny(text, REFUSED_CODES)) return 'delivery_refused'
  if (matchesAny(text, LOST_CODES)) return 'lost_in_transit'
  if (matchesAny(text, CUSTOMS_HOLD_CODES)) return 'customs_hold'
  if (matchesAny(text, ADDRESS_ISSUE_CODES)) return 'address_issue'
  if (matchesAny(text, ACCESS_ISSUE_CODES)) return 'access_issue'
  if (matchesAny(text, FAILED_ATTEMPT_CODES)) return 'failed_attempt'
  if (matchesAny(text, CARRIER_DELAY_CODES)) return 'carrier_delay'

  // Unclassifiable by current rule set — default to carrier_delay (the
  // safest "notify-only, no false commitment" bucket) rather than guessing
  // a resolution-required type. Flag for manual review via severity 4.
  return 'carrier_delay'
}

/**
 * §1.7 sub-type B (`delivered_not_received`) vs. sub-type A
 * (`lost_in_transit`) — the distinguishing signal is whether the carrier
 * itself ever confirmed delivery. A customer non-receipt report against a
 * shipment the carrier marked `delivered` is structurally different (and
 * always Tier 3, per taxonomy §1.7) from one where the carrier never
 * confirmed delivery at all.
 */
export function classifyNonReceiptReport(
  carrierConfirmedDelivered: boolean,
): 'delivered_not_received' | 'lost_in_transit' {
  return carrierConfirmedDelivered ? 'delivered_not_received' : 'lost_in_transit'
}

/**
 * Applies taxonomy §4 edge case #1: repeated failed_attempt events at the
 * same address without an explicit address_issue code should escalate to
 * access_issue, not be treated as independent low-severity events.
 * Escalation threshold is carrier-specific (lib/carriers/policies.ts),
 * not a flat number — UPS Canada tolerates more attempts than Canada Post
 * before RTO, so the escalation point differs per carrier.
 */
export function classifyWithHistory(
  event: TrackingEvent,
  sameAddressFailedAttemptCount: number,
  isPoBoxAddress = false,
): ReturnType<typeof classifyEvent> {
  const base = classifyEvent(event, isPoBoxAddress)
  const threshold = isKnownCarrier(event.carrier) ? getAccessIssueEscalationThreshold(event.carrier) : 2
  if (base === 'failed_attempt' && sameAddressFailedAttemptCount >= threshold) {
    return 'access_issue'
  }
  return base
}

/**
 * Severity model — docs/03-EXCEPTIONS-TAXONOMY.md §3. Weights
 * customer/brand-relationship risk and time-to-RTO-deadline over raw
 * order value, per Rezlv's per-parcel (not freight) context.
 */
export function classifySeverity(
  type: ClassificationResult['type'],
  ctx: OrderContext,
): Severity {
  // §3 Level 5 — write_back_failure on a Tier 2+ action, customs/compliance
  // hold past deadline, or a delivered_not_received claim (always routed to
  // human review regardless of order value, per §1.7 sub-type B).
  if (type === 'write_back_failure') return 5
  if (type === 'delivered_not_received') return 5
  if (type === 'customs_hold' && ctx.hoursToRtoDeadline <= 0) return 5

  const highValue = ctx.orderValueCents >= ctx.highValueThresholdCents
  const timePressure = ctx.hoursToRtoDeadline < ctx.rtoDeadlineThresholdHours
  const systemicPattern = ctx.recentCarrierLaneExceptionCount >= 3
  const highValueLossOrDamage = (type === 'damaged_in_transit' || type === 'lost_in_transit') && highValue

  // §3 Level 4 — high value AND time pressure, a systemic carrier pattern,
  // or a high-value damaged/lost case (money exposure alone is enough here,
  // unlike the general rule, since there's no "wait it out" option).
  if ((highValue && timePressure) || systemicPattern || highValueLossOrDamage) return 4

  // §3 Level 3 — time pressure alone, no customer response yet
  if (timePressure) return 3

  // §3 Level 2 — above-average order value or repeat exception for this customer
  if (ctx.orderValueCents > ctx.merchantAvgOrderValueCents || ctx.isRepeatExceptionForCustomer) return 2

  // §3 Level 1 — standard case
  return 1
}

export function classify(
  event: TrackingEvent,
  ctx: OrderContext,
): ClassificationResult {
  const type = classifyWithHistory(event, ctx.sameAddressFailedAttemptCount, ctx.isPoBoxAddress)
  const severity = classifySeverity(type, ctx)
  return { type, severity }
}
