import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/fashion-admin',
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coddingapplespringseo.s3.ap-northeast-2.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
