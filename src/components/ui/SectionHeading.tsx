import type { ReactNode } from "react";
import { cn } from "@/lib/site";
import { Eyebrow } from "./Eyebrow";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
  children?: ReactNode;
};

export function SectionHeading({ eyebrow, title, lead, tone = "dark", align = "left", as: Tag = "h2", className, children }: SectionHeadingProps) {
  return (
    <div data-reveal="" className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <Tag data-words="" className={cn("mt-5 text-3xl leading-[1.08] font-semibold sm:text-4xl lg:text-[2.85rem]", tone === "dark" ? "text-ink-950" : "text-white")}>
        {title}
      </Tag>
      {lead ? <p className={cn("mt-5 text-base leading-relaxed sm:text-lg", tone === "dark" ? "text-ink-500" : "text-ink-200")}>{lead}</p> : null}
      {children}
    </div>
  );
}
