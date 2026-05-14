'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Lottie from 'lottie-react';
import error from '@/../public/lotties/404 Error - Doodle animation.json';

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
      <Lottie
        animationData={error}
        loop
        autoplay
        rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
        style={{ width: 400, height: 400 }}
      />
    </div>
  );
}
