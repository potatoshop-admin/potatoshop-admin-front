'use client';
import React, { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { usePostStores } from '@/api/stores';
import { UseInput, useInput } from '@/hooks/use-input';
import { Button } from '@/components/ui/button';
import { RowInput } from '@/app/(afterLogin)/components/subtabs/row-form';

const Store = () => {
  const router = useRouter();
  const storeName: UseInput = useInput('');

  const { mutate } = usePostStores({
    onSuccess: (e) => {
      toast.success(`${e.statusMessage}`);
      router.push('/sign-in');
    },
    onError: (e) => {
      toast.error(`${e.response.data.statusMessage}`);
    },
  });

  const handleSubmit = () => {
    mutate({ storeName: storeName.value as string });
  };
  return (
    <div className="w-dvw h-dvh flex items-center justify-center">
      <form
        className="w-1/2 h-fit py-4 space-y-2"
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
        }}
      >
        <RowInput
          className="w-70"
          label="스토어 명"
          placeholder="생성할 스토어 이름을 입력하세요"
          value={storeName.value}
          onChange={storeName.onChange}
          type="text"
        />
        <Button variant="default" size="fullWidth" type="submit" onClick={handleSubmit}>
          스토어 생성
        </Button>
      </form>
    </div>
  );
};

export default Store;
