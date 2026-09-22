import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="flex min-h-[70vh] items-center px-4 py-24 sm:px-8">
      <section className="mx-auto w-full max-w-3xl rotate-[-0.5deg] border-2 border-forest bg-surface p-8 text-center shadow-[6px_7px_0_0_var(--color-orange)] sm:p-14">
        <p className="font-display text-7xl leading-none text-orange sm:text-9xl">404</p>
        <h1 className="mt-5 font-sub text-3xl uppercase text-forest sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-forest/75 sm:text-lg">
          This page wandered off. Let&apos;s get you back to the portfolio.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-md border-2 border-forest bg-orange px-6 font-display text-sm uppercase tracking-wide text-forest shadow-[4px_5px_0_0_var(--color-forest)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_3px_0_0_var(--color-forest)]"
        >
          Back home
        </Link>
      </section>
    </main>
  );
}
