import Image from "next/image";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { OrPending, SampleBadge } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { photos } from "@/content/images";
import { signatureProjects } from "@/content/projects";
import { verticalMap } from "@/content/verticals";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Signature Projects",
  description: "The stories behind Raghav Buildcon’s landmark infrastructure projects — the challenge, our approach and the outcome.",
  path: "/signature-projects",
});

export default function SignatureProjectsPage() {
  return (
    <>
      <PageHero
        image={photos.bridges.src}
        scene="bridge"
        breadcrumbs={[
          { name: "Projects", path: "/projects" },
          { name: "Signature Projects", path: "/signature-projects" },
        ]}
        eyebrow="Signature projects"
        title="The stories behind the structures."
        lead="Landmark works where engineering, planning and site discipline came together to solve hard problems."
      />

      <section className="py-24 sm:py-28">
        <Container className="space-y-24 sm:space-y-32">
          {signatureProjects.map((p, i) => (
            <article key={p.slug} className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className={cn("relative lg:col-span-7", i % 2 === 1 && "lg:order-2")}>
                <div data-clip="" data-parallax="5" className="relative aspect-[16/11] overflow-hidden rounded-sm bg-ink-100">
                  <Image src={p.image.src} alt={p.image.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
                </div>
                <span aria-hidden="true" data-depth="-0.35" className="absolute -top-6 font-display text-[6rem] leading-none font-bold text-gold-500/90 drop-shadow-[0_6px_20px_rgb(7_11_20/0.35)] sm:text-[8rem] lg:-left-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </Reveal>
              <div className="lg:col-span-5">
                <Reveal className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold-700">{verticalMap[p.vertical].title}</span>
                  {p.sample ? <SampleBadge /> : null}
                </Reveal>
                <Reveal delay={80}>
                  <h2 className="mt-4 text-3xl font-semibold text-ink-950 sm:text-4xl">{p.title}</h2>
                  <p className="mt-4 text-lg leading-relaxed text-ink-500">{p.summary}</p>
                </Reveal>
                {p.story ? (
                  <Reveal as="dl" delay={140} className="mt-8 space-y-5 border-l-2 border-gold-500 pl-6">
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-[0.18em] text-ink-400">Challenge</dt>
                      <dd className="mt-1.5 leading-relaxed text-ink-700">{p.story.challenge}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-[0.18em] text-ink-400">Approach</dt>
                      <dd className="mt-1.5 leading-relaxed text-ink-700">{p.story.approach}</dd>
                    </div>
                  </Reveal>
                ) : null}
                <Reveal delay={200} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <ButtonLink href={`/projects/${p.slug}`} variant="dark">
                    Read the full story
                  </ButtonLink>
                  <span className="text-sm text-ink-500">
                    <OrPending value={p.facts.location} label="Location to be updated" />
                  </span>
                </Reveal>
              </div>
            </article>
          ))}
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
