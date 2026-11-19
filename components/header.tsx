"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { activeDisciplines, projectsIn, site } from "@/lib/content";
import { ThemeToggle } from "./theme-toggle";

const NavItem = ({ href, label, active }: { href: string; label: string; active: boolean }) => (
  <Link href={href} aria-current={active ? "page" : undefined} className={`t-ui relative ${active ? "text-ink" : "text-muted hover:text-ink"}`}>
    {label}
    {active && <span className="nav-bar" />}
  </Link>
);

export function Header() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenu(false), [path]);

  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenu(false);
      trigger.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [menu]);

  return (
    <header
      className={`sticky top-0 z-40 h-[var(--header)] border-b transition-colors duration-200 ${
        scrolled ? "border-line bg-surface/85 backdrop-blur-[12px]" : "border-transparent"
      }`}
    >
      <div className="wrap flex h-full items-center justify-between">
        <Link href="/" className="text-[20px] leading-[26px] font-semibold tracking-[-0.2px]">
          {site.name}
        </Link>
        <div className="flex items-center">
          <nav aria-label="Main" className="mr-8 hidden items-center gap-8 md:flex">
            <div className="relative flex items-center gap-1" ref={menuRef}>
              <NavItem href="/work" label="Work" active={path.startsWith("/work")} />
              <button
                ref={trigger}
                type="button"
                aria-label="Work disciplines"
                aria-expanded={menu}
                onClick={() => setMenu((m) => !m)}
                className="text-muted hover:text-ink -my-2 -mr-2 rounded-full p-1"
              >
                <ChevronDown size={16} strokeWidth={1.75} aria-hidden className={`transition-transform duration-200 ${menu ? "rotate-180" : ""}`} />
              </button>
              {menu && (
                <ul className="bg-surface border-line shadow-e2 absolute top-9 left-0 w-64 rounded-[8px] border p-2">
                  {activeDisciplines.map((d) => (
                    <li key={d.id}>
                      <Link href={`/work/${d.id}`} onClick={() => setMenu(false)} className="t-ui hover:bg-surface-alt flex items-center justify-between rounded-[8px] px-3 py-2.5">
                        {d.name}
                        <span className="t-caption">{projectsIn(d.id).length}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <NavItem href="/about" label="About" active={path === "/about"} />
            <NavItem href="/resume" label="Resume" active={path === "/resume"} />
          </nav>
          <ThemeToggle />
          <Link href="/contact" className="btn-cta ml-6 hidden md:inline-flex">
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}
