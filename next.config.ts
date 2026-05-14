import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

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
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

export default withBundleAnalyzer(nextConfig);
