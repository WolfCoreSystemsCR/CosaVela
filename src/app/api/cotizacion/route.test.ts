import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const valida = {
  empresa: "Acme S.A.",
  nombre: "Ana Mora",
  correo: "ana@acme.cr",
  telefono: "8888 8888",
  cantidad: "10 a 25",
  presupuesto: "₡15 000 a ₡25 000",
  ocasion: "Fin de año",
  fecha: "2030-12-01",
  mensaje: "Hola",
  sitio_web: "",
  tiempo: 10_000,
};

let ip = 0;
function solicitud(cuerpo: unknown, headers: Record<string, string> = {}) {
  ip += 1;
  return new Request("https://cosa-vela.vercel.app/api/cotizacion", {
    method: "POST",
    headers: {
      host: "cosa-vela.vercel.app",
      origin: "https://cosa-vela.vercel.app",
      "content-type": "application/json",
      "x-real-ip": `10.0.0.${ip}`,
      ...headers,
    },
    body: typeof cuerpo === "string" ? cuerpo : JSON.stringify(cuerpo),
  });
}

async function cargarRuta() {
  vi.resetModules();
  return import("./route");
}

describe("POST /api/cotizacion", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("COTIZACION_PARA", "");
    vi.stubEnv("COTIZACION_DESDE", "");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("rejects requests from another origin (403)", async () => {
    const { POST } = await cargarRuta();
    const r = await POST(solicitud(valida, { origin: "https://evil.example" }));
    expect(r.status).toBe(403);
  });

  it("rejects non-JSON content (415)", async () => {
    const { POST } = await cargarRuta();
    const r = await POST(solicitud(valida, { "content-type": "text/plain" }));
    expect(r.status).toBe(415);
  });

  it("rejects malformed JSON (400)", async () => {
    const { POST } = await cargarRuta();
    expect((await POST(solicitud("{no json"))).status).toBe(400);
  });

  it("silently accepts honeypot submissions without sending email", async () => {
    vi.stubEnv("RESEND_API_KEY", "k");
    vi.stubEnv("COTIZACION_PARA", "a@b.cr");
    vi.stubEnv("COTIZACION_DESDE", "c@d.cr");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { POST } = await cargarRuta();
    const r = await POST(solicitud({ ...valida, sitio_web: "http://spam" }));
    expect(r.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("validates required fields and allowed options (400)", async () => {
    const { POST } = await cargarRuta();
    expect((await POST(solicitud({ ...valida, correo: "no-es-correo" }))).status).toBe(400);
    expect((await POST(solicitud({ ...valida, cantidad: "1 millón" }))).status).toBe(400);
  });

  it("returns 503 with sinCorreo when email is not configured", async () => {
    const { POST } = await cargarRuta();
    const r = await POST(solicitud(valida));
    expect(r.status).toBe(503);
    expect(await r.json()).toMatchObject({ sinCorreo: true });
  });

  it("sends the quote through Resend with escaped HTML when configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "k");
    vi.stubEnv("COTIZACION_PARA", "ventas@cosavela.cr");
    vi.stubEnv("COTIZACION_DESDE", "web@cosavela.cr");
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { POST } = await cargarRuta();
    const r = await POST(solicitud({ ...valida, mensaje: "<script>alert(1)</script>" }));
    expect(r.status).toBe(200);
    const cuerpo = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(cuerpo.to).toEqual(["ventas@cosavela.cr"]);
    expect(cuerpo.reply_to).toBe("ana@acme.cr");
    expect(cuerpo.html).not.toContain("<script>");
    expect(cuerpo.html).toContain("&lt;script&gt;");
  });

  it("rate-limits repeated submissions from the same IP (429)", async () => {
    const { POST } = await cargarRuta();
    const mismaIp = { "x-real-ip": "203.0.113.7" };
    for (let i = 0; i < 5; i++) await POST(solicitud(valida, mismaIp));
    expect((await POST(solicitud(valida, mismaIp))).status).toBe(429);
  });
});
