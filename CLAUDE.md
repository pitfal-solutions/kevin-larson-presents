# CLAUDE.md

Operating manual for Claude acting as an AI employee in this workspace,
working with a founder/operator. Read this first in any new session before
touching code or docs.

## Work style

- Prefer small, reviewable changes over large ones.
- Explain the plan before editing when the change affects product behavior
  (copy, UI, event data, pricing/claims). Docs-only or internal-refactor
  changes don't need a pre-explanation.
- Keep changes focused — don't bundle unrelated cleanup into a product change.
- Match the existing code style (see `demos/v1-landing-page/`).
- Run the relevant checks after changes: `npm run build` at minimum;
  `npm run dev` + an actual look in the browser (desktop *and* mobile
  widths) for anything touching the landing page.
- Summarize what changed, what was tested, and what needs human review —
  every time, not just on request.

## What this business is

**Product:** "Kevin Larson Presents" — a 30-year Denver live-events producer
running large ticketed, themed hotel-takeover parties (NYE, Mardi Gras,
Derby Day, Halloween, and more).
**Buyer (of our work):** The owners of Kevin Larson Presents, purchasing a
website facelift and potentially future marketing/social media work.
**Pain we solve:** Their current site is old and clunky, spread across 6
separate WordPress domains, and doesn't showcase past events — which is
exactly what sells a themed party to a prospective attendee.
**Product promise:** A single, modern, high-end landing page that reads as
"top of the line" on sight, built from their *real* content, and structured
so both search engines and AI agents can parse it correctly.
**Our bet:** Elevate execution of an already-strong brand voice, add real
past-event proof, and build in AI/SEO structure (schema.org, semantic HTML,
llms.txt) from day one rather than bolting it on later.

> **Known gap:** real event photos have not been provided yet. v1 ships
> with clearly labeled placeholder image slots — never stock photos
> presented as authentic KLP photography. Closing this gap is the next
> concrete step — see [REVIEW.md](REVIEW.md).

Full context: [`/context`](context/). Personas: [`/customers`](customers/).

## Quality bar

- **Five-second clarity.** Someone landing on the page should understand
  what it is and what to do within 5 seconds — no jargon, no
  throat-clearing above the fold.
- **Works on desktop and mobile.** Every change to the landing page gets
  checked at both a desktop width and a phone width before it's called
  done.
- **Specific event language.** Use the client's real event names, venues,
  and taglines — not generic "premium experiences" marketing-speak.
- **Clarity over cleverness.** If a clever interaction or phrase makes a
  buyer pause to figure it out, cut it.

## Repo map

| Path | Purpose |
|---|---|
| `CLAUDE.md` | This file — how to work in this repo. |
| `ROADMAP.md` | Phased plan, current phase, what's next. |
| `REVIEW.md` | Running log of decisions and periodic self-review. Append, don't rewrite history. |
| `context/` | Business context: product, brand voice/visuals, data provenance, AI-discoverability approach. |
| `customers/` | Personas: buyers (KLP owners) and attendees (their ticket-buying audience). |
| `specs/` | What's actually been built, spec'd against. |
| `demos/` | Runnable prototypes. `demos/v1-landing-page/` is the current one. |
| `routines/` | Recurring-task definitions for this workspace. Documentation only until explicitly scheduled — see [routines/README.md](routines/README.md). |

## Current demo

`demos/v1-landing-page/` — a Next.js single-page site built from real KLP
copy/brand data (dark/gold theme, serif headlines) covering all 5 signature
events, with structured data for AI/SEO. See
[specs/v1-landing-page.md](specs/v1-landing-page.md) for the full spec and
[demos/README.md](demos/README.md) for how to run it.

```bash
cd demos/v1-landing-page
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Working agreements

These were decided explicitly — don't silently relitigate them without
flagging it to the user first:

1. **No fabricated content.** No invented ticket prices, testimonials, or
   attendance stats. Link out to real ticketing pages rather than guessing
   a number. See [context/data-sources.md](context/data-sources.md).
2. **Two customer types.** Buyers (KLP owners, purchasing the facelift) and
   attendees (their ticket-buying audience, who the *page* has to convince).
   See [customers/](customers/).
3. **AI-serving is a first-class feature, not an afterthought.** Every event
   gets `schema.org/Event` JSON-LD; the site ships semantic/server-rendered
   HTML, `robots.txt`, `sitemap.xml`, and `llms.txt` from v1. See
   [context/ai-discoverability.md](context/ai-discoverability.md).
4. **Keep it simple by default.** This is a demo to win a client, not a
   production CMS. One page, no auth, no database, no real payment/email
   backend until a roadmap phase actually calls for it.
5. **Data honesty.** Placeholder images are clearly labeled as placeholders,
   never presented as real event photography. Missing data (pricing, etc.)
   stays missing, never backfilled with a plausible-looking value.
6. **Preserve the existing brand voice.** The client's current copy/tone is
   already good (see [context/brand.md](context/brand.md)) — the ask is
   better execution, not new copywriting. Don't genericize it.

## When you finish meaningful work

- Update `ROADMAP.md` if scope/phase changed.
- Append an entry to `REVIEW.md` if you made a non-obvious decision, found a
  risk, or shipped something worth a checkpoint. Before marking something
  shippable, run it through the "Pre-ship checklist" pinned near the top of
  `REVIEW.md`.
- Don't create new top-level folders beyond the ones in the repo map without
  asking first.
