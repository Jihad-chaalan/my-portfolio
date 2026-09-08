import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline-light"
  | "highlight";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  /** "primary" = solid orange CTA; "secondary" = forest outline (light bg);
   *  "outline-light" = canvas outline (dark bg);
   *  "highlight" = flat pastel-orange highlighter block with chunky poster type. */
  variant?: ButtonVariant;
  className?: string;
  /** Open in a new tab (used for external links like Book a Call). */
  external?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
}

/**
 * Shared shell only — each variant supplies its own shape and typography
 * so conflicting Tailwind utilities (e.g. rounded-md vs rounded-none,
 * font-semibold vs font-display) never fight in the generated CSS.
 */
const baseClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 transition-colors duration-200";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "rounded-md bg-orange px-5 text-sm font-semibold text-forest hover:bg-forest hover:text-canvas",
  secondary:
    "rounded-md border-2 border-forest bg-transparent px-5 text-sm font-semibold text-forest hover:bg-forest hover:text-canvas",
  "outline-light":
    "rounded-md border-2 border-canvas bg-transparent px-5 text-sm font-semibold text-canvas hover:bg-surface hover:text-forest",
  /* Highlighter marker: the shell stays transparent — the swipe is an
     absolutely positioned, slightly skewed orange band rendered behind the
     text, overshooting its edges like a real marker stroke. */
  highlight: "group relative",
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
  const isHighlight = variant === "highlight";

  const classes = cn(baseClasses, variantClasses[variant], className);

  /* The highlight variant renders a skewed marker band behind the text
     instead of a plain background box. */
  const content = isHighlight ? (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-3 sm:top-2.5 bottom-0 -rotate-1 rounded-[4px] bg-orange transition-colors duration-200 group-hover:bg-canvas"
      />
      <span className="relative inline-flex items-center gap-1.5 font-display text-xl uppercase leading-none tracking-tight text-surface transition-colors duration-200 group-hover:text-forest sm:text-2xl">
        <span>{children}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[0.85em] w-[0.85em]"
        >
          <path d="M4 12h15" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </span>
    </>
  ) : (
    children
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
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel} onClick={onClick}>
      {content}
    </Link>
  );
}