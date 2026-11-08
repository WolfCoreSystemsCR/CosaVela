import Link from "next/link";
import { Llama } from "@/components/Marca";

export default function NoEncontrado() {
  return (
    <section className="contenedor flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Llama className="h-16 w-8" />
      <h1 className="mt-6 font-serif text-5xl">Esta página se apagó</h1>
      <p className="mt-3 text-cacao-suave">No encontramos lo que buscaba.</p>
      <Link href="/" className="boton mt-8">Volver al inicio</Link>
    </section>
  );
}
