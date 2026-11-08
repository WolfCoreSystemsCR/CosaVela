import type { Metadata } from "next";
import Link from "next/link";
import { Icono } from "@/components/Icono";
import { TarjetaProducto } from "@/components/TarjetaProducto";
import { categorias, ocasiones, productos, type Categoria, type Ocasion } from "@/lib/productos";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Velas artesanales, cajas de regalo y complementos hechos en Costa Rica. Precios en colones y envío a todo el país.",
  alternates: { canonical: "/tienda" },
};

const ordenes = [
  { id: "destacados", nombre: "Destacados" },
  { id: "menor", nombre: "Menor precio" },
  { id: "mayor", nombre: "Mayor precio" },
] as const;

type Orden = (typeof ordenes)[number]["id"];

function texto(v: string | string[] | undefined) {
  return typeof v === "string" ? v : undefined;
}

export default async function Tienda({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const categoria = categorias.find((c) => c.id === texto(params.categoria))?.id;
  const ocasion = ocasiones.find((o) => o.id === texto(params.ocasion))?.id;
  const orden: Orden = ordenes.find((o) => o.id === texto(params.orden))?.id ?? "destacados";

  const enlace = (cambios: { categoria?: Categoria | null; ocasion?: Ocasion | null; orden?: Orden }) => {
    const q = new URLSearchParams();
    const c = cambios.categoria === undefined ? categoria : cambios.categoria;
    const o = cambios.ocasion === undefined ? ocasion : cambios.ocasion;
    const r = cambios.orden ?? orden;
    if (c) q.set("categoria", c);
    if (o) q.set("ocasion", o);
    if (r !== "destacados") q.set("orden", r);
    const s = q.toString();
    return s ? `/tienda?${s}` : "/tienda";
  };

  const pesoCategoria: Record<Categoria, number> = { cajas: 0, velas: 1, complementos: 2 };
  const lista = productos
    .filter((p) => (!categoria || p.categoria === categoria) && (!ocasion || p.ocasiones.includes(ocasion)))
    .sort((a, b) => {
      if (orden === "menor") return a.precio - b.precio;
      if (orden === "mayor") return b.precio - a.precio;
      return pesoCategoria[a.categoria] - pesoCategoria[b.categoria] || Number(!!b.insignia) - Number(!!a.insignia);
    });

  const nombreOcasion = ocasiones.find((o) => o.id === ocasion)?.nombre;
  const nombreCategoria = categorias.find((c) => c.id === categoria)?.nombre;

  const chip = (activo: boolean) =>
    `whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
      activo ? "border-cacao bg-cacao text-papel" : "border-linea bg-papel hover:border-cacao/40"
    }`;

  return (
    <>
      <section className="border-b border-linea bg-papel">
        <div className="contenedor py-14 sm:py-20">
          <p className="ceja">Tienda</p>
          <h1 className="titulo mt-4">{nombreOcasion ?? nombreCategoria ?? "Todos los regalos"}</h1>
          <p className="mt-4 max-w-xl text-lg text-cacao-suave">
            Precios en colones. Todas las cajas incluyen tarjeta con su dedicatoria.
          </p>
        </div>
      </section>

      <section className="contenedor py-10">
        <div className="flex flex-col gap-4">
          <nav aria-label="Categorías" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            <Link href={enlace({ categoria: null })} className={chip(!categoria)} aria-current={!categoria ? "page" : undefined}>
              Todo
            </Link>
            {categorias.map((c) => (
              <Link key={c.id} href={enlace({ categoria: c.id })} className={chip(categoria === c.id)} aria-current={categoria === c.id ? "page" : undefined}>
                {c.nombre}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <nav aria-label="Ocasiones" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              {ocasiones.map((o) => (
                <Link
                  key={o.id}
                  href={enlace({ ocasion: ocasion === o.id ? null : o.id })}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${
                    ocasion === o.id ? "bg-oliva text-papel" : "text-cacao-suave hover:bg-arena hover:text-cacao"
                  }`}
                  aria-pressed={ocasion === o.id}
                >
                  {o.nombre}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-cacao-suave">Ordenar:</span>
              {ordenes.map((o) => (
                <Link key={o.id} href={enlace({ orden: o.id })} className={`whitespace-nowrap rounded-full px-3 py-1.5 transition ${orden === o.id ? "bg-arena font-semibold" : "hover:bg-arena/60"}`}>
                  {o.nombre}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-8 text-sm text-cacao-suave" aria-live="polite">
          {lista.length} {lista.length === 1 ? "producto" : "productos"}
        </p>

        {lista.length ? (
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-3 xl:grid-cols-4">
            {lista.map((p) => (
              <TarjetaProducto key={p.slug} producto={p} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.75rem] border border-dashed border-linea p-12 text-center">
            <p className="font-serif text-2xl">No hay productos con esos filtros.</p>
            <Link href="/tienda" className="boton-claro mt-6">
              Ver todo
            </Link>
          </div>
        )}

        <div className="mt-20 flex flex-col items-start justify-between gap-6 rounded-[1.75rem] bg-oliva-oscuro p-8 text-papel sm:flex-row sm:items-center sm:p-10">
          <div>
            <p className="font-serif text-3xl">¿No encuentra la combinación ideal?</p>
            <p className="mt-2 text-papel/75">Arme su propia caja con las velas y complementos que quiera.</p>
          </div>
          <Link href="/arma-tu-caja" className="boton shrink-0 bg-papel text-cacao hover:bg-dorado-claro hover:text-cacao">
            Armar mi caja <Icono nombre="flecha" className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
