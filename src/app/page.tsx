import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NewsCard } from "@/components/cards/NewsCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { VerticalCard } from "@/components/cards/VerticalCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { StatsBand } from "@/components/sections/StatsBand";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { OrPending } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company, stats } from "@/content/company";
import { news } from "@/content/news";
import { getProject } from "@/content/projects";
import { verticals } from "@/content/verticals";
import { photos } from "@/content/images";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const commitments = [
  {
    icon: "compass",
    title: "Engineering-led delivery",
    text: "Surveys, design reviews and integrated programmes ground every decision — and keep schedules accountable.",
    href: "/expertise",
    image: photos.engineers.src,
  },
  {
    icon: "helmet",
    title: "Safety & quality",
    text: "Planned safety controls on every site, and inspection and test plans that verify every structure we build.",
    href: "/safety-quality",
    image: photos.safety.src,
  },
  {
    icon: "leaf",
    title: "Sustainability & ESG",
    text: "Responsible construction that respects the environment, supports communities and stands up to scrutiny.",
    href: "/sustainability",
    image: photos.solar.src,
  },
] as const;

export default function HomePage() {
  const featured = ["major-river-bridge", "four-lane-highway-corridor", "institutional-campus"].map((slug) => getProject(slug)!);
  const [lead, ...rest] = featured;

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink-950 text-white">
        <Image
          src={photos.hero.src}
          alt=""
          fill
          preload
          fetchPriority="high"
          sizes="100vw"
          className="-z-30 animate-fade-in object-cover object-[62%_center]"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-linear-to-r from-ink-950/95 via-ink-950/65 to-ink-950/0" />
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-linear-to-t from-ink-950 via-ink-950/0 to-ink-950/50" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint [mask-image:linear-gradient(to_right,black,transparent_60%)]" />

        <Container className="flex flex-1 flex-col justify-center pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="max-w-3xl">
            <div className="animate-fade-up">
              <Eyebrow tone="light">Infrastructure · Construction · EPC</Eyebrow>
            </div>
            <h1 className="mt-6 animate-fade-up text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.03em] [animation-delay:120ms] sm:text-6xl lg:text-[5.1rem]">
              Building Infrastructure. <span className="text-gold-400">Delivering Trust.</span>
            </h1>
            <p className="mt-7 max-w-2xl animate-fade-up text-lg leading-relaxed text-ink-200 [animation-delay:240ms] sm:text-xl">
              PMGSY and PWD roads, bridges, culverts, pipelines, buildings and allied infrastructure — delivered with engineering excellence, quality-driven execution, safety and transparency.
            </p>
            <div className="mt-10 flex animate-fade-up flex-col gap-3 [animation-delay:360ms] sm:flex-row">
              <ButtonLink href="/projects" size="lg">
                Explore our projects
              </ButtonLink>
              <ButtonLink href="/contact" size="lg" variant="outline-light">
                Partner with us
              </ButtonLink>
            </div>
          </div>
        </Container>

        <nav aria-label="Our verticals" className="relative animate-fade-up border-t border-white/10 bg-ink-950/55 backdrop-blur-md [animation-delay:480ms]">
          <Container>
            <ul className="grid grid-cols-2 lg:grid-cols-4">
              {verticals.map((v, i) => (
                <li key={v.slug} className={i % 2 === 1 ? "border-l border-white/10" : i > 0 ? "lg:border-l lg:border-white/10" : undefined}>
                  <Link
                    href={`/expertise/${v.slug}`}
                    className={`group flex items-center gap-4 py-5 pr-2 sm:py-6 lg:pr-6 ${i % 2 === 1 ? "pl-4 lg:pl-6" : i === 2 ? "lg:pl-6" : ""}`}
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-white/15 text-gold-400 transition-colors duration-300 group-hover:border-gold-500 group-hover:bg-gold-500 group-hover:text-ink-950">
                      <Icon name={v.icon} className="size-5.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.68rem] font-bold tracking-[0.18em] text-ink-400">{String(i + 1).padStart(2, "0")}</span>
                      <span className="block text-sm font-semibold text-white sm:text-[0.95rem]">{v.title}</span>
                    </span>
                    <Icon name="arrow-right" className="hidden size-4 text-ink-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold-400 sm:block" />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      </section>

      {/* Introduction */}
      <section aria-labelledby="intro-title" className="py-24 sm:py-32">
        <Container className="grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
          <Reveal className="relative lg:col-span-6">
            <div aria-hidden="true" className="absolute -top-5 -left-5 h-2/3 w-2/3 bg-sand-100 sm:-top-8 sm:-left-8" />
            <div aria-hidden="true" className="absolute -right-4 -bottom-4 size-28 border-r-4 border-b-4 border-gold-500 sm:-right-6 sm:-bottom-6" />
            <div className="relative aspect-[4/3.4] overflow-hidden rounded-sm bg-ink-100">
              <Image src={photos.engineers.src} alt={photos.engineers.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-8 left-6 flex max-w-xs items-center gap-4 rounded-sm bg-ink-950 p-5 text-white shadow-2xl sm:left-10">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-gold-500 text-ink-950">
                <Icon name="compass" className="size-6" />
              </span>
              <p className="text-sm leading-snug font-semibold">Engineering-led from survey to handover</p>
            </div>
          </Reveal>

          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="Who we are"
              title={<span id="intro-title">An emerging civil infrastructure enterprise, built on trust.</span>}
              lead={company.description}
            />
            <Reveal delay={100}>
              <p className="mt-5 leading-relaxed text-ink-500">
                {company.about[1]}
              </p>
              <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-ink-100 sm:grid-cols-3">
                {[
                  { label: "Founded", value: company.founded },
                  { label: "Headquarters", value: company.headquarters },
                  { label: "Operating regions", value: company.operatingRegions },
                ].map((f) => (
                  <div key={f.label} className="bg-white p-5">
                    <dt className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400">{f.label}</dt>
                    <dd className="mt-2 font-display text-lg font-semibold text-ink-950">
                      <OrPending value={f.value} />
                    </dd>
                  </div>
                ))}
              </dl>
              <ArrowLink href="/about" className="mt-9">
                More about Raghav Buildcon
              </ArrowLink>
            </Reveal>
          </div>
        </Container>
      </section>

      <StatsBand stats={stats} />

      {/* Expertise */}
      <section aria-labelledby="expertise-title" className="bg-sand-50 py-24 sm:py-32">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Our expertise"
              title={<span id="expertise-title">Four verticals. One standard of delivery.</span>}
              lead="From national highways to complex structures and turnkey buildings, every vertical is backed by the same engineering rigour and site discipline."
            />
            <Reveal delay={120} className="shrink-0">
              <ButtonLink href="/expertise" variant="outline-dark">
                All expertise
              </ButtonLink>
            </Reveal>
          </div>
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {verticals.map((v, i) => (
              <Reveal as="li" key={v.slug} delay={i * 90}>
                <VerticalCard vertical={v} index={i} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Featured projects */}
      <section aria-labelledby="featured-title" className="py-24 sm:py-32">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Featured projects"
              title={<span id="featured-title">Infrastructure that connects people and places.</span>}
              lead="A look at the kinds of projects we deliver across highways, structures and buildings."
            />
            <Reveal delay={120} className="flex shrink-0 flex-wrap items-center gap-6">
              <ArrowLink href="/signature-projects">Signature projects</ArrowLink>
              <ButtonLink href="/projects" variant="outline-dark">
                View all projects
              </ButtonLink>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            {lead ? (
              <Reveal className="lg:col-span-7 lg:row-span-2">
                <ProjectCard project={lead} variant="overlay" className="h-full min-h-[28rem] lg:min-h-[38rem]" sizes="(min-width: 1024px) 58vw, 100vw" />
              </Reveal>
            ) : null}
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={(i + 1) * 110} className="lg:col-span-5">
                <ProjectCard project={p} variant="overlay" className="h-full min-h-[22rem] lg:min-h-[18.5rem]" sizes="(min-width: 1024px) 42vw, 100vw" />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Raghav Buildcon — engineering, safety & quality, sustainability */}
      <section aria-labelledby="why-title" className="relative isolate overflow-hidden bg-ink-900 py-24 text-white sm:py-28">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint" />
        <Container>
          <SectionHeading
            tone="light"
            eyebrow="Why Raghav Buildcon"
            title={<span id="why-title">Engineered, safe and responsible — on every project.</span>}
          />
          <ul className="mt-14 grid gap-5 lg:grid-cols-3">
            {commitments.map((c, i) => (
              <Reveal as="li" key={c.title} delay={i * 90} className="group relative flex flex-col overflow-hidden rounded-sm border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-gold-400/40">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={c.image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover opacity-90 transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]" />
                  <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-900 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <span className="flex size-12 items-center justify-center rounded-sm bg-gold-500 text-ink-950">
                    <Icon name={c.icon} className="size-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold">
                    <Link href={c.href} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-gold-400">
                      {c.title}
                    </Link>
                  </h3>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-300">{c.text}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-gold-300">
                    Learn more
                    <Icon name="arrow-right" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Latest updates */}
      <section aria-labelledby="news-title" className="bg-sand-50 py-24 sm:py-32">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="Latest updates" title={<span id="news-title">News from our sites and teams.</span>} />
            <Reveal delay={120} className="shrink-0">
              <ButtonLink href="/news" variant="outline-dark">
                All news
              </ButtonLink>
            </Reveal>
          </div>
          <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {news.slice(0, 3).map((post, i) => (
              <Reveal as="li" key={post.slug} delay={i * 90}>
                <NewsCard post={post} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
