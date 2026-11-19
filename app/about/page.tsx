import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { about, site } from "@/lib/content";
import headshot from "@/public/images/headshot.jpg";

export const metadata: Metadata = { title: "About", description: about.headline };

export default function AboutPage() {
  return (
    <div className="wrap page-top">
      <p className="t-label">About</p>
      <h1 className="t-display-sm mt-3 lg:mt-4">{about.headline}</h1>

      <div className="mt-10 grid gap-y-8 lg:mt-16 lg:grid-cols-12 lg:gap-x-6">
        <Image
          src={headshot}
          alt={`Portrait of ${site.name}`}
          sizes="(min-width: 1024px) 384px, 100vw"
          priority
          placeholder="blur"
          className="w-full rounded-[16px] lg:col-span-4"
        />
        <div className="t-body-lg flex max-w-[600px] flex-col gap-6 lg:col-span-7 lg:col-start-6">
          {about.bio.map((p) => <p key={p}>{p}</p>)}
        </div>
      </div>

      <section className="sec" aria-labelledby="skills">
        <h2 id="skills" className="t-label">Skills</h2>
        <div className="mt-label grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {about.skills.map((g, i) => (
            <Reveal key={g.heading} index={i}>
              <h3 className="t-label">{g.heading}</h3>
              <ul className="t-body mt-3 flex flex-col gap-1">
                {g.items.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pt-12 lg:pt-20" aria-labelledby="tools">
        <h2 id="tools" className="t-label">Tools</h2>
        <p className="t-body scroll-fade mt-3 -mr-4 whitespace-nowrap pr-8 md:mr-0 md:pr-0 lg:whitespace-normal">{about.tools.join(" · ")}</p>
      </section>

      <div className="mt-12 flex flex-col items-start gap-3 md:flex-row md:items-center lg:mt-20">
        <Link href="/resume" className="btn btn-primary btn-block">
          Read my résumé <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
        </Link>
        <Link href="/contact" className="btn btn-secondary btn-block">Get in touch</Link>
      </div>
    </div>
  );
}
