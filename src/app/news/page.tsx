import { NewsShowcase } from "@/components/sections/NewsShowcase";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Pending, PlaceholderNote } from "@/components/ui/Placeholder";
import { contact } from "@/content/company";
import { photos } from "@/content/images";
import { news } from "@/content/news";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "News & Updates",
  description: "Project milestones, safety updates and company news from Raghav Buildcon.",
  path: "/news",
});

export default function NewsPage() {
  const posts = [...news].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  return (
    <>
      <PageHero
        image={photos.metro.src}
        scene="township"
        breadcrumbs={[{ name: "News", path: "/news" }]}
        eyebrow="News & updates"
        title="News from our sites and teams."
        lead="Project milestones, safety initiatives and company announcements."
      />

      <section className="py-20 sm:py-24">
        <Container>
          {news.some((n) => n.sample) ? (
            <PlaceholderNote className="mb-12">Updates marked Sample content show how news will appear. They will be replaced with real announcements.</PlaceholderNote>
          ) : null}
          <NewsShowcase posts={posts} />

          <div className="mt-20 flex flex-col gap-4 rounded-sm bg-ink-950 p-8 text-white sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Icon name="mail" className="size-8 text-gold-400" />
              <div>
                <p className="font-display text-xl font-semibold">Media enquiries</p>
                <p className="text-sm text-ink-300">For press and media requests, contact our communications team.</p>
              </div>
            </div>
            {contact.mediaEmail ? (
              <a href={`mailto:${contact.mediaEmail}`} className="font-semibold text-gold-300 hover:text-gold-200">
                {contact.mediaEmail}
              </a>
            ) : (
              <Pending tone="light">Media email to be updated</Pending>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
