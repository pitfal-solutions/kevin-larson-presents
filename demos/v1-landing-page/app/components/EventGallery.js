export default function EventGallery({ event }) {
  return (
    <section id="gallery" className="section">
      <div className="section__header">
        <p className="section__eyebrow">Proof, Not Promises</p>
        <h2 className="section__title">
          {event.hasPhotos ? event.photoCaption : "Photos Coming Soon"}
        </h2>
        {!event.hasPhotos && (
          <p className="section__subtitle">
            {event.name} hasn't happened yet — real event photography will
            go here once it does.
          </p>
        )}
      </div>

      {event.hasPhotos ? (
        <div className="event-gallery-grid">
          <img
            className="event-gallery-grid__hero"
            src={`/images/events/${event.slug}/hero.jpg`}
            alt={`${event.name} — ${event.theme}`}
            loading="lazy"
          />
          {event.gallery.map((g) => (
            <img
              key={g.file}
              src={`/images/events/${event.slug}/${g.file}`}
              alt={g.alt}
              loading="lazy"
            />
          ))}
        </div>
      ) : (
        <div className="gallery-tile gallery-tile--placeholder gallery-tile--solo">
          <div className="gallery-tile__placeholder" aria-hidden="true">
            <span className="gallery-tile__icon">📷</span>
          </div>
          <p className="gallery-tile__label">Photo coming soon — {event.name}</p>
        </div>
      )}
    </section>
  );
}
