import "server-only";
import { Redis } from "@upstash/redis";
import { promises as fs } from "node:fs";
import path from "node:path";

// Analytics + leads storage. Two backends behind one interface:
//
// - Upstash Redis when the Vercel Upstash integration's env vars are present
//   (UPSTASH_REDIS_REST_URL/TOKEN, or the older KV_REST_API_URL/TOKEN).
// - A local JSON file (.data/analytics.json, gitignored) otherwise, so
//   `npm run dev` works with zero setup. Vercel has no persistent disk, so
//   the file backend is dev-only by design.
//
// Both keep a capped list of raw events (newest first) and an uncapped list
// of leads. The admin page aggregates in memory — fine at demo-site volume.

const MAX_EVENTS = 20000;
const EVENTS_KEY = "klp:analytics:events";
const LEADS_KEY = "klp:analytics:leads";
const DATA_FILE = path.join(process.cwd(), ".data", "analytics.json");

function redisFromEnv() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = redisFromEnv();

export const STORE_BACKEND = redis ? "redis" : "file";

// --- File backend -----------------------------------------------------------

let fileQueue = Promise.resolve();

async function readFile() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const data = JSON.parse(raw);
    return { events: data.events || [], leads: data.leads || [] };
  } catch {
    return { events: [], leads: [] };
  }
}

function withFile(mutate) {
  // Serialize writes so concurrent beacons don't clobber each other.
  const run = fileQueue.then(async () => {
    const data = await readFile();
    mutate(data);
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(data));
  });
  fileQueue = run.catch(() => {});
  return run;
}

// --- Public API -------------------------------------------------------------

export async function recordEvent(event) {
  if (redis) {
    await redis.lpush(EVENTS_KEY, JSON.stringify(event));
    await redis.ltrim(EVENTS_KEY, 0, MAX_EVENTS - 1);
    return;
  }
  await withFile((data) => {
    data.events.unshift(event);
    data.events.length = Math.min(data.events.length, MAX_EVENTS);
  });
}

export async function recordLead(lead) {
  if (redis) {
    await redis.lpush(LEADS_KEY, JSON.stringify(lead));
    return;
  }
  await withFile((data) => {
    data.leads.unshift(lead);
  });
}

function parseList(items) {
  return items.map((item) => (typeof item === "string" ? JSON.parse(item) : item));
}

export async function getEvents() {
  if (redis) return parseList(await redis.lrange(EVENTS_KEY, 0, MAX_EVENTS - 1));
  return (await readFile()).events;
}

export async function getLeads() {
  if (redis) return parseList(await redis.lrange(LEADS_KEY, 0, -1));
  return (await readFile()).leads;
}
