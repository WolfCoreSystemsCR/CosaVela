import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BotonAgregarCantidad } from "@/components/Carrito";
import { Icono } from "@/components/Icono";
import { ImagenProducto } from "@/components/Ilustracion";
import { TarjetaProducto } from "@/components/TarjetaProducto";
import { enlaceWhatsApp, sitioUrl } from "@/lib/negocio";
import { buscarProducto, categorias, colones, ocasiones, productos } from "@/lib/productos";

export const dynamicParams = false;

export function generateStaticParams() {
  return productos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tienda/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = buscarProducto(slug);
  if (!p) return {};
  return {
    title: p.nombre,
    description: `${p.resumen} ${p.descripcion}`.slice(0, 160),
    alternates: { canonical: `/tienda/${p.slug}` },
    openGraph: { title: `${p.nombre} | CosaVela`, description: p.resumen },
  };
}

export default async function PaginaProducto({ params }: PageProps<"/tienda/[slug]">) {
  const { slug } = await params;
  const p = buscarProducto(slug);
  if (!p) notFound();

  const relacionados = productos
    .filter((o) => o.slug !== p.slug && o.categoria !== "complementos" && o.ocasiones.some((x) => p.ocasiones.includes(x)))
    .slice(0, 4);
  const categoria = categorias.find((c) => c.id === p.categoria)!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.nombre,
    description: p.descripcion,
    brand: { "@type": "Brand", name: "CosaVela" },
    url: `${sitioUrl}/tienda/${p.slug}`,
    offers: { "@type": "Offer", price: p.precio, priceCurrency: "CRC", availability: "https://schema.org/InStock" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="contenedor pt-8">
        <nav aria-label="Ruta" className="text-sm text-cacao-suave">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/tienda" className="hover:text-cacao">Tienda</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={`/tienda?categoria=${categoria.id}`} className="hover:text-cacao">{categoria.nombre}</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-cacao">{p.nombre}</li>
          </ol>
        </nav>
      </div>

      <section className="contenedor grid gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-14">
        <div className="relative aspect-square overflow-hidden rounded-[2.25rem] bg-gradient-to-b from-papel to-arena lg:sticky lg:top-28 lg:self-start">
          <div className="absolute inset-[6%]">
            <ImagenProducto producto={p} prioridad />
          </div>
          {p.insignia && (
            <span className="absolute top-6 left-6 rounded-full bg-papel/90 px-3 py-1 text-xs font-semibold tracking-wide text-oliva-oscuro uppercase">
              {p.insignia}
            </span>
          )}
        </div>

        <div className="lg:py-6">
          <p className="ceja">{categoria.nombre}</p>
          <h1 className="mt-3 font-serif text-5xl leading-none font-medium sm:text-6xl">{p.nombre}</h1>
          <p className="mt-5 text-2xl font-semibold tabular-nums">{colones(p.precio)}</p>
          <p className="mt-6 text-lg leading-relaxed text-cacao-suave">{p.descripcion}</p>

          {p.notas && (
            <div className="mt-8">
              <p className="text-sm font-semibold">Notas aromáticas</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {p.notas.map((n) => (
                  <li key={n} className="rounded-full border border-linea bg-papel px-4 py-1.5 text-sm">{n}</li>
                ))}
              </ul>
            </div>
          )}

          {p.incluye && (
            <div className="mt-8 rounded-3xl border border-linea bg-papel p-6">
              <p className="text-sm font-semibold">Qué incluye</p>
              <ul className="mt-4 space-y-2.5">
                {p.incluye.map((n) => (
                  <li key={n} className="flex items-start gap-3 text-sm">
                    <Icono nombre="check" className="mt-0.5 size-4 shrink-0 text-oliva" /> {n}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8">
            <BotonAgregarCantidad slug={p.slug} nombre={p.nombre} />
          </div>
          <a
            href={enlaceWhatsApp(`¡Hola CosaVela! Tengo una consulta sobre: ${p.nombre}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 py-3 text-sm font-medium text-oliva hover:text-cacao"
          >
            <Icono nombre="whatsapp" className="size-4" /> Consultar por WhatsApp
          </a>

          <dl className="mt-8 grid gap-4 border-t border-linea pt-8 text-sm sm:grid-cols-2">
            {p.detalles?.map((d) => (
              <div key={d} className="flex items-center gap-3">
                <Icono nombre="hoja" className="size-4 text-oliva" /> {d}
              </div>
            ))}
            <div className="flex items-center gap-3"><Icono nombre="pluma" className="size-4 text-oliva" /> Dedicatoria escrita a mano</div>
            <div className="flex items-center gap-3"><Icono nombre="camion" className="size-4 text-oliva" /> Envío a todo Costa Rica</div>
          </dl>

          <p className="mt-8 text-sm text-cacao-suave">
            Ideal para:{" "}
            {p.ocasiones.map((id, i) => {
              const o = ocasiones.find((x) => x.id === id)!;
              return (
                <span key={id}>
                  {i > 0 && ", "}
                  <Link href={`/tienda?ocasion=${id}`} className="underline decoration-linea underline-offset-4 hover:text-cacao">
                    {o.nombre.toLowerCase()}
                  </Link>
                </span>
              );
            })}
          </p>
        </div>
      </section>

      {relacionados.length > 0 && (
        <section className="border-t border-linea bg-papel">
          <div className="contenedor py-16 sm:py-20">
            <h2 className="font-serif text-4xl">También le puede gustar</h2>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
              {relacionados.map((r) => (
                <TarjetaProducto key={r.slug} producto={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
