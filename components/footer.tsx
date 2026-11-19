import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { site } from "@/lib/content";
import { CopyEmail } from "./copy-email";

export function Footer() {
  return (
    <footer className="sec overflow-hidden">
      <div className="wrap">
        <div className="grid gap-x-6 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="t-headline">Have a project in mind?</h2>
            <div className="mt-6 lg:mt-8">
              <CopyEmail />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:col-span-4 lg:col-start-9 lg:gap-6">
            <div>
              <h3 className="t-label">Elsewhere</h3>
              <ul className="t-body mt-3 flex flex-col gap-3 lg:mt-4">
                <li>
                  <a href={site.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline" aria-label="LinkedIn (opens in a new tab)">
                    LinkedIn <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden />
                  </a>
                </li>
                <li>
                  <a href={site.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline" aria-label="GitHub (opens in a new tab)">
                    GitHub <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden />
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="t-label">Pages</h3>
              <ul className="t-body mt-3 flex flex-col gap-3 lg:mt-4">
                <li><Link href="/work" className="hover:underline">Work</Link></li>
                <li><Link href="/about" className="hover:underline">About</Link></li>
                <li><Link href="/resume" className="hover:underline">Resume</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-line mt-14 border-t lg:mt-24" />
        <div className="t-caption mt-4 flex items-center justify-between gap-4 lg:mt-6">
          <p>
            © 2026 {site.name}
            <span className="hidden md:inline"> · Built with Next.js</span>
          </p>
          <a href="#top" className="inline-flex shrink-0 items-center gap-1 hover:underline">
            Back to top <ArrowUp size={14} strokeWidth={1.75} aria-hidden />
          </a>
        </div>

        <div aria-hidden className="giant-name mt-8 lg:mt-12">
          <span className="hidden md:block">{site.name}</span>
          <span className="md:hidden">Vroom</span>
        </div>
      </div>
    </footer>
  );
}
