# TASKS.md

Tracks implementation progress for the portfolio rebuild. Update this file at the end of every task.

## Task 1 — Foundation ✅ Complete

- [x] Confirmed current repo state (stock `create-next-app`, Next.js 16.3.4, App Router at root `app/`, Tailwind v4 CSS-first).
- [x] Read the bundled Next.js 16 docs (`node_modules/next/dist/docs`) for project structure, fonts, images, CSS, metadata, and linking conventions before writing code (per `AGENTS.md`).
- [x] Created folder structure: `components/{layout,ui,sections,projects}`, `data/`, `types/`, `lib/`, `docs/`, `public/images/projects/`.
- [x] Defined the normalized `Project` type (`types/project.ts`) and `SkillCategory` type (`types/skill.ts`), plus barrel export (`types/index.ts`).
- [x] Created local static data: `data/projects.ts` (Secure Multi-Tenant RAG, AI Daily News, Crypto Futures Alert — no invented stats) and `data/skills.ts` (AI Engineering, Full-Stack Development, DevOps & Deployment). *(Superseded: this content now lives in Contentful and the `data/` files were deleted — see Task 4b.)*
- [x] Created the repository seam: `lib/project-repository.ts`, `lib/skills-repository.ts` (async functions; UI must call these, never `data/*` directly).
- [x] Created `lib/site.ts` (site identity, nav links, contact/booking links).
- [x] Set up all four fonts via `next/font/google` in `app/layout.tsx`: Manrope, Shrikhand, Bungee, and Archivo Black (temporary stand-in for the licensed Bowlby One SC).
- [x] Defined design tokens in `app/globals.css` (`@theme inline`): `--color-canvas/forest/orange/surface`, `--font-sans/brand/sub/display`; added `prefers-reduced-motion` handling, global focus-visible ring, smooth scroll.
- [x] Added base `Metadata` (title template, description, OpenGraph, Twitter, robots) to `app/layout.tsx`, plus a skip-to-content link.
- [x] Replaced the starter `app/page.tsx` with a minimal `#home` checkpoint section (full Hero/Skills/Projects/Contact composition comes in Task 3) and removed the unused starter SVGs from `public/`.
- [x] Added placeholder project imagery (`public/images/projects/*.svg`) referenced by the project data, using only palette colors. *(The same SVGs are also uploaded as Contentful assets, so the site serves them from `images.ctfassets.net` — see Task 4b.)*
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

## Task 3.5 — Styling Improvements ✅ Complete

**Working rule:** We go through these one at a time (header → hero → skills → projects → contact), and **none are marked complete until the user reviews and confirms each one**.

> All subtasks below are `[x]` — each was reviewed and approved by the user before being marked complete.

- [x] **Improve header (navbar) styling** — flat rounded forest-green pill, same width as the hero box (small margins only), no borders/rings; nav links About/Skills/Projects/Contact + Book a Call. **User confirmed.**
- [x] **Improve Hero section styling** — wide rounded forest-green box with small margins (matches navbar width), no borders; large rectangular photo (~half the hero width, tall) on the left, "Hey, I'm Jihad Chaalan / Full-Stack AI Engineer" + CTAs on the right. **User confirmed.**
- [x] **Improve Skills section styling** — section header with the orange highlighter-marker "Skills" title (Book a Call treatment); three alternating left/right white cards (85% width, 340px min-height) with GSAP-owned tilts (-1.2° / +2.8° / -1.2°), 25px gaps, corner overlaps, content vertically centered, and scroll-scrubbed reveal (fade + 100px rise) with a pause between boxes, reversible on scroll-up. **User confirmed.**
- [x] **Improve Projects section styling** — rebuilt as a responsive showcase. Desktop (lg+): pinned one-at-a-time GSAP scroll sequence — highlighted title column fixed left, each card glides into a stage spot centered in the area right of the title (per-card lifecycle timelines: entrance → hold → yield; gentle 0.6-viewport slides, 0.8-viewport spacing), 720px cards with height-capped 16:9 images, rounded-2xl + soft forest shadow. Below lg: pure-CSS swipe carousel (scroll-snap, one card per snap, constant height for any number of projects) with a "Swipe to explore" hint. Breakpoint owned by `gsap.matchMedia` (clean teardown/rebuild on resize). **User confirmed (desktop + mobile).**
- [x] **Improve Contact section styling** — compact two-column composition on the forest slab (narrower side margins via `Container wide`, large column gap): **left** = "HAVE A PROJECT IN MIND?" in large caps over the orange highlighter-marker "LET'S BUILD IT", then phone (`tel:`) and email (`mailto:`) icon rows and LinkedIn/GitHub icon buttons; **right** = the paper-styled form — a tilted white sheet with orange tape strips, torn bottom edge, dog-eared corner, ruled lines in the message box and underline-style fields, which straightens on focus and submits through Web3Forms (with a mailto fallback when no access key is configured). **User confirmed.**

## Task 3.6 — Hero Page-Load Intro ✅ Complete

- [x] `components/sections/HeroIntro.tsx` — page-load intro built on a single `gsap.timeline()`: a full-screen forest overlay (`z-[999]`) whose centred Shrikhand glyph walks the name **one letter at a time in name order** (J → I → H → A → D → ⟨beat⟩ → C → H → A → A → L → A → N, no random decoy letters), then the overlay shrinks into the real hero's **live-measured** rect (`power3.inOut`, function-based values so late font swaps can't skew it) and hands off invisibly; the page then reveals in staggered stages (nav + wordmark + eyebrow → headline → paragraph + chips → CTAs with the primary inking from muted to full orange, and the portrait springing in from bottom-left with `back.out(1.7)`).
- [x] Targets found via `data-intro` attributes on the existing Hero/Navbar elements, so content stays single-sourced; the component receives only the `wordmark` text (`siteConfig.name`).
- [x] Guards: plays once per page load (module flag — resets on reload, survives SPA navigations), skipped entirely under `prefers-reduced-motion` (overlay also `motion-reduce:hidden`), `gsap.context` cleanup on unmount.
- [x] Scroll is deliberately **never locked** — the scrollbar stays visible from first paint, so the layout viewport width never changes and neither the page content nor the `fixed` navbar shifts when the intro ends.
- [x] Visual confirmation of the intro (letter size/pacing) and of the no-shift fix. **User confirmed.**

## Task 3.7 — Project Content Swap ✅ Complete

- [x] Replaced the **Resume ATS Predictor** project with **Crypto Futures Alert** (`crypto-futures-alert`, category "Automation / Market Monitoring"), describing an automated Python script that monitors Binance USDT perpetual futures and sends Telegram alerts when predefined market conditions are met. No statistics, users, or outcomes invented. *(Originally applied to `data/projects.ts`, which has since been deleted — the content now lives in Contentful. See Task 4b.)*
- [x] New palette-matched placeholder imagery: `public/images/projects/crypto-card.svg` (1200×800) and `crypto-hero.svg` (1600×900) — abstract candlestick chart with an orange alert marker. Old `ats-card.svg` / `ats-hero.svg` deleted.
- [x] Updated `docs/PROJECT.md` §Projects and the Task 1 data record in this file so no doc references the removed project.
- [x] User review of the new card text and imagery. **User confirmed.** (The placeholder SVGs were subsequently replaced with real screenshots uploaded to Contentful — see Task 4b.)

## Task 4 — Project Pages ✅ Complete

- [x] `app/projects/[slug]/page.tsx` — statically prerendered per slug (`generateStaticParams` + `generateMetadata`); "build journey" design: editorial title block, back breadcrumb, taped-polaroid gallery, numbered journey-line stages (01 Problem → 02 Solution → 03 Overview → 04 Technologies & Deployment tool wall), gsap one-shot reveals.
- [x] `components/projects/ProjectGallery.tsx` — variable-count gallery (hero → card image → screenshots), taped-photo style, clickable thumbnails with `aria-pressed`.
- [x] `components/projects/ProjectDetailReveal.tsx` — shared one-shot reveal wrapper (reduced-motion aware).
- [x] Hero CTAs as "hang-tag" plates; card actions (View Details / Live Demo) restyled to match; back breadcrumb at top.
- [x] User review of the project detail pages on the Contentful-backed site. **User confirmed.**

## Task 4b — Contentful Integration (Phase 2) ✅ Complete — Contentful is the only data source

- [x] `contentful` SDK installed; `next.config.ts` `images.remotePatterns` for `images.ctfassets.net`.
- [x] `lib/contentful-client.ts` — server-only cached Delivery client; returns `null` when env vars missing.
- [x] `lib/contentful-mapper.ts` — entry → `Project` / `SkillCategory` normalization (asset `https:` + description→alt, empty URLs → `null`, JSON-array guards).
- [x] Repositories rewritten (bodies only, same signatures): Contentful when configured, with loud warning + static fallback when unconfigured/unreachable/**0 published entries**. `data/` deliberately kept as the fallback (dev/CI work with no credentials).
- [x] `.env.example` documented (`CONTENTFUL_SPACE_ID`, `CONTENTFUL_DELIVERY_ACCESS_TOKEN`, `CONTENTFUL_ENVIRONMENT`, plus the script-only `CONTENTFUL_MANAGEMENT_TOKEN`).
- [x] **`scripts/seed-contentful.ts` + `npm run seed:contentful` (later deleted — see below)** — one-off, idempotent Management-API seeder built on the plain client (`contentful-management` v12; the fluent `getSpace()/getEnvironment()` API is deprecated there). Uploaded the 6 placeholder images as assets, then created + published 3 `project` entries and 3 `skillCategory` entries, reading its content from the then-current `data/projects.ts` / `data/skills.ts`. Re-runs updated entries and reused assets (matched by title) instead of duplicating; never deleted anything.
- [x] Seed run against the real space: 3 projects + 3 skill categories created and published, 6 assets uploaded; second run confirmed idempotent (all "asset reused" / "entry updated").
- [x] **Build verified Contentful-powered:** with no fallback warning, all 3 `/projects/*` routes prerendered, and prerendered HTML referenced `https://images.ctfassets.net/...` with **zero** local `/images/projects/*` paths. Asset descriptions correctly carried through to `alt` text.

### Static data removed — Contentful is now the single source of truth

- [x] User finished authoring/editing the content in the Contentful space, so the static data was retired.
- [x] **Deleted `data/projects.ts`, `data/skills.ts`, and the `data/` directory.** (The content remains recoverable from git history — commit `699415a` is the last one touching `data/`.)
- [x] **Deleted `scripts/seed-contentful.ts` and the whole `scripts/` directory.** The seeder existed only to import the static data; keeping a content snapshot would (a) contradict "single source of truth" and (b) let a re-run silently overwrite the user's hand-edited Contentful content. Its dependencies were removed too: the `seed:contentful` npm script and the `contentful-management` + `tsx` devDependencies (7 packages pruned).
- [x] Repositories are now Contentful-only: `requireContentfulClient()` throws a setup error when the env vars are missing, a fetch failure is rethrown with the content type named, and **0 published entries now throws** (instead of falling back). The unused `getActiveDataSource()` helper was removed.
- [x] `lib/contentful-client.ts`, `types/project.ts`, `.env.example`, `docs/ARCHITECTURE.md` (stack line, folder tree, data-layer + content-model sections) and `docs/PROJECT.md` updated so no doc or comment points at the deleted files or calls Contentful a future/non-goal item.
- [x] Verified: `tsc` 0, `eslint .` 0, `next build` 0 with all 3 project routes prerendered and Contentful-sourced imagery.

## Task 4c — Reported bugs: scroll behavior ✅ Complete

- [x] **Navbar links stopped working after scrolling** — the scroll-spy only updated the highlight, never `location.hash`, so after scrolling from Projects into Contact the URL still said `#projects` and clicking "Projects" was a browser no-op. The spy now syncs the hash via `history.replaceState` (its initial callback is skipped, so a plain refresh still starts at the top), and nav clicks are intercepted to *always* scroll — including the same-hash case and "back to the section's top". Verified in a headless browser (7 scenarios). *(Committed by the user as `7cf68d0`.)*
- [x] **Project pages opened mid-scroll** — `ProjectDetailReveal` fired a global `ScrollTrigger.refresh()` from `document.fonts.ready` on every client-side navigation (fonts are already loaded there, so it resolved instantly). GSAP's `refresh()` scrolls to 0 to measure and then restores the position it remembered for the window scroller — which still belonged to the homepage — dragging the new project page down to that offset. New `lib/scroll-settle.ts` (`refreshWhenLayoutSettles`) queues that refresh only while fonts/images are genuinely still loading and skips it on client navigations, with an unmount guard; applied to all four components that had the pattern (`ProjectDetailReveal`, `ProjectsShowcase`, `SkillStack`, `ContactReveal`). Verified in a headless browser: scrolled homepage (2336) → "View Details" → opens at 0; the Back button still restores the homepage position. `tsc` / `eslint` / `build` clean.
- [ ] **Deferred breadcrumb deep-link (still open):** the "All Projects" breadcrumb navigates to `/#projects` but the homepage does not scroll to the section — Next's hash scroll never fires on that client navigation, and no hash-on-mount handling exists in the code. The pre-fix behavior only appeared to work *by accident* (the same stale GSAP restore landed where the user had been). Fix would be to honor `location.hash` on homepage mount once the layout settles. *User reports the site works after the two fixes above; treat this as a polish item for Task 5 unless it bothers them.*

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
