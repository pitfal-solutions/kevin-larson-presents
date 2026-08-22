export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="#top" className="brand">
          <span className="brand__flame" aria-hidden="true">
            🔥
          </span>
          <span className="brand__name">Kevin Larson Presents</span>
        </a>
        <nav className="site-nav" aria-label="Primary">
          <a href="#events">Events</a>
          <a href="#past-events">Past Events</a>
          <a href="#join">Members Club</a>
        </nav>
        <a href="#events" className="btn btn--ghost site-header__cta">
          See Events
        </a>
      </div>
    </header>
  );
}
