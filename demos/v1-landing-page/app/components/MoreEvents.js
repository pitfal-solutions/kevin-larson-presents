import Link from "next/link";
import { events } from "../events-data";

export default function MoreEvents({ excludeSlug }) {
  const others = events.filter((e) => e.slug !== excludeSlug);

  return (
    <section className="section section--muted more-events">
      <div className="section__header">
        <p className="section__eyebrow">Kevin Larson Presents</p>
        <h2 className="section__title">More Signature Nights</h2>
      </div>
      <div className="more-events__grid">
        {others.map((e) => (
          <Link href={`/events/${e.slug}`} key={e.slug} className="more-events__card">
            <img
              src={`/images/events/${e.slug}/poster.jpg`}
              alt={e.posterAlt || `${e.name} event poster`}
              loading="lazy"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
