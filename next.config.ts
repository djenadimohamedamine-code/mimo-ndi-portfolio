import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BUILD_ID: Date.now().toString(),
  },
};

export default nextConfig;
