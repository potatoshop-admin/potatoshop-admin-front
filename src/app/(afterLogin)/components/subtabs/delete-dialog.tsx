import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface DeleteDialogProps {
  title: string;
  item: string;
  onClick: () => void;
}

const DeleteDialog = ({ title, item, onClick }: DeleteDialogProps) => {
  return (
    <Dialog>
      <div className="w-full h-fit pb-6 flex justify-between items-center">
        <h1 className="font-24-extrabold sm:text-[28px]">{title}</h1>
        <DialogTrigger asChild>
          <Button variant="destructive" size="roundedDefault">
            {item} 삭제
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogTitle>{item} 삭제</DialogTitle>
        <p>해당 {item}을(를) 삭제하시겠습니까?</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" size="default" variant="outline">
              취소
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" size="default" variant="default" onClick={onClick}>
              확인
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
