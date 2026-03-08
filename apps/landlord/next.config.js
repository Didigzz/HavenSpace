/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@bhms/ui", "@bhms/shared", "@bhms/validation"],
  output: 'standalone',
  experimental: {
    optimizePackageImports: ["@bhms/ui", "lucide-react", "recharts"],
  },
};

module.exports = nextConfig;
