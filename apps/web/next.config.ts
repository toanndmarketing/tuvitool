import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  experimental: {
    allowedDevOrigins: ['tuvi.demowebest.site'],
  },
  // Bật Polling cho Hot Reload trên Docker Windows
  webpack: (config, context) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;
