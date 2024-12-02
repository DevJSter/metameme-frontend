/** @type {import('next').NextConfig} */
const API_URL = process.env.API_URL;
const YUP_API_KEY = process.env.YUP_API;
const nextConfig = {
  env: {
    YUP_API: YUP_API_KEY,
  },
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
