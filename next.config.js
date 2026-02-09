/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "shared.akamai.steamstatic.com",
      "cdn.akamai.steamstatic.com",
      "cdn.cloudflare.steamstatic.com",
      "steamcommunity-a.akamaihd.net",
      "steamstatic.com",
      "akamai.steamstatic.com",
    ],
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
