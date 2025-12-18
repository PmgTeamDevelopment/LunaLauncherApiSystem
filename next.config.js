/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Vì bạn chỉ dùng API, không cần image optimization
  images: {
    unoptimized: true
  },

  // Output tối ưu cho Vercel
  output: "standalone"
};

module.exports = nextConfig;
