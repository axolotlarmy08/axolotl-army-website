import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project folder so Next doesn't pick up
  // an unrelated lockfile from a parent directory.
  turbopack: {
    root: path.resolve(__dirname),
  },
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
