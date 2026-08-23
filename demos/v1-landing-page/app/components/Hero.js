import { TAGLINE } from "../site-config";
import { events } from "../events-data";

const SLIDES = events.filter((e) => e.hasPhotos).map((e) => e.slug);

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero__slides" aria-hidden="true">
        {SLIDES.map((slug, i) => (
          <div
            key={slug}
            className="hero__slide"
            style={{
              backgroundImage: `url(/images/events/${slug}/hero.jpg)`,
              animationDelay: `${i * -6}s`,
            }}
          />
        ))}
      </div>
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__inner">
        <p className="hero__eyebrow">{TAGLINE}</p>
        <h1 className="hero__title">
          Creating Immersive Experiences
          <br />
          in Denver for 30 Years
        </h1>
        <p className="hero__subtitle">
          Five signature nights. One legendary producer. Themed hotel
          takeovers built for people who want a night they'll actually
          remember.
        </p>
        <div className="hero__actions">
          <a href="#events" className="btn btn--primary">
            See Upcoming Events
          </a>
          <a href="#past-events" className="btn btn--ghost">
            See the Nights
          </a>
        </div>
      </div>
      <div className="hero__scroll-cue" aria-hidden="true">
        <span />
        <span />
      </div>
    </section>
  );
}
