export default function AboutHero() {
  return (
    <section
      className="event-hero about-hero"
      style={{ backgroundImage: "url(/images/events/white-rose-gala/g1.jpg)" }}
    >
      <div className="event-hero__scrim" />
      <div className="event-hero__inner">
        <p className="event-hero__theme">Kevin Larson Presents</p>
        <h1 className="event-hero__title">The Flame Behind the Flame</h1>
        <p className="event-hero__tagline">
          Thirty years of turning ordinary nights into the ones people still
          talk about.
        </p>
      </div>
    </section>
  );
}
