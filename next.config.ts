import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    minimumCacheTTL:2678400,
  }
};

export default nextConfig;
