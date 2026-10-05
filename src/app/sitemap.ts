import type { MetadataRoute } from "next";

import { generateStaticParams } from "@/app/(home)/ui/[name]/page";
import { BASE_URL } from "@/lib/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/tokens",
    ...generateStaticParams().map(({ name }) => `/ui/${name}`),
  ];
  return paths.map((path) => ({ url: `https://${BASE_URL}${path}` }));
}
