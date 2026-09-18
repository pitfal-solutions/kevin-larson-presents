import { isAdminSession } from "../../lib/auth";
import { getLeads } from "../../lib/store";
import { referrerHost } from "../../lib/aggregate";

function cell(value) {
  const s = value === null || value === undefined ? "" : String(value);
  // Neutralize spreadsheet formula injection, then quote.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isAdminSession())) return new Response("Unauthorized", { status: 401 });

  const leads = await getLeads();
  const header = [
    "email", "signed_up_at", "signup_page", "events_viewed", "landing_page",
    "referrer", "utm_source", "utm_medium", "utm_campaign", "utm_term",
    "utm_content", "device", "country", "visitor_id",
  ];
  const rows = leads.map((l) => [
    l.email, new Date(l.ts).toISOString(), l.path, (l.eventsViewed || []).join(" "),
    l.landing, referrerHost(l.referrer), l.utm?.source, l.utm?.medium,
    l.utm?.campaign, l.utm?.term, l.utm?.content, l.device, l.country, l.visitorId,
  ]);
  const csv = [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="klp-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

