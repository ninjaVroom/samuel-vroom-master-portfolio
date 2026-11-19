"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Mode = "light" | "dark" | "system";

const osDark = () => matchMedia("(prefers-color-scheme: dark)").matches;

function apply(mode: Mode) {
  try {
    if (mode === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", mode);
  } catch {}
  if (mode === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = mode;
  window.dispatchEvent(new Event("themechange"));
}

/** Cycles system → opposite of the OS → matching the OS → system, so every mode is reachable. */
export function ThemeToggle({ className = "icon-btn" }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("system");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const sync = () => {
      const stored = document.documentElement.dataset.theme as Mode | undefined;
      setMode(stored ?? "system");
      setDark(stored ? stored === "dark" : osDark());
    };
    sync();
    const media = matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", sync);
    window.addEventListener("themechange", sync);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("themechange", sync);
    };
  }, []);

  const next = (): Mode => {
    const os: Mode = osDark() ? "dark" : "light";
    return mode === "system" ? (os === "dark" ? "light" : "dark") : mode === os ? "system" : os;
  };

  return (
    <button type="button" className={className} onClick={() => apply(next())} aria-label={`Theme: ${mode}. Change theme`} title={`Theme: ${mode}`}>
      {dark ? <Sun size={20} strokeWidth={1.75} aria-hidden /> : <Moon size={20} strokeWidth={1.75} aria-hidden />}
    </button>
  );
}
