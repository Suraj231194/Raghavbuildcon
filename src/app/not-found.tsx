import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const links = [
  { label: "Our expertise", href: "/expertise" },
  { label: "Projects", href: "/projects" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[85svh] items-center overflow-hidden bg-ink-950 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint" />
      <div aria-hidden="true" data-depth="-0.5" className="absolute -right-10 bottom-0 -z-10 font-display text-[16rem] leading-none font-bold text-white/[0.04] sm:text-[24rem]">
        404
      </div>
      <Container className="pt-36 pb-24">
        <Eyebrow tone="light">Error 404</Eyebrow>
        <h1 className="mt-6 max-w-2xl text-4xl leading-[1.05] font-semibold sm:text-6xl">This road doesn’t lead anywhere — yet.</h1>
        <p className="mt-6 max-w-xl text-lg text-ink-200">The page you are looking for may have moved or no longer exists.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            Back to home
          </ButtonLink>
          <ButtonLink href="/contact" size="lg" variant="outline-light">
            Contact us
          </ButtonLink>
        </div>
        <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-ink-300 underline decoration-white/20 underline-offset-4 hover:text-gold-300">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
