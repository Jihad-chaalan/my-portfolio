import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillCard } from "@/components/ui/SkillCard";
import { getSkillCategories } from "@/lib/skills-repository";

/**
 * Skills / #skills — three scannable category cards, not a keyword wall.
 * Data flows through the repository so the source can swap later.
 */
export async function Skills() {
  const categories = await getSkillCategories();

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="bg-canvas py-20 sm:py-28"
    >
      <Container className="flex flex-col gap-12">
        <SectionHeading
          headingId="skills-heading"
          eyebrow="What I work with"
          title="Skills"
        />
        <p className="max-w-2xl text-center text-base leading-relaxed text-forest/75 sm:text-lg">
          I work across the whole AI product stack — from model plumbing and
          retrieval systems to production deployments — so the things I build
          are usable by real people, not just interesting demos.
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <SkillCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}