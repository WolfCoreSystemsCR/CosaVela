/**
 * Catálogo. PRECIOS, PESOS Y HORAS SON DE EJEMPLO: reemplácelos por los reales.
 * Para usar fotos reales, coloque la imagen en /public/img/productos/ y llene `imagen`
 * (ej. "/img/productos/cafe-tarrazu.jpg"). Sin foto se muestra una ilustración con los colores `tono`.
 */

export type Categoria = "velas" | "cajas" | "complementos";

export type Ocasion = "mama" | "cumpleanos" | "gracias" | "navidad" | "empresas" | "bienestar" | "amor";

export type Producto = {
  slug: string;
  nombre: string;
  categoria: Categoria;
  precio: number; // colones
  resumen: string;
  descripcion: string;
  notas?: string[]; // notas aromáticas
  incluye?: string[]; // para cajas
  detalles?: string[];
  ocasiones: Ocasion[];
  tono: { cera: string; acento: string; etiqueta: string };
  insignia?: string;
  imagen?: string;
  /** Si puede ir dentro de "Arme su caja". */
  armable?: boolean;
};

export const ocasiones: { id: Ocasion; nombre: string; frase: string }[] = [
  { id: "mama", nombre: "Para mamá", frase: "El 15 de agosto y todos los días." },
  { id: "cumpleanos", nombre: "Cumpleaños", frase: "Un regalo que se recuerda." },
  { id: "gracias", nombre: "Gracias", frase: "Para quien le echó una mano." },
  { id: "amor", nombre: "Amor y aniversario", frase: "Detalles con intención." },
  { id: "bienestar", nombre: "Bienestar", frase: "Una pausa en casa." },
  { id: "navidad", nombre: "Navidad", frase: "Aromas de diciembre." },
  { id: "empresas", nombre: "Empresas", frase: "Colaboradores y clientes." },
];

export const productos: Producto[] = [
  // ───────── Velas ─────────
  {
    slug: "cafe-de-altura",
    nombre: "Café de Altura",
    categoria: "velas",
    precio: 9500,
    resumen: "Café recién chorreado con un toque de canela.",
    descripcion:
      "Inspirada en la mañana tica: el olor del café chorreado, la tapa de dulce y la canela. Cálida, envolvente y perfecta para la sala o la oficina.",
    notas: ["Café tostado", "Tapa de dulce", "Canela"],
    detalles: ["Vaso de vidrio reutilizable", "Cera vegetal", "Mecha de algodón", "Aprox. 40 horas de encendido"],
    ocasiones: ["gracias", "cumpleanos", "empresas"],
    tono: { cera: "#E9D9C3", acento: "#6B4226", etiqueta: "#3B2A20" },
    insignia: "Más vendida",
    armable: true,
  },
  {
    slug: "vainilla-y-cacao",
    nombre: "Vainilla y Cacao",
    categoria: "velas",
    precio: 9500,
    resumen: "Dulce y profunda, como chocolate artesanal.",
    descripcion:
      "Cacao amargo con vainilla suave. Una vela acogedora para noches tranquilas, ideal para regalar a quien disfruta lo dulce sin exceso.",
    notas: ["Cacao", "Vainilla", "Haba tonka"],
    detalles: ["Vaso de vidrio reutilizable", "Cera vegetal", "Mecha de algodón", "Aprox. 40 horas de encendido"],
    ocasiones: ["amor", "mama", "cumpleanos"],
    tono: { cera: "#EFE2CF", acento: "#7A4A2B", etiqueta: "#4A2E1F" },
    armable: true,
  },
  {
    slug: "guayaba-rosa",
    nombre: "Guayaba Rosa",
    categoria: "velas",
    precio: 9500,
    resumen: "Frutal, fresca y alegre.",
    descripcion:
      "Guayaba madura con notas de flor y un fondo suave. Llena de color cualquier espacio y es de las favoritas para cumpleaños.",
    notas: ["Guayaba", "Pétalos", "Almizcle suave"],
    detalles: ["Vaso de vidrio reutilizable", "Cera vegetal", "Mecha de algodón", "Aprox. 40 horas de encendido"],
    ocasiones: ["cumpleanos", "mama", "amor"],
    tono: { cera: "#F4D6CC", acento: "#D2642E", etiqueta: "#8C3B1E" },
    insignia: "Nueva",
    armable: true,
  },
  {
    slug: "brisa-de-monteverde",
    nombre: "Brisa de Monteverde",
    categoria: "velas",
    precio: 9500,
    resumen: "Bosque nuboso: eucalipto, menta y hojas verdes.",
    descripcion:
      "Fresca y limpia, como caminar entre la neblina del bosque. Ideal para el baño, el estudio o para despejar la mente.",
    notas: ["Eucalipto", "Menta", "Hoja verde"],
    detalles: ["Vaso de vidrio reutilizable", "Cera vegetal", "Mecha de algodón", "Aprox. 40 horas de encendido"],
    ocasiones: ["bienestar", "gracias", "empresas"],
    tono: { cera: "#DDE3CF", acento: "#6F7342", etiqueta: "#3F4426" },
    armable: true,
  },
  {
    slug: "coco-y-limon-mandarina",
    nombre: "Coco y Limón Mandarina",
    categoria: "velas",
    precio: 9500,
    resumen: "Un fin de semana en la playa.",
    descripcion:
      "Coco cremoso con el toque cítrico del limón mandarina. Tropical y luminosa, para traer el Caribe o el Pacífico a casa.",
    notas: ["Coco", "Limón mandarina", "Brisa marina"],
    detalles: ["Vaso de vidrio reutilizable", "Cera vegetal", "Mecha de algodón", "Aprox. 40 horas de encendido"],
    ocasiones: ["bienestar", "cumpleanos"],
    tono: { cera: "#F6EBD6", acento: "#C98A2E", etiqueta: "#6B4A16" },
    armable: true,
  },
  {
    slug: "flor-de-itabo",
    nombre: "Flor de Itabo",
    categoria: "velas",
    precio: 11500,
    resumen: "Floral y elegante, en vaso ámbar grande.",
    descripcion:
      "Un floral blanco delicado con fondo de maderas suaves. Presentación grande en vaso ámbar, pensada como regalo principal.",
    notas: ["Flores blancas", "Jazmín", "Sándalo"],
    detalles: ["Vaso ámbar con tapa", "Cera vegetal", "Doble mecha de algodón", "Aprox. 60 horas de encendido"],
    ocasiones: ["mama", "amor", "gracias"],
    tono: { cera: "#F3E7D3", acento: "#B4842F", etiqueta: "#5A3A12" },
    armable: true,
  },
  {
    slug: "noche-buena",
    nombre: "Noche Buena",
    categoria: "velas",
    precio: 10500,
    resumen: "Ciprés, naranja y especias de diciembre.",
    descripcion:
      "El olor del portal y del ciprés recién cortado, con naranja y clavo de olor. Edición de temporada para la época navideña.",
    notas: ["Ciprés", "Naranja", "Clavo de olor"],
    detalles: ["Vaso de vidrio reutilizable", "Cera vegetal", "Mecha de algodón", "Aprox. 40 horas de encendido"],
    ocasiones: ["navidad", "empresas"],
    tono: { cera: "#E7DCC8", acento: "#8C2F1E", etiqueta: "#2F3A22" },
    insignia: "Temporada",
    armable: true,
  },

  // ───────── Complementos (para armar cajas) ─────────
  {
    slug: "cafe-tostado-250",
    nombre: "Café tostado 250 g",
    categoria: "complementos",
    precio: 4500,
    resumen: "Café costarricense en grano o molido.",
    descripcion: "Café de productores locales, tostado medio. Indique en la dedicatoria si lo prefiere en grano o molido.",
    ocasiones: ["gracias", "empresas", "cumpleanos"],
    tono: { cera: "#C9A27A", acento: "#3B2A20", etiqueta: "#3B2A20" },
    armable: true,
  },
  {
    slug: "chocolate-artesanal",
    nombre: "Chocolate artesanal",
    categoria: "complementos",
    precio: 3500,
    resumen: "Barra de cacao costarricense.",
    descripcion: "Barra de chocolate elaborada con cacao nacional por productores locales.",
    ocasiones: ["amor", "cumpleanos", "mama"],
    tono: { cera: "#8B5A3C", acento: "#4A2E1F", etiqueta: "#4A2E1F" },
    armable: true,
  },
  {
    slug: "jabon-artesanal",
    nombre: "Jabón artesanal",
    categoria: "complementos",
    precio: 3000,
    resumen: "Jabón natural a juego con su vela.",
    descripcion: "Jabón artesanal de glicerina con aceites naturales y aroma suave.",
    ocasiones: ["bienestar", "mama"],
    tono: { cera: "#E6DCC7", acento: "#6F7342", etiqueta: "#6F7342" },
    armable: true,
  },
  {
    slug: "sales-de-bano",
    nombre: "Sales de baño",
    categoria: "complementos",
    precio: 4000,
    resumen: "Sales con flores secas y aceites esenciales.",
    descripcion: "Frasco de sales de baño con flores secas, para un momento de spa en casa.",
    ocasiones: ["bienestar", "mama", "amor"],
    tono: { cera: "#F1E3E0", acento: "#D2642E", etiqueta: "#8C3B1E" },
    armable: true,
  },
  {
    slug: "cerillos-decorativos",
    nombre: "Cerillos decorativos",
    categoria: "complementos",
    precio: 2000,
    resumen: "Cerillos largos en frasco de vidrio.",
    descripcion: "Frasco de vidrio con cerillos largos y lija en la tapa. El complemento ideal de cualquier vela.",
    ocasiones: ["gracias", "cumpleanos", "empresas"],
    tono: { cera: "#E9D9C3", acento: "#B4842F", etiqueta: "#3B2A20" },
    armable: true,
  },

  // ───────── Cajas de regalo listas ─────────
  {
    slug: "caja-pura-vida",
    nombre: "Caja Pura Vida",
    categoria: "cajas",
    precio: 22500,
    resumen: "Lo mejor de Costa Rica en una caja.",
    descripcion:
      "Nuestra caja insignia: vela Café de Altura, café tostado y chocolate artesanal, con tarjeta escrita a mano. Ideal para regalar a alguien que vive fuera o para presumir lo nuestro.",
    incluye: ["Vela Café de Altura", "Café tostado 250 g", "Chocolate artesanal", "Tarjeta con dedicatoria", "Caja kraft con relleno natural"],
    ocasiones: ["gracias", "cumpleanos", "empresas"],
    tono: { cera: "#E9D9C3", acento: "#6B4226", etiqueta: "#3B2A20" },
    insignia: "Más vendida",
  },
  {
    slug: "caja-para-mama",
    nombre: "Caja Para Mamá",
    categoria: "cajas",
    precio: 26500,
    resumen: "Flor de Itabo, sales de baño y jabón artesanal.",
    descripcion:
      "Un rato de calma para ella: vela grande Flor de Itabo, sales de baño y jabón artesanal. Con tarjeta para su mensaje.",
    incluye: ["Vela Flor de Itabo", "Sales de baño", "Jabón artesanal", "Tarjeta con dedicatoria", "Caja con lazo"],
    ocasiones: ["mama", "amor"],
    tono: { cera: "#F3E7D3", acento: "#B4842F", etiqueta: "#5A3A12" },
  },
  {
    slug: "caja-spa-en-casa",
    nombre: "Caja Spa en Casa",
    categoria: "cajas",
    precio: 19500,
    resumen: "Brisa de Monteverde y un baño relajante.",
    descripcion: "Vela Brisa de Monteverde, sales de baño y cerillos decorativos. Para regalar descanso.",
    incluye: ["Vela Brisa de Monteverde", "Sales de baño", "Cerillos decorativos", "Tarjeta con dedicatoria"],
    ocasiones: ["bienestar", "gracias", "cumpleanos"],
    tono: { cera: "#DDE3CF", acento: "#6F7342", etiqueta: "#3F4426" },
  },
  {
    slug: "caja-dulce-detalle",
    nombre: "Caja Dulce Detalle",
    categoria: "cajas",
    precio: 16500,
    resumen: "Vainilla y Cacao con chocolate artesanal.",
    descripcion: "Una caja pequeña y especial: vela Vainilla y Cacao con una barra de chocolate artesanal.",
    incluye: ["Vela Vainilla y Cacao", "Chocolate artesanal", "Tarjeta con dedicatoria"],
    ocasiones: ["amor", "cumpleanos", "gracias"],
    tono: { cera: "#EFE2CF", acento: "#7A4A2B", etiqueta: "#4A2E1F" },
  },
  {
    slug: "caja-navidena",
    nombre: "Caja Navideña",
    categoria: "cajas",
    precio: 24500,
    resumen: "Noche Buena, café y chocolate para diciembre.",
    descripcion:
      "La caja de temporada: vela Noche Buena, café tostado, chocolate artesanal y cerillos decorativos. Disponible en volumen para empresas.",
    incluye: ["Vela Noche Buena", "Café tostado 250 g", "Chocolate artesanal", "Cerillos decorativos", "Tarjeta con dedicatoria"],
    ocasiones: ["navidad", "empresas"],
    tono: { cera: "#E7DCC8", acento: "#8C2F1E", etiqueta: "#2F3A22" },
    insignia: "Temporada",
  },
];

export const categorias: { id: Categoria; nombre: string }[] = [
  { id: "cajas", nombre: "Cajas de regalo" },
  { id: "velas", nombre: "Velas" },
  { id: "complementos", nombre: "Complementos" },
];

export const buscarProducto = (slug: string) => productos.find((p) => p.slug === slug);

/** Tamaños de "Arme su caja". El precio base cubre caja, relleno, lazo y tarjeta. CONFIRMAR precios. */
export const tamanosCaja = [
  { id: "pequena", nombre: "Pequeña", espacios: 2, base: 3500, descripcion: "1 vela + 1 complemento" },
  { id: "mediana", nombre: "Mediana", espacios: 3, base: 4500, descripcion: "Hasta 3 artículos" },
  { id: "grande", nombre: "Grande", espacios: 5, base: 6000, descripcion: "Hasta 5 artículos" },
] as const;

export type TamanoCaja = (typeof tamanosCaja)[number]["id"];

const formato = new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 });
export const colones = (n: number) => formato.format(n);
