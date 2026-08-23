import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand">
          <span className="brand__flame" aria-hidden="true">
            🔥
          </span>
          <span className="brand__name">Kevin Larson Presents</span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          <Link href="/#events">Events</Link>
          <Link href="/#past-events">Past Events</Link>
          <Link href="/about">About</Link>
          <Link href="/#join">Members Club</Link>
        </nav>
        <Link href="/#events" className="btn btn--ghost site-header__cta">
          See Events
        </Link>
      </div>
    </header>
  );
}
