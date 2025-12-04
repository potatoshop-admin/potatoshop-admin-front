'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useDeleteReview, useGetReview } from '@/api/review';
import { Button } from '@/components/ui/button';
import { RowDisplay } from '@/app/(afterLogin)/components/subtabs/row-form';
import DeleteDialog from '@/app/(afterLogin)/components/subtabs/delete-dialog';
import Loading from '@/components/ui/loading';

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

  if (!isSuccess) {
    return <Loading />;
  }
  return (
    <div className="h-full w-full px-4 py-4 overflow-y-scroll">
      <DeleteDialog title={data?.data.name} item="리뷰" onClick={deleteReview} />
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
