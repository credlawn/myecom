import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http", // for local backend
        hostname: "localhost",
        port: "8000",
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "credlawn.com",
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scaleflex.cloudimg.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
