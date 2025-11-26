import { Ref, useRef } from 'react';

export const useFullscreen = (callback: (isFull: boolean) => void) => {
  const element: Ref<HTMLDivElement | null> = useRef(null);

  const runCb = (isFull: boolean): void => {
    if (callback && typeof callback === 'function') {
      callback(isFull);
    }
  };

  const triggerFull = (): void => {
    if (element.current) {
      if (element.current.requestFullscreen) {
        element.current.requestFullscreen();
      }
      runCb(true);
    }
  };

  const exitFull = (): void => {
    document.exitFullscreen();
    runCb(false);
  };

  return { element, triggerFull, exitFull };
};
