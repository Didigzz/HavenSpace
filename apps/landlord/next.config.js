/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@havenspace/ui", "@havenspace/shared", "@havenspace/validation"],
  output: 'standalone',
  experimental: {
    optimizePackageImports: ["@havenspace/ui", "lucide-react", "recharts"],
  },
};

module.exports = nextConfig;
