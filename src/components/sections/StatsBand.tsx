import { Counter } from "@/components/motion/Counter";
import { Container } from "@/components/ui/Container";
import { PlaceholderNote } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import type { Stat } from "@/content/types";

/** Key figures. Stats without a verified value show a placeholder instead of a number. */
export function StatsBand({ stats, title = "Raghav Buildcon at a glance" }: { stats: Stat[]; title?: string }) {
  const hasPending = stats.some((s) => s.value === null && !s.text);
  return (
    <section aria-labelledby="stats-title" className="relative isolate overflow-hidden bg-ink-900 py-16 text-white sm:py-20">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint" />
      <Container>
        <h2 id="stats-title" className="sr-only">
          {title}
        </h2>
        <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 90} className="relative flex flex-col px-4 sm:px-8 lg:border-l lg:border-white/10 lg:first:border-l-0 lg:first:pl-0">
              <dt className="order-2 mt-3 text-sm font-medium tracking-wide text-ink-300">{stat.label}</dt>
              <dd className="font-display text-5xl leading-none font-semibold text-white sm:text-6xl">
                {stat.text ? (
                  <span className="tabular-nums">{stat.text}</span>
                ) : stat.value !== null ? (
                  <Counter value={stat.value} suffix={stat.suffix} />
                ) : (
                  <span className="inline-flex items-baseline gap-3">
                    <span aria-hidden="true" className="text-gold-400/70">
                      —
                    </span>
                    <span className="font-sans text-xs font-medium tracking-normal text-ink-400 italic">Figure to be published</span>
                  </span>
                )}
              </dd>
            </Reveal>
          ))}
        </dl>
        {hasPending ? (
          <PlaceholderNote tone="light" className="mt-12">
            Headline figures will be published here once they have been verified.
          </PlaceholderNote>
        ) : null}
      </Container>
    </section>
  );
}
