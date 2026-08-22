import { events } from "../events-data";
import EventCard from "./EventCard";

export default function EventsGrid() {
  return (
    <section id="events" className="section">
      <div className="section__header">
        <p className="section__eyebrow">Five Signature Nights</p>
        <h2 className="section__title">Upcoming Events</h2>
      </div>
      <div className="events-grid">
        {events.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>
    </section>
  );
}
