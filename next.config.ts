import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  minimumCacheTTL:2678400,
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
