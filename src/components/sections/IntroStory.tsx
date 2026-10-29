import Image from "next/image";
import { ArrowLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { OrPending } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { company, proprietor } from "@/content/company";
import { photos } from "@/content/images";

/**
 * The home page's introduction, told in layers: a statement that brightens word by word as it is
 * read, with the company's own description beside it, a photograph that opens from a cropped window
 * while the shapes around it drift at different depths, and the company facts assembling beneath.
 */
export function IntroStory() {
  return (
    <section aria-labelledby="intro-title" className="relative isolate overflow-hidden py-14 sm:py-16">
      <p
        aria-hidden="true"
        data-depth="-0.7"
        className="pointer-events-none absolute top-4 left-0 -z-10 font-display text-[14vw] leading-none font-bold whitespace-nowrap text-transparent select-none [-webkit-text-stroke:1px_var(--color-ink-100)] lg:text-[11vw]"
      >
        Built on trust
      </p>

      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-8">
            <Reveal>
              <Eyebrow>Who we are</Eyebrow>
            </Reveal>
            <h2 id="intro-title" data-words="" className="mt-5 text-[2.1rem] leading-[1.03] font-semibold tracking-[-0.03em] text-ink-950 sm:text-5xl lg:text-[3.4rem]">
              An emerging civil infrastructure enterprise, built on trust.
            </h2>
          </div>
          <p data-words="" className="font-display text-lg leading-snug font-medium text-ink-800 sm:text-xl lg:col-span-4 lg:pb-1">
            {company.description}
          </p>
        </div>

        <div className="mt-10 grid items-center gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-16">
          <div className="relative lg:col-span-6">
            <div aria-hidden="true" data-depth="0.35" className="absolute -top-5 -left-5 h-2/3 w-2/3 bg-sand-100 sm:-top-8 sm:-left-8" />
            <div aria-hidden="true" data-depth="-0.3" className="absolute -right-4 -bottom-4 size-28 border-r-4 border-b-4 border-gold-500 sm:-right-6 sm:-bottom-6" />
            <div data-clip="" data-parallax="5" className="relative aspect-[16/11] overflow-hidden rounded-sm bg-ink-100">
              <Image src={photos.engineers.src} alt={photos.engineers.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div data-depth="0.25" className="absolute -bottom-8 left-6 flex max-w-xs items-center gap-4 rounded-sm bg-ink-950 p-5 text-white shadow-2xl sm:left-10">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-gold-500 text-ink-950">
                <Icon name="compass" className="size-6" data-draw="top 55%" />
              </span>
              <p className="text-sm leading-snug font-semibold">Engineering-led from survey to handover</p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={100}>
              <p className="leading-relaxed text-ink-500">{company.about[1]}</p>
            </Reveal>
            <dl data-assemble="" className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-sm bg-ink-100">
              {[
                { label: "Founded", value: company.founded },
                { label: "Headquarters", value: company.headquarters },
                { label: "Proprietor", value: proprietor.name },
              ].map((f) => (
                <div key={f.label} data-assemble-item="" className="bg-white p-3.5 sm:p-4">
                  <dt className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400">{f.label}</dt>
                  <dd className="mt-1.5 font-display text-[0.95rem] font-semibold text-ink-950 sm:text-lg">
                    <OrPending value={f.value} />
                  </dd>
                </div>
              ))}
            </dl>
            <ArrowLink href="/about" className="mt-6">
              More about Raghav Buildcon
            </ArrowLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
