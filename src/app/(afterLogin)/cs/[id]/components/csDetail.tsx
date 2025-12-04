'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteUser } from '@/api/users';
import { toast } from 'sonner';
import { useGetCs } from '@/api/cs';
import { Cs } from '@/types/cs';
import { useCsInfo } from '@/stores/useCsInfo';
import { RowDisplay, RowTwoButtons } from '@/app/(afterLogin)/components/subtabs/row-form';
import Loading from '@/components/ui/loading';
import DeleteDialog from '@/app/(afterLogin)/components/subtabs/delete-dialog';

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

  const editBtn = () => {
    router.push(`/cs/${id}/answer`);
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
      <DeleteDialog title={data?.data.name} item="문의" onClick={deleteUser} />
      <div className="w-full h-fit rounded-md border-2 border-gray-200 px-4 py-4 space-y-6">
        <RowDisplay value={data?.data.csStatus} label="응답 유무" />
        <RowDisplay value={data?.data.question} label="질문" />
        <RowDisplay value={data?.data.answer ? data?.data.answer : '응답 대기'} label="응답" />
        <RowTwoButtons cancelTitle="뒤로 돌아가기" confirmTitle="문의 답변" onClick={editBtn} />
      </div>
    </div>
  );
};

export default CsDetail;
