"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getIdentity, noteEventViewed } from "../lib/visitor";

// First-party traffic beacon. Mounted once in the root layout; records a
// pageview on every route change and a click on the CTAs that matter
// (buttons, nav, outbound links, anything with data-track). Stays out of
// /admin. Never throws into the page — tracking failures are silent.

function send(payload) {
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...getIdentity(), ...payload }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore
  }
}

// React strict mode runs effects twice in dev; a double-fired navigation
// event would otherwise count as two views.
let lastPageview = { path: null, ts: 0 };

function sendPageview(path) {
  if (lastPageview.path === path && Date.now() - lastPageview.ts < 1000) return;
  lastPageview = { path, ts: Date.now() };
  send({ type: "pageview", path });
}

function clickLabel(el) {
  if (el.dataset.track) return el.dataset.track;
  const text = (el.textContent || "").trim().replace(/\s+/g, " ");
  if (text) return text.slice(0, 80);
  return el.getAttribute("aria-label") || el.tagName.toLowerCase();
}

function shouldTrack(el) {
  if (el.dataset.track) return true;
  if (el.tagName === "A") {
    const href = el.getAttribute("href") || "";
    if (/^https?:\/\//.test(href)) return true; // outbound
    if (el.classList.contains("btn")) return true;
    if (el.closest("nav")) return true;
    return false;
  }
  return el.classList.contains("btn");
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    const eventMatch = pathname.match(/^\/events\/([^/]+)/);
    if (eventMatch) noteEventViewed(eventMatch[1]);
    sendPageview(pathname);
  }, [pathname]);

  useEffect(() => {
    function onClick(e) {
      if (window.location.pathname.startsWith("/admin")) return;
      const el = e.target.closest("a, button");
      if (!el || !shouldTrack(el)) return;
      send({
        type: "click",
        path: window.location.pathname,
        label: clickLabel(el),
        href: el.getAttribute("href") || "",
      });
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
