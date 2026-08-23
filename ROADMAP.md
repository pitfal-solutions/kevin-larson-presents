# Roadmap

## Phase 0 — Discovery (done, 2026-08-22)

- Pulled real copy, brand assets (colors/fonts/logo), and event details from
  the client's live site + 5 event microsites.
- Confirmed with client: event types (themed ticketed hotel-takeover
  parties), real photos will be provided, git+Vercel demo link is the
  target deliverable.
- Documented in [context/](context/) and [customers/](customers/).

## Phase 1 — v1 demo (done, 2026-08-22)

High-end demo built from real KLP content, deployed and live — see
[specs/v1-landing-page.md](specs/v1-landing-page.md). Homepage with a
real-photo hero + event grid + gallery, plus a dedicated page per event
(`/events/<slug>`) with its own photo gallery. Real event photography for
4 of 5 events (Jammy Jam correctly still placeholder — hasn't happened).
Live at https://v1-landing-page-mu.vercel.app, GitHub-connected for
auto-deploy on push.

## Phase 2 — Real content + AI/SEO structure

- Swap in Jammy Jam photos once the event happens.
- Decide the domain-consolidation strategy (6 domains → 1, or keep
  microsites and cross-link) — this is a client decision, not ours to
  assume. See [context/ai-discoverability.md](context/ai-discoverability.md).
- Add a machine-readable events feed (`/events.json`), confirm ticket
  pricing can be shown directly (currently only linked out).

## Phase 3 — Production build (contingent on client sign-off)

- Only if the client approves the demo direction. Scope TBD with them:
  likely a real CMS/admin so KLP can update events themselves without a
  developer, migration off WordPress, DNS cutover plan.

## Phase 4 — Marketing upsell (future, not committed)

- Social media enhancements, as mentioned by the client as a possible
  follow-on purchase. Not scoped yet — revisit only if Phase 3 happens.

---

**Current phase: 1 (done), moving into 2.** Demo is live — see
[demos/v1-landing-page/](demos/README.md). Next concrete step: client
review of the live demo, then decide on Phase 2 scope.
