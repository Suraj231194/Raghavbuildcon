import Image from "next/image";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { FeatureGrid, type Feature } from "@/components/sections/FeatureGrid";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Pending } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contact } from "@/content/company";
import { photos } from "@/content/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Careers",
  description: "Build a career building India’s infrastructure. Explore disciplines and register your interest with Raghav Buildcon.",
  path: "/careers",
});

const reasons: Feature[] = [
  { icon: "crane", title: "Work that matters", description: "Build roads, bridges and buildings that people use every day." },
  { icon: "users", title: "Learn on real sites", description: "Grow alongside experienced engineers and site leaders." },
  { icon: "helmet", title: "Safety comes first", description: "A workplace where everyone is expected to stop unsafe work." },
  { icon: "spark", title: "Room to grow", description: "Take on responsibility early and build a long-term career." },
];

const disciplines = [
  "Site & project engineering",
  "Planning & scheduling",
  "Quality assurance / control",
  "Health, safety & environment",
  "Design coordination",
  "Survey",
  "Procurement & stores",
  "Plant & machinery",
  "Finance & accounts",
  "Human resources & admin",
];

/** Current openings. Add roles here — an empty list shows the "no openings" message. */
const openings: { title: string; location: string; type: string }[] = [];

export default function CareersPage() {
  return (
    <>
      <PageHero
        image={photos.team.src}
        scene="house"
        breadcrumbs={[{ name: "Careers", path: "/careers" }]}
        eyebrow="Careers"
        title="Build a career building India’s infrastructure."
        lead="Join engineers, planners and site professionals who take pride in delivering safe, high-quality infrastructure."
      >
        <ButtonLink href="#apply" size="lg">
          Register your interest
        </ButtonLink>
      </PageHero>

      <section className="py-24 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Why join us" title="Why build with Raghav Buildcon." />
          <div className="mt-14">
            <FeatureGrid features={reasons} columns={4} />
          </div>
        </Container>
      </section>

      <section className="bg-sand-50 py-24 sm:py-28">
        <Container className="grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow="Disciplines" title="Where you could work." />
            <Reveal as="ul" delay={100} className="mt-10 grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
              {disciplines.map((d) => (
                <li key={d} className="flex items-center gap-3 font-medium text-ink-800">
                  <Icon name="check" className="size-4.5 shrink-0 text-gold-600" strokeWidth={2.2} />
                  {d}
                </li>
              ))}
            </Reveal>
          </div>
          <Reveal delay={120} data-clip="" className="relative aspect-[4/3] overflow-hidden rounded-sm lg:col-span-6">
            <Image src={photos.engineers.src} alt={photos.engineers.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </Reveal>
        </Container>
      </section>

      <section className="py-24 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Current openings" title="Open positions" />
          {openings.length > 0 ? (
            <ul className="mt-10 divide-y divide-ink-100 border-y border-ink-100">
              {openings.map((o) => (
                <li key={o.title} className="flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-display text-xl font-semibold text-ink-950">{o.title}</span>
                  <span className="text-sm text-ink-500">
                    {o.location} · {o.type}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <Reveal className="mt-10 flex flex-col items-start gap-4 rounded-sm border border-dashed border-ink-200 bg-sand-50 p-8 sm:flex-row sm:items-center">
              <Icon name="briefcase" className="size-10 shrink-0 text-ink-300" />
              <div>
                <p className="font-display text-xl font-semibold text-ink-900">No openings are listed right now</p>
                <p className="mt-1 text-ink-500">Register your interest below and we will be in touch when a suitable role opens.</p>
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      <section id="apply" className="scroll-mt-24 bg-sand-50 py-24 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Register your interest" title="Tell us about yourself." lead="Share your experience and the kind of role you are looking for." />
            <Reveal delay={100} className="mt-8 flex items-start gap-3 text-ink-600">
              <Icon name="mail" className="mt-0.5 size-5 shrink-0 text-gold-600" />
              <p>
                To send a CV, email{" "}
                {contact.careersEmail ? (
                  <a href={`mailto:${contact.careersEmail}`} className="font-semibold text-ink-950 underline decoration-gold-500 underline-offset-4">
                    {contact.careersEmail}
                  </a>
                ) : (
                  <Pending>careers email to be updated</Pending>
                )}
              </p>
            </Reveal>
          </div>
          <div className="rounded-sm bg-white p-6 shadow-[0_30px_80px_-50px_rgb(11_18_32/0.5)] sm:p-10 lg:col-span-7">
            <EnquiryForm
              defaultType="Careers"
              submitLabel="Submit"
              messageLabel="Your experience and interests"
              messagePlaceholder="Your current role, years of experience, discipline and preferred location."
            />
          </div>
        </Container>
      </section>
    </>
  );
}
