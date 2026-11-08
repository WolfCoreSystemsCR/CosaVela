import type { Metadata } from "next";
import { FormularioEmpresa } from "@/components/FormularioEmpresa";
import { Icono, type NombreIcono } from "@/components/Icono";
import { CajaSVG } from "@/components/Ilustracion";
import { TarjetaProducto } from "@/components/TarjetaProducto";
import { productos } from "@/lib/productos";

export const metadata: Metadata = {
  title: "Regalos corporativos",
  description:
    "Cajas de regalo y velas artesanales para empresas en Costa Rica: fin de año, clientes y bienvenida de colaboradores. Personalizadas con su logo.",
  alternates: { canonical: "/empresas" },
};

const beneficios: { icono: NombreIcono; titulo: string; texto: string }[] = [
  { icono: "pluma", titulo: "Con su marca", texto: "Etiqueta, tarjeta o cinta con el logo y los colores de su empresa." },
  { icono: "regalo", titulo: "A su medida", texto: "Armamos la caja según su presupuesto, la ocasión y la cantidad." },
  { icono: "camion", titulo: "Entregamos por usted", texto: "En su oficina o directo a la casa de cada colaborador o cliente." },
  { icono: "hoja", titulo: "Hecho en Costa Rica", texto: "Velas hechas a mano y complementos de productores locales." },
];

const ocasiones = ["Fin de año y aguinaldo", "Bienvenida de colaboradores", "Clientes y proveedores", "Eventos y activaciones", "Día de la Madre y del Padre", "Aniversarios"];

const proceso = [
  { titulo: "Cotización", texto: "Nos cuenta cantidad, presupuesto y fecha. Le enviamos una propuesta." },
  { titulo: "Muestra", texto: "Aprobamos juntos el diseño y el contenido de la caja." },
  { titulo: "Producción", texto: "Hacemos las velas y armamos cada caja a mano." },
  { titulo: "Entrega", texto: "Entregamos en una dirección o en varias, según lo acordado." },
];

export default function Empresas() {
  const sugeridas = productos.filter((p) => p.categoria === "cajas" && p.ocasiones.includes("empresas"));
  return (
    <>
      <section className="grano relative overflow-hidden bg-cacao text-papel">
        <div className="pointer-events-none absolute -top-40 right-0 size-[34rem] rounded-full bg-dorado/20 blur-3xl" />
        <div className="contenedor relative z-10 grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-dorado-claro uppercase">
              <span className="h-px w-8 bg-dorado-claro" /> Regalos corporativos
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-[1] font-medium text-balance sm:text-6xl lg:text-7xl">
              El detalle que su equipo <em className="text-dorado-claro">sí</em> va a recordar.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-papel/75">
              Cajas de regalo con velas artesanales y productos costarricenses, personalizadas con su marca. Desde 10 unidades.
            </p>
            <a href="#cotizar" className="boton mt-9 bg-papel text-cacao hover:bg-dorado-claro hover:text-cacao">
              Pedir cotización <Icono nombre="flecha" className="size-4" />
            </a>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-sm rounded-full bg-papel/5 p-10 ring-1 ring-papel/10">
            <CajaSVG tono={{ cera: "#E7DCC8", acento: "#B4842F", etiqueta: "#3B2A20" }} />
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <div className="aparecer max-w-2xl">
            <p className="ceja">Por qué CosaVela</p>
            <h2 className="titulo mt-4">Un regalo con intención, sin trabajo extra para usted.</h2>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {beneficios.map((b) => (
              <li key={b.titulo} className="aparecer rounded-[1.75rem] border border-linea bg-papel p-7">
                <div className="grid size-12 place-items-center rounded-2xl bg-oliva/15 text-oliva">
                  <Icono nombre={b.icono} className="size-6" />
                </div>
                <h3 className="mt-6 font-serif text-2xl">{b.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cacao-suave">{b.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-linea bg-papel py-16">
        <div className="contenedor grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-center">
          <h2 className="font-serif text-4xl leading-tight">Ideal para</h2>
          <ul className="flex flex-wrap gap-3">
            {ocasiones.map((o) => (
              <li key={o} className="rounded-full border border-linea bg-crema px-5 py-2.5">{o}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <div className="aparecer max-w-2xl">
            <p className="ceja">Proceso</p>
            <h2 className="titulo mt-4">Cómo trabajamos</h2>
          </div>
          <ol className="mt-12 grid gap-8 md:grid-cols-4">
            {proceso.map((p, i) => (
              <li key={p.titulo} className="aparecer border-t-2 border-cacao pt-6">
                <span className="font-serif text-5xl text-dorado">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold">{p.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cacao-suave">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {sugeridas.length > 0 && (
        <section className="seccion bg-papel">
          <div className="contenedor">
            <div className="aparecer max-w-2xl">
              <p className="ceja">Para inspirarse</p>
              <h2 className="titulo mt-4">Cajas sugeridas</h2>
              <p className="mt-4 text-lg text-cacao-suave">Precio unitario de referencia. En volumen cotizamos aparte.</p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
              {sugeridas.map((p) => (
                <TarjetaProducto key={p.slug} producto={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="cotizar" className="seccion bg-oliva-oscuro text-papel">
        <div className="contenedor grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-dorado-claro uppercase">
              <span className="h-px w-8 bg-dorado-claro" /> Cotización
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.05] font-medium sm:text-5xl">Cuéntenos qué necesita.</h2>
            <p className="mt-5 text-lg text-papel/75">Le respondemos con una propuesta según cantidad, presupuesto y fecha.</p>
            <p className="mt-8 text-sm text-papel/60">Para fin de año recomendamos pedir con 3 a 4 semanas de anticipación.</p>
          </div>
          <FormularioEmpresa />
        </div>
      </section>
    </>
  );
}
