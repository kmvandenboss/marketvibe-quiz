/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false, // Temporarily disable SWC minification
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: (config, { isServer }) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        fs: false,
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    };
    return config;
  },
};

module.exports = nextConfig;
