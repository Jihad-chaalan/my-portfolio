/**
 * Central site configuration: identity, navigation, and contact links.
 * Keeping this in one place avoids scattering hardcoded strings/URLs
 * across components.
 */

export const siteConfig = {
  name: "Jihad Chaalan",
  role: "Full-Stack AI Engineer",
  title: "Jihad Chaalan — Full-Stack AI Engineer",
  description:
    "Full-Stack AI Engineer building production-oriented AI systems: RAG pipelines, AI agents, APIs, and the web applications around them — from frontend to backend to deployment.",
  url: "https://jihadchaalan.dev",
  email: "hello@jihadchaalan.dev",
  links: {
    github: "https://github.com/jihadchaalan",
    linkedin: "https://www.linkedin.com/in/jihadchaalan",
    bookACall: "https://cal.com/jihadchaalan",
  },
  portrait: {
    src: "/images/portrait.png",
    alt: "Portrait of Jihad Chaalan",
  },
} as const;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;
