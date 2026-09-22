"use client";

import { useState, type FormEvent } from "react";
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
  "w-full border-b-2 border-forest/20 bg-transparent px-1 py-2.5 text-base font-medium text-forest transition-colors duration-200 placeholder:text-forest/55 focus:border-orange focus:outline-none";
const requiredMark = (
  <span aria-hidden="true" className="text-orange">
    *
  </span>
);

type FormStatus = "idle" | "submitting" | "success" | "error";

/* Web3Forms endpoint — a form-to-email relay, no backend required. */
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
/* The key routes submissions to the inbox registered at web3forms.com. It
 * is public-safe by design (it only identifies the inbox, it is not a
 * secret credential) but is still kept out of git via the env file. */
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

/**
 * The Contact section's direct-message form, styled as a sheet of paper
 * taped to the forest slab: a slightly tilted white page (square top-left
 * corner) over a second torn sheet showing through the fine front tear,
 * with a folded (dog-ear) corner and orange tape strips, straightening
 * (CSS-only `focus-within`) while the visitor types. Ruled lines under the
 * message (see .paper-ruled), underline fields, and the site's
 * highlighter-marker send button.
 *
 * Submissions go through Web3Forms (https://web3forms.com) — a form-to-email
 * relay that needs no backend: the form POSTs to their API with an access
 * key and the message lands in the owner's inbox. The key is read from
 * `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (set in `.env.local`, see
 * `.env.example`). Without a configured key — e.g. a fresh clone — the form
 * falls back to composing the message in the visitor's mail app, so the
 * section never breaks.
 *
 * Validation is native (required + type=email), consistent with the
 * project's no-extra-dependencies approach.
 */
export function ContactForm({ className }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const details = String(data.get("details") ?? "").trim();

    /* No key configured (e.g. a fresh clone): hand off to the mail app so
     * the form still works everywhere, just without inbox delivery. */
    if (!ACCESS_KEY) {
      const subject = encodeURIComponent(`New project inquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "—"}\n\n${details}`,
      );
      window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `New project inquiry from ${name}`,
          from_name: `${siteConfig.name} portfolio — contact form`,
          name,
          email,
          phone: phone || "—",
          message: details,
          botcheck: data.get("botcheck") === "on",
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        success?: boolean;
      } | null;

      if (response.ok && result?.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
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
        Get in Touch
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
          Phone number {requiredMark}
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="Your phone number"
          className={inputClasses}
        />
      </div>

      <div className="mt-6">
        <label htmlFor="contact-details" className={labelClasses}>
          Details {requiredMark}
        </label>
        <textarea
          id="contact-details"
          name="details"
          required
          rows={4}
          placeholder="Tell me about your project, idea, or problem…"
          className={cn(inputClasses, "paper-ruled resize-y leading-6")}
        />
      </div>

      {/* Honeypot: real visitors never see or tick it; bots that fill it
          get silently dropped by Web3Forms. */}
      <input
        type="checkbox"
        name="botcheck"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="mt-8 flex flex-wrap items-center gap-4">
        {/* Highlighter-marker send button — same treatment as "Let's Build
            It" and "Book a Call": a skewed orange band behind chunky type. */}
        <button
          type="submit"
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
          className="group relative inline-flex min-h-11 items-center px-1 transition-transform duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-1.5 bottom-0 -rotate-1 rounded-[4px] bg-orange transition-colors duration-200 group-hover:bg-forest"
          />
          <span className="relative inline-flex items-center gap-2 font-display text-lg uppercase leading-none tracking-tight text-surface">
            {status === "submitting" ? "Sending" : "Send It"}
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
        <p
          role="status"
          aria-live="polite"
          className={cn(
            "text-xs leading-relaxed",
            status === "error" ? "font-semibold text-orange" : "text-forest/55",
          )}
        >
          {status === "idle" && "Goes straight to my inbox."}
          {status === "submitting" && "Sending your message…"}
          {status === "success" && "Sent! I'll get back to you soon."}
          {status === "error" &&
            "Couldn't send — please try again, or email me directly."}
        </p>
        </div>
      </div>
    </form>
  );
}