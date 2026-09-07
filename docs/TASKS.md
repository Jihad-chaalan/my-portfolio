# TASKS.md

Tracks implementation progress for the portfolio rebuild. Update this file at the end of every task.

## Task 1 — Foundation ✅ Complete

- [x] Confirmed current repo state (stock `create-next-app`, Next.js 16.3.4, App Router at root `app/`, Tailwind v4 CSS-first).
- [x] Read the bundled Next.js 16 docs (`node_modules/next/dist/docs`) for project structure, fonts, images, CSS, metadata, and linking conventions before writing code (per `AGENTS.md`).
- [x] Created folder structure: `components/{layout,ui,sections,projects}`, `data/`, `types/`, `lib/`, `docs/`, `public/images/projects/`.
- [x] Defined the normalized `Project` type (`types/project.ts`) and `SkillCategory` type (`types/skill.ts`), plus barrel export (`types/index.ts`).
- [x] Created local static data: `data/projects.ts` (Secure Multi-Tenant RAG, AI Daily News, Resume ATS Predictor — no invented stats) and `data/skills.ts` (AI Engineering, Full-Stack Development, DevOps & Deployment).
- [x] Created the repository seam: `lib/project-repository.ts`, `lib/skills-repository.ts` (async functions; UI must call these, never `data/*` directly).
- [x] Created `lib/site.ts` (site identity, nav links, contact/booking links).
- [x] Set up all four fonts via `next/font/google` in `app/layout.tsx`: Manrope, Shrikhand, Bungee, and Archivo Black (temporary stand-in for the licensed Bowlby One SC).
- [x] Defined design tokens in `app/globals.css` (`@theme inline`): `--color-canvas/forest/orange/surface`, `--font-sans/brand/sub/display`; added `prefers-reduced-motion` handling, global focus-visible ring, smooth scroll.
- [x] Added base `Metadata` (title template, description, OpenGraph, Twitter, robots) to `app/layout.tsx`, plus a skip-to-content link.
- [x] Replaced the starter `app/page.tsx` with a minimal `#home` checkpoint section (full Hero/Skills/Projects/Contact composition comes in Task 3) and removed the unused starter SVGs from `public/`.
- [x] Added placeholder project imagery (`public/images/projects/*.svg`) referenced by `data/projects.ts`, using only palette colors.
- [x] Set `turbopack.root` in `next.config.ts` to fix a Turbopack root-detection warning caused by an unrelated `package-lock.json` in a parent OneDrive folder.
- [x] Verified: `npm run lint` (clean), `npx tsc --noEmit` (clean), `npm run build` (clean, static homepage + `_not-found` prerendered).
- [x] Wrote `docs/PROJECT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/TASKS.md`.

**Open item:** `--font-display` currently renders as Archivo Black, a free stand-in for the licensed Bowlby One SC. Swap instructions are documented in `docs/DESIGN.md`.

## Task 2 — Shared UI ⏳ Not started

- [ ] `components/layout/Container.tsx` — consistent max-width/padding wrapper.
- [ ] `components/layout/Navbar.tsx` (Client Component) — smooth-scroll nav links, active-section highlighting, accessible mobile menu.
- [ ] `components/layout/Footer.tsx` — contact links, copyright.
- [ ] `components/ui/ButtonLink.tsx` — primary/secondary CTA button, used for "View Projects" / "Contact Me" / "Book a Call".
- [ ] `components/ui/SectionHeading.tsx` — consistent `h2` styling using `font-display`.
- [ ] Wire `Navbar` + `Footer` into `app/layout.tsx`.

## Task 3 — Homepage ⏳ Not started

- [ ] `components/sections/Hero.tsx` (`#home`)
- [ ] `components/sections/Skills.tsx` (`#skills`) + `components/ui/SkillCard.tsx`
- [ ] `components/sections/Projects.tsx` (`#projects`) + `components/projects/ProjectCard.tsx`
- [ ] `components/sections/Contact.tsx` (`#contact`)
- [ ] Compose all four sections in `app/page.tsx`, reading data through the repositories.

## Task 4 — Project Pages ⏳ Not started

- [ ] `app/projects/[slug]/page.tsx` with `generateStaticParams` + `generateMetadata`.
- [ ] `components/projects/ProjectDetail.tsx` and subsections (Overview, Architecture, Key Features, Tech Stack, Challenges, Outcomes, Screenshots).
- [ ] Link project cards to their detail pages.

## Task 5 — Quality ⏳ Not started

- [ ] Responsive pass across mobile/tablet/laptop/desktop.
- [ ] Accessibility pass (heading order, landmarks, keyboard nav, contrast).
- [ ] `app/not-found.tsx` custom 404.
- [ ] Loading/error states where applicable.
- [ ] Image optimization review.

## Task 6 — Production ⏳ Not started

- [ ] `app/sitemap.ts`, `app/robots.txt`.
- [ ] Final `npm run build` + `npm run lint` verification.
- [ ] README refresh.
