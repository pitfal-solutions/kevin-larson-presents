import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Shared-password admin auth. Set ADMIN_PASSWORD in the environment; the
// session cookie is `expiry.hmac(expiry)` signed with ADMIN_SESSION_SECRET
// (falls back to the password itself so a single env var is enough).
// Nothing user-identifying is stored — there's one admin identity.

export const SESSION_COOKIE = "klp_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(value) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function safeEqual(a, b) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(candidate) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof candidate !== "string") return false;
  return safeEqual(candidate, expected);
}

export function createSessionToken() {
  const exp = String(Date.now() + SESSION_TTL_SECONDS * 1000);
  return `${exp}.${sign(exp)}`;
}

export function verifySessionToken(token) {
  if (!isAdminConfigured() || typeof token !== "string") return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  return safeEqual(sign(exp), sig);
}

export async function isAdminSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: SESSION_TTL_SECONDS,
  };
}
