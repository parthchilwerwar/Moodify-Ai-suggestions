/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
      ignoreBuildErrors: true,
    },
    env: {
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
      SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    },
  }
  
  module.exports = nextConfig