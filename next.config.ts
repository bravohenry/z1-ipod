import type { NextConfig } from "next";

const ALLOWED_FRAME_ANCESTORS = [
  "'self'",
  "https://www.z1han.com",
  "https://z1han.com",
  "https://*.vercel.app",
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
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
          // Allow z1 (and Vercel previews) to embed this player via iframe.
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${ALLOWED_FRAME_ANCESTORS.join(" ")}`,
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
