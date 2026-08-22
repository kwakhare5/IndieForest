import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three"],
  reactStrictMode: true,
  devIndicators: false,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "three",
      "@react-three/fiber",
      "@react-three/drei",
    ],
  },
};

export default nextConfig;
