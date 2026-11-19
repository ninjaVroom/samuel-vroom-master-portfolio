"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FileText, House, LayoutGrid, Mail, User, type LucideIcon } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const items: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/work", label: "Work", icon: LayoutGrid },
  { href: "/about", label: "About", icon: User },
  { href: "/resume", label: "Resume", icon: FileText },
  { href: "/contact", label: "Contact", icon: Mail },
];

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path.startsWith(href));

export function Dock() {
  const path = usePathname();
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last.current) < 8) return;
      setHidden(y > last.current && y > 56);
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Dock"
      inert={hidden}
      style={{ bottom: "calc(16px + env(safe-area-inset-bottom))" }}
      className={`bg-dock shadow-e3 fixed left-1/2 z-50 flex h-14 -translate-x-1/2 items-center gap-1 rounded-full p-2 transition-transform duration-[350ms] md:hidden ${
        hidden ? "translate-y-[calc(100%+32px)]" : ""
      }`}
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActive(path, href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={`relative flex h-10 w-11 items-center justify-center rounded-full text-[#E4E8FF] transition-opacity active:scale-95 ${active ? "" : "opacity-[.64]"}`}
          >
            <Icon size={20} strokeWidth={1.75} aria-hidden />
            {active && <span className="bg-accent absolute bottom-0 size-1 rounded-full" />}
          </Link>
        );
      })}
      <ThemeToggle className="flex h-10 w-11 items-center justify-center rounded-full text-[#E4E8FF] opacity-[.64] active:scale-95" />
    </nav>
  );
}
