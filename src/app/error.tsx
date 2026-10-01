"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden bg-ink-950 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-blueprint" />
      <Container className="pt-36 pb-24">
        <Eyebrow tone="light">Something went wrong</Eyebrow>
        <h1 className="mt-6 max-w-2xl text-4xl leading-[1.05] font-semibold sm:text-5xl">We couldn’t load this page.</h1>
        <p className="mt-6 max-w-xl text-lg text-ink-200">Please try again. If the problem continues, return to the homepage or contact us.</p>
        {error.digest ? <p className="mt-3 font-mono text-xs text-ink-400">Reference: {error.digest}</p> : null}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" icon="arrow-right" onClick={() => retry()}>
            Try again
          </Button>
          <ButtonLink href="/" size="lg" variant="outline-light">
            Back to home
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
