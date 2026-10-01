import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { breadcrumbJsonLd } from "@/lib/seo";
import { cn } from "@/lib/site";

export type Crumb = { name: string; path: string };

type PageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  image: string;
  /** Trail after "Home". The last crumb is the current page. */
  breadcrumbs?: Crumb[];
  children?: ReactNode;
  size?: "md" | "lg";
  imagePosition?: string;
};

export function PageHero({ eyebrow, title, lead, image, breadcrumbs, children, size = "md", imagePosition = "center" }: PageHeroProps) {
  const trail: Crumb[] = breadcrumbs ? [{ name: "Home", path: "/" }, ...breadcrumbs] : [];
  return (
    <section className="relative isolate overflow-hidden bg-ink-950 text-white">
      <Image
        src={image}
        alt=""
        fill
        preload
        sizes="100vw"
        className="-z-30 animate-fade-in object-cover opacity-70"
        style={{ objectPosition: imagePosition }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-linear-to-r from-ink-950 via-ink-950/85 to-ink-950/25" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-linear-to-t from-ink-950 via-ink-950/10 to-ink-950/60" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint [mask-image:linear-gradient(to_right,black,transparent_70%)]" />

      <Container className={cn("relative", size === "lg" ? "pt-40 pb-24 md:pt-52 md:pb-32" : "pt-36 pb-16 md:pt-44 md:pb-24")}>
        {trail.length > 0 ? (
          <>
            <nav aria-label="Breadcrumb" className="animate-fade-up">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-300">
                {trail.map((crumb, i) => {
                  const last = i === trail.length - 1;
                  return (
                    <li key={crumb.path} className="flex items-center gap-2">
                      {last ? (
                        <span aria-current="page" className="text-ink-100">
                          {crumb.name}
                        </span>
                      ) : (
                        <>
                          <Link href={crumb.path} className="transition-colors hover:text-gold-300">
                            {crumb.name}
                          </Link>
                          <Icon name="chevron-down" className="size-3.5 -rotate-90 text-ink-500" />
                        </>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(trail)) }} />
          </>
        ) : null}

        <div className="mt-10 max-w-4xl">
          {eyebrow ? (
            <div className="animate-fade-up [animation-delay:80ms]">
              <Eyebrow tone="light">{eyebrow}</Eyebrow>
            </div>
          ) : null}
          <h1 className="mt-5 animate-fade-up text-[2.5rem] leading-[1.04] font-semibold [animation-delay:160ms] sm:text-5xl lg:text-[4.1rem]">{title}</h1>
          {lead ? <p className="mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-ink-200 [animation-delay:240ms] sm:text-xl">{lead}</p> : null}
          {children ? <div className="mt-9 animate-fade-up [animation-delay:320ms]">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
