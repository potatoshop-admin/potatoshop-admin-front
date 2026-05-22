'use client';

import React, { FormEvent, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useInput } from '@/hooks/use-input';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin, LoginResponse } from '@/api/adminUser';
import { toast } from 'sonner';
import { useLogInUser } from '@/stores/useLogInUser';

/**
 * SignInForm
 *
 * [보안 변경]
 * - 이전: 로그인 후 JWT를 js-cookie로 직접 저장, jwtDecode로 클라이언트에서 디코딩
 * - 현재: Next.js /api/auth/login이 httpOnly 쿠키를 서버에서 설정
 *         이 컴포넌트는 응답 바디의 user 정보만 Zustand에 저장
 *         JS에서 JWT 토큰 자체에 접근 불가 → XSS 방어
 *
 * 리다이렉트(토큰 없는 사용자 → /sign-in)는 middleware.ts에서 처리
 */
const SignInForm = () => {
  const router = useRouter();
  const id = useInput('');
  const password = useInput('');

  const { setLogInUser } = useLogInUser();

  const { mutate } = useLogin({
    onSuccess: (data: LoginResponse) => {
      // 토큰은 서버가 httpOnly 쿠키로 처리
      // 클라이언트는 user info만 받아 Zustand 스토어에 저장
      setLogInUser({
        name: data.user.name,
        id: data.user.id,
        role: data.user.role,
      });
      toast.success(data.statusMessage);
      router.push('/');
    },
    onError: (e) => {
      toast.error(`${e.response.data.statusMessage}`);
    },
  });

  const [showPassword, setShowPassword] = React.useState(false);

  // useEffect + setState 이중 렌더 제거: 동기 계산으로 렌더당 1회만 평가
  const disabled = useMemo(
    () =>
      !(
        typeof id.value === 'string' &&
        id.value.length >= 3 &&
        typeof password.value === 'string' &&
        password.value.length > 3
      ),
    [id.value, password.value]
  );

  const handleSubmit = React.useCallback(() => {
    mutate({ logInId: id.value as string, password: password.value as string });
  }, [mutate, id.value, password.value]);

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
          <label htmlFor="sign-in-id" className="font-14-bold text-gray-700">
            아이디
          </label>
          <Input
            id="sign-in-id"
            placeholder="your login id"
            value={id.value}
            onChange={id.onChange}
            type="text"
            name="id"
          />
        </div>
        <div className="flex flex-col space-y-2 relative">
          {showPassword ? (
            <EyeIcon
              aria-label="show password"
              className="absolute top-9 right-3 stroke-gray-400"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <EyeClosedIcon
              className="absolute top-9 right-3 stroke-gray-400"
              onClick={() => setShowPassword(true)}
            />
          )}
          <label htmlFor="sign-in-password" className="font-14-bold text-gray-700">
            비밀번호
          </label>
          <Input
            id="sign-in-password"
            type={showPassword ? 'text' : 'password'}
            value={password.value}
            onChange={password.onChange}
            name="password"
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
