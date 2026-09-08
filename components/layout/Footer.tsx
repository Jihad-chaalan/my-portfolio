import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { navLinks, siteConfig } from "@/lib/site";

/**
 * Site footer. A bold forest-green close to the page with quick navigation
 * and contact links. Server Component — no interactivity needed.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-orange bg-forest text-canvas">
      <Container className="grid gap-10 py-14 md:grid-cols-3">
        <div className="flex flex-col gap-3 md:max-w-xs">
          <p className="font-brand text-3xl text-canvas">{siteConfig.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-canvas/70">
            Full-Stack AI Engineer building real AI-powered products — from RAG
            systems and AI agents to the web applications around them, frontend
            to deployment.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-canvas/60">
            Navigation
          </h2>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={`/${link.href}`}
              className="text-sm text-canvas transition-colors hover:text-orange"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-canvas/60">
            Contact
          </h2>
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-sm text-canvas transition-colors hover:text-orange"
          >
            {siteConfig.email}
          </a>
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-canvas transition-colors hover:text-orange"
          >
            GitHub
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-canvas transition-colors hover:text-orange"
          >
            LinkedIn
          </a>
          <a
            href={siteConfig.links.bookACall}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-canvas transition-colors hover:text-orange"
          >
            Book a Call
          </a>
        </div>
      </Container>

      <Container className="flex flex-col items-center justify-between gap-2 border-t border-canvas/20 py-6 text-xs text-canvas/60 sm:flex-row">
        <p>
          © {year} {siteConfig.name}. All rights reserved.
        </p>
        <p>Built with Next.js</p>
      </Container>
    </footer>
  );
}