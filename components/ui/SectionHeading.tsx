import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  /** id placed on the <h2> itself, so sections can aria-labelledby it. */
  headingId: string;
  title: string;
  /** Small uppercase label above the heading (Manrope). */
  eyebrow?: string;
  align?: "left" | "center";
  /** "dark" for headings that sit on a forest background. */
  tone?: "light" | "dark";
  /**
   * "highlight" wraps the title in the orange highlighter-marker treatment
   * used by the Book a Call CTA — a slightly skewed orange band behind the
   * word, overshooting its edges like a real marker stroke.
   */
  highlight?: boolean;
  className?: string;
}

/**
 * Consistent section heading: decorative display type (Archivo Black,
 * standing in for the licensed Bowlby One SC) for the <h2>, with an
 * optional Manrope eyebrow. Use sparingly — one per section.
 */
export function SectionHeading({
  headingId,
  title,
  eyebrow,
  align = "center",
  tone = "light",
  highlight = false,
  className,
}: SectionHeadingProps) {
  const headingColor = tone === "dark" ? "text-canvas" : "text-forest";
  const eyebrowColor = tone === "dark" ? "text-canvas/70" : "text-forest/70";
  const markerColor = tone === "dark" ? "bg-orange" : "bg-orange";
  const titleColor = highlight && tone === "dark" ? "text-surface" : headingColor;

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <p className={cn("text-sm font-semibold uppercase tracking-[0.18em]", eyebrowColor)}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={headingId}
        className={cn(
          "font-display text-4xl uppercase leading-none tracking-tight sm:text-5xl md:text-6xl",
          titleColor,
        )}
      >
        {highlight ? (
          <span className="relative inline-block px-2">
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 top-[0.28em] bottom-0 -rotate-1 rounded-[4px]",
                markerColor,
              )}
            />
            <span className="relative">{title}</span>
          </span>
        ) : (
          title
        )}
      </h2>
    </div>
  );
}