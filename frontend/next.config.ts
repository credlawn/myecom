import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http", // or "https" if your backend uses SSL
        hostname: "localhost",
        port: "8000", // include if using non-standard port
        pathname: "/files/**",
      },
      {
        protocol: "https",
        hostname: "paisamilega.in",
        pathname: "/files/**",
      },
    ],
  },
};

export default nextConfig;
