'use client';
import Lottie from 'lottie-react';
import error from '@/../public/lotties/404 Error - Doodle animation.json';

/**
 * 별도 청크로 분리되는 404 Lottie 컴포넌트.
 * `not-found.tsx` 에서 dynamic import 로만 가져온다 → 404 진입시에만 lottie-web 로드됨.
 */
export default function NotFoundLottie() {
  return (
    <Lottie
      animationData={error}
      loop
      autoplay
      rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
      style={{ width: 400, height: 400 }}
    />
  );
}
