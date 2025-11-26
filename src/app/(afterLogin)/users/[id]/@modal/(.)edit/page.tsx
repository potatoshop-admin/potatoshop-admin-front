'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useUserInfo } from '@/stores/useUserInfo';
import { useInput } from '@/hooks/use-input';
import { RowInput, RowSelect } from '@/app/(afterLogin)/components/subtabs/row-form';
import React, { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { usePatchUser } from '@/api/users';
import { Grade, User } from '@/types/user';
import { toast } from 'sonner';
import { gradeSelect } from '@/constants';
import { getChangedFields } from '@/lib/utils';

export default function UserEditModal() {
  const router = useRouter();
  const { user } = useUserInfo();
  const { mutate } = usePatchUser({
    onSuccess: (e) => {
      toast.success(`${e.statusMessage}`);
    },
  });

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newData: Partial<User> = {
      name: name.value as string,
      age: Number(age.value) as number,
      email: email.value as string,
      birthday: birthday.value as string,
      grade: grade as Grade,
    };

    const changedValue: Partial<User> = getChangedFields(user, newData);

    mutate({ id: user.userId, user: changedValue });
    router.back();
  };
  const [grade, setGrade] = React.useState<string>(user.grade);
  const name = useInput(user.name);
  const age = useInput(user.age ? user.age : 0);
  const email = useInput(user.email);
  const birthday = useInput(user.birthday ? (user.birthday as string) : '');
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogTitle>유저 정보 수정</DialogTitle>
        {/* 실제 수정 폼 */}
        <form className="space-y-4" onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)}>
          {/* 예: 이름, 이메일, 등급 등 */}
          <RowInput
            value={name.value}
            onChange={name.onChange}
            label="이름"
            placeholder="이름을 입력하세요"
          />

          <RowInput
            value={age.value}
            onChange={age.onChange}
            label="나이"
            placeholder="나이를 입력하세요"
          />
          <RowInput
            value={email.value}
            onChange={email.onChange}
            label="이메일"
            placeholder="이메일을 입력하세요"
          />
          <RowInput
            value={birthday.value}
            onChange={birthday.onChange}
            label="생일"
            placeholder="생일을 입력하세요"
            type="date"
          />
          <RowSelect
            label="카테고리"
            options={gradeSelect}
            value={grade}
            onChange={setGrade}
            placeholder="상품 카테고리를 선택하세요"
          />

          <div className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button type="button" onClick={handleClose} size="default" variant="outline">
                취소
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" size="default" variant="default">
                저장
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
