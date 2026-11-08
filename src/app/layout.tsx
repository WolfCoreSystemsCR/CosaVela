import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import { Aparecer } from "@/components/Aparecer";
import { ProveedorCarrito } from "@/components/Carrito";
import { Encabezado } from "@/components/Encabezado";
import { PiePagina } from "@/components/PiePagina";
import { negocio, preguntas, sitioUrl } from "@/lib/negocio";
import "./globals.css";

const titulo = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-titulo",
  display: "swap",
});
const cuerpo = Figtree({ subsets: ["latin"], variable: "--font-cuerpo", display: "swap" });

const tituloSitio = "CosaVela | Velas artesanales y cajas de regalo en Costa Rica";

export const metadata: Metadata = {
  metadataBase: new URL(sitioUrl),
  title: { default: tituloSitio, template: "%s | CosaVela" },
  description: negocio.descripcion,
  applicationName: negocio.nombre,
  keywords: [
    "velas artesanales Costa Rica",
    "cajas de regalo Costa Rica",
    "regalos personalizados",
    "regalos corporativos Costa Rica",
    "regalo día de la madre",
    "velas aromáticas",
  ],
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "es_CR", url: "/", siteName: negocio.nombre, title: tituloSitio, description: negocio.lema },
  twitter: { card: "summary_large_image", title: tituloSitio, description: negocio.lema },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = { themeColor: "#f3ebe1" };

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Store",
      "@id": `${sitioUrl}/#tienda`,
      name: negocio.nombre,
      slogan: negocio.lema,
      description: negocio.descripcion,
      url: sitioUrl,
      image: `${sitioUrl}/img/logo-cosavela.jpg`,
      currenciesAccepted: "CRC",
      areaServed: { "@type": "Country", name: "Costa Rica" },
      address: { "@type": "PostalAddress", addressCountry: "CR" },
      sameAs: [negocio.instagram],
      ...(negocio.whatsapp ? { telephone: `+${negocio.whatsapp}` } : {}),
    },
    {
      "@type": "FAQPage",
      mainEntity: preguntas.map((p) => ({ "@type": "Question", name: p.pregunta, acceptedAnswer: { "@type": "Answer", text: p.respuesta } })),
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CR" className={`${titulo.variable} ${cuerpo.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </head>
      <body>
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-cacao focus:px-4 focus:py-2 focus:text-papel">
          Saltar al contenido
        </a>
        <ProveedorCarrito>
          <Encabezado />
          <main id="contenido">{children}</main>
          <PiePagina />
        </ProveedorCarrito>
        <Aparecer />
      </body>
    </html>
  );
}
