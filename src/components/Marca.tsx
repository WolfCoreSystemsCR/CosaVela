import { useId } from "react";

/** Logotipo en texto: "CosaVela" en serif dorado con la llama sobre la L, como en el logo oficial. */
export function Llama({ className = "" }: { className?: string }) {
  const id = `ll${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg viewBox="0 0 20 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#d2642e" />
          <stop offset=".55" stopColor="#e8873a" />
          <stop offset="1" stopColor="#f2b35a" />
        </linearGradient>
      </defs>
      <path
        className="llama"
        fill={`url(#${id})`}
        d="M10 39c-5 0-7.5-3.6-7-8 .5-4 3.5-6 4-10 .3-2.6-.6-5-1.6-7 4 1.5 6 5 5.8 8.5 1.4-1.6 1.6-4 1-6.4 3.6 3 5.8 7.4 5.3 12.4C17 34.8 14.6 39 10 39Z"
      />
    </svg>
  );
}

export function Marca({ className = "text-3xl" }: { className?: string }) {
  return (
    <span className={`relative inline-flex items-baseline font-serif leading-none font-medium tracking-tight ${className}`}>
      <span className="oro">CosaVe</span>
      <span className="relative oro">
        L
        <Llama className="absolute -top-[0.55em] left-[0.04em] h-[0.6em] w-[0.3em]" />
      </span>
      <span className="oro">a</span>
    </span>
  );
}
