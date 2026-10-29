import Image from "next/image";
import { AssemblyFrame } from "@/components/motion/assembly/AssemblyFrame";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeatureGrid, type Feature } from "@/components/sections/FeatureGrid";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PlaceholderNote } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { photos } from "@/content/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sustainability & ESG",
  description: "How Raghav Buildcon approaches environment, social responsibility and governance across its infrastructure projects.",
  path: "/sustainability",
});

const pillars: { icon: IconName; label: string; title: string; points: string[] }[] = [
  {
    icon: "leaf",
    label: "Environment",
    title: "Lighter footprint on every site",
    points: ["Efficient use of materials and reduced waste", "Dust, noise and run-off control", "Tree protection and compensatory plantation", "Fuel-efficient equipment and logistics"],
  },
  {
    icon: "users",
    label: "Social",
    title: "People and communities first",
    points: ["Worker welfare, accommodation and health", "Safe access for communities around works", "Local employment and skills development", "Respectful engagement with affected residents"],
  },
  {
    icon: "scale",
    label: "Governance",
    title: "Integrity in how we operate",
    points: ["Ethical procurement and fair vendor practices", "Statutory and environmental compliance", "Clear accountability on every project", "Transparent reporting to clients"],
  },
];

const practices: Feature[] = [
  { icon: "droplet", title: "Water management", description: "Planning for water reuse, curing efficiency and drainage that protects nearby land." },
  { icon: "recycle", title: "Material reuse", description: "Reusing excavated material and reclaimed asphalt wherever specifications allow." },
  { icon: "sun", title: "Cleaner energy", description: "Considering solar power and efficient lighting for site offices and camps." },
  { icon: "pulse", title: "Health on site", description: "Clean drinking water, sanitation and regular health check-ups for workers." },
];

const metrics = ["Trees planted", "Water reused", "Material recycled", "Community programmes"];

export default function SustainabilityPage() {
  return (
    <>
      <PageHero
        image={photos.solar.src}
        scene="warehouse"
        breadcrumbs={[{ name: "Sustainability & ESG", path: "/sustainability" }]}
        eyebrow="Sustainability & ESG"
        title="Building responsibly for the communities we connect."
        lead="Infrastructure lasts for generations. We aim to build it in a way that respects the environment, supports people and stands up to scrutiny."
      />

      <section className="py-24 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Our ESG framework" title="Three pillars guide how we build." />
          <ul className="mt-14 grid gap-6 lg:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal as="li" key={p.label} delay={i * 90} className="flex flex-col rounded-sm border border-ink-100 bg-white p-8">
                <span className="flex size-12 items-center justify-center rounded-sm bg-leaf-600 text-white">
                  <Icon name={p.icon} className="size-6" />
                </span>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-leaf-600">{p.label}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-ink-950">{p.title}</h3>
                <ul className="mt-6 space-y-3 border-t border-ink-100 pt-6">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3 text-ink-700">
                      <Icon name="check" className="mt-0.5 size-4.5 shrink-0 text-leaf-600" strokeWidth={2.2} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-leaf-50 py-24 sm:py-28">
        <Container className="grid items-center gap-14 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <Reveal data-clip="" className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image src={photos.hillRoad.src} alt={photos.hillRoad.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </Reveal>
            <AssemblyFrame
              model="warehouse"
              label="Illustrative 3D model: an industrial building with rooftop solar and rainwater storage being built"
              backdrop="#ffffff"
              className="aspect-[4/3]"
            />
          </div>
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="On our sites" title="Responsible practice, built into daily work." />
            <div className="mt-10">
              <FeatureGrid features={practices} columns={2} />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Measuring progress" title="ESG performance" lead="We will report verified sustainability metrics here as they are measured." />
          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-ink-100 bg-ink-100 lg:grid-cols-4">
            {metrics.map((m) => (
              <div key={m} className="bg-white p-7">
                <dt className="text-sm font-semibold text-ink-500">{m}</dt>
                <dd className="mt-3 font-display text-4xl font-semibold text-ink-300">—</dd>
              </div>
            ))}
          </dl>
          <PlaceholderNote className="mt-6">ESG metrics will be published once they have been verified.</PlaceholderNote>
        </Container>
      </section>

      <CtaBand eyebrow="Work with us" title="Let’s build infrastructure that lasts — responsibly." />
    </>
  );
}
