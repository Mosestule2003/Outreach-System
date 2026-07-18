# Rezlv — Carrier Policies & Operational Parameters

**Added 2026-07-15**, per Moses's explicit request that the system be
"fully knowledgeable of all the policies, rules, schemas" for Canadian
carriers, not just working off one generic assumption (the request that
triggered this doc: the classifier hardcoded a 2-attempt escalation
threshold for every carrier, when actual per-carrier attempt policies
differ significantly — see §1).

This doc is the source of truth for carrier-specific operational
parameters that `lib/exceptions/classifier.ts` and
`03-EXCEPTIONS-TAXONOMY.md` should read from, instead of hardcoding one
number across all carriers. **All figures below are from public carrier
documentation/policy pages as of 2026-07-15, not from real Rezlv shipment
data yet** — validate against actual EasyPost sandbox/tracking data once
live, the same caveat `03-EXCEPTIONS-TAXONOMY.md` already carries for its
sub-types.

---

**Carrier scope expanded 2026-07-15 (same day as this doc's creation):**
Moses directed "any carrier that is feasible for us, add them — restricted
to Canada," moving from the original 3-carrier MVP scope to 7. A carrier
was added to MVP scope only if it has both (a) a genuine EasyPost carrier
guide (confirming real BYOCA integration exists, not just theoretical
support) and (b) actual Canadian-domestic last-mile delivery service (not
international-only). Two carriers were evaluated and excluded — see the
end of §1 for why.

## 1. MVP Carriers (7, expanded from the original 3 — `08-ENVIRONMENT-SETUP.md` §5)

### 1.1 Canada Post

| Parameter | Value | Source note |
|---|---|---|
| Delivery attempts before notice | 1 attempt, then a Delivery Notice Card is left | Official KB |
| Final notice | Sent after 5 calendar days if uncollected | Official KB |
| Hold period before RTO | **15 calendar days** standard parcels; **7 calendar days** for Xpresspost/Priority | Official KB |
| PO Box delivery | **Supported** — Canada Post is the only major Canadian carrier that delivers directly to PO boxes (via Xpresspost, Expedited Parcel, lettermail) | Official KB |
| Address correction / redirect | ~$13 CAD redirect fee + shipping cost to new address (Package Redirection, commercial customers only, online tool) | Official fee schedule |
| Lost-package determination | Not arrived after **10 business days** (domestic) | Official KB |
| Claim investigation window | **90 days** domestic, **6 months** international | Official KB |
| Default liability | **$100 CAD**, purchasable up to **$5,000 CAD** | Official KB |
| Who can file a claim | **Sender only** (receiver can initiate an inquiry, not file) | Official KB |
| EasyPost Claims API support | **Not supported** — see §3 | EasyPost docs |

### 1.2 Intelcom

| Parameter | Value | Source note |
|---|---|---|
| Delivery attempts before RTO | **Unconfirmed / conflicting sources** — some cite "up to 3 attempts at no extra cost," others "4 attempts total." No single official published number found. **Do not hardcode a specific count in the classifier — verify against real EasyPost sandbox tracking data once live**, per the existing caveat already in `03-EXCEPTIONS-TAXONOMY.md` §1.3 |
| Delivery postponement behavior | If delivery fails same-day, retried the **next business day** (not necessarily counted toward a fixed attempt cap the way UPS/Canada Post are) | Official FAQ |
| No safe drop location | Package returned to the local warehouse, redelivery attempted next business day | Official FAQ |
| Delivery hours | 8 a.m.–10 p.m., 7 days/week | Official FAQ |
| PO Box delivery | **Not supported** — Intelcom is a private courier, not part of Canada Post's postal network (same limitation as UPS/Canpar/GLS) | Inferred from general private-courier PO box research, not Intelcom-specific — verify directly |
| Value/content claims | **Intelcom does not handle damage/loss value claims at all** — their own FAQ explicitly redirects customers to "reach out to the merchant" because "for security and privacy reasons, Intelcom doesn't know the contents or the value of the delivered packages." **This means there is no carrier-side claim to file for Intelcom shipments** — any damage/loss resolution for an Intelcom-shipped order is inherently a merchant-funded refund/reship, never a carrier reimbursement. | Official FAQ — **high-impact finding, see §3** |
| EasyPost carrier/tracking support | **CONFIRMED NOT SUPPORTED** (2026-07-15) — checked EasyPost's complete 72-carrier guide index directly (see §6 for the full list); Intelcom does not appear anywhere in it. This is no longer a research gap, it's a confirmed fact: **Intelcom requires its own direct API integration**, entirely separate from the EasyPost Parent/Child gateway used for the other 6 MVP carriers. Moses confirmed (2026-07-15) building this direct integration rather than dropping Intelcom from MVP scope, given its importance as a DTC last-mile carrier. Uses Intelcom's own 6-API suite (Booking, Label, Tracking, Network, Rate, PoE) — Tracking API is the relevant one for exception detection; see `07-ARCHITECTURE.md` for where this sits as a parallel path alongside the EasyPost gateway. | EasyPost's own carrier index — confirmed, not inferred |

### 1.3 UPS Canada

| Parameter | Value | Source note |
|---|---|---|
| Delivery attempts before RTO | **Up to 3 attempts** at UPS's discretion on regular delivery days | Official UPS support page |
| Access Point fallback | Package may be redirected to a UPS Access Point, held **7 calendar days** for pickup, before RTO | Official UPS support page |
| PO Box delivery | **Not supported** (private courier, same limitation as Intelcom/Canpar) | General research |
| Address correction fee | **$15.50 CAD** domestic | Official/current rate references |
| Signature required — release option | For Signature Required packages, UPS **may at its discretion** grant an electronic authorization to release without a signature | Official UPS terms |
| Lost-package claim window | **60 calendar days** from ship date | Official UPS support |
| Damaged-package claim window | **60 calendar days** from delivery date; report damage within **5 days** of delivery for best results | Official UPS support |
| Default liability | **$100 CAD**, extends to declared value if purchased at shipment creation | Official UPS support |
| Claim evidence required | Tracking number, invoice/value proof; for damage, photos of **all 6 sides of the box** + interior packaging + damaged contents **before discarding anything** | Official UPS claims guide |
| EasyPost Claims API support | **Not supported** — see §3 | EasyPost docs |

### 1.4 Purolator

| Parameter | Value | Source note |
|---|---|---|
| Delivery attempts before RTO | Notice left; held **5 business days** at a depot before return | Official/researched |
| Hold for Pickup | Available on request, same 5-business-day window | Official/researched |
| PO Box delivery | **Not supported** (private courier — inferred from the general pattern, not Purolator-specific confirmation; verify directly) | Inferred |
| Lost-claim window | **9 months** from ship date (longest of any Canadian carrier researched) | Official/researched |
| Damaged-claim window | **60 days** from delivery if damage is evident; **21 days** if concealed damage | Official/researched |
| Default liability | **$100 CAD** | Official/researched |
| EasyPost carrier support | **Confirmed** — EasyPost has a native Purolator carrier guide; BYOCA requires contacting Purolator directly for a shipper account | EasyPost docs |

### 1.5 Canpar Express

| Parameter | Value | Source note |
|---|---|---|
| Delivery attempts before RTO | **1 attempt per day** at their discretion, then held for pickup | Official/researched |
| PO Box delivery | **Not supported** | General research |
| Damaged-claim window | **60 days** from delivery date | Official/researched |
| Lost-claim window | **180 days** from ship date | Official/researched |
| Default liability | **$250 CAD or $2.00/lb ($4.41/kg), whichever is greater** | Official/researched |
| Declared-value liability cap | Up to **$25,000/shipment**, max **$5,000/package** | Official/researched |
| Liability exclusions | Explicitly disclaims liability for loss/damage/delay caused by shipper's own packaging/address errors — same "improper packaging voids the claim" pattern seen industry-wide | Official/researched |
| EasyPost carrier support | **Confirmed** — native EasyPost Canpar guide, standard BYOCA setup | EasyPost docs |
| Note | Canpar was acquired by GLS in 2021 (part of TFI International). EasyPost's Canpar guide appears to still be the correct integration path post-acquisition — **GLS Canada itself is not separately confirmed on EasyPost** (only GLS US is documented), so do not assume GLS Canada is addressable as a distinct carrier until verified directly. | Research gap |

### 1.6 Loomis Express

| Parameter | Value | Source note |
|---|---|---|
| Delivery attempts before RTO | 1st attempt + notice card; **automatic 2nd attempt next business day at no charge**; a fee applies if a further redelivery is requested | Official T&Cs |
| PO Box / R.R.# delivery | **Not supported** — explicitly cannot deliver to a PO Box or Rural Route number; **$20 CAD address-correction surcharge** applies if one is used | Official T&Cs |
| Claims — damage | Call within **48 hours** of delivery to request inspection; **Letter of Intent to Claim within 60 days** of delivery | Official T&Cs |
| Claims — loss | Letter of Intent to Claim + supporting docs within **9 months** of expected delivery date | Official T&Cs |
| Claim minimum | Will not process claims under **$20 CAD** in value | Official T&Cs |
| Liability | No liability assumed for inability to complete delivery despite "every attempt to find the correct address" | Official T&Cs |
| EasyPost carrier support | **Confirmed** — native EasyPost Loomis Express guide, live-rating integration, pickup requests supported via API | EasyPost docs |

### 1.7 FedEx Canada

| Parameter | Value | Source note |
|---|---|---|
| Delivery attempts before RTO | **Provisional — modeled as 3** (same structure as UPS), not FedEx-Canada-confirmed specifically; verify before relying on it | Inferred, flagged provisional in `lib/carriers/policies.ts` |
| Investigation start | **3–7 days** after expected delivery date | Official/researched |
| Claim filing window | **60–90 days** from shipment date | Official/researched |
| Default liability | **$100 CAD** (same structure as UPS) | Official/researched |
| EasyPost Claims API support | **Supported** — FedEx is one of only two carriers (with USPS) EasyPost's Claims API actually covers. **This makes FedEx Canada the one MVP carrier where an automated claims flow might genuinely be buildable**, unlike the other 6 — worth prioritizing if/when claims automation becomes a roadmap item. | EasyPost docs |

### 1.8 Carriers evaluated and excluded from MVP scope

- **DHL Express Canada** — EasyPost's own DHL Express guide confirms DHL
  Express **does not offer domestic shipping service within Canada**,
  international-only. Not useful for a Canadian-domestic exception-
  resolution product; excluded.
- **Amazon Logistics (Canada)** — a closed network only usable for
  Amazon-fulfilled or Buy-with-Prime orders, not accessible to an
  arbitrary Shopify merchant via BYOA/EasyPost. Excluded.
- **GLS Canada** — see the Canpar note in §1.5. Only GLS US is confirmed
  on EasyPost; do not add GLS Canada to the onboarding wizard until
  verified as its own distinct, working EasyPost integration.

---

## 2. (renumbered — see §1.4-1.8 above, kept as a placeholder so external links to old §2.x anchors aren't silently broken)

---

## 3. Critical finding: EasyPost's Claims API does not cover most MVP carriers

**EasyPost's Claims API is only supported for USPS and FedEx shipments.**
Of the 7 MVP carriers, only **FedEx Canada** is covered — Canada Post, UPS
Canada, Intelcom, Purolator, Canpar, and Loomis Express are all NOT
covered. This directly contradicted what `03-EXCEPTIONS-TAXONOMY.md`
§1.6/§1.7 originally said ("Rezlv assembles the claim documentation...
via EasyPost") — corrected in the taxonomy doc to reflect the real
per-carrier picture:

- **Canada Post claims** must be filed directly through Canada Post's own
  claims process, and **only the sender (merchant) can file** — Rezlv
  cannot file on the merchant's behalf via EasyPost's API. Rezlv's
  realistic role here is assembling the evidence package (photos, order
  value, tracking history) and handing the merchant a ready-to-submit
  claim, or building a direct (non-EasyPost) integration against Canada
  Post's own claims endpoint if one exists — not yet researched, flag for
  Stage 4.
- **UPS Canada claims** — same situation: file directly via
  `ups.com/guestclaims` or UPS Capital, not via EasyPost. A direct UPS API
  integration (separate from EasyPost) would be needed for true
  automation; out of MVP scope unless Moses prioritizes it.
- **Intelcom claims** — there is **no carrier-side claim to file at all**
  (§1.2). Any damage/loss resolution for an Intelcom shipment is
  inherently a merchant-funded refund/reship decision, not a
  reimbursement Rezlv can pursue from the carrier.

**Implication for MVP scope:** the realistic MVP behavior for
`damaged_in_transit`/`lost_in_transit` is: collect customer evidence via
the portal → present the merchant with a ready-to-submit claim
packet/summary (for Canada Post/UPS Canada) or a direct refund/reship
recommendation (for Intelcom, where no claim path exists) → the actual
resolution (refund/reship) still goes through Rezlv's own Tier 2/3
autonomy-gated flow regardless of whether a carrier claim is ever
pursued. **Rezlv does not need to auto-file carrier claims for MVP to
still resolve the customer's problem** — the claim (if pursued) is a
separate, slower-moving merchant-side recovery process that happens in
parallel, not a blocker to customer resolution. This should be made
explicit in `03-EXCEPTIONS-TAXONOMY.md` and communicated to merchants
during onboarding so expectations are set correctly.

---

## 4. Cross-carrier PO Box summary (feeds `address_issue` §1.1 sub-type)

| Carrier | PO Box delivery |
|---|---|
| Canada Post | ✅ Supported |
| Intelcom | ❌ Not supported (private courier, no postal network access) |
| UPS Canada | ❌ Not supported |
| Purolator | ❌ Not supported (inferred, not carrier-confirmed) |
| Canpar Express | ❌ Not supported |
| Loomis Express | ❌ Not supported (explicitly confirmed — Loomis also surcharges $20 CAD if a PO Box/R.R.# is used) |
| FedEx Canada | ❌ Not supported (general pattern, not FedEx-Canada-confirmed) |

**Classifier implication:** a PO Box address on an order should only be
classified as `address_issue` when the assigned carrier is **not** Canada
Post — for Canada Post shipments, a PO Box is a valid address, not an
exception. The resolution message also differs: for non-Canada-Post
carriers, the fix isn't "correct your address" (the address may be
perfectly valid) — it's "this carrier can't deliver to PO Boxes, provide
a street address" or "the merchant should route this shipment through
Canada Post instead."

---

## 5. Write-back feasibility across all 7 carriers — confirmed 2026-07-15

**No carrier's redirect/correction is a system-to-system API write-back.**
Checked exhaustively (Canada Post's own Developer Program service
directory — 11 listed services, none is redirection; UPS Delivery
Intercept confirmed US+Puerto-Rico-only, not confirmed for Canada; UPS's
own EasyPost carrier guide documents no address-correction/intercept
capability; Intelcom's 6-API suite has no correction endpoint; Canada
Post's Package Redirection is explicitly portal-only — "customer service
agents are not able to redirect a package on your companies' behalf," no
developer API exists). Purolator, Canpar, and Loomis Express were not
individually checked for a redirect API in this pass, but given none of
the 4 more thoroughly-researched carriers has one, and none appeared in
EasyPost's or their own documented API/service lists, **assume the same
limitation applies until specifically disproven** — don't assume any of
the 3 newly-added carriers has write-back capability without direct
verification.

**Confirmed real-world mechanism for all 7 carriers (Moses confirmed
2026-07-15): merchant-assisted submission.** The agent detects, notifies,
collects the corrected address/instructions from the customer via the
portal, and assembles a ready-to-submit packet — the **merchant** submits
it via their own carrier portal login (a one-click confirm from the
merchant dashboard, not a full manual support ticket). This is
deliberately not framed as a shortfall: research elsewhere in this
project found merchants consistently want a human final check on
consequential actions rather than full autonomy, so this mechanism
matches stated merchant preference, not just carrier-side technical
limits. See `01-SRS.md` §0 and `02-GUARDRAILS.md` §2 for where this
correction is reflected in the core product description and autonomy
tier definitions.

---

## 6. Full EasyPost carrier list (all 72, confirmed 2026-07-15) — reference for future carrier decisions

Fetched directly from EasyPost's carrier guide index
(`docs.easypost.com/carriers`) so this doc is a complete, checkable
reference rather than a partial guess — use this list to answer "is
carrier X on EasyPost" without re-researching from scratch next time.

**Wallet Carriers (8):** USPS, UPS, FedEx, DHL eCommerce, DHL Express,
USA Export (Powered by Asendia), Canada Post Wallet, USPS Ship.

**Additional/BYOCA Carriers (64):** 1st Choice Delivery, Accurate Courier
Express, Amazon Shipping, APC Postal Logistics, Asendia USA, Australia
Post, Better Trucks, Blue Streak, Canada Post BYOCA, **Canpar**, CDL Last
Mile Solutions, Courier Express, CouriersPlease, CS Logistics, DAI Post,
Deutsche Post UK, Douglas Express Delivery, DPD, DPD NL, DPD UK, eHub,
ePost Global, Estafeta, EVRi, FirstMile, Flexport Parcel, GIO Express,
**GLS US**, GOFO/CIRRO E-Commerce, Gori Company dba ShipBae, Hailify,
Henry Industries, Interlink Express, Jet Transportation, Jitsu, **Loomis
Express**, LSO, Maersk Parcel, OnTrac, Optima, OSM Worldwide, OSM
Worldwide v2, Point2Point Global (P2P), Parcelforce, Passport Global,
**Purolator**, Quick Courier, Roadie, Rover, Royal Mail, Royal Mail v3,
SEKO OmniParcel, SF Express, SmartKargo, Sonic, Spee-Dee, SpeedX, Sway,
Swyft, TCC, TForce Logistics, UDS, UniUni, Veho.

**Bolded = the 6 carriers actually relevant to Rezlv's Canadian-domestic
MVP scope** (Canpar, GLS US, Loomis Express, Purolator, plus Canada Post/
UPS/FedEx already covered under Wallet Carriers). **`GLS US` is the only
GLS entry — there is no separate "GLS Canada" anywhere in this list**,
which is what confirmed GLS Canada's exclusion (§1.8) rather than leaving
it as an open question. **Intelcom does not appear anywhere in this
72-carrier list** — confirmed absent, not just unresearched, which is why
it needs its own direct integration (§1.2).

Everything else in the 72 is US-regional (OnTrac, Spee-Dee, LSO, UDS,
CDL Last Mile Solutions), international/other-country (DPD variants,
Royal Mail, Australia Post, SF Express, Estafeta), freight (TForce
Logistics), or otherwise not applicable to Canadian DTC parcel delivery
— not relevant to Rezlv today, but keeping the full list here means a
future carrier-expansion decision doesn't require re-fetching this page.

## 7. Do we need custom code per carrier?

**No — not for the 6 EasyPost-integrated carriers.** This is the actual
value EasyPost provides: one shared code path (create a `CarrierAccount`
for BYOCA, create `Tracker` objects, receive `tracker.updated` webhooks)
works identically whether the merchant's carrier is Canada Post, UPS,
FedEx, Purolator, Canpar, or Loomis Express. The differences between
carriers are just **data**, not code:

- **Onboarding form fields differ per carrier** (e.g. Canada Post BYOCA
  needs different credential fields than UPS's), but EasyPost's
  `CarrierAccount` object schema already encodes what each carrier
  requires — the onboarding UI reads this metadata and renders the right
  form, it doesn't need a hand-written integration per carrier.
- **Status/exception code text differs per carrier** (already handled —
  `lib/exceptions/classifier.ts`'s substring matching plus EasyPost's own
  normalized `status`/`status_detail` fields abstract this away).
- **Policy numbers differ per carrier** (attempt counts, PO Box support,
  claim windows) — that's exactly what `lib/carriers/policies.ts` and
  this doc exist to hold, as data, not branching logic.

**Yes — for Intelcom specifically**, since it sits entirely outside
EasyPost. That's genuinely a second, parallel integration: its own
credential storage, its own tracking-event ingestion, its own mapping
into the same internal event shape the classifier consumes. Everything
downstream of "we have a normalized tracking event" (classification,
notification, resolution) is shared code regardless of which of the 7
carriers it came from — only the ingestion path forks in two (EasyPost
vs. direct Intelcom).

**Merchant experience either way:** during onboarding, the merchant picks
their carrier from a list (all 7 shown identically), enters their
account credentials, and Rezlv routes that connection to either the
EasyPost gateway or the direct Intelcom integration behind the scenes —
the merchant never needs to know or care which path their carrier uses.
