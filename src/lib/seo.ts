import type { Metadata } from "next";
import { company } from "@/content/company";
import { absoluteUrl } from "./site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Optional page-specific share image (absolute or root-relative). Defaults to the site OG image. */
  image?: string;
  type?: "website" | "article";
};

/**
 * Per-page metadata. Next.js shallow-merges `openGraph`, so the shared fields are repeated here
 * to keep every page's share card complete.
 */
export function pageMetadata({ title, description, path, image, type = "website" }: PageMetaInput): Metadata {
  const images = image ? [{ url: image, width: 1200, height: 630, alt: title }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${company.name}`,
      description,
      url: path,
      siteName: company.name,
      locale: "en_IN",
      type,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${company.name}`,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
