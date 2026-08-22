"use client";

const BENEFITS = [
  "Member-Only Discounts",
  "Exclusive VIP Experiences",
  "First to Know Access",
  "Private Events",
];

// Visual only in this demo — no real email capture/backend. See
// /specs/v1-landing-page.md for what's in and out of v1 scope.
export default function Membership() {
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
        <form
          className="membership__form"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email address"
            disabled
          />
          <button type="submit" className="btn btn--primary" disabled>
            Join the List
          </button>
          <p className="membership__note">
            Demo only — signup isn't wired up yet.
          </p>
        </form>
      </div>
    </section>
  );
}
