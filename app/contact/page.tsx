import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { CopyEmail } from "@/components/copy-email";
import { site } from "@/lib/content";

const intro = "Open to full-time developer roles, remote across Canada or in Ontario, plus select freelance builds.";

export const metadata: Metadata = { title: "Contact", description: intro };

export default function ContactPage() {
  return (
    <div className="wrap page-top">
      <p className="t-label">Contact</p>
      <h1 className="t-display-sm mt-3 lg:mt-4">Let&apos;s build something.</h1>
      <p className="t-body-lg text-muted mt-4 max-w-[560px] lg:mt-6">{intro}</p>

      <div className="mt-10 grid gap-x-6 gap-y-8 lg:mt-16 lg:grid-cols-12">
        <div className="max-lg:order-2 lg:col-span-8">
          <ContactForm />
        </div>
        <aside className="max-lg:order-1 lg:col-span-4">
          <h2 className="t-label">Direct</h2>
          <div className="mt-2 lg:mt-3">
            <CopyEmail />
          </div>
          <h2 className="t-label mt-8 lg:mt-12">Elsewhere</h2>
          <div className="mt-2 flex gap-6 lg:mt-3">
            {[["LinkedIn", site.linkedin], ["GitHub", site.github]].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={`${label} (opens in a new tab)`} className="t-body inline-flex items-center gap-1 hover:underline">
                {label} <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden />
              </a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
