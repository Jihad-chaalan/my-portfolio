import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillStack } from "@/components/ui/SkillStack";
import { getSkillCategories } from "@/lib/skills-repository";

/**
 * Skills / #skills — the section header is fixed on the left and never
 * animated; the vertical stack of tilted, overlapping cards below fades in
 * and rises into place one by one (scroll-scrubbed) as the user scrolls.
 */
export async function Skills() {
  const categories = await getSkillCategories();

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="overflow-x-clip bg-canvas py-20 sm:py-28"
    >
      <Container className="flex flex-col">
        {/* Section header — fixed on the left, never animated */}
        <div className="flex flex-col gap-4">
          <SectionHeading
            headingId="skills-heading"
            eyebrow="What I work with"
            title="Skills"
            align="left"
            highlight
          />
          <p className="max-w-2xl text-base leading-relaxed text-forest/75 sm:text-lg">
            I work across the whole AI product stack — from model plumbing and
            retrieval systems to production deployments — so the things I build
            are usable by real people, not just interesting demos.
          </p>
        </div>
      </Container>

      {/* Vertical stack of tilted cards — full screen width.
          The top margin is the gap between the section header and box 1. */}
      <div className="mt-16 sm:mt-28">
        <SkillStack categories={categories} />
      </div>
    </section>
  );
}