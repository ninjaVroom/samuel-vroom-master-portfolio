import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DisciplineChip, TaglineWord } from "@/components/home-bits";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { Ribbon } from "@/components/ribbon";
import { about, activeDisciplines, projects, projectsIn, site } from "@/lib/content";

const spec = [
  ["Role", "Full-stack developer"],
  ["Base", site.location],
  ["Stack", "Next.js · TypeScript · Flutter"],
  ["Open to", "Full-time roles in Ontario"],
];

const SpecStrip = ({ className }: { className: string }) => (
  <dl className={className}>
    {spec.map(([k, v]) => (
      <div key={k}>
        <dt className="t-label">{k}</dt>
        <dd className="t-ui mt-1">{v}</dd>
      </div>
    ))}
  </dl>
);

export default function Home() {
  const [large, ...small] = projects.filter((p) => p.featured);
  return (
    <>
      <section className="wrap pt-12 md:pt-16 lg:min-h-[738px]">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
          <div className="lg:col-span-8">
            <p className="t-label">Full-stack developer · Southwestern Ontario</p>
            <h1 className="t-display mt-4 lg:mt-6">
              Samuel Roland
              <br />
              Vroom
            </h1>
            <p className="t-headline-light text-muted mt-4 lg:mt-6">
              Builds for web and mobile.
              <br />
              Also does <TaglineWord />
            </p>
            <p className="t-body-lg text-muted mt-5 max-w-[560px] lg:mt-6">
              React, Next.js, TypeScript and Flutter, with 7+ years across software, delivery and media.
            </p>
            <div className="mt-6 flex flex-col items-start gap-3 md:flex-row md:flex-wrap md:items-center lg:mt-10">
              <Link href="/work" className="btn btn-primary btn-block">
                View work <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
              </Link>
              <a href={site.resumePdf} download className="btn btn-secondary btn-block">
                Download résumé
              </a>
              <Link href="/contact" className="link mt-1 md:mt-0 md:ml-3">
                Contact <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden />
              </Link>
            </div>
            <SpecStrip className="mt-14 hidden flex-wrap gap-x-14 gap-y-6 md:flex" />
          </div>
          <div className="mt-8 flex justify-center lg:col-span-4 lg:mt-20 lg:justify-center">
            <Ribbon live className="w-[200px] self-start lg:w-[320px]" />
          </div>
        </div>
        <SpecStrip className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 md:hidden" />
      </section>

      <section className="wrap sec" aria-labelledby="selected-work">
        <div className="flex items-center justify-between">
          <h2 id="selected-work" className="t-label">Selected work</h2>
          <Link href="/work" className="link">
            All work <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
        <div className="mt-label grid gap-y-8 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0">
          <Reveal className="lg:col-span-8">
            <ProjectCard project={large} variant="large" sizes="(min-width: 1024px) 792px, 100vw" />
          </Reveal>
          <div className="flex flex-col gap-y-8 lg:col-span-4 lg:gap-y-12">
            {small.slice(0, 2).map((p, i) => (
              <Reveal key={p.slug} index={i + 1}>
                <ProjectCard project={p} variant="small" />
              </Reveal>
            ))}
          </div>
        </div>
        {small.length > 2 && (
          <div className="mt-8 grid gap-y-8 md:grid-cols-2 md:gap-x-6 lg:mt-12 lg:grid-cols-3 lg:gap-y-12">
            {small.slice(2).map((p, i) => (
              <Reveal key={p.slug} index={i + 3}>
                <ProjectCard project={p} variant="small" />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="wrap sec" aria-labelledby="what-i-do">
        <h2 id="what-i-do" className="t-label">What I do</h2>
        <ul className="mt-label flex flex-wrap gap-3">
          {activeDisciplines.map((d) => (
            <li key={d.id}>
              <DisciplineChip id={d.id} name={d.name} count={projectsIn(d.id).length} />
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap sec" aria-labelledby="about-teaser">
        <h2 id="about-teaser" className="t-label">About</h2>
        <p className="t-body-lg mt-label max-w-[792px]">{about.teaser}</p>
        <p className="t-body mt-6 flex items-center gap-2">
          <span className="bg-success size-2 shrink-0 rounded-full" />
          {about.now}
        </p>
        <Link href="/about" className="link mt-6">
          More about me <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
        </Link>
      </section>
    </>
  );
}


