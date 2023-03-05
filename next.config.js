/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: false,
  images: {
    domains: ["lh3.googleusercontent.com" , "firebasestorage.googleapis.com"],
  },
  devIndicators: {
    buildActivity: false,
  },
};
module.exports = nextConfig;