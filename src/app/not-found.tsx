'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

/**
 * Lottie 와 애니메이션 JSON 을 dynamic import 로 분리.
 * 404 페이지에 진입했을 때만 lottie-web 청크가 로드되도록 변경.
 * (이전에는 lottie-web ~100KB 가 모든 페이지 First Load JS 에 포함되어 있었음)
 */
const NotFoundLottie = dynamic(() => import('./not-found-lottie'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center" style={{ width: 400, height: 400 }}>
      <p className="text-gray-500">404</p>
    </div>
  ),
});

export default function NotFound() {
  const router = useRouter();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/'); // basePath 있으면 자동으로 /fashion-admin으로 감
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-dvh w-dvw flex items-center justify-center">
      <NotFoundLottie />
    </div>
  );
}
