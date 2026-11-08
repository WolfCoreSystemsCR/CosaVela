import type { MetadataRoute } from "next";
import { sitioUrl } from "@/lib/negocio";
import { productos } from "@/lib/productos";

export default function sitemap(): MetadataRoute.Sitemap {
  const paginas = ["", "/tienda", "/arma-tu-caja", "/empresas", "/nosotros"].map((p) => ({
    url: `${sitioUrl}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  return [...paginas, ...productos.map((p) => ({ url: `${sitioUrl}/tienda/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 }))];
}
