import { describe, expect, it } from "vitest";
import { MAX_CANTIDAD, sanear } from "./carrito";
import { buscarProducto, calcularCaja } from "./productos";

describe("sanear (cart restored from localStorage)", () => {
  it("returns an empty cart for invalid data", () => {
    expect(sanear(null)).toEqual([]);
    expect(sanear({})).toEqual([]);
    expect(sanear("[]")).toEqual([]);
  });

  it("takes catalog product price and name from the catalog, not from storage", () => {
    const [linea] = sanear([{ slug: "cafe-de-altura", nombre: "Hack", precio: 1, cantidad: 2 }]);
    const p = buscarProducto("cafe-de-altura")!;
    expect(linea).toMatchObject({ id: p.slug, nombre: p.nombre, precio: p.precio, cantidad: 2 });
  });

  it("recomputes custom box price from the catalog, ignoring a tampered stored price", () => {
    const caja = { tamano: "pequena", items: ["cafe-de-altura", "chocolate-artesanal"] };
    const [linea] = sanear([{ id: "caja-1", nombre: "x", precio: 1, cantidad: 1, contenido: ["x"], caja }]);
    expect(linea.precio).toBe(calcularCaja(caja)!.precio);
    expect(linea.contenido).toEqual(["Café de Altura", "Chocolate artesanal"]);
  });

  it("drops custom boxes that are no longer valid and legacy lines without box references", () => {
    expect(sanear([{ id: "caja-1", precio: 5000, cantidad: 1, caja: { tamano: "pequena", items: ["no-existe"] } }])).toEqual([]);
    expect(sanear([{ id: "caja-2", nombre: "Caja", precio: 1, cantidad: 1, contenido: ["Vela"] }])).toEqual([]);
  });

  it("clamps quantities and drops unknown products", () => {
    const lineas = sanear([
      { slug: "cafe-de-altura", cantidad: 1000 },
      { slug: "guayaba-rosa", cantidad: -3 },
      { slug: "no-existe", cantidad: 1 },
    ]);
    expect(lineas.map((l) => l.cantidad)).toEqual([MAX_CANTIDAD, 1]);
  });

  it("does not duplicate the same product line", () => {
    expect(sanear([{ slug: "cafe-de-altura" }, { slug: "cafe-de-altura" }])).toHaveLength(1);
  });
});
