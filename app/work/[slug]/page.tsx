import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { LocalNav } from "@/components/local-nav";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { activeDisciplines, disciplineName, disciplines, projects, projectsIn, type Discipline, type Project } from "@/lib/content";

const host = (url: string) => new URL(url).host;

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return [...projects.map((p) => ({ slug: p.slug })), ...activeDisciplines.map((d) => ({ slug: d.id }))];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (project) return { title: project.title, description: project.oneLiner };
  const discipline = activeDisciplines.find((d) => d.id === slug);
  return discipline ? { title: discipline.name, description: discipline.description } : {};
}

export default async function WorkItemPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (project) return <CaseStudy project={project} />;
  const discipline = activeDisciplines.find((d) => d.id === slug);
  if (discipline) return <DisciplinePage discipline={discipline} />;
  notFound();
}

function Videos({ videos }: { videos: NonNullable<Project["videos"]> }) {
  return (
    <div className={`mt-6 grid gap-x-6 gap-y-10 lg:mt-8 ${videos.length > 1 ? "md:grid-cols-2" : "max-w-[1024px]"}`}>
      {videos.map((v) => (
        <figure key={v.id}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${v.id}`}
            title={v.title}
            loading="lazy"
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="block aspect-video w-full rounded-[16px] border border-current/15 bg-black"
          />
          <figcaption className="t-title mt-3">{v.title}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function DisciplinePage({ discipline }: { discipline: Discipline }) {
  const list = projectsIn(discipline.id);
  const withVideos = list.filter((p) => p.videos);
  const active = disciplines.filter((d) => projectsIn(d.id).length > 0);
  const i = active.findIndex((d) => d.id === discipline.id);
  const prev = active[i - 1];
  const next = active[i + 1];
  return (
    <div className="wrap page-top">
      <nav aria-label="Breadcrumb" className="t-label">
        <Link href="/work" className="hover:underline">Work</Link> / {discipline.name}
      </nav>
      <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between lg:mt-4">
        <h1 className="t-display-sm">{discipline.name}</h1>
        <p className="t-label">{list.length} {list.length === 1 ? "Project" : "Projects"}</p>
      </div>
      {discipline.description && <p className="t-body-lg text-muted mt-4 max-w-[560px] lg:mt-6">{discipline.description}</p>}
      {discipline.tools.length > 0 && (
        <div className="mt-8 lg:mt-12">
          <h2 className="t-label">Tools</h2>
          <p className="t-body scroll-fade mt-2 -mr-4 whitespace-nowrap pr-8 md:mr-0 md:pr-0 lg:mt-3">{discipline.tools.join(" · ")}</p>
        </div>
      )}
      <div className="sec grid gap-x-6 gap-y-8 pt-12! md:grid-cols-2 lg:grid-cols-3 lg:gap-y-12 lg:pt-[120px]!">
        {list.map((p, n) => (
          <Reveal key={p.slug} index={n}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
      {withVideos.map((p) => (
        <section key={p.slug} className="sec">
          <h2 className="t-headline">{p.title}</h2>
          <p className="t-body text-muted mt-2 max-w-[680px]">{p.oneLiner}</p>
          <Videos videos={p.videos!} />
          <Link href={`/work/${p.slug}`} className="link mt-6 inline-flex">About this project</Link>
        </section>
      ))}
      <nav aria-label="Other disciplines" className="sec flex items-center justify-between gap-6">
        {prev ? (
          <Link href={`/work/${prev.id}`} className="t-title inline-flex items-center gap-2 hover:underline">
            <ArrowLeft size={18} strokeWidth={1.75} aria-hidden /> {prev.name}
          </Link>
        ) : <span />}
        {next && (
          <Link href={`/work/${next.id}`} className="t-title inline-flex items-center gap-2 text-right hover:underline">
            {next.name} <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
          </Link>
        )}
      </nav>
    </div>
  );
}

function CaseStudy({ project }: { project: Project }) {
  const i = projects.indexOf(project);
  const prev = projects[i - 1];
  const next = projects[i + 1];
  const chapters = project.chapters ?? [];
  const anchors = [
    { id: "summary", label: "Summary" },
    ...(project.videos ? [{ id: "watch", label: "Watch" }] : []),
    ...(project.live ? [{ id: "live", label: "Live site" }] : []),
    ...(project.demo ? [{ id: "demo", label: project.live ? "Prototype" : "Mockup" }] : []),
    ...(project.gallery ? [{ id: "screens", label: "Screens" }] : []),
    ...chapters.map((c) => ({ id: c.id, label: c.anchor }))];
  const columns = project.facts.length;

  return (
    <div className="wrap page-top">
      {anchors.length > 1 && <LocalNav title={project.shortTitle ?? project.title} anchors={anchors} titleId="project-title" />}

      <nav aria-label="Breadcrumb" className="t-label">
        <Link href="/work" className="hover:underline">Work</Link> / {disciplineName(project.tags[0])} · {project.period}
      </nav>
      <h1 id="project-title" className="t-display-sm mt-3 max-w-[1000px] text-balance lg:mt-4">{project.title}</h1>
      <p className="t-headline-light text-muted mt-4 max-w-[1000px] lg:mt-6">{project.oneLiner}</p>
      <p className="t-label mt-4 flex flex-wrap gap-x-3 lg:mt-6">
        {project.tags.map((t) => <span key={t}>{disciplineName(t)}</span>)}
      </p>

      <dl
        className="tiles mt-8 grid-cols-2 lg:mt-12 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
        style={{ "--cols": columns } as React.CSSProperties}
      >
        {project.facts.map((f) => (
          <div key={f.label} className={`tile ${f.label === "Role" || f.label === "Timeline" ? "col-span-2 lg:col-span-1" : ""}`}>
            <dt className="t-label">{f.label}</dt>
            <dd className="t-title mt-1.5">{f.value}</dd>
          </div>
        ))}
      </dl>

      {project.figma && (
        <a href={project.figma} target="_blank" rel="noopener" className="link mt-6 inline-flex">
          Figma design file <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden />
        </a>
      )}

      <section id="summary" className="sec scroll-mt-24">
        <h2 className="t-label">Summary</h2>
        <p className="t-body-lg mt-3 max-w-[680px]">{project.summary}</p>
      </section>

      {project.videos && (
        <section id="watch" className="sec scroll-mt-24">
          <h2 className="t-label">Watch</h2>
          <Videos videos={project.videos} />
        </section>
      )}

      {project.live && (
        <section id="live" className="sec scroll-mt-24">
          <h2 className="t-label">Live site</h2>
          <p className="t-body text-muted mt-3 max-w-[680px]">{project.live.note}</p>
          <iframe
            src={project.live.src}
            title={`${project.title} live site`}
            loading="lazy"
            className="mt-6 block aspect-[4/3] max-h-[80vh] w-full max-w-[1200px] rounded-[24px] border border-current/15 bg-white sm:aspect-[16/10] lg:mt-8"
          />
          <a href={project.live.src} target="_blank" rel="noopener" className="link mt-4 inline-flex">{host(project.live.src)} <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden /></a>
        </section>
      )}

      {project.demo && (
        <section id="demo" className="sec scroll-mt-24">
          <h2 className="t-label">{project.demo.heading ?? "Interactive mockup"}</h2>
          <p className="t-body text-muted mt-3 max-w-[680px]">{project.demo.note}</p>
          <iframe
            src={project.demo.src}
            title={`${project.title} interactive mockup`}
            loading="lazy"
            className={`mt-6 block w-full border border-current/15 bg-white lg:mt-8 ${
              project.demo.landscape
                ? "aspect-[4/3] max-h-[80vh] max-w-[1024px] rounded-[24px] sm:aspect-[16/10]"
                : "h-[min(844px,80vh)] max-w-[390px] rounded-[32px]"
            }`}
          />
          <a href={project.demo.src} target="_blank" rel="noopener" className="link mt-4 inline-flex">{project.demo.src.startsWith("http") ? host(project.demo.src) : "Open full screen"} <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden /></a>
        </section>
      )}

      {project.gallery && (
        <section id="screens" className="sec scroll-mt-24">
          <h2 className="t-label">Screens</h2>
          <p className="t-body text-muted mt-3 max-w-[680px]">Screenshots of the running site. Every name and number in them is demo data.</p>
          <div className="mt-6 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:mt-8">
            {project.gallery.map((g, n) => (
              <figure key={g.src} className={n === 0 ? "md:col-span-2" : undefined}>
                <Image
                  src={g.src}
                  alt={g.caption}
                  width={1600}
                  height={1000}
                  sizes={n === 0 ? "(min-width: 1024px) 1200px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                  className="block h-auto w-full rounded-[16px] border border-current/15"
                />
                <figcaption className="t-caption mt-3">{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {chapters.length > 0 && (
        <div className="sec flex flex-col gap-16 lg:gap-24">
          {chapters.map((c) => (
            <section key={c.id} id={c.id} className="lg:grid lg:grid-cols-12 lg:gap-x-6">
              <h2 className="t-label lg:sticky lg:top-[152px] lg:col-span-3 lg:self-start">
                {c.title}
              </h2>
              <div className="mt-4 max-w-[680px] lg:col-span-8 lg:col-start-5 lg:mt-0">
                <p className="t-body">{c.body}</p>
                {c.problem && <p className="t-body-lg border-accent mt-6 border-l-2 pl-5">{c.problem}</p>}
              </div>
            </section>
          ))}
        </div>
      )}

      <nav aria-label="More projects" className="sec grid items-center gap-4 md:grid-cols-3">
        <div>
          {prev && (
            <Link href={`/work/${prev.slug}`} className="t-title inline-flex items-center gap-2 hover:underline">
              <ArrowLeft size={18} strokeWidth={1.75} aria-hidden /> {prev.title}
            </Link>
          )}
        </div>
        <Link href="/work" className="link md:justify-self-center">Back to work</Link>
        <div className="md:text-right">
          {next && (
            <Link href={`/work/${next.slug}`} className="t-title inline-flex items-center gap-2 hover:underline">
              {next.title} <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
            </Link>
          )}
        </div>
      </nav>

      <section className="pt-16 lg:pt-20">
        <h2 className="t-headline">Want to talk about a project?</h2>
        <Link href="/contact" className="btn btn-primary btn-block mt-6 lg:mt-8">
          Get in touch <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
        </Link>
      </section>
    </div>
  );
}
