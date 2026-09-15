import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Escape hatch for hooks that target the container via data attributes
   *  (e.g. ContactReveal animates its direct children). */
  "data-contact-items"?: boolean | string;
}

/**
 * Shared page-width wrapper. Centered, capped, with responsive gutters.
 * Layout-level sections (sections, footer) should use this so horizontal
 * spacing stays consistent across the site.
 */
export function Container({
  children,
  className,
  ...rest
}: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
      {...rest}
    >
      {children}
    </div>
  );
}