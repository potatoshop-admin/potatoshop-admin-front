'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CircleUserRound } from 'lucide-react';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLogInUser } from '@/stores/useLogInUser';
import { useLogout } from '@/api/adminUser';
import { Button } from '@/components/ui/button';

const ProfileDropdown = () => {
  const router = useRouter();
  const { logInUser, deleteLogInUser } = useLogInUser();

  const { name, id, role } = logInUser;

  const { mutate: logout } = useLogout({
    onSuccess: () => {
      // Zustand 스토어 초기화 후 로그인 페이지로
      deleteLogInUser();
      router.push('/sign-in');
    },
  });

  /**
   * 로그아웃 처리
   * - httpOnly 쿠키는 클라이언트에서 직접 삭제 불가
   * - /api/auth/logout 호출로 서버에서 쿠키 삭제
   */
  const logOutButton = useCallback(() => {
    logout();
  }, [logout]);

  const settingButton = useCallback(() => {
    router.push('/settings');
  }, [router]);

  return (
    <div className="size-14 rounded-[28px] bg-primary-50 flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-14 rounded-[28px] p-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-primary-400"
            aria-label={`${name} 프로필 메뉴 열기`}
            title="프로필 메뉴 열기"
          >
            <CircleUserRound className="size-14 stroke-1 stroke-primary-400" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>내 계정</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem aria-label={`사용자 이름 ${name}`} disabled>
              이름
              <DropdownMenuShortcut>{name}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem aria-label={`사용자 아이디 ${id}`} disabled>
              아이디
              <DropdownMenuShortcut>{id}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem aria-label={`사용자 권한 ${role}`} disabled>
              권한
              <DropdownMenuShortcut>{role}</DropdownMenuShortcut>
            </DropdownMenuItem>
            {role === 'MASTER' && (
              <DropdownMenuItem onClick={settingButton} aria-label="사용자 관리 페이지로 이동">
                사용자 관리
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logOutButton} aria-label="로그아웃">
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileDropdown;
