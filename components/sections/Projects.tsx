import { ProjectsShowcase } from "@/components/projects/ProjectsShowcase";
import { getAllProjects } from "@/lib/project-repository";

/**
 * Projects / #projects — the centerpiece. A pinned, scroll-driven
 * horizontal showcase: the highlighted title stays fixed on the left while
 * the project cards travel horizontally as the user scrolls. Data is
 * fetched on the server; the showcase itself is a client component.
 */
export async function Projects() {
  const projects = await getAllProjects();

  return (
    <section id="projects" aria-labelledby="projects-heading" className="bg-canvas">
      <ProjectsShowcase projects={projects} />
    </section>
  );
}