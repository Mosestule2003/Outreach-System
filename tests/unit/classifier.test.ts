import { describe, expect, it } from 'vitest'
import { classify, classifyEvent, classifyNonReceiptReport, classifySeverity, classifyWithHistory } from '@/lib/exceptions/classifier'
import type { OrderContext, TrackingEvent } from '@/lib/exceptions/types'

function event(statusCode: string, statusDescription = '', carrier = 'canada_post'): TrackingEvent {
  return { carrier, statusCode, statusDescription, occurredAt: '2026-07-15T00:00:00Z' }
}

const baseCtx: OrderContext = {
  orderValueCents: 5000,
  merchantAvgOrderValueCents: 5000,
  hoursToRtoDeadline: 72,
  rtoDeadlineThresholdHours: 24,
  highValueThresholdCents: 20000,
  isRepeatExceptionForCustomer: false,
  sameAddressFailedAttemptCount: 0,
  recentCarrierLaneExceptionCount: 0,
  isPoBoxAddress: false,
}

describe('classifyEvent — one test per primary NDR category (03-EXCEPTIONS-TAXONOMY.md §1)', () => {
  it('classifies address_issue', () => {
    expect(classifyEvent(event('INVALID_ADDRESS', 'Invalid address'))).toBe('address_issue')
  })

  it('classifies failed_attempt', () => {
    expect(classifyEvent(event('ATTEMPT_1', 'Delivery attempted, recipient not available'))).toBe('failed_attempt')
  })

  it('classifies access_issue', () => {
    expect(classifyEvent(event('ACCESS', 'Gate code required'))).toBe('access_issue')
  })

  it('classifies carrier_delay', () => {
    expect(classifyEvent(event('DELAY', 'Weather delay in transit'))).toBe('carrier_delay')
  })

  it('classifies customs_hold', () => {
    expect(classifyEvent(event('CUSTOMS', 'Held at customs, duties owing'))).toBe('customs_hold')
  })

  it('defaults unclassifiable codes to carrier_delay rather than guessing a resolution-required type', () => {
    expect(classifyEvent(event('XYZ_UNKNOWN', ''))).toBe('carrier_delay')
  })
})

describe('classifyEvent — 2026-07-15 research-driven additions (03-EXCEPTIONS-TAXONOMY.md §1.6-1.8)', () => {
  it('classifies damaged_in_transit from EasyPost status_detail "damaged"', () => {
    expect(classifyEvent(event('DAMAGED', 'Package damaged in transit'))).toBe('damaged_in_transit')
  })

  it('classifies lost_in_transit from EasyPost status_detail "lost"', () => {
    expect(classifyEvent(event('LOST', 'Package lost, cannot be located'))).toBe('lost_in_transit')
  })

  it('classifies delivery_refused from EasyPost status_detail "refused"', () => {
    expect(classifyEvent(event('REFUSED', 'Recipient refused the package'))).toBe('delivery_refused')
  })

  it('prioritizes damaged/refused/lost over a co-occurring delay-sounding description', () => {
    // "damaged" should win over "delay" if both appear — damage is the more
    // specific and actionable signal.
    expect(classifyEvent(event('DAMAGED_DELAY', 'Delayed due to reported damage'))).toBe('damaged_in_transit')
  })
})

describe('classifyNonReceiptReport — 03-EXCEPTIONS-TAXONOMY.md §1.7 sub-type A vs. B', () => {
  it('classifies as delivered_not_received when the carrier confirmed delivery', () => {
    expect(classifyNonReceiptReport(true)).toBe('delivered_not_received')
  })

  it('classifies as lost_in_transit when the carrier never confirmed delivery', () => {
    expect(classifyNonReceiptReport(false)).toBe('lost_in_transit')
  })
})

describe('classifyWithHistory — edge case #1: repeated failed_attempt escalates to access_issue', () => {
  it('treats a single failed_attempt as failed_attempt', () => {
    expect(classifyWithHistory(event('ATTEMPT_1', 'recipient not available'), 0)).toBe('failed_attempt')
  })

  it('escalates 2+ same-address failed_attempts to access_issue', () => {
    expect(classifyWithHistory(event('ATTEMPT_1', 'recipient not available'), 2)).toBe('access_issue')
  })

  it('does not escalate address_issue or customs_hold based on attempt count', () => {
    expect(classifyWithHistory(event('INVALID_ADDRESS', 'Invalid address'), 3)).toBe('address_issue')
  })
})

describe('classifyWithHistory — carrier-specific escalation thresholds (16-CARRIER-POLICIES.md §1, added 2026-07-15)', () => {
  it('Canada Post escalates at 1 attempt (single-attempt-then-hold carrier)', () => {
    expect(classifyWithHistory(event('ATTEMPT_1', 'recipient not available', 'canada_post'), 1)).toBe('access_issue')
  })

  it('UPS Canada does not escalate until 2 attempts (allows up to 3 before RTO)', () => {
    expect(classifyWithHistory(event('ATTEMPT_1', 'recipient not available', 'ups_canada'), 1)).toBe('failed_attempt')
    expect(classifyWithHistory(event('ATTEMPT_1', 'recipient not available', 'ups_canada'), 2)).toBe('access_issue')
  })

  it('falls back to the generic 2-attempt threshold for an unrecognized carrier', () => {
    expect(classifyWithHistory(event('ATTEMPT_1', 'recipient not available', 'some_other_carrier'), 1)).toBe('failed_attempt')
    expect(classifyWithHistory(event('ATTEMPT_1', 'recipient not available', 'some_other_carrier'), 2)).toBe('access_issue')
  })

  it('Purolator and Canpar escalate at 1 attempt (both single-attempt-then-hold carriers)', () => {
    expect(classifyWithHistory(event('ATTEMPT_1', 'recipient not available', 'purolator'), 1)).toBe('access_issue')
    expect(classifyWithHistory(event('ATTEMPT_1', 'recipient not available', 'canpar'), 1)).toBe('access_issue')
  })

  it('Loomis Express escalates at 1 attempt (2 max attempts)', () => {
    expect(classifyWithHistory(event('ATTEMPT_1', 'recipient not available', 'loomis_express'), 0)).toBe('failed_attempt')
    expect(classifyWithHistory(event('ATTEMPT_1', 'recipient not available', 'loomis_express'), 1)).toBe('access_issue')
  })

  it('FedEx Canada does not escalate until 2 attempts (modeled like UPS Canada, 3 max)', () => {
    expect(classifyWithHistory(event('ATTEMPT_1', 'recipient not available', 'fedex_canada'), 1)).toBe('failed_attempt')
    expect(classifyWithHistory(event('ATTEMPT_1', 'recipient not available', 'fedex_canada'), 2)).toBe('access_issue')
  })
})

describe('classifyEvent — carrier-specific PO Box handling (16-CARRIER-POLICIES.md §4, added 2026-07-15)', () => {
  it('does not flag a PO Box address as an exception for Canada Post', () => {
    expect(classifyEvent(event('IN_TRANSIT', '', 'canada_post'), true)).not.toBe('address_issue')
  })

  it('flags a PO Box address as address_issue for UPS Canada, which cannot deliver there', () => {
    expect(classifyEvent(event('IN_TRANSIT', '', 'ups_canada'), true)).toBe('address_issue')
  })

  it('flags a PO Box address as address_issue for Intelcom, which cannot deliver there', () => {
    expect(classifyEvent(event('IN_TRANSIT', '', 'intelcom'), true)).toBe('address_issue')
  })

  it('flags a PO Box address as address_issue for the 4 newly-added carriers', () => {
    expect(classifyEvent(event('IN_TRANSIT', '', 'purolator'), true)).toBe('address_issue')
    expect(classifyEvent(event('IN_TRANSIT', '', 'canpar'), true)).toBe('address_issue')
    expect(classifyEvent(event('IN_TRANSIT', '', 'loomis_express'), true)).toBe('address_issue')
    expect(classifyEvent(event('IN_TRANSIT', '', 'fedex_canada'), true)).toBe('address_issue')
  })
})

describe('classifySeverity — 03-EXCEPTIONS-TAXONOMY.md §3', () => {
  it('Level 1: standard case', () => {
    expect(classifySeverity('carrier_delay', baseCtx)).toBe(1)
  })

  it('Level 2: above-average order value', () => {
    expect(classifySeverity('carrier_delay', { ...baseCtx, orderValueCents: 6000 })).toBe(2)
  })

  it('Level 2: repeat exception for the same customer', () => {
    expect(classifySeverity('carrier_delay', { ...baseCtx, isRepeatExceptionForCustomer: true })).toBe(2)
  })

  it('Level 3: time pressure under the RTO threshold', () => {
    expect(classifySeverity('carrier_delay', { ...baseCtx, hoursToRtoDeadline: 12 })).toBe(3)
  })

  it('Level 4: high value AND time pressure', () => {
    expect(
      classifySeverity('carrier_delay', {
        ...baseCtx,
        orderValueCents: 25000,
        hoursToRtoDeadline: 12,
      }),
    ).toBe(4)
  })

  it('Level 4: systemic carrier/lane pattern regardless of value', () => {
    expect(classifySeverity('carrier_delay', { ...baseCtx, recentCarrierLaneExceptionCount: 3 })).toBe(4)
  })

  it('Level 5: write_back_failure is always critical', () => {
    expect(classifySeverity('write_back_failure', baseCtx)).toBe(5)
  })

  it('Level 5: customs_hold past the RTO deadline', () => {
    expect(classifySeverity('customs_hold', { ...baseCtx, hoursToRtoDeadline: 0 })).toBe(5)
  })

  it('Level 5: delivered_not_received is always critical regardless of order value', () => {
    expect(classifySeverity('delivered_not_received', { ...baseCtx, orderValueCents: 100 })).toBe(5)
  })

  it('Level 4: high-value damaged_in_transit even without time pressure', () => {
    expect(classifySeverity('damaged_in_transit', { ...baseCtx, orderValueCents: 25000 })).toBe(4)
  })

  it('Level 4: high-value lost_in_transit even without time pressure', () => {
    expect(classifySeverity('lost_in_transit', { ...baseCtx, orderValueCents: 25000 })).toBe(4)
  })

  it('standard-value damaged_in_transit falls through to the general rules (Level 1)', () => {
    expect(classifySeverity('damaged_in_transit', baseCtx)).toBe(1)
  })
})

describe('classify — combined type + severity', () => {
  it('produces address_issue at severity 1 for a standard case', () => {
    expect(classify(event('INVALID_ADDRESS', 'Invalid address'), baseCtx)).toEqual({ type: 'address_issue', severity: 1 })
  })
})
