"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { buscarProducto, colones } from "@/lib/productos";
import { Icono } from "./Icono";

export type LineaCarrito = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  slug?: string;
  /** Contenido de una caja armada por el cliente. */
  contenido?: string[];
};

type ContextoCarrito = {
  lineas: LineaCarrito[];
  cantidadTotal: number;
  subtotal: number;
  abierto: boolean;
  listo: boolean;
  abrir: () => void;
  cerrar: () => void;
  agregarProducto: (slug: string, cantidad?: number) => void;
  agregarLinea: (linea: Omit<LineaCarrito, "id" | "cantidad">) => void;
  cambiarCantidad: (id: string, cantidad: number) => void;
  quitar: (id: string) => void;
  vaciar: () => void;
};

const Contexto = createContext<ContextoCarrito | null>(null);
const CLAVE = "cosavela-carrito-v1";
const MAX_CANTIDAD = 99;

/** Precios y nombres de productos del catálogo siempre se toman del catálogo actual, no del navegador. */
function sanear(datos: unknown): LineaCarrito[] {
  if (!Array.isArray(datos)) return [];
  const lineas: LineaCarrito[] = [];
  for (const d of datos.slice(0, 50)) {
    if (!d || typeof d !== "object") continue;
    const l = d as Partial<LineaCarrito>;
    const cantidad = Math.min(MAX_CANTIDAD, Math.max(1, Math.floor(Number(l.cantidad) || 1)));
    if (typeof l.slug === "string") {
      const p = buscarProducto(l.slug);
      if (p) lineas.push({ id: p.slug, slug: p.slug, nombre: p.nombre, precio: p.precio, cantidad });
    } else if (typeof l.id === "string" && typeof l.nombre === "string" && Number.isFinite(l.precio) && Array.isArray(l.contenido)) {
      lineas.push({
        id: l.id.slice(0, 60),
        nombre: l.nombre.slice(0, 80),
        precio: Math.max(0, Number(l.precio)),
        cantidad,
        contenido: l.contenido.filter((c): c is string => typeof c === "string").slice(0, 10),
      });
    }
  }
  return lineas;
}

export function ProveedorCarrito({ children }: { children: React.ReactNode }) {
  const [lineas, setLineas] = useState<LineaCarrito[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      setLineas(sanear(JSON.parse(localStorage.getItem(CLAVE) ?? "[]")));
    } catch {
      /* almacenamiento bloqueado o dañado: se empieza vacío */
    }
    setListo(true);
  }, []);

  useEffect(() => {
    if (!listo) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(lineas));
    } catch {
      /* sin almacenamiento: el carrito vive solo en esta pestaña */
    }
  }, [lineas, listo]);

  const agregarProducto = useCallback((slug: string, cantidad = 1) => {
    const p = buscarProducto(slug);
    if (!p) return;
    setLineas((prev) => {
      const existe = prev.find((l) => l.id === slug);
      if (existe) {
        return prev.map((l) => (l.id === slug ? { ...l, cantidad: Math.min(MAX_CANTIDAD, l.cantidad + cantidad) } : l));
      }
      return [...prev, { id: p.slug, slug: p.slug, nombre: p.nombre, precio: p.precio, cantidad }];
    });
    setAbierto(true);
  }, []);

  const agregarLinea = useCallback((linea: Omit<LineaCarrito, "id" | "cantidad">) => {
    const id = `caja-${Date.now().toString(36)}`;
    setLineas((prev) => [...prev, { ...linea, id, cantidad: 1 }]);
    setAbierto(true);
  }, []);

  const cambiarCantidad = useCallback((id: string, cantidad: number) => {
    setLineas((prev) =>
      prev.map((l) => (l.id === id ? { ...l, cantidad: Math.min(MAX_CANTIDAD, Math.max(1, cantidad)) } : l)),
    );
  }, []);

  const quitar = useCallback((id: string) => setLineas((prev) => prev.filter((l) => l.id !== id)), []);
  const vaciar = useCallback(() => setLineas([]), []);
  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);

  const valor = useMemo<ContextoCarrito>(
    () => ({
      lineas,
      cantidadTotal: lineas.reduce((s, l) => s + l.cantidad, 0),
      subtotal: lineas.reduce((s, l) => s + l.precio * l.cantidad, 0),
      abierto,
      listo,
      abrir,
      cerrar,
      agregarProducto,
      agregarLinea,
      cambiarCantidad,
      quitar,
      vaciar,
    }),
    [lineas, abierto, listo, abrir, cerrar, agregarProducto, agregarLinea, cambiarCantidad, quitar, vaciar],
  );

  return (
    <Contexto.Provider value={valor}>
      {children}
      <CajonCarrito />
    </Contexto.Provider>
  );
}

export function useCarrito() {
  const c = useContext(Contexto);
  if (!c) throw new Error("useCarrito debe usarse dentro de ProveedorCarrito");
  return c;
}

export function SelectorCantidad({ valor, cambiar, etiqueta }: { valor: number; cambiar: (n: number) => void; etiqueta: string }) {
  return (
    <div className="inline-flex items-center rounded-full border border-linea bg-papel" role="group" aria-label={`Cantidad de ${etiqueta}`}>
      <button
        type="button"
        onClick={() => cambiar(valor - 1)}
        disabled={valor <= 1}
        className="grid size-9 place-items-center rounded-full text-cacao transition hover:bg-arena disabled:opacity-30"
        aria-label="Restar uno"
      >
        <Icono nombre="menos" className="size-4" />
      </button>
      <span className="w-7 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {valor}
      </span>
      <button
        type="button"
        onClick={() => cambiar(valor + 1)}
        disabled={valor >= MAX_CANTIDAD}
        className="grid size-9 place-items-center rounded-full text-cacao transition hover:bg-arena disabled:opacity-30"
        aria-label="Sumar uno"
      >
        <Icono nombre="mas" className="size-4" />
      </button>
    </div>
  );
}

export function ListaLineas({ compacta = false }: { compacta?: boolean }) {
  const { lineas, cambiarCantidad, quitar } = useCarrito();
  return (
    <ul className="divide-y divide-linea">
      {lineas.map((l) => (
        <li key={l.id} className="flex gap-4 py-4">
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-arena/70 text-oliva">
            <Icono nombre={l.contenido ? "regalo" : "chispa"} className="size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {l.slug ? (
                  <Link href={`/tienda/${l.slug}`} className="font-medium hover:text-oliva">
                    {l.nombre}
                  </Link>
                ) : (
                  <p className="font-medium">{l.nombre}</p>
                )}
                {l.contenido && !compacta && (
                  <p className="mt-0.5 text-xs leading-relaxed text-cacao-suave">{l.contenido.join(" · ")}</p>
                )}
                <p className="mt-0.5 text-sm text-cacao-suave">{colones(l.precio)} c/u</p>
              </div>
              <p className="shrink-0 text-sm font-semibold tabular-nums">{colones(l.precio * l.cantidad)}</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <SelectorCantidad valor={l.cantidad} cambiar={(n) => cambiarCantidad(l.id, n)} etiqueta={l.nombre} />
              <button
                type="button"
                onClick={() => quitar(l.id)}
                className="inline-flex items-center gap-1 text-xs text-cacao-suave transition hover:text-terracota"
              >
                <Icono nombre="basura" className="size-4" /> Quitar
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function CajonCarrito() {
  const { abierto, cerrar, lineas, subtotal } = useCarrito();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const previo = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && cerrar();
    document.addEventListener("keydown", tecla);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", tecla);
      document.body.style.overflow = "";
      previo?.focus();
    };
  }, [abierto, cerrar]);

  return (
    <div className={`fixed inset-0 z-[60] ${abierto ? "" : "pointer-events-none"}`} aria-hidden={!abierto}>
      <div
        onClick={cerrar}
        className={`absolute inset-0 bg-cacao/30 backdrop-blur-sm transition-opacity duration-300 ${abierto ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Su carrito"
        tabIndex={-1}
        inert={!abierto}
        className={`absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-papel shadow-2xl outline-none transition-transform duration-500 ease-suave ${abierto ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-linea px-6 py-5">
          <p className="font-serif text-2xl">Su carrito</p>
          <button type="button" onClick={cerrar} className="grid size-10 place-items-center rounded-full hover:bg-arena" aria-label="Cerrar carrito">
            <Icono nombre="cerrar" />
          </button>
        </div>
        {lineas.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-arena text-oliva">
              <Icono nombre="bolsa" className="size-7" />
            </div>
            <p className="font-serif text-2xl">Todavía está vacío</p>
            <p className="text-sm text-cacao-suave">Explore las velas y cajas, o arme una caja a su gusto.</p>
            <Link href="/tienda" onClick={cerrar} className="boton mt-2">
              Ver la tienda
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <ListaLineas compacta />
            </div>
            <div className="border-t border-linea px-6 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-cacao-suave">Subtotal</span>
                <span className="text-lg font-semibold tabular-nums">{colones(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-cacao-suave">El envío se calcula según el destino.</p>
              <Link href="/carrito" onClick={cerrar} className="boton mt-4 w-full">
                Finalizar pedido <Icono nombre="flecha" className="size-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function BotonAgregar({ slug, nombre, className = "boton w-full" }: { slug: string; nombre: string; className?: string }) {
  const { agregarProducto } = useCarrito();
  return (
    <button type="button" onClick={() => agregarProducto(slug)} className={className} aria-label={`Agregar ${nombre} al carrito`}>
      <Icono nombre="bolsa" className="size-4" /> Agregar
    </button>
  );
}

export function BotonAgregarCantidad({ slug, nombre }: { slug: string; nombre: string }) {
  const { agregarProducto } = useCarrito();
  const [cantidad, setCantidad] = useState(1);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SelectorCantidad valor={cantidad} cambiar={(n) => setCantidad(Math.min(MAX_CANTIDAD, Math.max(1, n)))} etiqueta={nombre} />
      <button type="button" onClick={() => agregarProducto(slug, cantidad)} className="boton flex-1">
        <Icono nombre="bolsa" className="size-4" /> Agregar al carrito
      </button>
    </div>
  );
}

export function BotonCarrito() {
  const { abrir, cantidadTotal, listo } = useCarrito();
  return (
    <button
      type="button"
      onClick={abrir}
      className="relative grid size-11 place-items-center rounded-full text-cacao transition hover:bg-arena"
      aria-label={`Abrir carrito${listo && cantidadTotal ? `, ${cantidadTotal} artículos` : ""}`}
    >
      <Icono nombre="bolsa" className="size-[22px]" />
      {listo && cantidadTotal > 0 && (
        <span className="absolute top-1 right-0.5 grid min-w-5 place-items-center rounded-full bg-terracota px-1 text-[11px] leading-5 font-bold text-papel">
          {cantidadTotal}
        </span>
      )}
    </button>
  );
}
