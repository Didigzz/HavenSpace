/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@havenspace/ui", "@havenspace/shared", "@havenspace/validation", "@havenspace/database"],
  output: 'standalone',
  experimental: {
    optimizePackageImports: ["@havenspace/ui", "lucide-react"],
  },
};

module.exports = nextConfig;
