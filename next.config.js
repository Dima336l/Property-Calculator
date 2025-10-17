/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.rightmove.co.uk',
      },
      {
        protocol: 'https',
        hostname: '**.zoopla.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'media.rightmove.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'lid.zoocdn.com',
      },
    ],
  },
}

module.exports = nextConfig
