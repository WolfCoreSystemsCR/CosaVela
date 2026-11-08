import type { Metadata } from "next";
import { FormularioPedido } from "@/components/FormularioPedido";

export const metadata: Metadata = {
  title: "Finalizar pedido",
  robots: { index: false, follow: true },
};

export default function PaginaCarrito() {
  return (
    <section className="contenedor py-12 sm:py-16">
      <p className="ceja">Su pedido</p>
      <h1 className="titulo mt-4 mb-10">Finalizar pedido</h1>
      <FormularioPedido />
    </section>
  );
}
