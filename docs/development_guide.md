# Development Guide

## Requirements

- Node.js 20.19+ (Next.js 16 and OpenSpec). Vercel uses its default Node LTS.
- npm (the repo has `package-lock.json`; use `npm ci` for clean installs).
- Optional: OpenSpec CLI for the spec-driven workflow: `npm install -g @fission-ai/openspec@latest`.

## Setup

```bash
npm ci
cp .env.example .env.local   # fill NEXT_PUBLIC_WHATSAPP at least
npm run dev                  # http://localhost:3000
```

## Environment variables

| Variable | Required | Used by | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITIO_URL` | Recommended | metadata, sitemap, JSON-LD, origin check | Defaults to `https://cosa-vela.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP` | Yes for real orders | WhatsApp links | Digits only with country code (`506…`). Empty = WhatsApp lets the user pick a contact |
| `RESEND_API_KEY` | Optional | `/api/cotizacion` | Without it, quotes fall back to WhatsApp |
| `COTIZACION_PARA` | Optional | `/api/cotizacion` | Destination inbox |
| `COTIZACION_DESDE` | Optional | `/api/cotizacion` | Verified Resend sender |

Never commit `.env.local` (ignored by `.gitignore`). Configure production values in Vercel → Project → Settings → Environment Variables.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build (needs network access to Google Fonts) |
| `npm start` | Serve the production build |
| `npm run typecheck` | `next typegen` (generates `PageProps` and route types) + `tsc --noEmit` |
| `npm test` | Vitest unit tests, single run |
| `npm run test:watch` | Vitest in watch mode |

Before every commit: `npm test && npm run typecheck`. Before a pull request: also `npm run build`.

## Workflow

1. Branch from `main` (`feature/<change-name>` or `fix/<change-name>`).
2. For anything beyond a trivial fix, use OpenSpec: `/opsx:propose` → review → `/opsx:apply` → `/opsx:archive`. Context lives in `openspec/config.yaml`.
3. Write the failing test first for logic in `src/lib/` or route handlers.
4. Update the affected docs (see `documentation-standards.md`).
5. Open a pull request. Vercel builds a preview for each PR; `main` deploys to production.

## Deployment (Vercel)

- Framework preset: Next.js. Build command `npm run build`, output managed by Next.
- Push to `main` = production deploy. Merge only after reviewing the PR preview.
- Product photos go in `public/img/productos/` and are referenced from `imagen` in `src/lib/productos.ts`.

## Business content to confirm before launch

Search for `CONFIRMAR` in `src/`: Instagram, email, delivery rates, box base prices and the story in `nosotros/page.tsx`. Product prices are sample values.
