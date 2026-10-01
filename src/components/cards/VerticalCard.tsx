import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Vertical } from "@/content/types";
import { cn } from "@/lib/site";

export function VerticalCard({ vertical, index, className }: { vertical: Vertical; index?: number; className?: string }) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-sm border border-ink-100 bg-white transition-[box-shadow,border-color,transform] duration-500 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-[0_24px_60px_-28px_rgb(11_18_32/0.35)]",
        className,
      )}
    >
      <div className="relative">
        <div className="relative aspect-[16/11] overflow-hidden bg-ink-100">
          <Image
            src={vertical.image.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-950/40 to-transparent" />
          {index !== undefined ? (
            <span className="absolute top-4 right-4 font-display text-sm font-semibold tracking-[0.1em] text-white/90">{String(index + 1).padStart(2, "0")}</span>
          ) : null}
        </div>
        <span className="absolute -bottom-7 left-6 flex size-14 items-center justify-center rounded-sm bg-ink-950 text-gold-400 shadow-lg transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-ink-950">
          <Icon name={vertical.icon} className="size-6.5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col px-6 pt-11 pb-6">
        <h3 className="font-display text-xl font-semibold text-ink-950">
          <Link href={`/expertise/${vertical.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-gold-500">
            {vertical.title}
          </Link>
        </h3>
        <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-500">{vertical.summary}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-ink-900 transition-colors group-hover:text-gold-700">
          Explore
          <Icon name="arrow-right" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
