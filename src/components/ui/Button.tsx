import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/site";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "outline-light" | "outline-dark" | "dark";
type Size = "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2.5 rounded-sm font-semibold tracking-[0.01em] transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-gold-500 text-ink-950 shadow-[0_12px_32px_-14px_rgb(232_150_42/0.8)] hover:bg-gold-400",
  dark: "bg-ink-900 text-white hover:bg-ink-700",
  "outline-light": "border border-white/30 text-white hover:border-gold-400 hover:text-gold-300",
  "outline-dark": "border border-ink-900/20 text-ink-900 hover:border-gold-600 hover:text-gold-700",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[0.95rem]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  icon?: IconName | null;
  className?: string;
  children: ReactNode;
};

function Inner({ children, icon }: { children: ReactNode; icon: IconName | null }) {
  return (
    <>
      <span>{children}</span>
      {icon ? <Icon name={icon} className="size-4.5 transition-transform duration-300 ease-out group-hover/btn:translate-x-1" /> : null}
    </>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  icon = "arrow-right",
  className,
  children,
  ...props
}: CommonProps & Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children">) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Inner icon={icon}>{children}</Inner>
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  icon = null,
  className,
  children,
  type = "button",
  ...props
}: CommonProps & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">) {
  return (
    <button type={type} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      <Inner icon={icon}>{children}</Inner>
    </button>
  );
}

/** Inline "Read more →" link with an underline that draws in on hover. */
export function ArrowLink({
  href,
  children,
  tone = "dark",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/link inline-flex items-center gap-2 text-sm font-semibold tracking-[0.01em] transition-colors",
        tone === "dark" ? "text-ink-900 hover:text-gold-700" : "text-white hover:text-gold-300",
        className,
      )}
    >
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-out group-hover/link:bg-[length:100%_1px]">
        {children}
      </span>
      <Icon name="arrow-right" className="size-4 transition-transform duration-300 group-hover/link:translate-x-1" />
    </Link>
  );
}
