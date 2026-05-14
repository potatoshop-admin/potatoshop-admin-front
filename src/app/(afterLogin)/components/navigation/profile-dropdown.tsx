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
import React from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useLogInUser } from '@/stores/useLogInUser';
import { Button } from '@/components/ui/button';

const ProfileDropdown = () => {
  const router = useRouter();

  const { logInUser, deleteLogInUser } = useLogInUser();

  const name = logInUser.name;
  const id = logInUser.id;
  const role = logInUser.role;

  const logOutButton = () => {
    Cookies.remove('token');
    const token = Cookies.get('token');
    if (!token) {
      deleteLogInUser();
      router.push('/sign-in');
    }
  };
  const settingButton = () => {
    router.push('/settings');
  };

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
