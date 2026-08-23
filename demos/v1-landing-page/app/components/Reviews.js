// Real Google reviews for Kevin Larson Presents, pulled 2026-08-23 —
// see /context/data-sources.md. Aggregate rating and quotes are genuine,
// attributed by reviewer name, sourced via the business's public Google
// review listing. Never invented.
const REVIEWS = [
  {
    name: "Jeremy Chisum",
    text: "Kevin puts on the most amazing events! The NYE White Rose Gala was incredible! The event spanned across one of the Ritz-Carlton's entire floor. Every guest my wife and I met were friendly, fun, and excited to be at the gala!",
  },
  {
    name: "Connie Hewitson",
    text: "Kevin Larson's Denver derby party? Completely and utterly FABulous.",
  },
  {
    name: "Rachel Hague",
    text: "My favorite parties are Halloween, White Rose (NYE), Mardi Gras... and Derby! Every time, these are the most fun and interesting experiences I get to do locally throughout the year.",
  },
  {
    name: "Regan Doyle",
    text: "These are the most well run, and super fun, events in all of Colorado! Amazing themes and entertainment. The crowd that Kevin pulls in is what makes these events the top events in the state.",
  },
];

const GOOGLE_URL = "https://www.google.com/maps/search/Kevin+Larson+Presents+Denver";

export default function Reviews() {
  const doubled = [...REVIEWS, ...REVIEWS];

  return (
    <section className="section reviews">
      <div className="section__header">
        <p className="section__eyebrow">From the Crowd</p>
        <h2 className="section__title">What Denver Is Saying</h2>
        <p className="reviews__rating">
          <span className="reviews__stars" aria-hidden="true">★★★★</span>
          <span className="reviews__stars reviews__stars--partial" aria-hidden="true">★</span>
          <span>4.1 on Google · 41 reviews</span>
        </p>
      </div>
      <div className="reviews__track-wrap">
        <div className="reviews__track">
          {doubled.map((r, i) => (
            <blockquote className="review-card" key={`${r.name}-${i}`}>
              <p>&ldquo;{r.text}&rdquo;</p>
              <cite>
                {r.name} <span>· Google review</span>
              </cite>
            </blockquote>
          ))}
        </div>
      </div>
      <div className="reviews__cta">
        <a href={GOOGLE_URL} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
          Read All Reviews on Google
        </a>
      </div>
    </section>
  );
}
