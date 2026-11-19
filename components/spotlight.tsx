"use client";

import type { PointerEvent, ReactNode } from "react";

export function Spotlight({ children, className }: { children: ReactNode; className: string }) {
  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <span className={className} onPointerMove={onMove}>
      {children}
    </span>
  );
}
