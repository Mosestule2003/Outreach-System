# Rezlv — Content Templates (SMS, Email, Voice, Portal, Admin Alerts)

Central copy library. Referenced by `03-EXCEPTIONS-TAXONOMY.md` (which
template fires per exception type), `01-SRS.md` §8 (notification system),
and `02-GUARDRAILS.md` §6 (legal compliance). Update copy here, not
ad-hoc in code — code should reference template IDs from this doc.

Per Content Tracker (Confirmed, Jul 13, 2026 SOP decision): resolution
follows a **3-step escalation ladder** — SMS first, then email if no reply,
then an AI voice agent call as the last attempt before the carrier's RTO
deadline. Every step is automatic and timestamped on the exception's
`agent_actions` record (see `01-SRS.md` §2.2).

Merchant brand name is interpolated as `{{brand}}` — every message is
sent as if from the merchant, not "Rezlv," since the end customer's
relationship is with the merchant, not Rezlv (Rezlv is invisible
infrastructure to the end customer — keep this framing consistent).

---

## 1. SMS Templates

### 1.1 Initial exception notice (Step 1 of escalation ladder)

```
Your {{brand}} delivery needs your help. Tap to fix it now:
{{portal_link}}
Reply STOP to opt out.
```

- `{{portal_link}}` is the JWT-tokenized, single-use, 24hr-expiry portal
  URL (`01-SRS.md` §4.1).
- **"Reply STOP to opt out" is mandatory on every first message in a
  conversation thread**, not optional copy — TCPA compliance
  (`02-GUARDRAILS.md` §6). Never remove it to save characters.
- Keep under 160 characters where possible (single SMS segment) to avoid
  multi-part message costs and rendering issues — measure `{{brand}}` name
  length variability into this, don't assume a fixed-length brand name.

### 1.2 Reminder (if no portal action within a merchant-configured window, e.g. 2hrs)

```
Reminder: your {{brand}} delivery is waiting on you.
{{portal_link}}
```

### 1.3 Resolution confirmation

```
Thanks! Your {{brand}} delivery has been updated — {{resolution_summary}}.
```

- `{{resolution_summary}}` examples: "corrected address sent to UPS,"
  "replacement is on its way," "refund processed."

### 1.4 STOP / opt-out auto-response

```
You've been unsubscribed from {{brand}} delivery updates. No further
messages will be sent for this order.
```

- Must fire automatically on any inbound message containing STOP, STOPALL,
  UNSUBSCRIBE, CANCEL, END, QUIT (standard carrier-recognized keywords) —
  this is typically handled by the SMS provider (Twilio Advanced Opt-Out)
  but verify the exact keyword list matches carrier requirements at
  implementation time (`01-SRS.md` §3.1 inbound SMS webhook).
- Log the opt-out in the `notifications`/`opt_outs` table (`01-SRS.md`
  §2.2) — every future send must check this before dispatching.

## 2. Email Templates (Step 2 — sent if no SMS reply)

### 2.1 Escalation email

**Subject:** `Action needed: your {{brand}} order #{{order_number}}`

```
Hi {{customer_first_name}},

We tried reaching you by text about your {{brand}} delivery, but haven't
heard back. There's an issue with your delivery that needs a quick fix
from you: {{exception_summary}}.

Fix it now (takes under 3 minutes, no login needed):
{{portal_link}}

If we don't hear from you by {{deadline}}, we may not be able to complete
your delivery.

{{brand}} Support
Unsubscribe from delivery updates: {{unsubscribe_link}}
```

- Real sender identity, real unsubscribe link, no deceptive subject line —
  CAN-SPAM requirements (`02-GUARDRAILS.md` §6). Sender should be
  `{{brand}} via Rezlv <notifications@rezlv.com>` or similar — disclose the
  Rezlv relationship in the sender line even though customer-facing body
  copy stays merchant-branded (transparency without breaking the
  merchant-branded experience).
- `{{deadline}}` should reflect the actual carrier RTO deadline where
  known, not an arbitrary date — creates real urgency without being
  misleading (a false urgency claim is a deceptive-practice risk).

### 2.2 Resolution confirmation email

**Subject:** `Your {{brand}} delivery has been updated`

```
Hi {{customer_first_name}},

Good news — your delivery issue has been resolved: {{resolution_summary}}.

{{tracking_link_if_applicable}}

{{brand}} Support
```

## 3. AI Voice Agent Call Script Outline (Step 3 — last attempt before RTO deadline)

Full conversational script is a separate, code-adjacent artifact (informed
by whichever voice AI provider is chosen — not yet selected, see
`08-ENVIRONMENT-SETUP.md` open item), but the required content elements
are specified here so any implementation stays compliant and on-brand:

1. **Opening disclosure:** must identify this is an automated call about a
   delivery on behalf of `{{brand}}` — do not pretend to be a human
   without disclosure (deceptive-practice and, depending on jurisdiction,
   robocall-disclosure risk — flag for legal review, `02-GUARDRAILS.md`
   §6).
2. State the issue in one sentence (`{{exception_summary}}`).
3. Offer the fix path: "I can text you a link to fix this in under 3
   minutes" (fallback to SMS/portal rather than trying to collect a
   corrected address verbally and risk transcription error feeding
   directly into a carrier write-back — verbal collection of a Tier 2
   action's input should re-confirm via text link, not act on voice input
   alone, per `02-GUARDRAILS.md` §2 judgment-call principle: under-classify
   risk, not over-trust a noisy input channel).
4. Clear opt-out instruction verbally ("say or press to stop future
   calls").
5. If unreachable/voicemail: leave a message with the portal link sent via
   a follow-up SMS immediately after, don't rely on voicemail alone.

**Do not build the voice agent to autonomously commit a Tier 3 action
(refund, etc.) based on verbal confirmation alone** — voice call's role in
the ladder is to drive the customer back to the SMS/portal flow where the
action is captured unambiguously in writing, consistent with the product's
core differentiator (the customer's own submitted correction is what gets
written to the carrier, not an assistant's interpretation of a phone call).

## 4. Portal Copy (JWT-tokenized link destination)

### 4.1 Landing state

```
{{brand}} — Delivery Update Needed

Order #{{order_number}}
{{exception_type_friendly_label}}

[Exception-type-specific fields, e.g. address correction form]

[Submit button]
```

- Mobile-first, no login, 3-field-or-fewer target for the common case
  (address correction) per Content Tracker's stated design target ("Done
  in under 3 minutes").
- Address correction fields validated via Google Maps API before allowing
  submission (`01-SRS.md` correction pending — see `00-INDEX.md`).

### 4.2 Expired/used token state

```
This link has expired or was already used.
Need help? Contact {{brand}} support at {{merchant_support_contact}}.
```

### 4.3 Post-submission confirmation state

```
Thanks — we've got it. Your {{brand}} delivery is being updated. You'll
get a text once it's confirmed.
```

## 5. Admin Alert Emails (internal, Rezlv-staff-facing — see `01-SRS.md` §7)

### 5.1 Tier 3+ action awaiting approval, unactioned past threshold

**Subject:** `[Rezlv Admin] Exception awaiting approval — {{merchant_name}} — {{hours}}h`

```
Exception {{exception_id}} for {{merchant_name}} has a Tier {{tier}}
action awaiting human approval, unactioned for {{hours}} hours.

Exception type: {{exception_type}}
Financial exposure: {{amount}}
Review: {{admin_dashboard_link}}
```

### 5.2 Webhook signature verification failures (possible attack)

**Subject:** `[Rezlv Admin] ALERT: repeated webhook signature failures — {{source}}`

```
{{count}} signature verification failures from {{source}} in the last
{{window}}. Possible misconfiguration or attack.
Review: {{admin_dashboard_link}}
```

## 6. Localization / Language Note

MVP is English-only (per GTM: 70% US / 30% Canada, no stated French-
Canadian requirement yet). If Quebec merchant demand emerges, French-
Canadian SMS/email variants would need separate legal review (Quebec has
its own consumer-protection language requirements) — flag as a Phase 2+
item, not MVP scope, and log the decision if raised.

## 7. Tone Guide

- Always merchant-branded (`{{brand}}`), never mentions "Rezlv" to the end
  customer except the disclosed sender identity in email (§2.1).
- Direct, low-friction, action-oriented — reflects the "done in under 3
  minutes" design target. No marketing language, no upsell content in
  transactional messages (mixing marketing into transactional SMS/email
  is also a compliance risk — keep transactional and marketing channels
  strictly separate if marketing messaging is ever added).
- Never overstate urgency beyond what's factually true (§2.1 deadline
  note) — trust is the product's core value, false urgency undermines it.
