'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface RowTwoButtonsProps {
  cancelTitle: string;
  confirmTitle: string;
  onClick: () => void;
}

const RowTwoButtons: React.FC<RowTwoButtonsProps> = ({ cancelTitle, confirmTitle, onClick }) => {
  const router = useRouter();
  const cancelBtnClick = () => {
    router.back();
  };
  return (
    <div className="w-full space-x-2 flex h-fit max-w-160 m-auto">
      <Button variant="outline" size="fullWidth" className="flex-1/2" onClick={cancelBtnClick}>
        {cancelTitle}
      </Button>
      <Button variant="default" size="fullWidth" className="flex-1/2" onClick={onClick}>
        {confirmTitle}
      </Button>
    </div>
  );
};

export default React.memo(RowTwoButtons);
