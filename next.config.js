/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true, // Temporarily add this for deployment troubleshooting
    },
    transpilePackages: ['@neondatabase/serverless'],
  };
  
  module.exports = nextConfig;
