import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/fashion-admin',
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/fashion-admin',
        permanent: false,
        basePath: false, // basePath 밖의 경로도 처리하려면 필요
      },
    ];
  },
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
