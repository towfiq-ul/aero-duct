import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile shared monorepo packages
  transpilePackages: ["@aeroduct/ui", "@aeroduct/types"],

  // Enable React strict mode
  reactStrictMode: true,

  // Image optimization: allow S3/CloudFront domains
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
    ],
  },

  // Experimental features
  experimental: {
    // Enable PPR for faster initial load
    ppr: false,
  },

  // Headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
