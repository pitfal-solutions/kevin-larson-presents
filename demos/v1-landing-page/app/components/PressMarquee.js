// Real press mentions and client names pulled from the "As Seen In" and
// client-roster slides on kevinlarsonpresents.com (2026-08-23) — see
// /context/data-sources.md. Rendered as text wordmarks rather than
// reproducing each outlet's trademarked logo graphic.
const PRESS = ["E!", "The Denver Post", "A&E", "Westword", "Rocky Mountain News", "5280", "Woman's Day", "HBO", "ABC", "NBC", "CBS"];
const CLIENTS = ["Four Seasons Hotel", "Red Bull", "Jim Beam", "Aspen Snowmass"];

function Row({ label, items, reverse }) {
  const doubled = [...items, ...items];
  return (
    <div className="press-row">
      <span className="press-row__label">{label}</span>
      <div className="press-row__track-wrap">
        <div className={`press-row__track${reverse ? " press-row__track--reverse" : ""}`}>
          {doubled.map((item, i) => (
            <span className="press-row__item" key={`${item}-${i}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PressMarquee() {
  return (
    <section className="section section--muted press-marquee">
      <div className="section__header">
        <p className="section__eyebrow">Credibility, Not Just Confetti</p>
        <h2 className="section__title">As Seen In &amp; Trusted By</h2>
      </div>
      <Row label="As Seen In" items={PRESS} />
      <Row label="Trusted By" items={CLIENTS} reverse />
      <p className="press-marquee__note">
        Events created in Denver, Beverly Hills, Las Vegas, Portland, Salt Lake City,
        Minneapolis, St. Louis, Aspen Snowmass and more.
      </p>
    </section>
  );
}
