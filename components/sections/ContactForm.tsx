"use client";

import { type FormEvent } from "react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";

interface ContactFormProps {
  className?: string;
}

/* The note sits on a white card, so labels use forest ink; fields are
 * editorial underlines (no boxes) with the orange accent on focus. */
const labelClasses =
  "mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-forest/70";
const inputClasses =
  "w-full border-b-2 border-forest/20 bg-transparent px-1 py-2.5 text-base font-medium text-forest transition-colors duration-200 placeholder:text-forest/35 focus:border-orange focus:outline-none";
const requiredMark = (
  <span aria-hidden="true" className="text-orange">
    *
  </span>
);

/**
 * The Contact section's direct-message form, styled as a sheet of paper
 * taped to the forest slab: a slightly tilted white page (square top-left
 * corner) over a second torn sheet showing through the fine front tear,
 * with a folded (dog-ear) corner and orange tape strips, straightening
 * (CSS-only `focus-within`) while the visitor types. Ruled lines under the
 * message (see .paper-ruled), underline fields, and the site's
 * highlighter-marker send button.
 *
 * There is no backend, so submitting composes an email in the visitor's
 * mail app with everything prefilled (name, email, phone, project details)
 * — a dependency-free handoff that can later be swapped for a service or a
 * server action without changing the layout.
 *
 * Validation is native (required + type=email), consistent with the
 * project's no-extra-dependencies approach.
 */
export function ContactForm({ className }: ContactFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const details = String(data.get("details") ?? "").trim();

    const subject = encodeURIComponent(`New project inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "—"}\n\n${details}`,
    );

    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
  };

  return (
    <form
      aria-label="Contact form"
      onSubmit={handleSubmit}
      className={cn(
        "relative -rotate-1 transition-transform duration-300 focus-within:rotate-0",
        className,
      )}
    >
      {/* The paper stack: a second torn page underneath (its coarser tear
          peeks through the front tear's gaps and carries the drop-shadow),
          then the white front sheet. Both share the dog-ear cut so nothing
          peeks through the fold. Clipped on their own layers so the tape
          overhang and the focus rings are never cut. */}
      <span
        aria-hidden="true"
        className="paper-note-under pointer-events-none absolute inset-x-0 top-0 -bottom-[7px] rounded-xl rounded-tl-none bg-surface"
      />
      <span
        aria-hidden="true"
        className="paper-note pointer-events-none absolute inset-0 rounded-xl rounded-tl-none bg-surface"
      />
      {/* The fold of the dog-ear: the back side of the folded corner, seen
          as a slightly shaded triangle inside the cut. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-[30px] w-[30px] bg-forest/10 [clip-path:polygon(0_0,100%_100%,0_100%)]"
      />

      {/* The two tape strips holding the note to the forest wall — same
          skewed-band language as the highlighter-marker CTAs. */}
      <span
        aria-hidden="true"
        className="absolute -top-3 left-6 h-7 w-20 -rotate-6 rounded-[2px] bg-orange/80"
      />
      <span
        aria-hidden="true"
        className="absolute -top-3 right-6 h-7 w-20 rotate-3 rounded-[2px] bg-orange/80"
      />

      <div className="relative p-6 pb-8 pt-10 sm:p-8 sm:pt-10 sm:pb-10">
      <p className="font-sub text-lg uppercase leading-none text-forest">
        Say Hello
      </p>
      <p className="mt-2 text-sm leading-relaxed text-forest/60">
        It lands straight in my inbox.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClasses}>
            Name {requiredMark}
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="What should I call you?"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClasses}>
            Email {requiredMark}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Where can I reply?"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="contact-phone" className={labelClasses}>
          Phone number
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="Optional — for a quick call"
          className={inputClasses}
        />
      </div>

      <div className="mt-6">
        <label htmlFor="contact-details" className={labelClasses}>
          Your project {requiredMark}
        </label>
        <textarea
          id="contact-details"
          name="details"
          required
          rows={4}
          placeholder="Tell me about it — goals, scope, timeline…"
          className={cn(inputClasses, "paper-ruled resize-y leading-6")}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        {/* Highlighter-marker send button — same treatment as "Let's Build
            It" and "Book a Call": a skewed orange band behind chunky type. */}
        <button
          type="submit"
          className="group relative inline-flex min-h-11 items-center px-1 transition-transform duration-200 hover:-translate-y-0.5"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-1.5 bottom-0 -rotate-1 rounded-[4px] bg-orange transition-colors duration-200 group-hover:bg-forest"
          />
          <span className="relative inline-flex items-center gap-2 font-display text-lg uppercase leading-none tracking-tight text-surface">
            Send It
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
        </button>
        <p className="text-xs leading-relaxed text-forest/55">
          Opens your email app with your message ready to send.
        </p>
        </div>
      </div>
    </form>
  );
}