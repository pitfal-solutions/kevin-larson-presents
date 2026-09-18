"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  computeTotals,
  formatMoney,
  getTier,
  DEMO_PROMO,
  HOLD_MINUTES,
} from "../tickets-data";
import { saveOrder, newOrderId, newTicketCode } from "../demo-orders";

// Every method Stripe's Payment Element + Express Checkout Element and the
// PayPal SDK would surface. In the demo they're all the same fake button;
// in the real build each is a live provider — see /specs/ticketing-system.md.
const EXPRESS = [
  { id: "apple_pay", label: "Apple Pay", className: "pay-btn--apple" },
  { id: "google_pay", label: "G Pay", className: "pay-btn--google" },
  { id: "link", label: "Link", className: "pay-btn--link" },
];
const METHODS = [
  { id: "card", label: "Card" },
  { id: "paypal", label: "PayPal" },
  { id: "venmo", label: "Venmo" },
  { id: "cashapp", label: "Cash App" },
  { id: "klarna", label: "Klarna" },
];

function readCart(slug, params) {
  const cart = {};
  for (const [key, val] of params.entries()) {
    const qty = parseInt(val, 10);
    const tier = getTier(slug, key);
    if (tier && qty > 0) cart[key] = Math.min(qty, tier.maxPerOrder);
  }
  return cart;
}

function formatCountdown(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function CheckoutForm({ event }) {
  const router = useRouter();
  const params = useSearchParams();
  const cart = useMemo(() => readCart(event.slug, params), [event.slug, params]);

  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState("");
  const [promoError, setPromoError] = useState("");
  const [buyer, setBuyer] = useState({ name: "", email: "", phone: "" });
  const [attendees, setAttendees] = useState([]);
  const [ageOk, setAgeOk] = useState(false);
  const [method, setMethod] = useState("card");
  const [status, setStatus] = useState("idle"); // idle | processing
  const [error, setError] = useState("");
  const [holdEnds] = useState(() => Date.now() + HOLD_MINUTES * 60 * 1000);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const totals = useMemo(
    () => computeTotals(event.slug, cart, promoApplied),
    [event.slug, cart, promoApplied],
  );

  // One attendee-name field per entry ticket (tables don't grant entry).
  const ticketSlots = useMemo(
    () =>
      totals.lines
        .filter((l) => !l.isTable)
        .flatMap((l) => Array.from({ length: l.qty }, () => l.name)),
    [totals.lines],
  );
  useEffect(() => {
    setAttendees((a) => ticketSlots.map((_, i) => a[i] || ""));
  }, [ticketSlots]);

  if (totals.lines.length === 0) {
    return (
      <div className="checkout checkout--empty">
        <p>Your cart is empty.</p>
        <Link href={`/events/${event.slug}#tickets`} className="btn btn--primary">
          Choose tickets
        </Link>
      </div>
    );
  }

  function applyPromo(e) {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === DEMO_PROMO.code) {
      setPromoApplied(DEMO_PROMO.code);
      setPromoError("");
    } else {
      setPromoApplied("");
      setPromoError("That code isn't valid. (Demo code: FLASH15)");
    }
  }

  function pay(chosenMethod) {
    setError("");
    if (!buyer.name.trim() || !buyer.email.trim()) {
      setError("Name and email are required so we know where to send your tickets.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer.email.trim())) {
      setError("That email doesn't look right.");
      return;
    }
    if (!ageOk) {
      setError("Please confirm the age requirement and refund policy.");
      return;
    }
    setStatus("processing");

    // Simulated provider round-trip. Real flow: PaymentIntent confirm →
    // webhook → order paid → tickets issued.
    setTimeout(() => {
      const id = newOrderId();
      const tickets = [];
      let slot = 0;
      for (const line of totals.lines) {
        for (let i = 0; i < line.qty; i++) {
          tickets.push({
            code: newTicketCode(),
            tierId: line.tierId,
            tierName: line.name,
            isTable: line.isTable,
            seats: line.seats,
            attendeeName: line.isTable ? "" : attendees[slot++] || "",
          });
        }
      }
      saveOrder({
        id,
        eventSlug: event.slug,
        eventName: event.name,
        dateLabel: event.dateLabel,
        time: event.time,
        venue: event.venue,
        address: event.address,
        ageRestriction: event.ageRestriction,
        buyer: { ...buyer, name: buyer.name.trim(), email: buyer.email.trim() },
        method: chosenMethod,
        promo: totals.promo ? totals.promo.code : null,
        lines: totals.lines,
        subtotal: totals.subtotal,
        discount: totals.discount,
        fees: totals.fees,
        total: totals.total,
        tickets,
        paidAt: new Date().toISOString(),
      });
      router.push(`/orders/${id}`);
    }, 1400);
  }

  const processing = status === "processing";
  const remaining = holdEnds - now;

  return (
    <div className="checkout">
      <div className="checkout__main">
        <section className="checkout__block">
          <h2 className="checkout__heading">Your details</h2>
          <div className="field-grid">
            <label className="field">
              <span>Full name</span>
              <input
                type="text"
                autoComplete="name"
                value={buyer.name}
                onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
                disabled={processing}
              />
            </label>
            <label className="field">
              <span>Email — tickets are sent here</span>
              <input
                type="email"
                autoComplete="email"
                inputMode="email"
                value={buyer.email}
                onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
                disabled={processing}
              />
            </label>
            <label className="field">
              <span>Mobile (optional, for day-of updates)</span>
              <input
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={buyer.phone}
                onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
                disabled={processing}
              />
            </label>
          </div>
        </section>

        {ticketSlots.length > 0 && (
          <section className="checkout__block">
            <h2 className="checkout__heading">Who&rsquo;s coming</h2>
            <p className="checkout__hint">
              Optional now &mdash; names can be added from the ticket later.
            </p>
            <div className="field-grid">
              {ticketSlots.map((tierName, i) => (
                <label className="field" key={i}>
                  <span>
                    Ticket {i + 1} · {tierName}
                  </span>
                  <input
                    type="text"
                    placeholder={i === 0 ? buyer.name || "Attendee name" : "Attendee name"}
                    value={attendees[i] || ""}
                    onChange={(e) => {
                      const next = [...attendees];
                      next[i] = e.target.value;
                      setAttendees(next);
                    }}
                    disabled={processing}
                  />
                </label>
              ))}
            </div>
          </section>
        )}

        <section className="checkout__block">
          <h2 className="checkout__heading">Payment</h2>

          <div className="express-row" aria-label="Express checkout">
            {EXPRESS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`pay-btn ${m.className}`}
                onClick={() => pay(m.id)}
                disabled={processing}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="or-divider">
            <span>or pay with</span>
          </div>

          <div className="method-tabs" role="tablist">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={method === m.id}
                className={`method-tab${method === m.id ? " method-tab--active" : ""}`}
                onClick={() => setMethod(m.id)}
                disabled={processing}
              >
                {m.label}
              </button>
            ))}
          </div>

          {method === "card" ? (
            <div className="field-grid card-fields">
              <label className="field field--full">
                <span>Card number</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  autoComplete="off"
                  disabled={processing}
                />
              </label>
              <label className="field">
                <span>Expiry</span>
                <input type="text" inputMode="numeric" placeholder="MM / YY" autoComplete="off" disabled={processing} />
              </label>
              <label className="field">
                <span>CVC</span>
                <input type="text" inputMode="numeric" placeholder="123" autoComplete="off" disabled={processing} />
              </label>
              <label className="field">
                <span>ZIP</span>
                <input type="text" inputMode="numeric" placeholder="80202" autoComplete="off" disabled={processing} />
              </label>
              <p className="checkout__hint field--full">
                Demo &mdash; leave these blank or type anything. In the real
                build this is Stripe&rsquo;s secure card field; card numbers
                never touch our server.
              </p>
            </div>
          ) : (
            <p className="checkout__hint method-note">
              {method === "klarna"
                ? "Pay in 4 interest-free installments. You'd be sent to Klarna to confirm, then straight back here."
                : `You'd be sent to ${METHODS.find((m) => m.id === method).label} to approve, then straight back here.`}
            </p>
          )}

          <label className="checkbox">
            <input
              type="checkbox"
              checked={ageOk}
              onChange={(e) => setAgeOk(e.target.checked)}
              disabled={processing}
            />
            <span>
              This event is {event.ageRestriction}. Everyone attending will
              show valid photo ID at the door. I&rsquo;ve read the refund
              policy.
            </span>
          </label>

          {error && (
            <p className="checkout__error" role="alert">
              {error}
            </p>
          )}

          <button
            type="button"
            className="btn btn--primary checkout__pay"
            onClick={() => pay(method)}
            disabled={processing}
          >
            {processing ? (
              <>
                <span className="spinner" aria-hidden="true" /> Processing&hellip;
              </>
            ) : (
              `Pay ${formatMoney(totals.total)}`
            )}
          </button>
        </section>
      </div>

      <aside className="checkout__summary">
        <div className="summary-card">
          <p className="section__eyebrow">Order summary</p>
          <h2 className="summary-card__event">{event.name}</h2>
          <p className="summary-card__meta">
            {event.dateLabel} · {event.time}
            <br />
            {event.venue}
          </p>

          <ul className="summary-lines">
            {totals.lines.map((l) => (
              <li key={l.tierId}>
                <span>
                  {l.qty} × {l.name}
                </span>
                <span>{formatMoney(l.lineSubtotal)}</span>
              </li>
            ))}
          </ul>

          <form className="promo" onSubmit={applyPromo}>
            <input
              type="text"
              placeholder="Promo code"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              aria-label="Promo code"
              disabled={processing}
            />
            <button type="submit" className="btn btn--ghost btn--small" disabled={processing}>
              Apply
            </button>
          </form>
          {promoError && <p className="promo__msg promo__msg--error">{promoError}</p>}
          {totals.promo && (
            <p className="promo__msg">
              {totals.promo.code} applied &mdash; {totals.promo.percentOff}% off
              tickets.
            </p>
          )}

          <dl className="summary-totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatMoney(totals.subtotal)}</dd>
            </div>
            {totals.discount > 0 && (
              <div className="summary-totals__discount">
                <dt>Discount</dt>
                <dd>−{formatMoney(totals.discount)}</dd>
              </div>
            )}
            <div>
              <dt>Service fee</dt>
              <dd>{formatMoney(totals.fees)}</dd>
            </div>
            <div className="summary-totals__total">
              <dt>Total</dt>
              <dd>{formatMoney(totals.total)}</dd>
            </div>
          </dl>

          <p className="summary-card__hold">
            {remaining > 0
              ? `Tickets held for ${formatCountdown(remaining)}`
              : "Hold expired — go back and reselect"}
          </p>
          <Link href={`/events/${event.slug}#tickets`} className="summary-card__edit">
            Edit selection
          </Link>
        </div>
      </aside>
    </div>
  );
}
