/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@havenspace/ui", "@havenspace/shared", "@havenspace/validation"],
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

module.exports = nextConfig;
