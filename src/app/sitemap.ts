import type { MetadataRoute } from "next";

// 部署目标：GitHub Pages 项目站 https://xu107-hhh.github.io/portfolio/
const SITE = "https://xu107-hhh.github.io/portfolio";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/works",
    "/works/edu-ai-animation",
    "/works/exam-designer",
    "/works/multi-agent-intel",
    "/works/chengyan-assistant",
    "/works/supply-chain-data",
    "/gallery",
    "/contact",
  ];
  return routes.map((route) => ({
    url: `${SITE}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
