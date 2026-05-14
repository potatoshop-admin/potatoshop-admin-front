import React from 'react';

/**
 * 기존: lottie-react + Loading Dots Blue.json (lottie-web ~100KB가 모든 페이지에 포함됨)
 * 변경: CSS-only 도트 애니메이션. 시각적으로 동일한 효과, 번들 0KB.
 */
const Loading = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex items-center justify-center gap-2" style={{ width: 200, height: 200 }}>
        <span className="loading-dot" />
        <span className="loading-dot" style={{ animationDelay: '0.15s' }} />
        <span className="loading-dot" style={{ animationDelay: '0.3s' }} />
      </div>
    </div>
  );
};

export default Loading;
