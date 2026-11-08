import Link from "next/link";
import { colones, type Producto } from "@/lib/productos";
import { BotonAgregar } from "./Carrito";
import { ImagenProducto } from "./Ilustracion";

export function TarjetaProducto({ producto }: { producto: Producto }) {
  return (
    <article className="group relative flex flex-col">
      <Link
        href={`/tienda/${producto.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-papel to-arena/80 transition duration-500 ease-suave group-hover:shadow-xl group-hover:shadow-cacao/10"
      >
        <div className="absolute inset-0 transition duration-700 ease-suave group-hover:scale-[1.04]">
          <ImagenProducto producto={producto} />
        </div>
        {producto.insignia && (
          <span className="absolute top-4 left-4 rounded-full bg-papel/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-oliva-oscuro uppercase backdrop-blur">
            {producto.insignia}
          </span>
        )}
        <span className="sr-only">Ver {producto.nombre}</span>
      </Link>
      <div className="mt-4 flex flex-1 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div>
          <h3 className="font-serif text-xl leading-tight sm:text-2xl">
            <Link href={`/tienda/${producto.slug}`} className="hover:text-oliva">
              {producto.nombre}
            </Link>
          </h3>
          <p className="mt-1 hidden text-sm text-cacao-suave sm:block">{producto.resumen}</p>
        </div>
        <p className="shrink-0 font-semibold tabular-nums sm:pt-1">{colones(producto.precio)}</p>
      </div>
      <BotonAgregar
        slug={producto.slug}
        nombre={producto.nombre}
        className="boton-claro mt-3 w-full px-3 py-2.5 sm:mt-4 sm:py-3 group-hover:border-cacao group-hover:bg-cacao group-hover:text-papel"
      />
    </article>
  );
}
