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

### 2026-09-17 — Admin dashboard + live lead capture

Owner asked for an admin page that tracks traffic/clicks and lead metadata.
This is the first backend in the demo, so it crossed working agreement #4
(no auth/database) — flagged up front, owner chose: Upstash Redis via
Vercel, shared-password auth, and wiring the Members Club form live.

Decisions:

- **First-party tracking, not GA.** A ~100-line beacon (`Analytics.js`)
  posting to `/api/track` gives us exactly the questions the owner asked
  (which CTAs get clicked, where visitors come from, what a lead looked at)
  without a third-party script, consent banner, or IP storage. Visitor id
  is a random `localStorage` value; country comes from Vercel's edge
  header. Bots are filtered by user-agent server-side.
- **"Last non-direct touch" attribution.** First draft was pure
  first-touch, which under testing mis-credited a UTM-tagged visit to
  "direct" because the browser had already visited the bare URL once.
  Switched to: capture referrer/UTM at session start; if that session is
  direct, inherit the visitor's first-touch. Leads carry the same block.
- **Pluggable store, file backend for dev.** `store.js` picks Redis when
  the Upstash env vars exist, else a gitignored JSON file. Means `npm run
  dev` works with zero setup and the admin page can be reviewed today.
  Raw events capped at 20k (newest kept); leads uncapped. Aggregation is
  in-memory on the admin page — fine at demo-site volume, would need
  daily rollups if this ever saw real traffic.
- **Auth is deliberately minimal.** One `ADMIN_PASSWORD`, HMAC-signed
  expiry cookie scoped to `/admin`, timing-safe compare, 7-day TTL. No
  accounts. If the password isn't set the page is locked, not open.
- **Dev-only bug caught by looking at the data, not the UI:** every
  pageview was recorded twice (React strict mode double-runs effects).
  Added a same-path-within-1s guard in the beacon rather than relying on
  prod behaving differently.
- **Members Club form is now real.** Honeypot field for spam, server-side
  email validation, success state replaces the form. The "Demo only"
  note is gone. Client should know: signups now land somewhere they need
  to check (the dashboard / CSV) — nothing emails them yet.

Tested: build clean; full flow in the browser at desktop and 375px (UTM
landing → event page → ticket click → About → signup → login (wrong then
right password) → dashboard for each range → CSV → sign out); curl
checks for 401 on the CSV without a session, 400 on a bad email, 204 on
garbage beacons, honeypot dropped silently.

Needs human: Vercel Storage → Upstash for Redis + `ADMIN_PASSWORD` env
var, then redeploy. Also a decision on whether leads should notify anyone.

### 2026-09-17 — Ticketing system: architecture + cost case (no code yet)

Founder asked for an order-taking/payments/ticket-issuing system to
replace third-party ticketing, with a cost comparison against Eventbrite.
Planned only — nothing built. Outputs:
[specs/ticketing-system.md](specs/ticketing-system.md),
[context/ticketing-cost-comparison.md](context/ticketing-cost-comparison.md),
[context/ticketing-fee-model.py](context/ticketing-fee-model.py).

Decisions made with the founder (recorded in the spec): Stripe +
PayPal/Venmo; QR scan *and* paper check at the door with reconciliation;
simple referral links in v1; Vercel + Neon + Drizzle; ~10k tickets/yr;
keep a buyer-paid fee and KLP keeps the margin; KLP team gets full
admin; scope includes tables, promo codes, hotel-room add-on, merch.

Non-obvious findings worth keeping:

- **KLP is on TicketFairy, not Eventbrite.** Every microsite's "Buy
  Tickets" goes to ticketfairy.com. The comparison covers both, but the
  real incumbent is TicketFairy (10% on <$100 tickets, 9% on $100–$249,
  buyer-paid, processing included).
- **Real prices are now known** from TicketFairy's public event pages
  and back out cleanly: GA $55, VIP $129, table $150, White Rose Gala
  $100 — "$60.50 incl. fees" is exactly $55 + 10%. This doesn't change
  working agreement #1 for the *demo* (v1 still links out), but the
  spec puts real prices into schema.org `offers` once they live in our
  DB.
- **The buyer pays the fee today, not KLP.** So the honest pitch is
  "you keep the ~$29k–$42k/yr that goes to the platform," not "we cut
  your costs." The cost doc leads with this so nobody oversells it.
- **Eventbrite is within ~5% of TicketFairy** on this ticket mix.
  Switching platforms isn't the win; owning checkout is.
- **Tap to Pay needs a native SDK** — can't do door sales from a PWA
  with the phone's NFC. Options recorded (pay-by-QR or a Terminal
  reader); left open.
- **Hotel-room add-on** was chosen into scope by the founder against my
  recommendation; kept in with fulfillment flagged as off-system and
  listed as a client question rather than silently dropped.
- Timing: Jammy Jam is in two days and Paranormal Palace is on sale —
  first realistic cutover is Mardi Gras 2027.

Checked for missing tools per the founder's instruction: no
ticketing/payments skills exist in the library; the MCP registry has
official Stripe, PayPal and Square connectors (not connected) and a
Twilio plugin. Named in the spec as the things to connect when the
build starts.

Rates verified against provider pricing pages on 2026-09-17 — re-check
before quoting to the client.

### 2026-09-17 — Demo checkout flow built into v1 (front end only)

Founder asked for an end-to-end purchase walkthrough in the current app,
not wired to Stripe. Built on the `worktree-ticketing-architecture`
branch so the client's live demo link is untouched until merged. Full
description in the "Demo checkout flow" section of
[specs/v1-landing-page.md](specs/v1-landing-page.md).

Decisions confirmed with the founder before building: show **real
TicketFairy-sourced prices** (not hidden, not invented) with the
$3.50 + 3% fee line from the cost doc; point the existing "See Tickets"
CTAs at the new flow rather than adding a parallel button.

Non-obvious calls:

- **Prices are real but perishable.** They're KLP's live flash-sale
  prices as of today, backed out of TicketFairy's "incl. fees" figures.
  `tickets-data.js` says so in its header with source URLs. Working
  agreement #1 (no fabricated prices) is intact — these are sourced —
  but they will drift, and the file must not be mistaken for a price
  list KLP approved.
- **Jammy Jam is shown as "sales closed"** rather than given sample
  tiers: jammyjam.net was 503 and the event is in two days.
- **Demo banner on every flow page** plus "no payment is taken" copy in
  the tiers section, so the client can't mistake it for live commerce.
- **Order state is `sessionStorage`**, deliberately — it's the exact
  seam the real DB + webhook pipeline replaces, and it means a refresh
  on the confirmation page works while nothing persists across tabs.
- **JSON-LD upgraded as a side effect:** on-sale events now emit a real
  `AggregateOffer` with per-tier prices (verified in-browser), which is
  the AI/SEO payoff the roadmap's Phase 2 wanted.
- Port 3000 was occupied by an unrelated project on this machine; ran
  the dev server on 3111 for the browser check. Not a code change.

Tested: full flow on desktop (Paranormal Palace: 2 GA + 1 VIP + 1 table,
`FLASH15` applied, validation errors fire, processing state, confirmation
with 3 QR codes + table, ticket page, simulated scan) and on a 375px
phone viewport (Mardi Gras: 2 Royal Pass via Apple Pay button). No
horizontal overflow at 375px on tiers, checkout, or confirmation.
`npm run build` clean, 16 static pages + 2 dynamic routes.

Needs human review before this goes near the client: whether the fee
line should be visible in a demo at all (it was the founder's call, but
it's also a business decision the client hasn't made), and whether to
merge to `main` (which auto-deploys to the live link).

### 2026-09-18 — Jammy Jam removed (event cancelled)

Founder instruction: Jammy Jam was cancelled — remove it completely. Done
on the same branch as the demo checkout.

Removed: the event entry (`events-data.js`), its ticket-tier entry
(`tickets-data.js`), the "Photo coming soon — Jammy Jam" tile in the
homepage gallery, its poster image, its line in `llms.txt`, its mention in
the site meta description. `/events/jammy-jam` now 404s; sitemap is down
to 6 URLs.

Ripple effects handled, not just the deletion:

- **"Five signature nights" was real copy in three places** (hero
  subtitle, events-grid eyebrow, llms.txt) — now "four." Worth
  remembering that the count is baked into copy, not derived.
- **The events grid orphaned a card.** `auto-fill, minmax(300px)` gave
  3 + 1 at desktop with four events. Switched to fixed column counts:
  4-across ≥ 961px, 2×2 to 601px, single column below. Verified 1 row at
  1024, 2 rows at 768, 4 rows at 375, no horizontal overflow.
- **Volume assumption in the ticketing spec** was "2,000 × 5 events" —
  flagged for re-confirmation rather than silently rewritten as 2,500 × 4.
- The `hasPhotos: false` / "sales closed" code paths are now unused but
  left in place as guards for any future event added before its first
  year. Small, and cheaper than re-adding them later.
- Docs updated to four events (CLAUDE.md, product, data-sources,
  attendees, ai-discoverability, v1 spec, ticketing spec, demos README,
  ROADMAP). Historical REVIEW/ROADMAP entries about the placeholder are
  left as written — that's what happened at the time.

`npm run build` clean: 14 static pages + 2 dynamic routes (was 16 + 2).
Jammy Jam's microsite (jammyjam.net) still exists and is the client's to
retire — noted in product.md under the domain-consolidation decision.
