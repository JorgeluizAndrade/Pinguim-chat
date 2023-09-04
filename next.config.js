/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true,
    },
    images: {
        domains: ['lh3.googleusercontent.com', 'cdn.pixabay.com'],
      },
  }
  
  module.exports = nextConfig