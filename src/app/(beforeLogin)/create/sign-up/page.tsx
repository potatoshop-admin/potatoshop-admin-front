'use client';
import React, { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';
import { useGetStores } from '@/api/stores';
import { usePostAdminUsers } from '@/api/adminUser';
import { UseInput, useInput } from '@/hooks/use-input';
import { Button } from '@/components/ui/button';
import { RowInput, RowSelect } from '@/app/(afterLogin)/components/subtabs/row-form';
import { SelectType } from '@/app/(afterLogin)/components/subtabs/row-form/row-select';
import { Store } from '@/types/store';

const SignUp = () => {
  const router: AppRouterInstance = useRouter();
  const name: UseInput = useInput('');
  const logInId: UseInput = useInput('');
  const password: UseInput = useInput('');
  const [storeSelect, setStoreSelect] = React.useState<SelectType[]>([]);
  const [store, setStore] = React.useState<string>('');

  const { data: stores } = useGetStores();
  const { mutate } = usePostAdminUsers({
    onSuccess: (e) => {
      toast.success(`${e.statusMessage}`);
      router.push('/sign-in');
    },
    onError: (e) => {
      toast.error(`${e.response.data.statusMessage}`);
    },
  });

  const handleSubmit = () => {
    mutate({
      name: name.value as string,
      storeId: Number(store),
      logInId: logInId.value as string,
      password: password.value as string,
    });
  };

  React.useEffect(() => {
    if (stores) {
      toast.success(`${stores.statusMessage}`);
      const storeValue: SelectType[] = stores.data.map((data: Store) => {
        return {
          label: data.storeName,
          value: data.storeId.toString(),
        };
      });
      setStoreSelect(storeValue);
    }
  }, [stores]);

  return (
    <div className="w-dvw h-dvh flex items-center justify-center">
      <form
        className="w-1/2 h-fit py-4 space-y-2"
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
        }}
      >
        <RowSelect
          label="스토어"
          options={storeSelect}
          value={store}
          onChange={setStore}
          placeholder="스토어를 선택하세요"
        />
        <RowInput
          className="w-70"
          label="이름"
          placeholder="이름을 입력하세요"
          value={name.value as string}
          onChange={name.onChange}
          type="text"
        />
        <RowInput
          className="w-70"
          label="아이디"
          placeholder="아이디를 입력하세요"
          value={logInId.value as string}
          onChange={logInId.onChange}
          type="text"
        />
        <RowInput
          className="w-70"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          value={password.value as string}
          onChange={password.onChange}
          type="text"
        />
        <Button variant="default" size="fullWidth" type="submit" onClick={handleSubmit}>
          아이디 생성
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
