"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

/** Sticky section nav. It appears once the title has scrolled away. */
export function LocalNav({ title, anchors, titleId }: { title: string; anchors: { id: string; label: string }[]; titleId: string }) {
  const [shown, setShown] = useState(false);
  const [current, setCurrent] = useState(anchors[0].id);

  useEffect(() => {
    const heading = document.getElementById(titleId);
    const titleIo = new IntersectionObserver(([e]) => setShown(!e.isIntersecting), { rootMargin: "-72px 0px 0px 0px" });
    if (heading) titleIo.observe(heading);

    const sections = anchors.map((a) => document.getElementById(a.id)).filter(Boolean) as HTMLElement[];
    const spy = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => spy.observe(s));
    return () => {
      titleIo.disconnect();
      spy.disconnect();
    };
  }, [anchors, titleId]);

  return (
    <nav
      aria-label="Project sections"
      inert={!shown}
      className={`bg-surface/85 border-line shadow-e2 fixed inset-x-0 top-[var(--header)] z-30 border-b backdrop-blur-[12px] transition-[transform,opacity] duration-[350ms] ease-[cubic-bezier(0.05,0.7,0.1,1)] ${
        shown ? "" : "invisible -translate-y-full opacity-0"
      }`}
    >
      <div className="wrap flex h-12 items-center justify-between gap-6 md:h-14 md:justify-start">
        <span className="t-ui truncate font-semibold md:w-[256px] md:flex-none">{title}</span>
        <ul className="hidden items-center gap-6 md:flex">
          {anchors.map((a) => (
            <li key={a.id}>
              <a href={`#${a.id}`} aria-current={current === a.id ? "true" : undefined} className={`t-ui relative ${current === a.id ? "text-ink" : "text-muted hover:text-ink"}`}>
                {a.label}
                {current === a.id && <span className="nav-bar" />}
              </a>
            </li>
          ))}
        </ul>
        <details className="group relative flex-none md:hidden">
          <summary className="t-ui text-muted flex list-none items-center gap-1 [&::-webkit-details-marker]:hidden">
            Jump to <ChevronDown size={16} strokeWidth={1.75} aria-hidden className="transition-transform group-open:rotate-180" />
          </summary>
          <ul className="bg-surface border-line shadow-e2 absolute top-8 right-0 w-44 rounded-[8px] border p-2">
            {anchors.map((a) => (
              <li key={a.id}>
                <a
                  href={`#${a.id}`}
                  onClick={(e) => e.currentTarget.closest("details")?.removeAttribute("open")}
                  className={`t-ui hover:bg-surface-alt block rounded-[8px] px-3 py-2.5 ${current === a.id ? "text-ink" : "text-muted"}`}
                >
                  {a.label}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </nav>
  );
}
