// Browser-side visitor identity + first-touch attribution. Shared by the
// Analytics beacon and the Members Club form so a lead carries the same
// metadata as the page views that led to it.
//
// - visitorId: random id in localStorage (first-party, no cross-site anything)
// - sessionId: random id in sessionStorage (one per tab session)
// - attr: referrer, UTM params, landing page, device class. Captured at the
//   start of each session; if the session arrived direct (no referrer, no
//   UTM) it inherits the visitor's first-touch attribution instead. That's
//   "last non-direct touch": a returning visitor who clicks an Instagram
//   link gets credited to Instagram, but a direct return keeps their
//   original source.
// - eventsViewed: event slugs this session has looked at, for lead context.

const VISITOR_KEY = "klp_vid";
const ATTR_KEY = "klp_attr";
const SESSION_KEY = "klp_sid";
const EVENTS_VIEWED_KEY = "klp_events_viewed";
const UTM_KEYS = ["source", "medium", "campaign", "term", "content"];

function safeGet(storage, key) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(storage, key, value) {
  try {
    storage.setItem(key, value);
  } catch {
    // Private mode / blocked storage — tracking degrades to per-request ids.
  }
}

function randomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function ensureId(storage, key) {
  let id = safeGet(storage, key);
  if (!id) {
    id = randomId();
    safeSet(storage, key, id);
  }
  return id;
}

export function deviceClass() {
  const ua = navigator.userAgent || "";
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) {
    return "tablet";
  }
  if (/Mobi|iPhone|Android/i.test(ua)) return "mobile";
  return "desktop";
}

function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const utm = {};
  for (const key of UTM_KEYS) {
    const v = params.get(`utm_${key}`);
    if (v) utm[key] = v;
  }
  return {
    referrer: document.referrer || "",
    landing: window.location.pathname + window.location.search,
    device: deviceClass(),
    utm,
    ts: Date.now(),
  };
}

function readJson(storage, key) {
  try {
    const raw = safeGet(storage, key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function isDirect(attr) {
  if (Object.keys(attr.utm || {}).length) return false;
  if (!attr.referrer) return true;
  try {
    return new URL(attr.referrer).host === window.location.host;
  } catch {
    return true;
  }
}

export function getAttribution() {
  const session = readJson(sessionStorage, ATTR_KEY);
  if (session) return session;

  const current = captureAttribution();
  let first = readJson(localStorage, ATTR_KEY);
  if (!first) {
    first = current;
    safeSet(localStorage, ATTR_KEY, JSON.stringify(first));
  }
  const attr = isDirect(current) ? first : current;
  safeSet(sessionStorage, ATTR_KEY, JSON.stringify(attr));
  return attr;
}

export function getIdentity() {
  return {
    visitorId: ensureId(localStorage, VISITOR_KEY),
    sessionId: ensureId(sessionStorage, SESSION_KEY),
    attr: getAttribution(),
  };
}

export function noteEventViewed(slug) {
  const list = getEventsViewed();
  if (!list.includes(slug)) {
    list.push(slug);
    safeSet(sessionStorage, EVENTS_VIEWED_KEY, JSON.stringify(list.slice(-10)));
  }
}

export function getEventsViewed() {
  try {
    const list = JSON.parse(safeGet(sessionStorage, EVENTS_VIEWED_KEY) || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
