"use client";

import { useState } from "react";
import { getEventsViewed, getIdentity } from "../lib/visitor";

const BENEFITS = [
  "Member-Only Discounts",
  "Exclusive VIP Experiences",
  "First to Know Access",
  "Private Events",
];

// Live lead capture — posts to /api/leads with the visitor's first-touch
// attribution so the admin page can show where each signup came from.
export default function Membership() {
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value;
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company: form.company.value, // honeypot
          path: window.location.pathname,
          eventsViewed: getEventsViewed(),
          ...getIdentity(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong — please try again.");
    }
  }

  return (
    <section id="join" className="section">
      <div className="membership">
        <div className="membership__copy">
          <p className="section__eyebrow">Kevin Larson Presents</p>
          <h2 className="section__title">Members Club</h2>
          <ul className="membership__benefits">
            {BENEFITS.map((b) => (
              <li key={b}>
                <span aria-hidden="true">✓</span> {b}
              </li>
            ))}
          </ul>
        </div>
        {status === "done" ? (
          <div className="membership__form membership__success" role="status">
            <p className="membership__success-title">You&rsquo;re on the list.</p>
            <p className="membership__note">
              Watch your inbox for member-only access and discounts.
            </p>
          </div>
        ) : (
          <form className="membership__form" onSubmit={onSubmit}>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email address"
              autoComplete="email"
              required
              disabled={status === "submitting"}
            />
            <div className="membership__honeypot" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <button
              type="submit"
              className="btn btn--primary"
              data-track="Join the List"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Joining…" : "Join the List"}
            </button>
            <p className="membership__note" aria-live="polite">
              {status === "error" ? error : "No spam — just first access to the next night."}
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
