import Link from "next/link";
import { enlaceWhatsApp, negocio } from "@/lib/negocio";
import { Icono } from "./Icono";
import { Marca } from "./Marca";

export function PiePagina() {
  const anio = new Date().getFullYear();
  return (
    <footer className="grano bg-cacao text-papel/80">
      <div className="contenedor relative z-10 grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Marca className="text-4xl" />
          <p className="mt-4 max-w-xs font-serif text-xl text-papel/90 italic">{negocio.lema}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">Velas y regalos hechos a mano en Costa Rica.</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-dorado-claro uppercase">Tienda</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="hover:text-papel" href="/tienda?categoria=cajas">Cajas de regalo</Link></li>
            <li><Link className="hover:text-papel" href="/tienda?categoria=velas">Velas</Link></li>
            <li><Link className="hover:text-papel" href="/tienda?categoria=complementos">Complementos</Link></li>
            <li><Link className="hover:text-papel" href="/arma-tu-caja">Arme su caja</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-dorado-claro uppercase">CosaVela</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="hover:text-papel" href="/empresas">Regalos para empresas</Link></li>
            <li><Link className="hover:text-papel" href="/nosotros">Nuestra historia</Link></li>
            <li><Link className="hover:text-papel" href="/#preguntas">Preguntas frecuentes</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-dorado-claro uppercase">Hablemos</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                className="inline-flex items-center gap-2 hover:text-papel"
                href={enlaceWhatsApp("¡Hola CosaVela! Quisiera hacer una consulta.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icono nombre="whatsapp" className="size-4" /> WhatsApp
              </a>
            </li>
            <li>
              <a className="inline-flex items-center gap-2 hover:text-papel" href={negocio.instagram} target="_blank" rel="noopener noreferrer">
                <Icono nombre="instagram" className="size-4" /> Instagram
              </a>
            </li>
            <li>
              <a className="hover:text-papel" href={`mailto:${negocio.correo}`}>
                {negocio.correo}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative z-10 border-t border-papel/10">
        <div className="contenedor flex flex-col gap-2 py-6 text-xs text-papel/50 sm:flex-row sm:justify-between">
          <p>© {anio} CosaVela · Hecho con cariño en Costa Rica</p>
          <p>Pagos con SINPE Móvil y transferencia</p>
        </div>
      </div>
    </footer>
  );
}
