import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { IntroStory } from "@/components/sections/IntroStory";
import { NewsShowcase } from "@/components/sections/NewsShowcase";
import { StatsBand } from "@/components/sections/StatsBand";
import { WhyCommitments, type Commitment } from "@/components/sections/WhyCommitments";
import { AssemblyFrame } from "@/components/motion/assembly/AssemblyFrame";
import { AssemblyStory } from "@/components/motion/assembly/AssemblyStory";
import { HeroScene } from "@/components/motion/assembly/HeroScene";
import { VerticalsShowcase } from "@/components/motion/assembly/VerticalsShowcase";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { showcase } from "@/content/assembly";
import { stats } from "@/content/company";
import { news } from "@/content/news";
import { getProject } from "@/content/projects";
import { verticals } from "@/content/verticals";
import { photos } from "@/content/images";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const commitments: Commitment[] = [
  {
    emblem: "engineering",
    title: "Engineering-led delivery",
    text: "Surveys, design reviews and integrated programmes ground every decision — and keep schedules accountable.",
    href: "/expertise",
    image: photos.engineers.src,
  },
  {
    emblem: "safety",
    title: "Safety & quality",
    text: "Planned safety controls on every site, and inspection and test plans that verify every structure we build.",
    href: "/safety-quality",
    image: photos.safety.src,
  },
  {
    emblem: "sustainability",
    title: "Sustainability & ESG",
    text: "Responsible construction that respects the environment, supports communities and stands up to scrutiny.",
    href: "/sustainability",
    image: photos.solar.src,
  },
];

export default function HomePage() {
  const featured = ["major-river-bridge", "four-lane-highway-corridor", "institutional-campus"].map((slug) => getProject(slug)!);
  const [lead, ...rest] = featured;

  return (
    <>
      {/* Hero */}
      <section data-hero="" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink-950 text-white">
        <Image
          src={photos.hero.src}
          alt=""
          fill
          preload
          fetchPriority="high"
          sizes="100vw"
          data-hero-media=""
          className="-z-30 animate-fade-in object-cover object-[62%_center]"
        />
        <HeroScene />
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-linear-to-r from-ink-950/95 via-ink-950/65 to-ink-950/0" />
        <div aria-hidden="true" className="absolute inset-0 -z-20 bg-linear-to-t from-ink-950 via-ink-950/0 to-ink-950/50" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint [mask-image:linear-gradient(to_right,black,transparent_60%)]" />

        <Container data-hero-content="" className="flex flex-1 flex-col justify-center pt-32 pb-16 lg:pt-40 lg:pb-24">
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

      {/* A bridge assembling itself, stage by stage */}
      <AssemblyStory
        model="bridge"
        id="build-story"
        eyebrow="From the ground up"
        title="Watch a bridge come together."
        lead="Foundations, piers, girders and deck: the stages of a bridge build, assembled one by one."
        length={2.4}
      />

      {/* Introduction, told in layers */}
      <IntroStory />

      <StatsBand stats={stats} />

      {/* The four verticals, presented on one 3D site */}
      <VerticalsShowcase verticals={verticals} />

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
          <AssemblyFrame
            model="network"
            label="Illustrative 3D model: a road and a bridge being built to connect a town of homes with a tower across a river"
            backdrop="#0b1220"
            tone="dark"
            ghosts="desktop"
            start="top 85%"
            end="bottom 70%"
            className="mt-14 aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]"
          />
          <div data-tilt="" className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-12">
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

      {/* What we build: three structures assembling themselves */}
      <section aria-labelledby="build-title" className="bg-sand-50 py-24 sm:py-32">
        <Container>
          <SectionHeading
            eyebrow="What we build"
            title={<span id="build-title">Homes, buildings and structures, piece by piece.</span>}
            lead="Watch each one come together, from the first peg in the ground to handover."
          />
          <ul className="mt-14 grid gap-12 md:grid-cols-3 md:gap-6">
            {showcase.map((item) => (
              <li key={item.model} className="flex flex-col">
                <AssemblyFrame
                  model={item.model}
                  label={`Illustrative 3D model: ${item.title.toLowerCase()} being built`}
                  backdrop="#f3efe7"
                  className="aspect-[4/5] md:aspect-[3/4]"
                />
                <h3 className="mt-6 font-display text-xl font-semibold text-ink-950">{item.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-500">{item.text}</p>
                <ArrowLink href={item.href} className="mt-4">
                  {item.link}
                </ArrowLink>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Why Raghav Buildcon — engineering, safety & quality, sustainability, reliability */}
      <WhyCommitments commitments={commitments} />

      {/* Latest updates */}
      <section aria-labelledby="news-title" className="bg-sand-50 py-12 sm:py-14">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading eyebrow="Latest updates" title={<span id="news-title">News from our sites and teams.</span>} />
            <Reveal delay={120} className="shrink-0">
              <ButtonLink href="/news" variant="outline-dark">
                All news
              </ButtonLink>
            </Reveal>
          </div>
          <div className="mt-6">
            <NewsShowcase posts={news.slice(0, 3)} />
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
