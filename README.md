# Jihad Chaalan — Full-Stack AI Engineer

Personal portfolio for **Jihad Chaalan**, an independent Full-Stack AI Engineer and freelance developer. The site presents practical AI and web development work, including RAG systems, LLM applications, AI agents, chatbots, workflow automation, APIs, and complete frontend-to-backend products.

## What the site showcases

- AI agents and LLM-powered applications
- Retrieval-Augmented Generation (RAG) systems
- Chatbots and business workflow automation
- Full-stack web applications
- React, Next.js, TypeScript, Python, and FastAPI development
- API design, integrations, deployment, and production-oriented engineering
- Detailed project case studies with problem, solution, architecture, technologies, and outcomes

## Tech stack

- Next.js 16.3.4 App Router and Turbopack
- React 19 and TypeScript 5
- Tailwind CSS v4
- Contentful Delivery API for projects and skills
- GSAP for page-load and section animations
- Web3Forms for contact form delivery

## Requirements

- Node.js compatible with the installed Next.js version
- npm
- A Contentful space containing published project and skill-category entries

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template:

   ```bash
   copy .env.example .env.local
   ```

   On macOS/Linux, use `cp .env.example .env.local` instead.

3. Add the required values to `.env.local`:

   ```env
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_DELIVERY_ACCESS_TOKEN=your_delivery_api_token
   CONTENTFUL_ENVIRONMENT=master
   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_web3forms_key
   ```

   Contentful variables are required. The Web3Forms key enables inbox delivery; without it, the form falls back to `mailto:`.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Contentful

Contentful is the source of truth for the portfolio content. The site expects these content types:

- `project` — project name, slug, descriptions, images, technologies, links, and outcomes
- `skillCategory` — skill category title, description, and related technologies

Use a **Content Delivery API** token, not a Management API token. Entries and image assets must be published because draft entries are not returned by the Delivery API.

The repository layer in `lib/` maps Contentful responses into normalized TypeScript models. Components do not access Contentful directly.

## Useful commands

```bash
npm run dev       # Start development
npm run lint      # Run ESLint
npm run build     # Create a production build
npm run start     # Start after building
npx tsc --noEmit  # TypeScript check
```

## Routes and SEO

- `/` — portfolio homepage
- `/projects/[slug]` — project detail pages from Contentful
- `/sitemap.xml` — generated sitemap for the homepage and projects
- `/robots.txt` — generated crawler rules pointing to the sitemap
- `/does-not-exist` — custom 404 page

Metadata describes Jihad as an independent freelance AI engineer and lists relevant services and technologies. Sitemap and robots files support discovery and crawling, but search visibility also depends on useful content, technical quality, backlinks, and indexing.

## Project structure

```text
app/                    # Next.js App Router routes and metadata
components/layout/      # Navbar, footer, and layout components
components/projects/    # Project cards, galleries, and detail UI
components/sections/    # Hero, skills, projects, and contact sections
lib/                    # Contentful repositories, mapping, and site config
types/                  # Shared TypeScript models
public/                 # Local images and static assets
docs/                   # Architecture, design, project, and task documentation
```

## Deployment

The project can be deployed to Vercel or another Node-compatible host:

1. Add all variables from `.env.local` to the hosting provider.
2. Build with `npm run build`.
3. Start with `npm run start`, or use the provider's Next.js integration.
4. Update the production URL in `lib/site.ts` if the domain changes.
5. Verify the homepage, project pages, contact form, `/sitemap.xml`, and `/robots.txt`.

## Documentation

- `docs/ARCHITECTURE.md` — application structure and data flow
- `docs/DESIGN.md` — visual system and typography
- `docs/PROJECT.md` — project requirements and content guidance
- `docs/TASKS.md` — implementation progress
