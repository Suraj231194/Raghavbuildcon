import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/cards/NewsCard";
import { PageHero } from "@/components/sections/PageHero";
import { ArrowLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Pending, PlaceholderNote, SampleBadge } from "@/components/ui/Placeholder";
import { getNewsPost, news } from "@/content/news";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getNewsPost((await params).slug);
  if (!post) return {};
  return pageMetadata({ title: post.title, description: post.excerpt, path: `/news/${post.slug}`, type: "article" });
}

export default async function NewsPostPage({ params }: Props) {
  const post = getNewsPost((await params).slug);
  if (!post) notFound();
  const more = news.filter((n) => n.slug !== post.slug).slice(0, 2);

  return (
    <>
      <PageHero
        image={post.image.src}
        breadcrumbs={[
          { name: "News", path: "/news" },
          { name: post.title, path: `/news/${post.slug}` },
        ]}
        eyebrow={post.category}
        title={post.title}
      >
        <div className="flex flex-wrap items-center gap-4 text-sm text-ink-300">
          {post.date ? <time dateTime={post.date}>{formatDate(post.date)}</time> : <Pending tone="light">Date to be updated</Pending>}
          {post.sample ? <SampleBadge tone="light" /> : null}
        </div>
      </PageHero>

      <article className="py-20 sm:py-24">
        <Container className="max-w-3xl!">
          {post.sample ? <PlaceholderNote className="mb-10">This is a sample update. It will be replaced with a real announcement.</PlaceholderNote> : null}
          <p className="font-display text-2xl leading-snug font-medium text-ink-950">{post.excerpt}</p>
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-sm bg-ink-100">
            <Image src={post.image.src} alt={post.image.alt} fill sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
          </div>
          <div className="mt-10 space-y-6 text-lg leading-relaxed text-ink-600">
            {post.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <ArrowLink href="/news" className="mt-12">
            All news & updates
          </ArrowLink>
        </Container>
      </article>

      {more.length > 0 ? (
        <section className="bg-sand-50 py-20 sm:py-24">
          <Container>
            <h2 className="text-3xl font-semibold text-ink-950">More updates</h2>
            <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((n) => (
                <li key={n.slug}>
                  <NewsCard post={n} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  );
}
