import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/site";

type ContainerProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

/** Site-wide content width with responsive gutters. */
export function Container<T extends ElementType = "div">({ as, className, ...props }: ContainerProps<T>) {
  const Tag = as ?? "div";
  return <Tag className={cn("mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12", className)} {...props} />;
}
