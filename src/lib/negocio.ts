/**
 * Datos del negocio. Todo lo que dice "CONFIRMAR" debe revisarlo la dueña antes de publicar.
 */
export const sitioUrl = (process.env.NEXT_PUBLIC_SITIO_URL?.trim() || "https://cosa-vela.vercel.app").replace(/\/$/, "");

export const negocio = {
  nombre: "CosaVela",
  lema: "Más que un regalo, una experiencia",
  descripcion:
    "Velas artesanales y cajas de regalo hechas a mano en Costa Rica. Aromas ticos, dedicatoria personalizada y envío a todo el país.",
  // Solo dígitos con código de país. Se configura con NEXT_PUBLIC_WHATSAPP.
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP ?? "").replace(/\D/g, ""),
  instagram: "https://instagram.com/cosavela", // CONFIRMAR
  correo: "hola@cosavela.com", // CONFIRMAR
  ubicacion: "Costa Rica",
};

/** Enlace a WhatsApp con mensaje prellenado. Sin número configurado, WhatsApp deja elegir el contacto. */
export function enlaceWhatsApp(mensaje: string): string {
  const texto = encodeURIComponent(mensaje);
  return negocio.whatsapp ? `https://wa.me/${negocio.whatsapp}?text=${texto}` : `https://wa.me/?text=${texto}`;
}

// CONFIRMAR: tarifas y tiempos reales de entrega.
export const metodosEntrega = [
  { id: "gam", nombre: "Entrega a domicilio en la GAM", detalle: "Se coordina día y hora por WhatsApp." },
  { id: "correos", nombre: "Envío por Correos de Costa Rica", detalle: "A cualquier provincia. Costo según destino." },
  { id: "retiro", nombre: "Retiro en punto de entrega", detalle: "Se coordina el lugar por WhatsApp." },
] as const;

export const metodosPago = [
  { id: "sinpe", nombre: "SINPE Móvil" },
  { id: "transferencia", nombre: "Transferencia bancaria" },
] as const;

export const provincias = ["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"] as const;

export const preguntas = [
  {
    pregunta: "¿Hacen envíos a todo Costa Rica?",
    respuesta:
      "Sí. En la GAM coordinamos entrega a domicilio y al resto del país enviamos por Correos de Costa Rica. El costo depende del destino.",
  },
  {
    pregunta: "¿Cómo pago?",
    respuesta:
      "Con SINPE Móvil o transferencia bancaria. Al finalizar su pedido le enviamos los datos por WhatsApp y confirmamos el total con envío.",
  },
  {
    pregunta: "¿Puedo incluir una dedicatoria?",
    respuesta:
      "Sí. Cada regalo lleva una tarjeta escrita con su mensaje. La escribe al hacer el pedido y nosotros nos encargamos del resto.",
  },
  {
    pregunta: "¿Hacen regalos para empresas?",
    respuesta:
      "Sí. Armamos cajas con el logo de su empresa, tarjeta personalizada y entrega a cada colaborador o cliente. Pida su cotización en la sección Empresas.",
  },
  {
    pregunta: "¿Cuánto dura una vela?",
    respuesta:
      "Depende del tamaño. En la ficha de cada vela indicamos las horas aproximadas de encendido. Recomendamos encenderla al menos 2 horas la primera vez para que se derrita de forma pareja.",
  },
];
