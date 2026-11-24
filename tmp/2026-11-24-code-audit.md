# CosaVela code audit — 2026-11-24

Skill: `ai-specs/skills/code-auditing`. Scope: all of `src/` (39 files, ~2.9k lines), `next.config.ts`, `package.json`.
Rule for this pass: fix bugs, security and quality issues only. Copy, prices, design and purchase flow stay as they are.

## Executive summary

The codebase is small and generally solid: strict TypeScript, a strict CSP and security headers, input sanitizing,
HTML escaping in emails, a honeypot and per-IP rate limit on the quote API. `npm audit`: 0 vulnerabilities.

Four real defects were found and fixed. Two known limitations are documented, not changed.

## Baseline

| Check | Before | After |
| --- | --- | --- |
| `npm run typecheck` | **Fails** on a clean checkout (`PageProps` not found) | Passes |
| Unit tests | None (no test runner) | 20 tests, Vitest, all passing |
| `next build` | Passes on Vercel (fonts blocked in the audit sandbox; verified with fonts stubbed) | Passes |
| `npm audit --omit=dev` | 0 vulnerabilities | 0 vulnerabilities |

## Findings

### 1. High — Custom box price trusted from the browser
- **Where:** `src/components/Carrito.tsx` (`sanear`), `src/components/ArmaCaja.tsx`.
- **Problem:** catalog products were re-priced from the catalog, but "Arme su caja" lines stored `precio` and `contenido`
  in `localStorage` and those values were trusted on reload. Anyone could edit the stored price and the WhatsApp order
  would show it. The README says prices are always recalculated from the catalog; for boxes that was false.
- **Fix:** boxes now store only references (`caja: { tamano, items, dedicatoria }`). `calcularCaja()` in
  `src/lib/productos.ts` validates size, capacity, "at least one candle" and buildable items, and computes price and
  contents. `sanear()` (moved to `src/lib/carrito.ts`) uses it on every load. Invalid or legacy box lines are dropped.
- **Side effect:** custom boxes saved in a browser before this change are removed from that cart on next visit.
  Catalog products in the cart are kept.
- **Tests:** `src/lib/productos.test.ts`, `src/lib/carrito.test.ts`.

### 2. High — Order lost if the browser blocks the WhatsApp window
- **Where:** `src/components/FormularioPedido.tsx`.
- **Problem:** the cart was emptied right after `window.open()`. With `noopener` the call cannot report whether a popup
  blocker stopped it, so a blocked window meant an empty cart and no message sent.
- **Fix:** the WhatsApp link is kept and the confirmation screen shows "¿No se abrió WhatsApp? Abrir de nuevo".

### 3. Medium — `npm run typecheck` broken on a clean checkout
- **Where:** `package.json`.
- **Problem:** `PageProps` is a global type that Next.js generates; `tsc --noEmit` alone fails until a build or dev run.
- **Fix:** `"typecheck": "next typegen && tsc --noEmit"`.

### 4. Low — Past dates accepted for delivery
- **Where:** `FormularioPedido.tsx`, `FormularioEmpresa.tsx`.
- **Fix:** `min` set to today (local time, `src/lib/fechas.ts`). In the company form it is set after mount to avoid a
  hydration mismatch.

### 5. Quality — No automated tests
- Added Vitest (`npm test`) with tests for box pricing, cart restoration and the quote API (origin check, content
  type, malformed JSON, honeypot, field validation, missing email config, HTML escaping, rate limit).

## Known limitations (documented, not changed)

- **Rate limit is per server instance.** `src/app/api/cotizacion/route.ts` keeps counters in memory. On Vercel each
  serverless instance has its own map, so the limit is best-effort. A shared store (for example Upstash Redis) would
  make it reliable; not needed at current volume.
- **Final price is confirmed by the business.** Orders go through WhatsApp and the owner confirms total and shipping,
  so even a manipulated message cannot charge a wrong amount automatically.

## Dead code

Manual check of every export against its usages: none unused. The only exports referenced once (`runtime`, `dynamic`,
`dynamicParams`, `generateStaticParams`, `viewport`) are Next.js conventions. `knip` could not run in the audit sandbox.

## Pending business items (not code defects)

`CONFIRMAR` markers remain in `src/lib/negocio.ts`, `src/lib/productos.ts` (box base prices) and
`src/app/nosotros/page.tsx`. Product prices are still sample values per the README.
