import "server-only";

// Shared request-side sanitizing for the /api/track and /api/leads handlers.
// The client sends metadata it captured (referrer, UTM, landing page, device);
// we cap and whitelist it here so nothing unbounded lands in the store.

const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|pingdom|facebookexternalhit|preview/i;
const UTM_KEYS = ["source", "medium", "campaign", "term", "content"];

export function str(value, max = 200) {
  return typeof value === "string" ? value.slice(0, max) : "";
}

export function isBot(userAgent) {
  return BOT_RE.test(userAgent || "");
}

export function newId() {
  return crypto.randomUUID();
}

// Pull the client-captured attribution block into a fixed shape.
export function attribution(body) {
  const attr = body && typeof body.attr === "object" && body.attr ? body.attr : {};
  const utm = {};
  for (const key of UTM_KEYS) {
    const v = str(attr.utm?.[key], 120);
    if (v) utm[key] = v;
  }
  return {
    visitorId: str(body.visitorId, 64),
    sessionId: str(body.sessionId, 64),
    referrer: str(attr.referrer, 500),
    landing: str(attr.landing, 300),
    device: ["mobile", "tablet", "desktop"].includes(attr.device) ? attr.device : "unknown",
    utm,
  };
}

export function requestContext(request) {
  return {
    ua: str(request.headers.get("user-agent"), 300),
    // Vercel sets this at the edge; blank on local dev. Country-level only,
    // no IP is stored.
    country: str(request.headers.get("x-vercel-ip-country"), 8),
  };
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
