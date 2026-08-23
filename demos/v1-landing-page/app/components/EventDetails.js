export default function EventDetails({ event }) {
  return (
    <section className="section event-details">
      <div className="event-details__grid">
        <div>
          <p className="section__eyebrow">The Details</p>
          <h2 className="section__title event-details__title">
            What's Included
          </h2>
          <ul className="event-details__highlights">
            {event.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
        <dl className="event-details__meta">
          <div>
            <dt>Venue</dt>
            <dd>{event.venue}</dd>
            <dd className="event-details__address">{event.address}</dd>
          </div>
          <div>
            <dt>When</dt>
            <dd>{event.dateLabel}</dd>
            <dd className="event-details__address">{event.time}</dd>
          </div>
          <div>
            <dt>Age</dt>
            <dd>{event.ageRestriction}</dd>
          </div>
          <a
            href={event.ticketUrl}
            className="btn btn--primary event-details__cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            See Tickets
          </a>
        </dl>
      </div>
    </section>
  );
}
