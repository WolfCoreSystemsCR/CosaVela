/** Fecha en formato YYYY-MM-DD según la hora local del navegador (para el atributo `min` de inputs de fecha). */
export function fechaLocalHoy(ahora = new Date()): string {
  const dos = (n: number) => String(n).padStart(2, "0");
  return `${ahora.getFullYear()}-${dos(ahora.getMonth() + 1)}-${dos(ahora.getDate())}`;
}
