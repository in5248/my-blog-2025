/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/sign-in',
        destination: '/auth/sign-in',
        permanent: true,
      },
      {
        source: '/sign-up',
        destination: '/auth/sign-up',
        permanent: true,
      },
    ]
  }
};

module.exports = nextConfig;
