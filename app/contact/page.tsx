import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { CopyEmail } from "@/components/copy-email";
import { site } from "@/lib/content";

const intro = "Open to full-time developer roles in Ontario, plus freelance projects and collaborations.";

export const metadata: Metadata = { title: "Contact", description: intro };

export default function ContactPage() {
  return (
    <div className="wrap page-top">
      <p className="t-label">Contact</p>
      <h1 className="t-display-sm mt-3 lg:mt-4">Let&apos;s build something.</h1>
      <p className="t-body-lg text-muted mt-4 max-w-[560px] lg:mt-6">{intro}</p>
      <p className="t-caption mt-4 lg:mt-6">Based in Southwestern Ontario · open to remote</p>

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
          <a href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn (opens in a new tab)" className="t-body mt-2 inline-flex items-center gap-1 hover:underline lg:mt-3">
            LinkedIn <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden />
          </a>
        </aside>
      </div>
    </div>
  );
}
