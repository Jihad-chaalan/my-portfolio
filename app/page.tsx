import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";

/**
 * Homepage — a single scrolling page in the exact required order:
 * Hero → Skills → Projects → Contact, with semantic section IDs
 * (#home #skills #projects #contact).
 */
export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <Skills />
      <Projects />
      <Contact />
    </main>
  );
}

