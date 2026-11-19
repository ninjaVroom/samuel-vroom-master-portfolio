"use client";

import { site } from "@/lib/content";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="wrap page-top pb-16">
      <h1 className="t-display-sm">Something went wrong.</h1>
      <p className="t-body-lg text-muted mt-6 max-w-[560px]">
        This page didn&apos;t load. You can try again, or reach me directly at{" "}
        <a className="text-accent hover:underline" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        .
      </p>
      <button type="button" onClick={reset} className="btn btn-primary mt-8">
        Try again
      </button>
    </div>
  );
}
