import { Container } from "@/components/layout/Container";
import { FooterBounce } from "@/components/FooterBounce";
import { ContactReveal } from "@/components/sections/ContactReveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site";

/**
 * Contact / #contact — a strong final CTA on a forest background with a
 * scroll-speed "footer bounce" top edge (see FooterBounce). Primary action
 * is "Book a Call"; email, LinkedIn, and GitHub are presented alongside.
 * The content lands with a one-shot entrance (see ContactReveal).
 */
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative">
      {/* The bouncy slab — the only thing that reacts to scroll speed. */}
      <FooterBounce />
      {/* Static content — never moves. */}
      <ContactReveal className="relative">
        <div data-contact-items className="py-20 sm:py-28">
          <Container className="flex flex-col gap-12">
            <SectionHeading
              headingId="contact-heading"
              eyebrow="Contact"
              title="Let's Build It"
              tone="dark"
            />

            <p className="max-w-2xl text-center text-base leading-relaxed text-canvas/80 sm:text-lg">
              Have an AI project in mind? I build AI-powered products end to end —
              RAG systems, AI agents, automation, and full applications — from
              first idea to deployment.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href={siteConfig.links.bookACall} external>
                Book a Call
              </ButtonLink>
              <ButtonLink href={`mailto:${siteConfig.email}`} variant="outline-light">
                Email Me
              </ButtonLink>
            </div>

            <ul className="flex flex-wrap items-center justify-center gap-3 sm:gap-4" aria-label="Contact links">
              <li>
                <ButtonLink
                  href={siteConfig.links.linkedin}
                  external
                  variant="outline-light"
                  className="min-w-32"
                >
                  LinkedIn
                </ButtonLink>
              </li>
              <li>
                <ButtonLink
                  href={siteConfig.links.github}
                  external
                  variant="outline-light"
                  className="min-w-32"
                >
                  GitHub
                </ButtonLink>
              </li>
            </ul>
          </Container>
        </div>
      </ContactReveal>
    </section>
  );
}