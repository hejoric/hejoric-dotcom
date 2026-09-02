import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Nothing to index behind the auth gate or in the JSON routes.
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: "https://hejoric.com/sitemap.xml",
  };
}
