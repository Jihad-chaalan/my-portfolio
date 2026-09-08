import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getAllProjects } from "@/lib/project-repository";

/**
 * Projects / #projects — the centerpiece. Real, product-like systems,
 * rendered as cards the reader can scan and open for full detail.
 */
export async function Projects() {
  const projects = await getAllProjects();

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="bg-canvas py-20 sm:py-28"
    >
      <Container className="flex flex-col gap-12">
        <SectionHeading
          headingId="projects-heading"
          eyebrow="Selected work"
          title="Projects"
        />
        <p className="max-w-2xl text-center text-base leading-relaxed text-forest/75 sm:text-lg">
          Real systems built end-to-end — architecture, interfaces, and
          deployment. Each project has a full write-up of the problem, the
          solution, and the decisions behind it.
        </p>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}