import type { MetadataRoute } from "next";
import { sitioUrl } from "@/lib/negocio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/carrito"] },
    sitemap: `${sitioUrl}/sitemap.xml`,
  };
}
