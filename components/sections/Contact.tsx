import { Container } from "@/components/layout/Container";
import { FooterBounce } from "@/components/FooterBounce";
import { ContactReveal } from "@/components/sections/ContactReveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
} from "@/components/ui/Icons";
import { siteConfig } from "@/lib/site";

/**
 * Contact / #contact — the compact final block on the forest slab, in two
 * parts: on the left, "Have a project in mind?" over the highlighter-marker
 * "Let's Build It" plus direct routes (phone, email, LinkedIn, GitHub); on
 * the right, a white card with a direct-message form. The slab's top edge
 * is the scroll-speed "footer bounce" wave (see FooterBounce), and the two
 * columns land with a one-shot entrance (see ContactReveal).
 */
export function Contact() {
  /* tel: links don't like spaces. */
  const telHref = `tel:${siteConfig.phone.replace(/\s+/g, "")}`;

  const routeLinkClasses =
    "inline-flex items-center gap-3 text-base font-semibold text-canvas transition-colors duration-200 hover:text-orange";
  const socialLinkClasses =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border-2 border-canvas text-canvas transition-colors duration-200 hover:bg-canvas hover:text-forest";

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative">
      {/* The bouncy slab — the only thing that reacts to scroll speed. */}
      <FooterBounce />
      {/* Static content — never moves. */}
      <ContactReveal className="relative">
        <Container
          data-contact-items
          className="grid grid-cols-1 gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16"
        >
          {/* Left — invitation + direct contact routes. */}
          <div className="flex flex-col items-start gap-8">
            <div className="flex flex-col gap-3">
              <p className="text-xl font-semibold uppercase tracking-wide text-canvas sm:text-2xl md:text-3xl">
                Have a project in mind?
              </p>
              <SectionHeading
                headingId="contact-heading"
                title="Let's Build It"
                align="left"
                tone="dark"
                highlight
              />
            </div>

            <ul className="flex flex-col gap-4" aria-label="Direct contact">
              <li>
                <a href={telHref} className={routeLinkClasses}>
                  <PhoneIcon />
                  <span>{siteConfig.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className={routeLinkClasses}>
                  <MailIcon />
                  <span>{siteConfig.email}</span>
                </a>
              </li>
            </ul>

            <ul className="flex items-center gap-3" aria-label="Social profiles">
              <li>
                <a
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className={socialLinkClasses}
                >
                  <LinkedInIcon />
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className={socialLinkClasses}
                >
                  <GitHubIcon />
                </a>
              </li>
            </ul>
          </div>

          {/* Right — direct-message form on a white card. */}
          <ContactForm />
        </Container>
      </ContactReveal>
    </section>
  );
}