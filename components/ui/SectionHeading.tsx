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
  className,
}: SectionHeadingProps) {
  const headingColor = tone === "dark" ? "text-canvas" : "text-forest";
  const eyebrowColor = tone === "dark" ? "text-canvas/70" : "text-forest/70";

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
          headingColor,
        )}
      >
        {title}
      </h2>
    </div>
  );
}