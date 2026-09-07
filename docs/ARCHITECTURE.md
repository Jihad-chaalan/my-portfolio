# ARCHITECTURE.md

## Stack

- **Next.js 16.3.4**, App Router, Turbopack (dev + build).
- **React 19**, **TypeScript 5** (strict mode).
- **Tailwind CSS v4** (CSS-first configuration — no `tailwind.config.js`; tokens live in `app/globals.css` via `@theme`).
- No additional runtime dependencies beyond what `create-next-app` installed. No animation library, no CMS SDK, no state-management library — none are needed for this project's scope.

> **Important:** this project pins Next.js 16.3.4, which has meaningful breaking changes vs. older Next.js knowledge (see the repo's `AGENTS.md`). Conventions below were verified against `node_modules/next/dist/docs/` at the time of writing, not from general training knowledge. Re-check that folder before assuming an older-Next.js pattern still applies.

## Folder structure

```text
app/                      # App Router routes (root-level, not src/app — this is
                           # the create-next-app default for this project and is
                           # a fully supported top-level layout per Next.js docs).
├── layout.tsx             # Root layout: fonts, global <head> metadata, skip link
├── page.tsx               # Homepage: composes Hero → Skills → Projects → Contact
├── globals.css            # Tailwind import + design tokens + base/reset styles
├── sitemap.ts             # Generated sitemap (added in Task 6)
├── robots.txt             # Static robots file (added in Task 6)
├── not-found.tsx          # Custom 404 (added in Task 5)
└── projects/
    └── [slug]/
        └── page.tsx       # Project detail route, generateMetadata + repository

components/
├── layout/                # Navbar, Footer, Container — app-wide shell pieces
├── ui/                    # Small reusable primitives: ButtonLink, SectionHeading...
├── sections/              # One component per homepage section (Hero, Skills, ...)
└── projects/               # ProjectCard, ProjectDetail and its subsections

data/                      # Local static content (Phase 1 data source)
├── projects.ts             # The 3 Project records
└── skills.ts                # The 3 SkillCategory records

types/                     # Shared, presentation-agnostic TypeScript types
├── project.ts
├── skill.ts
└── index.ts                # Barrel re-export

lib/                       # Data-access + site config (no React here)
├── project-repository.ts   # getAllProjects / getFeaturedProjects / getProjectBySlug / getAllProjectSlugs
├── skills-repository.ts    # getSkillCategories
└── site.ts                  # siteConfig (name, urls, contact links) + navLinks

public/images/projects/     # Placeholder project imagery (SVG), referenced by data/projects.ts

docs/                       # This documentation set
```

`app/` stays at the repository root (not under `src/`) because that is what `create-next-app` generated for this project and Next.js treats it as a fully standard top-level layout. There was no existing convention to preserve otherwise, and introducing a `src/` wrapper would add a layer without benefit.

## Component hierarchy

```text
RootLayout (app/layout.tsx)                     [Server Component]
├── Navbar                                       [Client Component — scroll spy + mobile menu]
├── main#main-content
│   └── children (page-specific content)
└── Footer                                       [Server Component]

Homepage (app/page.tsx)                          [Server Component]
├── Hero            (#home)
├── Skills          (#skills)
│   └── SkillCard × 3
├── Projects        (#projects)
│   └── ProjectCard × N (from getFeaturedProjects / getAllProjects)
└── Contact         (#contact)

Project detail (app/projects/[slug]/page.tsx)    [Server Component, generateMetadata]
└── ProjectDetail
    ├── ProjectHero (title, tagline, hero image, links)
    ├── ProjectOverview (overview / problem / solution)
    ├── ProjectArchitecture
    ├── ProjectFeatureList
    ├── ProjectTechStack
    ├── ProjectChallenges
    ├── ProjectOutcomes (rendered only if outcomes exist)
    └── ProjectScreenshots (rendered only if screenshots exist)
```

Only components that need interactivity (`Navbar` mobile menu / active-link highlighting) are Client Components (`"use client"`). Everything else — including both page-level routes and all section/detail components — is a Server Component by default, per Next.js 16 guidance to minimize client JavaScript.

## Data layer & project model

The brief requires that Contentful can be introduced later **without rewriting the UI**. This is achieved with a strict layering:

```text
UI Components  (components/sections, components/projects, app/*)
      ↓  (only ever call functions from lib/*-repository.ts)
Repository     (lib/project-repository.ts, lib/skills-repository.ts)
      ↓  (Phase 1 implementation reads from data/*)
Local Static Data (data/projects.ts, data/skills.ts)
```

Rules that make this swap-safe:

- **Components never import `data/projects.ts` or `data/skills.ts` directly.** They call `getAllProjects()`, `getFeaturedProjects()`, `getProjectBySlug(slug)`, `getAllProjectSlugs()`, or `getSkillCategories()` from `lib/*-repository.ts`.
- **Repository functions are `async`**, even though the Phase 1 implementation is synchronous under the hood. This means call sites (`await getAllProjects()`) already match the shape a network-backed repository (e.g. calling the Contentful Delivery API) will need — no call site changes when the backing implementation changes.
- **The `Project` and `SkillCategory` types in `types/` are the contract.** They are deliberately generic/normalized (plain strings, string arrays, nested plain objects) and contain no Contentful-specific shapes (no rich-text nodes, asset link objects, etc.). Any CMS response must be mapped into this shape inside the repository before it's returned.
- **Images are referenced by data, not hardcoded in components.** `Project.image`, `Project.heroImage`, and `Project.screenshots` are `{ src, alt }` objects consumed via `next/image`, so swapping placeholder SVGs for real screenshots — or Contentful asset URLs — never touches a component.

### Future Contentful integration strategy

When Contentful is introduced:

1. Add the Contentful SDK as a dependency and define environment variables for space ID / access token.
2. Create a new file, e.g. `lib/contentful-client.ts`, encapsulating the SDK client (marked so it only runs server-side).
3. Rewrite the **bodies** of the functions in `lib/project-repository.ts` (and `skills-repository.ts`, if desired) to fetch from Contentful and map the response into the existing `Project` / `SkillCategory` shape.
4. Delete or stop importing `data/projects.ts` / `data/skills.ts` once the migration is verified — nothing else changes.
5. No component, page, or type in `components/`, `app/`, or `types/` needs to change.

This is intentionally the **only** place Contentful-awareness should ever live.

## Routing

- `/` — homepage, single scrolling page with `#home #skills #projects #contact` anchors.
- `/projects/[slug]` — one route per project, statically generated via `generateStaticParams` reading `getAllProjectSlugs()`. Uses the Next.js 16 typed route helper `PageProps<'/projects/[slug]'>` where applicable.
- `/not-found` (via `app/not-found.tsx`) — friendly custom 404, added in the Quality task.

All routes are Server Components; `generateMetadata` is used on the project detail route for per-project SEO/OG metadata.

## Styling strategy

Tailwind v4's CSS-first configuration is used: design tokens (colors, font family variables) are declared once in `app/globals.css` under `@theme`, generating utilities like `bg-canvas`, `text-forest`, `bg-orange`, `bg-surface`, `font-sans` (Manrope), `font-brand` (Shrikhand), `font-sub` (Bungee), and `font-display` (Archivo Black, standing in for Bowlby One SC — see `DESIGN.md`). No `tailwind.config.js` is needed or added, matching the version of Tailwind already installed.

## SEO

- Root `Metadata` in `app/layout.tsx` (title template, description, Open Graph, Twitter card, robots).
- `generateMetadata` per project detail page.
- `app/sitemap.ts` and `app/robots.txt` (Task 6) list the homepage and all project routes.
- Single `<h1>` per page; sections use `<h2>`; cards use `<h3>`.

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `section[aria-label]`, `footer`).
- Skip-to-content link in the root layout.
- Visible `:focus-visible` ring using the orange accent on all interactive elements.
- `prefers-reduced-motion` respected globally in `globals.css` (disables smooth scroll and shortens transitions/animations).

## Performance

- Server Components by default; `"use client"` reserved for the navbar's interactive state.
- `next/font/google` self-hosts all four typefaces (no third-party font requests).
- `next/image` for all project imagery (local SVG placeholders use `unoptimized` since they're already vector/lightweight; this flag is removed once real raster screenshots replace them).
