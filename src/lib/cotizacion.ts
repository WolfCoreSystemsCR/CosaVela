export const rangosCantidad = ["10 a 25", "26 a 50", "51 a 100", "Más de 100"] as const;
export const rangosPresupuesto = ["Menos de ₡15 000", "₡15 000 a ₡25 000", "₡25 000 a ₡40 000", "Más de ₡40 000"] as const;
export const ocasionesEmpresa = ["Fin de año", "Clientes", "Bienvenida de colaboradores", "Evento o activación", "Aniversario de la empresa", "Otra"] as const;

export type Cotizacion = {
  empresa: string;
  nombre: string;
  correo: string;
  telefono: string;
  cantidad: string;
  presupuesto: string;
  ocasion: string;
  fecha: string;
  mensaje: string;
};

export function textoCotizacion(c: Cotizacion): string {
  return [
    "¡Hola CosaVela! Quisiera cotizar regalos para mi empresa.",
    "",
    `Empresa: ${c.empresa}`,
    `Contacto: ${c.nombre}`,
    `Correo: ${c.correo}`,
    c.telefono && `Teléfono: ${c.telefono}`,
    `Cantidad: ${c.cantidad}`,
    `Presupuesto por regalo: ${c.presupuesto}`,
    `Ocasión: ${c.ocasion}`,
    c.fecha && `Fecha de entrega: ${c.fecha}`,
    c.mensaje && `\n${c.mensaje}`,
  ]
    .filter(Boolean)
    .join("\n");
}
