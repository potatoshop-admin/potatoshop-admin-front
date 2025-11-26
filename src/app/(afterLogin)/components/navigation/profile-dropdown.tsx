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
    <div className="size-14 rounded-[28px] bg-primary-50 flex items-center justify-center cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <CircleUserRound className="size-14 stroke-1 stroke-primary-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              userName
              <DropdownMenuShortcut>{name}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              userId
              <DropdownMenuShortcut>{id}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              userRole
              <DropdownMenuShortcut>{role}</DropdownMenuShortcut>
            </DropdownMenuItem>
            {role === 'MASTER' && (
              <DropdownMenuItem onClick={settingButton}>Manage users</DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logOutButton}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileDropdown;
