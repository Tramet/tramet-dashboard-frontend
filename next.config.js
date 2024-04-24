/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logo.uplead.com",
      },
    ],
  },
};

module.exports = nextConfig;
