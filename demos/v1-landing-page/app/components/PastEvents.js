import { events } from "../events-data";

// Real KLP event photography — see /context/data-sources.md for provenance.
// Jammy Jam has no photos yet (hasn't happened) and gets an honest
// placeholder tile instead, mixed in with the real ones rather than hidden.
const PHOTOS = events
  .filter((e) => e.hasPhotos)
  .flatMap((e) =>
    e.gallery.slice(0, 3).map((g) => ({
      src: `/images/events/${e.slug}/${g.file}`,
      alt: g.alt,
      event: e.name,
    }))
  );

export default function PastEvents() {
  return (
    <section id="past-events" className="section section--muted">
      <div className="section__header">
        <p className="section__eyebrow">Proof, Not Promises</p>
        <h2 className="section__title">The Nights People Still Talk About</h2>
        <p className="section__subtitle">
          Real photography from White Rose Gala, Denver Mardi Gras, Denver
          Derby Day, and Paranormal Palace.
        </p>
      </div>
      <div className="gallery-grid">
        {PHOTOS.map((p) => (
          <figure className="gallery-tile" key={p.src}>
            <img src={p.src} alt={p.alt} loading="lazy" />
            <figcaption>{p.event}</figcaption>
          </figure>
        ))}
        <div className="gallery-tile gallery-tile--placeholder">
          <div className="gallery-tile__placeholder" aria-hidden="true">
            <span className="gallery-tile__icon">📷</span>
          </div>
          <p className="gallery-tile__label">Photo coming soon — Jammy Jam</p>
        </div>
      </div>
    </section>
  );
}
