import type { MetadataRoute } from "next";
import { news } from "@/content/news";
import { projects } from "@/content/projects";
import { verticals } from "@/content/verticals";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/about", priority: 0.8 },
    { path: "/about/proprietor", priority: 0.7 },
    { path: "/expertise", priority: 0.9 },
    { path: "/projects", priority: 0.9 },
    { path: "/signature-projects", priority: 0.8 },
    { path: "/sustainability", priority: 0.6 },
    { path: "/safety-quality", priority: 0.6 },
    { path: "/careers", priority: 0.7 },
    { path: "/news", priority: 0.6 },
    { path: "/contact", priority: 0.8 },
  ];
  return [
    ...staticRoutes.map((r) => ({ url: absoluteUrl(r.path), changeFrequency: "monthly" as const, priority: r.priority })),
    ...verticals.map((v) => ({ url: absoluteUrl(`/expertise/${v.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...projects.map((p) => ({ url: absoluteUrl(`/projects/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...news.map((n) => ({ url: absoluteUrl(`/news/${n.slug}`), ...(n.date ? { lastModified: n.date } : {}), changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
