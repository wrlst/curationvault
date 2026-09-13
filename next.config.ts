import type { NextConfig } from "next";
import { remoteImagePatterns } from "./lib/image-config";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: remoteImagePatterns,
  },
};

export default nextConfig;
