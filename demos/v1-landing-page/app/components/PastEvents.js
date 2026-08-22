import { events } from "../events-data";

// Placeholder gallery — real event photography goes here once provided.
// See /context/data-sources.md: never swap these for stock photos
// presented as authentic KLP event photos.
export default function PastEvents() {
  return (
    <section id="past-events" className="section section--muted">
      <div className="section__header">
        <p className="section__eyebrow">Proof, Not Promises</p>
        <h2 className="section__title">The Nights People Still Talk About</h2>
        <p className="section__subtitle">
          Real photography from past White Rose Galas, Mardi Gras takeovers,
          and more goes here — this is a placeholder gallery for the demo.
        </p>
      </div>
      <div className="gallery-grid">
        {events.map((event) => (
          <div className="gallery-tile" key={event.slug}>
            <div className="gallery-tile__placeholder" aria-hidden="true">
              <span className="gallery-tile__icon">📷</span>
            </div>
            <p className="gallery-tile__label">
              Photo coming soon — {event.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
