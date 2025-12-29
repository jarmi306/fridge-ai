import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // We removed the eslint block to fix the "Unrecognized key" error
};

export default nextConfig;