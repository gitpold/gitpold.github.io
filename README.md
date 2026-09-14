# gitpold.github.io

Personal website and portfolio for Leopold Ormos — [leopold.ormos.me](https://leopold.ormos.me).

A single-page static site: Next.js App Router, exported to plain HTML and served
from GitHub Pages.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 (PostCSS, no `tailwind.config.js`) |
| Font | Inter, via `next/font/google` |
| Hosting | GitHub Pages |

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
npm run lint     # ESLint
```

There is no `npm start` — `next.config.ts` sets `output: "export"`, so the build
produces static files rather than a server to run.

## Layout

```
app/
  layout.tsx    # root layout: Inter font, page metadata
  page.tsx      # the whole page — sidebar, sections, and the shared Card component
  globals.css   # Tailwind entry point and @theme tokens
  icon.svg      # favicon
public/
  profile.jpg   # profile photo
  CNAME         # custom domain for GitHub Pages
```

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site and publishes `out/` to GitHub Pages. The custom domain is
configured by `public/CNAME`, which the export copies to the site root.

## Agent instructions

[`AGENTS.md`](AGENTS.md) documents the project conventions for coding agents;
[`CLAUDE.md`](CLAUDE.md) adds Claude Code-specific notes on top of it.
