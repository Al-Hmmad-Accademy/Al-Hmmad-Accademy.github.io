/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',

  reactStrictMode: true,

  compress: true,

  poweredByHeader: false,

  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;