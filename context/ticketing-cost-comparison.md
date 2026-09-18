# Ticketing cost comparison — custom system vs Eventbrite vs TicketFairy

Companion to [../specs/ticketing-system.md](../specs/ticketing-system.md).
Every rate below was pulled from the provider's own pricing page on
**2026-09-17**; re-check before putting these numbers in front of the
client, because all three providers change fees roughly yearly.

## The one thing to get right in the sales conversation

**KLP does not pay ticketing fees today — their buyers do.** TicketFairy
(the platform every KLP microsite links to) adds its fee on top of the
ticket price, "incl. fees" is shown at checkout, and KLP receives the
face value. So a custom system does not "cut a cost off KLP's P&L." It
does one of two things, and the client picks which:

1. **Keep charging a buyer-paid fee, and keep it.** The ~$70k/yr that
   currently goes to TicketFairy becomes KLP's, minus real processing
   costs. This is new margin. (Founder's chosen model.)
2. **Lower the price buyers see.** Same net to KLP as today, tickets
   look ~9–10% cheaper. A marketing lever, not a margin one.

Both are modeled below. Either way the number is large because the volume
is: ~10,000 paid tickets a year.

## Rates (verified 2026-09-17)

| Provider | Fee | Who pays by default | Source |
|---|---|---|---|
| **TicketFairy** (current) | 10% of ticket ($20–$99.99); 9% ($100–$249.99); 8% ($250–$499.99); $2.00 minimum; **processing included** | Buyer | [ticketfairy.com/us/event-ticketing/pricing](https://www.ticketfairy.com/us/event-ticketing/pricing) |
| **Eventbrite** | 3.7% + $1.79 per ticket service fee **plus** 2.9% payment processing per order | Buyer (organizer may absorb) | [eventbrite.com/organizer/pricing](https://www.eventbrite.com/organizer/pricing/) |
| **Stripe** (custom system, primary) | 2.9% + 30¢ per transaction — same rate for cards, Apple Pay, Google Pay, Link. Klarna 5.99% + 30¢. ACH 0.8% capped $5. Disputes $15. In-person (Terminal) 2.7% + 5¢. | KLP (we choose whether to pass through) | [stripe.com/pricing](https://stripe.com/pricing) |
| **PayPal / Venmo** (custom system, secondary) | 3.49% + 49¢. Pay Later 4.99% + 49¢. Chargeback $20. | KLP | [paypal.com/us/business/paypal-business-fees](https://www.paypal.com/us/business/paypal-business-fees) |

Infra for the custom system (annual, at 10k tickets/yr):

| Item | $/yr | Note |
|---|---|---|
| Vercel Pro | 240 | Hobby plan is non-commercial; Pro is $20/mo per seat. Source: [vercel.com/pricing](https://vercel.com/pricing) |
| Neon Postgres (Launch, pay-per-use) | ~120 | $0.106/CU-hour + $0.35/GB-mo; this workload is tiny. Source: [neon.com/pricing](https://neon.com/pricing) |
| Resend (email) | 240 | Pro tier; ticket + reminder volume spikes around each event exceed the free 3k/mo |
| Domain / DNS | 20 | Sending subdomain on the existing domain |
| Monitoring / backups / misc | 120 | Sentry free tier + Neon PITR |
| **Total infra** | **~$740** | vs. $0 platform infra today (TicketFairy hosts it) |

Not in the table because they're ours to price, not the market's: the
**one-time build** and an **ongoing support retainer**. Both are inputs to
the [pricing plan](../ROADMAP.md#pricing-plan-for-website-projects-not-started-needed-before-phase-3)
the roadmap already calls for. Payback math is at the bottom.

## Per-ticket fees at KLP's real price points

Base prices are reverse-engineered from live "incl. fees" prices on
TicketFairy (2026-09-17): Paranormal Palace GA **$60.50** = $55.00 + 10%;
VIP **$140.61** = $129.00 + 9%; tables **$163.50** = $150.00 + 9%; White
Rose Gala **$109** = $100 + 9%. (The bands line up exactly, which is how
we know the base prices.)

| Ticket | TicketFairy | Eventbrite | Stripe only, no fee line | PayPal only, no fee line |
|---|---|---|---|---|
| GA $55 | **$5.50** | $5.42–$5.53¹ | $1.90 | $2.41 |
| VIP $129 | **$11.61** | $10.30–$10.49¹ | $4.04 | $4.99 |
| Blended (75% GA / 25% VIP) | **$7.03** | ~$6.64 | $2.43 | $3.06 |

¹ Eventbrite's 2.9% processing applies to the fee-inclusive order total when
fees are passed to the buyer; the range shows processing on ticket-only vs
on the full total.

Read: a $55 GA ticket carries **$5.50** of fee today. Raw processing on
our system is **$1.90**. The $3.60 gap, times 7,500 GA tickets, is where
the money is.

## Annual scenarios

Assumptions: 75% GA at $55 / 25% VIP at $129; on the custom system 85% of
buyers use Stripe rails (card/Apple Pay/Google Pay/Link) and 15% use
PayPal/Venmo; infra $740/yr. Refund and chargeback costs are excluded
from all columns equally (see soft costs). Every number below comes from
[ticketing-fee-model.py](ticketing-fee-model.py) — edit its assumptions
block and re-run rather than editing the tables by hand.

### Fees buyers pay today vs. what they'd pay on Eventbrite

| Tickets/yr | TicketFairy (today) | Eventbrite |
|---|---|---|
| 2,500 | $17,569 | $16,602 |
| 5,000 | $35,138 | $33,205 |
| **10,000** | **$70,275** | $66,410 |

Eventbrite is *not* materially cheaper than what KLP has; switching
platforms is not the win. Owning the checkout is.

### Custom system — three ways to set the fee line

**Option 1 — match today's fee exactly (buyer sees no change).**
KLP charges what TicketFairy charges now and keeps the difference.

| Tickets/yr | Fee revenue | Processing (Stripe+PayPal) | Infra | **New margin to KLP** |
|---|---|---|---|---|
| 2,500 | $17,569 | $6,838 | $740 | **$9,991** |
| 5,000 | $35,138 | $13,675 | $740 | **$20,722** |
| **10,000** | **$70,275** | **$27,351** | **$740** | **$42,184** |

**Option 2 — founder's chosen schedule: $3.50 + 3% per ticket.**
Slightly cheaper for buyers (GA $60.50 → $60.15, VIP $140.61 → $136.37),
still covers processing with margin.

| Tickets/yr | Fee revenue | Processing | Infra | **New margin to KLP** |
|---|---|---|---|---|
| 2,500 | $14,262 | $6,739 | $740 | **$6,784** |
| 5,000 | $28,525 | $13,478 | $740 | **$14,307** |
| **10,000** | **$57,050** | **$26,955** | **$740** | **$29,355** |

**Option 3 — no fee line at all (KLP absorbs processing).**
Buyer pays $55 flat. KLP's cost vs. today:

| Tickets/yr | Processing + infra KLP now pays |
|---|---|
| 2,500 | $7,053 |
| 5,000 | $13,365 |
| **10,000** | **$25,990** |

…in exchange for tickets that look 9–10% cheaper than today. Worth
modeling against expected lift in conversion, which we can't estimate
without KLP's funnel data — not guessed here.

## Payback on the build

With Option 1 at 10k tickets/yr, KLP gains ~$42k/yr; with Option 2,
~$29k/yr. Whatever the build is priced at, payback is
`build cost ÷ annual margin`: a $30k build pays back in **~9 months
(Option 1)** or **~12 months (Option 2)**. A retainer for support comes
out of the same margin; at $500/mo it takes $6k/yr off those figures and
the case still holds comfortably at 5k tickets/yr, and gets thin below
~2,500.

The build price itself is a pricing-plan decision (see ROADMAP), not
something this doc asserts.

## Soft costs and what KLP gives up — be explicit with the client

| What TicketFairy does today | On the custom system |
|---|---|
| Answers "where's my ticket?" / refund emails from buyers | KLP's team, using resend/refund tools in admin. Estimate: an hour or two per event week. |
| Eats chargebacks and fraud screening | KLP pays $15 (Stripe) / $20 (PayPal) per dispute plus the lost ticket. Radar screening is included with Stripe; scan timestamps are the evidence. |
| Keeps processing on refunds hidden inside its fee | Stripe and PayPal keep their processing fee when we refund. On a $60.50 refund that's ~$2 KLP eats. |
| Ambassador / referral program with automated rewards | v1 is simple links + a leaderboard + manual comps. Automation is a later phase. |
| Promoter financing / advances (TicketFairy markets this) | Not replaced. Stripe Capital exists but is a separate underwriting decision. |
| Hosting, uptime, deliverability | Ours. Vercel + Neon are boring and reliable; email deliverability needs a warmed subdomain. |
| Existing event URLs and sales history | Old links keep working until the event passes; we import the attendee CSV for the email list if KLP can export it. |

None of these change the answer at 10k tickets/yr. They do mean the
pitch should be "you keep the fee" not "it's free."

## Bottom line for the deck

- Buyers currently hand **~$70k a year** to a ticketing platform on KLP's
  events.
- Raw payment processing for the same tickets on Stripe/PayPal is
  **~$27k**.
- A custom checkout lets KLP keep the **~$29k–$42k/yr** difference
  (depending on the fee schedule they pick), *and* puts real prices,
  availability and sale windows into the site's schema.org data where
  search engines and AI agents can read them.
- Eventbrite would not have helped: its fees on this mix are within 5% of
  TicketFairy's.
