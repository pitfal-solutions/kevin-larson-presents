import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminSession } from "../lib/auth";
import { STORE_BACKEND, getEvents, getLeads } from "../lib/store";
import {
  RANGES,
  landingPath,
  shortDate,
  sourceLabel,
  summarize,
  utmLabel,
} from "../lib/aggregate";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

const fmt = new Intl.NumberFormat("en-US");

function formatDate(ts) {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Denver",
  });
}

function Stat({ label, value, hint }) {
  return (
    <div className="admin__stat">
      <p className="admin__stat-label">{label}</p>
      <p className="admin__stat-value">{fmt.format(value)}</p>
      {hint ? <p className="admin__stat-hint">{hint}</p> : null}
    </div>
  );
}

// Horizontal bar list: one series, so the bar carries magnitude and the
// text carries identity — no legend needed.
function BarList({ title, rows, empty = "Nothing yet." }) {
  const max = rows.length ? rows[0].n : 0;
  const total = rows.reduce((sum, r) => sum + r.n, 0);
  return (
    <section className="admin__card">
      <h2 className="admin__card-title">{title}</h2>
      {rows.length === 0 ? (
        <p className="admin__empty">{empty}</p>
      ) : (
        <ol className="admin__bars">
          {rows.slice(0, 12).map((row) => (
            <li key={row.key} className="admin__bar-row" title={`${row.key}: ${fmt.format(row.n)}`}>
              <span className="admin__bar-key">{row.key}</span>
              <span className="admin__bar-track">
                <span className="admin__bar-fill" style={{ width: `${(row.n / max) * 100}%` }} />
              </span>
              <span className="admin__bar-n">
                {fmt.format(row.n)}
                <small> {Math.round((row.n / total) * 100)}%</small>
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function DailyChart({ daily }) {
  const max = Math.max(1, ...daily.map((d) => d.n));
  return (
    <section className="admin__card admin__card--wide">
      <h2 className="admin__card-title">Page views by day</h2>
      {daily.length === 0 ? (
        <p className="admin__empty">Nothing yet.</p>
      ) : (
        <div className="admin__chart" role="img" aria-label="Page views per day">
          {daily.map((d) => (
            <div
              key={d.day}
              className="admin__chart-col"
              title={`${shortDate(d.day)}: ${fmt.format(d.n)} views`}
            >
              <span
                className="admin__chart-bar"
                style={{ height: `${Math.max(d.n ? 4 : 1, (d.n / max) * 100)}%` }}
              />
            </div>
          ))}
        </div>
      )}
      {daily.length > 1 ? (
        <div className="admin__chart-axis">
          <span>{shortDate(daily[0].day)}</span>
          <span>{shortDate(daily[daily.length - 1].day)}</span>
        </div>
      ) : null}
    </section>
  );
}

function LeadsTable({ leads }) {
  return (
    <section className="admin__card admin__card--wide">
      <div className="admin__card-head">
        <h2 className="admin__card-title">Leads</h2>
        <a href="/admin/leads.csv" className="btn btn--ghost btn--small">
          Download all as CSV
        </a>
      </div>
      {leads.length === 0 ? (
        <p className="admin__empty">No Members Club signups in this range.</p>
      ) : (
        <div className="admin__table-wrap">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Signed up</th>
                <th>Came from</th>
                <th>Campaign</th>
                <th>Landed on</th>
                <th>Events viewed</th>
                <th>Device</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td className="admin__td-email">{l.email}</td>
                  <td>{formatDate(l.ts)}</td>
                  <td>{sourceLabel(l)}</td>
                  <td>{utmLabel(l.utm) || "—"}</td>
                  <td>{landingPath(l.landing)}</td>
                  <td>{l.eventsViewed?.length ? l.eventsViewed.join(", ") : "—"}</td>
                  <td>
                    {l.device}
                    {l.country ? ` · ${l.country}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default async function AdminPage({ searchParams }) {
  if (!(await isAdminSession())) redirect("/admin/login");

  const params = await searchParams;
  const rangeKey = RANGES[params.range] ? params.range : "30";
  const [events, leads] = await Promise.all([getEvents(), getLeads()]);
  const s = summarize({ events, leads, rangeKey });

  return (
    <main className="admin__main">
      <header className="admin__header">
        <div>
          <p className="section__eyebrow">Kevin Larson Presents</p>
          <h1 className="admin__title">Site traffic &amp; leads</h1>
        </div>
        <div className="admin__header-actions">
          <nav className="admin__ranges" aria-label="Date range">
            {Object.entries(RANGES).map(([key, r]) => (
              <Link
                key={key}
                href={`/admin?range=${key}`}
                className={`admin__range${key === rangeKey ? " admin__range--active" : ""}`}
                aria-current={key === rangeKey ? "page" : undefined}
              >
                {r.label}
              </Link>
            ))}
          </nav>
          <form action={logout}>
            <button type="submit" className="btn btn--ghost btn--small">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="admin__stats">
        <Stat label="Page views" value={s.totals.pageviews} />
        <Stat label="Visitors" value={s.totals.visitors} hint="unique browsers" />
        <Stat label="Sessions" value={s.totals.sessions} />
        <Stat label="CTA clicks" value={s.totals.clicks} />
        <Stat
          label="Leads"
          value={s.totals.uniqueLeads}
          hint={
            s.totals.leads !== s.totals.uniqueLeads
              ? `${fmt.format(s.totals.leads)} signups`
              : "Members Club"
          }
        />
      </div>

      <div className="admin__grid">
        <DailyChart daily={s.daily} />
        <BarList title="Pages" rows={s.pages} />
        <BarList title="Clicks" rows={s.clicksByLabel} empty="No CTA clicks yet." />
        <BarList title="Sources (new visitors)" rows={s.referrers} />
        <BarList
          title="Campaigns (UTM)"
          rows={s.campaigns}
          empty="No tagged links yet — add ?utm_source=… to links you share."
        />
        <BarList title="Devices" rows={s.devices} />
        <BarList title="Countries" rows={s.countries} empty="Only available on the live Vercel deploy." />
        <LeadsTable leads={s.leads} />
      </div>

      <p className="admin__foot">
        Storing to <strong>{STORE_BACKEND === "redis" ? "Upstash Redis" : "local file (.data/analytics.json)"}</strong>
        {STORE_BACKEND === "file"
          ? " — dev only; provision Upstash Redis in Vercel for the live site."
          : "."}{" "}
        Times shown in Mountain Time. First-party only: no cookies from third parties, no IP addresses stored.
      </p>
    </main>
  );
}
