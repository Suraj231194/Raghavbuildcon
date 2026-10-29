import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/site";

type Step = { title: string; description: string };

/** Numbered lifecycle, laid out as a connected sequence; a gold line fills across each step in turn as it scrolls in. */
export function ProcessSteps({ steps, tone = "dark" }: { steps: Step[]; tone?: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <ol data-fill-sequence="" className="grid gap-px overflow-hidden rounded-sm sm:grid-cols-2 lg:grid-cols-3" style={{ background: light ? "rgb(255 255 255 / 0.1)" : "var(--color-ink-100)" }}>
      {steps.map((step, i) => (
        <Reveal as="li" key={step.title} delay={(i % 3) * 90} className={cn("group relative p-7 sm:p-8", light ? "bg-ink-900" : "bg-white")}>
          <span aria-hidden="true" data-fill="" className={cn("absolute inset-x-0 top-0 h-0.5", light ? "bg-gold-400" : "bg-gold-500")} />
          <span className={cn("font-display text-sm font-semibold tracking-[0.18em]", light ? "text-gold-400" : "text-gold-700")}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span aria-hidden="true" className={cn("mt-4 block h-px w-10 transition-all duration-500 group-hover:w-20", light ? "bg-gold-400" : "bg-gold-500")} />
          <h3 className={cn("mt-5 font-display text-xl font-semibold", light ? "text-white" : "text-ink-950")}>{step.title}</h3>
          <p className={cn("mt-2.5 text-[0.95rem] leading-relaxed", light ? "text-ink-300" : "text-ink-500")}>{step.description}</p>
        </Reveal>
      ))}
    </ol>
  );
}
