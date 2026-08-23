/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Stepaccademy',
  assetPrefix: '/Stepaccademy/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;