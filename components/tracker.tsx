"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const uuid = () => crypto.randomUUID();
function kept(store: () => Storage, key: string) {
  try {
    const s = store();
    let v = s.getItem(key);
    if (!v) s.setItem(key, (v = uuid()));
    return v;
  } catch {
    return uuid();
  }
}
const send = (body: object) => {
  const data = JSON.stringify(body);
  if (!navigator.sendBeacon?.("/api/track", data)) fetch("/api/track", { method: "POST", body: data, keepalive: true }).catch(() => {});
};

/** One "visit" row per page view: time visible on the page plus what was clicked there. */
export function Tracker() {
  const path = usePathname();

  useEffect(() => {
    try {
      // Opening the dashboard marks this browser as the owner's, so it stops counting itself.
      if (path.startsWith("/stats")) return void localStorage.setItem("notrack", "1");
      if (localStorage.getItem("notrack")) return;
    } catch {}

    const id = uuid();
    const params = new URLSearchParams(location.search);
    let ref = params.get("utm_source") || params.get("ref") || "";
    if (!ref && document.referrer) {
      try {
        const r = new URL(document.referrer);
        if (r.host !== location.host) ref = r.host.replace(/^www\./, "");
      } catch {}
    }
    send({ t: "view", id, path, ref, sid: kept(() => sessionStorage, "sid"), vid: kept(() => localStorage, "vid") });

    let ms = 0;
    let since = document.visibilityState === "visible" ? Date.now() : 0;
    let clicks: string[] = [];
    const flush = () => {
      if (since) ms += Date.now() - since;
      since = document.visibilityState === "visible" ? Date.now() : 0;
      send({ t: "ping", id, ms, clicks });
      clicks = [];
    };
    const onVisibility = () => (document.visibilityState === "hidden" ? flush() : (since = Date.now()));
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest("a, button");
      if (!el) return;
      const label = (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
      const href = el.getAttribute("href");
      clicks.push(href ? `${label || "link"} → ${href}` : label || "button");
    };
    const beat = setInterval(() => document.visibilityState === "visible" && flush(), 30_000); // Keeps durations close if the tab is killed without a hidden event.

    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("click", onClick, true);
    return () => {
      clearInterval(beat);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("click", onClick, true);
      flush();
    };
  }, [path]);

  return null;
}
