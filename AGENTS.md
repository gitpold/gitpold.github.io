<!-- BEGIN:nextjs-agent-rules -->
# ⚠️ This is NOT the Next.js you know

This version (16.x) has breaking changes — APIs, conventions, and file structure
may all differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# gitpold.github.io — Leopold Ormos — Personal Website

Portfolio and personal website for **Leopold Ormos**, Software Architect at
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
npm run lint     # ESLint — keep this warning-free
```

There is deliberately **no** `npm start`: `next start` cannot serve a static export.

## Repository Layout

```
app/
  layout.tsx     # Root layout — Inter font, metadata for Leopold Ormos
  page.tsx       # Single-page portfolio (About / Experience / Education /
                 #   Projects / Contact). All sections and components in one file.
  FlowBackground.tsx  # Ambient animated background (SVG + CSS, no scripting)
  globals.css    # Tailwind v4 entry: @import "tailwindcss", custom @theme tokens
  icon.svg       # Favicon (LO initials)
public/
  profile.jpg    # Profile photo (referenced in app/page.tsx)
  CNAME          # Custom domain (leopold.ormos.me) — copied to out/ by the export
.github/workflows/deploy.yml  # CI: push to main → build → GitHub Pages
next.config.ts   # output: "export", images: { unoptimized: true }
```

There is no `components/` directory — page content is co-located in
`app/page.tsx`, with `FlowBackground.tsx` split out only because of its size.
Create a `components/` directory only once a second route exists to share with.

## Design Tokens & Theme

The site uses a **dark teal** palette. Key values:

| Token | Value | Where |
|---|---|---|
| Page background | `#0c3d52` | `body` in `globals.css` + `bg-[#0c3d52]` on root `div` |
| Overlay glow | `rgba(191,219,254,0.06)` | radial gradient in `page.tsx` |
| Scrollbar track | `#0c3d52` | `globals.css` |
| Scrollbar thumb | `#1a6a82` | `globals.css` |
| Tailwind `blue-200` | `#bfdbfe` | overridden in `@theme` |
| Tailwind `blue-300` | `#93c5fd` | overridden in `@theme` |
| Font | Inter (Google) | `--font-inter` via `next/font/google` |

When modifying styles, keep this palette consistent.

**Contrast:** on `#0c3d52`, `text-slate-400` is ~4.4:1 and `text-slate-500` only
~2.4:1. Use `slate-400` or lighter for text; never `slate-500` (it is fine for
non-text decoration such as the inactive nav rule).

## Page Architecture (`app/page.tsx`)

The home page is a **`"use client"`** component because it uses `useEffect` /
`useState` for active-section tracking (IntersectionObserver). This is intentional.

Key structures:
- `NAV_ITEMS` — array of `{id, label}` used by both the sidebar nav and `<section id>`
  anchors. **Every entry must have a matching section**, or the nav link is a dead
  anchor that never highlights.
- `Card` — the one card used by Experience, Education and Projects. Omit `date` and the
  body spans the full grid; `description`, `skills` and `children` are all optional and
  render nothing when empty.
- `Thesis` — optional `children` block for education cards.
- `SectionHeading` — sticky heading on mobile, visually hidden (`lg:sr-only`) on desktop.
  Don't add positioning utilities alongside `lg:sr-only`; `lg:relative` and friends
  override its `position: absolute` and break it.
- `GitHubIcon` / `LinkedInIcon` / `MailIcon` — take an optional `className`, defaulting
  to `h-6 w-6`. Keep every icon in a given row the same size.

To add a section: add to `NAV_ITEMS`, add `<section id="…">` in `<main>`, add content inline or in a data file.

The Skills section and most of the body copy are currently commented out in
`page.tsx`. That is drafted content waiting to be enabled, not dead code — leave it.

## Ambient background (`app/FlowBackground.tsx`)

Braided threads of light drifting behind the content. Static SVG plus CSS
keyframes — no hooks, no per-frame scripting, and fully disabled under
`prefers-reduced-motion`.

Things that will break it if changed carelessly:

- **`isolate` on the page root in `page.tsx`.** Without that stacking context,
  the background's `-z-10` layer paints *behind* the root div's background and
  vanishes.
- **The seeded PRNG.** The layout is generated at module scope from `SEED`.
  Never use `Math.random()` here: the page is statically prerendered, so the
  build and the client would generate different layouts and hydration would
  mismatch. Reroll the composition by changing `SEED`, not by unseeding it.
- **`preserveAspectRatio="none"`.** Needed for full coverage; `slice` crops
  roughly 30% of the height on a 16:9 screen and leaves bare bands.
- **Braid placement is stratified** across horizontal bands and anchored to each
  braid's centre. Uniformly random placement leaves visible bare stripes.

Density and intensity knobs: `BRAID_COUNT` (12), `strandCount` (2–4), and the
group `opacity` (0.14). It currently renders 36 strands as 72 animated paths —
worth re-checking mobile performance if that count goes up.

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
