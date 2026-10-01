import Image from "next/image";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { photos } from "@/content/images";
import { deliveryProcess, verticals } from "@/content/verticals";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Our Expertise",
  description: "Roads & highways, bridges & structures, buildings and EPC construction — the four verticals of Raghav Buildcon.",
  path: "/expertise",
});

export default function ExpertisePage() {
  return (
    <>
      <PageHero
        image={photos.aerial.src}
        breadcrumbs={[{ name: "Expertise", path: "/expertise" }]}
        eyebrow="Our expertise"
        title="Four verticals. One standard of delivery."
        lead="Every vertical is backed by the same engineering rigour, safety culture and accountable project leadership."
      />

      <section className="py-24 sm:py-28">
        <Container className="space-y-24 sm:space-y-28">
          {verticals.map((v, i) => (
            <article key={v.slug} id={v.slug} className="grid scroll-mt-24 items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className={cn("relative lg:col-span-6", i % 2 === 1 && "lg:order-2")}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-ink-100">
                  <Image src={v.image.src} alt={v.image.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
                </div>
                <span className="absolute -bottom-6 left-6 flex size-16 items-center justify-center rounded-sm bg-gold-500 text-ink-950 shadow-xl">
                  <Icon name={v.icon} className="size-8" />
                </span>
              </Reveal>
              <div className="lg:col-span-6">
                <Reveal>
                  <p className="font-display text-sm font-semibold tracking-[0.18em] text-gold-700">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="mt-3 text-3xl font-semibold text-ink-950 sm:text-4xl">{v.title}</h2>
                  <p className="mt-5 text-lg leading-relaxed text-ink-500">{v.intro[0]}</p>
                </Reveal>
                <Reveal as="ul" delay={100} className="mt-8 grid gap-3 sm:grid-cols-2">
                  {v.capabilities.map((c) => (
                    <li key={c.title} className="flex items-center gap-3 text-[0.95rem] font-medium text-ink-800">
                      <Icon name="check" className="size-4.5 shrink-0 text-gold-600" strokeWidth={2.2} />
                      {c.title}
                    </li>
                  ))}
                </Reveal>
                <Reveal delay={160} className="mt-9">
                  <ButtonLink href={`/expertise/${v.slug}`} variant="dark">
                    Explore {v.title}
                  </ButtonLink>
                </Reveal>
              </div>
            </article>
          ))}
        </Container>
      </section>

      <section className="relative isolate overflow-hidden bg-ink-900 py-24 text-white sm:py-28">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint" />
        <Container>
          <SectionHeading tone="light" eyebrow="How we deliver" title="A disciplined lifecycle, from first survey to final handover." />
          <div className="mt-14">
            <ProcessSteps steps={deliveryProcess} tone="light" />
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
