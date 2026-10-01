import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { OrPending, SampleBadge } from "@/components/ui/Placeholder";
import type { Project } from "@/content/types";
import { verticalMap } from "@/content/verticals";
import { cn } from "@/lib/site";

type ProjectCardProps = {
  project: Project;
  /** `overlay` sets the text over the image (feature layouts); `standard` stacks it below. */
  variant?: "standard" | "overlay";
  sizes?: string;
  className?: string;
  headingLevel?: "h2" | "h3";
};

export function ProjectCard({ project, variant = "standard", sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw", className, headingLevel: H = "h3" }: ProjectCardProps) {
  const vertical = verticalMap[project.vertical];
  const href = `/projects/${project.slug}`;

  if (variant === "overlay") {
    return (
      <article className={cn("group relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-sm bg-ink-950 text-white", className)}>
        <Image src={project.image.src} alt={project.image.alt} fill sizes={sizes} className="-z-20 object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.045]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-ink-950 via-ink-950/55 to-transparent" />
        <div className="absolute top-5 left-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-ink-950/70 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-gold-300 backdrop-blur">{vertical.title}</span>
          {project.sample ? <SampleBadge tone="light" /> : null}
        </div>
        <div className="p-6 sm:p-8">
          <H className="max-w-lg font-display text-2xl leading-tight font-semibold sm:text-[1.7rem]">
            <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-gold-400">
              {project.title}
            </Link>
          </H>
          <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-200">{project.summary}</p>
          <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/15 pt-5 text-sm text-ink-300">
            <span className="inline-flex items-center gap-2">
              <Icon name="map-pin" className="size-4 text-gold-400" />
              <OrPending value={project.facts.location} tone="light" label="Location to be updated" />
            </span>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/25 transition-colors duration-300 group-hover:border-gold-400 group-hover:bg-gold-500 group-hover:text-ink-950">
              <Icon name="arrow-up-right" className="size-4.5" />
            </span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={cn("group relative flex h-full flex-col overflow-hidden rounded-sm border border-ink-100 bg-white transition-[box-shadow,border-color,transform] duration-500 hover:-translate-y-1 hover:border-ink-200 hover:shadow-[0_24px_60px_-28px_rgb(11_18_32/0.35)]", className)}>
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
        <Image src={project.image.src} alt={project.image.alt} fill sizes={sizes} className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]" />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-ink-950/80 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-gold-300 backdrop-blur">{vertical.title}</span>
          {project.sample ? <SampleBadge tone="light" /> : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <H className="font-display text-xl leading-snug font-semibold text-ink-950">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-gold-500">
            {project.title}
          </Link>
        </H>
        <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-500">{project.summary}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6 text-sm text-ink-500">
          <span className="inline-flex items-center gap-2">
            <Icon name="map-pin" className="size-4 text-gold-600" />
            <OrPending value={project.facts.location} label="Location to be updated" />
          </span>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-700 transition-colors duration-300 group-hover:border-gold-500 group-hover:bg-gold-500 group-hover:text-ink-950">
            <Icon name="arrow-up-right" className="size-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
