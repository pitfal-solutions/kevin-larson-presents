"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getTiers, computeTotals, formatMoney, feeForUnit } from "../tickets-data";

function Stepper({ value, max, onChange, label }) {
  return (
    <div className="stepper" role="group" aria-label={`Quantity for ${label}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value === 0}
        aria-label={`Remove one ${label}`}
      >
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Add one ${label}`}
      >
        +
      </button>
    </div>
  );
}

function TierRow({ tier, qty, onChange }) {
  return (
    <li className="tier">
      <div className="tier__info">
        <h3 className="tier__name">{tier.name}</h3>
        <p className="tier__note">{tier.note}</p>
      </div>
      <div className="tier__price">
        <strong>{formatMoney(tier.priceCents)}</strong>
        <span>+ {formatMoney(feeForUnit(tier.priceCents))} fee</span>
      </div>
      <Stepper
        value={qty}
        max={tier.maxPerOrder}
        onChange={onChange}
        label={tier.name}
      />
    </li>
  );
}

export default function TicketTiers({ event }) {
  const router = useRouter();
  const tiers = getTiers(event.slug);
  const [cart, setCart] = useState({});

  const totals = useMemo(
    () => computeTotals(event.slug, cart, null),
    [event.slug, cart],
  );
  const hasItems = totals.lines.length > 0;

  function setQty(id, qty) {
    setCart((c) => {
      const next = { ...c };
      if (qty > 0) next[id] = qty;
      else delete next[id];
      return next;
    });
  }

  function goToCheckout() {
    const params = new URLSearchParams();
    for (const [id, qty] of Object.entries(cart)) params.set(id, String(qty));
    router.push(`/checkout/${event.slug}?${params.toString()}`);
  }

  if (tiers.salesStatus !== "on_sale") {
    return (
      <section id="tickets" className="section tickets">
        <p className="section__eyebrow">Tickets</p>
        <h2 className="section__title tickets__title">Sales closed for this year</h2>
        <p className="tickets__closed">
          {event.name} is {event.dateLabel}. Ticketing for the next one opens
          on this page — join the Members Club below to be first to know.
        </p>
      </section>
    );
  }

  return (
    <section id="tickets" className="section tickets">
      <div className="tickets__header">
        <div>
          <p className="section__eyebrow">Tickets</p>
          <h2 className="section__title tickets__title">Get In</h2>
        </div>
        <p className="tickets__meta">
          {event.dateLabel} · {event.venue} · {event.ageRestriction}
        </p>
      </div>

      <ul className="tier-list">
        {tiers.tickets.map((t) => (
          <TierRow
            key={t.id}
            tier={t}
            qty={cart[t.id] || 0}
            onChange={(q) => setQty(t.id, q)}
          />
        ))}
      </ul>

      {tiers.tables.length > 0 && (
        <>
          <h3 className="tickets__subhead">Table Reservations</h3>
          <p className="tickets__subnote">
            Tables seat 4 and don&rsquo;t include entry &mdash; every guest
            still needs a ticket.
          </p>
          <ul className="tier-list">
            {tiers.tables.map((t) => (
              <TierRow
                key={t.id}
                tier={t}
                qty={cart[t.id] || 0}
                onChange={(q) => setQty(t.id, q)}
              />
            ))}
          </ul>
        </>
      )}

      <div className={`tickets__bar${hasItems ? " tickets__bar--active" : ""}`}>
        <div className="tickets__bar-summary">
          {hasItems ? (
            <>
              <strong>{formatMoney(totals.total)}</strong>
              <span>
                {totals.ticketCount > 0 &&
                  `${totals.ticketCount} ticket${totals.ticketCount === 1 ? "" : "s"}`}
                {totals.ticketCount > 0 && totals.tableCount > 0 && " · "}
                {totals.tableCount > 0 &&
                  `${totals.tableCount} table${totals.tableCount === 1 ? "" : "s"}`}
                {" · incl. fees"}
              </span>
            </>
          ) : (
            <span>Select tickets to continue</span>
          )}
        </div>
        <button
          type="button"
          className="btn btn--primary"
          disabled={!hasItems}
          onClick={goToCheckout}
        >
          Continue to Checkout
        </button>
      </div>

      <p className="tickets__source">
        Demo checkout &mdash; no payment is taken. Prices are the current
        public prices for this event; tickets are sold today via{" "}
        <a href={tiers.sourceUrl} target="_blank" rel="noopener noreferrer">
          TicketFairy
        </a>
        .
      </p>
    </section>
  );
}
