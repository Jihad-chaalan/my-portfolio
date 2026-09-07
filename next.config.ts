import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root explicitly: this repo lives inside a OneDrive
  // folder that also contains an unrelated package-lock.json further up
  // the tree, which otherwise makes Turbopack guess the wrong root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;

