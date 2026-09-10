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

## Task 2 — Shared UI ✅ Complete

- [x] `lib/cn.ts` — lightweight class-name joiner for conditional Tailwind classes.
- [x] `components/layout/Container.tsx` — centered `max-w-6xl` wrapper with responsive gutters.
- [x] `components/layout/Navbar.tsx` (Client Component) — sticky forest navbar in the root layout; Shrikhand name/logo; smooth-scrolling nav links (Home/Skills/Projects/Contact) with active-section scroll-spy (IntersectionObserver) and `aria-current`; orange "Book a Call" CTA; accessible mobile menu (hamburger toggle with `aria-expanded`/`aria-controls`, closes on Escape / resize / link click); on non-home routes links point to `/#anchor` so they work from project pages.
- [x] `components/layout/Footer.tsx` — forest footer with orange top rule, Shrikhand brand, quick nav, contact links (email / GitHub / LinkedIn / Book a Call), copyright bar.
- [x] `components/ui/ButtonLink.tsx` — primary (orange) / secondary (forest outline) CTA links, minimum 44px touch target, external-link support (`target="_blank"` + `rel="noopener noreferrer"`).
- [x] `components/ui/SectionHeading.tsx` — `h2` in display face with optional Manrope eyebrow, used by all homepage sections.
- [x] Wired `Navbar` + `Footer` into `app/layout.tsx` (skip link → navbar → page → footer).
- [x] Added `scroll-margin-top` for `section[id]` in `globals.css` so anchored sections clear the sticky navbar when smooth-scrolling.
- [x] Verified: `npm run lint` (clean), `npx tsc --noEmit` (clean), `npm run build` (clean; rendered HTML confirms navbar, footer, skip link, and all metadata).

## Task 3 — Homepage ✅ Complete

- [x] `components/sections/Hero.tsx` (`#home`) — Shrikhand name, display-face "Full-Stack AI Engineer" `h1`, supporting message (AI websites, apps, RAG, agents, intelligent systems), CTAs "View Projects", "Contact Me", "Book a Call" (external); subtle orange corner brackets + vertical "RAG — AGENTS — AUTOMATION" rail on large screens; `min-h-screen`.
- [x] `components/sections/Skills.tsx` (`#skills`) + `components/ui/SkillCard.tsx` — three categories (AI Engineering / Full-Stack Development / DevOps & Deployment) as white cards with Bungee `h3` headings, Manrope description, numbered orange index accents, and scannable tech chips (not a keyword wall); data via `getSkillCategories()`.
- [x] `components/sections/Projects.tsx` (`#projects`) + `components/projects/ProjectCard.tsx` — the centerpiece; cards with palette-based project image (3:2, hover zoom), category pill, Bungee name, tagline, top-3 key features, tech chips, and "View Details" (+ conditional "Live Demo"/"GitHub" when links exist); all three projects render, linking to `/projects/[slug]`; data via `getAllProjects()`.
- [x] `components/sections/Contact.tsx` (`#contact`) — forest-green final CTA section; eyebrow "Contact", display "Let's Build It", the required "Have an AI project in mind?" message, primary "Book a Call" (external), plus "Email Me", "LinkedIn", "GitHub".
- [x] Extended `ButtonLink` with an `outline-light` variant (canvas outline for dark backgrounds) and `SectionHeading` with a `dark` tone — both needed by the forest contact section.
- [x] Composed all four sections in `app/page.tsx` (Hero → Skills → Projects → Contact inside `main#main-content`), replacing the Task 1 checkpoint placeholder.
- [x] Verified: `npm run lint` (clean), `npx tsc --noEmit` (clean), `npm run build` (clean). Inspected generated `index.html`: all four section IDs present, all three project cards (name + tagline + features + chips + View Details → `/projects/[slug]`), contact CTA + message, and "Book a Call" all render server-side.

## Task 3.5 — Styling Improvements ⏳ In progress (subtask by subtask)

**Working rule:** We go through these one at a time (header → hero → skills → projects → contact), and **none are marked complete until the user reviews and confirms each one**.

> No subtask below is done yet — each will become `[x]` only after the user explicitly approves the styling of that section.

- [ ] **Improve header (navbar) styling** — flat rounded forest-green pill, same width as the hero box (small margins only), no borders/rings; nav links About/Skills/Projects/Contact + Book a Call. **Draft implemented — awaiting user confirmation.**
- [ ] **Improve Hero section styling** — wide rounded forest-green box with small margins (matches navbar width), no borders; large rectangular photo (~half the hero width, tall) on the left, "Hey, I'm Jihad Chaalan / Full-Stack AI Engineer" + CTAs on the right. **Draft implemented — awaiting user confirmation.**
- [ ] **Improve Skills section styling** — section header (eyebrow + "Skills" + intro) fixed on the left and never animated; each skill box contains its own title, description, and tech tags, is slightly rotated (alternating tilts), and the whole box reveals one after another on scroll (Reveal component, IntersectionObserver trigger zone). **Draft implemented — awaiting user confirmation.**
- [ ] **Improve Projects section styling** — refine project cards: image treatment, card borders/hover, name typography, feature list, chip density, grid balance, and visual priority of the featured projects.
- [ ] **Improve Contact section styling** — refine the final CTA block: forest-background composition, heading, message, button arrangement and spacing, and the link row.

## Task 4 — Project Pages ⏳ Not started

- [ ] `app/projects/[slug]/page.tsx` with `generateStaticParams` + `generateMetadata` (page content must add top spacing so it clears the fixed navbar pill).
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
