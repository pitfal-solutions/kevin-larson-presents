// Excerpted from Kevin Larson's real Shoutout Colorado interview
// (published July 23, 2026) — see /context/data-sources.md. Short
// attributed quote with a link to the full piece, not a full reproduction.
const ARTICLE_URL =
  "https://shoutoutcolorado.com/meet-kevin-larson-the-joy-maker-the-bringer-of-dreams/";

export default function ShoutoutColorado() {
  return (
    <section className="section section--muted shoutout">
      <div className="shoutout__card">
        <p className="section__eyebrow">As Featured In</p>
        <h2 className="shoutout__masthead">Shoutout Colorado</h2>
        <p className="shoutout__headline">
          &ldquo;Meet Kevin Larson | The Joy Maker, the Bringer of
          Dreams.&rdquo;
        </p>
        <blockquote className="shoutout__quote">
          &ldquo;Countless love stories started at our events—real
          connections born from real moments. Every production is infused
          with the Flame of Passion, my personal life symbol, reminding us
          to live boldly, love deeply, and lead with positivity.&rdquo;
        </blockquote>
        <a
          href={ARTICLE_URL}
          className="btn btn--ghost"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read the Full Interview
        </a>
      </div>
    </section>
  );
}
