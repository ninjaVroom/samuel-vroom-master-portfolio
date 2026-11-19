import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Dock } from "@/components/dock";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LogoTrace } from "@/components/logo-trace";
import { Tracker } from "@/components/tracker";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}, ${site.title}`, template: `%s · ${site.name}` },
  description: "Web and mobile apps in React, Next.js, TypeScript and Flutter, with 7+ years across software, delivery and media.",
  openGraph: { siteName: site.name, type: "website" },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F8FB" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0D1F" },
  ],
};

// Runs before first paint: stored theme, motion gating, and the once-per-session logo splash.
const boot = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')d.dataset.theme=t;if(!sessionStorage.getItem('splash')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){sessionStorage.setItem('splash','1');d.setAttribute('data-splash','');setTimeout(function(){d.removeAttribute('data-splash')},750)}}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" id="top" data-scroll-behavior="smooth" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <a href="#content" className="bg-surface shadow-e2 t-ui sr-only rounded-full px-4 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60]">
          Skip to content
        </a>
        <div className="splash" aria-hidden>
          <LogoTrace size={96} solid />
        </div>
        <Header />
        <main id="content">{children}</main>
        <Footer />
        <Dock />
        <Tracker />
      </body>
    </html>
  );
}
