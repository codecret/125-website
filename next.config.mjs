/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PLUNK_API_KEY: process.env.PLUNK_API_KEY,
  },
};

export default nextConfig;
