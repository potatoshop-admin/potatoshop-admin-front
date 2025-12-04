'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserInfo } from '@/stores/useUserInfo';
import { useDeleteUser, useGetUser } from '@/api/users';
import { toast } from 'sonner';
import { RowDisplay, RowTwoButtons } from '@/app/(afterLogin)/components/subtabs/row-form';
import DeleteDialog from '@/app/(afterLogin)/components/subtabs/delete-dialog';
import Loading from '@/components/ui/loading';
import { User } from '@/types/user';

const UserDetail = ({ id }: { id: string }) => {
  const router = useRouter();

  const { data, isSuccess } = useGetUser({ id: Number(id) });
  const { mutate } = useDeleteUser({
    onSuccess: (e) => {
      toast.success(e.statusMessage);
      router.back();
    },
  });
  const { setUserInfo } = useUserInfo();

  const initialUser: User = {
    age: null,
    birthday: null,
    createdAt: '',
    email: '',
    grade: 'BASIC',
    logInId: '',
    name: '',
    password: '',
    storeId: 0,
    userId: 0,
  };

  const deleteUser = () => {
    mutate({ id: Number(id) });
  };

  const editBtn = () => {
    router.push(`/users/${id}/edit`);
  };

  React.useEffect(() => {
    if (data?.data) {
      toast.success(`${data.statusMessage}`);
      setUserInfo(data.data);
    }
  }, [data?.data]);

  React.useEffect(() => {
    return () => setUserInfo(initialUser);
  }, []);

  if (!isSuccess) {
    return <Loading />;
  }
  return (
    <div className="h-full w-full px-4 py-4 overflow-y-scroll">
      <DeleteDialog title={data?.data.name} item="유저" onClick={deleteUser} />
      <div className="w-full h-fit rounded-md border-2 border-gray-200 px-4 py-4 space-y-6">
        <RowDisplay value={data?.data.logInId} label="아이디" />
        <RowDisplay value={data?.data.name} label="유저 이름" />
        <RowDisplay value={data?.data.grade} label="유저 등급" />
        <RowDisplay value={data?.data.age === null ? '' : data?.data.age} label="나이" />
        <RowDisplay value={data?.data.email} label="이메일" />
        <RowDisplay value={data?.data.birthday === null ? '' : data?.data.birthday} label="생일" />
        <RowTwoButtons confirmTitle="유저정보 수정" cancelTitle="뒤로 돌아가기" onClick={editBtn} />
      </div>
    </div>
  );
};

export default UserDetail;
