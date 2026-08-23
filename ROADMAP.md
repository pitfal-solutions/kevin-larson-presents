# Roadmap

## Phase 0 — Discovery (done, 2026-08-22)

- Pulled real copy, brand assets (colors/fonts/logo), and event details from
  the client's live site + 5 event microsites.
- Confirmed with client: event types (themed ticketed hotel-takeover
  parties), real photos will be provided, git+Vercel demo link is the
  target deliverable.
- Documented in [context/](context/) and [customers/](customers/).

## Phase 1 — v1 demo (done, sent to client 2026-08-23)

High-end demo built from real KLP content, deployed and live — see
[specs/v1-landing-page.md](specs/v1-landing-page.md). Homepage with a
real-photo hero + event grid + gallery, plus a dedicated page per event
(`/events/<slug>`) with its own photo gallery, an About page (Meet The
Visionary, Shoutout Colorado feature, Meet The Team), real Google reviews,
an "As Seen In" press/client marquee, and the real KLP recap video. Real
event photography for 4 of 5 events (Jammy Jam correctly still uses a
placeholder — hasn't happened yet) plus real poster art for all 5. Mobile
nav, gallery sizing, and hero spacing bugs found and fixed along the way —
see [REVIEW.md](REVIEW.md) for the full history.

**Sent to the client 2026-08-23.** Live at
https://v1-landing-page-mu.vercel.app, GitHub-connected for auto-deploy on
push. Everything in this phase is complete — next step is the client's
response.

## Phase 2 — Real content + AI/SEO structure

- Swap in Jammy Jam photos once the event happens.
- Decide the domain-consolidation strategy (6 domains → 1, or keep
  microsites and cross-link) — this is a client decision, not ours to
  assume. See [context/ai-discoverability.md](context/ai-discoverability.md).
- Add a machine-readable events feed (`/events.json`), confirm ticket
  pricing can be shown directly (currently only linked out).

## Pricing plan for website projects (not started, needed before Phase 3)

Client wants real numbers ready before a prospective customer says yes —
came up directly from this project, now that a demo is actually out the
door. Needs, before it's usable in a sales conversation:

- Tiered pricing structure (e.g. a one-off facelift/demo like this one vs.
  a full production build with CMS vs. ongoing retainer/marketing add-on
  per [Phase 4](#phase-4--marketing-upsell-future-not-committed)).
- A reference cost basis — this project is a real data point: what a demo
  like the Kevin Larson Presents one actually took (scope, time, decisions
  made) is worth using to ground the numbers, not guessing from scratch.
- Where the price line sits between "website facelift" and "full product
  build" (real CMS, domain migration, ongoing support) — those are very
  different jobs and probably need different price anchors.

Not a coding task — flagging here so it doesn't get lost, and so it's
answered before the client comes back wanting to move forward.

## Phase 3 — Production build (contingent on client sign-off)

- Only if the client approves the demo direction. Scope TBD with them:
  likely a real CMS/admin so KLP can update events themselves without a
  developer, migration off WordPress, DNS cutover plan.

## Phase 4 — Marketing upsell (future, not committed)

- Social media enhancements, as mentioned by the client as a possible
  follow-on purchase. Not scoped yet — revisit only if Phase 3 happens.

---

**Current phase: 1 (done, demo sent to client).** Live at
https://v1-landing-page-mu.vercel.app — see
[demos/v1-landing-page/](demos/README.md). Next concrete steps: the
client's response to the demo, and working out the
[pricing plan](#pricing-plan-for-website-projects-not-started-needed-before-phase-3)
before that conversation needs it.
