import Image from "next/image";
import { CredentialSlots } from "@/components/sections/Credibility";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeatureGrid, type Feature } from "@/components/sections/FeatureGrid";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { PlaceholderNote } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { photos } from "@/content/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Safety & Quality",
  description: "Raghav Buildcon’s approach to health, safety and environment (HSE) and to quality assurance and control on every project.",
  path: "/safety-quality",
});

const safety: Feature[] = [
  { icon: "helmet", title: "Planned, not improvised", description: "Site-specific safety plans, method statements and risk assessments before work begins." },
  { icon: "users", title: "Trained people", description: "Induction for everyone on site, daily toolbox talks and task-specific training." },
  { icon: "shield", title: "Controls that work", description: "Permits-to-work, PPE compliance, barricading and traffic management on live roads." },
  { icon: "eye", title: "Stop-work authority", description: "Anyone can stop unsafe work — and is expected to, without fear of consequence." },
];

const qa = [
  { title: "Quality plan", description: "A project quality plan sets standards, responsibilities and records from day one." },
  { title: "Material approval", description: "Sources and materials are approved and tested before they reach the works." },
  { title: "Inspection & test plans", description: "Every activity has defined checks, tolerances and hold points." },
  { title: "Testing", description: "Field and laboratory tests with calibrated equipment and traceable results." },
  { title: "Non-conformance control", description: "Issues are recorded, corrected and analysed so they are not repeated." },
  { title: "Handover records", description: "Complete documentation and as-built records for the asset owner." },
];

export default function SafetyQualityPage() {
  return (
    <>
      <PageHero
        image={photos.safety.src}
        scene="tower"
        breadcrumbs={[{ name: "Safety & Quality", path: "/safety-quality" }]}
        eyebrow="Safety & quality"
        title="Zero harm is the standard. Quality is the proof."
        lead="Everyone on our sites goes home safe, and every structure we hand over is built exactly as designed."
      />

      <section className="py-24 sm:py-28">
        <Container>
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionHeading eyebrow="Health, safety & environment" title="Safety is planned into every task." />
            </div>
            <Reveal delay={100} className="flex items-start gap-4 rounded-sm bg-ink-950 p-6 text-white lg:col-span-5">
              <Icon name="helmet" className="size-8 shrink-0 text-gold-400" />
              <p className="leading-relaxed text-ink-200">No schedule pressure or cost saving is ever worth an injury. That principle comes before every other target on our sites.</p>
            </Reveal>
          </div>
          <div className="mt-14">
            <FeatureGrid features={safety} columns={4} />
          </div>
        </Container>
      </section>

      <section className="relative isolate overflow-hidden bg-ink-900 py-24 text-white sm:py-28">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint" />
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionHeading tone="light" eyebrow="Quality assurance & control" title="Built to specification — and proven." lead="Our QA/QC system checks every critical stage, so quality is demonstrated, not assumed." />
            </div>
            <Reveal delay={100} data-clip="" className="relative aspect-[16/10] overflow-hidden rounded-sm lg:col-span-6">
              <Image src={photos.engineers.src} alt={photos.engineers.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </Reveal>
          </div>
          <div className="mt-14">
            <ProcessSteps steps={qa} tone="light" />
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Certifications & performance" title="Credentials and safety performance" />
          <div className="mt-12">
            <CredentialSlots />
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-ink-100 bg-ink-100 lg:grid-cols-4">
            {["Safe man-hours", "Lost-time injury rate", "Safety trainings held", "Audits completed"].map((m) => (
              <div key={m} className="bg-white p-7">
                <dt className="text-sm font-semibold text-ink-500">{m}</dt>
                <dd className="mt-3 font-display text-4xl font-semibold text-ink-300">—</dd>
              </div>
            ))}
          </dl>
          <PlaceholderNote className="mt-6">Certifications and safety statistics will be published once they have been verified.</PlaceholderNote>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
