import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectCard } from "@/components/project-card";
import { WorkBrowser } from "@/components/work-browser";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Development first, plus design, delivery and film.",
};

// The URL filter is only readable in the browser, so the served HTML holds the full list.
const AllProjects = () => (
  <div className="mt-[132px] grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-12">
    {projects.map((p) => (
      <ProjectCard key={p.slug} project={p} />
    ))}
  </div>
);

export default function WorkPage() {
  return (
    <div className="wrap page-top">
      <p className="t-label">Work</p>
      <h1 className="t-display-sm mt-3 lg:mt-4">Selected projects</h1>
      <p className="t-body-lg text-muted mt-4 max-w-[560px] lg:mt-6">Development first, plus design, delivery and film.</p>
      <Suspense fallback={<AllProjects />}>
        <WorkBrowser />
      </Suspense>
    </div>
  );
}
