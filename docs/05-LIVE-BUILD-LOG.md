# Rezlv — Live Build Log

Append-only. Never delete a prior entry — correct forward with a new one.
Format defined in `06-AGENT-COLLABORATION-PROTOCOL.md` §3. Newest entries
at the bottom.

---

## 2026-07-15 09:00 (agent: claude)
**Did:** Created the initial `docs/` scaffold — `00-INDEX.md`,
`02-GUARDRAILS.md`, `06-AGENT-COLLABORATION-PROTOCOL.md` (with Gemini
copy-paste block and credential audit).
**Why:** Moses requested a full build-governance doc set for Rezlv before
any code gets written, per his own explicit request for exhaustive
SRS/guardrails/exceptions/payment/live-log/collaboration docs.
**Docs touched:** 00, 02, 06 (created)
**Blocked on:** nothing yet at this point.
**Next:** environment setup doc, then SRS.

## 2026-07-15 09:30 (agent: claude)
**Did:** `08-ENVIRONMENT-SETUP.md` (every account/service needed, free-tier
notes), `11-GLOSSARY.md`, `01-SRS.md` (schema, API surface, security/OAuth,
admin dashboard spec, observability, agent-autonomy integration,
notifications, retention).
**Why:** continuing the initial doc build per Moses's request.
**Docs touched:** 08, 11, 01 (created)
**Blocked on:** every 🔴-marked service in 08 (Stripe, Twilio, Shopify
Partner, EasyPost, Resend, domain) needs Moses's identity/payment method.
**Next:** exceptions taxonomy, payment logic, content templates,
onboarding, subprocessors docs (Moses requested 3 more beyond the
original 6).

## 2026-07-15 10:15 (agent: claude)
**Did:** Audited Content Tracker (Sheet) in full — pulled Confirmed
positioning, NDR classifier categories, 3-layer architecture (Shopify
webhook → EasyPost → NDR classifier → JWT portal → SMS/email/voice
escalation ladder → carrier write-back), pricing hypothesis, GTM strategy.
Found and flagged a product-naming error (sheet said "Resolve," confirmed
with Moses it should be "Rezlv" — not yet fixed at this point).
**Why:** needed ground truth before writing exceptions taxonomy/payment
docs rather than inventing generic content.
**Docs touched:** 00 (corrections log added)
**Blocked on:** naming fix needed write access not yet found.
**Next:** build 14-CONTENT-TEMPLATES.md (moved earlier per Moses's
request, since taxonomy doc references its copy), then taxonomy.

## 2026-07-15 10:45 (agent: claude)
**Did:** `14-CONTENT-TEMPLATES.md` (SMS/email/voice/portal/admin-alert
copy library, grounded in the real 3-step escalation ladder).
**Docs touched:** 14 (created)
**Next:** exceptions taxonomy.

## 2026-07-15 11:00 (agent: claude)
**Did:** Found Rezlv's own dedicated Google service accounts
(`rezlv-product@`, `content-strategy@`, `rezlv-product-stage-log@`, all
under `life-project-500503` but Rezlv-scoped) at
`Rezlv Product/GTM Info/*.json`. Built
`Rezlv Product/GTM Info/rezlv-sheets/sheet.cjs` (read/write tool, mirrors
`life-os`'s pattern). Corrected the "Resolve"→"Rezlv" naming error at the
source (7 cells in Content Tracker's Company Overview tab). Corrected the
earlier wrong claim in `06-AGENT-COLLABORATION-PROTOCOL.md` that Rezlv had
zero dedicated credentials.
**Why:** Moses asked me to find the JSON files associated with these
service accounts and fix the naming error at the source, not just in
`docs/`.
**Docs touched:** 06 (corrected), 00 (corrected)
**Next:** `03-EXCEPTIONS-TAXONOMY.md`.

## 2026-07-15 11:20 (agent: claude)
**Did:** `03-EXCEPTIONS-TAXONOMY.md` — built on Confirmed NDR categories
(`address_issue/failed_attempt/access_issue/carrier_delay/customs_hold`)
plus researched sub-types, severity model, edge cases, content-template
mapping.
**Docs touched:** 03 (created)
**Next:** `04-PAYMENT-LOGIC.md`.

## 2026-07-15 11:45 (agent: claude)
**Did:** Pulled full Product Control Center roadmap (Sprint 1-4 breakdown)
and discovered a real pricing conflict: Product Control Center still
referenced flat $299/$599/$999 tiers, while Content Tracker's Business
Model tab and ROI & Pricing Calculator tab each had a *different* 4-tier
graduated rate card. Flagged all three to Moses rather than picking one
silently.
**Docs touched:** 00 (conflict logged)
**Blocked on:** pricing model conflict — needed Moses's call.
**Next:** await direction, keep building other docs in parallel.

## 2026-07-15 12:00 (agent: claude)
**Did:** Moses instructed: unify pricing into one simple model. Designed a
3-tier graduated rate card ($8.00/1-100, $5.00/101-500, $3.00/501+),
sanity-checked against the ROI calculator's own worked example (~17% of
value delivered, consistent with prior positioning). Wrote it to Content
Tracker (Business Model tab + ROI & Pricing Calculator tab, including
worked-example rows) and Product Control Center (Product Roadmap row 17,
removing the stale flat-tier reference). Logged the decision in Product
Control Center's Decision Log tab. Wrote `04-PAYMENT-LOGIC.md` around the
unified model, including the merchant-side refund/credit logic (Tier 3
gating, idempotency, chargeback boundary).
**Why:** Moses's direct instruction to simplify to one model.
**Docs touched:** 04 (created), 00 (resolved), Content Tracker (2 tabs),
Product Control Center (roadmap + Decision Log)
**Next:** frontend research — Moses pointed at the Product Stage Log doc
for frontend requirements.

## 2026-07-15 12:30 (agent: claude)
**Did:** Pulled Content Tracker's "UX Screen Inventory" (39 screens,
Phase 4, 2026-07-07/08) and "UX Component Inventory" tabs — far more
current and detailed than the original Product Stage Log doc for frontend
purposes. Found existing design system (shadcn `base-nova`, already
configured), existing brand/logo components in the repo, 4 existing Lucid
diagrams. Wrote `15-FRONTEND-SPEC.md`. Flagged two new conflicts: carrier
scope (Canada Post/Intelcom/UPS Canada per UX data vs. UPS+USPS per older
docs) and a possible "Family 4" naming gap in the exception taxonomy.
**Docs touched:** 15 (created)
**Blocked on:** carrier scope conflict — needed Moses's call.
**Next:** await direction.

## 2026-07-15 12:45 (agent: claude)
**Did:** Moses confirmed: Canadian carriers only for MVP (Canada Post →
Intelcom → UPS Canada), via BYOD, no USPS. Discovered Content Tracker's
GTM Strategy tab was *already* aligned with this (Canada-only, BC pilot
region) — only Company Overview and derived build docs were stale.
Corrected Company Overview (Layer 3 architecture row), `03-EXCEPTIONS-
TAXONOMY.md`, `08-ENVIRONMENT-SETUP.md`, `15-FRONTEND-SPEC.md` §3. Logged
the decision in Product Control Center's Decision Log.
**Docs touched:** 03, 08, 15, 00 (all corrected), Content Tracker
(Company Overview), Product Control Center (Decision Log)
**Next:** the 4 remaining docs (testing, deployment, onboarding,
subprocessors), then build the `rezlv-build` skill.

## 2026-07-15 13:15 (agent: claude)
**Did:** `09-TESTING-STRATEGY.md`, `10-DEPLOYMENT-RUNBOOK.md`,
`12-MERCHANT-ONBOARDING.md`, `13-SUBPROCESSORS-AND-DPA.md`.
**Why:** Moses confirmed (via AskUserQuestion) these should be written now
rather than generated later by the build skill itself, and that the build
skill should be produced this session but not yet invoked to write actual
app code.
**Docs touched:** 09, 10, 12, 13 (created) — all 16 planning docs now
complete.
**Next:** build the `rezlv-build` parent skill + sub-skills
(`.claude/skills/` in this repo), including a `rezlv-frontend` and
`rezlv-portal` sub-skill not previously listed in `06`'s sub-skill table
(gap found — frontend wasn't represented as its own sub-skill before).

## 2026-07-15 13:30 (agent: claude)
**Did:** `07-ARCHITECTURE.md` (system flow diagram + index of the 4
existing Lucid diagrams + noted gaps to generate later, not preemptively).
Updated `06-AGENT-COLLABORATION-PROTOCOL.md`'s sub-skill table to add
`rezlv-frontend` and `rezlv-portal` (previously missing — frontend wasn't
represented as its own sub-skill). Built the actual skill files:
`.claude/skills/rezlv-build/SKILL.md` (parent orchestrator, stage map,
Stage 0 setup logic, go/no-go gate, "when unclear" protocol) and 7
sub-skills — `rezlv-schema`, `rezlv-frontend`, `rezlv-portal`,
`rezlv-exceptions-engine`, `rezlv-admin-dashboard`, `rezlv-payments`,
`rezlv-testing` — each scoped to read only its relevant docs, with
explicit hard constraints pulled from those docs and explicit
"when unclear, ask Moses" guidance per sub-skill.
**Why:** Moses confirmed (AskUserQuestion): write the 4 missing docs
first, build the skill this session but don't invoke it to write app code
yet, either agent picks up any stage (no frontend/backend split by agent).
**Docs touched:** 07 (created), 06 (sub-skill table updated), 00 (status
table finalized — all 16 docs Done)
**Blocked on:** all 🔴 items in `08-ENVIRONMENT-SETUP.md` still need
Moses (Stripe, Twilio, Shopify Partner, EasyPost, Resend, domain/business
email) before Stage 0 can fully clear. AI voice provider still unselected.
BYOCA per-carrier auth mechanism (OAuth vs API-key) for Canada Post/
Intelcom/UPS Canada unconfirmed until real EasyPost sandbox testing.
`AdminOverrideDialog` reason-field required/optional still open.
**Next:** `rezlv-build` is ready to invoke. Whoever (Claude or Gemini)
starts Stage 0 first should consolidate the 🔴 account-creation asks to
Moses in one pass rather than trickling them out.

## 2026-07-15 14:00 (agent: claude)
**Did:** Moses provided `Important Credentials.txt` with Supabase,
Twilio, Shopify, Sentry, Stripe (test mode), and Resend credentials.
Found and flagged a conflict before writing anything: the credentials
file pointed at a different Supabase project (`vrkwlabyhnqpjpbahvrn`)
than the one already wired in `.env.local` (`hjfjabpxrhjsdcegoaqb`).
Checked via the Supabase MCP tool and confirmed `hjfjabpxrhjsdcegoaqb` is
actually the unrelated **"Outreach_Engine"** project (not Rezlv-scoped at
all) — Moses confirmed switching to the new project is correct. Also
confirmed the DB password should be read literally (`Rezlv_2025$`,
brackets/space were just how it was written down, not part of the
password). Updated `.env.local` with all provided credentials, created
`.env.example` (var names only, no values, per Guardrails §4/§9).
**Why:** Moses said Stage 0 signups (except EasyPost) are done and asked
me to verify/wire credentials and update docs accordingly.
**Docs touched:** 08 (status table updated: Supabase, Stripe, Twilio,
Shopify, Sentry, Resend moved from 🔴 to 🟢/🟡 with specific remaining
gaps noted — Supabase service role key, Twilio number/Messaging Service
SID, Shopify webhook secret + dev store, Stripe webhook secret all still
outstanding even though base keys are in).
**Blocked on:** EasyPost is the sole remaining 🔴 item and is now the
critical-path blocker for Stage 4 (`rezlv-exceptions-engine`). Moses said
to ask when a stage actually reaches the point of needing EasyPost
credentials.

## 2026-07-15 14:15 (agent: claude)
**Did:** Moses shared external research (a digested breakdown of
EasyPost's Parent/Child multi-tenant account model for BYOCA) and asked
me to fold it into the docs. Rewrote `08-ENVIRONMENT-SETUP.md` §5 with a
new §5a covering: Parent User (Rezlv platform account) auto-provisioning
a Child User per merchant via `POST /users`, BYOD credential injection
flow (merchant never logs into EasyPost directly), carrier auto-detection
(omit `carrier` field, EasyPost infers from tracking-code format), the
exception-detection webhook flow (Shopify `fulfillments/create` →
standalone `POST /trackers` with the merchant's Child key → EasyPost's
`tracker.updated` webhook with `status: exception/failure` and
`previous_attributes`), and the Supabase `merchant_logistics`
mapping-table requirement (Shopify store ID ↔ Child API key, RLS-gated
per Guardrails §3/§4). **Corrected a pricing error** that was in the doc
since 2026-07-15 11:20 — BYOCA is a flat **$20/mo** platform fee (not
$0.08/label as previously written), plus **$0.02/standalone tracker**,
billed to the Parent account for every merchant's usage combined — this
must be priced into the $8/$5/$3 per-case model, not treated as a
merchant pass-through.
**Why:** keep the environment doc accurate before Stage 4 needs to
actually build against EasyPost, and correct a real cost-model error
before it propagated into `04-PAYMENT-LOGIC.md` assumptions.
**Docs touched:** 08 (§5, §5a added, §11 setup-order updated to reflect
current status)
**Note:** Moses reiterated the MVP should ship **only the single most
critical core feature** — flagging this as a standing scope-discipline
reminder for every subsequent stage's sub-skill (don't gold-plate; if a
capability from research isn't required for the one core resolution flow,
defer it past MVP rather than building it now).
**Blocked on:** EasyPost signup still outstanding (only remaining 🔴).
**Next:** Stage 1 (`rezlv-schema`) can now proceed for everything not
dependent on EasyPost/Shopify dev store specifics (core schema, RLS, NDR
classifier); Shopify webhook ingestion and the `merchant_logistics` table
should be scaffolded but will need the real dev store + EasyPost account
to test end-to-end.

## 2026-07-15 15:00 (agent: claude)
**Did:** Moses provided the Supabase secret key (`sb_secret_...`, the
new-format service-role-equivalent key) for the `vrkwlabyhnqpjpbahvrn`
project — added as `SUPABASE_SERVICE_ROLE_KEY`. Ran Stage 1
(`rezlv-schema`):
- `supabase/migrations/0001_init_schema.sql` — all 11 tables from SRS §2.2
  (`merchants`, `merchant_users`, `admin_users`, `orders`, `shipments`,
  `exceptions`, `agent_actions`, `portal_sessions`, `notifications`,
  `billing_events`, `audit_log`), UUID PKs, `updated_at` triggers,
  `merchant_id` + `(merchant_id, status)` indexes per §2.4.
- `supabase/migrations/0002_rls.sql` — RLS enabled on every table;
  merchant-scoped tables get a `current_merchant_id()`-based isolation
  policy; `agent_actions`/`audit_log`/`billing_events` get select-only
  policies (no update/delete policy = append-only enforcement, not just a
  convention); `portal_sessions`/`admin_users` get zero policies (no
  merchant-session access at all, service-role-only by design).
- Applied both migrations directly to the live project via a one-time
  `pg` script over the direct Postgres connection string, since this
  Supabase project isn't under the connected Supabase MCP tool's linked
  account (`apply_migration` wasn't usable here) — script deleted after
  use, `pg` was a `--no-save` dev install, not added to `package.json`.
- `lib/exceptions/classifier.ts` + `types.ts` — rule-based NDR classifier
  (Sprint 1 scope, per Product Roadmap "rule-based first, ML Phase 2"),
  substring-matched carrier status codes into the 5 primary categories
  (`03-EXCEPTIONS-TAXONOMY.md` §1), severity model (§3), and the
  repeated-`failed_attempt`→`access_issue` escalation (§4 edge case #1).
  Exact per-carrier NDR codes intentionally deferred to real EasyPost
  sandbox testing per the sub-skill's own guidance — enum/severity logic
  is stable now.
- `app/api/webhooks/shopify/route.ts` + `lib/webhooks/verify-shopify-hmac.ts`
  — HMAC verification (timing-safe compare) before any processing,
  acknowledges within Shopify's 5s window, heavy processing left as an
  explicit stub for Stage 4 (`rezlv-exceptions-engine`) to fill in.
- Installed Vitest (`09-TESTING-STRATEGY.md`'s chosen framework, wasn't in
  `package.json` yet) — added `test`/`test:watch` scripts,
  `vitest.config.ts`, `tests/setup-env.ts` (loads `.env.local` for test
  runs since Vitest doesn't do this automatically like Next.js).
- Tests, all passing (24/24): `tests/unit/classifier.test.ts` (one test
  per NDR category + severity levels + the escalation edge case, per
  Guardrails §8/§1 go/no-go gate), `tests/unit/shopify-hmac.test.ts`
  (valid/invalid/missing-header/tampered-body/malformed-header — zero-
  tolerance area per `09-TESTING-STRATEGY.md` §2 item 2),
  `tests/integration/rls.test.ts` (real cross-tenant read-denial test
  against the live DB — creates two merchants + two auth users via the
  service role key, signs in as merchant A via an admin-generated magic
  link redeemed server-side, asserts merchant A's session reads zero rows
  from merchant B's `orders` table; cleans up fixtures after).
**Why:** continuing Stage 1 per Moses's "start" instruction; this is the
first stage `rezlv-build`'s stage map assigns, and its scope (schema, RLS,
webhook route, classifier) was fully specified in `rezlv-schema`'s own
skill doc.
**Docs touched:** 08 (Supabase row updated to fully 🟢 with migration
details)
**Blocked on:** nothing for Stage 1 itself. EasyPost signup is still the
one outstanding 🔴 and blocks the write-back half of Stage 4
(`rezlv-exceptions-engine`) — the Shopify webhook route above only
ingests and stubs the next step, it doesn't yet create EasyPost trackers.
**Note:** a pre-existing TypeScript error was found in the already-
scaffolded `app/dashboard/exceptions/[id]/page.tsx` (`'exception' is
possibly 'undefined'`) during a full-project typecheck — not introduced
by this session's changes, left for Stage 2 (`rezlv-frontend`) to fix
since it's a frontend-shell issue, not a schema one.
**Next:** per Moses's explicit instruction, when the build reaches any
UI-building stage (Stage 2 `rezlv-frontend`, Stage 3 `rezlv-portal`), it
must pause *before* writing frontend code and instead produce a full,
organized section-by-section website copy transcript (with image/
illustration descriptions, no actual asset generation) for Moses to hand
to Google Stitch for a fresh design pass — this is a standing instruction
for this whole build, not a one-time thing.

## 2026-07-15 15:30 (agent: claude)
**Did:** Moses asked for extensive research on whether the NDR classifier
(5 Confirmed categories) was missing any real-world exception types.
Researched EasyPost's own tracker API schema plus industry sources
(FreightAmigo, ShipBob, InsureShield, RTO/porch-piracy/hazmat guides).
Found a confirmed, non-trivial gap: EasyPost's `tracker.status_detail`
field has explicit `damaged`, `lost`, and `refused` values that none of
the 5 original categories cover. Cross-referenced against broader
research — damage, lost/stolen (including the "delivered but not
received"/porch-piracy/friendly-fraud pattern), and delivery refusal are
consistently the most common real exception types industry-wide, each
needing a genuinely different resolution path (photo-evidence claim
assembly for damage; a trust-signal/fraud check specifically for
delivered-but-not-received; merchant-dashboard-only handling for refusal)
that none of the original 5 buckets' flows would produce correctly.
Presented the gap + the MVP-scope tension (this is real new scope against
Moses's "one core feature" directive) via AskUserQuestion — **Moses chose
to add all 3 to MVP now, not defer.**
**Implemented:**
- `03-EXCEPTIONS-TAXONOMY.md` §1.6-1.8 — `damaged_in_transit`,
  `lost_or_stolen` (split into sub-type A `lost_in_transit` and sub-type B
  `delivered_not_received`, the latter always Tier 3/severity 5 with no
  merchant auto-approval override, since the fraud-signal model isn't
  mature enough at MVP to trust an autonomous call here), and
  `delivery_refused`. Updated §3 severity table, added 3 new §4 edge
  cases (evidence-required-before-claim, repeat-claimant pattern flagging,
  refusal-that's-really-address_issue), added §5 template-mapping rows
  (3 new templates needed, not yet drafted — flagged for Stage 4/
  `14-CONTENT-TEMPLATES.md`).
- `supabase/migrations/0003_exception_types_expand.sql` — expanded the
  `exceptions.type` check constraint from 10 to 14 values (5 original +
  `write_back_failure`/`no_response`/`rto_in_progress`/`rto_completed`
  cross-cutting + the 4 new primary types). Applied directly to the live
  project (constraint name confirmed via `pg_constraint` query first, drop
  + recreate since Postgres has no in-place ALTER for check constraints).
- `lib/exceptions/classifier.ts`/`types.ts` — added `damaged_in_transit`,
  `lost_in_transit`, `delivered_not_received`, `delivery_refused` to the
  type enum; new detection code fragments (including EasyPost's own
  literal `status_detail` values as the highest-confidence match); new
  `classifyNonReceiptReport()` function for the sub-type A/B split (this
  case isn't derivable from a single tracking event — it's customer-
  report-triggered against an already-`delivered` shipment); severity
  rules: `delivered_not_received` always 5, high-value damaged/lost always
  ≥4 even without time pressure (no "wait it out" option for these two).
- 10 new tests added (28→34 total, all passing): one per new category
  detection, the sub-type A/B split, and the new severity rules.
**Why:** Moses's explicit request to research exhaustively and cover all
bases before Stage 4 builds resolution flows around an incomplete
taxonomy — better to find this now than after the portal/SMS templates
are built around only 5 categories.
**Docs touched:** 03 (§1.6-1.8, §3, §4, §5), 01 (exceptions.type comment)
**Blocked on:** nothing new. The 3 new categories' content templates
(SMS/portal copy) still need drafting in `14-CONTENT-TEMPLATES.md` before
Stage 4 (`rezlv-exceptions-engine`) can build their resolution flows —
flagged there, not blocking Stage 1/schema completion.
**Next:** still awaiting Moses's go-ahead on the website copy transcript
(Stage 2 prep) or further schema/backend work.

## 2026-07-15 16:00 (agent: claude)
**Did:** Moses flagged that the 2-attempt escalation threshold I'd
hardcoded for the failed_attempt→access_issue escalation was Intelcom-
specific research bleeding into a rule applied uniformly to all 3
carriers, and asked for the system to be "fully knowledgeable" of all
Canadian carrier policies, not just one carrier's number. Did extensive
research across Canada Post, Intelcom, and UPS Canada (MVP scope) plus
Purolator, Canpar, DHL Express Canada, and FedEx Canada (reference only,
confirmed out of MVP scope, kept for future-expansion context) — delivery
attempt counts, RTO/hold timelines, claim filing windows, liability
limits, PO Box support, signature/release options, address-correction
fees.
**Critical finding:** EasyPost's Claims API only supports USPS and FedEx
— **none of Rezlv's 3 MVP carriers (Canada Post, UPS Canada, Intelcom)
are covered.** This directly contradicted what I'd just written in
`03-EXCEPTIONS-TAXONOMY.md` §1.6 (that "Rezlv assembles the carrier claim
documentation... via EasyPost") — corrected immediately. Real picture:
Canada Post and UPS Canada both require the sender (merchant) to file the
claim directly with the carrier, not via EasyPost; Intelcom doesn't
support content-value claims at all (their own FAQ redirects customers to
the merchant). Rezlv's realistic MVP role is evidence assembly + handing
the merchant a ready-to-submit packet (or a direct refund/reship
recommendation for Intelcom), not automated claim filing — and
critically, the customer's actual resolution (refund/reship via Rezlv's
own Tier 2/3 flow) doesn't depend on whether a carrier claim is ever
filed or succeeds.
**Also found:** PO Box delivery is carrier-specific, not universal —
Canada Post is the only MVP carrier that can deliver to a PO Box; a PO
Box address is a real `address_issue` for Intelcom/UPS Canada but not for
Canada Post. Previously the taxonomy treated PO Box restriction as a
generic sub-type without this distinction.
**Implemented:**
- `docs/16-CARRIER-POLICIES.md` (new, 17th doc) — full per-carrier
  reference table for all 3 MVP carriers plus the 4 non-MVP Canadian
  carriers researched for context. §3 documents the EasyPost Claims API
  gap in detail; §4 documents the PO Box cross-carrier summary.
- `00-INDEX.md` — added the new doc to the reading order and status table.
- `03-EXCEPTIONS-TAXONOMY.md` — corrected §1.6's claim-assembly language,
  updated §1.1's PO Box sub-type to be carrier-conditional, updated §4
  edge case #1 to reference per-carrier thresholds instead of a flat "2
  attempts."
- `lib/carriers/policies.ts` (new) — `CARRIER_POLICIES` map with
  `maxDeliveryAttempts`, `supportsPoBoxDelivery`, `attemptCountProvisional`
  (flags Intelcom's unconfirmed attempt count), `supportsCarrierClaim`
  (false for Intelcom); `getAccessIssueEscalationThreshold(carrier)`
  helper.
- `lib/exceptions/classifier.ts` — `classifyWithHistory` now computes the
  escalation threshold per-carrier instead of a hardcoded `2` (falls back
  to 2 for an unrecognized carrier string); `classifyEvent` gained an
  `isPoBoxAddress` parameter and checks carrier PO-Box support before
  status-text matching, so a PO Box address on a Canada Post shipment is
  correctly never flagged as `address_issue`.
- `OrderContext` (types.ts) gained `isPoBoxAddress: boolean`.
- 6 new tests (34→40 total, all passing): Canada Post escalates at 1
  attempt, UPS Canada at 2, unrecognized carriers fall back to the
  generic threshold; PO Box is a non-exception for Canada Post but an
  `address_issue` for UPS Canada/Intelcom.
**Why:** Moses's explicit ask to make the system "fully knowledgeable" of
carrier-specific rules rather than one generic assumption applied
everywhere — and this research surfaced a real architectural correction
(the EasyPost Claims API gap) that would have caused Stage 4 to build a
resolution path around a false assumption.
**Docs touched:** 16 (new), 00, 03
**Blocked on:** Intelcom's exact attempt count remains unconfirmed
(flagged `attemptCountProvisional: true` in code) — needs real EasyPost
sandbox/tracking data once Intelcom's BYOCA connection is live to
confirm. Also unconfirmed: whether EasyPost supports Intelcom tracking at
all (separate from the claims-API gap) — flagged in
`16-CARRIER-POLICIES.md` §1.2 as a risk to verify before Stage 4 assumes
Intelcom write-back works.
**Next:** still awaiting Moses's go-ahead on the website copy transcript
(Stage 2 prep) or further schema/backend work.

## 2026-07-15 16:30 (agent: claude)
**Did:** Continued the carrier research thread with Moses — dug into
whether address write-back is achievable at all via API for any carrier.
Checked EasyPost's own Canada Post BYOCA guide and UPS guide directly:
neither documents any address-correction/redirect/intercept capability —
both are labels + rating + tracking + pickups only. Confirmed UPS
Delivery Intercept is a real, separate API (UPS Developer Kit, not
EasyPost) but is **US + Puerto Rico only**, not confirmed for Canada.
Confirmed via Canada Post's own Developer Program Service Directory that
all 11 of their listed web services do NOT include redirection — Package
Redirection is portal-only, "customer service agents are not able to
redirect a package on your companies' behalf," no developer API exists
at all. Confirmed Intelcom's 6-API suite (Booking, Label, Tracking,
Network, Rate, PoE) has no correction/update endpoint either. Checked
ShipEngine/Shippo (the two main EasyPost alternatives) — neither
documents intercept capability either, confirming this is a carrier-side
limitation, not an EasyPost-specific gap.
**Conclusion presented to Moses:** none of the 3 (then-)MVP carriers
support programmatic redirect — this is a fundamental correction to the
"customer submits correction, it gets written to the carrier
automatically" mechanism described as the core differentiator. Moses
confirmed (via AskUserQuestion): the real MVP mechanism is
**merchant-assisted submission** — agent detects/notifies/collects the
correction, assembles a ready-to-submit packet, merchant clicks confirm
via their own carrier portal login. Moses separately noted this actually
aligns with what merchants say they want (a human final check on
consequential actions), so this isn't purely a shortfall — reframe the
pitch accordingly.
**Docs corrected to reflect this:** `01-SRS.md` §0 core loop diagram,
`02-GUARDRAILS.md` §2 Tier 2 example + a new correction note,
`03-EXCEPTIONS-TAXONOMY.md` §1.1's resolution path and autonomy tier
language. `16-CARRIER-POLICIES.md` §5 added as the durable reference for
this finding.
**Why:** Moses asked directly "do we need EasyPost specifically, if not
what else can we use" — answering that required actually verifying
whether ANY platform supports carrier write-back, not just EasyPost.
Answer: EasyPost is still the right choice for detection/tracking (one
webhook instead of three+ separate carrier integrations, carrier
auto-detection, Parent/Child multi-tenancy) — the write-back gap isn't a
reason to switch platforms since no alternative solves it either.

## 2026-07-15 16:45 (agent: claude)
**Did:** Moses then directed: expand carrier scope from the original 3 to
**any carrier feasible for Rezlv, restricted to Canada** ("fuck that any
carrier that is feasible to work for us please add them"). Researched
and confirmed via EasyPost's own carrier guides (Purolator, Canpar, Loomis
Express, FedEx Canada all have native EasyPost guides = confirmed real
BYOCA integration) plus genuine Canadian-domestic service (not
international-only). **Expanded MVP carrier scope from 3 to 7: Canada
Post, UPS Canada, Intelcom, Purolator, Canpar Express, Loomis Express,
FedEx Canada.** Evaluated and excluded: DHL Express Canada (EasyPost's
own guide confirms no Canada-domestic service, international-only) and
Amazon Logistics (closed network, not merchant-accessible via BYOA). GLS
Canada flagged unconfirmed (only GLS US documented on EasyPost; Canpar
was acquired by GLS in 2021 but EasyPost's integration still appears to
be under the Canpar guide) — not added to the carrier-connect wizard
until verified directly.
**Researched and added full policy data** for the 4 new carriers
(Purolator, Canpar, Loomis Express, FedEx Canada) to
`16-CARRIER-POLICIES.md` §1.4-1.8: attempt counts, PO Box support, claim
windows/liability, EasyPost support confirmation. Notably: **FedEx Canada
is the one MVP carrier where EasyPost's Claims API actually works**
(FedEx + USPS are the only 2 carriers it covers) — worth prioritizing if
claims automation ever becomes a roadmap item, unlike the other 6.
**Implemented:**
- `lib/carriers/policies.ts` — `CarrierId` expanded from 3 to 7 values;
  added `purolator`, `canpar`, `loomis_express`, `fedex_canada` entries
  with researched `maxDeliveryAttempts`/`supportsPoBoxDelivery`/
  `attemptCountProvisional`/`supportsCarrierClaim`; `isKnownCarrier` now
  derives from `CARRIER_POLICIES` keys instead of a hardcoded 3-way check.
- 8 new tests (36→44 total, all passing): escalation thresholds and PO
  Box handling for all 4 new carriers.
- `supabase/migrations/0001_init_schema.sql` — updated the `carrier`
  column's descriptive comment (no schema/constraint change needed, it's
  free text, not a check constraint).
- `08-ENVIRONMENT-SETUP.md` §5, `03-EXCEPTIONS-TAXONOMY.md` (intro),
  `15-FRONTEND-SPEC.md` §3, `16-CARRIER-POLICIES.md` — all updated to
  reflect the 7-carrier scope, onboarding wizard priority order, and the
  2 excluded carriers with reasoning.
**Why:** Moses's direct instruction to maximize carrier coverage within
Canada rather than staying artificially narrow at 3, now that the
write-back mechanism is understood to be merchant-assisted regardless of
which carrier — adding more carriers doesn't add write-back complexity
since none of them get automated write-back anyway, it just adds more
detection/tracking coverage, which is a much cheaper thing to support.
**Docs touched:** 01, 02, 03, 08, 15, 16
**Blocked on:** GLS Canada needs direct verification before being added
to the onboarding wizard. Purolator/Canpar/Loomis Express need logo assets
added to `public/logos/` for the onboarding carrier-connect UI (flagged
in `15-FRONTEND-SPEC.md` §3). FedEx Canada's exact delivery-attempt count
is provisional (modeled on UPS's 3, not FedEx-Canada-confirmed).
**Next:** still awaiting Moses's go-ahead on the website copy transcript
(Stage 2 prep) or further schema/backend work.

## 2026-07-15 17:00 (agent: claude)
**Did:** Moses asked to enumerate every carrier EasyPost supports.
Fetched EasyPost's actual carrier guide index (`docs.easypost.com/
carriers`) directly rather than relying on partial search snippets — got
the complete, authoritative list of all 72 carriers. This resolved two
open items definitively:
- **GLS Canada is confirmed excluded, not just unconfirmed** — the list
  contains exactly one GLS entry ("GLS US"), no separate "GLS Canada" at
  all. §1.8/§4's "unconfirmed" language was upgraded to "confirmed absent"
  in `16-CARRIER-POLICIES.md`.
- **Intelcom is confirmed NOT on EasyPost's carrier list at all** — not a
  research gap anymore, a confirmed fact. This is significant: Intelcom
  is a priority-2 MVP carrier but sits entirely outside the EasyPost
  Parent/Child gateway that handles the other 6. Presented this to Moses
  directly (drop Intelcom from MVP vs. build a separate direct
  integration) — **Moses chose to build the direct Intelcom
  integration**, keeping it in MVP scope given its importance as a DTC
  last-mile carrier.
**Implemented:**
- `16-CARRIER-POLICIES.md` §1.2 (Intelcom) rewritten from "unconfirmed
  risk" to "confirmed not supported, direct integration required, Moses
  approved building it." Added new **§6** (full 72-carrier list, bolded
  for the 6 Rezlv-relevant ones, with the GLS-US-only and
  no-Intelcom-anywhere findings called out explicitly) and **§7** ("do we
  need custom code per carrier?" — no, for the 6 EasyPost carriers it's
  one shared code path with carrier differences handled as data via
  EasyPost's own `CarrierAccount` metadata and `lib/carriers/policies.ts`;
  yes for Intelcom, which needs a fully separate ingestion path).
- `07-ARCHITECTURE.md` — corrected the system-shape diagram, which had
  gone stale on 3 points: carrier count (3→7), Intelcom routing (was
  shown flowing through the EasyPost box, now shown as a parallel direct
  integration), and the write-back step (was "Carrier write-back via
  EasyPost," now "agent assembles packet → merchant submits via their own
  carrier portal").
**Why:** Moses's request to enumerate the full carrier list, done
properly by fetching EasyPost's actual index instead of guessing, doubled
as the way to definitively close two items that were previously flagged
as "needs verification" — better to resolve them now than carry them as
open risk into Stage 4.
**Docs touched:** 07, 16
**Blocked on:** the direct Intelcom integration itself is unbuilt (Stage
4 scope) — this session confirmed it's *needed* and *approved*, not that
it's done. Purolator/Canpar/Loomis Express logo assets still needed
(carried over from the previous entry).
**Next:** still awaiting Moses's go-ahead on the website copy transcript
(Stage 2 prep) or further schema/backend work.

## 2026-07-17 22:36 (agent: gemini)
**Did:** Finalized Phase 1 frontend cleanup: removed pricing formula/hypothesis text, removed footer "Preview onboarding" link, audited entire codebase for missing links, successfully ran `npm run build` to verify performance (compiled 100% static in 7.4s), and pushed all changes to GitHub branch `website-edits`.
**Why:** Moses confirmed the website edit was done and requested a final polish/performance check before pushing a clean branch for review.
**Docs touched:** 05
**Blocked on:** Missing URLs for `About`, `Privacy`, `Terms` (in footer) and a placeholder link in `signup/page.tsx`.
**Next:** Awaiting Moses to provide the missing links or approve Stage 2 (website copy transcript) before proceeding.
