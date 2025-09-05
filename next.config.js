/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration for Vercel deployment
  experimental: {
    // Disable problematic features during build
    serverComponentsExternalPackages: ['bcryptjs']
  }
}

module.exports = nextConfig
