import type { ReactNode } from "react";
import { cn } from "@/lib/site";

/** Small uppercase label that introduces a heading, with a gold rule. */
export function Eyebrow({ children, tone = "dark", className }: { children: ReactNode; tone?: "dark" | "light"; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em]",
        tone === "dark" ? "text-gold-700" : "text-gold-400",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("h-px w-8", tone === "dark" ? "bg-gold-600" : "bg-gold-400")} />
      {children}
    </p>
  );
}
