# AI-discoverability & future-proof SEO

The client asked explicitly for a site that's "AI friendly for scraping and
interacting with... future proof for any and all SEO / AI SEO available
today or coming online soon." This is a first-class requirement for v1, not
a later phase.

## What actually moves the needle (2026)

1. **Real structured data, not just meta tags.** Each event gets
   `schema.org/Event` JSON-LD (name, startDate, location, offers →
   ticket link, performer where known). This is what lets Google's rich
   results, AI Overviews, and agent tools (ChatGPT, Claude, Gemini browsing)
   correctly extract "what, when, where, how to buy" without guessing.
2. **Clean semantic HTML + fast, server-rendered pages.** Agents that fetch
   pages directly (not just search-indexed) do better with real `<h1>`/
   `<section>`/`<time>` structure than with JS-only rendering. Next.js
   App Router (server components) gets this for free.
3. **`llms.txt` at the root**, pointing to a clean summary of the business
   and events — cheap to add, low-but-nonzero adoption as of 2026 (see the
   Top Photographer project's same note in its `ai-discoverability.md` for
   why we don't treat it as sufficient alone).
4. **A machine-readable events feed** — `/events.json` (or similar) so an
   agent doesn't have to scrape rendered HTML to get the event list. Mirrors
   the "serve the same data as a webpage, as Markdown, as JSON" bet from the
   Top Photographer project, adapted to an events business.
5. **Canonical, deduplicated URLs.** Today the same brand is split across 6
   domains with no canonical relationship — that actively hurts both
   traditional SEO (duplicate/competing signals) and agent comprehension
   (which one is "the" site?). v1's single landing page sidesteps this for
   the demo; a real migration would need `rel=canonical` / redirects
   strategy from the client's actual domains — flagged in
   [../ROADMAP.md](../ROADMAP.md) as a Phase 2 decision, not v1.
6. **Descriptive `alt` text and OpenGraph images** for every event, since
   image search and link-preview agents both depend on it.

## What v1 demo actually implements

- JSON-LD `Event` blocks for all 5 signature events.
- Semantic HTML, server-rendered (Next.js App Router).
- `robots.txt` + `sitemap.xml`.
- `llms.txt` summarizing the business + events in plain text.
- OpenGraph/Twitter card meta tags.

Anything beyond that (real `/events.json` API, MCP tool, multi-domain
canonicalization) is Phase 2+ — see [../ROADMAP.md](../ROADMAP.md).
