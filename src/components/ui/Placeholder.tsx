import type { ReactNode } from "react";
import { cn } from "@/lib/site";
import { Icon } from "./Icon";

/**
 * Inline marker for information the company has not supplied yet.
 * Deliberately visible so a placeholder is never mistaken for a real fact.
 */
export function Pending({ children = "To be updated", tone = "dark", className }: { children?: ReactNode; tone?: "dark" | "light"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-dashed px-2 py-0.5 text-[0.82em] font-medium italic",
        tone === "dark" ? "border-ink-300 text-ink-400" : "border-white/25 text-ink-300",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Renders `value`, or a Pending marker when the value is missing. */
export function OrPending({ value, tone, label }: { value: string | null | undefined; tone?: "dark" | "light"; label?: string }) {
  return value ? <>{value}</> : <Pending tone={tone}>{label}</Pending>;
}

/** Badge for illustrative sample entries (projects, news). */
export function SampleBadge({ tone = "dark", className, label = "Sample content" }: { tone?: "dark" | "light"; className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-dashed px-2.5 py-1 text-[0.66rem] font-bold uppercase tracking-[0.14em]",
        tone === "dark" ? "border-gold-600/50 bg-gold-200/50 text-gold-800" : "border-gold-300/50 bg-ink-950/70 text-gold-300 backdrop-blur",
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

/** Callout explaining that a section contains placeholder or sample content. */
export function PlaceholderNote({ children, tone = "dark", className }: { children: ReactNode; tone?: "dark" | "light"; className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-3 rounded-sm border border-dashed px-4 py-3 text-sm leading-relaxed",
        tone === "dark" ? "border-gold-600/40 bg-gold-200/25 text-ink-600" : "border-gold-300/30 bg-white/[0.03] text-ink-200",
        className,
      )}
    >
      <Icon name="info" className={cn("mt-0.5 size-4 shrink-0", tone === "dark" ? "text-gold-700" : "text-gold-400")} />
      <span>{children}</span>
    </p>
  );
}
