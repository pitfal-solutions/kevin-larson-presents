// Pure aggregation over raw events/leads for the admin dashboard. No I/O.

const DAY_MS = 24 * 60 * 60 * 1000;

export const RANGES = {
  "7": { label: "7 days", days: 7 },
  "30": { label: "30 days", days: 30 },
  "90": { label: "90 days", days: 90 },
  all: { label: "All time", days: null },
};

export function rangeStart(rangeKey, now = Date.now()) {
  const range = RANGES[rangeKey] || RANGES["30"];
  return range.days ? now - range.days * DAY_MS : 0;
}

function dayKey(ts) {
  return new Date(ts).toISOString().slice(0, 10);
}

function count(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (key === null || key === undefined) continue;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()]
    .map(([key, n]) => ({ key, n }))
    .sort((a, b) => b.n - a.n);
}

export function referrerHost(referrer) {
  if (!referrer) return "Direct / none";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return referrer;
  }
}

// Where a visitor/lead came from: referrer host, else the UTM source on a
// tagged link (no referrer is sent when e.g. Instagram opens an in-app
// browser), else direct.
export function sourceLabel(item) {
  if (item.referrer) return referrerHost(item.referrer);
  if (item.utm?.source) return `${item.utm.source} (tagged link)`;
  return "Direct / none";
}

export function landingPath(landing) {
  return (landing || "").split("?")[0] || "—";
}

export function shortDate(dayKey) {
  return new Date(`${dayKey}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function utmLabel(utm) {
  if (!utm || !utm.source) return null;
  return [utm.source, utm.medium, utm.campaign].filter(Boolean).join(" / ");
}

export function summarize({ events, leads, rangeKey, now = Date.now() }) {
  const start = rangeStart(rangeKey, now);
  const inRange = events.filter((e) => e.ts >= start);
  const leadsInRange = leads.filter((l) => l.ts >= start);
  const views = inRange.filter((e) => e.type === "pageview");
  const clicks = inRange.filter((e) => e.type === "click");

  // Daily series — always fill every day in a bounded range so the chart
  // shows zeros instead of gaps.
  const days = RANGES[rangeKey]?.days;
  const dailyMap = new Map();
  if (days) {
    for (let i = days - 1; i >= 0; i -= 1) dailyMap.set(dayKey(now - i * DAY_MS), 0);
  }
  for (const v of views) dailyMap.set(dayKey(v.ts), (dailyMap.get(dayKey(v.ts)) || 0) + 1);
  const daily = [...dailyMap.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([day, n]) => ({ day, n }));

  // Unique visitors that arrived via each referrer (first-touch), not raw views.
  const visitorFirstTouch = new Map();
  for (const e of inRange) {
    if (e.visitorId && !visitorFirstTouch.has(e.visitorId)) visitorFirstTouch.set(e.visitorId, e);
  }
  const visitors = [...visitorFirstTouch.values()];

  return {
    totals: {
      pageviews: views.length,
      visitors: visitors.length,
      sessions: new Set(inRange.map((e) => e.sessionId).filter(Boolean)).size,
      clicks: clicks.length,
      leads: leadsInRange.length,
      uniqueLeads: new Set(leadsInRange.map((l) => l.email)).size,
    },
    daily,
    pages: count(views, (v) => v.path),
    clicksByLabel: count(clicks, (c) => `${c.label}${c.href ? ` → ${c.href}` : ""}`),
    referrers: count(visitors, sourceLabel),
    campaigns: count(visitors, (v) => utmLabel(v.utm)),
    devices: count(visitors, (v) => v.device || "unknown"),
    countries: count(visitors, (v) => v.country || null),
    leads: leadsInRange,
  };
}
