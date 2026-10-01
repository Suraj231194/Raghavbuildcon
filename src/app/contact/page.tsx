import Image from "next/image";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Pending } from "@/components/ui/Placeholder";
import { Reveal } from "@/components/ui/Reveal";
import { contact } from "@/content/company";
import { officeMap, photos } from "@/content/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Contact Raghav Buildcon about projects, tenders, partnerships, vendor registration, careers and media.",
  path: "/contact",
});

export default function ContactPage() {
  const details: { icon: IconName; label: string; content: React.ReactNode }[] = [
    { icon: "map-pin", label: contact.officeName, content: contact.address ?? <Pending>Address to be updated</Pending> },
    {
      icon: "phone",
      label: "Phone",
      content: contact.phone ? <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="hover:text-gold-700">{contact.phone}</a> : <Pending>Phone to be updated</Pending>,
    },
    {
      icon: "mail",
      label: "Email",
      content: contact.email ? <a href={`mailto:${contact.email}`} className="hover:text-gold-700">{contact.email}</a> : <Pending>Email to be updated</Pending>,
    },
    { icon: "clock", label: "Office hours", content: contact.hours ?? <Pending>Hours to be updated</Pending> },
  ];

  return (
    <>
      <PageHero
        image={photos.aerial.src}
        breadcrumbs={[{ name: "Contact", path: "/contact" }]}
        eyebrow="Contact us"
        title="Let’s talk about your project."
        lead="Projects and tenders, partnerships, vendor registration, careers or media — send us a message and the right team will respond."
      />

      <section className="py-20 sm:py-24">
        <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal as="ul" className="space-y-px overflow-hidden rounded-sm border border-ink-100 bg-ink-100">
              {details.map((d) => (
                <li key={d.label} className="flex items-start gap-4 bg-white p-6">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-ink-950 text-gold-400">
                    <Icon name={d.icon} className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400">{d.label}</p>
                    <p className="mt-1.5 font-semibold text-ink-950">{d.content}</p>
                  </div>
                </li>
              ))}
            </Reveal>
            <Reveal delay={120} className="relative mt-6 aspect-[16/11] overflow-hidden rounded-sm bg-sand-100">
              <Image src={officeMap.src} alt={officeMap.alt} fill sizes="(min-width: 1024px) 38vw, 100vw" className="object-cover" />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 rounded-sm bg-white/95 px-4 py-3 text-sm shadow-lg backdrop-blur">
                <span className="font-semibold text-ink-900">{contact.officeName}</span>
                {contact.mapUrl ? (
                  <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-gold-700 hover:text-gold-800">
                    Open in maps <Icon name="arrow-up-right" className="size-4" />
                  </a>
                ) : (
                  <Pending>Map link to be updated</Pending>
                )}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-sm border border-ink-100 bg-white p-6 shadow-[0_30px_80px_-50px_rgb(11_18_32/0.5)] sm:p-10">
              <h2 className="text-3xl font-semibold text-ink-950">Send an enquiry</h2>
              <p className="mt-3 mb-8 text-ink-500">Fields marked * are required.</p>
              <EnquiryForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
