'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { MenuItemType } from '@/constants';

interface MenuWithoutProps {
  item: MenuItemType;
}

const MenuWithoutSub: React.FC<MenuWithoutProps> = ({ item }) => {
  const { setOpenMobile } = useSidebar();
  const pathname: string = usePathname();
  const router = useRouter();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={cn(
          pathname.startsWith(item.url) &&
            'bg-primary-200 font-14-bold text-gray-800 stroke-gray-800'
        )}
      >
        <p
          className="cursor-pointer"
          onClick={(event) => {
            if (pathname.startsWith(item.url)) {
              event.preventDefault();
            }
            router.push(item.url);
            setOpenMobile(false);
          }}
        >
          <item.icon />
          <span>{item.title}</span>
        </p>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default MenuWithoutSub;
