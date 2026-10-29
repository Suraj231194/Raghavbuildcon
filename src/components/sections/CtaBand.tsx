import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { photos } from "@/content/images";

type CtaBandProps = {
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  image?: string;
};

export function CtaBand({
  eyebrow = "Partner with us",
  title = "Planning an infrastructure project? Let’s build it together.",
  lead = "Talk to our team about roads, bridges, buildings and EPC works — from early feasibility to final handover.",
  primary = { label: "Start a conversation", href: "/contact" },
  secondary = { label: "Explore our projects", href: "/projects" },
  image = photos.hero.src,
}: CtaBandProps) {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <div data-reveal="" data-parallax="4" className="relative isolate overflow-hidden rounded-sm bg-ink-950 px-6 py-14 text-white sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          <Image src={image} alt="" fill sizes="(min-width: 1320px) 1220px, 100vw" className="-z-20 object-cover opacity-45" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-ink-950 via-ink-950/90 to-ink-950/40" />
          <div aria-hidden="true" className="absolute top-0 left-0 h-full w-1.5 bg-gold-500" />
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Eyebrow tone="light">{eyebrow}</Eyebrow>
              <h2 className="mt-5 text-3xl leading-[1.08] font-semibold sm:text-4xl lg:text-[2.9rem]">{title}</h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-200">{lead}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col lg:items-stretch">
              <ButtonLink href={primary.href} size="lg">
                {primary.label}
              </ButtonLink>
              <ButtonLink href={secondary.href} size="lg" variant="outline-light">
                {secondary.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
