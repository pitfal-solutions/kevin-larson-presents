# Spec — v1 landing page demo

## Goal

A single-page, high-end demo of what a Kevin Larson Presents website
upgrade could look like — real copy, real events, real brand voice — that
can be opened as a link and immediately read as "better than what they
have." Built to be sent to the client, not to replace their production
site (that's a future phase, contingent on them buying in).

## Scope (v1 — keep it simple)

One scrollable landing page:

1. **Hero** — flame mark, "Live Passionately, Experience Extraordinary,"
   30-years positioning, primary CTA.
2. **Signature events grid** — all 5 events (White Rose Gala, Denver Mardi
   Gras, Denver Derby Day, Paranormal Palace/Halloween, Jammy Jam) as cards:
   name, theme line, venue, date, a "See tickets" link out. Real copy pulled
   from each event's live microsite — see [../context/data-sources.md](../context/data-sources.md).
3. **Past events / proof section** — image gallery slots per event,
   explicitly labeled as placeholders until the client provides real photos
   (see data-sources.md — do not use stock photos that could pass as real
   KLP photography). This section directly answers the client's stated
   pain point about not showcasing past events.
4. **Membership / newsletter signup** — matches the "Members Club" concept
   already on the live sites (visual only in the demo — no real email
   capture/backend in v1).
5. **Footer** — social links (Facebook, TikTok, Instagram, YouTube — real,
   from the live site), brand tagline.

Out of scope for v1: real ticket purchase flow, real email capture backend,
multi-page site, replacing the client's actual domains, CMS/admin for the
client to edit content themselves.

## Content rules

- No invented ticket prices — link out or say "See tickets," never a made-up
  number.
- No invented testimonials, reviews, or attendance stats.
- Placeholder images are visually distinct (labeled) — never presented as if
  real.
- All event details (dates, venues, taglines) sourced from the live
  microsites, not guessed.

## AI/SEO requirements (v1)

- `schema.org/Event` JSON-LD for all 5 events.
- Semantic HTML, server-rendered (Next.js App Router — no client-only
  rendering for primary content).
- `robots.txt`, `sitemap.xml`, `llms.txt`.
- OpenGraph + Twitter card meta tags with a representative image.

See [../context/ai-discoverability.md](../context/ai-discoverability.md) for
the reasoning.

## Quality bar

Same as the workspace-wide bar in [../CLAUDE.md](../CLAUDE.md): five-second
clarity, desktop *and* mobile checked before calling it done, specific
language (event names/venues, not "premium experiences"), clarity over
cleverness.

## Tech

Next.js (App Router), deployed to Vercel for a shareable link — matches the
client's own mention of Vercel and keeps the stack consistent with the
existing Top Photographer demo pattern this workspace is modeled on.
