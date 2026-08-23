"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/#events", label: "Events" },
  { href: "/#past-events", label: "Past Events" },
  { href: "/about", label: "About" },
  { href: "/#join", label: "Members Club" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand__flame" aria-hidden="true">
            🔥
          </span>
          <span className="brand__name">Kevin Larson Presents</span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/#events" className="btn btn--ghost site-header__cta">
          See Events
        </Link>
        <button
          type="button"
          className={`site-header__menu-btn${open ? " site-header__menu-btn--open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <nav
        className={`site-header__mobile-nav${open ? " site-header__mobile-nav--open" : ""}`}
        aria-label="Mobile"
      >
        {NAV_LINKS.map((link) => (
          <Link href={link.href} key={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
        <Link href="/#events" className="btn btn--primary" onClick={() => setOpen(false)}>
          See Events
        </Link>
      </nav>
    </header>
  );
}
