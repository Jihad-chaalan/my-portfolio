# ARCHITECTURE.md

## Stack

- **Next.js 16.3.4**, App Router, Turbopack (dev + build).
- **React 19**, **TypeScript 5** (strict mode).
- **Tailwind CSS v4** (CSS-first configuration — no `tailwind.config.js`; tokens live in `app/globals.css` via `@theme`).
- **gsap** — the only animation library, used for the hero page-load intro and the one-shot section/detail reveals.
- **contentful** (Delivery API SDK) — projects and skills are authored in Contentful; there is no local static content.
- No state-management library — none is needed for this project's scope.

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

types/                     # Shared, presentation-agnostic TypeScript types
├── project.ts
├── skill.ts
└── index.ts                # Barrel re-export

lib/                       # Data-access + site config (no React here)
├── contentful-client.ts   # Server-only Delivery API client (only Contentful-aware module)
├── contentful-mapper.ts   # Contentful entry → Project / SkillCategory
├── project-repository.ts  # getAllProjects / getFeaturedProjects / getProjectBySlug / getAllProjectSlugs
├── skills-repository.ts   # getSkillCategories
└── site.ts                # siteConfig (name, urls, contact links) + navLinks

public/images/projects/     # Placeholder project imagery (SVG) — also uploaded as Contentful assets

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

Content is authored in **Contentful** and fetched at build/render time through the Delivery API. The brief required that introducing Contentful later would not mean rewriting the UI — that layering is what made this migration a data-layer-only change:

```text
UI Components  (components/sections, components/projects, app/*)
      ↓  (only ever call functions from lib/*-repository.ts)
Repository     (lib/project-repository.ts, lib/skills-repository.ts)
      ↓  (map entries via lib/contentful-mapper.ts)
Contentful Delivery API  (content types: project, skillCategory)
```

Rules that keep this swap-safe:

- **Components never import Contentful or any data source directly.** They call `getAllProjects()`, `getFeaturedProjects()`, `getProjectBySlug(slug)`, `getAllProjectSlugs()`, or `getSkillCategories()` from `lib/*-repository.ts`.
- **Repository functions are `async`** — call sites already used `await getAllProjects()`, so moving from local files to a network API required no call-site changes.
- **The `Project` and `SkillCategory` types in `types/` are the contract.** They are deliberately generic/normalized (plain strings, string arrays, nested plain objects) and contain no Contentful-specific shapes (no rich-text nodes, asset link objects, etc.). `lib/contentful-mapper.ts` maps CMS responses into this shape before they're returned.
- **Images are referenced by data, not hardcoded in components.** `Project.image`, `Project.heroImage`, and `Project.screenshots` are `{ src, alt }` objects consumed via `next/image`, so the move from local placeholder SVGs to `images.ctfassets.net` URLs touched nothing but the data source. Asset **descriptions** in Contentful become the `alt` text.
- **Contentful is the single source of truth.** The local static data (`data/projects.ts`, `data/skills.ts`) was deleted after the migration was verified. A missing configuration, an unreachable API, or an empty space therefore **throws with an actionable message** instead of silently rendering an empty portfolio.

### Contentful integration (current)

- `lib/contentful-client.ts` — the **only** module aware of Contentful. Exposes `getContentfulConfig()`, a lazily-created cached client (`getContentfulClient()`), and `requireContentfulClient()` (used by the repositories; throws with setup instructions when the env vars are missing). Server-only: calling it from client code throws.
- `lib/contentful-mapper.ts` — pure functions mapping entries → `Project` / `SkillCategory`: normalizes asset URLs to `https:`, uses the asset description as `alt` (title as fallback), turns empty `demoUrl` / `githubUrl` fields into `null` (which renders the disabled "Live Demo" button), and validates the JSON-array fields with clear errors.
- `next.config.ts` — registers `images.remotePatterns` for `images.ctfassets.net`.
- Environment variables (see `.env.example`): `CONTENTFUL_SPACE_ID`, `CONTENTFUL_DELIVERY_ACCESS_TOKEN`, `CONTENTFUL_ENVIRONMENT`. They must be present locally **and** in the hosting provider's environment.

Content types and their fields (as authored in the space):

| Content type | Fields |
|---|---|
| `project` | `slug` (unique), `name`, `category`, `tagline`, `summary`, `overview`, `problem`, `solution`, `architecture`, `keyFeatures` (JSON string array), `technologies` (JSON string array), `challenges` (JSON array of `{title, body}`), `outcomes` (JSON string array), `image` (media), `heroImage` (media), `screenshots` (media, many), `demoUrl`, `githubUrl`, `featured` (boolean) |
| `skillCategory` | `id` (unique), `title`, `description`, `items` (JSON string array) |

Lists are modelled as single **JSON object** fields because Contentful has no "array of strings" field type, and these lists are display-only (nothing links to or publishes them individually). That keeps one entry per project/skill card and makes the mapper a pass-through.

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
