// Real team names/titles from kevinlarsonpresents.com/about-us/ (2026-08-23).
const TEAM = [
  { name: "Kevin Larson", role: "CEO" },
  { name: "Ryan Chipps", role: "Producer / Lead Marketer" },
  { name: "Holly Joy", role: "Producer / Entertainment" },
];

export default function MeetTheTeam() {
  return (
    <section className="section team">
      <div className="section__header">
        <p className="section__eyebrow">Behind Every Signature Night</p>
        <h2 className="section__title">Meet The Team</h2>
      </div>
      <div className="team__grid">
        {TEAM.map((t) => (
          <div className="team__card" key={t.name}>
            <h3>{t.name}</h3>
            <p>{t.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
