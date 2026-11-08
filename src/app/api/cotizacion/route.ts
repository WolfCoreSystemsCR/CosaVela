import { NextResponse } from "next/server";
import { ocasionesEmpresa, rangosCantidad, rangosPresupuesto, textoCotizacion, type Cotizacion } from "@/lib/cotizacion";

/**
 * Cotizaciones de empresas (Node.js). Envía un correo con Resend si está configurado.
 * Variables: RESEND_API_KEY, COTIZACION_PARA, COTIZACION_DESDE, NEXT_PUBLIC_SITIO_URL.
 * Si faltan, responde 503 con `sinCorreo: true` y el navegador ofrece enviarla por WhatsApp.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024;
const VENTANA_MS = 10 * 60_000;
const MAX_ENVIOS = 5;
const envios = new Map<string, number[]>();
const sinCache = { "Cache-Control": "no-store" };
const responder = (cuerpo: object, status = 200) => NextResponse.json(cuerpo, { status, headers: sinCache });

function permitirIp(ip: string) {
  const ahora = Date.now();
  if (envios.size > 5000) for (const [k, v] of envios) if (v.every((t) => ahora - t > VENTANA_MS)) envios.delete(k);
  const recientes = (envios.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  if (recientes.length >= MAX_ENVIOS) return false;
  envios.set(ip, [...recientes, ahora]);
  return true;
}

function origenValido(req: Request) {
  const origen = req.headers.get("origin");
  if (!origen) return false;
  let host: string;
  try {
    host = new URL(origen).host;
  } catch {
    return false;
  }
  const permitidos = new Set<string>();
  const propio = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (propio) permitidos.add(propio);
  try {
    if (process.env.NEXT_PUBLIC_SITIO_URL) permitidos.add(new URL(process.env.NEXT_PUBLIC_SITIO_URL.trim()).host);
  } catch {
    /* URL mal configurada */
  }
  return permitidos.has(host);
}

const linea = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, max) : "");
const parrafo = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000b-\u001f\u007f]+/g, " ").trim().slice(0, max) : "";
const escapar = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const dentro = <T extends readonly string[]>(lista: T, v: string) => ((lista as readonly string[]).includes(v) ? v : "");

export async function POST(req: Request) {
  if (!origenValido(req)) return responder({ mensaje: "Origen no permitido." }, 403);
  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return responder({ mensaje: "Formato no válido." }, 415);
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BYTES) return responder({ mensaje: "Mensaje demasiado largo." }, 413);

  const ip = req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!permitirIp(ip)) return responder({ mensaje: "Recibimos varias solicitudes seguidas. Intente de nuevo en unos minutos." }, 429);

  let d: Record<string, unknown>;
  try {
    const texto = await req.text();
    if (Buffer.byteLength(texto) > MAX_BYTES) return responder({ mensaje: "Mensaje demasiado largo." }, 413);
    const p: unknown = JSON.parse(texto);
    if (!p || typeof p !== "object" || Array.isArray(p)) throw new Error();
    d = p as Record<string, unknown>;
  } catch {
    return responder({ mensaje: "Solicitud no válida." }, 400);
  }

  // Bots: campo oculto lleno o envío en menos de 3 s → se finge éxito.
  if (linea(d.sitio_web, 200) || (typeof d.tiempo === "number" ? d.tiempo : 0) < 3000) return responder({ ok: true });

  const c: Cotizacion = {
    empresa: linea(d.empresa, 120),
    nombre: linea(d.nombre, 100),
    correo: linea(d.correo, 150).toLowerCase(),
    telefono: linea(d.telefono, 20).replace(/[^\d+\s()-]/g, ""),
    cantidad: dentro(rangosCantidad, linea(d.cantidad, 40)),
    presupuesto: dentro(rangosPresupuesto, linea(d.presupuesto, 40)),
    ocasion: dentro(ocasionesEmpresa, linea(d.ocasion, 60)),
    fecha: /^\d{4}-\d{2}-\d{2}$/.test(linea(d.fecha, 10)) ? linea(d.fecha, 10) : "",
    mensaje: parrafo(d.mensaje, 2000),
  };

  if (c.empresa.length < 2 || c.nombre.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.correo) || !c.cantidad || !c.presupuesto || !c.ocasion) {
    return responder({ mensaje: "Revise los campos marcados." }, 400);
  }

  const clave = process.env.RESEND_API_KEY;
  const para = process.env.COTIZACION_PARA;
  const desde = process.env.COTIZACION_DESDE;
  if (!clave || !para || !desde) return responder({ sinCorreo: true, mensaje: "El correo no está configurado." }, 503);

  const texto = textoCotizacion(c);
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${clave}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: desde,
        to: [para],
        reply_to: c.correo,
        subject: `Cotización empresa: ${c.empresa} (${c.cantidad})`.slice(0, 180),
        text: texto,
        html: `<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap">${escapar(texto)}</pre>`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!r.ok) {
      console.error("[cotizacion] Resend respondió", r.status);
      return responder({ sinCorreo: true, mensaje: "No pudimos enviar el correo." }, 502);
    }
  } catch {
    console.error("[cotizacion] Error de red con Resend");
    return responder({ sinCorreo: true, mensaje: "No pudimos enviar el correo." }, 502);
  }
  return responder({ ok: true });
}
