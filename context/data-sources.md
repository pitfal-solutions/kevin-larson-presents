# Data sources

## What we have

Pulled live on 2026-08-22 from URLs the client gave us directly:

| Source | Used for |
|---|---|
| kevinlarsonpresents.com | Brand voice, taglines, 30-year positioning, social links, list of 5 signature events |
| newyearspartydenver.com | White Rose Gala (NYE) copy, venue, date, inclusions |
| denvermardigras.com | Denver Mardi Gras copy, venue, date, inclusions |
| denverderby.org | Denver Derby Day copy, venue, date, inclusions |
| denverhalloween.org | Paranormal Palace (Halloween) copy, venue, date, inclusions |
| jammyjam.net | Jammy Jam copy, venue, date, inclusions |

Confirmed from these sources: event names, themes, venues, dates/times, age
restrictions, what's included at each tier (GA vs VIP), taglines, social
media handles (Facebook, TikTok, Instagram, YouTube), font choices, color
values.

## What's still missing (treat as `null`, never invented)

- **Exact ticket prices.** None of the live sites publish numeric pricing —
  they link out to Ticketfairy/Eventbrite. v1 demo copy should say "See
  pricing" / link out, not invent a number.
- **Real event photos.** Client confirmed real photos/video exist and will
  be provided. Until then, the demo uses clearly-labeled placeholder image
  slots — see [../specs/v1-landing-page.md](../specs/v1-landing-page.md). Do
  not source stock photos that could be mistaken for real KLP event photos.
- **Which past events to feature and testimonials/reviews** — not on the
  current site; ask the client before adding anything that reads as social
  proof.

## Ground rule

Same as the Top Photographer project this workspace pattern is based on:
missing data means "not confirmed," never "doesn't exist," and nothing gets
backfilled with a plausible-looking value. If a stat or quote isn't sourced
from the client or their live sites, it doesn't go on the page.
