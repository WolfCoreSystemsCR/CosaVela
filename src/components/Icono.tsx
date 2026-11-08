const trazos = {
  bolsa: "M6 7h12l-1 13H7L6 7Zm3 0a3 3 0 0 1 6 0",
  menu: "M4 7h16M4 12h16M4 17h10",
  cerrar: "M6 6l12 12M18 6 6 18",
  flecha: "M5 12h14m-5-5 5 5-5 5",
  check: "m5 12.5 4.5 4.5L19 7.5",
  mas: "M12 5v14M5 12h14",
  menos: "M5 12h14",
  basura: "M5 7h14M10 7V5h4v2m-7 0 1 12h8l1-12",
  camion: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7.5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  regalo: "M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-2-3-6-3-6-.5S10 7 12 7Zm0 0c2-3 6-3 6-.5S14 7 12 7Z",
  hoja: "M5 19c0-8 5-14 14-14 0 9-6 14-14 14Zm0 0 7-7",
  mano: "M7 12V6.5a1.5 1.5 0 0 1 3 0V11m0-5.5v-1a1.5 1.5 0 0 1 3 0V11m0-5a1.5 1.5 0 0 1 3 0v5m0-3a1.5 1.5 0 0 1 3 0v6a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-2.7L4.5 14a1.5 1.5 0 0 1 2.5-1.7L8 14",
  pluma: "M4 20 15 9m-3-3 6-3 3 3-3 6-6 3-3-3Zm-8 14h6",
  edificio: "M4 21V5l8-3v19M12 9h8v12M7 8h2m-2 4h2m-2 4h2m7-3h1m-1 4h1",
  chispa: "M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6",
  corazon: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z",
} as const;

export type NombreIcono = keyof typeof trazos | "whatsapp" | "instagram";

export function Icono({ nombre, className = "size-5" }: { nombre: NombreIcono; className?: string }) {
  if (nombre === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
      </svg>
    );
  }
  if (nombre === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={trazos[nombre]} />
    </svg>
  );
}
