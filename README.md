# CosaVela — sitio web

Tienda de velas artesanales y cajas de regalo (Costa Rica). Next.js 16 + React 19 + Tailwind CSS 4, en Node.js.

## Correr en local

```bash
cd cosavela
npm install
cp .env.example .env.local   # llenar NEXT_PUBLIC_WHATSAPP
npm run dev                  # http://localhost:3000
```

## Publicar en Vercel

Nuevo proyecto desde este repositorio con **Root Directory = `cosavela`**. Variables en `.env.example`.

## Qué editar antes de publicar

| Archivo | Qué contiene |
| --- | --- |
| `src/lib/productos.ts` | Catálogo: nombres, **precios (son de ejemplo)**, aromas, cajas y tamaños de "Arme su caja". Campo `imagen` para fotos reales en `public/img/productos/`. |
| `src/lib/negocio.ts` | Instagram, correo, métodos de entrega/pago y preguntas frecuentes (todo lo marcado `CONFIRMAR`). |
| `src/app/nosotros/page.tsx` | Historia de la marca. |

## Cómo funciona la compra

1. El carrito se guarda en el navegador (los precios siempre se recalculan desde el catálogo).
2. En `/carrito` el cliente llena datos de entrega y pago (SINPE Móvil / transferencia).
3. Se abre WhatsApp con el pedido completo; el negocio confirma el envío y el total.

Cotizaciones de empresas: `/api/cotizacion` envía correo con Resend si está configurado; si no, ofrece enviarla por WhatsApp.
