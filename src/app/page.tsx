import Image from "next/image";
import Link from "next/link";
import { CajaSVG, VelaSVG } from "@/components/Ilustracion";
import { Icono, type NombreIcono } from "@/components/Icono";
import { TarjetaProducto } from "@/components/TarjetaProducto";
import { enlaceWhatsApp, preguntas } from "@/lib/negocio";
import { ocasiones, productos } from "@/lib/productos";

const cajas = productos.filter((p) => p.categoria === "cajas").slice(0, 4);
const velas = productos.filter((p) => p.categoria === "velas");

const cinta = ["Hecho a mano", "Aromas de Costa Rica", "Dedicatoria escrita a mano", "Envío a todo el país", "Pago con SINPE Móvil", "Regalos para empresas"];

const pasos: { icono: NombreIcono; titulo: string; texto: string }[] = [
  { icono: "regalo", titulo: "Elija o arme su caja", texto: "Escoja una caja lista o combine velas y complementos a su gusto." },
  { icono: "pluma", titulo: "Escriba su dedicatoria", texto: "La pasamos a mano en una tarjeta. Usted pone las palabras, nosotros el detalle." },
  { icono: "camion", titulo: "Lo entregamos", texto: "A domicilio en la GAM o por Correos de Costa Rica a cualquier provincia." },
];

const tonosOcasion = ["#EADFCB", "#E3E5D2", "#F1DCD2", "#EDE3D0", "#E0E6DA", "#E9D8C8", "#E4DED2"];

export default function Inicio() {
  return (
    <>
      {/* ───────── Portada ───────── */}
      <section className="grano relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -right-40 size-[38rem] rounded-full bg-dorado-claro/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 size-[30rem] rounded-full bg-oliva-claro/20 blur-3xl" />
        <div className="contenedor relative z-10 grid items-center gap-12 pt-10 pb-20 lg:grid-cols-[1.1fr_1fr] lg:pt-16 lg:pb-28">
          <div className="aparecer">
            <p className="ceja">
              <span className="h-px w-8 bg-oliva" /> Hecho a mano en Costa Rica
            </p>
            <h1 className="mt-6 font-serif text-[3.25rem] leading-[0.98] font-medium tracking-tight text-balance sm:text-7xl lg:text-[5.5rem]">
              Regalos que se <em className="oro pr-[0.06em] italic">sienten</em>, se huelen y se recuerdan.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cacao-suave">
              Velas artesanales con aromas ticos y cajas de regalo con dedicatoria escrita a mano. Para mamá, para un
              cumpleaños o para todo su equipo de trabajo.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/tienda" className="boton">
                Comprar regalos <Icono nombre="flecha" className="size-4" />
              </Link>
              <Link href="/empresas" className="boton-claro">
                Regalos para empresas
              </Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-linea pt-6 text-sm">
              <div>
                <dt className="text-cacao-suave">Envío</dt>
                <dd className="mt-1 font-semibold">Todo el país</dd>
              </div>
              <div>
                <dt className="text-cacao-suave">Pago</dt>
                <dd className="mt-1 font-semibold">SINPE Móvil</dd>
              </div>
              <div>
                <dt className="text-cacao-suave">Tarjeta</dt>
                <dd className="mt-1 font-semibold">Escrita a mano</dd>
              </div>
            </dl>
          </div>

          <div className="aparecer relative mx-auto w-full max-w-lg">
            <div className="relative aspect-square overflow-hidden rounded-full border border-linea bg-[#efe5d9] shadow-2xl shadow-cacao/10">
              <Image
                src="/img/logo-cosavela.jpg"
                alt="Logo de CosaVela: corona de hojas y el lema Más que un regalo, una experiencia"
                fill
                priority
                sizes="(min-width: 1024px) 512px, 90vw"
                className="scale-[1.08] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 w-32 rounded-3xl border border-linea bg-papel/90 p-3 shadow-xl backdrop-blur sm:w-40">
              <div className="aspect-[5/6]">
                <VelaSVG tono={velas[0].tono} nombre={velas[0].nombre} />
              </div>
            </div>
            <div className="absolute -top-4 -right-2 w-36 rounded-3xl border border-linea bg-papel/90 p-3 shadow-xl backdrop-blur sm:w-44">
              <div className="aspect-square">
                <CajaSVG tono={velas[2].tono} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Cinta ───────── */}
      <div className="overflow-hidden border-y border-linea bg-papel py-4" aria-hidden="true">
        <div className="cinta flex w-max gap-10 font-serif text-xl text-cacao-suave italic">
          {[...cinta, ...cinta, ...cinta, ...cinta].map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              {t} <span className="text-dorado not-italic">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ───────── Ocasiones ───────── */}
      <section className="seccion">
        <div className="contenedor">
          <div className="aparecer flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="ceja">Regale con intención</p>
              <h2 className="titulo mt-4">¿Para qué ocasión?</h2>
            </div>
            <Link href="/tienda" className="inline-flex items-center gap-2 text-sm font-semibold text-oliva hover:text-cacao">
              Ver todo el catálogo <Icono nombre="flecha" className="size-4" />
            </Link>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {ocasiones.map((o, i) => (
              <li key={o.id} className={`aparecer ${i === 0 ? "col-span-2 row-span-2" : i >= 5 ? "lg:col-span-2" : ""}`}>
                <Link
                  href={`/tienda?ocasion=${o.id}`}
                  style={{ backgroundColor: tonosOcasion[i % tonosOcasion.length] }}
                  className={`group relative flex h-full flex-col justify-end overflow-hidden rounded-[1.75rem] p-6 transition duration-500 ease-suave hover:-translate-y-1 hover:shadow-xl hover:shadow-cacao/10 ${
                    i === 0 ? "min-h-72 sm:min-h-[26rem] sm:p-10" : "min-h-40 sm:min-h-48"
                  }`}
                >
                  <Icono
                    nombre={o.id === "empresas" ? "edificio" : o.id === "mama" || o.id === "amor" ? "corazon" : o.id === "bienestar" ? "hoja" : "regalo"}
                    className={`absolute top-6 right-6 text-oliva/70 transition duration-500 group-hover:rotate-12 ${i === 0 ? "size-10" : "size-6"}`}
                  />
                  <p className={`font-serif leading-none ${i === 0 ? "text-5xl sm:text-6xl" : "text-2xl sm:text-3xl"}`}>{o.nombre}</p>
                  <p className="mt-2 text-sm text-cacao-suave">{o.frase}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── Cajas destacadas ───────── */}
      <section className="seccion bg-papel">
        <div className="contenedor">
          <div className="aparecer max-w-2xl">
            <p className="ceja">Listas para regalar</p>
            <h2 className="titulo mt-4">Cajas de regalo</h2>
            <p className="mt-4 text-lg text-cacao-suave">Cada caja va armada a mano, con relleno natural y su tarjeta.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
            {cajas.map((p) => (
              <div key={p.slug} className="aparecer">
                <TarjetaProducto producto={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Arme su caja ───────── */}
      <section className="grano relative overflow-hidden bg-oliva-oscuro text-papel">
        <div className="contenedor relative z-10 grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2">
          <div className="aparecer">
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-dorado-claro uppercase">
              <span className="h-px w-8 bg-dorado-claro" /> Personalizado
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.05] font-medium text-balance sm:text-5xl lg:text-6xl">
              Arme una caja tan única como la persona que la recibe.
            </h2>
            <p className="mt-6 max-w-lg text-lg text-papel/75">
              Elija el tamaño, combine sus aromas favoritos con café, chocolate o sales de baño y escriba su mensaje. Usted ve el
              precio al instante.
            </p>
            <Link href="/arma-tu-caja" className="boton mt-9 bg-papel text-cacao hover:bg-dorado-claro hover:text-cacao">
              Armar mi caja <Icono nombre="flecha" className="size-4" />
            </Link>
          </div>
          <ol className="aparecer grid gap-4">
            {["Elija el tamaño de la caja", "Escoja velas y complementos", "Escriba la dedicatoria"].map((t, i) => (
              <li key={t} className="flex items-center gap-5 rounded-3xl border border-papel/15 bg-papel/5 p-6 backdrop-blur">
                <span className="font-serif text-5xl text-dorado-claro">0{i + 1}</span>
                <span className="text-lg">{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── Velas ───────── */}
      <section className="seccion">
        <div className="contenedor">
          <div className="aparecer flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="ceja">Nuestros aromas</p>
              <h2 className="titulo mt-4">Costa Rica, en una vela</h2>
              <p className="mt-4 text-lg text-cacao-suave">Café, cacao, guayaba, bosque nuboso. Aromas que se sienten de aquí.</p>
            </div>
            <Link href="/tienda?categoria=velas" className="inline-flex items-center gap-2 text-sm font-semibold text-oliva hover:text-cacao">
              Ver todas las velas <Icono nombre="flecha" className="size-4" />
            </Link>
          </div>
          <div className="-mx-4 mt-12 flex snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8 [&::-webkit-scrollbar]:hidden">
            {velas.map((p) => (
              <div key={p.slug} className="w-[78%] shrink-0 snap-start sm:w-[42%] lg:w-[23%]">
                <TarjetaProducto producto={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Cómo funciona ───────── */}
      <section className="seccion border-t border-linea bg-papel">
        <div className="contenedor">
          <div className="aparecer mx-auto max-w-2xl text-center">
            <p className="ceja">Así de fácil</p>
            <h2 className="titulo mt-4">Cómo funciona</h2>
          </div>
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {pasos.map((p, i) => (
              <li key={p.titulo} className="aparecer relative rounded-[1.75rem] border border-linea bg-crema p-8">
                <span className="absolute top-6 right-7 font-serif text-6xl text-arena">{i + 1}</span>
                <div className="grid size-14 place-items-center rounded-2xl bg-oliva text-papel">
                  <Icono nombre={p.icono} className="size-6" />
                </div>
                <h3 className="mt-8 font-serif text-3xl">{p.titulo}</h3>
                <p className="mt-3 leading-relaxed text-cacao-suave">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────── Empresas ───────── */}
      <section className="seccion">
        <div className="contenedor">
          <div className="grid overflow-hidden rounded-[2.5rem] bg-cacao text-papel lg:grid-cols-2">
            <div className="aparecer p-8 sm:p-14">
              <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-dorado-claro uppercase">
                <span className="h-px w-8 bg-dorado-claro" /> Para empresas
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-[1.05] font-medium text-balance sm:text-5xl">
                Regalos corporativos que sí se usan.
              </h2>
              <p className="mt-5 text-lg text-papel/75">
                Fin de año, bienvenida a nuevos colaboradores, clientes y eventos. Nosotros armamos, personalizamos y
                entregamos.
              </p>
              <ul className="mt-8 space-y-3">
                {["Etiqueta o tarjeta con el logo de su empresa", "Entrega en oficina o a cada colaborador", "Cajas a la medida de su presupuesto"].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-dorado/30 text-dorado-claro">
                      <Icono nombre="check" className="size-4" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <Link href="/empresas" className="boton mt-10 bg-papel text-cacao hover:bg-dorado-claro hover:text-cacao">
                Pedir cotización <Icono nombre="flecha" className="size-4" />
              </Link>
            </div>
            <div className="bg-gradient-to-br from-[#5a4232] to-cacao">
              <div className="grid h-full grid-cols-3 content-center gap-4 p-8 pb-14 sm:p-12 sm:pb-16">
                {productos
                  .filter((p) => p.categoria === "velas")
                  .slice(0, 6)
                  .map((p, i) => (
                    <div key={p.slug} className={`aspect-[5/6] rounded-2xl bg-papel/10 p-2 ${i % 2 ? "translate-y-6" : ""}`}>
                      <VelaSVG tono={p.tono} encendida={i % 3 === 0} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Hecho a mano ───────── */}
      <section className="seccion bg-papel">
        <div className="contenedor grid items-center gap-12 lg:grid-cols-2">
          <div className="aparecer relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-full border border-linea bg-gradient-to-b from-[#f6ead8] to-arena">
            <div className="absolute inset-x-10 bottom-10 top-24">
              <VelaSVG tono={velas[5].tono} nombre={velas[5].nombre} />
            </div>
          </div>
          <div className="aparecer">
            <p className="ceja">Detrás de cada vela</p>
            <h2 className="titulo mt-4">Hecho a mano, una por una.</h2>
            <p className="mt-6 text-lg leading-relaxed text-cacao-suave">
              CosaVela nació en casa, entre frascos, mechas y aromas. Cada vela se vierte a mano en pequeños lotes y cada caja se
              arma pensando en quien la va a abrir.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-cacao-suave">
              Preferimos trabajar con productores costarricenses para el café, el chocolate y los complementos, para que su regalo
              también apoye a otros emprendimientos.
            </p>
            <Link href="/nosotros" className="boton-claro mt-8">
              Conozca nuestra historia
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── Preguntas ───────── */}
      <section id="preguntas" className="seccion">
        <div className="contenedor grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div className="aparecer">
            <p className="ceja">Preguntas frecuentes</p>
            <h2 className="titulo mt-4">Lo que más nos preguntan</h2>
            <p className="mt-4 text-cacao-suave">¿Tiene otra duda? Escríbanos por WhatsApp y le respondemos.</p>
          </div>
          <div className="aparecer divide-y divide-linea border-y border-linea">
            {preguntas.map((p) => (
              <details key={p.pregunta} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-2xl [&::-webkit-details-marker]:hidden">
                  {p.pregunta}
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-linea transition group-open:rotate-45 group-open:bg-cacao group-open:text-papel">
                    <Icono nombre="mas" className="size-4" />
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-cacao-suave">{p.respuesta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Cierre ───────── */}
      <section className="pb-20 sm:pb-28">
        <div className="contenedor">
          <div className="aparecer grano relative overflow-hidden rounded-[2.5rem] bg-arena px-6 py-16 text-center sm:px-12 sm:py-20">
            <h2 className="relative z-10 mx-auto max-w-3xl font-serif text-4xl leading-[1.05] font-medium text-balance sm:text-6xl">
              ¿Tiene una idea de regalo? <span className="oro italic">La hacemos realidad.</span>
            </h2>
            <p className="relative z-10 mx-auto mt-5 max-w-xl text-lg text-cacao-suave">
              Pedidos especiales, bodas, baby showers o recuerdos para eventos. Cuéntenos y le cotizamos.
            </p>
            <a
              href={enlaceWhatsApp("¡Hola CosaVela! Quisiera cotizar un pedido especial.")}
              target="_blank"
              rel="noopener noreferrer"
              className="boton relative z-10 mt-8"
            >
              <Icono nombre="whatsapp" className="size-5" /> Escribir por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
