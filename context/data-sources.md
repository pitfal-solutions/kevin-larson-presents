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

## Event photography (added 2026-08-22)

Client provided access to real event photos at
`/Volumes/Elements/pitfal-solutions/photo_backup/events` — every subfolder
containing `Kevin_Larson` is fair game. Folders found (raw camera files,
~30MB each, not touched or moved):

| Folder | Event | Used? |
|---|---|---|
| Kevin_Larson_2026_New_Years (242 photos) | White Rose Gala | Yes — most recent |
| Kevin_Larson_2025_Mardi_Gras (79 photos) | Denver Mardi Gras | Yes — most recent |
| Kevin_Larson_2024_Kentucky_Derby (263 photos) | Denver Derby Day | Yes — most recent available (no 2025/2026 folder exists) |
| Kevin_Larson_2025_Paranormal_Palace (111 photos, 3 subfolders) | Paranormal Palace | Yes — most recent |
| Kevin_Larson_2023/2024 duplicates of the above | — | No — superseded by the most recent year |
| Kevin_Larson_2024_Naughty_Ball (123 photos) | Not a current-site event | No — client confirmed leave it out; not one of the 5 signature nights |
| (none) | Jammy Jam | No photos exist — event hasn't happened yet (Sept 2026) |

For each of the 4 events with photos: hand-reviewed a ~12-photo sample
spread across the shoot, picked 8 (1 hero + 7 gallery), resized to 1800px
wide / ~75% JPEG quality for web (originals are 6500×4356, ~30MB each —
untouched on the source drive). Curation leaned toward photos that read
well on a public marketing page — skipped anything with a recognizable
copyrighted costume character (a Pennywise cosplay) or anything overtly
risqué, even though authentic to the event's real energy, since this page
represents the brand rather than one attendee's night.

## What's still missing (treat as `null`, never invented)

- **Exact ticket prices.** None of the live sites publish numeric pricing —
  they link out to Ticketfairy/Eventbrite. v1 demo copy should say "See
  pricing" / link out, not invent a number.
- **Jammy Jam photos.** Honest placeholder stays until the event happens —
  see [../specs/v1-landing-page.md](../specs/v1-landing-page.md).
- **Which past events to feature and testimonials/reviews** — not on the
  current site; ask the client before adding anything that reads as social
  proof.

## Ground rule

Same as the Top Photographer project this workspace pattern is based on:
missing data means "not confirmed," never "doesn't exist," and nothing gets
backfilled with a plausible-looking value. If a stat or quote isn't sourced
from the client or their live sites, it doesn't go on the page.
