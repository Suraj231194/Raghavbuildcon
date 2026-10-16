import Image from "next/image";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { proprietor } from "@/content/company";
import { photos } from "@/content/images";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About the Proprietor",
  description: "Meet Mr. Sagar Wale, proprietor of Raghav Buildcon and a Civil Engineering professional with over 8 years of construction industry experience.",
  path: "/about/proprietor",
});

export default function ProprietorPage() {
  return (
    <>
      <PageHero
        image={photos.engineers.src}
        breadcrumbs={[{ name: "About", path: "/about" }, { name: "About the Proprietor", path: "/about/proprietor" }]}
        eyebrow="Leadership"
        title="About the Proprietor"
      />

      <section className="bg-sand-50 py-24 sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="mx-auto w-full max-w-md lg:col-span-5">
            <figure className="overflow-hidden rounded-sm border border-ink-100 bg-white shadow-xl shadow-ink-950/5">
              <Image
                src={proprietor.image.src}
                alt={proprietor.image.alt}
                width={1145}
                height={1374}
                sizes="(min-width: 1024px) 40vw, (min-width: 640px) 448px, 100vw"
                className="h-auto w-full"
              />
              <figcaption className="border-t-2 border-gold-500 px-6 py-5">
                <p className="font-display text-xl font-semibold text-ink-950">{proprietor.name}</p>
                <p className="mt-1 text-sm font-semibold text-gold-700">Proprietor, Raghav Buildcon</p>
              </figcaption>
            </figure>
          </Reveal>

          <div className="lg:col-span-7">
            <SectionHeading eyebrow="Our proprietor" title={proprietor.name} />
            <Reveal delay={100} className="mt-6 space-y-5 text-lg leading-relaxed text-ink-600">
              {proprietor.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </Reveal>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
