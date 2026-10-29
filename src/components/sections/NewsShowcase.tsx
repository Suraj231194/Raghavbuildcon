import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Pending, SampleBadge } from "@/components/ui/Placeholder";
import type { NewsPost } from "@/content/types";
import { cn, formatDate } from "@/lib/site";

function Meta({ post, tone }: { post: NewsPost; tone: "dark" | "light" }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
      <span className={cn("text-[0.72rem] font-bold tracking-[0.14em] uppercase", tone === "light" ? "text-gold-300" : "text-gold-700")}>{post.category}</span>
      <span aria-hidden="true" className={cn("h-3.5 w-px", tone === "light" ? "bg-white/30" : "bg-ink-200")} />
      {post.date ? (
        <time dateTime={post.date} className={tone === "light" ? "text-ink-200" : "text-ink-500"}>
          {formatDate(post.date)}
        </time>
      ) : (
        <Pending tone={tone}>Date to be updated</Pending>
      )}
    </div>
  );
}

/**
 * News laid out as an editorial spread: the latest update as a large story whose photograph opens
 * as it scrolls in, the others as a list that assembles beside it, and a slow ticker of the
 * categories they cover. Sample posts keep their badge.
 */
export function NewsShowcase({ posts }: { posts: NewsPost[] }) {
  const [lead, ...rest] = posts;
  if (!lead) return null;
  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <div>
      <div aria-hidden="true" className="overflow-hidden border-y border-ink-100 py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee font-display text-lg font-semibold whitespace-nowrap text-ink-200 sm:text-xl">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-10 pr-10">
              {Array.from({ length: 4 }, () => categories)
                .flat()
                .map((c, i) => (
                  <span key={`${c}-${i}`} className="flex items-center gap-10">
                    {c}
                    <span className="size-2 rounded-full bg-gold-500" />
                  </span>
                ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-12 lg:gap-10">
        <article className="group relative lg:col-span-7">
          <div data-clip="" data-parallax="6" className="relative aspect-[16/10] overflow-hidden rounded-sm bg-ink-900 lg:aspect-[16/9]">
            <Image src={lead.image.src} alt="" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover opacity-90 transition-[scale] duration-[1400ms] ease-out group-hover:scale-[1.04]" />
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/40 to-transparent" />
            {lead.sample ? <SampleBadge tone="light" className="absolute top-5 left-5" /> : null}
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
              <Meta post={lead} tone="light" />
              <h3 className="mt-3 max-w-xl font-display text-xl leading-tight font-semibold sm:text-[1.8rem]">
                <Link href={`/news/${lead.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-gold-400">
                  {lead.title}
                </Link>
              </h3>
              <p className="mt-2 hidden max-w-lg leading-relaxed text-ink-200 sm:block">{lead.excerpt}</p>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gold-300">
                Read update
                <Icon name="arrow-right" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </article>

        {rest.length > 0 ? (
          <ul data-assemble="" className="flex flex-col divide-y divide-ink-100 border-t border-ink-100 lg:col-span-5 lg:border-t-0">
            {rest.map((post) => (
              <li key={post.slug} data-assemble-item="">
                <article className="group relative grid grid-cols-[6.5rem_1fr] gap-4 py-4 sm:grid-cols-[8.5rem_1fr] lg:first:pt-0">
                  <div data-clip="" className="relative aspect-square overflow-hidden rounded-sm bg-ink-100">
                    <Image src={post.image.src} alt="" fill sizes="10rem" className="object-cover transition-[scale] duration-[1400ms] ease-out group-hover:scale-[1.06]" />
                  </div>
                  <div className="min-w-0">
                    <Meta post={post} tone="dark" />
                    <h3 className="mt-1.5 font-display text-lg leading-snug font-semibold text-ink-950 transition-colors group-hover:text-gold-700">
                      <Link href={`/news/${post.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-gold-500">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-[0.92rem] leading-relaxed text-ink-500">{post.excerpt}</p>
                    {post.sample ? <SampleBadge className="mt-2" /> : null}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
