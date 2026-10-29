import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { deliveryProcess } from "@/content/verticals";

export type Commitment = {
  emblem: "engineering" | "safety" | "sustainability";
  title: string;
  text: string;
  href: string;
  image: string;
};

/** Line drawings that draw themselves as the cards come into view (24 × 24 grid). */
const EMBLEMS: Record<Commitment["emblem"], string[]> = {
  // A drafting compass over a dimension line.
  engineering: ["M12 2.5v2.2", "M12 6.2 6.4 20.5", "M12 6.2l5.6 14.3", "M7.6 17a6.2 6.2 0 0 0 8.8 0", "M3 22.5h18", "M3 21.5v2", "M21 21.5v2"],
  // A shield with a check: safe sites, verified quality.
  safety: ["M12 2.8 19 5.7v5.2c0 4.6-3 8.4-7 10.3-4-1.9-7-5.7-7-10.3V5.7Z", "M8.6 12.1l2.4 2.4 4.6-4.9"],
  // A leaf and its vein over the ground line.
  sustainability: ["M5.5 18.5C5.5 10 11 4 20 4c0 9-6 14.5-14.5 14.5Z", "M5.5 18.5 14 10", "M3 21.5h18"],
};

function Emblem({ kind }: { kind: Commitment["emblem"] }) {
  return (
    <svg data-draw="top 55%" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" className="size-14 text-gold-400">
      {EMBLEMS[kind].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/**
 * "Why Raghav Buildcon": a bridge elevation draws itself across the background, each commitment
 * card — its photograph behind the text — assembles into place with its own line-drawn emblem (and
 * tilts towards the mouse), and the delivery lifecycle lights up stage by stage beneath them.
 */
export function WhyCommitments({ commitments }: { commitments: readonly Commitment[] }) {
  return (
    <section aria-labelledby="why-title" className="relative isolate overflow-hidden bg-ink-900 py-14 text-white sm:py-16">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint" />
      <svg
        data-draw="bottom 60%"
        aria-hidden="true"
        viewBox="0 0 1200 260"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        className="pointer-events-none absolute inset-x-0 top-4 -z-10 w-full text-gold-400/25"
      >
        {/* Deck, arch, hangers, piers and a dimension line: an engineering elevation. */}
        <path d="M40 150H1160" />
        <path d="M40 162H1160" />
        <path d="M300 150C420 40 780 40 900 150" />
        {[360, 420, 480, 540, 600, 660, 720, 780, 840].map((x) => (
          <path key={x} d={`M${x} ${150 - Math.round(82 * (1 - ((x - 600) / 300) ** 2))}V150`} />
        ))}
        {[180, 300, 900, 1020].map((x) => (
          <path key={x} d={`M${x - 10} 162V236H${x + 10}V162`} />
        ))}
        <path d="M40 250H1160" />
        <path d="M40 242v16M1160 242v16M300 242v16M900 242v16" />
      </svg>

      <Container>
        <SectionHeading tone="light" eyebrow="Why Raghav Buildcon" title={<span id="why-title">Engineered, safe and responsible — on every project.</span>} />
        <ul data-assemble="" className="mt-8 grid gap-4 md:grid-cols-3">
          {commitments.map((c) => (
            <li key={c.title} data-assemble-item="">
              <div
                data-hover-tilt=""
                className="group relative flex aspect-[4/3] min-h-[15.5rem] flex-col justify-end overflow-hidden rounded-sm border border-white/10 transition-colors duration-500 hover:border-gold-400/40 md:aspect-[3/4] lg:aspect-[16/9]"
              >
                <Image src={c.image} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover opacity-80 transition-[scale] duration-[1400ms] ease-out group-hover:scale-[1.05]" />
                <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/70 to-ink-950/15" />
                <div className="absolute top-5 left-5">
                  <Emblem kind={c.emblem} />
                </div>
                <div className="relative p-5 pt-[4.5rem] sm:p-6 sm:pt-[4.5rem]">
                  <h3 className="font-display text-xl font-semibold">
                    <Link href={c.href} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-gold-400">
                      {c.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-200">{c.text}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-300">
                    Learn more
                    <Icon name="arrow-right" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 sm:mt-9">
          <p className="text-xs font-bold tracking-[0.2em] text-gold-400 uppercase">Reliable from first survey to final handover</p>
          <ol data-fill-sequence="" className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
            {deliveryProcess.map((step, i) => (
              <li key={step.title} className="relative pt-3.5">
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-white/15" />
                <span aria-hidden="true" data-fill="" className="absolute inset-x-0 -top-px h-0.5 bg-gold-400" />
                <span className="font-display text-xs font-semibold tracking-[0.18em] text-gold-400">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-1 font-display text-[0.95rem] font-semibold">{step.title}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
