import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project folder so Next doesn't pick up
  // an unrelated lockfile from a parent directory.
  turbopack: {
    root: path.resolve(__dirname),
  },
  // @react-pdf/renderer ships its own font/canvas code that doesn't tree-shake
  // well — keeping it external for the server bundle avoids cold-start bloat.
  serverExternalPackages: ["@react-pdf/renderer"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.cdn.printful.com",
      },
      {
        // Printful's Mockup Generator returns URLs on this S3 bucket.
        protocol: "https",
        hostname: "printful-upload.s3-accelerate.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "printful-upload.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
