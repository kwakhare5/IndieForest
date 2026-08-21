import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  reactStrictMode: true,
  devIndicators: false,
};

export default nextConfig;
