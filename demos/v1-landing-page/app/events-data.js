// Real event data pulled from the live KLP microsites on 2026-08-22.
// See /context/data-sources.md in the repo root for provenance.
// Ticket prices are never invented here — every event links out to its
// real ticketing page instead.
//
// Photos in public/images/events/<slug>/ are real KLP event photography,
// provided by the client from /Volumes/Elements/pitfal-solutions/photo_backup
// (2026-08-22), resized/compressed for web from the original camera files.
// Jammy Jam has no event photos yet — it hasn't happened (Sept 2026).
//
// poster.jpg per event is the real marketing poster pulled from
// kevinlarsonpresents.com (2026-08-23) — official artwork, not candid
// photography, so it's used for all 5 events including Jammy Jam.

export const events = [
  {
    slug: "white-rose-gala",
    name: "White Rose Gala",
    theme: "New Year's Eve — Gatsby-Style Elegance",
    tagline: "Deco, diamonds & decibels.",
    venue: "The Ritz-Carlton Denver",
    address: "1881 Curtis Street, Denver, CO",
    date: "2026-12-31",
    dateLabel: "Thursday, December 31, 2026",
    time: "8:00 PM – 1:00 AM",
    ageRestriction: "21+",
    highlights: [
      "Live band + DJ fusion — swing meets modern beats",
      "Theatrical acts, showgirl performances & speakeasy dance floor",
      "Midnight balloon drop, Gatsby casino gaming",
      "Hotel takeover — ride the elevator home",
    ],
    ticketUrl: "https://newyearspartydenver.com/",
    hasPhotos: true,
    photoCaption: "White Rose Gala, New Year's Eve 2026",
    heroAlt: "A packed dance floor with hands raised under dramatic lighting at the White Rose Gala",
    posterAlt: "White Rose Gala 2026 event poster — Ritz-Carlton Denver, December 31",
    gallery: [
      { file: "g1.jpg", alt: "Crowd cheering under a lit 2026 sign at the White Rose Gala" },
      { file: "g2.jpg", alt: "Couple in gold sequin glam at the White Rose Gala" },
      { file: "g3.jpg", alt: "Couple in 1920s flapper-style formalwear" },
      { file: "g4.jpg", alt: "Upright bassist performing on stage" },
      { file: "g5.jpg", alt: "Guests embracing on the dance floor under purple lighting" },
      { file: "g6.jpg", alt: "Guests in 1920s-style formalwear posing together" },
      { file: "g7.jpg", alt: "Guest in elaborate performance makeup and costume" },
      { file: "g8.jpg", alt: "Guests in gold gowns under the White Rose Gala sign" },
      { file: "g9.jpg", alt: "Guests dancing on a crowded floor at the White Rose Gala" },
    ],
  },
  {
    slug: "denver-mardi-gras",
    name: "Denver Mardi Gras",
    theme: "NOLA Hotel Takeover",
    tagline: "NOLA stops. Denver doesn’t!",
    venue: "DoubleTree by Hilton — DTC",
    address: "7801 E Orchard Rd, Greenwood Village, CO",
    date: "2027-02-27",
    dateLabel: "Saturday, February 27, 2027",
    time: "Doors 7:00 PM",
    ageRestriction: "21+",
    highlights: [
      "Live music all night — brass, beats & basslines",
      "Roaming performers and stilt walkers on every floor",
      "VIP: drinks included all night, dedicated bars, priority access",
      "Discounted hotel rooms — atrium rooms sell out every year",
    ],
    ticketUrl: "https://denvermardigras.com/",
    hasPhotos: true,
    photoCaption: "Denver Mardi Gras 2025",
    heroAlt: "A packed, colorful crowd filling the room at Denver Mardi Gras",
    posterAlt: "Denver Mardi Gras 2027 event poster — hotel takeover, February 27",
    gallery: [
      { file: "g1.jpg", alt: "Group of guests in gold and green Mardi Gras glam" },
      { file: "g2.jpg", alt: "Horn section performing live at Denver Mardi Gras" },
      { file: "g3.jpg", alt: "Guest with colorful hair extensions dancing" },
      { file: "g4.jpg", alt: "Crowd in masks under neon lighting" },
      { file: "g5.jpg", alt: "Performer in a sequin jacket and star cap" },
      { file: "g6.jpg", alt: "Couple in gold masquerade masks" },
      { file: "g7.jpg", alt: "Guest in a red sequin lobster headpiece" },
      { file: "g8.jpg", alt: "Three guests in masks and Mardi Gras glam" },
      { file: "g9.jpg", alt: "Brass band performing over a packed crowd" },
    ],
  },
  {
    slug: "denver-derby-day",
    name: "Denver Derby Day",
    theme: "The Kentucky Derby, Elevated Mile-High Style",
    tagline: "Dress to impress — and dress to win.",
    venue: "The Ritz-Carlton Denver",
    address: "1881 Curtis Street, Denver, CO",
    date: "2027-05-01",
    dateLabel: "Saturday, May 1, 2027",
    time: "Doors 1:00 PM",
    ageRestriction: "21+",
    highlights: [
      "Multiple 10-foot screens for the race, two dance floors",
      "Best Dressed & Derby Fashion Contest — runway competition",
      "Mint Juleps and signature cocktails all day",
      "After Party (5–8 PM) included with admission",
    ],
    ticketUrl: "https://denverderby.org/",
    hasPhotos: true,
    photoCaption: "Denver Derby Day 2024",
    heroAlt: "A packed street full of guests in Derby Day fashion",
    posterAlt: "Denver Derby Day 2027 event poster — Ritz-Carlton Denver, May 1",
    gallery: [
      { file: "g1.jpg", alt: "Large group of guests in Derby Day fashion" },
      { file: "g2.jpg", alt: "Three guests in colorful Derby dresses and fascinators" },
      { file: "g3.jpg", alt: "Two guests in pink feather fascinators" },
      { file: "g4.jpg", alt: "Couple in Derby hats posing together" },
      { file: "g5.jpg", alt: "Guest with a floral fascinator and toy horse" },
      { file: "g6.jpg", alt: "Guests taking a selfie in Derby fascinators" },
      { file: "g7.jpg", alt: "Couple watching the race, pointing at the screen" },
      { file: "g8.jpg", alt: "Guest reacting to the race on the big screen at Denver Derby Day" },
      { file: "g9.jpg", alt: "Three friends in Derby fashion posing together" },
    ],
  },
  {
    slug: "paranormal-palace",
    name: "Paranormal Palace",
    theme: "Denver Halloween Takeover",
    tagline: "$2,500 Costume Contest. Mandatory costumes.",
    venue: "DoubleTree by Hilton — DTC",
    address: "7801 E Orchard Rd, Greenwood Village, CO",
    date: "2026-10-31",
    dateLabel: "Saturday, October 31, 2026",
    time: "8:00 PM – 1:00 AM",
    ageRestriction: "21+ · costumes required",
    highlights: [
      "8,000 sq ft haunted forest with stage shows",
      "Multi-level atrium — 41 balcony rooms overlooking the floor",
      "20+ performers, multiple DJs, interactive exhibits",
      "VIP: four exclusive zones, private bars, table reservations",
    ],
    ticketUrl: "https://denverhalloween.org/",
    hasPhotos: true,
    photoCaption: "Paranormal Palace 2025",
    heroAlt: "A DJ overlooking a packed, multi-level dance floor at Paranormal Palace",
    posterAlt: "Paranormal Palace 2026 event poster — hotel takeover, October 31",
    gallery: [
      { file: "g1.jpg", alt: "Performer in dramatic skeleton body paint" },
      { file: "g3.jpg", alt: "Two performers in elaborate creature masks" },
      { file: "g4.jpg", alt: "Performer in dramatic gothic stage makeup" },
      { file: "g5.jpg", alt: "DJ mixing at Paranormal Palace" },
      { file: "g6.jpg", alt: "Guest in a Día de los Muertos bridal costume" },
      { file: "g7.jpg", alt: "Couple embracing in costume at Paranormal Palace" },
      { file: "g8.jpg", alt: "Performer in dramatic devil horns and red lighting" },
    ],
  },
  {
    slug: "jammy-jam",
    name: "Jammy Jam",
    theme: "Denver's Grown-Up Pajama Party",
    tagline: "Bedtime, turned into a celebration.",
    venue: "The Church, Denver",
    address: "Denver, CO",
    date: "2026-09-19",
    dateLabel: "Saturday, September 19, 2026",
    time: "7:00 PM – 11:00 PM · After Party 11 PM–2 AM",
    ageRestriction: "21+",
    highlights: [
      "Live performances, DJ & dance floor, immersive installations",
      "VIP: four private areas including a rooftop deck",
      "After Party with its own bar, dance floor & VIP Grotto",
      "Matching pajamas encouraged — come cozy, come glamorous",
    ],
    ticketUrl: "https://jammyjam.net/",
    hasPhotos: false,
    posterAlt: "The Jammy Jam 2026 event poster — The Church, September 19",
    gallery: [],
  },
];

export function getEvent(slug) {
  return events.find((e) => e.slug === slug);
}

export function heroImagePath(event) {
  return `/images/events/${event.slug}/hero.jpg`;
}

export function galleryImagePath(event, file) {
  return `/images/events/${event.slug}/${file}`;
}
