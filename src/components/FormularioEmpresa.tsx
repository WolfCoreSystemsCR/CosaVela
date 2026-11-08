"use client";

import { useEffect, useRef, useState } from "react";
import { ocasionesEmpresa, rangosCantidad, rangosPresupuesto, textoCotizacion, type Cotizacion } from "@/lib/cotizacion";
import { enlaceWhatsApp } from "@/lib/negocio";
import { Icono } from "./Icono";

type Estado = { tipo: "inicial" } | { tipo: "enviando" } | { tipo: "ok" } | { tipo: "whatsapp"; enlace: string } | { tipo: "error"; mensaje: string };
type Campo = "empresa" | "nombre" | "correo";

export function FormularioEmpresa() {
  const [estado, setEstado] = useState<Estado>({ tipo: "inicial" });
  const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({});
  const inicio = useRef(0);
  const resultado = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inicio.current = Date.now();
  }, []);
  useEffect(() => {
    if (estado.tipo === "ok" || estado.tipo === "whatsapp") resultado.current?.focus();
  }, [estado.tipo]);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const nuevos: Partial<Record<Campo, string>> = {};
    if ((f.empresa ?? "").trim().length < 2) nuevos.empresa = "Escriba el nombre de la empresa.";
    if ((f.nombre ?? "").trim().length < 2) nuevos.nombre = "Escriba su nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((f.correo ?? "").trim())) nuevos.correo = "Revise el correo.";
    setErrores(nuevos);
    if (Object.keys(nuevos).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(nuevos)[0]}"]`)?.focus();
      return;
    }

    const cotizacion: Cotizacion = {
      empresa: f.empresa.trim(),
      nombre: f.nombre.trim(),
      correo: f.correo.trim(),
      telefono: (f.telefono ?? "").trim(),
      cantidad: f.cantidad,
      presupuesto: f.presupuesto,
      ocasion: f.ocasion,
      fecha: f.fecha ?? "",
      mensaje: (f.mensaje ?? "").trim(),
    };

    setEstado({ tipo: "enviando" });
    try {
      const r = await fetch("/api/cotizacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cotizacion, sitio_web: f.sitio_web ?? "", tiempo: Date.now() - inicio.current }),
      });
      const cuerpo = (await r.json().catch(() => ({}))) as { mensaje?: string; sinCorreo?: boolean };
      if (r.ok) {
        form.reset();
        setEstado({ tipo: "ok" });
      } else if (cuerpo.sinCorreo) {
        setEstado({ tipo: "whatsapp", enlace: enlaceWhatsApp(textoCotizacion(cotizacion)) });
      } else {
        setEstado({ tipo: "error", mensaje: cuerpo.mensaje ?? "No pudimos enviar su solicitud." });
      }
    } catch {
      setEstado({ tipo: "whatsapp", enlace: enlaceWhatsApp(textoCotizacion(cotizacion)) });
    }
  }

  if (estado.tipo === "ok" || estado.tipo === "whatsapp") {
    return (
      <div ref={resultado} tabIndex={-1} role="status" className="rounded-[2rem] bg-papel p-10 text-center outline-none">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-oliva text-papel">
          <Icono nombre={estado.tipo === "ok" ? "check" : "whatsapp"} className="size-8" />
        </div>
        {estado.tipo === "ok" ? (
          <>
            <p className="mt-6 font-serif text-3xl">¡Recibimos su solicitud!</p>
            <p className="mt-2 text-cacao-suave">Le respondemos por correo con una propuesta.</p>
          </>
        ) : (
          <>
            <p className="mt-6 font-serif text-3xl">Un último paso</p>
            <p className="mt-2 text-cacao-suave">Envíenos la solicitud por WhatsApp. El mensaje ya va escrito.</p>
            <a href={estado.enlace} target="_blank" rel="noopener noreferrer" className="boton mt-6">
              <Icono nombre="whatsapp" className="size-5" /> Enviar por WhatsApp
            </a>
          </>
        )}
      </div>
    );
  }

  const error = (c: Campo) => errores[c] && <p id={`error-${c}`} className="mt-1.5 text-sm text-terracota">{errores[c]}</p>;
  const attrs = (c: Campo) => ({ "aria-invalid": !!errores[c], "aria-describedby": errores[c] ? `error-${c}` : undefined });

  return (
    <form onSubmit={enviar} noValidate className="rounded-[2rem] bg-papel p-6 text-cacao sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="empresa" className="etiqueta-campo">Empresa</label>
          <input id="empresa" name="empresa" autoComplete="organization" className="campo" {...attrs("empresa")} />
          {error("empresa")}
        </div>
        <div>
          <label htmlFor="nombre-e" className="etiqueta-campo">Su nombre</label>
          <input id="nombre-e" name="nombre" autoComplete="name" className="campo" {...attrs("nombre")} />
          {error("nombre")}
        </div>
        <div>
          <label htmlFor="correo" className="etiqueta-campo">Correo</label>
          <input id="correo" name="correo" type="email" autoComplete="email" className="campo" {...attrs("correo")} />
          {error("correo")}
        </div>
        <div>
          <label htmlFor="telefono-e" className="etiqueta-campo">Teléfono <span className="font-normal text-cacao-suave">(opcional)</span></label>
          <input id="telefono-e" name="telefono" type="tel" autoComplete="tel" className="campo" />
        </div>
        <div>
          <label htmlFor="cantidad" className="etiqueta-campo">Cantidad de regalos</label>
          <select id="cantidad" name="cantidad" className="campo">
            {rangosCantidad.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="presupuesto" className="etiqueta-campo">Presupuesto por regalo</label>
          <select id="presupuesto" name="presupuesto" className="campo" defaultValue={rangosPresupuesto[1]}>
            {rangosPresupuesto.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="ocasion" className="etiqueta-campo">Ocasión</label>
          <select id="ocasion" name="ocasion" className="campo">
            {ocasionesEmpresa.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="fecha-e" className="etiqueta-campo">Fecha de entrega <span className="font-normal text-cacao-suave">(aprox.)</span></label>
          <input id="fecha-e" name="fecha" type="date" className="campo" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="mensaje" className="etiqueta-campo">Detalles <span className="font-normal text-cacao-suave">(opcional)</span></label>
          <textarea id="mensaje" name="mensaje" rows={4} maxLength={2000} className="campo resize-none" placeholder="Colores de marca, aromas preferidos, entrega en varias direcciones…" />
        </div>
        {/* Trampa para bots: oculto a personas */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="sitio_web">No llenar</label>
          <input id="sitio_web" name="sitio_web" tabIndex={-1} autoComplete="off" />
        </div>
      </div>
      {estado.tipo === "error" && <p role="alert" className="mt-5 text-sm text-terracota">{estado.mensaje}</p>}
      <button type="submit" disabled={estado.tipo === "enviando"} className="boton mt-8 w-full sm:w-auto">
        {estado.tipo === "enviando" ? "Enviando…" : "Pedir cotización"} <Icono nombre="flecha" className="size-4" />
      </button>
    </form>
  );
}
