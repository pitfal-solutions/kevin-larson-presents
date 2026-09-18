# Spec — Ticketing & orders system (architecture)

**Status:** planning. Decisions below were made with the founder on
2026-09-17; nothing is built yet. Cost case lives in
[../context/ticketing-cost-comparison.md](../context/ticketing-cost-comparison.md).

## Goal

Replace the third-party ticketing KLP pays for today (TicketFairy — every
"Buy Tickets" link on the live microsites goes there) with checkout,
payment, and ticket issuance running on KLP's own site. Buyers pay with
whatever they already have in their pocket (card, Apple Pay, Google Pay,
Link, PayPal, Venmo, Cash App, Klarna/Affirm), get a scannable ticket by
email, and the door staff check people in from their phones. KLP's team
runs it all from an admin panel without a developer in the loop.

## Decisions already made (2026-09-17)

| Question | Decision | Consequence |
|---|---|---|
| Payment providers | **Stripe + PayPal/Venmo** | Two providers, two webhook pipelines, two payout accounts. Stripe is primary (card, Apple Pay, Google Pay, Link, Cash App Pay, Klarna/Affirm, ACH); PayPal adds PayPal + Venmo + Pay Later. |
| Door operations | **QR scan + paper check, both** | Scanner PWA for phones **and** a printable manifest per event, with a post-event reconciliation step so paper check-ins end up in the database. |
| Referral program | **Simple referral links in v1** | Every buyer gets a share link; referred orders are attributed; admin shows counts; KLP comps the free ticket manually. No automated payouts. |
| Stack | **Vercel + Neon Postgres + Drizzle** | Stays on the existing deploy pipeline. Schema lives in the repo. Staff auth via Auth.js magic links. |
| Annual volume | **~10,000 paid tickets/yr** (founder estimate, given as 2,000 × 5 events the day before Jammy Jam was cancelled — re-confirm; at 4 events the cost model's 5,000/yr scenario may be closer) | Sizes the cost model and the infra plan. Free tiers are not enough; Vercel Pro + Neon paid usage assumed. |
| Fee model | **Keep a buyer-paid service fee; KLP keeps the margin** | Fee is computed server-side and shown before payment. See cost doc for the schedule. |
| Sellable items | **GA/VIP tickets, table reservations, promo/flash-sale codes, hotel room add-on, merch/add-ons** | Generic "product" model with per-type behavior. Hotel rooms are the one item whose fulfillment is off-system — see risks. |
| Admin users | **KLP team (Kevin, Ryan, Holly) full admin** | Roles: `owner`, `admin`, `door`. Door staff get scanner-only logins. |

## Non-goals (v1)

- Reserved seating / seat maps. KLP events are GA + VIP areas + tables, not
  assigned seats.
- Multi-tenant / selling this to other promoters. One organizer.
- Native iOS/Android apps. The scanner is a PWA.
- Apple Wallet / Google Wallet passes (v1.1 — needs Apple developer cert).
- Marketplace discovery (Eventbrite-style listing). KLP's traffic comes
  from their own social + microsites, per [../customers/attendees.md](../customers/attendees.md).

## System overview

```
                     ┌──────────────────────────────────────────────┐
                     │  Next.js app (Vercel)                         │
  Buyer ──browser──▶ │  /events/<slug>        public event + tiers   │
                     │  /checkout/<orderId>   Stripe Payment Element │
                     │                        + Express Checkout     │
                     │                        + PayPal buttons       │
                     │  /t/<code>             ticket page (QR)       │
                     │  /r/<refCode>          referral landing       │
  Door staff ──PWA─▶ │  /door                 scanner + name lookup  │
  KLP team ────────▶ │  /admin/*              events, tiers, orders, │
                     │                        codes, exports, dash   │
                     │  /api/webhooks/stripe  ┐ source of truth for  │
                     │  /api/webhooks/paypal  ┘ "paid"               │
                     └───────┬──────────┬───────────┬────────────────┘
                             │          │           │
                     Neon Postgres   Stripe      PayPal        Resend (email)
                     (Drizzle)       (+Radar)    (Checkout)    Twilio SMS (opt.)
```

Everything is one deployable. Serverless functions handle checkout, webhooks,
scanning, admin. No separate API service (decided: not worth running until a
second client app exists).

## Stack

| Layer | Choice | Why |
|---|---|---|
| App | Next.js (App Router), same codebase pattern as `demos/v1-landing-page/` | Already deployed, already brand-styled, already ships schema.org/llms.txt. |
| Database | Neon Postgres via Vercel Marketplace integration | Serverless Postgres, branches per preview deploy, pay-per-use. |
| ORM / migrations | Drizzle | Schema as code in the repo; `drizzle-kit` migrations reviewed in PRs. |
| Payments (primary) | Stripe: Payment Element + Express Checkout Element, PaymentIntents API | One integration exposes card, Apple Pay, Google Pay, Link, Cash App Pay, Klarna, Affirm, ACH. Radar fraud screening included at standard pricing. |
| Payments (secondary) | PayPal JS SDK (Smart Buttons) + Orders API v2 | PayPal, Venmo, Pay Later. Server-side create + capture; webhook confirms. |
| Staff auth | Auth.js (next-auth) with email magic links; roles in DB | No passwords to manage; KLP staff are 3–6 people. Passkeys as an optional second factor later. |
| Email | Resend + React Email templates | Ticket delivery, receipts, reminders. Dedicated sending domain (e.g. `tickets.kevinlarsonpresents.com`) with SPF/DKIM/DMARC. |
| SMS (optional) | Twilio | Day-of reminders. Off by default; costs per message. |
| QR generation | `qrcode` (server-side PNG/SVG) | Rendered into the email and the `/t/<code>` page. |
| QR scanning | Browser `BarcodeDetector` API with `@zxing/browser` fallback | No app store. Works in Safari/Chrome on modern phones. |
| PDFs | `@react-pdf/renderer` | Printable door manifest; optional PDF ticket attachment. |
| Background jobs | Vercel Cron + idempotent job routes | Expire unpaid orders, send reminders, nightly reconciliation. |
| Observability | Vercel logs + Sentry (free tier) | Webhook failures must page someone. |

Tools to connect when we start building (found in the MCP registry, not
connected yet): **Stripe** (`stripe_implementation_planner`, docs search,
read/write API), **PayPal**, and the **Twilio developer kit** plugin if SMS
is switched on.

## Data model

Drizzle schema, Postgres. Money is stored in **integer cents**. All ids are
UUIDs except public-facing codes.

```
events            id, slug, name, starts_at, ends_at, venue_name, venue_address,
                  timezone, age_restriction, status (draft|on_sale|sold_out|past|cancelled),
                  refund_policy_text, sales_tax_rate_bp (nullable), created_at, updated_at

products          id, event_id, type (ticket|table|addon|hotel_room|merch),
                  name, description, price_cents, fee_cents_override (nullable),
                  quantity_total, quantity_sold, quantity_held,
                  max_per_order, min_per_order, seats_per_unit (tables: 4),
                  grants_entry (bool — tables and hotel rooms don't),
                  sale_starts_at, sale_ends_at, sort_order, hidden (bool)

orders            id, public_id (short code for receipts), event_id, status
                  (pending|paid|refunded|partially_refunded|expired|cancelled),
                  buyer_email, buyer_name, buyer_phone,
                  subtotal_cents, service_fee_cents, tax_cents, discount_cents, total_cents,
                  promo_code_id, referral_code_used, referral_code_issued,
                  provider (stripe|paypal|door|comp), provider_ref (pi_… / PayPal order id),
                  hold_expires_at, paid_at, created_at, ip, user_agent

order_items       id, order_id, product_id, quantity, unit_price_cents,
                  unit_fee_cents, line_total_cents

tickets           id, order_id, product_id, code (public, 12 chars, unique),
                  attendee_name (nullable — buyer can assign later),
                  status (valid|checked_in|void|refunded),
                  checked_in_at, checked_in_by (staff id), check_in_method (scan|paper|manual)

promo_codes       id, code, event_id (nullable = all events), kind (percent|fixed),
                  amount, applies_to_product_ids[], starts_at, ends_at,
                  max_uses, uses, max_per_customer, active

referrals         id, code (public), order_id (issuing order), buyer_email,
                  event_id, clicks, referred_orders_count, comp_issued_at (nullable)

refunds           id, order_id, provider_ref, amount_cents, reason, issued_by, created_at

staff_users       id, email, name, role (owner|admin|door), active
                  (Auth.js tables: accounts, sessions, verification_tokens)

webhook_events    id, provider, provider_event_id (unique), type, payload jsonb,
                  processed_at, error — idempotency + audit

audit_log         id, actor (staff id | 'system'), action, entity, entity_id, diff jsonb, at
```

Inventory rule: `available = quantity_total − quantity_sold − quantity_held`.
Holds are taken when an order is created and released when it is paid
(converted to sold) or expires (10 minutes; Cron sweeps every minute).
Holds and conversions run in a single transaction with `SELECT … FOR UPDATE`
on the product row so two buyers can't both get the last VIP.

## Core flows

### 1. Browse → checkout → pay → ticket

1. `/events/<slug>` shows the tiers from `products` (on sale, not hidden)
   with real prices and the service fee disclosed ("+ $5.15 fee").
   Sold-out tiers stay visible, greyed, so the flash-sale urgency KLP uses
   today still works.
2. Buyer picks quantities → `POST /api/orders` validates quantities and
   sale windows, applies a promo code if given, computes fee + tax
   server-side, takes inventory holds, creates the `order` in `pending`.
3. `/checkout/<orderId>` renders:
   - buyer name / email / phone,
   - per-ticket attendee names (optional, can be filled after purchase),
   - **Express Checkout Element** (Apple Pay / Google Pay / Link buttons up
     top — these are the one-tap paths and should be first),
   - **Payment Element** (card, Cash App Pay, Klarna, Affirm, ACH),
   - **PayPal / Venmo / Pay Later** buttons.
   A Stripe PaymentIntent is created for the order total with
   `metadata.order_id`; the PayPal order is created lazily only if the
   buyer clicks a PayPal button. Both carry the same `order_id`.
4. On client-side success the buyer is sent to `/orders/<publicId>` which
   polls until the order is `paid`.
5. **Webhooks are the source of truth.** `payment_intent.succeeded`
   (Stripe) or `PAYMENT.CAPTURE.COMPLETED` (PayPal) → in one transaction:
   verify signature, dedupe on `provider_event_id`, verify amount matches
   `orders.total_cents`, flip order to `paid`, convert holds to sold,
   generate one `ticket` row per entry-granting unit (a table with
   `seats_per_unit=4` and `grants_entry=false` generates a single
   "table" ticket, not 4 entries — matching how KLP sells them today:
   "Tickets for entry not included").
6. Send the confirmation email: receipt + one QR per ticket + link to
   `/t/<code>`. Email send is a job, retried; the order is `paid` whether
   or not the email lands.

Order expiry: Cron marks `pending` orders past `hold_expires_at` as
`expired`, releases holds, and cancels the PaymentIntent.

### 2. Ticket format

- `code` is 12 random base32 characters. The QR encodes
  `https://<site>/t/<code>?s=<hmac>` where `s` is a truncated HMAC-SHA256
  of the code with a server secret. Scanning validates the signature
  first (rejects forged/altered codes without a DB hit), then the DB.
- `/t/<code>` (no signature required) shows the ticket to the buyer: event,
  tier, attendee name, big QR, "Add attendee name" form, refund-policy
  text. The buyer can forward this link; the QR is single-use regardless.
- Wallet passes: v1.1.

### 3. Door: QR scan + paper, reconciled

**Scanner PWA (`/door`)** — `door`-role login (magic link once, then a
long session on that device).

- Pick the event. The device downloads the event's attendee manifest
  (ticket code hashes + names + tier + status) into IndexedDB so scanning
  keeps working if hotel Wi-Fi/cell drops.
- Scan → local signature check → local status check → optimistic
  "ADMITTED — VIP — Jane D." in green, or red "ALREADY SCANNED 9:41 PM by
  Holly" / "VOID / REFUNDED" / "WRONG EVENT". Writes a check-in record and
  syncs to the server immediately when online, queues when offline.
- Name search fallback for buyers who lost the email: type a last name,
  see matches, tap to admit (records `check_in_method=manual`).
- Conflict rule: server wins. If two devices admit the same ticket while
  both offline, the later sync gets a "duplicate check-in" flag in the
  admin report rather than silently double-counting.

**Paper manifest** — admin → event → "Print door list" generates a PDF:
alphabetical by last name, columns for tier, ticket code (short), qty,
and a checkbox. Generated at print time and stamped with the timestamp so
staff know how stale it is; anyone who bought after printing won't be on
it (the scanner still has them).

**Reconciliation** — after the event, admin → event → "Reconcile paper
check-ins": a list of every ticket *not* checked in, with a checkbox per
row; staff tick the ones that were admitted from paper. Marks
`check_in_method=paper`. Admin shows the final attendance number with a
breakdown by method so the count is honest.

**Door sales** (optional, not yet decided) — two realistic options, since
Tap to Pay on iPhone/Android needs a native SDK and won't run in a PWA:
(a) a "Sell at door" screen that creates an order and shows a QR the
buyer scans to pay on their own phone; (b) a Stripe Terminal reader
(BBPOS WisePOS E, ~$249) driven from the door PWA over the Terminal JS
SDK, 2.7% + 5¢ in-person rate. Either way the sale lands in the same
`orders` table.

### 4. Refunds, transfers, cancellations

- Admin → order → "Refund" (full or per-line). Issues the refund on the
  original provider, voids the tickets, writes `refunds` + `audit_log`,
  emails the buyer. Stripe and PayPal keep their processing fees on
  refunds — the cost doc accounts for this.
- Attendee name change: buyer self-serve on `/t/<code>` up to the event
  start; that's the "transfer" in v1.
- Event cancellation: admin action that bulk-refunds every `paid` order
  for the event, throttled to stay under provider rate limits, with a
  progress view.
- Disputes/chargebacks: `charge.dispute.created` webhook voids the
  ticket(s) and flags the order; admin sees a "Disputed" list with the
  evidence we can auto-attach (scan timestamp, IP, email opens).

### 5. Promo / flash-sale codes

Matches KLP's current "Flash Sale 15% off" pattern. Percent or fixed
amount, optional product restriction, start/end window, max total uses,
max per email. Validated server-side at order creation and re-validated
at webhook time (a code that hit its cap between checkout start and
payment is honored — the buyer already saw the price — but logged).
Public tier names like "Flash Sale GA — 15% off" remain possible as
separate products, which is how it's done on TicketFairy today; codes are
the cleaner tool.

### 6. Referrals (simple)

- Every paid order issues a `referrals.code` and the confirmation email
  says "Share this link — refer 8 friends and your ticket's on us."
- `/r/<code>` sets a first-party cookie (30 days) and redirects to the
  event page. Any order completed with that cookie writes
  `referral_code_used`.
- Admin → event → Referrals: leaderboard with click and paid-order counts,
  "Issue comp" button that creates a `provider=comp` order with a free
  ticket and stamps `comp_issued_at`. Manual on purpose in v1 — KLP
  decides who qualifies (the 8-friend rule has fine print they own).

### 7. Tables, add-ons, hotel rooms, merch

All are `products` with a `type`:

- **table** — `seats_per_unit`, `grants_entry=false`, generates a single
  table ticket that door staff scan to seat the party. Sold with a note
  that entry tickets are separate (today's real wording).
- **addon** / **merch** — `grants_entry=false`, no ticket, appears on the
  order and on a per-event "Add-ons pickup" list in admin. Can be
  restricted to "only with a ticket in the same order".
- **hotel_room** — *sold* like an add-on (fixed inventory of discounted
  rooms, one "room ticket" per unit), but *fulfilled* off-system: the
  hotel's group block is the hotel's system. Admin exports the room
  purchasers list for KLP to hand to the hotel. This is the item with
  real operational risk — see below. If the hotel would rather keep its
  own booking link (as today), the product type stays unused and the
  event page keeps the link.

### 8. Admin (`/admin`)

Auth.js magic-link login, roles enforced in middleware.

- **Dashboard** — per-event: gross, fees collected, net after processing,
  tickets sold by tier, sales-by-day sparkline, check-in progress on
  event night.
- **Events** — create/edit; duplicate last year's event as a starting
  point (KLP's 4 events recur annually).
- **Products** — tiers, prices, inventory, sale windows, hidden/visible,
  drag-to-reorder.
- **Orders** — search by name/email/code; refund; resend email; add note.
- **Promo codes**, **Referrals**, **Door list**, **Reconcile**.
- **Exports** — attendees CSV (for email marketing), orders CSV (for
  bookkeeping), add-on pickup list, hotel room list.
- **Staff** — invite by email, set role, deactivate.
- **Settings** — fee schedule, refund policy text, sending domain, tax
  rate per event (nullable; see open questions).

Every mutation writes `audit_log`.

## Payments detail

- **PCI scope stays SAQ-A**: card data only ever touches Stripe's and
  PayPal's iframes. We never see, log, or store a PAN.
- **Amount verification**: the webhook handler compares the provider's
  captured amount to `orders.total_cents` and refuses to mark paid on a
  mismatch (alerts instead). Prevents client-side tampering with the
  PaymentIntent.
- **Idempotency**: PaymentIntent creation uses `order_id` as the
  idempotency key; webhook handling dedupes on `provider_event_id`.
- **Fee line**: computed server-side from the fee schedule in settings
  (see cost doc: default `$3.50 + 3%` per ticket), never from the client.
- **Payouts**: KLP owns both the Stripe and the PayPal business accounts.
  We are never the merchant of record. Account creation and bank
  connection are done by KLP themselves (we don't handle their
  credentials or banking details).
- **Radar**: standard rules on. Add a rule to block > 10 tickets per
  card per event unless an admin flag is set (tables/group buys).
- **Klarna/Affirm**: enabled in the Stripe Dashboard, appear
  automatically in the Payment Element for eligible amounts (VIP at
  $129+ is where this matters).

## Security, privacy, compliance

- Webhook signatures verified on every call; raw body preserved.
- Rate limits on `/api/orders`, promo-code validation, and `/door`
  name search.
- Admin behind Auth.js + role middleware; magic links expire in 10 min;
  door sessions bound to the device and revocable from Staff page.
- Secrets in Vercel env vars, never in the repo. Preview deploys use
  Stripe/PayPal **sandbox** keys and a Neon branch.
- Buyer data: name, email, phone, order history. Retention policy and
  "delete my data" handled manually via admin in v1 (Colorado Privacy Act
  applies above 100k consumers/yr — KLP is under that, but we still
  don't hoard).
- 21+ events: age acknowledgement checkbox at checkout (text is KLP's),
  ID check remains at the door as today.

## AI / SEO tie-in

This is where working agreement #3 pays off: with prices in our own
database, every event's `schema.org/Event` JSON-LD gets a real `offers`
block (price, currency, availability, validFrom/through, url) instead of
the current link-out. The `/events.json` feed planned in Phase 2 of the
roadmap becomes trivial. Sold-out state and sale windows are also
machine-readable.

## Repo layout

New app at `demos/v2-ticketing/`, forked from `demos/v1-landing-page/`
so the client-facing v1 demo link keeps working untouched. Once the client
approves, v2 becomes the production candidate and v1 is archived. (Not
creating a new top-level folder — stays under `demos/` per CLAUDE.md.)

```
demos/v2-ticketing/
  app/                      pages + API routes (as v1, plus checkout/door/admin)
  db/schema.ts              Drizzle schema (tables above)
  db/migrations/
  lib/payments/stripe.ts    PaymentIntent create, webhook handler
  lib/payments/paypal.ts    Orders API create/capture, webhook handler
  lib/tickets.ts            code + HMAC, QR render
  lib/fees.ts               fee schedule — single source of truth
  lib/email/                React Email templates, Resend client
  scripts/import-tf.ts      one-time import of TicketFairy attendee CSV
```

## Delivery phases

| Phase | Scope | Exit criteria |
|---|---|---|
| **A — Checkout core** | Events/products in DB, order + holds, Stripe Payment Element + Express Checkout, webhook → tickets, confirmation email with QR, `/t/<code>`, order expiry cron. | Buy a GA and a VIP ticket end-to-end in Stripe test mode on desktop and phone; Apple Pay works on a real iPhone; webhook replay is idempotent. |
| **B — Admin + door** | Auth.js, roles, admin CRUD for events/products/orders, refunds, promo codes, exports, scanner PWA (online + offline), printable manifest, reconciliation. | KLP can create an event and a flash-sale code without us; a scanned ticket can't be scanned twice across two phones; paper reconciliation changes the attendance number correctly. |
| **C — Second provider + growth** | PayPal/Venmo/Pay Later, referral links + leaderboard + manual comp, tables/add-ons/merch/hotel-room product types, event duplication. | PayPal sandbox purchase issues a ticket through the same path; refund on PayPal voids the ticket; referral cookie attribution survives a Safari session. |
| **D — Polish (optional)** | Wallet passes, door sales (reader or pay-by-QR), SMS reminders, dispute evidence automation, Sentry alerts. | — |

Cutover: **not before White Rose Gala goes on sale** for real (Dec 31) —
Paranormal Palace (Oct 31) is already selling on
TicketFairy and must not be disturbed mid-sale. Realistic first event on
the new system: **Denver Mardi Gras, Feb 27 2027**, with White Rose Gala
as a stretch if Phases A+B land by early November and KLP is comfortable
switching an on-sale event.

## Risks

- **Hotel-room add-on fulfillment is off-system.** If we sell a room and
  the hotel's block is out, KLP is refunding and apologizing. Recommend
  keeping the hotel's own booking link for v1 unless the hotel commits a
  fixed allotment in writing. Flagged, not decided — founder chose "all
  of the above" for scope.
- **We inherit buyer support.** TicketFairy answers "where's my ticket?"
  emails today. On our system that's KLP (with resend/refund tools in
  admin) — cost doc counts this as a soft cost.
- **Chargebacks land on KLP** ($15 Stripe, $20 PayPal, plus the ticket).
  Event tickets have a moderate dispute rate; scan timestamps are our
  best evidence.
- **Two providers = two reconciliations.** PayPal was a founder decision;
  the cost is real but bounded because both flow into the same `orders`.
- **Email deliverability** is now our problem. Warm the sending domain
  before the first on-sale; use a dedicated subdomain so marketing sends
  can't poison ticket delivery.
- **Losing TicketFairy's ambassador tooling** — v1 referral is simpler
  than what KLP has. Set expectations with the client explicitly.

## Open questions for the client (not ours to assume)

1. **Sales/admissions tax.** Does KLP collect any tax on tickets today
   (Colorado has no state admissions tax, but home-rule cities differ and
   the venues are in Denver and Greenwood Village)? Whatever their
   accountant says goes into `sales_tax_rate_bp` per event. We do not
   guess.
2. **Refund policy text** — we display it at checkout and on the ticket;
   it has to be theirs.
3. **Hotel room add-on** — sell rooms on our system, or keep the hotel's
   group link? (See risk above.)
4. **Stripe + PayPal accounts** — KLP creates both, connects their bank,
   and invites us as a developer. Timing affects Phase A.
5. **First event to cut over** — Mardi Gras (safe) vs White Rose Gala
   (aggressive).
6. **TicketFairy attendee export** — can they export past buyers so we
   can seed the email list and the referral history?
7. **Door sales** — wanted at all, and if so, reader hardware or
   pay-by-QR?
