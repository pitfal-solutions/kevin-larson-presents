function formatMonthDay(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.toLocaleDateString("en-US", { day: "numeric" }),
  };
}

export default function EventCard({ event }) {
  const { month, day } = formatMonthDay(event.date);

  return (
    <article className="event-card">
      <div className="event-card__date" aria-hidden="true">
        <span className="event-card__month">{month}</span>
        <span className="event-card__day">{day}</span>
      </div>
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
        <a
          href={event.ticketUrl}
          className="btn btn--primary btn--small"
          target="_blank"
          rel="noopener noreferrer"
        >
          See Tickets
        </a>
      </div>
    </article>
  );
}
