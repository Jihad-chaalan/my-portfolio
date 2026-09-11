import { ProjectsShowcase } from "@/components/projects/ProjectsShowcase";
import { getAllProjects } from "@/lib/project-repository";

/**
 * Projects / #projects — the centerpiece. From `lg` up it is a pinned,
 * scroll-driven one-at-a-time showcase; below `lg` the cards stack in
 * normal flow. Data is fetched on the server; the showcase itself is a
 * client component.
 */
export async function Projects() {
  const projects = await getAllProjects();

  return (
    <section id="projects" aria-label="Projects" className="bg-canvas">
      <ProjectsShowcase projects={projects} />
    </section>
  );
}