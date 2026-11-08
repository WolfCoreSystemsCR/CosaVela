"use client";

import { useMemo, useState } from "react";
import { colones, productos, tamanosCaja, type TamanoCaja } from "@/lib/productos";
import { useCarrito } from "./Carrito";
import { Icono } from "./Icono";
import { CajaSVG, ImagenProducto } from "./Ilustracion";

const armables = productos.filter((p) => p.armable);
const velas = armables.filter((p) => p.categoria === "velas");
const complementos = armables.filter((p) => p.categoria === "complementos");
const MAX_DEDICATORIA = 280;

export function ArmaCaja() {
  const { agregarLinea } = useCarrito();
  const [tamano, setTamano] = useState<TamanoCaja>("mediana");
  const [elegidos, setElegidos] = useState<string[]>([]);
  const [dedicatoria, setDedicatoria] = useState("");
  const [aviso, setAviso] = useState("");

  const caja = tamanosCaja.find((t) => t.id === tamano)!;
  const items = elegidos.map((s) => armables.find((p) => p.slug === s)!);
  const total = caja.base + items.reduce((s, p) => s + p.precio, 0);
  const lleno = elegidos.length >= caja.espacios;
  const tieneVela = items.some((p) => p.categoria === "velas");
  const tono = useMemo(() => items.find((p) => p.categoria === "velas")?.tono ?? velas[0].tono, [items]);

  function cambiarTamano(id: TamanoCaja) {
    const nuevo = tamanosCaja.find((t) => t.id === id)!;
    setTamano(id);
    setElegidos((e) => e.slice(0, nuevo.espacios));
  }

  function alternar(slug: string) {
    setAviso("");
    setElegidos((e) => {
      const i = e.indexOf(slug);
      if (i >= 0) return e.filter((_, j) => j !== i);
      if (e.length >= caja.espacios) return e;
      return [...e, slug];
    });
  }

  function agregar() {
    if (!tieneVela) {
      setAviso("Agregue al menos una vela a su caja.");
      return;
    }
    const contenido = items.map((p) => p.nombre);
    const texto = dedicatoria.trim();
    if (texto) contenido.push(`Dedicatoria: “${texto}”`);
    agregarLinea({ nombre: `Caja personalizada ${caja.nombre.toLowerCase()}`, precio: total, contenido });
    setElegidos([]);
    setDedicatoria("");
  }

  const tarjeta = (slug: string) => {
    const p = armables.find((x) => x.slug === slug)!;
    const activo = elegidos.includes(slug);
    return (
      <li key={slug}>
        <button
          type="button"
          onClick={() => alternar(slug)}
          disabled={!activo && lleno}
          aria-pressed={activo}
          className={`group flex w-full items-center gap-4 rounded-3xl border p-3 text-left transition duration-300 disabled:opacity-40 ${
            activo ? "border-oliva bg-oliva/10 ring-2 ring-oliva/30" : "border-linea bg-papel hover:border-cacao/30"
          }`}
        >
          <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-arena/60">
            <ImagenProducto producto={p} compacta />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium">{p.nombre}</p>
            <p className="mt-0.5 line-clamp-1 text-xs text-cacao-suave">{p.resumen}</p>
            <p className="mt-1 text-sm font-semibold tabular-nums">{colones(p.precio)}</p>
          </div>
          <span
            className={`mr-1 grid size-8 shrink-0 place-items-center rounded-full border transition ${
              activo ? "border-oliva bg-oliva text-papel" : "border-linea text-cacao-suave"
            }`}
          >
            <Icono nombre={activo ? "check" : "mas"} className="size-4" />
          </span>
        </button>
      </li>
    );
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-12">
        <fieldset>
          <legend className="flex items-center gap-3 font-serif text-3xl">
            <span className="grid size-9 place-items-center rounded-full bg-cacao font-sans text-sm text-papel">1</span> Tamaño de la caja
          </legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {tamanosCaja.map((t) => (
              <label
                key={t.id}
                className={`cursor-pointer rounded-3xl border p-5 transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-oliva/30 ${
                  tamano === t.id ? "border-cacao bg-cacao text-papel" : "border-linea bg-papel hover:border-cacao/30"
                }`}
              >
                <input type="radio" name="tamano" value={t.id} checked={tamano === t.id} onChange={() => cambiarTamano(t.id)} className="sr-only" />
                <span className="block font-serif text-2xl">{t.nombre}</span>
                <span className={`mt-1 block text-sm ${tamano === t.id ? "text-papel/75" : "text-cacao-suave"}`}>{t.descripcion}</span>
                <span className="mt-3 block text-sm font-semibold">Caja + tarjeta: {colones(t.base)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="flex items-center gap-3 font-serif text-3xl">
            <span className="grid size-9 place-items-center rounded-full bg-cacao font-sans text-sm text-papel">2</span> Velas
          </legend>
          <p className="mt-2 text-sm text-cacao-suave">Escoja al menos una.</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">{velas.map((p) => tarjeta(p.slug))}</ul>
        </fieldset>

        <fieldset>
          <legend className="flex items-center gap-3 font-serif text-3xl">
            <span className="grid size-9 place-items-center rounded-full bg-cacao font-sans text-sm text-papel">3</span> Complementos
          </legend>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">{complementos.map((p) => tarjeta(p.slug))}</ul>
        </fieldset>

        <fieldset>
          <legend className="flex items-center gap-3 font-serif text-3xl">
            <span className="grid size-9 place-items-center rounded-full bg-cacao font-sans text-sm text-papel">4</span> Dedicatoria
          </legend>
          <label htmlFor="dedicatoria" className="mt-2 block text-sm text-cacao-suave">
            La escribimos a mano en la tarjeta. Opcional.
          </label>
          <textarea
            id="dedicatoria"
            value={dedicatoria}
            onChange={(e) => setDedicatoria(e.target.value.slice(0, MAX_DEDICATORIA))}
            rows={4}
            maxLength={MAX_DEDICATORIA}
            placeholder="Ej: Mami, gracias por todo. ¡Feliz día!"
            className="campo mt-4 resize-none font-serif text-lg"
          />
          <p className="mt-1 text-right text-xs text-cacao-suave">
            {dedicatoria.length}/{MAX_DEDICATORIA}
          </p>
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[2rem] border border-linea bg-papel p-6 shadow-xl shadow-cacao/5">
          <div className="mx-auto aspect-square w-48">
            <CajaSVG tono={tono} />
          </div>
          <p className="mt-2 text-center font-serif text-2xl">Caja {caja.nombre.toLowerCase()}</p>
          <div className="mt-4 flex justify-center gap-1.5" aria-label={`${elegidos.length} de ${caja.espacios} espacios usados`}>
            {Array.from({ length: caja.espacios }).map((_, i) => (
              <span key={i} className={`h-1.5 w-8 rounded-full ${i < elegidos.length ? "bg-oliva" : "bg-arena"}`} />
            ))}
          </div>
          <ul className="mt-6 space-y-2 text-sm">
            <li className="flex justify-between gap-3 text-cacao-suave">
              <span>Caja, relleno y tarjeta</span>
              <span className="tabular-nums">{colones(caja.base)}</span>
            </li>
            {items.map((p, i) => (
              <li key={`${p.slug}-${i}`} className="flex justify-between gap-3">
                <span>{p.nombre}</span>
                <span className="tabular-nums">{colones(p.precio)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-linea pt-5">
            <span className="text-sm text-cacao-suave">Total</span>
            <span className="text-2xl font-semibold tabular-nums">{colones(total)}</span>
          </div>
          <button type="button" onClick={agregar} disabled={elegidos.length === 0} className="boton mt-5 w-full">
            <Icono nombre="bolsa" className="size-4" /> Agregar caja al carrito
          </button>
          <p role="status" className="mt-3 min-h-5 text-center text-sm text-terracota">
            {aviso}
          </p>
        </div>
      </aside>
    </div>
  );
}
