<!-- BEGIN:nextjs-agent-rules -->
# ⚠️ This is NOT the Next.js you know

This version (16.x) has breaking changes — APIs, conventions, and file structure
may all differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# gitpold.github.io — Leopold Ormos — Personal Website

Portfolio and personal website for **Leopold Ormos**, Software Engineer at
Robert Bosch GmbH in Stuttgart. Static site deployed to GitHub Pages.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| UI | React 19.2.4 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 (PostCSS approach, no `tailwind.config.js`) |
| Deployment | GitHub Pages (static export via `output: "export"`) |

## Critical Constraints

**Static export** (`output: "export"` in `next.config.ts`):
- **NO** Next.js API routes — `app/api/` paths will not build
- **NO** server-side rendering at request time
- **NO** middleware
- Images use `unoptimized: true` (already configured)
- All pages must be statically renderable at build time

## Commands

```bash
npm run dev      # Dev server on http://localhost:3000 (Turbopack)
npm run build    # Build + export to ./out/ (static HTML)
npm run lint     # ESLint
```

## Repository Layout

```
app/
  layout.tsx     # Root layout — Inter font, metadata for Leopold Ormos
  page.tsx       # Single-page portfolio (About / Experience / Education /
                 #   Skills / Projects / Contact). All sections in one file.
  globals.css    # Tailwind v4 entry: @import "tailwindcss", custom @theme tokens
components/      # Reusable React components (currently empty — co-located in app/)
public/
  profile.jpg    # Profile photo (referenced in app/page.tsx)
.github/workflows/deploy.yml  # CI: push to main → build → GitHub Pages
next.config.ts   # output: "export", images: { unoptimized: true }
```

## Design Tokens & Theme

The site uses a **dark teal** palette. Key values:

| Token | Value | Where |
|---|---|---|
| Page background | `#0c3d52` | `bg-[#0c3d52]` on root `div` |
| Overlay glow | `rgba(191,219,254,0.06)` | radial gradient in `page.tsx` |
| Scrollbar track | `#0c3d52` | `globals.css` |
| Scrollbar thumb | `#1a6a82` | `globals.css` |
| Tailwind `blue-200` | `#bfdbfe` | overridden in `@theme` |
| Tailwind `blue-300` | `#93c5fd` | overridden in `@theme` |
| Font | Inter (Google) | `--font-inter` via `next/font/google` |

When modifying styles, keep this palette consistent.

## Page Architecture (`app/page.tsx`)

The home page is a **`"use client"`** component because it uses `useEffect` /
`useState` for active-section tracking (IntersectionObserver). This is intentional.

Key structures:
- `NAV_ITEMS` — array of `{id, label}` used by both the sidebar nav and `<section id>` anchors
- `SKILLS` — object mapping category → string[] rendered as tag pills
- `ExperienceCard`, `EducationCard`, `ProjectCard` — reusable card components
- `SectionHeading` — sticky heading on mobile, visually hidden (`lg:sr-only`) on desktop

To add a section: add to `NAV_ITEMS`, add `<section id="…">` in `<main>`, add content inline or in a data file.

## Tailwind CSS v4

v4 uses a **PostCSS-first** approach — no `tailwind.config.js`:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-brand: oklch(65% 0.2 250);   /* example custom token */
}
```

- Plugin API changed from v3 — verify compatibility before adding plugins.
- Utility class names are identical to v3.

## Code Style

- TypeScript strict — no `any`, no `!` non-null assertion without a comment.
- React Server Components by default; `"use client"` only for hooks / browser APIs.
- Named exports for components; default export only for Next.js page/layout files.
- Import order: React → Next.js → third-party → `@/components` → relative.
- Tailwind utilities via `className`; no CSS Modules; no inline `style` except for
  dynamic values that can't be expressed as utilities (e.g. the radial gradient).
