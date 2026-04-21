import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow hot-reloading (HMR) websocket connections from your local mobile phone via network
  allowedDevOrigins: ['192.168.1.20'],
  turbopack: {
    root: '.',
  },
};

export default nextConfig;
