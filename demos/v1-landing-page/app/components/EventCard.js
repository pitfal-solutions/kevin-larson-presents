import Link from "next/link";

export default function EventCard({ event }) {
  return (
    <article className="event-card">
      <Link href={`/events/${event.slug}`} className="event-card__poster">
        <img
          src={`/images/events/${event.slug}/poster.jpg`}
          alt={event.posterAlt || `${event.name} event poster`}
          loading="lazy"
        />
      </Link>
      <div className="event-card__body">
        <h3 className="event-card__name">{event.name}</h3>
        <p className="event-card__theme">{event.theme}</p>
        <p className="event-card__tagline">&ldquo;{event.tagline}&rdquo;</p>
        <dl className="event-card__meta">
          <div>
            <dt>Venue</dt>
            <dd>{event.venue}</dd>
          </div>
          <div>
            <dt>When</dt>
            <dd>
              {event.dateLabel} · {event.time}
            </dd>
          </div>
          <div>
            <dt>Age</dt>
            <dd>{event.ageRestriction}</dd>
          </div>
        </dl>
        <ul className="event-card__highlights">
          {event.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
        <div className="event-card__actions">
          <Link href={`/events/${event.slug}`} className="btn btn--ghost btn--small">
            See the Night
          </Link>
          <a
            href={event.ticketUrl}
            className="btn btn--primary btn--small"
            target="_blank"
            rel="noopener noreferrer"
          >
            See Tickets
          </a>
        </div>
      </div>
    </article>
  );
}
