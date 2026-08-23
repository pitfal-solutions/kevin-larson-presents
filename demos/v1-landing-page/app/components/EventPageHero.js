function formatMonthDay(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.toLocaleDateString("en-US", { day: "numeric" }),
  };
}

export default function EventPageHero({ event }) {
  const { month, day } = formatMonthDay(event.date);

  return (
    <section
      className="event-hero"
      style={
        event.hasPhotos
          ? { backgroundImage: `url(/images/events/${event.slug}/hero.jpg)` }
          : undefined
      }
    >
      <div className="event-hero__scrim" />
      <div className="event-hero__inner">
        <div className="event-hero__date" aria-hidden="true">
          <span>{month}</span>
          <strong>{day}</strong>
        </div>
        <p className="event-hero__theme">{event.theme}</p>
        <h1 className="event-hero__title">{event.name}</h1>
        <p className="event-hero__tagline">&ldquo;{event.tagline}&rdquo;</p>
        <div className="event-hero__actions">
          <a
            href={event.ticketUrl}
            className="btn btn--primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            See Tickets
          </a>
          <a href="#gallery" className="btn btn--ghost">
            {event.hasPhotos ? "See the Night" : "Event Details"}
          </a>
        </div>
      </div>
    </section>
  );
}
