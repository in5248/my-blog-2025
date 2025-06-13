/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: '.next',
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    appDir: true,
    serverActions: true,
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.VERCEL_URL || 'http://localhost:3000'
  },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  swcMinify: true
};

module.exports = nextConfig;
