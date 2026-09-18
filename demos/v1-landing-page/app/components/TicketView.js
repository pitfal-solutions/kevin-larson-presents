"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { findTicket, saveOrder } from "../demo-orders";
import QrCode from "./QrCode";

// The page a buyer opens from their email (and forwards to a friend). In
// the real build the door scanner reads the same URL; here the "scan" is
// simulated so the single-use behavior can be demonstrated.
export default function TicketView({ code }) {
  const [found, setFound] = useState(undefined);
  const [origin, setOrigin] = useState("");
  const [nameDraft, setNameDraft] = useState("");

  useEffect(() => {
    const hit = findTicket(code);
    setFound(hit);
    setOrigin(window.location.origin);
    if (hit) setNameDraft(hit.ticket.attendeeName || "");
  }, [code]);

  if (found === undefined) return <p className="checkout__hint">Loading ticket…</p>;

  if (!found) {
    return (
      <div className="checkout--empty">
        <p className="section__eyebrow">Ticket {code}</p>
        <h1 className="section__title">Ticket not found</h1>
        <p className="checkout__hint">
          Demo tickets only live in the browser tab that bought them.
        </p>
        <Link href="/#events" className="btn btn--primary">
          See events
        </Link>
      </div>
    );
  }

  const { order, ticket } = found;

  function update(patch) {
    const next = {
      ...order,
      tickets: order.tickets.map((t) => (t.code === ticket.code ? { ...t, ...patch } : t)),
    };
    saveOrder(next);
    setFound({ order: next, ticket: { ...ticket, ...patch } });
  }

  const checkedIn = Boolean(ticket.checkedInAt);

  return (
    <article className={`ticket${checkedIn ? " ticket--used" : ""}`}>
      <header className="ticket__head">
        <p className="section__eyebrow">Kevin Larson Presents</p>
        <h1 className="ticket__event">{order.eventName}</h1>
        <p className="ticket__meta">
          {order.dateLabel} · {order.time}
          <br />
          {order.venue} · {order.ageRestriction}
        </p>
      </header>

      <div className="ticket__qr">
        <QrCode value={`${origin}/t/${ticket.code}`} size={220} label="Ticket QR code" />
        <p className="ticket__code">{ticket.code}</p>
        {checkedIn ? (
          <p className="ticket__status ticket__status--used">
            Scanned {new Date(ticket.checkedInAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
          </p>
        ) : (
          <p className="ticket__status">Valid · scan once at the door</p>
        )}
      </div>

      <dl className="ticket__details">
        <div>
          <dt>{ticket.isTable ? "Reservation" : "Ticket"}</dt>
          <dd>{ticket.tierName}</dd>
        </div>
        {ticket.isTable ? (
          <div>
            <dt>Seats</dt>
            <dd>{ticket.seats} · entry tickets required</dd>
          </div>
        ) : (
          <div>
            <dt>Attendee</dt>
            <dd>
              <form
                className="ticket__name-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  update({ attendeeName: nameDraft.trim() });
                }}
              >
                <input
                  type="text"
                  value={nameDraft}
                  placeholder="Add attendee name"
                  onChange={(e) => setNameDraft(e.target.value)}
                  aria-label="Attendee name"
                  disabled={checkedIn}
                />
                {!checkedIn && nameDraft.trim() !== (ticket.attendeeName || "") && (
                  <button type="submit" className="btn btn--ghost btn--small">
                    Save
                  </button>
                )}
              </form>
            </dd>
          </div>
        )}
        <div>
          <dt>Order</dt>
          <dd>
            <Link href={`/orders/${order.id}`}>{order.id}</Link> · {order.buyer.name}
          </dd>
        </div>
      </dl>

      <footer className="ticket__foot">
        {checkedIn ? (
          <button type="button" className="btn btn--ghost btn--small" onClick={() => update({ checkedInAt: null })}>
            Reset demo scan
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={() => update({ checkedInAt: new Date().toISOString() })}
          >
            Simulate door scan
          </button>
        )}
        <p className="checkout__hint">
          In the real build the door staff&rsquo;s scanner does this; a
          second scan shows &ldquo;already admitted&rdquo; in red.
        </p>
      </footer>
    </article>
  );
}
