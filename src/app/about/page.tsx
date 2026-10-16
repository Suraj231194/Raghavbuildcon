import Image from "next/image";
import { CredentialSlots, LeadershipGrid } from "@/components/sections/Credibility";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeatureGrid, type Feature } from "@/components/sections/FeatureGrid";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { OrPending, Pending } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company, milestones, proprietor } from "@/content/company";
import { photos } from "@/content/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Raghav Buildcon",
  description: "Who we are, what we stand for and the people who lead Raghav Buildcon — an Indian infrastructure and construction company.",
  path: "/about",
});

const values: Feature[] = [
  { icon: "shield", title: "Integrity", description: "We do what we say, report honestly and earn trust through the way we work." },
  { icon: "helmet", title: "Safety", description: "No schedule or cost saving is worth an injury. Everyone has the authority to stop unsafe work." },
  { icon: "clipboard", title: "Quality", description: "We build to specification, test what we build and document every critical stage." },
  { icon: "target", title: "Ownership", description: "Each project has accountable leaders who see it through from mobilisation to handover." },
  { icon: "users", title: "Collaboration", description: "We work openly with clients, consultants, authorities and communities." },
  { icon: "leaf", title: "Responsibility", description: "We aim to leave every site, and every community around it, better than we found it." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        image={photos.engineers.src}
        breadcrumbs={[{ name: "About", path: "/about" }]}
        eyebrow="About Raghav Buildcon"
        title={company.tagline}
        lead={company.description}
      />

      {/* Overview */}
      <section className="py-24 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="Who we are" title="An emerging civil infrastructure and construction enterprise." />
            <Reveal delay={100} className="mt-6 space-y-5 text-lg leading-relaxed text-ink-600">
              {company.about.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </Reveal>
            <Reveal delay={150} className="mt-10">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-700 [font-stretch:100%]">What we undertake</h3>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {company.works.map((w) => (
                  <li key={w} className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-ink-800">
                    <Icon name="check" className="size-4 text-gold-600" strokeWidth={2.2} />
                    {w}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={150} className="lg:col-span-5">
            <dl className="divide-y divide-ink-100 rounded-sm border border-ink-100 bg-sand-50">
              {[
                { label: "Company name", value: company.name },
                { label: "Proprietor", value: proprietor.name },
                { label: "Founded", value: company.founded },
                { label: "Headquarters", value: company.headquarters },
                { label: "Registration / CIN", value: company.registration },
                { label: "Operating regions", value: company.operatingRegions },
              ].map((f) => (
                <div key={f.label} className="flex items-center justify-between gap-6 px-6 py-4">
                  <dt className="text-sm font-semibold text-ink-500">{f.label}</dt>
                  <dd className="text-right font-semibold text-ink-950">
                    <OrPending value={f.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* Vision & mission */}
      <section className="relative isolate overflow-hidden bg-ink-950 py-24 text-white sm:py-28">
        <Image src={photos.bridges.src} alt="" fill sizes="100vw" className="-z-20 object-cover opacity-25" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-b from-ink-950/70 to-ink-950" />
        <Container className="grid gap-6 md:grid-cols-2">
          {[
            { icon: "eye" as const, label: "Our vision", text: "To be a trusted builder of India’s infrastructure — known for engineering quality, safe sites and projects delivered as promised." },
            { icon: "target" as const, label: "Our mission", text: "To plan, engineer and construct durable infrastructure with discipline and integrity, creating lasting value for clients, communities and our people." },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 100} className="rounded-sm border border-white/10 bg-ink-900/70 p-8 backdrop-blur sm:p-10">
              <Icon name={item.icon} className="size-8 text-gold-400" />
              <h2 className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-gold-400 [font-stretch:100%]">{item.label}</h2>
              <p className="mt-4 font-display text-2xl leading-snug font-medium sm:text-[1.7rem]">{item.text}</p>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Values */}
      <section className="bg-sand-50 py-24 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Our values" title="The principles behind every project." />
          <div className="mt-14">
            <FeatureGrid features={values} />
          </div>
        </Container>
      </section>

      {/* Journey */}
      <section className="py-24 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Our journey" title="Milestones" lead="Raghav Buildcon’s story is just beginning. New milestones will be added as projects are delivered." />
          </div>
          <ol className="relative space-y-10 border-l border-ink-200 pl-8 lg:col-span-7">
            {milestones.map((m, i) => (
              <Reveal as="li" key={m.title} delay={i * 80} className="relative">
                <span aria-hidden="true" className="absolute top-1.5 -left-[2.4rem] size-4 rounded-full border-4 border-white bg-gold-500 ring-1 ring-gold-500" />
                <p className="font-display text-sm font-semibold tracking-[0.14em] text-gold-700">{m.year ?? <Pending>Year to be confirmed</Pending>}</p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink-950">{m.title}</h3>
                <p className="mt-2 text-ink-500">{m.description ?? <Pending>Details to be added</Pending>}</p>
              </Reveal>
            ))}
            <li className="relative text-sm text-ink-400 italic">
              <span aria-hidden="true" className="absolute top-1 -left-[2.3rem] size-3.5 rounded-full border-2 border-dashed border-ink-300 bg-white" />
              Further milestones to be added.
            </li>
          </ol>
        </Container>
      </section>

      {/* Leadership & credentials */}
      <section id="leadership" className="scroll-mt-24 bg-sand-50 py-24 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Leadership" title="The people who lead Raghav Buildcon." />
          <div className="mt-14">
            <LeadershipGrid showBio />
          </div>
          <h2 className="mt-20 text-xs font-bold uppercase tracking-[0.2em] text-ink-400 [font-stretch:100%]">Registrations & certifications</h2>
          <div className="mt-5">
            <CredentialSlots />
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
