"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ProjectError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ProjectPage] failed to load:", error);
  }, [error]);

  return (
    <main id="main-content" className="flex min-h-[70vh] items-center px-4 py-24 sm:px-8">
      <section className="mx-auto w-full max-w-3xl border-2 border-forest bg-surface p-8 text-center shadow-[6px_7px_0_0_var(--color-orange)] sm:p-14">
        <p className="font-display text-5xl uppercase text-orange sm:text-7xl">Something went wrong</p>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-forest/75 sm:text-lg">
          The project could not be loaded right now. Try again or return to the portfolio.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-11 items-center justify-center rounded-md border-2 border-forest bg-orange px-5 font-display text-sm uppercase tracking-wide text-forest shadow-[4px_5px_0_0_var(--color-forest)]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md border-2 border-forest bg-canvas px-5 font-display text-sm uppercase tracking-wide text-forest shadow-[4px_5px_0_0_var(--color-forest)]"
          >
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
