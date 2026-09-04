import type { NextConfig } from "next";

// GitHub Pages 项目站点部署在 https://<user>.github.io/<repo>/ 子路径下，
// 由 CI 通过 NEXT_PUBLIC_BASE_PATH 注入仓库名；本地构建/开发留空。
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath,
};

export default nextConfig;
