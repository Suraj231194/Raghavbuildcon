import type { ComponentPropsWithoutRef, CSSProperties, ElementType } from "react";

type RevealProps<T extends ElementType> = {
  as?: T;
  /** Stagger delay in milliseconds. */
  delay?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * Marks an element for the scroll-reveal animation driven by <RevealObserver />.
 * Server-renderable: it only sets a data attribute and a CSS variable.
 */
export function Reveal<T extends ElementType = "div">({ as, delay = 0, style, ...props }: RevealProps<T>) {
  const Tag = as ?? "div";
  const merged = { ...(style as CSSProperties | undefined), "--reveal-delay": `${delay}ms` } as CSSProperties;
  return <Tag data-reveal="" style={merged} {...props} />;
}
