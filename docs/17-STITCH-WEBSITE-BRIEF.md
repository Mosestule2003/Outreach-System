# Rezlv — Google Stitch Website Design Brief
**Added 2026-07-15.** This is a marketing-website design/content asset for
handing to Google Stitch, not an engineering build-governance doc like
00-16 — kept in `docs/` for discoverability alongside the rest of this
session's carrier/product corrections, since the copy content depends
directly on them (Canada-only, 7 carriers + Intelcom direct, merchant-
assisted resolution, $8/$5/$3 pricing).

This doc has two parts: **Part A** is a full design system reference
(style, tokens, components, imagery, layout, agent-prompt guide) modeled
at the same level of specificity as the reference systems Moses supplied
(Seline Analytics, Visitors, Dub, Cal.com) — written so it can be pasted
directly into Google Stitch as a style brief. **Part B** is the complete,
corrected section-by-section website copy (superseding the transcript
drafted earlier in this session), each section tagged with which design
tokens/components apply and a Stitch-ready illustration prompt.

---

# PART A — Design System: "Rezlv Control Room"
> Quiet operations desk on warm white paper

**Theme:** light only (no dark mode variant for v1)

Rezlv's system reads as a calm, high-trust operations tool wearing a
consumer-friendly face — the visual opposite of a noisy logistics
dashboard. The canvas is a warm near-white, structure comes from 1px
hairline borders rather than heavy shadows, and headlines sit in a
confident geometric sans at a restrained weight (500, never 700+) so the
product feels engineered, not shouted about. Color is used exactly the
way Visitors and Dub use it: one committed indigo does all primary-action
work, and three desaturated category accents (amber, blue, green) map
1:1 onto Rezlv's three product pillars — Detection, Orchestration,
Execution — the same way Visitors assigns one color per feature domain
and never mixes them on one component. Every dashboard mockup is real
product UI, not illustration; the one recurring illustrated element is a
"resolution flow" checklist card (see §Imagery) that visually explains
the agent's work in progress, mirrored off the reference agent-workflow
card Moses supplied.

## A.1 Tokens — Colors

| Name | Value | Token | Role |
|---|---|---|---|
| Paper Canvas | `#fafaf9` | `--color-paper-canvas` | Page background — warm off-white, never pure white on the canvas |
| Card White | `#ffffff` | `--color-card-white` | Card surfaces, nav bar, input fills, elevated panels |
| Hairline | `#e7e5e4` | `--color-hairline` | 1px borders on cards, table rows, dividers — the primary structural device |
| Border Strong | `#d6d3d1` | `--color-border-strong` | Emphasis borders, secondary button outlines |
| Ash | `#a8a29e` | `--color-ash` | Placeholder text, disabled states, muted icon strokes |
| Slate | `#78716c` | `--color-slate` | Secondary/body copy, nav links |
| Ink | `#1c1917` | `--color-ink` | Headlines, primary text, high-emphasis icons |
| Void | `#0c0a09` | `--color-void` | Footer/dark-section background, inverted surfaces |
| Resolution Indigo | `#3730f5` | `--color-resolution-indigo` | The ONE committed action color — primary CTA fill, active nav state, key metric highlight. Used sparingly, exactly like Dub's Deep Sapphire or Visitors' Lavender |
| Indigo Wash | `#e4e3fd` | `--color-indigo-wash` | Soft highlight-span background behind an inline emphasized headline phrase |
| Detection Amber | `#b45309` (text) / `#fef3c7` (wash) | `--color-detection-amber` / `--color-detection-amber-wash` | Detection pillar category color — icons, tags, sub-feature labels for anything about catching an exception |
| Orchestration Blue | `#1d4ed8` (text) / `#dbeafe` (wash) | `--color-orchestration-blue` / `--color-orchestration-blue-wash` | Orchestration pillar category color — SMS/email/voice outreach features |
| Execution Green | `#15803d` (text) / `#dcfce7` (wash) | `--color-execution-green` / `--color-execution-green-wash` | Execution pillar category color — resolution/confirm-and-submit features, positive deltas, "resolved" status |

**Rule, same as every reference system supplied:** exactly one chromatic
color (Resolution Indigo) is allowed on a filled button or large surface.
The three pillar accents (amber/blue/green) are text-and-tag colors only
— never a filled button background, never mixed more than one per
component.

## A.2 Tokens — Typography

### Display/heading — "Instrument Sans" (or Geist Sans as substitute)
- **Weights:** 500 only for headings (never 600/700 — restraint is the point, exactly as Seline and Dub both specify)
- **Sizes:** 56px (hero display), 40px (section heading), 28px (card heading), 20px (subheading)
- **Line height:** 1.1 at 56px, 1.15 at 40px, 1.25 at 28px, 1.3 at 20px
- **Letter spacing:** -0.02em at 56px, -0.015em at 40px, -0.01em at 28px

### Body/UI — "Inter"
- **Weights:** 400 (body default), 500 (emphasis, buttons, nav)
- **Sizes:** 12px (caption/meta), 14px (dense UI/table), 16px (body default), 18px (lead paragraph)
- **Line height:** 1.5 at 16px, 1.6 at 18px, 1.4 at 14px, 1.4 at 12px

### Monospace — "Geist Mono" (optional, for the dashboard mockup only)
- Used exclusively inside product-UI mockups for tracking numbers, order IDs, NDR type codes (e.g. `#10482`, `address_issue`) — never in real headline/body copy. Matches Dub's use of Geist Mono for technical metadata credibility.

## A.3 Spacing & Shape

- **Base unit:** 4px
- **Page max-width:** 1180px
- **Section gap:** 96px (generous, editorial — matches Seline/Cal.com, not a dense SaaS dashboard rhythm)
- **Card padding:** 24px
- **Element gap:** 12px

### Border Radius
| Element | Value |
|---|---|
| Buttons, tags, pills, badges | 9999px (full pill — this is a signature across every reference supplied, Rezlv follows it) |
| Cards | 14px |
| Large feature panels / dashboard mockup frame | 20px |
| Inputs | 10px |
| Small icon containers | 8px |

### Shadows (flat-first philosophy — borders define structure, shadows are rare)
| Name | Value | Use |
|---|---|---|
| Card (subtle) | `rgba(28,25,23,0.04) 0px 1px 2px 0px` | Default card lift, used almost everywhere |
| Floating preview | `rgba(28,25,23,0.10) 0px 12px 40px 0px` | Reserved for exactly ONE element per page: the hero dashboard mockup |
| Button | `rgba(55,48,245,0.18) 0px 2px 6px 0px` | Primary indigo CTA only |

## A.4 Components

### Primary CTA Button
Pill (9999px), Resolution Indigo (#3730f5) fill, white text, Inter weight 500, 14–15px, padding 10px 22px, button shadow above. This is the ONLY filled-indigo element allowed per viewport — one primary CTA visible at a time.

### Secondary Ghost Button
Pill, transparent fill, 1px Hairline border, Ink text, same padding as primary. Sits beside the primary CTA at lower visual weight (matches every reference's ghost-button pattern).

### Nav Bar
Fixed, transparent → Card White with Hairline bottom border on scroll (matches existing site-header.tsx behavior — keep this interaction). Logo left, links center, ghost+primary button pair right.

### Category Pill Tag (Detection / Orchestration / Execution)
Small pill, one pillar wash color as background (e.g. Detection Amber Wash `#fef3c7`), matching ink-tone text (Detection Amber `#b45309`), 12px Inter weight 500, tiny icon inline. Never mix two pillar colors on one tag.

### Flat Content Card
Card White fill, 14px radius, 1px Hairline border, 24px padding, subtle card shadow. The default container for feature blocks, pricing rows, testimonials.

### Floating Dashboard Preview
Card White fill, 20px radius, floating-preview shadow (the one deep shadow on the page), 8px internal frame padding. This is the hero product mockup and the Execution-pillar "ready to confirm" mockup — the two places elevation is allowed to feel dimensional.

### Exception Queue Row (product-UI mockup element)
Table row: avatar-initial circle + customer name, carrier name (plain text), NDR type tag (small mono-ish label), status pill (Resolved = Execution Green wash, Customer responded = Orchestration Blue wash, SMS sent = Detection Amber wash), "caught in X min" right-aligned. Carrier column MUST show a realistic Canadian mix: Canada Post, Intelcom, UPS Canada, Purolator, Canpar, Loomis Express, FedEx Canada — rotate through all 7, not just 2.

### SMS Thread Mockup
Phone-message-style bubbles inside a Card White container: outbound message left-aligned in an Orchestration Blue wash bubble, customer reply right-aligned in a neutral Paper Canvas bubble, confirmation message left-aligned. Timestamps in 10px Ash gray beneath each bubble.

### "Ready to Confirm" Panel (Execution pillar — the one illustration that must be newly designed, not reused from any old mockup)
A short vertical list inside a Flat Content Card: each row shows a small carrier glyph/logo, one line of what's being submitted ("Corrected address for order #10482"), and a small pill-shaped **[Confirm & Submit]** button in Resolution Indigo outline (not filled — this is a secondary-weight confirm, not the primary page CTA) at the row's right edge. This directly visualizes "we did the work, you click once" — the single most important visual correction from this session's research.

### Rate Table (pricing)
Three-row table inside one Flat Content Card (not three separate pricing cards — this is a single graduated-rate plan, not tiered plans to choose between): Volume range | Price per resolved case. Bottom row includes a small illustrative calculation line in Ash gray.

### Comparison Table
Same visual pattern as the existing site: Platform | Notifies | Customer self-serve fix, with Execution Green checkmarks and Ash gray x-marks. Rezlv's row highlighted with an Indigo Wash background tint.

### Carrier Logo Strip
Grayscale logo marquee, desaturated to Slate gray (matches Dub's "Logo Cloud Item" pattern — color appears only in active/hover states). All 7 real carrier logos (Canada Post, UPS, Intelcom, Purolator, Canpar, Loomis Express, FedEx) plus Shopify, Google Maps, Twilio, EasyPost.

### Testimonial Block
No card chrome (matches Seline's pattern) — quote text directly on canvas at 18px Inter weight 400, Ink color, with one Indigo-Wash highlight span on the key phrase, avatar circle + name + role beneath.

### Footer
Void (#0c0a09) inverted section, Card-White text, multi-column link grid, matches existing site-footer.tsx structure.

## A.5 Do's and Don'ts

### Do
- Use Resolution Indigo (#3730f5) for exactly one primary action per viewport — never decoratively, never on body text.
- Keep all headline weights at 500 — restraint over boldness is the brand's whole visual argument.
- Use the pillar accent colors (amber/blue/green) strictly 1:1 with their product pillar — never mix two on one component.
- Default to 1px Hairline borders for structure; reserve real shadows for the hero mockup and the Execution "ready to confirm" panel only.
- Show a realistic 7-carrier rotation in every product-UI mockup, not a fixed 2-carrier US sample.
- Use pill radius (9999px) on every button, tag, and badge without exception.

### Don't
- Don't introduce a second filled-button color — Resolution Indigo is the only one, matching every reference system's single-accent-CTA rule.
- Don't show a mockup implying silent, zero-touch carrier automation (no fake "API call" logs) — every execution-adjacent visual must show a human confirm step.
- Don't use pure white (#ffffff) as the page background — that's Card White, reserved for surfaces; the canvas is Paper Canvas (#fafaf9).
- Don't set body copy in the display typeface — Instrument Sans/Geist is headline-only, Inter handles everything else.
- Don't drop US carrier/pricing references anywhere — Canada-only, 7-carrier, $8/$5/$3 graduated rate, no exceptions.

## A.6 Surfaces & Elevation

| Level | Name | Value | Purpose |
|---|---|---|---|
| 0 | Canvas | `#fafaf9` | Page background |
| 1 | Card | `#ffffff` | Flat content cards, nav |
| 2 | Floating Preview | `#ffffff` + deep shadow | Hero dashboard mockup, Execution "ready to confirm" panel — the only 2 elements allowed this shadow |
| 3 | Inverted | `#0c0a09` | Footer |

## A.7 Imagery

No stock photography, no lifestyle imagery, no generic illustration —
matches every reference system supplied. Visual content is:
1. **Real product UI mockups** (exception queue, SMS thread, ready-to-confirm panel, resolution-rate chart) rendered as clean, desaturated-adjacent screenshots, not literal screenshots of anything real yet — Stitch should design these as believable product UI.
2. **Real carrier + partner logos**, grayscale/desaturated in the marquee, full color only if a hover/active state is designed.
3. **One recurring "agent workflow" illustration style**, directly modeled on the reference image Moses supplied (the checklist card with "Can you do a 360 on Acme Corp?" + checked steps + orbiting integration icons on curved connector lines) — Rezlv's version should read: a central query like **"Resolve order #10482's delivery exception"**, with checked steps ("Detecting exception type," "Classifying NDR category," "Preparing Canada Post correction") and small orbiting icons for Shopify, the assigned carrier, and Twilio, connected by the same soft curved dotted lines. Use this pattern once, in the Detection or Execution pillar section — not repeated identically elsewhere, per Seline's "mascot appears once per section" restraint principle.
4. **No fake API-call-log mockups** — this is the one visual asset type explicitly retired this session (see §A.4 Execution panel).

## A.8 Layout

Centered content at ~1180px max-width. Hero: centered text stack (headline
with one indigo-highlighted phrase, subhead, dual CTA row) directly above
a large floating dashboard mockup that slightly overlaps into the next
section (matches Dub's hero-to-mockup transition). Sections alternate
between centered single-column (problem, results, pricing, FAQ) and
alternating two-column text+visual (the 3 pillars, matching the existing
site's pattern — keep it). Generous 96px section gaps throughout —
editorial pacing, not a dense dashboard-style stack. Footer is a dark
inverted band, full width.

## A.9 Agent Prompt Guide (how to brief Google Stitch)

**Quick color reference for prompts:**
- page background: `#fafaf9`
- card surface: `#ffffff`
- primary text: `#1c1917`
- secondary text: `#78716c`
- border: `#e7e5e4`
- primary action (the only filled button color): `#3730f5`
- pillar accents (text/tag only, never filled buttons): amber `#b45309`, blue `#1d4ed8`, green `#15803d`

**Example component prompts, written the way Stitch expects (concrete
values, not vague adjectives):**

1. *Hero headline:* "56px Instrument Sans weight 500, color #1c1917, line-height 1.1, letter-spacing -0.02em. Inline the phrase 'resolved before they become returns' as a span with #3730f5 text on a #e4e3fd pill-shaped background highlight. Subheadline 18px Inter weight 400, color #78716c, line-height 1.6, max-width ~560px, centered."

2. *Primary CTA button:* "Pill shape, 9999px radius, background #3730f5, white text, Inter weight 500 14px, padding 10px 22px, shadow rgba(55,48,245,0.18) 0px 2px 6px 0px. This is the only filled-indigo element on the page."

3. *Exception queue row (product mockup):* "White (#ffffff) row, 1px bottom border #e7e5e4, padding 12px 16px. Columns: customer initials in a 24px muted circle + name (14px Inter 500 #1c1917), carrier name in plain 14px Inter #78716c (rotate Canada Post / Intelcom / UPS Canada / Purolator / Canpar / Loomis Express / FedEx Canada across rows), NDR type in 12px Geist Mono #78716c, status pill (9999px radius, wash background matching its pillar color, e.g. #dcfce7 bg + #15803d text for 'Resolved'), caught-in-minutes right-aligned 12px Inter #a8a29e."

4. *Ready to Confirm panel (Execution pillar — the corrected illustration):* "White card, 14px radius, 1px border #e7e5e4, 24px padding. Each row: small carrier logo/glyph (24px), one line of text 14px Inter #1c1917 ('Corrected address for order #10482 → Canada Post'), and a pill-shaped outline button on the right, 1px #3730f5 border, #3730f5 text, no fill, label 'Confirm & Submit', 9999px radius, padding 6px 14px. Stack 3 rows with 12px gaps."

5. *Rate table (pricing):* "Single white card, 14px radius, 1px border #e7e5e4, 32px padding. Three rows, each: volume range in 14px Inter #78716c left-aligned, price in 20px Instrument Sans weight 500 #1c1917 right-aligned. Divider between rows: 1px #e7e5e4. Below the table, one line of 12px Inter #a8a29e italic-style example math."

6. *Category pill tag:* "9999px radius pill, background #fef3c7 (Detection amber wash), text #b45309, 12px Inter weight 500, small icon inline, padding 4px 10px. Use this exact pattern for Orchestration (#dbeafe bg / #1d4ed8 text) and Execution (#dcfce7 bg / #15803d text) — never mix two pillar colors in one tag."

## A.10 Similar Brands (feed these directly to Stitch as visual references)

- **Dub** — same border-first flat-card philosophy, pill-button vocabulary, single committed accent color, product-UI-as-hero-image approach.
- **Visitors** — same one-color-per-feature-category discipline (Rezlv's amber/blue/green pillars map directly onto this pattern), pill radius everywhere, flat white canvas.
- **Seline Analytics** — same editorial restraint (weight-400/500 headlines, generous section gaps, one inline highlight span per headline), warm-paper canvas instead of stark white.
- **Cal.com** — same monochrome-plus-one-accent discipline, pill CTAs, product-widget-as-hero pattern.

---

# PART B — Final Website Copy Transcript (Canada-only, 7 carriers, merchant-assisted resolution)

*(Each section below names which components from Part A apply, so Stitch
can map copy to visual treatment directly.)*

## B.1 Header / Nav
**Components:** Nav Bar
**Copy:** Logo "rezlv" · Nav links: How it works · Platform · Pricing · FAQ · Buttons: "Book a demo" (Secondary Ghost) · "Get early access" (Primary CTA)

## B.2 Hero
**Components:** Primary CTA + Secondary Ghost button pair, Floating Dashboard Preview
**Headline:** "Your delivery exceptions, **resolved before they become returns**." *(the bolded phrase is the one Indigo Wash highlight span, per A.9 prompt #1)*
**Subhead:** "Rezlv detects failed deliveries, contacts your customer, and prepares the fix for your carrier — a one-click confirm, not a support ticket."
**CTAs:** "Get early access" (primary) · "Book a demo" (ghost)
**Illustration:** Floating Dashboard Preview showing the Exception Queue Row component with a realistic 7-carrier rotation (see A.9 prompt #3).

## B.3 Logo Strip
**Components:** Carrier Logo Strip
**Caption:** "Built on Shopify and Canada's major carrier networks."
**Logos:** Shopify, Canada Post, UPS, Intelcom, Purolator, Canpar, Loomis Express, FedEx, Google Maps, Twilio, EasyPost — grayscale marquee.

## B.4 Problem Section
**Components:** Flat Content Card ×4, no color accents (this section is intentionally neutral/monochrome — the pillar colors haven't been introduced yet)
**Headline:** "Shipping software tells you something went wrong. Nothing fixes it."
**Subhead:** "40 to 60 percent of failed deliveries become returns. Not because the fix was hard, but because nobody made it in time."
**Cards:**
1. Carriers do not self-resolve — A carrier marks a package "attempted" and moves on. Nobody gets contacted.
2. Manual resolution takes days — What should take 30 seconds takes an agent 2 to 3 days to chase down.
3. Most tickets are avoidable — 15 to 30 percent of your CS queue is "where is my order," and none of it needs a human.
4. Every exception has a price — A failed delivery that becomes a return costs $21 to $40, plus the customer.

## B.5 How It Works
**Components:** numbered step grid, no card chrome (plain text + numbered badge, matches existing pattern)
**Headline:** "One resolution loop. Six steps. Zero tickets."
**Subhead:** "Your customer never has to call the carrier. A fully agentic escalation ladder — SMS, then email, then an AI voice call — keeps trying until someone answers, all before the carrier's return-to-sender deadline."
**Steps:**
1. Exception detected, case opened — A carrier or Shopify event fires. Rezlv opens a case and starts tracking it toward resolution before your CS team even knows it happened.
2. SMS goes out first — One text, one secure link. No account to create, no app to download.
3. No reply? Email follows. — Still inside the carrier's window before the package returns to sender, Rezlv escalates to email automatically.
4. Still nothing? An AI agent calls. — Last attempt before the RTO deadline: an AI voice agent calls the customer directly to collect their fix. It's still their decision — the agent is just reaching them, not deciding for them.
5. Your team gets the fix, ready to send. — The correction is packaged exactly as your carrier needs it — Canada Post, Intelcom, UPS Canada, and 4 more — and handed to you as a one-click confirm in your dashboard. No retyping, no digging through a carrier portal, no support ticket. You stay the final check.
6. Case closed, receipt logged. — Order saved, RTO prevented, dollar amount attached, every step timestamped. Every time it happens.

## B.6 Platform Pillars

### Detection (Detection Amber)
**Components:** Category Pill Tag (amber), Floating Dashboard Preview with Exception Queue Row, the "agent workflow" illustration (A.7 §3) placed here
**Eyebrow:** Catch it before it becomes a return
**Headline:** Detection
**Body:** Shopify fulfillment webhooks and carrier tracking data feed one classifier that tells a delayed package apart from a dead one.
**Sub-features:**
- Real-time ingestion — Shopify and carrier events land within minutes of the carrier scan, not the next batch sync.
- NDR classification — Every exception is tagged: address issue, failed attempt, access issue, carrier delay, customs hold, damaged in transit, lost or stolen, or delivery refused.
**Illustration:** the agent-workflow checklist card — "Resolve order #10482's delivery exception" with checked steps (Detecting exception type / Classifying NDR category / Preparing Canada Post correction) and orbiting Shopify/carrier/Twilio icons on soft dotted connector lines, per A.7.

### Orchestration (Orchestration Blue)
**Components:** Category Pill Tag (blue), SMS Thread Mockup
**Eyebrow:** Reach the customer in under 60 seconds
**Headline:** Orchestration
**Body:** The moment an exception is classified, Rezlv fires a secure link by SMS, then escalates through email and an AI voice call if nobody responds, all before the carrier's return-to-sender deadline closes.
**Sub-features:**
- SMS outreach — A plain-English text with a single-use portal link. No account, no app download.
- Agentic escalation ladder — No reply? Email next, then an AI voice call. Every step is automatic and timestamped on the case.
- Tokenized portal — 24-hour expiry, single use. The customer sees only their own order.

### Execution (Execution Green)
**Components:** Category Pill Tag (green), **Ready to Confirm Panel (A.4/A.9 prompt #4 — the corrected illustration)**
**Eyebrow:** The step every competitor skips
**Headline:** Execution
**Body:** The customer's correction gets translated into exactly what your carrier needs — then handed to you, ready to submit, in one click. Nothing waits on a support ticket; the only thing that waits on a human is the click you were always going to make anyway.
**Sub-features:**
- Ready-to-submit corrections — Packaged exactly as Canada Post, UPS Canada, Intelcom, Purolator, Canpar Express, Loomis Express, or FedEx Canada needs it. You confirm, we handle the rest.
- Shopify auto-sync — Fulfillment notes and order status update the moment your carrier confirms.
- Full audit trail — Every attempt, success, and failure logged against the order.

## B.7 Comparison Section
**Components:** Comparison Table
**Headline:** "Everybody notifies. Few let the customer decide the fix."
**Body:** "Most platforms in this category run their own automated outreach and feed carrier systems on the back end. Rezlv's difference is narrower and more specific: your customer submits the exact correction, and that input is exactly what gets packaged and handed to your team to send — not an ops team guessing, not an automation deciding on their behalf."
**Table:** Narvar (notifies ✓, self-serve ✗) · AfterShip (✓/✗) · parcelLab (✓/✗) · ClickPost (✓/✗) · "Carriers handle it" (✗/✗) · **Rezlv (✓/✓, indigo-wash highlighted row)**
**Footnote:** "Customer self-serve fix" means the customer's own input (address, window, pickup choice) is what gets prepared for submission — not an ops or automation decision made for them.
**Stack tiles:** rotate through all 7 carrier logos + Shopify, Google Maps, Twilio.

## B.8 Results Section
**Components:** Flat Content Card stat tiles, before/after comparison rows
**Headline:** "The cost of a delivery exception, in numbers."
**Stats:** 40–60% of failed first-attempt deliveries become costly returns (Industry NDR/RTO benchmarks) · 15–30% of all CS tickets are delivery exceptions or WISMO calls (G2/Trustpilot research) · $21–40 average reverse-logistics cost per returned package (Carrier rate data)
**Before/After:**
| Without Rezlv | With Rezlv |
|---|---|
| An agent notices the exception, eventually. | Rezlv opens a case within minutes of the carrier scan. |
| Someone calls or emails the customer manually. | A text goes out automatically, with a one-tap fix-it link. |
| The fix gets typed into the carrier portal by hand. | The correction arrives pre-filled, ready for one click. |
| Nobody knows how many exceptions turned into returns. | Every resolution and every dollar saved is logged per order. |

## B.9 Pricing Section
**Components:** Rate Table (single card, NOT 3 tiered pricing cards)
**Headline:** "Priced against what a return actually costs you."
**Body:** "You only pay when Rezlv actually resolves something — never a flat subscription fee. $8 per resolved case for your first 100 a month, dropping to $5, then $3 as volume grows. If a $30 return gets saved, that's the entire cost of resolving several exceptions."
**Rate table:**
| Volume | Price per resolved case |
|---|---|
| 1–100 cases/month | $8.00 |
| 101–500 cases/month | $5.00 |
| 501+ cases/month | $3.00 |
**CTA:** Get early access
**Footnote:** Pricing is a starting hypothesis, validated with our first pilot brands.

## B.10 FAQ Section
**Components:** accordion list, no card chrome for the "Questions, answered" pattern
1. **What does Rezlv actually do?** When a package fails to deliver, Rezlv detects the exception, texts your customer a secure link to fix it (a wrong address, a missed signature, a gate code), and prepares that correction exactly as your carrier needs it — ready for your team to confirm in one click.
2. **We already use AfterShip or Narvar. Why do we need this too?** Those are excellent notification tools. They tell your customer something went wrong. Rezlv is the layer that also gets it fixed: customer outreach and carrier-ready corrections in the same automated flow. Most brands run both side by side.
3. **How is Rezlv different from ClickPost?** ClickPost runs its own automated outreach and carrier feedback loop, and it does a lot of it well. Rezlv's difference is narrower and specific: the customer submits the exact correction themselves through a secure link, and that input — not an ops team or an automation acting on their behalf — is exactly what gets packaged and handed to your team to send. Even when we escalate to an AI voice call, we're still collecting the customer's own decision, not making it for them.
4. **Our CS team already handles this manually. What changes?** Most teams spend 2 to 3 days per exception chasing a fix. Rezlv gets it ready to send in under 2 hours, automatically. Your team just confirms — no more digging through carrier portals or playing phone tag with the customer.
5. **What if the customer never responds?** Rezlv runs a fully agentic escalation ladder before the carrier's return-to-sender deadline: SMS first, then email if there's no reply, then an AI voice agent calls as the last attempt. Every step happens automatically and is timestamped on the case. If none of it lands, you get notified and can escalate to CS, offer a nearby pickup point, or let the carrier auto-hold the package.
6. **Which carriers does Rezlv support?** Canada Post, UPS Canada, Intelcom, Purolator, Canpar Express, Loomis Express, and FedEx Canada at launch — covering the carriers that actually move Canadian DTC parcel volume, connected through your own carrier accounts (BYOD).
7. **Does Rezlv send refunds or take actions without my approval?** Any refund or credit always requires your approval — Rezlv never moves money on its own. Every action is logged against the order, and you set the limits on what the agent can do unsupervised.
8. **How long does setup take?** Install is a Shopify webhook connection, no developer work required. Most brands see their first detected exception within 48 hours of connecting.
9. **Is this only for Shopify stores?** Yes, for now — that's where we started, and where Canadian DTC brands overwhelmingly are. WooCommerce and BigCommerce are on the roadmap.
10. **What happens if I need to submit something myself?** You always can — Rezlv prepares everything and shows you exactly what to submit and where, but you're never locked out of your own carrier account. Think of Rezlv as doing 95% of the legwork, not replacing your control.

## B.11 CTA Section
**Components:** two Flat Content Cards side by side (Demo / Waitlist), matches existing cta-section.tsx structure
**Headline:** "Stop losing orders to failed deliveries."
**Subhead:** "Currently onboarding the first cohort of Canadian Shopify DTC brands." *(verify revenue-band framing against current ICP before including)*
**Card 1 (Book a demo):** "See it resolve one of your actual exceptions." A 20-minute call using your real order and tracking data. Founder-led, for the first cohort of brands helping shape the product.
**Card 2 (Get early access):** "Want to try it on your store first?" Get early access to the resolution loop, plus the pilot pricing we're testing with the first brands on the platform.

## B.12 Footer
**Components:** Footer (inverted Void background)
**Tagline:** "Everybody notifies. Rezlv resolves."
**Description:** "Exception resolution orchestration for Shopify DTC brands. Detect, contact, prepare the fix. Your team just confirms."
**Columns:** Product (How it works, Platform, Pricing, FAQ) · Get started (Book a demo, Get early access) · Company (About, Privacy, Terms)
**Socials:** Twitter, LinkedIn

---

## Part C — Quick Start (paste directly ahead of the Part B copy when briefing Stitch)

```css
:root {
  --color-paper-canvas: #fafaf9;
  --color-card-white: #ffffff;
  --color-hairline: #e7e5e4;
  --color-border-strong: #d6d3d1;
  --color-ash: #a8a29e;
  --color-slate: #78716c;
  --color-ink: #1c1917;
  --color-void: #0c0a09;
  --color-resolution-indigo: #3730f5;
  --color-indigo-wash: #e4e3fd;
  --color-detection-amber: #b45309;
  --color-detection-amber-wash: #fef3c7;
  --color-orchestration-blue: #1d4ed8;
  --color-orchestration-blue-wash: #dbeafe;
  --color-execution-green: #15803d;
  --color-execution-green-wash: #dcfce7;

  --font-display: 'Instrument Sans', 'Geist Sans', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, monospace;

  --radius-pill: 9999px;
  --radius-card: 14px;
  --radius-panel: 20px;
  --radius-input: 10px;

  --shadow-card: rgba(28, 25, 23, 0.04) 0px 1px 2px 0px;
  --shadow-floating: rgba(28, 25, 23, 0.10) 0px 12px 40px 0px;
  --shadow-button: rgba(55, 48, 245, 0.18) 0px 2px 6px 0px;

  --page-max-width: 1180px;
  --section-gap: 96px;
  --card-padding: 24px;
  --element-gap: 12px;
}
```
