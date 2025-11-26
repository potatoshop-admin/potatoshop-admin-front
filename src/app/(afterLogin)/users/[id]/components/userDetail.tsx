'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserInfo } from '@/stores/useUserInfo';
import { useDeleteUser, useGetUser } from '@/api/users';
import { toast } from 'sonner';
import { RowDisplay } from '@/app/(afterLogin)/components/subtabs/row-form';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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

  React.useEffect(() => {
    if (data?.data) {
      toast.success(`${data.statusMessage}`);
      setUserInfo(data.data);
    }
  }, [data?.data]);

  React.useEffect(() => {
    return () => setUserInfo(initialUser);
  }, []);

  if (!isSuccess) return <p>Loading.....</p>;
  return (
    <div className="h-full w-full px-4 py-4 overflow-y-scroll">
      <Dialog>
        <div className="w-full h-fit pb-6 flex justify-between items-center">
          <h1 className="font-24-extrabold sm:text-[28px]">{data?.data.name}</h1>
          <DialogTrigger asChild>
            <Button variant="destructive" size="roundedDefault">
              유저 삭제
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <DialogTitle>유저 삭제</DialogTitle>
          <p>해당 유저를 삭제하시겠습니까?</p>
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
        <RowDisplay value={data?.data.logInId} label="아이디" />
        <RowDisplay value={data?.data.name} label="유저 이름" />
        <RowDisplay value={data?.data.grade} label="유저 등급" />
        <RowDisplay value={data?.data.age === null ? '' : data?.data.age} label="나이" />
        <RowDisplay value={data?.data.email} label="이메일" />
        <RowDisplay value={data?.data.birthday === null ? '' : data?.data.birthday} label="생일" />
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
              router.push(`/users/${id}/edit`);
            }}
          >
            유저 정보 수정
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
