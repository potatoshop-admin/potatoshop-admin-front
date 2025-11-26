'use client';

import React, { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useInput } from '@/hooks/use-input';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/api/adminUser';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { ApiResponseType } from '@/types/api';
import { useLogInUser } from '@/stores/useLogInUser';
import { jwtDecode } from 'jwt-decode';
import { RoleType } from '@/types/adminUser';

const SignInForm = () => {
  const router = useRouter();
  const id = useInput('');
  const password = useInput('');

  const { setLogInUser, logInUser, deleteLogInUser } = useLogInUser();

  const { mutate } = useLogin({
    onSuccess: (
      data: ApiResponseType<null> & {
        token: string;
      }
    ) => {
      router.push('/');
      const decodedToken: {
        exp: number;
        iat: number;
        name: string;
        role: RoleType;
        storeId: number;
        sub: string;
      } = jwtDecode(data?.token);
      setLogInUser({ name: decodedToken.name, id: decodedToken.sub, role: decodedToken.role });
      toast.success(`${data.statusMessage}`);
    },
    onError: (e) => {
      toast.error(`${e.response.data.statusMessage}`);
    },
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);

  const handleSubmit = () => {
    mutate({ logInId: id.value as string, password: password.value as string });
  };

  React.useEffect(() => {
    const token: string | undefined = Cookies.get('token');
    if (token) {
      router.replace('/');
    } else {
      if (logInUser.name !== '' || logInUser.id !== '') {
        deleteLogInUser();
      }
    }
  }, []);

  React.useEffect(() => {
    if (
      typeof id.value !== 'number' &&
      id.value?.length >= 3 &&
      typeof password.value !== 'number' &&
      password.value?.length > 3
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [id.value, password.value]);
  return (
    <form
      className="w-74 h-fit max-h-200 space-y-4"
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
      }}
    >
      <h1 className="font-24-extrabold sm:text-[28px] text-gray-800">potato admin</h1>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <p className="font-14-bold text-gray-700">이메일</p>
          <Input placeholder="your login id" value={id.value} onChange={id.onChange} type="text" />
        </div>
        <div className="flex flex-col space-y-2 relative">
          {showPassword ? (
            <EyeIcon
              className="absolute top-9 right-3 stroke-gray-400"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <EyeClosedIcon
              className="absolute top-9 right-3 stroke-gray-400"
              onClick={() => setShowPassword(true)}
            />
          )}
          <p className="font-14-bold text-gray-700">비밀번호</p>
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password.value}
            onChange={password.onChange}
          />
        </div>
      </div>
      <Button
        variant="default"
        size="fullWidth"
        disabled={disabled}
        type="submit"
        onClick={handleSubmit}
      >
        로그인
      </Button>
    </form>
  );
};
export default SignInForm;
