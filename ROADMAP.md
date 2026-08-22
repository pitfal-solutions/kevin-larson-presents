# Roadmap

## Phase 0 — Discovery (done, 2026-08-22)

- Pulled real copy, brand assets (colors/fonts/logo), and event details from
  the client's live site + 5 event microsites.
- Confirmed with client: event types (themed ticketed hotel-takeover
  parties), real photos will be provided, git+Vercel demo link is the
  target deliverable.
- Documented in [context/](context/) and [customers/](customers/).

## Phase 1 — v1 demo landing page (current)

Single-page, high-end demo built from real KLP content — see
[specs/v1-landing-page.md](specs/v1-landing-page.md). Goal: a link the
client can open and immediately see as a step up from what they have.
Placeholder image slots until real event photos arrive.

**Blocked on:** client sending real event photos (location TBD — see
[REVIEW.md](REVIEW.md)).

## Phase 2 — Real content + AI/SEO structure

- Swap in real photos once provided.
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

**Current phase: 1.** Next concrete step: get real event photos from the
client, then build the demo in [demos/v1-landing-page/](demos/README.md).
