# Review log

Running log of decisions and periodic self-review. Append, don't rewrite
history.

## Pre-ship checklist

Before marking any demo/deliverable shippable (i.e., ready to send the
client a link):

- [ ] All event details (name, date, venue, tagline) match the live
      microsite they came from — no drift, no invention.
- [ ] No fabricated pricing, testimonials, or attendance numbers.
- [ ] Placeholder images are visually/labeled distinct from real photos —
      never presentable as authentic KLP photography.
- [ ] Checked at a desktop width and a phone width.
- [ ] `npm run build` passes clean.
- [ ] Social links point to the real KLP accounts (Facebook, TikTok,
      Instagram, YouTube), not placeholders.
- [ ] JSON-LD `Event` blocks validate (name/date/location/offer present)
      for all events actually shown.

## Log

### 2026-08-22 — Workspace setup + discovery

Set up this repo as an AI-employee workspace, mirroring the pattern used in
the Top Photographer project (`CLAUDE.md`, `ROADMAP.md`, `REVIEW.md`,
`context/`, `customers/`, `specs/`, `demos/`, `routines/`).

Decisions made:

- **Scope is a website facelift demo, not a rebuild of the events
  business.** The 5 signature events and their existing brand voice are
  strong — v1 elevates execution and adds AI/SEO structure, it doesn't
  reinvent positioning.
- **Sourced all copy/brand data from the live sites**, not assumptions —
  see [context/data-sources.md](context/data-sources.md) for exactly what
  came from where. This matters because the client's own current-site copy
  is good; the ask is a better *execution* of it, not new copywriting.
- **Real photos pending.** Client confirmed real event photos exist and
  will be provided but hasn't yet given a location/method. v1 demo will
  ship with clearly labeled placeholder image slots until then — flagged
  as a known gap, not backfilled with stock photos.
- **Checked skills.sh** (per client's request) for relevant agent skills:
  found `frontend-design`, `web-design-guidelines` and
  `vercel-react-best-practices` (vercel-labs), and `high-end-visual-design`
  / `anti-ui-slop` as the most relevant for this specific "top of the line,
  attention-grabbing" bar. Not formally installed as plugins yet — applying
  their principles directly; flagged to the client/user in case they want
  them installed for ongoing work.
- **Deploy target: Vercel**, git-tracked from the start, per explicit
  client confirmation — goal is a shareable demo link.

### Open risks

- Domain strategy (6 microsites vs. 1 consolidated site) is unresolved and
  explicitly deferred to Phase 2 — a real migration touches the client's
  live ticketing/booking links and shouldn't be assumed.
- No real ticket pricing is published anywhere we can see — v1 links out
  rather than guessing, but this may look incomplete in the demo; worth
  flagging to the client rather than silently working around it.

### 2026-08-22 — v1 demo built and verified

Built `demos/v1-landing-page/` (Next.js App Router): hero, 5-event grid with
`schema.org/Event` JSON-LD per event, a labeled placeholder past-events
gallery, a visual-only membership signup, and footer with real social
links. Added `robots.txt`, `sitemap.xml`, and `llms.txt` per
[context/ai-discoverability.md](context/ai-discoverability.md).

- **Found and fixed a real bug during review:** the sticky header combined
  `position: sticky` with `backdrop-filter: blur()`, a known problematic
  combination (notably on WebKit/Safari, which is exactly what a client
  checking this on their iPhone would hit). Replaced with a solid header
  background. Worth remembering for any future sticky element in this
  project — see [../CLAUDE.md](CLAUDE.md) working agreements.
- **Verification was partial.** `npm run build` passes clean. Hero/header
  confirmed pixel-correct at both desktop (1280px) and mobile (375px)
  widths via live browser check. Below-the-fold sections (events grid,
  gallery, membership, footer) were confirmed correct via DOM inspection
  and rendered text extraction (exactly 1 header, 5 event cards, correct
  content/order, no duplicates) but **not** via a scrolled visual
  screenshot — the browser tool used this session couldn't reliably
  composite scrolled frames (reproducible tool-level issue, not a page
  bug: an artificially-tall single-frame capture showed all content
  present and correctly laid out, just with a tiling/ghosting render
  artifact from the oversized viewport). Recommend a human visually
  scrolls the demo at least once before sending it to the client.
- **Not yet deployed.** No Vercel CLI available in this environment and
  deploying requires the client/user's own Vercel login — flagged as the
  next concrete step rather than done silently.
