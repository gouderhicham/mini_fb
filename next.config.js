/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: false,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};
module.exports = nextConfig;
