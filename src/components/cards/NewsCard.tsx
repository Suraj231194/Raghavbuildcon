import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Pending, SampleBadge } from "@/components/ui/Placeholder";
import type { NewsPost } from "@/content/types";
import { cn, formatDate } from "@/lib/site";

export function NewsCard({ post, className }: { post: NewsPost; className?: string }) {
  return (
    <article className={cn("group relative flex h-full flex-col", className)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-ink-100">
        <Image src={post.image.src} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]" />
        {post.sample ? <SampleBadge tone="light" className="absolute top-4 left-4" /> : null}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        <span className="font-bold uppercase tracking-[0.14em] text-gold-700 text-[0.72rem]">{post.category}</span>
        <span aria-hidden="true" className="h-3.5 w-px bg-ink-200" />
        {post.date ? (
          <time dateTime={post.date} className="text-ink-500">
            {formatDate(post.date)}
          </time>
        ) : (
          <Pending>Date to be updated</Pending>
        )}
      </div>
      <h3 className="mt-3 font-display text-xl leading-snug font-semibold text-ink-950 transition-colors group-hover:text-gold-700">
        <Link href={`/news/${post.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-gold-500">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-500">{post.excerpt}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink-900">
        Read update
        <Icon name="arrow-right" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </article>
  );
}
