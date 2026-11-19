import type { Metadata } from "next";
import Link from "next/link";
import { Ribbon } from "@/components/ribbon";
import { activeDisciplines } from "@/lib/content";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

const suggestions = activeDisciplines.filter((d) => d.id !== "project-management");

export default function NotFound() {
  return (
    <div className="wrap flex flex-col items-center pt-20 text-center md:pt-24">
      <Ribbon className="w-[120px] rotate-12 md:w-[180px]" />
      <p className="text-muted mt-8 text-[48px] leading-[46px] font-semibold tracking-[-0.035em] md:text-[96px] md:leading-[92px]">404</p>
      <h1 className="t-headline mt-4 md:mt-6">This page wandered off.</h1>
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 md:w-auto md:flex-row">
        <Link href="/" className="btn btn-primary btn-block">Back home</Link>
        <Link href="/work" className="btn btn-secondary btn-block">See the work</Link>
      </div>
      <p className="t-body text-muted mt-6">
        or try:{" "}
        {suggestions.map((d, i) => (
          <span key={d.id}>
            {i > 0 && " · "}
            <Link href={`/work/${d.id}`} className="text-accent hover:underline">{d.name}</Link>
          </span>
        ))}
      </p>
    </div>
  );
}
