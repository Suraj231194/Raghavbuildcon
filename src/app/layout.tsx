import type { Metadata, Viewport } from "next";
import { Archivo, Manrope } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { ScrollEffects } from "@/components/motion/ScrollEffects";
import { company, contact } from "@/content/company";
import { absoluteUrl, siteUrl } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} — Infrastructure & Construction`,
    template: `%s | ${company.name}`,
  },
  description: company.description,
  applicationName: company.name,
  keywords: ["Raghav Buildcon", "Nashik", "civil infrastructure", "construction", "PMGSY roads", "PWD roads", "bridges", "culverts", "pipelines", "building construction"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: company.name,
    url: "/",
    title: `${company.name} — Infrastructure & Construction`,
    description: company.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.name} — Infrastructure & Construction`,
    description: company.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#070b14",
  colorScheme: "light",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.legalName ?? company.name,
  url: siteUrl,
  logo: absoluteUrl("/brand/raghav-buildcon-logo.png"),
  description: company.description,
  ...(contact.email ? { email: contact.email } : {}),
  ...(contact.phone ? { telephone: contact.phone } : {}),
  ...(contact.address ? { address: contact.address } : {}),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${archivo.variable} ${manrope.variable}`}>
      <body className="min-h-dvh">
        <div id="top" />
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-sm bg-gold-500 px-4 py-2.5 text-sm font-semibold text-ink-950 shadow-lg transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="overflow-x-clip outline-none">
          {children}
        </main>
        <SiteFooter />
        <RevealObserver />
        <ScrollEffects />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </body>
    </html>
  );
}
