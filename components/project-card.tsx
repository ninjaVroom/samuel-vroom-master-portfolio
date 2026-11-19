import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { disciplineName, metaLine, type Project } from "@/lib/content";
import { Spotlight } from "./spotlight";

const ASPECT = { large: "aspect-[16/10]", small: "aspect-[16/9]", grid: "aspect-[4/3]" };

function Cover({ project, variant, sizes }: { project: Project; variant: keyof typeof ASPECT; sizes: string }) {
  const inner = (
    <span className="cover-inner">
      {project.cover ? (
        <Image src={project.cover} alt="" fill sizes={sizes} className="object-cover" />
      ) : (
        <span className="t-label">Cover pending</span>
      )}
    </span>
  );
  if (variant === "grid") return <span className={`cover ${ASPECT[variant]}`}>{inner}</span>;
  return <Spotlight className={`cover spotlight ${ASPECT[variant]}`}>{inner}</Spotlight>;
}

export function ProjectCard({ project, variant = "grid", sizes = "(min-width: 1024px) 384px, 100vw" }: { project: Project; variant?: keyof typeof ASPECT; sizes?: string }) {
  const full = variant !== "small";
  return (
    <Link href={`/work/${project.slug}`} aria-label={`${project.title}: ${project.oneLiner}`} className="block rounded-[16px]">
      <Cover project={project} variant={variant} sizes={sizes} />
      <h3 className="t-title mt-4">
        {project.title}
        <ArrowRight size={18} strokeWidth={1.75} aria-hidden className="card-arrow" />
      </h3>
      {full && <p className="t-body text-muted mt-1 line-clamp-2">{project.oneLiner}</p>}
      <p className={`t-caption ${full ? "mt-3" : "mt-1"}`}>{metaLine(project)}</p>
      {full && (
        <p className="t-label mt-2 flex flex-wrap gap-x-3">
          {project.tags.map((t) => (
            <span key={t}>{disciplineName(t)}</span>
          ))}
        </p>
      )}
    </Link>
  );
}
