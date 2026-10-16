import type { NextConfig } from "next";

/** GitHub Pages 静态演示：STATIC_EXPORT=1 时导出静态站点 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // 静态导出（GitHub Pages）模式：Cache Components / PPR 与 export 互斥，需关闭
  cacheComponents: !isStaticExport,
  partialPrefetching: !isStaticExport,
  ...(isStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
        basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
        images: { unoptimized: true },
      }
    : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
