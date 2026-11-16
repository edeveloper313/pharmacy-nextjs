/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  
  // Client delivery ke liye TypeScript errors bypass karein
  typescript: {
    ignoreBuildErrors: true, 
  },
  // ESLint warnings/errors bypass karein
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;