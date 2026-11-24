# Data Model

CosaVela has **no database**. All data is either static TypeScript in `src/lib/`, the customer's cart in `localStorage`, or a quote request sent by email/WhatsApp. Prices are integers in Costa Rican colones (CRC).

## 1. Catalog (`src/lib/productos.ts`)

### `Producto`

| Field | Type | Notes |
| --- | --- | --- |
| `slug` | `string` | Unique id and URL segment (`/tienda/[slug]`) |
| `nombre` | `string` | Display name |
| `categoria` | `"velas" \| "cajas" \| "complementos"` | |
| `precio` | `number` | CRC, integer. Sample values until confirmed |
| `resumen` | `string` | One-line summary (cards) |
| `descripcion` | `string` | Long text (product page, metadata) |
| `notas?` | `string[]` | Scent notes (candles) |
| `incluye?` | `string[]` | Contents (ready-made boxes) |
| `detalles?` | `string[]` | Physical details |
| `ocasiones` | `Ocasion[]` | `mama`, `cumpleanos`, `gracias`, `navidad`, `empresas`, `bienestar`, `amor` |
| `tono` | `{ cera, acento, etiqueta }` | Hex colors for the SVG illustration |
| `insignia?` | `string` | Badge ("Más vendida", "Nueva", "Temporada") |
| `imagen?` | `string` | Path under `/public/img/productos/` |
| `armable?` | `boolean` | Can be used in "Arme su caja" |

### Box sizes (`tamanosCaja`)

| `id` | `espacios` | `base` (CRC) |
| --- | --- | --- |
| `pequena` | 2 | 3 500 |
| `mediana` | 3 | 4 500 |
| `grande` | 5 | 6 000 |

`base` covers box, filling, ribbon and card (marked CONFIRMAR).

### `CajaArmada` and `calcularCaja`

```ts
type CajaArmada = { tamano: TamanoCaja; items: string[]; dedicatoria?: string };
```

`calcularCaja(caja)` is the single source of truth for custom box pricing. It returns `null` unless:
- `tamano` exists,
- `items` has 1..`espacios` entries, all existing `armable` products,
- at least one item is a candle (`categoria === "velas"`).

Result: `{ nombre, precio = base + Σ item prices, contenido, caja }`. `dedicatoria` is trimmed and capped at `MAX_DEDICATORIA` (280).

## 2. Cart (`src/lib/carrito.ts`)

Stored in `localStorage` under `cosavela-carrito-v1` as `LineaCarrito[]` (max 50 lines).

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string` | Product `slug`, or `caja-<time>-<rand>` for custom boxes |
| `nombre` | `string` | Recomputed on load |
| `precio` | `number` | Unit price, recomputed on load |
| `cantidad` | `number` | Clamped to 1..99 |
| `slug?` | `string` | Present for catalog products |
| `contenido?` | `string[]` | Custom box contents, recomputed on load |
| `caja?` | `CajaArmada` | Custom box references; required for custom boxes |

`sanear(datos)` rebuilds the cart from stored data. Lines that cannot be matched to the current catalog are dropped. Custom box lines saved before 2026-11-24 (without `caja`) are dropped.

## 3. Company quote (`src/lib/cotizacion.ts`)

```ts
type Cotizacion = {
  empresa: string;     // 2..120
  nombre: string;      // 2..100
  correo: string;      // email, lowercased, ≤150
  telefono: string;    // digits, + ( ) - and spaces, ≤20
  cantidad: string;    // one of rangosCantidad
  presupuesto: string; // one of rangosPresupuesto
  ocasion: string;     // one of ocasionesEmpresa
  fecha: string;       // YYYY-MM-DD or ""
  mensaje: string;     // ≤2000, newlines kept
};
```

`textoCotizacion(c)` renders the plain-text message used for both the email and the WhatsApp fallback.

## 4. Business data (`src/lib/negocio.ts`)

`negocio` (name, slogan, WhatsApp from `NEXT_PUBLIC_WHATSAPP`, Instagram, email), `metodosEntrega` (`gam`, `correos`, `retiro`), `metodosPago` (`sinpe`, `transferencia`), `provincias`, `preguntas` (FAQ, also published as JSON-LD).
