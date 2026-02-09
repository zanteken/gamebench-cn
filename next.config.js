/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.steamstatic.com",
      },
      {
        protocol: "https",
        hostname: "**.akamai.steamstatic.com",
      },
    ],
    formats: ['image/webp'],
    unoptimized: false,
  },
};

module.exports = nextConfig;
