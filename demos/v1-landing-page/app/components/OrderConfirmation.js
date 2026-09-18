"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrder } from "../demo-orders";
import { formatMoney } from "../tickets-data";
import QrCode from "./QrCode";

const METHOD_LABELS = {
  apple_pay: "Apple Pay",
  google_pay: "Google Pay",
  link: "Link",
  card: "Card",
  paypal: "PayPal",
  venmo: "Venmo",
  cashapp: "Cash App Pay",
  klarna: "Klarna",
};

export default function OrderConfirmation({ orderId }) {
  const [order, setOrder] = useState(undefined);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrder(getOrder(orderId));
    setOrigin(window.location.origin);
  }, [orderId]);

  if (order === undefined) {
    return <p className="checkout__hint">Loading your order…</p>;
  }

  if (!order) {
    return (
      <div className="checkout--empty">
        <p className="section__eyebrow">Order {orderId}</p>
        <h1 className="section__title">We can&rsquo;t find that order</h1>
        <p className="checkout__hint">
          Demo orders only live in this browser tab. Start again from an
          event page.
        </p>
        <Link href="/#events" className="btn btn--primary">
          See events
        </Link>
      </div>
    );
  }

  const entryTickets = order.tickets.filter((t) => !t.isTable);
  const tables = order.tickets.filter((t) => t.isTable);

  return (
    <div className="confirmation">
      <div className="confirmation__head">
        <p className="section__eyebrow">You&rsquo;re in</p>
        <h1 className="section__title">See you at {order.eventName}</h1>
        <p className="confirmation__sub">
          Order <strong>{order.id}</strong> · paid with{" "}
          {METHOD_LABELS[order.method] || order.method} · a copy of these
          tickets is on its way to <strong>{order.buyer.email}</strong>.
        </p>
      </div>

      <div className="confirmation__grid">
        <section className="confirmation__tickets">
          <h2 className="checkout__heading">
            {entryTickets.length === 1
              ? "Your ticket"
              : `Your ${entryTickets.length} tickets`}
          </h2>
          <p className="checkout__hint">
            Each QR code is scanned once at the door. Tap a ticket to open
            it on its own &mdash; that&rsquo;s the link to forward to a
            friend.
          </p>
          <ul className="ticket-grid">
            {entryTickets.map((t, i) => (
              <li key={t.code}>
                <Link href={`/t/${t.code}`} className="ticket-card">
                  <QrCode
                    value={`${origin}/t/${t.code}`}
                    size={132}
                    label={`Ticket ${i + 1} QR code`}
                  />
                  <div className="ticket-card__body">
                    <span className="ticket-card__tier">{t.tierName}</span>
                    <span className="ticket-card__name">
                      {t.attendeeName || "Add attendee name"}
                    </span>
                    <span className="ticket-card__code">{t.code}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {tables.length > 0 && (
            <>
              <h2 className="checkout__heading">Table reservations</h2>
              <ul className="ticket-grid">
                {tables.map((t) => (
                  <li key={t.code}>
                    <Link href={`/t/${t.code}`} className="ticket-card">
                      <QrCode
                        value={`${origin}/t/${t.code}`}
                        size={132}
                        label="Table reservation QR code"
                      />
                      <div className="ticket-card__body">
                        <span className="ticket-card__tier">{t.tierName}</span>
                        <span className="ticket-card__name">Seats {t.seats}</span>
                        <span className="ticket-card__code">{t.code}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <aside className="checkout__summary">
          <div className="summary-card">
            <p className="section__eyebrow">Receipt</p>
            <h2 className="summary-card__event">{order.eventName}</h2>
            <p className="summary-card__meta">
              {order.dateLabel} · {order.time}
              <br />
              {order.venue}
              <br />
              {order.address}
            </p>
            <ul className="summary-lines">
              {order.lines.map((l) => (
                <li key={l.tierId}>
                  <span>
                    {l.qty} × {l.name}
                  </span>
                  <span>{formatMoney(l.lineSubtotal)}</span>
                </li>
              ))}
            </ul>
            <dl className="summary-totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatMoney(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="summary-totals__discount">
                  <dt>Discount ({order.promo})</dt>
                  <dd>−{formatMoney(order.discount)}</dd>
                </div>
              )}
              <div>
                <dt>Service fee</dt>
                <dd>{formatMoney(order.fees)}</dd>
              </div>
              <div className="summary-totals__total">
                <dt>Paid</dt>
                <dd>{formatMoney(order.total)}</dd>
              </div>
            </dl>
            <p className="summary-card__hold">
              Refund policy and hotel-room booking link would appear here.
            </p>
            <div className="confirmation__actions">
              <Link href={`/events/${order.eventSlug}`} className="btn btn--ghost btn--small">
                Back to event
              </Link>
              <Link href="/#events" className="btn btn--primary btn--small">
                More events
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
