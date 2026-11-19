"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { activeDisciplines, projects, projectsIn, type DisciplineId, type Project } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/scramble";
import { ProjectCard } from "./project-card";

type Filter = DisciplineId | "all";
type Sort = "featured" | "newest";

const options: { id: Filter; name: string; count: number }[] = [
  { id: "all", name: "All", count: projects.length },
  ...activeDisciplines.map((d) => ({ id: d.id, name: d.name, count: projectsIn(d.id).length })),
];

function visible(filter: Filter, sort: Sort): Project[] {
  const list = filter === "all" ? projects : projectsIn(filter);
  if (sort === "featured") return list;
  return [...list].sort((a, b) => parseInt(b.year.slice(-4)) - parseInt(a.year.slice(-4)));
}

export function WorkBrowser() {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("d");
  const fromUrl: Filter = options.some((o) => o.id === raw) ? (raw as Filter) : "all";

  const [filter, setFilter] = useState<Filter>(fromUrl);
  const [sort, setSort] = useState<Sort>("featured");
  const [leaving, setLeaving] = useState<Set<string>>(new Set());
  const rects = useRef(new Map<string, DOMRect>());
  const grid = useRef<HTMLDivElement>(null);
  const chips = useRef<(HTMLButtonElement | null)[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const list = visible(filter, sort);

  // FLIP: remaining cards slide from their old positions; new ones fade in.
  useLayoutEffect(() => {
    const cards = [...(grid.current?.children ?? [])] as HTMLElement[];
    if (rects.current.size && !prefersReducedMotion()) {
      for (const el of cards) {
        const old = rects.current.get(el.dataset.slug!);
        if (!old) {
          el.animate({ opacity: [0, 1] }, { duration: 350, easing: "cubic-bezier(0.05, 0.7, 0.1, 1)" });
          continue;
        }
        const now = el.getBoundingClientRect();
        const dx = old.left - now.left;
        const dy = old.top - now.top;
        if (dx || dy) el.animate({ transform: [`translate(${dx}px, ${dy}px)`, "none"] }, { duration: 350, easing: "cubic-bezier(0.2, 0, 0, 1)" });
      }
    }
    rects.current.clear();
  }, [filter, sort]);

  const measure = () => {
    rects.current.clear();
    for (const el of [...(grid.current?.children ?? [])] as HTMLElement[]) rects.current.set(el.dataset.slug!, el.getBoundingClientRect());
  };

  // The URL wins when it changes from outside: a "Work" link, back or forward.
  useEffect(() => {
    clearTimeout(timer.current);
    setLeaving(new Set());
    measure();
    setFilter(fromUrl);
  }, [fromUrl]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const choose = (next: Filter) => {
    clearTimeout(timer.current);
    if (next === filter) {
      setLeaving(new Set());
      return;
    }
    const commit = () => {
      measure();
      setLeaving(new Set());
      setFilter(next);
      router.replace(next === "all" ? "/work" : `/work?d=${next}`, { scroll: false });
    };
    const gone = list.filter((p) => !visible(next, sort).includes(p)).map((p) => p.slug);
    if (prefersReducedMotion() || !gone.length) return commit();
    setLeaving(new Set(gone));
    timer.current = setTimeout(commit, 200);
  };

  const onChipKey = (e: KeyboardEvent, i: number) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const n = (i + step + options.length) % options.length;
    choose(options[n].id);
    chips.current[n]?.focus();
  };

  const result = filter === "all" ? `${list.length} projects` : `${list.length} ${list.length === 1 ? "project" : "projects"} in ${options.find((o) => o.id === filter)!.name}`;

  return (
    <>
      <div className="bg-bg sticky top-[var(--header)] z-30 mt-8 lg:mt-12">
        <div role="radiogroup" aria-label="Filter projects by discipline" className="scroll-fade -mr-4 flex gap-3 py-1 pr-8 md:mr-0 md:flex-wrap md:pr-0">
          {options.map((o, i) => (
            <button
              key={o.id}
              ref={(el) => { chips.current[i] = el; }}
              type="button"
              role="radio"
              aria-checked={filter === o.id}
              tabIndex={filter === o.id ? 0 : -1}
              onClick={() => choose(o.id)}
              onKeyDown={(e) => onChipKey(e, i)}
              className="chip"
            >
              {o.name}
              <span className="count">{o.count}</span>
            </button>
          ))}
        </div>
        <div className="border-line mt-3 flex h-12 items-center justify-between border-b md:mt-4">
          <p className="t-caption" role="status">{result}</p>
          <label className="t-ui text-muted focus-within:outline-accent relative flex items-center gap-1 rounded-[8px] focus-within:outline-2 focus-within:outline-offset-2">
            <span className="hidden md:inline">Sort: {sort === "featured" ? "Featured" : "Newest"}</span>
            <ChevronDown size={16} strokeWidth={1.75} aria-hidden className="hidden md:block" />
            <ArrowUpDown size={20} strokeWidth={1.75} aria-hidden className="md:hidden" />
            <span className="sr-only">Sort projects</span>
            <select
              value={sort}
              onChange={(e) => {
                measure();
                setSort(e.target.value as Sort);
              }}
              className="absolute inset-0 opacity-0"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
            </select>
          </label>
        </div>
      </div>
      <div ref={grid} className="mt-8 grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-12">
        {list.map((p) => (
          <div key={p.slug} data-slug={p.slug} className={`transition-opacity duration-200 ${leaving.has(p.slug) ? "opacity-0" : ""}`}>
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </>
  );
}
