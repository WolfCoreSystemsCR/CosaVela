"use client";

import Link from "next/link";
import { useState } from "react";
import { enlaceWhatsApp, metodosEntrega, metodosPago, negocio, provincias } from "@/lib/negocio";
import { colones } from "@/lib/productos";
import { ListaLineas, useCarrito } from "./Carrito";
import { Icono } from "./Icono";

type Errores = Partial<Record<"nombre" | "telefono" | "direccion", string>>;

const limpiar = (v: FormDataEntryValue | null, max: number) =>
  String(v ?? "")
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, " ")
    .trim()
    .slice(0, max);

export function FormularioPedido() {
  const { lineas, subtotal, listo, vaciar } = useCarrito();
  const [entrega, setEntrega] = useState<(typeof metodosEntrega)[number]["id"]>("gam");
  const [errores, setErrores] = useState<Errores>({});
  const [enviado, setEnviado] = useState(false);

  if (!listo) return <div className="h-96 animate-pulse rounded-[2rem] bg-papel" />;

  if (enviado) {
    return (
      <div role="status" className="mx-auto max-w-xl rounded-[2rem] border border-linea bg-papel p-10 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-oliva text-papel">
          <Icono nombre="check" className="size-8" />
        </div>
        <h2 className="mt-6 font-serif text-4xl">¡Gracias por su pedido!</h2>
        <p className="mt-3 text-cacao-suave">
          Se abrió WhatsApp con el detalle. Envíe el mensaje y le confirmamos el total con envío y los datos para el pago.
        </p>
        <Link href="/tienda" className="boton mt-8">
          Seguir comprando
        </Link>
      </div>
    );
  }

  if (lineas.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-[2rem] border border-dashed border-linea p-12 text-center">
        <p className="font-serif text-3xl">Su carrito está vacío</p>
        <p className="mt-2 text-cacao-suave">Agregue velas o cajas para hacer su pedido.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/tienda" className="boton">Ver la tienda</Link>
          <Link href="/arma-tu-caja" className="boton-claro">Armar una caja</Link>
        </div>
      </div>
    );
  }

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const nombre = limpiar(f.get("nombre"), 80);
    const telefono = limpiar(f.get("telefono"), 20).replace(/[^\d+\s-]/g, "");
    const provincia = limpiar(f.get("provincia"), 30);
    const direccion = limpiar(f.get("direccion"), 300);
    const pago = metodosPago.find((m) => m.id === f.get("pago"))?.nombre ?? "SINPE Móvil";
    const fecha = limpiar(f.get("fecha"), 20);
    const notas = limpiar(f.get("notas"), 400);
    const metodo = metodosEntrega.find((m) => m.id === entrega)!;

    const nuevos: Errores = {};
    if (nombre.length < 2) nuevos.nombre = "Escriba su nombre.";
    if (telefono.replace(/\D/g, "").length < 8) nuevos.telefono = "Revise el número (8 dígitos).";
    if (entrega !== "retiro" && direccion.length < 6) nuevos.direccion = "Indique la dirección de entrega.";
    setErrores(nuevos);
    if (Object.keys(nuevos).length) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(nuevos)[0]}"]`)?.focus();
      return;
    }

    const detalle = lineas
      .map((l) => {
        const base = `• ${l.cantidad} × ${l.nombre} — ${colones(l.precio * l.cantidad)}`;
        return l.contenido ? `${base}\n   ${l.contenido.join("\n   ")}` : base;
      })
      .join("\n");

    const mensaje = [
      `¡Hola ${negocio.nombre}! Quiero hacer este pedido:`,
      "",
      detalle,
      "",
      `Subtotal: ${colones(subtotal)} (sin envío)`,
      "",
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono}`,
      `Entrega: ${metodo.nombre}`,
      entrega !== "retiro" ? `Dirección: ${provincia ? `${provincia}, ` : ""}${direccion}` : null,
      fecha ? `Fecha deseada: ${fecha}` : null,
      `Pago: ${pago}`,
      notas ? `Notas: ${notas}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");

    window.open(enlaceWhatsApp(mensaje), "_blank", "noopener,noreferrer");
    vaciar();
    setEnviado(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const error = (campo: keyof Errores) =>
    errores[campo] && (
      <p id={`error-${campo}`} className="mt-1.5 text-sm text-terracota">
        {errores[campo]}
      </p>
    );

  return (
    <form onSubmit={enviar} noValidate className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-10">
        <fieldset className="space-y-5">
          <legend className="font-serif text-3xl">Sus datos</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="nombre" className="etiqueta-campo">Nombre</label>
              <input id="nombre" name="nombre" autoComplete="name" className="campo" aria-invalid={!!errores.nombre} aria-describedby={errores.nombre ? "error-nombre" : undefined} />
              {error("nombre")}
            </div>
            <div>
              <label htmlFor="telefono" className="etiqueta-campo">Teléfono / WhatsApp</label>
              <input id="telefono" name="telefono" type="tel" inputMode="tel" autoComplete="tel" placeholder="8888 8888" className="campo" aria-invalid={!!errores.telefono} aria-describedby={errores.telefono ? "error-telefono" : undefined} />
              {error("telefono")}
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-serif text-3xl">Entrega</legend>
          <div className="mt-5 grid gap-3">
            {metodosEntrega.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer items-start gap-4 rounded-3xl border p-5 transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-oliva/30 ${
                  entrega === m.id ? "border-oliva bg-oliva/10" : "border-linea bg-papel hover:border-cacao/30"
                }`}
              >
                <input type="radio" name="entrega" value={m.id} checked={entrega === m.id} onChange={() => setEntrega(m.id)} className="mt-1 accent-oliva" />
                <span>
                  <span className="block font-medium">{m.nombre}</span>
                  <span className="mt-0.5 block text-sm text-cacao-suave">{m.detalle}</span>
                </span>
              </label>
            ))}
          </div>
          {entrega !== "retiro" && (
            <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_2fr]">
              <div>
                <label htmlFor="provincia" className="etiqueta-campo">Provincia</label>
                <select id="provincia" name="provincia" className="campo" defaultValue="San José">
                  {provincias.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="direccion" className="etiqueta-campo">Dirección</label>
                <input id="direccion" name="direccion" autoComplete="street-address" placeholder="Cantón, distrito y señas" className="campo" aria-invalid={!!errores.direccion} aria-describedby={errores.direccion ? "error-direccion" : undefined} />
                {error("direccion")}
              </div>
            </div>
          )}
          <div className="mt-5 sm:w-1/2">
            <label htmlFor="fecha" className="etiqueta-campo">
              Fecha deseada <span className="font-normal text-cacao-suave">(opcional)</span>
            </label>
            <input id="fecha" name="fecha" type="date" className="campo" />
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-serif text-3xl">Pago</legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {metodosPago.map((m, i) => (
              <label key={m.id} className="flex cursor-pointer items-center gap-3 rounded-3xl border border-linea bg-papel p-5 has-[:checked]:border-oliva has-[:checked]:bg-oliva/10">
                <input type="radio" name="pago" value={m.id} defaultChecked={i === 0} className="accent-oliva" />
                <span className="font-medium">{m.nombre}</span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-sm text-cacao-suave">Le enviamos los datos para el pago al confirmar su pedido.</p>
        </fieldset>

        <div>
          <label htmlFor="notas" className="etiqueta-campo">
            Notas o dedicatoria <span className="font-normal text-cacao-suave">(opcional)</span>
          </label>
          <textarea id="notas" name="notas" rows={4} maxLength={400} className="campo resize-none" placeholder="Mensaje para la tarjeta, horario de entrega, etc." />
        </div>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[2rem] border border-linea bg-papel p-6">
          <p className="font-serif text-2xl">Resumen</p>
          <ListaLineas />
          <div className="flex items-center justify-between border-t border-linea pt-5">
            <span className="text-sm text-cacao-suave">Subtotal</span>
            <span className="text-2xl font-semibold tabular-nums">{colones(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-cacao-suave">El envío se confirma por WhatsApp según el destino.</p>
          <button type="submit" className="boton mt-6 w-full">
            <Icono nombre="whatsapp" className="size-5" /> Enviar pedido por WhatsApp
          </button>
        </div>
      </aside>
    </form>
  );
}
