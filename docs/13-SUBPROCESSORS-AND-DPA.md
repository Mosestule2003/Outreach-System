# Rezlv — Subprocessors & Data Processing

Not legal advice — this is the build-time source of truth for what third
parties touch merchant/customer data, feeding the eventual Privacy Policy
and any merchant-requested Data Processing Agreement (DPA). Real legal
review required before this is used as an actual customer-facing document
(`02-GUARDRAILS.md` §6).

## 1. Subprocessor List

| Subprocessor | Purpose | Data it sees | Region |
|---|---|---|---|
| **Vercel** | Application hosting | All application data in transit/at rest during processing | US (confirm exact data-residency region during setup) |
| **Supabase** | Database, Auth, Storage | All persisted data: merchant records, order/customer PII, exception records, agent action logs | Confirm project region at setup — pick Canada/nearest region if available, given Canadian carrier/merchant focus (`15-FRONTEND-SPEC.md` §3) |
| **Stripe** | Rezlv's own SaaS billing (merchant payment) | Merchant billing/payment info — never raw card data (tokenized by Stripe) | Global, SOC2/PCI compliant |
| **Twilio** | SMS to end customers | End-customer phone numbers, SMS content (`14-CONTENT-TEMPLATES.md`) | Confirm region |
| **Resend** | Transactional email | Merchant + end-customer email addresses, email content | Confirm region |
| **EasyPost** | Carrier tracking + BYOD/BYOCA carrier connection | Order/shipment data, tracking numbers, carrier credentials (BYOD, merchant-authorized) | US-based company, handles Canadian carrier data (Canada Post/Intelcom/UPS Canada) |
| **Google Maps API** | Address validation | Customer shipping addresses submitted via portal | Google, global |
| **Sentry** | Error tracking | Error context — must be scrubbed of raw PII where possible (attach `merchant_id`/`exception_id`, not raw customer name/address, per `01-SRS.md` §7) |
| **AI voice agent provider** (not yet selected — `08-ENVIRONMENT-SETUP.md` open item) | Escalation-ladder voice calls | Customer phone number, call audio/transcript | TBD — must be added here once selected, not after |
| **Shopify** | Not a subprocessor in the traditional sense — merchant's own platform, source of order data | Order/customer data originates here | Merchant's own Shopify plan/region |

## 2. What Data Flows Where (summary, full detail in `01-SRS.md` §2)

- **PII collected:** customer name, email, phone, shipping address
  (`orders` table), communication content (`notifications` table).
- **PII shared with subprocessors:** phone/SMS content → Twilio; email →
  Resend; address → Google Maps (validation only, not stored by Google
  beyond their own standard API usage); shipment/tracking data → EasyPost;
  voice call audio → the eventual voice provider.
- **PII never leaves Rezlv's infrastructure for:** Stripe billing (that's
  merchant billing data, not end-customer PII, separate concern).

## 3. Data Processing Roles

- **Rezlv is a data processor** for merchant/end-customer data — the
  merchant is the data controller (they collected the customer's info via
  their own Shopify store; Rezlv processes it on their behalf to resolve
  delivery exceptions). This framing should be explicit in the eventual
  DPA — get it verified against real legal counsel before any DPA is sent
  to a merchant, this doc doesn't substitute for that (`02-GUARDRAILS.md`
  §6).

## 4. Merchant-Facing DPA (not yet drafted)

A merchant may request a signed DPA before connecting their Shopify store
(standard B2B SaaS due diligence, especially for larger/more compliance-
conscious brands). **Not built for MVP** unless a specific merchant asks —
when needed, base it on this doc's subprocessor list + `02-GUARDRAILS.md`
§3 (PII classification) + real legal drafting, not a template pulled from
elsewhere without review.

## 5. Privacy Policy Requirements (feeds `02-GUARDRAILS.md` §6)

The public Privacy Policy (launch blocker per Guardrails §6) must disclose,
at minimum:

- What's collected (§2 above)
- The subprocessor list (§1 above, in plain language)
- Retention periods (`01-SRS.md` §10)
- Right to access/deletion mechanism (`02-GUARDRAILS.md` §3 —
  `delete_customer_pii()` function)
- Contact for privacy inquiries

## 6. Updating This Doc

**Every new third-party service added to Rezlv's stack must be added here
in the same change that integrates it** — this is a guardrail-adjacent
hygiene rule, not optional cleanup. A subprocessor not listed here is a
subprocessor the Privacy Policy is silently wrong about.
