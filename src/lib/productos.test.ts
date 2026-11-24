import { describe, expect, it } from "vitest";
import { buscarProducto, calcularCaja, MAX_DEDICATORIA, tamanosCaja } from "./productos";

const precio = (slug: string) => buscarProducto(slug)!.precio;
const base = (id: string) => tamanosCaja.find((t) => t.id === id)!.base;

describe("calcularCaja", () => {
  it("prices a valid box from the catalog (base + items)", () => {
    const c = calcularCaja({ tamano: "pequena", items: ["cafe-de-altura", "chocolate-artesanal"] });
    expect(c).not.toBeNull();
    expect(c!.precio).toBe(base("pequena") + precio("cafe-de-altura") + precio("chocolate-artesanal"));
    expect(c!.nombre).toBe("Caja personalizada pequeña");
    expect(c!.contenido).toEqual(["Café de Altura", "Chocolate artesanal"]);
  });

  it("rejects a box without a candle", () => {
    expect(calcularCaja({ tamano: "mediana", items: ["chocolate-artesanal", "jabon-artesanal"] })).toBeNull();
  });

  it("rejects more items than the size allows", () => {
    expect(calcularCaja({ tamano: "pequena", items: ["cafe-de-altura", "guayaba-rosa", "sales-de-bano"] })).toBeNull();
  });

  it("rejects unknown sizes, unknown slugs and non-buildable products", () => {
    expect(calcularCaja({ tamano: "gigante", items: ["cafe-de-altura"] })).toBeNull();
    expect(calcularCaja({ tamano: "mediana", items: ["no-existe"] })).toBeNull();
    expect(calcularCaja({ tamano: "mediana", items: ["cafe-de-altura", "caja-pura-vida"] })).toBeNull();
    expect(calcularCaja({ tamano: "mediana", items: [] })).toBeNull();
    expect(calcularCaja({ tamano: "mediana", items: "cafe-de-altura" })).toBeNull();
  });

  it("trims and caps the dedication and adds it to the contents", () => {
    const c = calcularCaja({ tamano: "mediana", items: ["cafe-de-altura"], dedicatoria: `  ${"a".repeat(400)}  ` });
    expect(c!.caja.dedicatoria).toHaveLength(MAX_DEDICATORIA);
    expect(c!.contenido.at(-1)).toMatch(/^Dedicatoria: /);
  });

  it("omits an empty dedication", () => {
    const c = calcularCaja({ tamano: "mediana", items: ["cafe-de-altura"], dedicatoria: "   " });
    expect(c!.caja.dedicatoria).toBeUndefined();
    expect(c!.contenido).toEqual(["Café de Altura"]);
  });
});
