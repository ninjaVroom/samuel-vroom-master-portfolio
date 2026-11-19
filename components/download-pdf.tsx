"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Download } from "lucide-react";
import { site } from "@/lib/content";

/** Browsers don't report a finished save, so this confirms only what it knows: the download started. */
export function DownloadPdf({ href = site.resumePdf, label = "Download PDF" }: { href?: string; label?: string }) {
  const [started, setStarted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <a
      href={href}
      download
      className="btn btn-primary btn-block no-print"
      onClick={() => {
        setStarted(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setStarted(false), 2500);
      }}
    >
      {started ? <Check size={18} strokeWidth={1.75} aria-hidden /> : <Download size={18} strokeWidth={1.75} aria-hidden />}
      <span aria-live="polite">{started ? "Download started" : label}</span>
    </a>
  );
}
