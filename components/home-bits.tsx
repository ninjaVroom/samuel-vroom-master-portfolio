"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { scramble } from "@/lib/scramble";
import { setRibbonTint } from "./ribbon";

const WORDS = ["project management.", "UI design.", "film."];

/** The one interactive word in the tagline. It never cycles on its own. */
export function TaglineWord() {
  const [text, setText] = useState(WORDS[0]);
  const index = useRef(0);
  const cancel = useRef(() => {});

  const next = () => {
    index.current = (index.current + 1) % WORDS.length;
    cancel.current();
    cancel.current = scramble(WORDS[index.current], setText);
  };

  // An inline span, not a <button>: buttons can't wrap mid-phrase on a phone.
  return (
    <span
      role="button"
      tabIndex={0}
      className="tagline-word"
      aria-label={`${WORDS[index.current]} Show another discipline`}
      onPointerEnter={(e) => e.pointerType === "mouse" && next()}
      onFocus={(e) => e.target.matches(":focus-visible") && next()}
      onClick={next}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          next();
        }
      }}
    >
      {text}
    </span>
  );
}

// The ribbon tint follows the hovered chip, within the accent family.
const TINTS: Record<string, string> = {
  development: "#6F80E0",
  "ui-design": "#E4E8FF",
  "project-management": "#8C9DF5",
  film: "#7E8FF0",
};

export function DisciplineChip({ id, name, count }: { id: string; name: string; count: number }) {
  return (
    <Link
      href={`/work/${id}`}
      className="chip hover:-translate-y-px motion-reduce:hover:translate-y-0"
      onPointerEnter={() => setRibbonTint(TINTS[id])}
      onPointerLeave={() => setRibbonTint(null)}
    >
      {name}
      <span className="count">{count}</span>
    </Link>
  );
}
