import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { AssemblyStory } from "@/components/motion/assembly/AssemblyStory";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { verticalAssembly } from "@/content/assembly";
import { projects } from "@/content/projects";
import { deliveryProcess, getVertical, verticals } from "@/content/verticals";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return verticals.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vertical = getVertical((await params).slug);
  if (!vertical) return {};
  return pageMetadata({ title: vertical.title, description: vertical.summary, path: `/expertise/${vertical.slug}` });
}

export default async function VerticalPage({ params }: Props) {
  const vertical = getVertical((await params).slug);
  if (!vertical) notFound();
  const related = projects.filter((p) => p.vertical === vertical.slug);
  const others = verticals.filter((v) => v.slug !== vertical.slug);
  const assembly = verticalAssembly[vertical.slug];

  return (
    <>
      <PageHero
        image={vertical.image.src}
        breadcrumbs={[
          { name: "Expertise", path: "/expertise" },
          { name: vertical.title, path: `/expertise/${vertical.slug}` },
        ]}
        eyebrow="Our expertise"
        title={vertical.title}
        lead={vertical.summary}
      >
        <ButtonLink href="/contact" size="lg">
          Discuss a project
        </ButtonLink>
      </PageHero>

      {/* Overview + scope */}
      <section className="py-24 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="Overview" title={`What we deliver in ${vertical.title.toLowerCase()}.`} />
            <Reveal delay={100} className="mt-6 space-y-5 text-lg leading-relaxed text-ink-600">
              {vertical.intro.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </Reveal>
          </div>
          <Reveal delay={150} className="rounded-sm bg-sand-50 p-8 lg:col-span-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700 [font-stretch:100%]">Scope of work</h2>
            <ul className="mt-6 space-y-3.5">
              {vertical.scope.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink-800">
                  <Icon name="check" className="mt-0.5 size-4.5 shrink-0 text-gold-600" strokeWidth={2.2} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* The vertical's build sequence, assembled as the reader scrolls */}
      <AssemblyStory model={assembly.model} id="build-sequence" eyebrow="How it comes together" title={assembly.title} lead={assembly.lead} />

      {/* Capabilities */}
      <section className="bg-sand-50 py-24 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Capabilities" title="Core capabilities" />
          <div className="mt-14">
            <FeatureGrid features={vertical.capabilities} columns={4} />
          </div>
        </Container>
      </section>

      {/* Related projects */}
      <section className="py-24 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Projects" title={`${vertical.title} projects`} />
          {related.length > 0 ? (
            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={i * 90}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </ul>
          ) : (
            <p className="mt-10 rounded-sm border border-dashed border-ink-200 bg-sand-50 px-6 py-10 text-center text-ink-500">Projects in this vertical will be listed here.</p>
          )}
        </Container>
      </section>

      {/* Delivery approach */}
      <section className="relative isolate overflow-hidden bg-ink-900 py-24 text-white sm:py-28">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint" />
        <Container>
          <SectionHeading tone="light" eyebrow="How we deliver" title="Our delivery lifecycle" />
          <div className="mt-14">
            <ProcessSteps steps={deliveryProcess} tone="light" />
          </div>
        </Container>
      </section>

      {/* Other verticals */}
      <section className="pt-24 sm:pt-28">
        <Container>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-ink-400 [font-stretch:100%]">Other verticals</h2>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-sm border border-ink-100 bg-ink-100 sm:grid-cols-3">
            {others.map((v) => (
              <li key={v.slug}>
                <Link href={`/expertise/${v.slug}`} className="group flex h-full items-center gap-4 bg-white p-6 transition-colors hover:bg-sand-50">
                  <Icon name={v.icon} className="size-7 shrink-0 text-gold-600" />
                  <span className="flex-1 font-display text-lg font-semibold text-ink-950">{v.title}</span>
                  <Icon name="arrow-right" className="size-5 text-ink-400 transition-transform group-hover:translate-x-1 group-hover:text-gold-600" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
