@AGENTS.md

## Claude Code Notes

### Quick start
```bash
npm install          # install deps
npm run dev          # http://localhost:3000
```

### Where to look
- New UI component → `components/`
- Page → `app/<route>/page.tsx`
- Styles → Tailwind utilities in JSX or `@theme` tokens in `app/globals.css`

### Static export reminder
`next.config.ts` sets `output: "export"`.
API routes and server-only runtime code won't build.
