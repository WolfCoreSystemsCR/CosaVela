import Image from "next/image";
import { useId } from "react";
import type { Producto } from "@/lib/productos";

type Tono = Producto["tono"];

function idSeguro(base: string) {
  return base.replace(/[^a-zA-Z0-9_-]/g, "");
}

/** Vela en vaso con etiqueta y llama animada. */
export function VelaSVG({ tono, nombre, encendida = true }: { tono: Tono; nombre?: string; encendida?: boolean }) {
  const id = `v${idSeguro(useId())}`;
  return (
    <svg viewBox="0 0 200 240" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-brillo`} cx="50%" cy="30%" r="55%">
          <stop offset="0" stopColor="#ffd38a" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffd38a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-vidrio`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".18" stopColor="#fff" stopOpacity=".12" />
          <stop offset=".8" stopColor="#fff" stopOpacity=".05" />
          <stop offset="1" stopColor="#fff" stopOpacity=".35" />
        </linearGradient>
        <linearGradient id={`${id}-llama`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#d2642e" />
          <stop offset=".5" stopColor="#f0913d" />
          <stop offset="1" stopColor="#ffd38a" />
        </linearGradient>
      </defs>
      {encendida && <circle cx="100" cy="78" r="74" fill={`url(#${id}-brillo)`} className="resplandor" />}
      <ellipse cx="100" cy="222" rx="66" ry="8" fill="#3b2a20" opacity=".12" />
      {/* vaso */}
      <path d="M44 92h112v118a10 10 0 0 1-10 10H54a10 10 0 0 1-10-10V92Z" fill={tono.cera} />
      <path d="M44 92h112v18H44z" fill="#000" opacity=".05" />
      <ellipse cx="100" cy="98" rx="52" ry="6" fill="#fff" opacity=".35" />
      {/* mecha y llama */}
      <path d="M100 98v-14" stroke="#3b2a20" strokeWidth="2.4" strokeLinecap="round" />
      {encendida && (
        <path
          className="llama"
          fill={`url(#${id}-llama)`}
          d="M100 86c-7 0-10.5-5-9.8-11.2.7-5.6 5-8.4 5.6-14 .4-3.6-.8-7-2.2-9.8 5.6 2.1 8.4 7 8.1 11.9 2-2.2 2.2-5.6 1.4-9 5 4.2 8.1 10.4 7.4 17.4C109.8 80.2 106.4 86 100 86Z"
        />
      )}
      {/* etiqueta */}
      <rect x="62" y="138" width="76" height="52" rx="4" fill="#fbf7f1" />
      <rect x="62" y="138" width="76" height="52" rx="4" fill="none" stroke={tono.acento} strokeOpacity=".35" />
      <text x="100" y="157" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" fill={tono.etiqueta} letterSpacing=".5">
        CosaVela
      </text>
      <line x1="80" y1="164" x2="120" y2="164" stroke={tono.acento} strokeOpacity=".5" />
      {nombre && (
        <text x="100" y="179" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="7.5" fill={tono.etiqueta} opacity=".85">
          {nombre.length > 22 ? `${nombre.slice(0, 21)}…` : nombre}
        </text>
      )}
      <path d="M44 92h112v118a10 10 0 0 1-10 10H54a10 10 0 0 1-10-10V92Z" fill={`url(#${id}-vidrio)`} />
      <path d="M52 100v100" stroke="#fff" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Caja kraft abierta con vela, ramita y lazo. */
export function CajaSVG({ tono }: { tono: Tono }) {
  const id = `c${idSeguro(useId())}`;
  return (
    <svg viewBox="0 0 240 240" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-kraft`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9bf98" />
          <stop offset="1" stopColor="#c4a57a" />
        </linearGradient>
        <linearGradient id={`${id}-llama`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#d2642e" />
          <stop offset="1" stopColor="#ffd38a" />
        </linearGradient>
        <radialGradient id={`${id}-brillo`} cx="50%" cy="40%" r="50%">
          <stop offset="0" stopColor="#ffd38a" stopOpacity=".5" />
          <stop offset="1" stopColor="#ffd38a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="104" cy="66" r="62" fill={`url(#${id}-brillo)`} className="resplandor" />
      <ellipse cx="120" cy="222" rx="96" ry="9" fill="#3b2a20" opacity=".12" />
      {/* fondo de la caja */}
      <path d="M28 118h184v92a8 8 0 0 1-8 8H36a8 8 0 0 1-8-8v-92Z" fill={`url(#${id}-kraft)`} />
      {/* vela dentro */}
      <g transform="translate(0 -16)">
      <rect x="78" y="78" width="52" height="64" rx="5" fill={tono.cera} />
      <rect x="86" y="100" width="36" height="22" rx="2" fill="#fbf7f1" />
      <line x1="94" y1="111" x2="114" y2="111" stroke={tono.acento} strokeOpacity=".6" />
      <path d="M104 80v-8" stroke="#3b2a20" strokeWidth="2" strokeLinecap="round" />
      <path
        className="llama"
        fill={`url(#${id}-llama)`}
        d="M104 73c-4.5 0-6.8-3.2-6.3-7.2.4-3.6 3.2-5.4 3.6-9 .3-2.3-.5-4.5-1.4-6.3 3.6 1.4 5.4 4.5 5.2 7.7 1.3-1.4 1.4-3.6.9-5.8 3.2 2.7 5.2 6.7 4.8 11.2C110.4 69.3 108.2 73 104 73Z"
      />
      {/* paquete de café / chocolate */}
      <rect x="138" y="92" width="40" height="50" rx="4" fill={tono.acento} opacity=".85" />
      <rect x="146" y="104" width="24" height="14" rx="2" fill="#fbf7f1" opacity=".9" />
      </g>
      {/* ramita */}
      <path d="M50 140c10-22 20-34 34-44" stroke="#6f7342" strokeWidth="2" fill="none" strokeLinecap="round" />
      {[
        [56, 126, -40],
        [64, 114, -30],
        [72, 104, -20],
        [60, 132, 30],
        [70, 120, 40],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="7" ry="3.4" fill="#8a8d55" transform={`rotate(${r} ${x} ${y})`} />
      ))}
      {/* frente de la caja */}
      <path d="M20 132h200v78a10 10 0 0 1-10 10H30a10 10 0 0 1-10-10v-78Z" fill={`url(#${id}-kraft)`} />
      <path d="M20 132h200v10H20z" fill="#000" opacity=".06" />
      {/* lazo */}
      <rect x="108" y="132" width="24" height="88" fill={tono.acento} opacity=".9" />
      <path d="M120 150c-16-14-34-10-30 0s20 6 30 0Zm0 0c16-14 34-10 30 0s-20 6-30 0Z" fill={tono.acento} />
      <circle cx="120" cy="150" r="5" fill={tono.etiqueta} />
      {/* tarjeta */}
      <g transform="rotate(-6 176 184)">
        <rect x="150" y="166" width="54" height="36" rx="3" fill="#fbf7f1" />
        <path d="M158 178h38M158 186h30M158 194h22" stroke={tono.etiqueta} strokeOpacity=".35" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** Paquete kraft para complementos (café, chocolate, jabón…). */
export function PaqueteSVG({ tono, nombre }: { tono: Tono; nombre: string }) {
  return (
    <svg viewBox="0 0 200 240" className="h-full w-full" aria-hidden="true">
      <ellipse cx="100" cy="222" rx="60" ry="7" fill="#3b2a20" opacity=".12" />
      <path d="M52 52h96l8 160a8 8 0 0 1-8 8H52a8 8 0 0 1-8-8l8-160Z" fill={tono.cera} />
      <path d="M52 52h96v16H52z" fill="#000" opacity=".08" />
      <path d="M58 40h84l6 12H52z" fill={tono.acento} opacity=".9" />
      <rect x="66" y="112" width="68" height="62" rx="4" fill="#fbf7f1" />
      <text x="100" y="134" textAnchor="middle" fontFamily="Georgia, serif" fontSize="10" fill={tono.etiqueta}>
        CosaVela
      </text>
      <line x1="80" y1="141" x2="120" y2="141" stroke={tono.acento} strokeOpacity=".5" />
      <text x="100" y="157" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="7" fill={tono.etiqueta}>
        {nombre.length > 20 ? `${nombre.slice(0, 19)}…` : nombre}
      </text>
      <path d="M70 92c8-10 20-14 30-12m10 4c6 2 12 6 16 10" stroke="#6f7342" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <ellipse cx="86" cy="84" rx="6" ry="2.8" fill="#8a8d55" transform="rotate(-25 86 84)" />
      <ellipse cx="118" cy="88" rx="6" ry="2.8" fill="#8a8d55" transform="rotate(30 118 88)" />
    </svg>
  );
}

/** Imagen de producto: foto si existe, si no la ilustración según categoría. */
export function ImagenProducto({ producto, prioridad = false, compacta = false }: { producto: Producto; prioridad?: boolean; compacta?: boolean }) {
  if (producto.imagen) {
    return (
      <Image
        src={producto.imagen}
        alt={producto.nombre}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover"
        priority={prioridad}
      />
    );
  }
  return (
    <div className={`absolute inset-0 flex items-center justify-center ${compacta ? "p-1" : "p-8"}`}>
      {producto.categoria === "cajas" ? (
        <CajaSVG tono={producto.tono} />
      ) : producto.categoria === "complementos" ? (
        <PaqueteSVG tono={producto.tono} nombre={producto.nombre} />
      ) : (
        <VelaSVG tono={producto.tono} nombre={producto.nombre} />
      )}
    </div>
  );
}
