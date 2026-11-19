import type { MetadataRoute } from "next";
import { activeDisciplines, projects, site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/work", "/about", "/resume", "/contact", ...activeDisciplines.map((d) => `/work/${d.id}`), ...projects.map((p) => `/work/${p.slug}`)];
  return paths.map((p) => ({ url: `${site.url}${p}` }));
}
