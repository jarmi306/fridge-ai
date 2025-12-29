import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // This ignores type errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // This ignores linting errors during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;