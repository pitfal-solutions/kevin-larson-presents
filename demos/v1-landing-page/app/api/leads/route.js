import { recordLead } from "../../lib/store";
import {
  attribution,
  newId,
  readJson,
  requestContext,
  str,
} from "../../lib/request-meta";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Members Club signup from app/components/Membership.js.
export async function POST(request) {
  const body = await readJson(request);
  if (!body) return Response.json({ error: "Invalid request." }, { status: 400 });

  // Honeypot: real users never fill this; bots usually do.
  if (str(body.company)) return Response.json({ ok: true });

  const email = str(body.email, 254).trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const eventsViewed = Array.isArray(body.eventsViewed)
    ? body.eventsViewed.map((s) => str(s, 60)).filter(Boolean).slice(0, 10)
    : [];

  const lead = {
    id: newId(),
    ts: Date.now(),
    email,
    source: "members-club",
    path: str(body.path, 300),
    eventsViewed,
    ...attribution(body),
    ...requestContext(request),
  };

  try {
    await recordLead(lead);
  } catch (err) {
    console.error("[leads] failed to record lead", err);
    return Response.json(
      { error: "Something went wrong — please try again." },
      { status: 500 }
    );
  }
  return Response.json({ ok: true });
}
