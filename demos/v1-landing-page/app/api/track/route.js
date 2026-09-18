import { recordEvent } from "../../lib/store";
import {
  attribution,
  isBot,
  newId,
  readJson,
  requestContext,
  str,
} from "../../lib/request-meta";

const EVENT_TYPES = new Set(["pageview", "click"]);

// Receives beacons from app/components/Analytics.js. Always answers 204 —
// tracking must never surface an error to a visitor.
export async function POST(request) {
  const body = await readJson(request);
  const ctx = requestContext(request);
  if (!body || !EVENT_TYPES.has(body.type) || isBot(ctx.ua)) {
    return new Response(null, { status: 204 });
  }

  const path = str(body.path, 300);
  if (!path.startsWith("/") || path.startsWith("/admin")) {
    return new Response(null, { status: 204 });
  }

  const event = {
    id: newId(),
    ts: Date.now(),
    type: body.type,
    path,
    ...attribution(body),
    ...ctx,
  };
  if (body.type === "click") {
    event.label = str(body.label, 120);
    event.href = str(body.href, 500);
  }

  try {
    await recordEvent(event);
  } catch (err) {
    console.error("[track] failed to record event", err);
  }
  return new Response(null, { status: 204 });
}
