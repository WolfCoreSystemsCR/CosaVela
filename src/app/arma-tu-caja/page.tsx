import type { Metadata } from "next";
import { ArmaCaja } from "@/components/ArmaCaja";

export const metadata: Metadata = {
  title: "Arme su caja de regalo",
  description: "Elija el tamaño, combine velas artesanales con café, chocolate o sales de baño y escriba su dedicatoria. Precio al instante.",
  alternates: { canonical: "/arma-tu-caja" },
};

export default function PaginaArmaCaja() {
  return (
    <>
      <section className="border-b border-linea bg-papel">
        <div className="contenedor py-14 sm:py-20">
          <p className="ceja">Personalizado</p>
          <h1 className="titulo mt-4">Arme su caja</h1>
          <p className="mt-4 max-w-xl text-lg text-cacao-suave">
            Cuatro pasos. Usted escoge, nosotros la armamos a mano y la entregamos con su mensaje.
          </p>
        </div>
      </section>
      <section className="contenedor py-12 sm:py-16">
        <ArmaCaja />
      </section>
    </>
  );
}
