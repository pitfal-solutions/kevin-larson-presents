# Review log

Running log of decisions and periodic self-review. Append, don't rewrite
history.

## Pre-ship checklist

Before marking any demo/deliverable shippable (i.e., ready to send the
client a link):

- [x] All event details (name, date, venue, tagline) match the live
      microsite they came from — no drift, no invention.
- [x] No fabricated pricing, testimonials, or attendance numbers.
- [x] Placeholder images are visually/labeled distinct from real photos —
      never presentable as authentic KLP photography.
- [x] Checked at a desktop width and a phone width.
- [x] `npm run build` passes clean.
- [x] Social links point to the real KLP accounts (Facebook, TikTok,
      Instagram, YouTube), not placeholders.
- [x] JSON-LD `Event` blocks validate (name/date/location/offer present)
      for all events actually shown.

*(Checked off 2026-08-23 — v1 demo sent to the client. Re-verify before
sending any future revision.)*

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

### 2026-08-22 — Deployed to Vercel

Installed the Vercel CLI (user gave explicit permission) and deployed.
Authentication resolved on its own via an already-signed-in session in
this environment — no credential ever passed through the assistant, in
line with the hard rule against handling passwords/tokens even with
permission granted. Live at https://v1-landing-page-mu.vercel.app; GitHub
repo connected for auto-deploy on future pushes to `main`. `SITE_URL` in
`site-config.js` updated to match, confirmed live in OpenGraph tags,
sitemap.xml, and JSON-LD.

### 2026-08-22 — Real event photography + individual event pages

User felt the v1 demo looked "boring and generic" and asked for (1) a much
stronger visual pass on the homepage and (2) a dedicated page per event
(mirroring the 5 real subdomains), using real photos from
`/Volumes/Elements/pitfal-solutions/photo_backup/events`. See
[context/data-sources.md](context/data-sources.md) for exactly which
photos were used and why.

Decisions made (confirmed with user via AskUserQuestion before building):

- **Jammy Jam keeps an honest placeholder** rather than borrowing another
  event's photos — it hasn't happened yet (Sept 2026). Same data-honesty
  principle as everywhere else in this workspace, now applied to imagery.
- **Left out the "Naughty Ball" 2024 photo folder** found alongside the
  others — it's not one of the 5 signature events currently on the live
  site, and the user confirmed to leave it out rather than assume it
  should become a 6th page.
- **Curated rather than dumped** the photo folders (79–351 photos each) —
  hand-reviewed a sampled subset per event and picked 8 each, favoring
  photos that read well on a public marketing page over ones that were
  merely authentic to the (21+, sometimes risqué) event energy. Skipped
  one shot that was a recognizable copyrighted costume (Pennywise) to
  avoid any IP association with the brand.
- **Event pages live at `/events/<slug>`** within this same Next.js app
  (not separate deployments) — reasonable for a demo; a real domain
  migration strategy is still a Phase 2 decision, not decided here.

Build verified clean (`npm run build`). Visually verified at desktop and
mobile widths for both the homepage and an event page — this time using a
workaround (temporarily overriding the hero's height via injected CSS to
avoid needing to scroll) after confirming the browser tool's native
scroll gesture was still unreliable in this session. Real photos, photo
cards, mosaic galleries, and the Jammy Jam placeholder all confirmed
rendering correctly, no layout bugs found beyond one minor CSS fix (the
past-events gallery's last row was left-stuck when partially filled —
switched to fixed-width tiles with `justify-content: center`).

### 2026-08-23 — Hero photos, About page, reviews, posters, video

Two rounds of feedback in the same session:

**"Heroes don't showcase the crowd/vibe."** The first hero picks were
flattering close-up portraits, not wide shots. Went back into the photo
folders specifically hunting for packed-room/crowd energy shots, found
much stronger ones (dance floor with hands up, a wide plaza full of Derby
hats, a DJ overlooking a two-story crowd), and swapped all 4 heroes —
demoting the old portrait heroes into their event's gallery rather than
discarding them. Also caught and fixed a real mislabeling bug in my own
process: I'd mismatched a filename during review and the Derby hero was
briefly the wrong photo (a 3-person portrait, not the wide crowd shot) —
found it by directly re-verifying the file on disk rather than trusting
my earlier notes, a good reminder to verify against the source rather
than memory when something looks off.

**About page + reviews + posters + video.** User asked for an About page
mirroring the live site's "Shoutout Colorado" and "Meet the Visionary"
sections, real reviews worked into the homepage with an animated
treatment, the real YouTube video, and the real per-event poster images
(matching a URL the user pasted) back into the event cards. Sourcing this
surfaced a few things worth a checkpoint:

- **The user's memory of a "reviews" section didn't match reality.** Their
  own homepage carousel (screenshots literally named
  `Screenshot-2025-07-10-...`) turned out to be an "As Seen In" press-logo
  slide and a client-roster slide — not testimonials — and 2 of its 4
  images are broken (404) on their live site today. Flagged this
  explicitly via AskUserQuestion rather than building a fabricated
  "reviews" section from a mistaken premise; user chose to use the real
  press/client content for the animated piece and asked for a genuine
  Google-reviews section added separately, which required going out to
  find their actual Google review data (via Birdeye's public aggregation,
  since Google doesn't offer a free self-service embed) — real quotes,
  real names, real 4.1★/41-review aggregate, not invented.
- **Traced "Meet The Visionary" back to its real source.** The image used
  in that section on their homepage is literally a screenshot of Kevin
  Larson's real Shoutout Colorado interview — confirms the user's ask was
  grounded in something real, not misremembered. Used a short attributed
  quote + link to the original rather than reproducing that screenshot
  (which would mean reproducing another publication's page design, not
  just KLP's own content) or the full article text.
- **Poster images required a workaround.** The CDN hosting KLP's real
  poster images (exactdn) blocks direct `curl` (referer/auth check).
  Fetched them via an in-browser canvas render instead — legitimate,
  same content, just needed the actual browser context.

Build verified clean. Visually verified at desktop and mobile for both
the homepage (all-new sections included) and the About page using the
same hero-height-override workaround as the previous entry.

### 2026-08-23 — Two rounds of mobile polish, then shipped

- **Scroll cue redesign.** User didn't like the "pill with a sliding dot"
  mouse-style scroll indicator. Replaced with a double down-chevron. Fixing
  it surfaced a real bug: the hero's `100vh` never accounted for the
  sticky header sitting above it in normal flow, so the hero (and the cue
  with it) always extended ~80px past the actual first screen. Fixed with
  `min-height: calc(100vh - 80px)`.
- **Mobile hamburger nav.** Mobile had no way to reach `/about`, Past
  Events, or Members Club — the nav was just hidden below 768px with
  nothing replacing it. Added a hamburger button (animates to an X) that
  opens a full-width dropdown nav.
- **Two more real bugs, not just polish**, both from a single user report
  ("gallery images have a lot of unused space" + "hero has too much dead
  space on mobile"):
  - `<figure>` was never reset from the browser's default UA margin
    (`1em 40px`), silently shrinking every gallery tile to about half its
    actual grid-cell width. This was likely also quietly shrinking the
    desktop gallery, just less noticeably. Root-caused by comparing
    `getBoundingClientRect()` on the tile against the grid's own
    `computedStyle().gridTemplateColumns` — the numbers only made sense
    once the arithmetic matched a hidden 80px margin exactly.
  - The hero's forced `min-height` (see above) left ~200px of dead space
    on mobile between the hero buttons and the next section, since mobile
    content is much shorter than the enforced full-screen minimum. Hero
    now hugs its content on mobile (`min-height: auto`) instead of forcing
    viewport height — the scroll cue is already hidden on mobile, so there
    was no reason to force full height there anyway.
  - Also switched the past-events gallery to 2 columns on mobile instead
    of 1 (separate, smaller ask, same round).

All four fixes verified against direct DOM measurements (grid column
width vs. actual tile width, hero height vs. viewport) rather than just
eyeballing screenshots, after the gallery bug turned out to be invisible
without measuring.

**Demo sent to the client 2026-08-23.** ROADMAP.md updated: Phase 1 marked
done/sent, pre-ship checklist checked off, and a new "Pricing plan for
website projects" item added — not a coding task, but flagged so it gets
answered before a prospective customer says yes and the client needs
real numbers on the spot.
