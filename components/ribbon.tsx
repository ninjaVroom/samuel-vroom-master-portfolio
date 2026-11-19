"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/scramble";

export const setRibbonTint = (color: string | null) =>
  window.dispatchEvent(new CustomEvent("ribbon-tint", { detail: color }));

/** Poster first; the live model loads after idle and cross-fades in. Poster only under reduced motion, Save-Data or no WebGL. */
export function Ribbon({ live = false, className = "" }: { live?: boolean; className?: string }) {
  const slot = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (!live || prefersReducedMotion() || saveData) return;

    let dispose = () => {};
    let gone = false;
    const start = () =>
      import("./ribbon-scene")
        .then(({ mountRibbon }) => mountRibbon(canvas.current!, slot.current!, () => setReady(true)))
        .then((d) => {
          if (gone) d();
          else dispose = d;
        })
        .catch(() => {}); // No WebGL or a failed fetch: the poster stays.

    // Safari has no requestIdleCallback.
    const timer = setTimeout(start, 300);
    return () => {
      gone = true;
      clearTimeout(timer);
      dispose();
    };
  }, [live]);

  return (
    <div ref={slot} aria-hidden className={`relative aspect-square select-none ${live ? "touch-pan-y" : ""} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/3d/accent-light.webp" alt="" width={640} height={640} draggable={false} fetchPriority={live ? "high" : "auto"} className={`only-light absolute inset-0 size-full transition-opacity duration-[350ms] ${ready ? "opacity-0" : ""}`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/3d/accent-dark.webp" alt="" width={640} height={640} draggable={false} className={`only-dark absolute inset-0 size-full transition-opacity duration-[350ms] ${ready ? "opacity-0" : ""}`} />
      {live && (
        <>
          <div
            className={`absolute inset-x-[22%] bottom-[8%] h-[6%] rounded-[50%] transition-opacity duration-[350ms] ${ready ? "" : "opacity-0"}`}
            style={{ background: "radial-gradient(closest-side, var(--shade), transparent)" }}
          />
          <canvas ref={canvas} className={`absolute inset-0 size-full cursor-grab transition-opacity duration-[350ms] active:cursor-grabbing ${ready ? "" : "opacity-0"}`} />
        </>
      )}
    </div>
  );
}
