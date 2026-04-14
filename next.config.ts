import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No special config needed — Clerk and MongoDB work out of the box
};
module.exports = {
  allowedDevOrigins: ['192.168.29.238'],
}

export default nextConfig;
