export type ExceptionStatus = 'sms_sent' | 'customer_responded' | 'sent_to_carrier' | 'resolved' | 'escalated'
export type ExceptionType = 'address_issue' | 'failed_attempt' | 'access_issue' | 'carrier_delay' | 'customs_hold'

export interface TimelineEvent {
  label: string
  detail: string
  timestamp: string
}

export interface ExceptionCase {
  id: string
  orderNumber: string
  customer: string
  customerInitials: string
  carrier: 'UPS' | 'USPS'
  type: ExceptionType
  status: ExceptionStatus
  address: string
  correctedAddress?: string
  detectedAt: string
  resolvedAt?: string
  timeline: TimelineEvent[]
}

export const TYPE_LABEL: Record<ExceptionType, string> = {
  address_issue: 'Address issue',
  failed_attempt: 'Failed attempt',
  access_issue: 'Access issue',
  carrier_delay: 'Carrier delay',
  customs_hold: 'Customs hold',
}

export const STATUS_LABEL: Record<ExceptionStatus, string> = {
  sms_sent: 'SMS sent',
  customer_responded: 'Customer responded',
  sent_to_carrier: 'Sent to carrier',
  resolved: 'Resolved',
  escalated: 'Needs you',
}

export const STATUS_TONE: Record<ExceptionStatus, 'amber' | 'blue' | 'green' | 'red'> = {
  sms_sent: 'amber',
  customer_responded: 'blue',
  sent_to_carrier: 'blue',
  resolved: 'green',
  escalated: 'red',
}

export const EXCEPTIONS: ExceptionCase[] = [
  {
    id: '10482',
    orderNumber: '#10482',
    customer: 'M. Okafor',
    customerInitials: 'MO',
    carrier: 'UPS',
    type: 'address_issue',
    status: 'resolved',
    address: '128 Maple St, Apt 4',
    correctedAddress: '128 Maple St, Apt 4B',
    detectedAt: '2026-07-08T09:14:00Z',
    resolvedAt: '2026-07-08T10:02:00Z',
    timeline: [
      { label: 'Exception detected', detail: 'UPS marked delivery attempted — address_issue', timestamp: '9:14 AM' },
      { label: 'SMS sent to customer', detail: 'Portal link sent to +1 (416) •••-0192', timestamp: '9:15 AM' },
      { label: 'Address correction received', detail: 'Apt number added: 4 → 4B', timestamp: '9:41 AM' },
      { label: 'Sent to UPS for redelivery', detail: 'Delivery Intercept API confirmed', timestamp: '9:42 AM' },
      { label: 'Resolved', detail: 'Package redelivered successfully', timestamp: '10:02 AM' },
    ],
  },
  {
    id: '10481',
    orderNumber: '#10481',
    customer: 'J. Whitfield',
    customerInitials: 'JW',
    carrier: 'USPS',
    type: 'failed_attempt',
    status: 'customer_responded',
    address: '45 Birchwood Ave',
    detectedAt: '2026-07-08T11:02:00Z',
    timeline: [
      { label: 'Exception detected', detail: 'USPS marked delivery attempted — failed_attempt', timestamp: '11:02 AM' },
      { label: 'SMS sent to customer', detail: 'Portal link sent to +1 (647) •••-8834', timestamp: '11:03 AM' },
      { label: 'Customer responded', detail: 'Requested redelivery for tomorrow', timestamp: '11:47 AM' },
    ],
  },
  {
    id: '10480',
    orderNumber: '#10480',
    customer: 'R. Delgado',
    customerInitials: 'RD',
    carrier: 'UPS',
    type: 'access_issue',
    status: 'sms_sent',
    address: '900 Harbor Blvd, Unit 12',
    detectedAt: '2026-07-08T12:20:00Z',
    timeline: [
      { label: 'Exception detected', detail: 'UPS marked delivery attempted — access_issue', timestamp: '12:20 PM' },
      { label: 'SMS sent to customer', detail: 'Portal link sent to +1 (778) •••-4471', timestamp: '12:21 PM' },
    ],
  },
  {
    id: '10479',
    orderNumber: '#10479',
    customer: 'S. Yoon',
    customerInitials: 'SY',
    carrier: 'USPS',
    type: 'address_issue',
    status: 'resolved',
    address: '221 Pine Cres',
    correctedAddress: '221B Pine Cres',
    detectedAt: '2026-07-07T15:10:00Z',
    resolvedAt: '2026-07-07T15:58:00Z',
    timeline: [
      { label: 'Exception detected', detail: 'USPS marked delivery attempted — address_issue', timestamp: '3:10 PM' },
      { label: 'SMS sent to customer', detail: 'Portal link sent to +1 (250) •••-2201', timestamp: '3:11 PM' },
      { label: 'Address correction received', detail: 'Unit letter added: 221 → 221B', timestamp: '3:40 PM' },
      { label: 'Sent to USPS for redelivery', detail: 'Address correction API confirmed', timestamp: '3:41 PM' },
      { label: 'Resolved', detail: 'Package redelivered successfully', timestamp: '3:58 PM' },
    ],
  },
  {
    id: '10478',
    orderNumber: '#10478',
    customer: 'A. Petrov',
    customerInitials: 'AP',
    carrier: 'UPS',
    type: 'failed_attempt',
    status: 'escalated',
    address: '77 Kestrel Way',
    detectedAt: '2026-07-07T08:00:00Z',
    timeline: [
      { label: 'Exception detected', detail: 'UPS marked delivery attempted — failed_attempt', timestamp: '8:00 AM' },
      { label: 'SMS sent to customer', detail: 'Portal link sent to +1 (604) •••-9012', timestamp: '8:01 AM' },
      { label: 'No response after 24h', detail: 'Customer response window expired', timestamp: 'Yesterday, 8:01 AM' },
    ],
  },
  {
    id: '10477',
    orderNumber: '#10477',
    customer: 'K. Nakamura',
    customerInitials: 'KN',
    carrier: 'USPS',
    type: 'carrier_delay',
    status: 'sent_to_carrier',
    address: '14 Alder Ct',
    detectedAt: '2026-07-08T07:30:00Z',
    timeline: [
      { label: 'Exception detected', detail: 'USPS scan shows carrier_delay, in-transit stall', timestamp: '7:30 AM' },
      { label: 'Escalated to carrier', detail: 'Automated trace request filed with USPS', timestamp: '7:32 AM' },
    ],
  },
]

export function getExceptionById(id: string) {
  return EXCEPTIONS.find((e) => e.id === id)
}

export const DASHBOARD_STATS = {
  resolutionRate: '71.4%',
  resolutionRateDelta: '+8.2pts vs last month',
  rtoSaved: '$8,240',
  rtoSavedSub: '212 orders saved',
  avgResolveTime: '47 min',
  avgResolveTimeSub: '-1.6 hrs vs manual',
}

export const RESOLUTION_HISTORY = [
  { month: 'Jan', pct: 38 },
  { month: 'Feb', pct: 47 },
  { month: 'Mar', pct: 52 },
  { month: 'Apr', pct: 61 },
  { month: 'May', pct: 68 },
  { month: 'Jun', pct: 74 },
  { month: 'Jul', pct: 79 },
]
