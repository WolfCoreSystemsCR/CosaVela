"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BotonCarrito } from "./Carrito";
import { Icono } from "./Icono";
import { Marca } from "./Marca";

const enlaces = [
  { href: "/tienda", texto: "Tienda" },
  { href: "/arma-tu-caja", texto: "Arme su caja" },
  { href: "/empresas", texto: "Empresas" },
  { href: "/nosotros", texto: "Nosotros" },
];

export function Encabezado() {
  const ruta = usePathname();
  const [menu, setMenu] = useState(false);
  const [desplazado, setDesplazado] = useState(false);

  useEffect(() => {
    const alDesplazar = () => setDesplazado(window.scrollY > 12);
    alDesplazar();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => window.removeEventListener("scroll", alDesplazar);
  }, []);

  useEffect(() => setMenu(false), [ruta]);

  return (
    <>
      <div className="bg-oliva-oscuro px-4 py-2 text-center text-xs font-medium tracking-wide text-papel/90">
        Envíos a todo Costa Rica · Pago con SINPE Móvil · Dedicatoria escrita a mano
      </div>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          desplazado || menu ? "border-b border-linea/70 bg-crema/85 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <nav className="contenedor flex h-18 items-center justify-between gap-6" aria-label="Principal">
          <Link href="/" aria-label="CosaVela, inicio" className="pt-2">
            <Marca className="text-[2rem]" />
          </Link>
          <ul className="hidden items-center gap-1 md:flex">
            {enlaces.map((e) => {
              const activo = ruta === e.href || ruta.startsWith(`${e.href}/`);
              return (
                <li key={e.href}>
                  <Link
                    href={e.href}
                    aria-current={activo ? "page" : undefined}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition hover:text-oliva ${activo ? "text-oliva" : "text-cacao"}`}
                  >
                    {e.texto}
                    {activo && <span className="absolute inset-x-4 -bottom-0.5 h-px bg-oliva" />}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-1">
            <BotonCarrito />
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full hover:bg-arena md:hidden"
              onClick={() => setMenu((m) => !m)}
              aria-expanded={menu}
              aria-controls="menu-movil"
              aria-label={menu ? "Cerrar menú" : "Abrir menú"}
            >
              <Icono nombre={menu ? "cerrar" : "menu"} />
            </button>
          </div>
        </nav>
        <div id="menu-movil" hidden={!menu} className="border-t border-linea/70 md:hidden">
          <ul className="contenedor flex flex-col py-4">
            {enlaces.map((e) => (
              <li key={e.href}>
                <Link href={e.href} className="block border-b border-linea/60 py-4 font-serif text-2xl">
                  {e.texto}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </header>
    </>
  );
}
