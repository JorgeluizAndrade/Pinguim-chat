/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true,
    },
    images: {
        domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com' ,'cdn.pixabay.com'],
      },
  }
  
  module.exports = nextConfig