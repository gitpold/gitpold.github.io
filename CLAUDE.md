@AGENTS.md

## Claude Code Notes

### Quick start
```bash
npm install          # install deps
npm run dev          # http://localhost:3000
```

### Where to look
- Everything on the page, including its components → `app/page.tsx`
- Page metadata, fonts → `app/layout.tsx`
- Styles → Tailwind utilities in JSX or `@theme` tokens in `app/globals.css`

There is no `components/` directory; the site is one route.

### Static export reminder
`next.config.ts` sets `output: "export"`.
API routes and server-only runtime code won't build.
