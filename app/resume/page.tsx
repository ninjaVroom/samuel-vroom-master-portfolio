import type { Metadata } from "next";
import { DownloadPdf } from "@/components/download-pdf";
import { resume, site } from "@/lib/content";

export const metadata: Metadata = { title: "Resume", description: `${resume.summary.split(". ")[0]}.` };

const ContactLine = ({ className }: { className: string }) => (
  <p className={`t-body text-muted ${className}`}>
    {site.location} · <a className="hover:underline" href={`mailto:${site.email}`}>{site.email}</a> ·{" "}
    <a className="hover:underline" href={site.linkedin} target="_blank" rel="noreferrer">{site.linkedinLabel}</a> ·{" "}
    <a className="hover:underline" href={site.github} target="_blank" rel="noreferrer">{site.githubLabel}</a>
  </p>
);

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="t-body mt-3 flex flex-col gap-2">
    {items.map((b) => (
      <li key={b} className="relative pl-4 before:absolute before:top-[0.7em] before:left-0 before:size-1 before:rounded-full before:bg-[var(--muted)]">
        {b}
      </li>
    ))}
  </ul>
);

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="lg:grid lg:grid-cols-12 lg:gap-x-6">
      <h2 className="t-label lg:sticky lg:top-[104px] lg:col-span-3 lg:self-start">{label}</h2>
      <div className="mt-2 max-w-[680px] lg:col-span-8 lg:col-start-5 lg:mt-0">{children}</div>
    </section>
  );
}

export default function ResumePage() {
  return (
    <div className="wrap page-top">
      <p className="t-label">Resume</p>
      <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between lg:mt-4">
        <h1 className="t-display-sm">
          Samuel Roland <br className="md:hidden" />
          Vroom
        </h1>
        <div className="max-md:contents md:flex md:flex-col md:items-end md:gap-3 md:pt-3">
          <p className="t-caption max-md:order-1">{resume.updated}</p>
          <div className="max-md:order-3 max-md:mt-3"><DownloadPdf /></div>
        </div>
        <ContactLine className="max-md:order-2 md:hidden" />
      </div>
      <ContactLine className="mt-2 hidden md:block" />

      <div className="border-line mt-9 border-t lg:mt-9" />

      <div className="mt-8 flex flex-col gap-12 lg:mt-12 lg:gap-16">
        <Section label="Professional summary">
          <p className="t-body">{resume.summary}</p>
        </Section>

        <Section label="Technical skills">
          <ul className="t-body flex flex-col gap-1">
            {resume.competencies.map((c) => (
              <li key={c.label}>
                <span className="font-medium">{c.label}:</span> {c.items}
              </li>
            ))}
          </ul>
        </Section>

        <Section label="Technical projects">
          <div className="divide-line flex flex-col divide-y">
            {resume.projects.map((p) => (
              <article key={p.name} className="py-6 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-6">
                  <h3 className="t-title">{p.name}</h3>
                  <p className="t-caption flex shrink-0 flex-col md:max-w-[240px] md:pt-1.5 md:text-right">
                    {(p.links ?? [{ label: p.url!.replace("https://", ""), url: p.url! }]).map((l) => (
                      <a key={l.url} className="hover:underline" href={l.url} target="_blank" rel="noreferrer">
                        {l.label} ↗
                      </a>
                    ))}
                  </p>
                </div>
                <p className="t-body text-muted mt-1">{p.stack}</p>
                <Bullets items={p.bullets} />
              </article>
            ))}
          </div>
        </Section>

        <Section label="Work experience">
          <div className="divide-line flex flex-col divide-y">
            {resume.experience.map((e) => (
              <article key={e.role} className="py-6 first:pt-0 last:pb-0">
                <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-6">
                  <h3 className="t-title">{e.role}</h3>
                  <p className="t-caption md:max-w-[200px] md:pt-1.5 md:text-right">{e.dates}</p>
                </div>
                <p className="t-body text-muted mt-1">{e.org}</p>
                <Bullets items={e.bullets} />
              </article>
            ))}
          </div>
        </Section>

        <Section label="Education & certifications">
          <ul className="flex flex-col gap-5">
            {resume.education.map((e) => (
              <li key={e.title}>
                <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-6">
                  <h3 className="t-body font-medium">{e.title}</h3>
                  <p className="t-caption shrink-0 md:max-w-[200px] md:pt-1.5 md:text-right">{e.dates}</p>
                </div>
                <p className="t-body text-muted">{e.org}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section label="Additional experience">
          <ul className="flex flex-col gap-5">
            {resume.additional.map((e) => (
              <li key={e.role}>
                <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-6">
                  <h3 className="t-body font-medium">{e.role}</h3>
                  <p className="t-caption shrink-0 md:max-w-[200px] md:pt-1.5 md:text-right">{e.dates}</p>
                </div>
                <p className="t-body text-muted">{e.org}</p>
                <p className="t-body mt-2">{e.line}</p>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
