/**
 * [INPUT]: Next.js配置；独立演示GL适配与Tailwind全局入口。
 * [OUTPUT]: nextConfig，别名、编译规则和响应安全头。
 * [POS]: 仅globals.css走Tailwind编译，CSS Module保留Next原生类名导出。
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    resolveAlias: {
      "@/components/gl/gl-utils": "./src/lib/gl-utils-shim",
    },
    rules: {
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
