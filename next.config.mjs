/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
      ignoreBuildErrors: true,
    },
    env: {
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    },
    
  }
  
  module.exports = nextConfig