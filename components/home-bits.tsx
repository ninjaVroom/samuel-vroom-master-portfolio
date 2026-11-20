"use client";

import Link from "next/link";
import { setRibbonTint } from "./ribbon";

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
