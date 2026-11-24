import { buscarProducto, calcularCaja, type CajaArmada } from "./productos";

export const MAX_CANTIDAD = 99;

export type LineaCarrito = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  slug?: string;
  /** Contenido de una caja armada por el cliente (derivado de `caja`). */
  contenido?: string[];
  /** Referencias al catálogo de una caja armada; precio y contenido se recalculan desde aquí. */
  caja?: CajaArmada;
};

/**
 * Reconstruye el carrito guardado en el navegador. Precios, nombres y contenido de cajas
 * se toman siempre del catálogo actual: nunca se confía en valores guardados por el cliente.
 */
export function sanear(datos: unknown): LineaCarrito[] {
  if (!Array.isArray(datos)) return [];
  const lineas: LineaCarrito[] = [];
  for (const d of datos.slice(0, 50)) {
    if (!d || typeof d !== "object") continue;
    const l = d as Partial<LineaCarrito>;
    const cantidad = Math.min(MAX_CANTIDAD, Math.max(1, Math.floor(Number(l.cantidad) || 1)));
    if (typeof l.slug === "string") {
      const p = buscarProducto(l.slug);
      if (p && !lineas.some((x) => x.id === p.slug)) lineas.push({ id: p.slug, slug: p.slug, nombre: p.nombre, precio: p.precio, cantidad });
    } else if (typeof l.id === "string" && l.caja && typeof l.caja === "object") {
      const c = calcularCaja(l.caja);
      const id = l.id.slice(0, 60);
      if (c && !lineas.some((x) => x.id === id)) lineas.push({ id, nombre: c.nombre, precio: c.precio, cantidad, contenido: c.contenido, caja: c.caja });
    }
  }
  return lineas;
}
