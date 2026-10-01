import { Container } from "@/components/ui/Container";

/** Route-level loading skeleton that mirrors the page-hero layout. */
export default function Loading() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading page">
      <section className="bg-ink-950">
        <Container className="pt-36 pb-20 md:pt-44 md:pb-28">
          <div className="animate-pulse space-y-6">
            <div className="h-3 w-32 rounded-sm bg-white/10" />
            <div className="h-12 w-full max-w-2xl rounded-sm bg-white/10" />
            <div className="h-12 w-2/3 max-w-xl rounded-sm bg-white/10" />
            <div className="h-5 w-full max-w-lg rounded-sm bg-white/5" />
          </div>
        </Container>
      </section>
      <Container className="grid animate-pulse gap-6 py-20 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-[16/10] rounded-sm bg-ink-100" />
            <div className="h-5 w-3/4 rounded-sm bg-ink-100" />
            <div className="h-4 w-full rounded-sm bg-ink-50" />
          </div>
        ))}
      </Container>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
