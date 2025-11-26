'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RowDisplay } from '@/app/(afterLogin)/components/subtabs/row-form';
import { useDeleteReview, useGetReview } from '@/api/review';

const ReviewDetail = ({ id }: { id: string }) => {
  const router = useRouter();

  const { data, isSuccess } = useGetReview({ id: Number(id) });
  const { mutate } = useDeleteReview({
    onSuccess: (e) => {
      toast.success(e.statusMessage);
      router.back();
    },
  });

  const deleteReview = () => {
    mutate({ id: Number(id) });
  };

  React.useEffect(() => {
    if (data?.data) {
      toast.success(`${data.statusMessage}`);
    }
  }, [data?.data]);

  if (!isSuccess) return <p>Loading.....</p>;
  return (
    <div className="h-full w-full px-4 py-4 overflow-y-scroll">
      <Dialog>
        <div className="w-full h-fit pb-6 flex justify-between items-center">
          <h1 className="font-24-extrabold sm:text-[28px]">{data?.data.name}</h1>
          <DialogTrigger asChild>
            <Button variant="destructive" size="roundedDefault">
              리뷰 삭제
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogTitle>리뷰 삭제</DialogTitle>
          <p>해당 리뷰를 삭제하시겠습니까?</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" size="default" variant="outline">
                취소
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" size="default" variant="default" onClick={deleteReview}>
                확인
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="w-full h-fit rounded-md border-2 border-gray-200 px-4 py-4 space-y-6">
        <RowDisplay value={data?.data.title} label="리뷰 아이템" />
        <RowDisplay value={data?.data.userName} label="리뷰 작성자" />
        <RowDisplay value={data?.data.rate} label="평점" inputAssist="(개)" />
        <RowDisplay value={data?.data.content} label="리뷰" />
        <div className="w-full h-fit flex space-x-2">
          <Button
            variant="outline"
            size="fullWidth"
            className="flex-1/2"
            onClick={() => {
              router.back();
            }}
          >
            뒤로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
