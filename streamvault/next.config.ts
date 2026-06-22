import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow streaming URLs from CloudFront and other external sources
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
    ],
  },
  // Allow the frontend to call the local backend in server components
  // In production, override NEXT_PUBLIC_API_BASE_URL via environment variables
  experimental: {},
};

export default nextConfig;
