---
description: Frontend standards for CosaVela — Next.js App Router structure, Server and Client Components, Tailwind CSS 4, accessibility, SEO and the WhatsApp purchase flow.
globs: ["src/app/**/*.tsx", "src/components/**/*.tsx", "src/app/globals.css"]
alwaysApply: true
---

# Frontend Standards

## 1. Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16, App Router (`src/app/`) |
| UI | React 19, function components only |
| Styling | Tailwind CSS 4 via `@tailwindcss/postcss`; design tokens in `src/app/globals.css` (`@theme`) |
| Fonts | `next/font/google`: Cormorant Garamond (`--font-titulo`), Figtree (`--font-cuerpo`) |
| Images | `next/image`; product illustrations are inline SVG (`Ilustracion.tsx`) when `imagen` is empty |
| State | React Context (`ProveedorCarrito`) + `localStorage` for the cart. No state library. |
| Language | Spanish (Costa Rica), formal "usted". `<html lang="es-CR">` |

## 2. Structure

```
src/
  app/                 Routes (Server Components by default)
    page.tsx           Home
    tienda/            Catalog with filters via searchParams; [slug] product pages (SSG, dynamicParams = false)
    arma-tu-caja/      Box builder
    carrito/           Checkout (noindex)
    empresas/          Company gifts + quote form
    nosotros/          Brand story
    api/cotizacion/    Quote route handler (see backend-standards.md)
    layout.tsx         Fonts, metadata, JSON-LD, cart provider, header/footer
  components/          Shared UI, Spanish PascalCase names (Encabezado, TarjetaProducto, FormularioPedido)
  lib/                 Pure logic and data (see backend-standards.md §4)
```

## 3. Server vs Client Components

- Pages are Server Components. Add `"use client"` only to components that need state, effects, browser APIs or event handlers (`Carrito.tsx`, `ArmaCaja.tsx`, `FormularioPedido.tsx`, `FormularioEmpresa.tsx`, `Encabezado.tsx`, `Aparecer.tsx`).
- Keep client components small and push logic into `src/lib/` (for example `calcularCaja`, `sanear`).
- Never read `window`, `localStorage` or the current date during render of a component that is server-rendered. Do it in `useEffect` (see `hoy` in `FormularioEmpresa.tsx`) to avoid hydration mismatches.
- `searchParams` and `params` are Promises in Next 16: `await` them (`tienda/page.tsx`, `tienda/[slug]/page.tsx`).

## 4. Cart and checkout rules

- `useCarrito()` is the only way to read or change the cart.
- The cart in `localStorage` (`cosavela-carrito-v1`) is untrusted input. On load, `sanear()` rebuilds every line from the catalog: catalog products by `slug`, custom boxes by `caja` references through `calcularCaja`. Never store a price that cannot be recomputed.
- Checkout builds a WhatsApp message (`enlaceWhatsApp`) and opens it. Because `window.open(..., "noopener")` cannot report popup blocking, the confirmation screen always offers a link to open WhatsApp again.
- Quantities are clamped to `1..MAX_CANTIDAD` (99).

## 5. Forms

- `noValidate` + custom validation with Spanish messages, `aria-invalid`, `aria-describedby` pointing to the error, and focus moved to the first invalid field.
- Sanitize text the same way as the server (strip control characters, trim, cap length).
- Date inputs set `min` to today (`fechaLocalHoy`).
- Every input has a `<label htmlFor>`; optional fields say "(opcional)".

## 6. Styling

- Use the tokens in `globals.css` (`cacao`, `oliva`, `terracota`, `papel`, `arena`, `crema`, `linea`, …) and the shared classes (`boton`, `boton-claro`, `campo`, `etiqueta-campo`, `contenedor`, `titulo`, `ceja`). Do not hard-code new hex colors in components; product tones in `productos.ts` are the exception.
- Respect `prefers-reduced-motion` (already handled for `.aparecer`).
- Mobile first. Check 360 px width for every change.

## 7. Accessibility

- Semantic landmarks (`header`, `nav aria-label`, `main#contenido`, skip link in `layout.tsx`).
- Dialogs (cart drawer): `role="dialog"`, `aria-modal`, focus moved in and restored on close, `Escape` closes, `inert` when hidden.
- Icon-only buttons need `aria-label`. Toggle buttons use `aria-pressed`, current links use `aria-current`.
- External links: `target="_blank" rel="noopener noreferrer"`.

## 8. SEO

- Each page exports `metadata` or `generateMetadata` with `title`, `description` and `alternates.canonical`.
- JSON-LD: `Store` + `FAQPage` in the layout, `Product` per product page. Serialize with the `<` escape.
- `sitemap.ts` lists static pages and all products; `robots.ts` disallows `/api/` and `/carrito`.
- `metadataBase` comes from `NEXT_PUBLIC_SITIO_URL`.

## 9. Testing

- Unit-test logic in `src/lib/` with Vitest. Component tests are not set up; do not add a DOM test stack without an OpenSpec change.
- For UI changes, run the app (`npm run dev`) and check the affected flow manually or with the `playwright-skill` / `playwright-qa-scenarios` skills: add to cart, build a box, checkout to WhatsApp, company quote.
