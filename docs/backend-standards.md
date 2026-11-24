---
description: Server-side standards for CosaVela — Next.js route handlers, validation, security, configuration and testing.
globs: ["src/app/api/**/*.ts", "src/lib/**/*.ts", "next.config.ts"]
alwaysApply: true
---

# Backend Standards

CosaVela has no separate backend and no database. "Backend" means:

- Next.js **route handlers** under `src/app/api/` (today only `POST /api/cotizacion`).
- **Server Components** and build-time code (`generateStaticParams`, `generateMetadata`, `sitemap.ts`, `robots.ts`).
- **Pure business logic** in `src/lib/` shared by server and client.
- **HTTP security configuration** in `next.config.ts`.

Do not add a database, ORM or external backend without an OpenSpec change that justifies it.

## 1. Stack

| Concern | Choice | Evidence |
| --- | --- | --- |
| Runtime | Node.js (Vercel serverless) | `export const runtime = "nodejs"` in `route.ts` |
| Framework | Next.js 16 App Router route handlers | `src/app/api/cotizacion/route.ts` |
| Language | TypeScript, `strict: true` | `tsconfig.json` |
| Email | Resend REST API via `fetch` (optional) | `route.ts`, `.env.example` |
| Tests | Vitest, `environment: "node"` | `vitest.config.ts` |

No runtime dependencies beyond `next`, `react` and `react-dom`. Prefer platform APIs (`fetch`, `AbortSignal.timeout`, `URL`) over new packages.

## 2. Route handler rules

Follow the pattern in `src/app/api/cotizacion/route.ts`:

1. Declare `export const runtime = "nodejs"` and `export const dynamic = "force-dynamic"` for handlers with side effects.
2. Check, in this order, and fail fast:
   - Same-origin `Origin` header (CSRF protection) → `403`.
   - `Content-Type: application/json` → `415`.
   - Body size (header and actual bytes, 8 KB cap) → `413`.
   - Per-IP rate limit → `429`.
   - JSON parses to a plain object → `400`.
3. Treat every field as `unknown`. Sanitize with small helpers (`linea`, `parrafo`): strip control characters, trim, cap length.
4. Closed sets (quantity, budget, occasion) must be validated against the constants exported from `src/lib/` (`dentro(lista, valor)`), never against free text.
5. Respond with `NextResponse.json` and `Cache-Control: no-store`. Error bodies carry a Spanish `mensaje` that is safe to show to customers.
6. Never echo secrets or upstream error bodies. Log a short tag and status code only (`console.error("[cotizacion] Resend respondió", r.status)`).
7. Outbound calls use `AbortSignal.timeout(10_000)`.
8. Missing optional configuration degrades gracefully: the quote route returns `503` with `sinCorreo: true` and the client falls back to WhatsApp.

## 3. Security

- `next.config.ts` sets a strict CSP (`default-src 'self'`, no third-party scripts), HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy` and a restrictive `Permissions-Policy`. Any new external resource (analytics, fonts from a CDN, images) requires updating the CSP in the same change.
- Escape user text before inserting it into HTML (`escapar` in the quote route). JSON-LD is serialized with `JSON.stringify(...).replace(/</g, "\\u003c")`.
- Bots: hidden honeypot field `sitio_web` plus a minimum fill time (`tiempo >= 3000` ms). Bot submissions receive a fake `200` so they do not retry.
- Prices are never trusted from the client. Anything priced in the browser must be recomputable from the catalog (`calcularCaja`, `sanear`).
- Secrets live only in environment variables (`RESEND_API_KEY`). Only `NEXT_PUBLIC_*` variables may be read from client code.

### Known limitation

The rate limit (`MAX_ENVIOS = 5` per 10 minutes) is an in-memory `Map`. On Vercel each serverless instance has its own map, so it is best-effort. If abuse appears, move it to a shared store (for example Upstash Redis) in an OpenSpec change.

## 4. Business logic in `src/lib/`

- Pure functions, no React, no `window`. This keeps them testable in Node and usable from both Server and Client Components.
- `productos.ts`: catalog, box sizes, `calcularCaja`, `colones` (CRC formatting with `Intl.NumberFormat("es-CR")`).
- `carrito.ts`: `LineaCarrito`, `sanear` (rebuilds the stored cart from the catalog).
- `cotizacion.ts`: quote options and `textoCotizacion`.
- `negocio.ts`: business data, WhatsApp link builder, delivery and payment methods, FAQ.
- `fechas.ts`: local date helpers.

## 5. Testing

- Unit tests sit next to the code: `*.test.ts` (`src/lib/productos.test.ts`, `src/app/api/cotizacion/route.test.ts`).
- Route handlers are tested by importing `POST` and calling it with a `Request`. Use `vi.stubEnv` for configuration, `vi.stubGlobal("fetch", ...)` for outbound calls and `vi.resetModules()` to reset in-memory state.
- Every validation branch of a route handler needs a test (status code and, where relevant, body).
- Run `npm test` and `npm run typecheck` before every commit.

## 6. Manual endpoint check (curl)

```bash
curl -i -X POST http://localhost:3000/api/cotizacion \
  -H 'content-type: application/json' -H 'origin: http://localhost:3000' \
  -d '{"empresa":"Acme","nombre":"Ana","correo":"ana@acme.cr","cantidad":"10 a 25","presupuesto":"₡15 000 a ₡25 000","ocasion":"Fin de año","tiempo":9000}'
```

Without Resend variables this returns `503` with `"sinCorreo": true`, which is the expected local behavior.
