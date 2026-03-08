/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@bhms/ui", "@bhms/shared", "@bhms/validation"],
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
