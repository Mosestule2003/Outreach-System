# Rezlv — Delivery Exception Taxonomy

Governs `01-SRS.md` §2.2 `exceptions.type`, the NDR Classifier
(Product Roadmap Sprint 1, P0-CORE), and which `14-CONTENT-TEMPLATES.md`
template + autonomy tier (`02-GUARDRAILS.md` §2) applies per type.

Primary categories §1.1-1.5 are **Confirmed** from Content Tracker's NDR
classifier spec — the original five top-level buckets. §1.6-1.8
(`damaged_in_transit`, `lost_or_stolen`, `delivery_refused`) were **added
2026-07-15** after extensive research (carrier/industry sources plus
EasyPost's own `tracker.status_detail` API schema, which has explicit
`damaged`/`lost`/`refused` values none of the original 5 buckets cover)
surfaced them as common, real exception types with no home in the
original taxonomy — Moses reviewed and approved expanding MVP scope to
include them (`05-LIVE-BUILD-LOG.md` 2026-07-15 entry). Sub-types below
each category are Rezlv's research-informed breakdown (industry-standard
NDR/exception patterns, adapted from general freight/parcel exception
handling to Rezlv's Shopify-DTC-parcel context) — not yet Confirmed in
Rezlv's own docs, flag any correction needed once real exception data
starts flowing.

**Carrier scope correction (2026-07-15, expanded same day):** Rezlv is
**Canadian carriers only for MVP, via BYOD/BYOCA** — 7 carriers: Canada
Post, UPS Canada, Intelcom, Purolator, Canpar Express, Loomis Express,
FedEx Canada. Originally scoped to just the first 3; expanded per Moses's
direction to any carrier feasible for Rezlv, restricted to Canada. USPS/
US-domestic write-back examples below are illustrative NDR terminology
only, not scope — see `16-CARRIER-POLICIES.md` for full per-carrier
detail and `15-FRONTEND-SPEC.md` §3 for the onboarding/GTM implication.

## 1. Primary Categories (Confirmed — NDR Classifier output)

### 1.1 `address_issue`

Delivery failed or is at risk because the address is wrong, incomplete, or
unrecognized by the carrier.

- **Sub-types:** incomplete address (missing unit/apt), unrecognized/
  invalid address, address doesn't match geocode, PO Box restriction,
  apartment/gate code missing.
  **PO Box is carrier-specific, not universal (`16-CARRIER-POLICIES.md`
  §4):** Canada Post delivers to PO Boxes fine — it's only an
  `address_issue` when the assigned carrier is Intelcom or UPS Canada
  (neither has postal-network access). The classifier must check the
  shipment's actual carrier before flagging a PO Box as an exception, and
  the resolution message differs too: for non-Canada-Post carriers the
  fix isn't "correct your address" (it may already be valid) — it's
  "this carrier can't deliver to PO Boxes" (provide a street address, or
  the merchant reroutes via Canada Post).
- **Detection:** carrier NDR code indicating address problem (e.g. UPS
  "Invalid address," USPS "Insufficient Address"); can also be pre-empted
  at order-time if Rezlv validates address against Google Maps API before
  first carrier scan (future/Phase 2 proactive-prediction capability per
  roadmap V2 — MVP is reactive, post-scan detection only).
  {{v2 note}}
- **Resolution path:** customer submits corrected address via portal
  (address-correction form, validated against Google Maps API at
  submission) → agent assembles a ready-to-submit correction packet for
  the merchant.
  **Correction 2026-07-15 (`16-CARRIER-POLICIES.md` §5):** this is NOT a
  system-to-system write-back through EasyPost — exhaustive research
  confirmed none of Canada Post/Intelcom/UPS Canada expose a
  redirect/correction API (Canada Post's own redirection tool is
  explicitly portal-only, "customer service agents are not able to
  redirect a package on your companies' behalf"; UPS Delivery Intercept
  is US/Puerto-Rico-only; Intelcom's full API suite has no correction
  endpoint). The real mechanism: the merchant receives the validated
  correction in their dashboard and submits it themselves via their own
  carrier portal login — a one-click confirm, not a multi-step manual
  support ticket, but not zero-touch either. Moses confirmed this
  merchant-assisted-submission model 2026-07-15.
- **Autonomy tier (Guardrails §2):** Tier 2 — the agent is still making a
  commitment on the merchant's behalf (assembling and presenting the
  correction as ready-to-submit) that a human must actually execute. The
  core differentiator per Content Tracker — *"the customer submits the
  exact correction themselves, and that input... is what gets written to
  the carrier"* — now reads as "gets handed to the merchant ready to
  write," not fully automated end-to-end. Not Tier 1, because it commits
  the merchant to a redelivery attempt; not Tier 3, because no money
  moves and the input source (customer's own submission) is the trust
  anchor, not the agent's judgment.

### 1.2 `failed_attempt`

Carrier attempted delivery but could not complete it (no one available,
access issue not otherwise classified, driver couldn't locate exact drop
point).

- **Sub-types:** no one available to receive (signature-required
  shipment), business closed at delivery time, driver unable to access
  property (see `access_issue` below for the gated/security subset — some
  carrier NDR codes conflate these, classifier should route to whichever
  is more specific when the carrier code disambiguates).
- **Detection:** carrier NDR/status code for failed delivery attempt
  (e.g. UPS "1st attempt," FedEx "delivery exception - recipient not
  available").
- **Resolution path:** SMS asks customer to choose: reschedule attempt,
  redirect to a pickup location (if carrier supports, e.g. UPS Access
  Point), or authorize release without signature (where legally/carrier-
  policy permitted).
- **Autonomy tier:** Tier 2 (customer choice drives the action, written
  back automatically).

### 1.3 `access_issue`

Carrier physically cannot reach the delivery point — gated community,
locked mailroom, security checkpoint, incorrect gate code.

- **Sub-types:** gate code needed, locked building/mailroom, security
  desk required, construction/access blocked.
- **Detection:** carrier NDR code specific to access (where carriers
  distinguish it from generic failed attempt) or repeated `failed_attempt`
  at the same address pattern (2+ attempts with no address_issue flagged
  suggests access, not address, is the real problem — classifier logic
  should account for this pattern, not just single-event classification).
- **Resolution path:** customer submits access instructions (gate code,
  alternate contact) via portal → this is carrier-dependent whether it can
  be written back programmatically (UPS/USPS write-back API support for
  delivery instructions varies — verify actual API capability during
  Sprint 3 build, don't assume parity with address correction).
- **Autonomy tier:** Tier 2 if write-back API confirmed to support
  instructions; otherwise Tier 1 (agent relays instructions to a manual/
  semi-automated carrier contact channel) — classify conservatively until
  the actual API capability is confirmed in code.

### 1.4 `carrier_delay`

Shipment is behind schedule for reasons not tied to the delivery address
itself — carrier network delay, weather, mechanical, capacity/no driver,
customs processing (see `customs_hold` for the specific customs case).

- **Sub-types:** weather delay, carrier network/capacity delay, mechanical/
  equipment issue, misrouted/missorted at a carrier facility.
- **Detection:** tracking event shows delay without a specific actionable
  NDR reason attached, or carrier's own delay/exception status code.
- **Resolution path:** in most cases **no customer action is needed** —
  this is a notify-only exception (proactive SMS: "your order is delayed,
  new estimated delivery is X") rather than a resolve-via-portal exception.
  Only escalates to a resolution-required exception if the delay risks
  a broader RTO/refund window.
- **Autonomy tier:** Tier 1 (notification only, no commitment made) for
  the standard case; escalates to Tier 2/3 territory only if the delay
  triggers a merchant's own SLA-driven refund/credit policy (see
  `04-PAYMENT-LOGIC.md`).

### 1.5 `customs_hold`

Cross-border shipment held at customs — relevant given Rezlv's ~30% Canada
GTM mix (Content Tracker GTM Strategy).

- **Sub-types:** documentation hold (missing/incorrect customs paperwork,
  fixable), duties/taxes unpaid (consignee action needed), compliance hold
  (restricted item, may be unfixable), random inspection (time-bound, no
  action possible, just wait).
- **Detection:** carrier customs-status tracking event.
- **Resolution path:** classify hold sub-type first — documentation
  errors on the *carrier's* portion vs. the *shipper's* commercial invoice
  require different fixes (this distinction matters, see Key Edge Cases
  below); duties-unpaid holds need customer action (pay duties) via
  portal, ideally with a direct link to the carrier's duty payment
  portal rather than Rezlv trying to process customs payments itself
  (out of scope — Rezlv is not a customs broker).
- **Autonomy tier:** Tier 1 (notify + redirect to carrier's own duty
  payment flow) for MVP — full customs resolution automation is complex
  and out of MVP scope per roadmap ("International carrier write-back...
  API complexity too high for MVP — Phase 2").

### 1.6 `damaged_in_transit`

**Added 2026-07-15 — research-driven addition, confirmed by EasyPost's own
`tracker.status_detail` enum (`damaged`), not just general industry
sources.** Package arrives visibly broken, crushed, or otherwise damaged.
Not one of the original 5 Confirmed categories from Content Tracker's NDR
spec — added after Moses reviewed the research gap and approved expanding
MVP scope to cover it (see `05-LIVE-BUILD-LOG.md` 2026-07-15 entry).

- **Sub-types:** damaged packaging with intact contents (lower severity,
  may not need action), damaged/destroyed contents (claim-worthy), tamper-
  evident damage (possible partial-theft, treat conservatively).
- **Detection:** EasyPost `tracker.status_detail: "damaged"`. Customer-
  reported damage (via portal or inbound SMS reply) is also a valid entry
  point even without a carrier status update — carriers don't always flag
  damage themselves.
- **Resolution path:** customer submits photo evidence via the portal
  (required, not optional — this is the single biggest documented cause of
  denied carrier/insurance claims per research: "the carrier can argue
  improper packaging... your claim can be denied" without proof) → agent
  offers reship or refund per merchant policy (this is the customer's
  actual resolution, and it does NOT depend on whether a carrier claim is
  ever filed or succeeds) → if reship/refund exceeds merchant's Tier 3
  auto-approval cap, queues for human approval → separately, Rezlv
  assembles an evidence packet (photos, order value, tracking history) for
  the merchant to submit to the carrier if they choose to pursue
  reimbursement.
  **Correction 2026-07-15 (`16-CARRIER-POLICIES.md` §3):** this evidence
  packet is NOT filed automatically via EasyPost's Claims API — that API
  only covers USPS/FedEx, neither of which is in Rezlv's MVP carrier
  scope. For Canada Post/UPS Canada, only the merchant can file the actual
  claim (each carrier requires the shipper/sender to submit it); for
  Intelcom there is no carrier claim path at all (`16-CARRIER-POLICIES.md`
  §1.2 — Intelcom explicitly does not handle content-value claims).
  Rezlv's realistic MVP scope is evidence assembly + a ready-to-submit
  packet handed to the merchant, not automated claim filing.
- **Autonomy tier:** Tier 2 for a reship offer within policy; **Tier 3**
  (human-approval-gated by default, per Guardrails §2's conservative-
  default rule) for a refund/credit — money movement, never fully
  autonomous in MVP.

### 1.7 `lost_or_stolen`

**Added 2026-07-15**, same basis as §1.6. Splits into two sub-cases that
need genuinely different evidence and handling — do not treat as one
undifferentiated bucket in the classifier or the portal UX.

- **Sub-type A — `lost_in_transit`:** carrier scan activity simply stops;
  package never reaches "delivered." EasyPost `tracker.status_detail:
  "lost"`, or a tracker stuck in `in_transit`/`unknown` for longer than a
  merchant-configured threshold with no further scans (a time-based
  inference, not just a direct carrier flag — carriers under-report this
  status explicitly).
  - **Resolution:** notify customer honestly, offer reship or refund per
    merchant policy once past a reasonable "still might arrive" grace
    window (recommend 5-7 business days past last scan, confirm exact
    window with Moses/legal per data patterns once live).
  - **Autonomy tier:** Tier 2 (reship) / Tier 3 (refund), same split logic
    as damage above.
- **Sub-type B — `delivered_not_received`:** carrier confirms delivery
  (`status: "delivered"`) but the customer reports never receiving it —
  commonly porch piracy, but also the documented "friendly fraud" failure
  mode where a customer falsely claims non-receipt. **This is structurally
  different from every other exception type**: it's triggered by a
  customer report that *contradicts* the carrier's own status, not by a
  carrier exception code.
  - **Detection:** customer-initiated only (portal "I didn't receive
    this" report, or inbound SMS/email reply) against an order whose
    shipment status is `delivered`.
  - **Resolution path — requires a trust-signal check before any
    resolution offer**, per the documented industry pattern (a first-time
    claimant with a normal order history is very likely a legitimate
    theft; a customer with multiple prior non-receipt claims on
    high-ticket items is a fraud-review case, not an auto-resolve case).
    Trust signals to weigh (exact scoring model is a Stage 4 build
    decision, not finalized here): customer's prior claim count/history
    with this merchant, order value relative to merchant's average,
    whether this is a repeat address with prior claims.
  - **Autonomy tier:** **always Tier 3, human-approval-gated, with no
    merchant auto-approval override for this specific sub-type** — this
    is a deliberately stricter rule than the general Tier 2/3 auto-
    approval mechanism (Guardrails §2), because the fraud-signal model
    won't be mature enough at MVP to trust an autonomous refund decision
    here. Revisit once real claim-pattern data exists.

### 1.8 `delivery_refused`

**Added 2026-07-15**, same basis as §1.6. Recipient intentionally rejects
the package (wrong/unwanted item, suspected damage, changed their mind) —
distinct from `failed_attempt` (nobody available) because this is a
deliberate refusal that carriers report explicitly.

- **Sub-types:** refused — wrong/unexpected item, refused — appears
  damaged/tampered, refused — no reason given, refused — cannot pay COD
  (not applicable to Rezlv's Canadian BYOD scope, included for classifier
  completeness only).
- **Detection:** EasyPost `tracker.status_detail: "refused"`.
- **Resolution path:** notify merchant (this is very rarely a customer-
  fixable exception — it's already heading to RTO by the time it's
  detected) → merchant decides refund vs. restocking-fee vs. reship-after-
  correction (e.g. if refusal was actually a disguised address_issue).
  Not customer-portal-resolvable in the way address_issue is; this is
  primarily a merchant-dashboard-surfaced item.
- **Autonomy tier:** Tier 1 (notify only) by default; any refund/credit
  triggered by a refusal is Tier 3 per the same money-movement rule as
  everywhere else.

## 2. Cross-Cutting Exception Types (not in the 5 NDR buckets, but real)

These don't come from the carrier NDR classifier directly — they're
detected from Shopify/Stripe/Rezlv's own system state, not carrier
tracking events. Include them so `01-SRS.md`'s `exceptions.type` enum
isn't scoped only to carrier-originated events.

- **`webhook_processing_failure`** — Shopify/carrier webhook received but
  failed to process (malformed payload, downstream API error). Not
  customer-facing — this is an internal exception, routed to
  `01-SRS.md` §7 observability/alerting, not the SMS ladder.
- **`write_back_failure`** — carrier API write-back attempt failed after
  a customer submitted a correction (API timeout, rejected by carrier,
  invalid state transition). Customer already acted; the failure is on
  Rezlv's/carrier's side. Must notify the customer honestly ("we're
  still working on this") rather than silently leaving them unresolved —
  and must alert internally (this is exactly the kind of failure
  `10-DEPLOYMENT-RUNBOOK.md` needs a documented response for).
- **`no_response`** — customer didn't respond through the full 3-step
  ladder (SMS → email → voice call) before the carrier's RTO deadline.
  This is the case that hands off to the V1.1 Gorgias/Zendesk ticket
  creation ("fallback AFTER automation, not a replacement for it," per
  roadmap) — for MVP without that integration yet, this becomes a
  manually-surfaced item in the merchant dashboard's exception queue.
- **`rto_in_progress` / `rto_completed`** — the exception genuinely
  couldn't be resolved and the package is returning to origin. Tracked
  for the "RTOs prevented" OKR metric even when Rezlv *couldn't* prevent
  one — this is the denominator, not just the numerator.

## 3. Severity Classification (adapted from general logistics practice for Rezlv's context)

Unlike freight (where severity is mostly dollar-value-driven), Rezlv's
per-exception dollar exposure is usually small (a single DTC parcel, not
a truckload) — severity here should weight **customer/brand-relationship
risk** and **time-to-RTO-deadline** more heavily than raw order value:

| Level | Criteria |
|---|---|
| 1 — Low | Standard order value, ample time before RTO deadline, first exception for this customer |
| 2 — Moderate | Order value above merchant's average, or repeat exception for the same customer/order |
| 3 — Significant | Time-to-RTO-deadline under merchant-configured threshold (e.g. <24hrs) without customer response yet |
| 4 — Major | High order value (merchant-configured threshold) AND time pressure, or a pattern (3+ exceptions from the same carrier/lane in a short window — possible systemic carrier issue worth merchant awareness), or any `damaged_in_transit`/`lost_or_stolen` case above the merchant's high-value threshold |
| 5 — Critical | `write_back_failure` on a Tier 2+ action, any exception type touching a customs/compliance hold with legal implications, or any `delivered_not_received` claim (always routes to human review regardless of value — §1.7 sub-type B) |

This feeds `01-SRS.md` §2.2 `exceptions.severity` and the admin dashboard's
agent-action oversight view — Level 4-5 exceptions should be visually
distinct in both the merchant dashboard and the admin dashboard.

## 4. Key Edge Cases (adapted from general logistics practice — validate against real Rezlv exception data once live)

1. **Repeated `failed_attempt` that's actually `access_issue`:** the NDR
   classifier's rule-based logic (Sprint 1) should escalate classification
   after repeated same-address failed attempts rather than treating each
   as an independent low-severity notify-only event. **Correction
   2026-07-15:** the threshold is carrier-specific, not a flat "2
   attempts" — per `16-CARRIER-POLICIES.md` §1, UPS Canada allows up to 3
   attempts before RTO, Canada Post effectively gives 1 attempt + a
   15-day hold, and Intelcom's official attempt count is unconfirmed.
   Escalate at (carrier's max attempts − 1), not a single hardcoded
   number across all three carriers, and treat Intelcom's threshold as
   provisional until real tracking data confirms its actual behavior.
2. **Customs hold: shipper-error vs. carrier-error paperwork.** A
   documentation hold caused by Rezlv/merchant-side commercial invoice
   errors is fixable by the merchant; a hold from the carrier's own
   paperwork handling isn't something the customer or merchant can fix via
   Rezlv's portal — don't send the customer a self-serve form for a
   problem only the carrier can resolve; detect which case it is from the
   carrier's hold-reason code before choosing the template.
3. **`address_issue` correction that's still wrong:** the customer submits
   a "corrected" address that's itself invalid (typo, doesn't validate
   against Google Maps). Portal must catch this at submission time
   (Google Maps validation, `01-SRS.md` correction pending) — don't let an
   unvalidated address reach the carrier write-back API and produce a
   second failed attempt.
4. **BYOD/BYOCA carrier account not yet connected when an exception hits.**
   If a merchant's onboarding (`12-MERCHANT-ONBOARDING.md`) isn't complete
   (carrier account not connected through EasyPost BYOCA), an exception
   can be *detected* but not *resolved* via write-back. The system must
   degrade gracefully — notify the merchant "connect your carrier account
   to enable auto-resolution" rather than silently failing or, worse,
   telling the customer their fix was applied when it wasn't.
5. **Customer resolves via portal after the RTO deadline has already
   passed / package already returning.** The write-back attempt will
   fail (`write_back_failure`) — the resolution response to the customer
   needs honest framing ("your package is already on its way back — we're
   arranging a reship" or similar), not a false "fixed!" confirmation.
6. **`damaged_in_transit`/`lost_in_transit` claim submitted without photo/
   evidence.** Per research, the #1 documented cause of denied carrier/
   insurance claims is missing proof (photos, packaging condition). The
   portal must make evidence upload a required step before the claim is
   assembled, not an optional add-on — a claim filed without it is
   materially more likely to be rejected later, which is a worse customer
   experience than asking for a photo upfront.
7. **`delivered_not_received` on a customer with prior claims.** Never
   auto-resolve (§1.7 sub-type B is always Tier 3) — but additionally,
   flag the pattern itself (repeat claims across orders/addresses) to the
   merchant dashboard as a distinct signal, since this is exactly the
   friendly-fraud pattern the research identified, separate from the
   individual exception's own resolution.
8. **`delivery_refused` that's actually a disguised `address_issue`.**
   Some refusals happen because the recipient doesn't recognize the
   delivery (wrong address reached, unexpected item at a shared address) —
   check whether a refusal correlates with an address_issue signal on the
   same order before assuming it's a genuine "didn't want it" refusal.

## 5. Mapping to Content Templates

| Exception type | Primary template (see `14-CONTENT-TEMPLATES.md`) |
|---|---|
| `address_issue`, `failed_attempt`, `access_issue` | §1.1 Initial SMS notice → portal (address/instructions form) |
| `carrier_delay` (standard) | Notify-only variant of §1.1 (no portal action required — informational SMS) |
| `customs_hold` (duties unpaid) | §1.1 variant redirecting to carrier's duty payment portal |
| `no_response` (after full ladder) | Internal — surfaces in merchant dashboard exception queue, no further customer message |
| `write_back_failure` | Custom honest-failure message, not yet drafted in `14-CONTENT-TEMPLATES.md` — add before Sprint 3 ships |
| `damaged_in_transit`, `lost_or_stolen` (sub-type A) | New template needed — evidence-upload request + reship/refund choice; not yet drafted in `14-CONTENT-TEMPLATES.md`, add before Stage 4 ships this path |
| `lost_or_stolen` (sub-type B, `delivered_not_received`) | New template needed — non-receipt report intake, framed neutrally (no accusation language), routes to human review; not yet drafted |
| `delivery_refused` | New template needed — merchant-dashboard-only notification, no customer-facing message in the common case; not yet drafted |
