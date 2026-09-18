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
2. **Signature events grid** — all 4 events (White Rose Gala, Denver Mardi
   Gras, Denver Derby Day, Paranormal Palace/Halloween) as poster
   cards: real event poster art, name, theme line, venue, date, an internal
   link to the event's own page, and a "See tickets" link out. Real copy
   pulled from each event's live microsite — see [../context/data-sources.md](../context/data-sources.md).
3. **Past events / proof section** — real photo gallery pulled from all 4
   events. Directly
   answers the client's stated pain point about not showcasing past events.
4. **Watch the Vibe** — the real KLP recap video embedded from YouTube.
5. **As Seen In & Trusted By** — animated marquee of real press mentions
   and real client names pulled from the live site's credibility carousel.
6. **Membership / newsletter signup** — matches the "Members Club" concept
   already on the live sites. Live since 2026-09-17: submits to
   `/api/leads` and shows up in the admin dashboard (see below).
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

1. Full-bleed photo hero with the event's real photography, name, theme,
   tagline, date badge.
2. Details section — highlights, venue/address, date/time, age restriction,
   ticket CTA.
3. Photo gallery — hero + 7 real photos in a mosaic grid.
4. Cross-links to the other 3 signature nights.
5. Full `schema.org/Event` JSON-LD, per-page OpenGraph image.

**Admin dashboard** (`/admin`, added 2026-09-17):

Password-protected (`ADMIN_PASSWORD` env var, signed httpOnly cookie,
`/admin` is `noindex` and disallowed in `robots.txt`). Shows, for a
selectable 7/30/90-day/all-time range:

1. Totals — page views, unique visitors, sessions, CTA clicks, leads.
2. Page views by day (bar chart), views by page, clicks by CTA/target.
3. Sources for new visitors (referrer host, or UTM source for tagged
   links), UTM campaigns, device split, country (Vercel edge header —
   blank on local dev).
4. Leads table — email, signup time, source, campaign, landing page,
   which event pages they viewed that session, device — plus a CSV export
   of all leads.

Tracking is first-party only (`app/components/Analytics.js`): a random
visitor id in `localStorage`, session id in `sessionStorage`, no third-party
scripts, no IP addresses stored. Page views fire on every route change;
clicks are recorded for buttons, nav links, outbound links, and anything
with `data-track`. Attribution is "last non-direct touch": referrer/UTM
captured at session start, falling back to the visitor's first-touch
attribution when the session arrived direct.

Storage (`app/lib/store.js`) is Upstash Redis when its env vars are
present (Vercel's Upstash integration sets them), otherwise a gitignored
local JSON file so `npm run dev` needs no setup. Raw events are capped at
the most recent 20,000; leads are uncapped.

Out of scope for v1: real ticket purchase flow, replacing the client's
actual domains, CMS/admin for the client to edit content themselves.

## Demo checkout flow (added 2026-09-17, on branch — not on the client's live link)

A front-end-only purchase walkthrough, built to show the client what
[the ticketing system](ticketing-system.md) would feel like before it's
wired to Stripe/PayPal. **No payment is taken**; every page in the flow
carries a "Demo checkout" banner.

- **Tiers on each event page** (`#tickets`) — real tier names and prices
  from KLP's live TicketFairy pages (see
  [../context/data-sources.md](../context/data-sources.md)), with the
  per-unit service fee from the chosen fee schedule shown next to each
  price. Quantity steppers, a sticky total bar, "Continue to Checkout."
- **`/checkout/<slug>`** — cart from the query string, buyer details,
  per-ticket attendee names, promo code (`FLASH15`, one clearly-labeled
  demo code mirroring KLP's real 15% flash sales; tickets only, not
  tables), 10-minute hold countdown, and every payment method the real
  build offers: Apple Pay / Google Pay / Link express buttons, then
  Card / PayPal / Venmo / Cash App / Klarna tabs. Card fields are
  visibly mock. "Pay" validates (name, email, age/refund checkbox),
  shows a processing state, and issues the order.
- **`/orders/<id>`** — confirmation with a real scannable QR per ticket
  (encodes the ticket's `/t/<code>` URL), table reservations, receipt.
- **`/t/<code>`** — the ticket page a buyer would get by email: big QR,
  editable attendee name, "Simulate door scan" to show the single-use
  state (greyed QR, "Scanned 9:41 PM").
- **Storage:** `sessionStorage` only (`app/demo-orders.js`). Orders exist
  in the tab that made them and vanish when it closes. This is the
  seam the real Postgres + webhook pipeline replaces.
- **AI/SEO win already banked:** with prices in the data file, each
  on-sale event's JSON-LD now carries a real `AggregateOffer` (low/high
  price, per-tier offers, availability) instead of a bare link-out.
- **CTA change:** "See Tickets" → "Get Tickets", pointing at
  `/events/<slug>#tickets` rather than out to TicketFairy. The tiers
  section still links to the live TicketFairy page for honesty.

Files: `app/tickets-data.js`, `app/demo-orders.js`,
`app/components/{TicketTiers,CheckoutForm,OrderConfirmation,TicketView,QrCode,DemoBanner}.js`,
`app/checkout/[slug]`, `app/orders/[id]`, `app/t/[code]`. One new
dependency: `qrcode`.

## Photography

Real KLP event photos, provided by the client from
`/Volumes/Elements/pitfal-solutions/photo_backup/events` (2026-08-22) —
curated (8 photos per event, most recent year available) and resized/
compressed for web from the original camera files (originals untouched).
See [../context/data-sources.md](../context/data-sources.md) for exactly
which folders/years were used and why. (Jammy Jam, which had no photos,
was cancelled and removed from the site on 2026-09-18 — the "no photos
yet" placeholder code paths remain as guards for any future event added
before its first year.)

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

- `schema.org/Event` JSON-LD for all 4 events.
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
