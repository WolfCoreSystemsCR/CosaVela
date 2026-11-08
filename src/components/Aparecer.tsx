"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Activa la animación de aparición en los elementos con la clase `aparecer`. */
export function Aparecer() {
  const ruta = usePathname();
  useEffect(() => {
    const elementos = document.querySelectorAll<HTMLElement>(".aparecer:not(.visible)");
    if (!("IntersectionObserver" in window)) {
      elementos.forEach((el) => el.classList.add("visible"));
      return;
    }
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    elementos.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ruta]);
  return null;
}
