# Spec — v1 landing page demo

## Goal

A high-end demo of what a Kevin Larson Presents website upgrade could look
like — real copy, real events, real brand voice, real event photography —
that can be opened as a link and immediately read as "better than what they
have." Built to be sent to the client, not to replace their production
site (that's a future phase, contingent on them buying in).

## Scope (v1)

**Homepage** (`/`), one scrollable page:

1. **Hero** — full-bleed crossfading background of real event photos (one
   per event with photos), flame mark, "Live Passionately, Experience
   Extraordinary," 30-years positioning, primary CTA.
2. **Signature events grid** — all 5 events (White Rose Gala, Denver Mardi
   Gras, Denver Derby Day, Paranormal Palace/Halloween, Jammy Jam) as poster
   cards: real event poster art, name, theme line, venue, date, an internal
   link to the event's own page, and a "See tickets" link out. Real copy
   pulled from each event's live microsite — see [../context/data-sources.md](../context/data-sources.md).
3. **Past events / proof section** — real photo gallery pulled from the 4
   events with photography provided; Jammy Jam (hasn't happened yet) gets
   an honest labeled placeholder tile mixed in rather than hidden. Directly
   answers the client's stated pain point about not showcasing past events.
4. **Watch the Vibe** — the real KLP recap video embedded from YouTube.
5. **As Seen In & Trusted By** — animated marquee of real press mentions
   and real client names pulled from the live site's credibility carousel.
6. **Membership / newsletter signup** — matches the "Members Club" concept
   already on the live sites (visual only in the demo — no real email
   capture/backend in v1).
7. **What Denver Is Saying** — animated marquee of real Google reviews
   (name, quote, aggregate rating), linking out to Google for the full set.
8. **Footer** — social links (Facebook, TikTok, Instagram, YouTube — real,
   from the live site), brand tagline.

**About page** (`/about`):

1. Hero using a real event photo.
2. **Meet The Visionary** — real copy from the live site's section of the
   same name, plus a direct quote from Kevin Larson.
3. **Shoutout Colorado** — a short attributed excerpt from Kevin Larson's
   real published interview at shoutoutcolorado.com, with a link to the
   full piece.
4. **Meet The Team** — real names/titles (Kevin Larson, Ryan Chipps, Holly
   Joy) from the live site's about-us page.
5. The same "As Seen In & Trusted By" marquee as the homepage.

**Individual event pages** (`/events/<slug>`), one per signature event:

1. Full-bleed photo hero with the event's real photography (or the brand
   look with no photo, for Jammy Jam), name, theme, tagline, date badge.
2. Details section — highlights, venue/address, date/time, age restriction,
   ticket CTA.
3. Photo gallery — hero + 7 real photos in a mosaic grid, or the same
   honest placeholder treatment for Jammy Jam.
4. Cross-links to the other 4 signature nights.
5. Full `schema.org/Event` JSON-LD, per-page OpenGraph image.

Out of scope for v1: real ticket purchase flow, real email capture backend,
replacing the client's actual domains, CMS/admin for the client to edit
content themselves.

## Photography

Real KLP event photos, provided by the client from
`/Volumes/Elements/pitfal-solutions/photo_backup/events` (2026-08-22) —
curated (8 photos per event, most recent year available) and resized/
compressed for web from the original camera files (originals untouched).
See [../context/data-sources.md](../context/data-sources.md) for exactly
which folders/years were used and why. Jammy Jam has no photos yet — it
hasn't happened (Sept 2026) — and correctly shows a labeled placeholder
instead of a substitute image.

## Content rules

- No invented ticket prices — link out or say "See tickets," never a made-up
  number.
- No invented testimonials, reviews, or attendance stats — reviews and
  press mentions are real, sourced, and attributed (see data-sources.md).
- Placeholder images/tiles are visually distinct (labeled) — never presented
  as if real.
- All event details (dates, venues, taglines) sourced from the live
  microsites, not guessed.
- Real photos are the client's own event photography, not stock — and never
  substituted for an event they don't depict.

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
