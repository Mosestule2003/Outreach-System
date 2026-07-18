// Mirrors the `exceptions.type` check constraint in
// supabase/migrations/0001_init_schema.sql + 0003_exception_types_expand.sql
// and docs/03-EXCEPTIONS-TAXONOMY.md (§1.6-1.8 added 2026-07-15).

export type ExceptionType =
  | 'address_issue'
  | 'failed_attempt'
  | 'access_issue'
  | 'carrier_delay'
  | 'customs_hold'
  | 'damaged_in_transit'
  | 'lost_in_transit'
  | 'delivered_not_received'
  | 'delivery_refused'
  | 'webhook_processing_failure'
  | 'write_back_failure'
  | 'no_response'
  | 'rto_in_progress'
  | 'rto_completed'

export type Severity = 1 | 2 | 3 | 4 | 5

export interface TrackingEvent {
  carrier: 'canada_post' | 'intelcom' | 'ups_canada' | string
  statusCode: string
  statusDescription?: string
  occurredAt: string
}

export interface OrderContext {
  orderValueCents: number
  merchantAvgOrderValueCents: number
  hoursToRtoDeadline: number
  rtoDeadlineThresholdHours: number
  highValueThresholdCents: number
  isRepeatExceptionForCustomer: boolean
  sameAddressFailedAttemptCount: number
  recentCarrierLaneExceptionCount: number
  /** True if the shipping address is a PO Box — carrier-specific whether
   * this is even an exception, see lib/carriers/policies.ts. */
  isPoBoxAddress: boolean
}

export interface ClassificationResult {
  type: ExceptionType
  severity: Severity
}
