/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ["images.unsplash.com"], // 이미지를 불러올 수 있는 도메인 목록
    unoptimized: true
  },
  typescript: {
    // !! WARN !!
    // 배포 시 타입 체크를 비활성화합니다.
    // 프로덕션에서는 이 옵션을 제거하는 것이 좋습니다.
    ignoreBuildErrors: true,
  },
  eslint: {
    // 배포 시 ESLint 체크를 비활성화합니다.
    ignoreDuringBuilds: true,
  },
  // 환경변수 설정
  env: {
    BASE_URL: process.env.VERCEL_URL || 'http://localhost:3000'
  },
  basePath: '',
  trailingSlash: true
};

module.exports = nextConfig;
