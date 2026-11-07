import type { NextConfig } from "next";
import path from "path";

const phaserBrowser = path.join(process.cwd(), "node_modules/phaser/dist/phaser.js");

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      phaser: phaserBrowser,
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      phaser: "./node_modules/phaser/dist/phaser.js",
    },
  },
};

export default nextConfig;
