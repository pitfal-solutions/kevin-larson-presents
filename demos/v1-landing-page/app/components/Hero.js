import { TAGLINE } from "../site-config";

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero__glow" aria-hidden="true" />
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
          <a href="#join" className="btn btn--ghost">
            Get on the List
          </a>
        </div>
      </div>
    </section>
  );
}
