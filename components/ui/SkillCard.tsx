import type { SkillCategory } from "@/types";

interface SkillCardProps {
  category: SkillCategory;
  index: number;
}

/**
 * A skills category card. Bungee heading + Manrope description and tags,
 * per the typography hierarchy. White surface so it separates from the
 * yellow canvas, with an orange index accent.
 */
export function SkillCard({ category, index }: SkillCardProps) {
  return (
    <article className="flex flex-col gap-5 rounded-xl border-2 border-forest/15 bg-surface p-6 sm:p-7">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="font-sans text-sm text-orange"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-sub text-2xl text-forest">{category.title}</h3>
      </div>

      <p className="text-sm leading-relaxed text-forest/75">
        {category.description}
      </p>

      <ul className="flex flex-wrap gap-2" aria-label={`${category.title} technologies`}>
        {category.items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-forest/25 px-3 py-1 text-xs font-medium text-forest"
          >
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}