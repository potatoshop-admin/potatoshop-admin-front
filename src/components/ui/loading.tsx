import React from 'react';
import Lottie from 'lottie-react';
import loading from '@/../public/lotties/Loading Dots Blue.json';

const Loading = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <Lottie
        animationData={loading}
        loop
        autoplay
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice',
        }}
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
};

export default Loading;
