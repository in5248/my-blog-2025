/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  distDir: ".next",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    serverActions: true,
    typedRoutes: true
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : "http://localhost:3000"
  }
};

module.exports = nextConfig;
