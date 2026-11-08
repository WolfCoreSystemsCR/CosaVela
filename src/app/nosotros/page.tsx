import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icono, type NombreIcono } from "@/components/Icono";
import { negocio } from "@/lib/negocio";

export const metadata: Metadata = {
  title: "Nuestra historia",
  description: "CosaVela nació en casa: velas hechas a mano en Costa Rica y regalos pensados para crear un momento.",
  alternates: { canonical: "/nosotros" },
};

// CONFIRMAR: ajustar la historia con las palabras de la fundadora.
const valores: { icono: NombreIcono; titulo: string; texto: string }[] = [
  { icono: "mano", titulo: "Hecho a mano", texto: "Cada vela se vierte a mano en lotes pequeños. Ninguna sale igual a otra." },
  { icono: "hoja", titulo: "De aquí", texto: "Aromas inspirados en Costa Rica y complementos de emprendimientos locales." },
  { icono: "corazon", titulo: "Con intención", texto: "Un regalo es un mensaje. Cuidamos cada detalle para que llegue completo." },
];

export default function Nosotros() {
  return (
    <>
      <section className="grano relative overflow-hidden">
        <div className="contenedor relative z-10 grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <p className="ceja">Nuestra historia</p>
            <h1 className="titulo mt-4">
              Todo empezó con una vela <em className="oro pr-1 italic">hecha en casa</em>.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-cacao-suave">
              CosaVela nació de las ganas de regalar algo que se sienta. No un objeto más, sino un momento: encender una vela,
              llenar la casa de un aroma conocido y leer unas palabras escritas a mano.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-cacao-suave">
              Hoy hacemos velas y cajas de regalo para quienes quieren decir gracias, te quiero o bienvenido de una forma más
              personal. Con la misma dedicación del primer día.
            </p>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-full border border-linea shadow-2xl shadow-cacao/10">
            <Image src="/img/logo-cosavela.jpg" alt={`Logo de CosaVela: ${negocio.lema}`} fill sizes="(min-width: 1024px) 448px, 90vw" className="scale-[1.08] object-cover" />
          </div>
        </div>
      </section>

      <section className="seccion bg-papel">
        <div className="contenedor">
          <h2 className="titulo text-center">Lo que nos mueve</h2>
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {valores.map((v) => (
              <li key={v.titulo} className="aparecer rounded-[1.75rem] border border-linea bg-crema p-8 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-oliva text-papel">
                  <Icono nombre={v.icono} className="size-6" />
                </div>
                <h3 className="mt-6 font-serif text-3xl">{v.titulo}</h3>
                <p className="mt-3 leading-relaxed text-cacao-suave">{v.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor max-w-3xl text-center">
          <p className="font-serif text-4xl leading-tight text-balance italic sm:text-5xl">“{negocio.lema}.”</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/tienda" className="boton">Ver la tienda <Icono nombre="flecha" className="size-4" /></Link>
            <Link href="/arma-tu-caja" className="boton-claro">Armar una caja</Link>
          </div>
        </div>
      </section>
    </>
  );
}
