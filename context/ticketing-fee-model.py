#!/usr/bin/env python3
"""Fee model behind ticketing-cost-comparison.md. Run: python3 context/ticketing-fee-model.py

Rates verified 2026-09-17 from each provider's pricing page. Base ticket prices are
reverse-engineered from live TicketFairy "incl. fees" prices the same day:
  GA $60.50 incl 10%  -> $55.00
  VIP $140.61 incl 9% -> $129.00
Edit the ASSUMPTIONS block and re-run; paste the output into the doc.
"""

# ---- ASSUMPTIONS ----------------------------------------------------------
GA, VIP = 55.00, 129.00          # base prices, USD
MIX_GA, MIX_VIP = 0.75, 0.25     # ticket mix
STRIPE_SHARE, PAYPAL_SHARE = 0.85, 0.15   # buyer payment-rail mix on the custom system
SCENARIOS = (2500, 5000, 10000)  # paid tickets per year
FIXED = {                        # custom-system infra, $/yr
    "Vercel Pro (1 seat)": 240,
    "Neon Launch (est. usage)": 120,
    "Resend Pro email": 240,
    "Domain/DNS": 20,
    "Monitoring/backups/misc": 120,
}
KLP_FEE_FLAT, KLP_FEE_PCT = 3.50, 0.03   # Option 2: founder's chosen buyer-paid schedule
# ---------------------------------------------------------------------------

def ticketfairy(p):  # buyer-paid, processing included, $2 minimum
    return max(2.00, p * 0.10 if p < 100 else p * 0.09 if p < 250 else p * 0.08)

def eventbrite(p, processing_on_total=False):  # 3.7% + $1.79 service + 2.9% processing
    service = p * 0.037 + 1.79
    return service + (p + service if processing_on_total else p) * 0.029

def stripe(total):   # 2.9% + 30c — same for card, Apple Pay, Google Pay, Link
    return total * 0.029 + 0.30

def paypal(total):   # 3.49% + 49c — PayPal and Venmo
    return total * 0.0349 + 0.49

def processing(total):
    return STRIPE_SHARE * stripe(total) + PAYPAL_SHARE * paypal(total)

def blend(f):
    return MIX_GA * f(GA) + MIX_VIP * f(VIP)

def klp_fee(p):
    return KLP_FEE_FLAT + KLP_FEE_PCT * p

infra = sum(FIXED.values())

print("Per-ticket fee at KLP's real price points")
for name, p in (("GA", GA), ("VIP", VIP)):
    print(f"  {name:3} ${p:6.2f}: TicketFairy ${ticketfairy(p):5.2f} | Eventbrite ${eventbrite(p):5.2f}-${eventbrite(p, True):5.2f}"
          f" | Stripe ${stripe(p):5.2f} | PayPal ${paypal(p):5.2f}")
print(f"  blended: TicketFairy ${blend(ticketfairy):.2f} | Eventbrite ${blend(eventbrite):.2f} | Stripe ${blend(stripe):.2f}")
print(f"\nInfra: ${infra}/yr  {FIXED}\n")

for n in SCENARIOS:
    tf = n * blend(ticketfairy)
    eb = n * blend(eventbrite)
    # Option 1: charge exactly today's fee; processing applies to fee-inclusive total
    o1_rev = tf
    o1_proc = n * blend(lambda p: processing(p + ticketfairy(p)))
    # Option 2: founder's schedule
    o2_rev = n * blend(klp_fee)
    o2_proc = n * blend(lambda p: processing(p + klp_fee(p)))
    # Option 3: no fee line, KLP absorbs
    o3_cost = n * blend(processing) + infra
    print(f"n = {n:,} tickets/yr")
    print(f"  fees buyers pay today (TicketFairy): ${tf:,.0f}   on Eventbrite: ${eb:,.0f}")
    print(f"  Option 1 match today's fee : revenue ${o1_rev:,.0f}  processing ${o1_proc:,.0f}  infra ${infra}  -> margin ${o1_rev - o1_proc - infra:,.0f}")
    print(f"  Option 2 ${KLP_FEE_FLAT:.2f}+{KLP_FEE_PCT:.0%}          : revenue ${o2_rev:,.0f}  processing ${o2_proc:,.0f}  infra ${infra}  -> margin ${o2_rev - o2_proc - infra:,.0f}")
    print(f"  Option 3 absorb            : KLP cost ${o3_cost:,.0f}/yr")
    print()
print(f"Option 2 buyer prices: GA ${GA + klp_fee(GA):.2f} (today $60.50)  VIP ${VIP + klp_fee(VIP):.2f} (today $140.61)")
