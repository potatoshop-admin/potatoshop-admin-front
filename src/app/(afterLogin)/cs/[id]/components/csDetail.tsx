'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteUser } from '@/api/users';
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
import { useGetCs } from '@/api/cs';
import { Cs } from '@/types/cs';
import { useCsInfo } from '@/stores/useCsInfo';
import { RowDisplay } from '@/app/(afterLogin)/components/subtabs/row-form';
import Loading from '@/components/ui/loading';

const CsDetail = ({ id }: { id: string }) => {
  const router = useRouter();

  const { data, isSuccess } = useGetCs({ id: Number(id) });
  const { mutate } = useDeleteUser({
    onSuccess: (e) => {
      toast.success(e.statusMessage);
      router.back();
    },
  });
  const { setCsInfo } = useCsInfo();

  const initialCs: Cs = {
    csId: 0,
    storeId: 0,
    userId: 0,
    ordersId: 0,
    question: '',
    answer: '',
    csStatus: 'WAITING',
    createdAt: '',
  };

  const deleteUser = () => {
    mutate({ id: Number(id) });
  };

  React.useEffect(() => {
    if (data?.data) {
      toast.success(`${data.statusMessage}`);
      setCsInfo(data.data);
    }
  }, [data?.data]);

  React.useEffect(() => {
    return () => setCsInfo(initialCs);
  }, []);

  if (!isSuccess) {
    return <Loading />;
  }
  return (
    <div className="h-full w-full px-4 py-4 overflow-y-scroll">
      <Dialog>
        <div className="w-full h-fit pb-6 flex justify-between items-center">
          <h1 className="font-24-extrabold sm:text-[28px]">{data?.data.name}</h1>
          <DialogTrigger asChild>
            <Button variant="destructive" size="roundedDefault">
              문의 삭제
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogTitle>유저 삭제</DialogTitle>
          <p>해당 문의를 삭제하시겠습니까?</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" size="default" variant="outline">
                취소
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" size="default" variant="default" onClick={deleteUser}>
                확인
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="w-full h-fit rounded-md border-2 border-gray-200 px-4 py-4 space-y-6">
        <RowDisplay value={data?.data.csStatus} label="응답 유무" />
        <RowDisplay value={data?.data.question} label="질문" />
        <RowDisplay value={data?.data.answer ? data?.data.answer : '응답 대기'} label="응답" />
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
          <Button
            variant="default"
            size="fullWidth"
            className="flex-1/2"
            onClick={() => {
              router.push(`/cs/${id}/answer`);
            }}
          >
            문의 답변
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CsDetail;
