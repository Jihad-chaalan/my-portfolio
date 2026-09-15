"use client";

import { type FormEvent } from "react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/cn";

interface ContactFormProps {
  className?: string;
}

/* Labels sit on the white card, so they use forest ink; inputs use the
 * canvas yellow to stay on-palette, with the orange accent on focus. */
const labelClasses =
  "mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-forest/70";
const inputClasses =
  "w-full rounded-md border-2 border-transparent bg-canvas px-4 py-3 text-sm font-medium text-forest placeholder:text-forest/50 focus:border-orange focus:outline-none";

/**
 * The Contact section's direct-message form. There is no backend, so
 * submitting composes an email in the visitor's mail app with everything
 * prefilled (name, email, phone, project details) — a dependency-free
 * handoff that can later be swapped for a service or a server action
 * without changing the layout.
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
      className={cn("rounded-2xl bg-surface p-6 sm:p-8", className)}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClasses}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClasses}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="contact-phone" className={labelClasses}>
          Phone number
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="Optional"
          className={inputClasses}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="contact-details" className={labelClasses}>
          Details
        </label>
        <textarea
          id="contact-details"
          name="details"
          required
          rows={5}
          placeholder="Tell me about your project…"
          className={cn(inputClasses, "resize-y")}
        />
      </div>

      <div className="mt-6 flex flex-col items-start gap-2">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-orange px-6 text-sm font-semibold text-forest transition-colors duration-200 hover:bg-forest hover:text-canvas"
        >
          Send Message
        </button>
        <p className="text-xs leading-relaxed text-forest/60">
          Opens your email app with your message ready to send.
        </p>
      </div>
    </form>
  );
}