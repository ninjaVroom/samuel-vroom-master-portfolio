"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { site } from "@/lib/content";
import { scramble } from "@/lib/scramble";

/** Outlined bar: the email opens mailto; Copy scrambles it into "copied", reverting after 2s. */
export function CopyEmail() {
  const [text, setText] = useState(site.email);
  const [copied, setCopied] = useState(false);
  const cancel = useRef(() => {});
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(
    () => () => {
      cancel.current();
      clearTimeout(timer.current);
    },
    [],
  );

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      // No clipboard access (e.g. insecure context): fall back to the mail app.
      window.location.href = `mailto:${site.email}`;
      return;
    }
    setCopied(true);
    cancel.current();
    cancel.current = scramble("copied", setText);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setCopied(false);
      cancel.current();
      cancel.current = scramble(site.email, setText);
    }, 2000);
  };

  return (
    <div className="border-line flex h-14 max-w-[690px] items-center justify-between gap-2 rounded-full border pr-2 pl-5 md:h-16 md:pl-6">
      <a href={`mailto:${site.email}`} aria-label={`Email ${site.email}`} className="t-body-lg min-w-0 truncate">
        <span className="text-[16px] md:text-[inherit]">{text}</span>
      </a>
      <button type="button" onClick={onCopy} className="icon-btn md:hidden" aria-label={copied ? "Email address copied" : "Copy email address"}>
        {copied ? <Check size={20} strokeWidth={1.75} aria-hidden /> : <Copy size={20} strokeWidth={1.75} aria-hidden />}
      </button>
      <button type="button" onClick={onCopy} className="btn btn-secondary hidden md:inline-flex" aria-label={copied ? "Email address copied" : "Copy email address"}>
        {copied ? "Copied" : "Copy"}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </div>
  );
}
