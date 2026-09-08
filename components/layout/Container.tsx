import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Shared page-width wrapper. Centered, capped, with responsive gutters.
 * Layout-level sections (sections, footer) should use this so horizontal
 * spacing stays consistent across the site.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </div>
  );
}