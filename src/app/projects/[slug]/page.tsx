import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { OrPending, PlaceholderNote, SampleBadge } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { getProject, projects } from "@/content/projects";
import type { ProjectFacts } from "@/content/types";
import { verticalMap } from "@/content/verticals";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return pageMetadata({ title: project.title, description: project.summary, path: `/projects/${project.slug}`, type: "article" });
}

const factRows: { key: keyof ProjectFacts; label: string; icon: IconName }[] = [
  { key: "client", label: "Client", icon: "briefcase" },
  { key: "location", label: "Location", icon: "map-pin" },
  { key: "contractValue", label: "Contract value", icon: "file" },
  { key: "contractType", label: "Contract type", icon: "clipboard" },
  { key: "status", label: "Status", icon: "gauge" },
  { key: "duration", label: "Duration", icon: "calendar" },
];

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const vertical = verticalMap[project.vertical];
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length]!;
  const related = projects.filter((p) => p.vertical === project.vertical && p.slug !== project.slug).slice(0, 3);

  return (
    <>
      <PageHero
        image={project.image.src}
        breadcrumbs={[
          { name: "Projects", path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` },
        ]}
        eyebrow={vertical.title}
        title={project.title}
        lead={project.summary}
      >
        {project.sample ? <SampleBadge tone="light" label="Sample project" /> : null}
      </PageHero>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            {project.sample ? (
              <PlaceholderNote className="mb-12">
                This is a sample project page showing how a project will be presented. Verified project details and site photography will replace it.
              </PlaceholderNote>
            ) : null}

            <Reveal>
              <h2 className="text-3xl font-semibold text-ink-950">Project overview</h2>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-600">
                {project.overview.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </Reveal>

            {project.story ? (
              <Reveal className="mt-14 grid gap-px overflow-hidden rounded-sm bg-ink-100 sm:grid-cols-3">
                {(
                  [
                    ["The challenge", project.story.challenge],
                    ["Our approach", project.story.approach],
                    ["The outcome", project.story.outcome],
                  ] as const
                ).map(([label, text]) => (
                  <div key={label} className="bg-sand-50 p-7">
                    <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-gold-700 [font-stretch:100%]">{label}</h3>
                    <p className="mt-3 leading-relaxed text-ink-700">{text}</p>
                  </div>
                ))}
              </Reveal>
            ) : null}

            <div className="mt-14 grid gap-10 sm:grid-cols-2">
              <Reveal>
                <h2 className="font-display text-xl font-semibold text-ink-950">Scope of work</h2>
                <ul className="mt-5 space-y-3">
                  {project.scope.map((s) => (
                    <li key={s} className="flex items-start gap-3 text-ink-700">
                      <Icon name="check" className="mt-0.5 size-4.5 shrink-0 text-gold-600" strokeWidth={2.2} />
                      {s}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="font-display text-xl font-semibold text-ink-950">Highlights</h2>
                <ul className="mt-5 space-y-3">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-ink-700">
                      <Icon name="spark" className="mt-0.5 size-4.5 shrink-0 text-gold-600" />
                      {h}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {project.gallery.length > 0 ? (
              <div className="mt-16">
                <h2 className="font-display text-xl font-semibold text-ink-950">Gallery</h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {project.gallery.map((img, i) => (
                    <Reveal as="li" key={img.src} delay={i * 80}>
                      <figure className="overflow-hidden rounded-sm bg-ink-100">
                        <div className="relative aspect-[4/3]">
                          <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                        </div>
                      </figure>
                    </Reveal>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="lg:col-span-4">
            <div className="rounded-sm bg-ink-950 p-7 text-white lg:sticky lg:top-28">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400 [font-stretch:100%]">Key facts</h2>
              <dl className="mt-6 divide-y divide-white/10">
                <div className="flex items-start gap-4 py-4 first:pt-0">
                  <Icon name={vertical.icon} className="mt-0.5 size-5 shrink-0 text-gold-400" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">Vertical</dt>
                    <dd className="mt-1 font-semibold">
                      <Link href={`/expertise/${vertical.slug}`} className="hover:text-gold-300">
                        {vertical.title}
                      </Link>
                    </dd>
                  </div>
                </div>
                {factRows.map((row) => (
                  <div key={row.key} className="flex items-start gap-4 py-4">
                    <Icon name={row.icon} className="mt-0.5 size-5 shrink-0 text-gold-400" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">{row.label}</dt>
                      <dd className="mt-1 font-semibold">
                        <OrPending value={project.facts[row.key]} tone="light" />
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
              <Link href="/contact" className="mt-6 flex items-center justify-between rounded-sm bg-gold-500 px-5 py-4 font-semibold text-ink-950 transition-colors hover:bg-gold-400">
                Discuss a similar project
                <Icon name="arrow-right" className="size-5" />
              </Link>
            </div>
          </aside>
        </Container>
      </section>

      {/* Next project */}
      <section className="border-t border-ink-100">
        <Container>
          <Link href={`/projects/${next.slug}`} className="group flex items-center justify-between gap-6 py-10">
            <span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-ink-400">Next project</span>
              <span className="mt-2 block font-display text-2xl font-semibold text-ink-950 transition-colors group-hover:text-gold-700 sm:text-3xl">{next.title}</span>
            </span>
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-ink-200 transition-colors group-hover:border-gold-500 group-hover:bg-gold-500">
              <Icon name="arrow-right" className="size-6" />
            </span>
          </Link>
        </Container>
      </section>

      {related.length > 0 ? (
        <section className="bg-sand-50 py-20 sm:py-24">
          <Container>
            <h2 className="text-3xl font-semibold text-ink-950">More {vertical.title.toLowerCase()} projects</h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <ProjectCard project={p} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <CtaBand />
    </>
  );
}
