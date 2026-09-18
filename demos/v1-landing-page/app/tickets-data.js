// Ticket tiers for the demo checkout flow. DEMO ONLY — no payment is taken.
//
// Prices are KLP's real, public prices pulled from each event's live
// TicketFairy page on 2026-09-17, with TicketFairy's buyer-paid fee backed
// out (10% under $100, 9% from $100–$249.99 — every listed "incl. fees"
// price divides out to a round base price, which is how we know). Tier
// names and descriptions are theirs. These are flash-sale prices and WILL
// drift — re-check before treating them as current. See
// /context/data-sources.md and /specs/ticketing-system.md in the repo root.
//
// Fee schedule below is the one chosen for the real system ($3.50 + 3% per
// unit, buyer-paid) — see /context/ticketing-cost-comparison.md, Option 2.

export const FEE_FLAT_CENTS = 350;
export const FEE_PCT = 0.03;

// One clearly-labeled demo promo code, mirroring the "Flash Sale 15% off"
// pattern KLP runs on TicketFairy. Applies to tickets, not tables.
export const DEMO_PROMO = { code: "FLASH15", percentOff: 15 };

export const HOLD_MINUTES = 10;

const tiers = {
  "white-rose-gala": {
    salesStatus: "on_sale",
    sourceUrl:
      "https://www.ticketfairy.com/event/denvernewyearseve-gatsbyswhiterosegala2026-2027-20260602155636728",
    tickets: [
      {
        id: "wrg-vip",
        name: "VIP",
        note: "One ticket, no tiers, no upsell. It's NYE at the Ritz — everyone is a VIP.",
        priceCents: 10000,
        maxPerOrder: 10,
      },
    ],
    tables: [
      {
        id: "wrg-table-ballroom",
        name: "Table Reservation — Ballroom",
        note: "Amidst the live band and DJs. Seats 4. Entry tickets sold separately.",
        priceCents: 15000,
        seats: 4,
        maxPerOrder: 2,
      },
      {
        id: "wrg-table-speakeasy",
        name: "Table Reservation — Speak Easy",
        note: "Amidst the DJs. Seats 4. Entry tickets sold separately.",
        priceCents: 15000,
        seats: 4,
        maxPerOrder: 2,
      },
    ],
  },
  "denver-mardi-gras": {
    salesStatus: "on_sale",
    sourceUrl:
      "https://www.ticketfairy.com/event/denvermardigras2027hoteltakeover-20260718182148536",
    tickets: [
      {
        id: "dmg-krewe",
        name: "Krewe Pass — General Admission",
        note: "Beads, entertainment access, drink specials. First release, limited quantity.",
        priceCents: 4000,
        maxPerOrder: 10,
      },
      {
        id: "dmg-royal",
        name: "Royal Pass — VIP, Drinks Included",
        note: "Everything in Krewe, plus beer, wine and select cocktails all night, VIP-only spaces, no-line bars.",
        priceCents: 12500,
        maxPerOrder: 10,
      },
    ],
    tables: [
      {
        id: "dmg-table-main",
        name: "Main Floor Table",
        note: "Seats 4. Each guest needs an event ticket.",
        priceCents: 10000,
        seats: 4,
        maxPerOrder: 2,
      },
      {
        id: "dmg-table-balcony",
        name: "Balcony Table — Above Dance Floor",
        note: "High demand. Seats 4. Each guest needs an event ticket.",
        priceCents: 10000,
        seats: 4,
        maxPerOrder: 2,
      },
      {
        id: "dmg-table-tower",
        name: "3rd Floor Tower Overlook Table",
        note: "Seats 4. Each guest needs an event ticket.",
        priceCents: 10000,
        seats: 4,
        maxPerOrder: 2,
      },
    ],
  },
  "denver-derby-day": {
    salesStatus: "on_sale",
    sourceUrl:
      "https://www.ticketfairy.com/event/denverderbyday2027theritz-carltondenver-20260719210133450",
    tickets: [
      {
        id: "ddd-full",
        name: "Early Bird — Derby Day + After Party",
        note: "1 PM–8 PM. The race, Best Dressed runway, mint juleps, DJs and dancing.",
        priceCents: 5500,
        maxPerOrder: 10,
      },
      {
        id: "ddd-day",
        name: "Early Bird — Derby Day",
        note: "1 PM–5:30 PM. Watch party on the terrace and ballroom.",
        priceCents: 4200,
        maxPerOrder: 10,
      },
      {
        id: "ddd-after",
        name: "After Party Only",
        note: "5:30 PM–8 PM.",
        priceCents: 3500,
        maxPerOrder: 10,
      },
    ],
    tables: [
      {
        id: "ddd-table-terrace",
        name: "Table on Terrace — Watch Party",
        note: "Your group's home base all day. Seats 4. Event tickets required.",
        priceCents: 15000,
        seats: 4,
        maxPerOrder: 2,
      },
      {
        id: "ddd-table-ballroom",
        name: "Table in Ballroom — Watch Party",
        note: "Your group's home base all day. Seats 4. Event tickets required.",
        priceCents: 15000,
        seats: 4,
        maxPerOrder: 2,
      },
    ],
  },
  "paranormal-palace": {
    salesStatus: "on_sale",
    sourceUrl:
      "https://www.ticketfairy.com/event/sharethiseventdenverhalloween2026-paranormalpalace-20260602153241665",
    tickets: [
      {
        id: "pp-ga",
        name: "General Admission",
        note: "Costume contest, haunted decor, multiple floors of DJs.",
        priceCents: 5500,
        maxPerOrder: 10,
      },
      {
        id: "pp-vip",
        name: "VIP",
        note: "Open bar. 4 VIP areas with private bars, express entry, private bathrooms.",
        priceCents: 12900,
        maxPerOrder: 10,
      },
    ],
    tables: [
      {
        id: "pp-table-ballroom",
        name: "VIP Table — Ballroom",
        note: "Seats 4. Tickets for entry not included.",
        priceCents: 15000,
        seats: 4,
        maxPerOrder: 2,
      },
      {
        id: "pp-table-atrium",
        name: "Table — Atrium",
        note: "Seats 4. Tickets for entry not included.",
        priceCents: 15000,
        seats: 4,
        maxPerOrder: 2,
      },
      {
        id: "pp-table-balcony",
        name: "Table — Balcony, above dance floor",
        note: "Seats 4. Tickets for entry not included.",
        priceCents: 15000,
        seats: 4,
        maxPerOrder: 2,
      },
    ],
  },
};

export function getTiers(slug) {
  return tiers[slug] || { salesStatus: "closed", tickets: [], tables: [] };
}

export function getTier(slug, tierId) {
  const t = getTiers(slug);
  return [...t.tickets, ...t.tables].find((x) => x.id === tierId) || null;
}

export function isTable(slug, tierId) {
  return getTiers(slug).tables.some((x) => x.id === tierId);
}

export function feeForUnit(priceCents) {
  return Math.round(FEE_FLAT_CENTS + priceCents * FEE_PCT);
}

export function formatMoney(cents) {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

// Totals for a cart of { tierId: qty }. Promo applies to ticket lines only.
export function computeTotals(slug, cart, promoCode) {
  const lines = [];
  let subtotal = 0;
  let fees = 0;
  let discount = 0;
  const promo =
    promoCode && promoCode.trim().toUpperCase() === DEMO_PROMO.code
      ? DEMO_PROMO
      : null;

  for (const [tierId, qty] of Object.entries(cart)) {
    const tier = getTier(slug, tierId);
    if (!tier || !qty) continue;
    const table = isTable(slug, tierId);
    const lineSubtotal = tier.priceCents * qty;
    const lineDiscount =
      promo && !table
        ? Math.round(lineSubtotal * (promo.percentOff / 100))
        : 0;
    const lineFee = feeForUnit(tier.priceCents) * qty;
    lines.push({
      tierId,
      name: tier.name,
      qty,
      unitCents: tier.priceCents,
      isTable: table,
      seats: tier.seats,
      lineSubtotal,
      lineDiscount,
      lineFee,
    });
    subtotal += lineSubtotal;
    discount += lineDiscount;
    fees += lineFee;
  }

  return {
    lines,
    subtotal,
    discount,
    fees,
    total: subtotal - discount + fees,
    promo,
    ticketCount: lines.filter((l) => !l.isTable).reduce((n, l) => n + l.qty, 0),
    tableCount: lines.filter((l) => l.isTable).reduce((n, l) => n + l.qty, 0),
  };
}

// schema.org offers for an event's JSON-LD. Real tier prices become an
// AggregateOffer so search engines and AI agents can read the price range;
// events not on sale keep a plain link-out offer.
export function eventOffersJsonLd(event, siteUrl) {
  const tiers = getTiers(event.slug);
  const url = `${siteUrl}/events/${event.slug}#tickets`;
  if (tiers.salesStatus !== "on_sale" || tiers.tickets.length === 0) {
    return {
      "@type": "Offer",
      url: event.ticketUrl,
      availability: "https://schema.org/SoldOut",
    };
  }
  const prices = tiers.tickets.map((t) => t.priceCents / 100);
  return {
    "@type": "AggregateOffer",
    url,
    priceCurrency: "USD",
    lowPrice: Math.min(...prices),
    highPrice: Math.max(...prices),
    offerCount: tiers.tickets.length,
    availability: "https://schema.org/InStock",
    offers: tiers.tickets.map((t) => ({
      "@type": "Offer",
      name: t.name,
      price: t.priceCents / 100,
      priceCurrency: "USD",
      url,
      availability: "https://schema.org/InStock",
    })),
  };
}
