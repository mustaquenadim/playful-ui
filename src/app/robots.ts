import type { MetadataRoute } from "next";

import { BASE_URL } from "@/lib/registry";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `https://${BASE_URL}/sitemap.xml`,
  };
}
