import Image from "next/image";
import { cn } from "@/lib/site";

/**
 * Raghav Buildcon identity: the official shield emblem (public/brand/raghav-buildcon-logo.png,
 * transparent background) with the company wordmark set beside it.
 */
export const LOGO_SRC = "/brand/raghav-buildcon-logo.png";
const LOGO_SIZE = 893;

/** `light` = for dark backgrounds (white wordmark). `dark` = for light backgrounds. */
export type LogoVariant = "dark" | "light";

export function LogoMark({ className, alt = "", preload = false }: { className?: string; alt?: string; preload?: boolean }) {
  return (
    <Image
      src={LOGO_SRC}
      alt={alt}
      width={LOGO_SIZE}
      height={LOGO_SIZE}
      sizes="(min-width: 640px) 64px, 56px"
      preload={preload}
      className={cn("h-auto object-contain drop-shadow-[0_4px_10px_rgb(0_0_0/0.25)]", className)}
    />
  );
}

/** Horizontal lockup: shield emblem + wordmark. */
export function Logo({ variant = "dark", className, size = "md", preload = false }: { variant?: LogoVariant; className?: string; size?: "md" | "lg"; preload?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark preload={preload} className={size === "lg" ? "w-16 sm:w-[4.5rem]" : "w-13 sm:w-16"} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-bold uppercase tracking-[0.12em] [font-stretch:100%]",
            size === "lg" ? "text-[1.35rem]" : "text-[1.12rem] sm:text-[1.22rem]",
            variant === "light" ? "text-white" : "text-ink-950",
          )}
        >
          Raghav
        </span>
        <span
          className={cn(
            "mt-[0.32rem] font-bold uppercase tracking-[0.47em]",
            size === "lg" ? "text-[0.7rem]" : "text-[0.6rem] sm:text-[0.64rem]",
            variant === "light" ? "text-gold-400" : "text-gold-700",
          )}
        >
          Buildcon
        </span>
      </span>
    </span>
  );
}
