import type { MetadataRoute } from "next";

const SITE = "https://xu107-hhh.github.io/portfolio";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
