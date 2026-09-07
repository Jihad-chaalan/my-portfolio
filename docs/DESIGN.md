# DESIGN.md

## Color palette

The palette is fixed and intentional. Do not introduce additional colors except where strictly required for accessibility states (e.g. a form error color), and prefer reusing the existing palette for those first.

| Token             | Hex       | CSS variable      | Tailwind utility examples          | Role                                   |
| ----------------- | --------- | ------------------ | ----------------------------------- | --------------------------------------- |
| Background Yellow | `#FAF2A0` | `--color-canvas`   | `bg-canvas`, `text-canvas`          | Page background, light surfaces         |
| Forest Green       | `#012F25` | `--color-forest`   | `bg-forest`, `text-forest`          | Primary text, dark surfaces, nav/footer |
| Orange Accent      | `#FC7D14` | `--color-orange`   | `bg-orange`, `text-orange`, borders | CTAs, focus rings, highlights           |
| White              | `#FFFFFF` | `--color-surface`  | `bg-surface`, `text-surface`        | Cards/panels needing separation         |

Tokens are declared once in `app/globals.css` under `@theme inline`, so every component uses the same four semantic utilities rather than raw hex values.

### Usage principles

- Yellow is the default page background — the site should feel warm and bright, not sterile white.
- Forest green carries almost all text and dark UI surfaces (nav, footer, dark project cards) — it is the "ink" of the design.
- Orange is reserved for calls-to-action, links-on-hover, focus states, and small accents — never a full-page background.
- White is used sparingly for cards/panels that need to visually separate from the yellow canvas (e.g. a light project card sitting on the yellow background).
- No gradients, no glassmorphism, no glow/shadow effects beyond simple, flat drop shadows for depth if needed. Hierarchy comes from typography, spacing, and color blocking — not effects.

## Typography

Four typefaces, each with a single, strict role. Loaded via `next/font/google` in `app/layout.tsx` (self-hosted, no third-party requests) and exposed as CSS variables consumed by `app/globals.css` tokens.

| Role                                   | Font              | Token / utility          | Google Fonts | License |
| --------------------------------------- | ----------------- | -------------------------- | ------------ | ------- |
| Branding / name                        | **Shrikhand**      | `--font-brand` / `font-brand` | Yes       | OFL (free, commercial use permitted) |
| Hero title, major section headings     | **Bowlby One SC*** | `--font-display` / `font-display` | No (see note) | Commercial — must be licensed |
| Project names, skill-card headings     | **Bungee**         | `--font-sub` / `font-sub`   | Yes       | OFL (free, commercial use permitted) |
| Body text, nav, buttons, descriptions  | **Manrope**        | `--font-sans` / `font-sans` (default) | Yes | OFL (free, commercial use permitted) |

\* **Temporary stand-in:** Bowlby One SC is a commercial display font not available on Google Fonts. Until a licensed font file is supplied, `--font-display` is mapped to **Archivo Black** (free, Google Fonts, OFL), which shares Bowlby One SC's heavy, bold, condensed display character. This is defined in exactly one place — the `Archivo_Black` `next/font/google` call in `app/layout.tsx` — so swapping to the real Bowlby One SC later only requires:

1. Add the licensed font file under `app/fonts/`.
2. Replace the `Archivo_Black` import/call with `localFont({ src: "./fonts/bowlby-one-sc.woff2", variable: "--font-display" })`.
3. No component changes — every heading already targets `font-display`.

### Hierarchy (strict, per the brief)

```text
Shrikhand        → name / branding only
      ↓
Bowlby One SC     → hero title, section headings (H2) — sparse, decorative
      ↓
Bungee            → project names, skill-card headings (H3) — sparse, decorative
      ↓
Manrope           → everything else (body, nav, buttons, descriptions)
```

Decorative fonts (Shrikhand, Bowlby One SC/Archivo Black, Bungee) are never used for paragraphs, descriptions, or long-form text. Manrope is the only body typeface.

### Responsive type scale

Decorative headings use fluid sizing (Tailwind responsive classes moving from smaller mobile sizes up to larger desktop sizes, e.g. `text-4xl sm:text-6xl`) rather than a single fixed size, specifically so Bowlby One SC/Archivo Black and Bungee never overflow their container or wrap awkwardly on narrow screens. Long project names in Bungee should be allowed to wrap onto two lines on mobile rather than shrink below a readable size.

## Design principles

- **Modern, bold, technical, premium, minimal but expressive.** Whitespace and typography create hierarchy — not effects.
- **No generic AI portfolio tropes:** no blue/purple gradients, no glassmorphism, no random glow, no stock AI imagery, no oversized dashboards.
- **Flat color blocking over gradients.** Sections alternate between the yellow canvas and forest-green blocks (e.g. footer, contact CTA) for rhythm.
- **Restraint with decorative fonts.** Every use of Shrikhand, Bowlby One SC (Archivo Black), and Bungee should be deliberate and infrequent — one or two elements per section, never body copy.
- **Real product framing for projects.** Project cards and detail pages emphasize architecture and decisions, not just a feature list — this is what separates the site from a student-project portfolio.

## Responsive behavior

- Mobile-first layout: single column by default, expanding to multi-column grids at `sm`/`md`/`lg` breakpoints.
- Skills: 1 column (mobile) → 3 columns (desktop), each card keeping equal visual weight.
- Projects: 1 column (mobile) → 2–3 column grid (desktop), with the two featured AI projects visually prioritized.
- Navigation collapses into an accessible mobile menu below the `md` breakpoint; desktop shows the full inline nav.
- Buttons and links maintain a minimum 44×44px touch target on mobile.
- Section vertical padding shrinks proportionally on smaller viewports rather than being fixed, to avoid excessive scroll distance on mobile.

## Component styling rules

- Prefer Tailwind utility classes directly in components; only introduce a shared class (in `globals.css`) for patterns repeated 3+ times (e.g. the skip-link focus pattern already centralized there).
- Buttons: solid orange background with forest text for primary CTAs, forest outline/ghost style for secondary actions — consistent radius and padding via a shared `ButtonLink` component (`components/ui`).
- Cards: flat backgrounds (surface white or forest), a single accent border or top bar in orange where emphasis is needed, no heavy box-shadows or excessive rounding.
- All interactive elements must show a visible `:focus-visible` outline (globally defined in `globals.css` using the orange accent) — this must never be overridden per-component.
- Animations are CSS-only (transitions on hover/focus, simple entrance transitions), always respecting `prefers-reduced-motion` (handled globally in `globals.css`).
