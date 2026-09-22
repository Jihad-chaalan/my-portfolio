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
    "Jihad Chaalan is an independent Full-Stack AI Engineer and freelance developer who builds practical AI products for businesses and startups: RAG systems, LLM applications, AI agents, chatbots, workflow automation, APIs, and complete web applications from frontend to backend and deployment.",
  url: "https://jihadchaalan.dev",
  email: "chaalan2004@gmail.com",
  /* Display form for the Contact section; the tel: link is derived from it. */
  phone: "+961 70 627 215",
  links: {
    github: "https://github.com/jihad-chaalan",
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
