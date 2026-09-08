import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "outline-light";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  /** "primary" = solid orange CTA; "secondary" = forest outline (light bg); "outline-light" = canvas outline (dark bg). */
  variant?: ButtonVariant;
  className?: string;
  /** Open in a new tab (used for external links like Book a Call). */
  external?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-orange text-forest hover:bg-forest hover:text-canvas",
  secondary:
    "border-2 border-forest bg-transparent text-forest hover:bg-forest hover:text-canvas",
  "outline-light":
    "border-2 border-canvas bg-transparent text-canvas hover:bg-surface hover:text-forest",
};

/**
 * Anchored/styled CTA link. Renders a Next.js `Link` for internal routes
 * and a plain anchor with `target="_blank"` for external URLs.
 * Always keeps a minimum 44px touch target (`min-h-11`).
 */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  external = false,
  ariaLabel,
  onClick,
}: ButtonLinkProps) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-colors duration-200",
    variantClasses[variant],
    className,
  );

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </Link>
  );
}