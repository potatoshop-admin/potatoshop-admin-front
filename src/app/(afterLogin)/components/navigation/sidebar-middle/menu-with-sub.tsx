'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { MenuItemType, SubMenuItemType } from '@/constants';
import { CarIcon, ChevronRight } from 'lucide-react';

interface SubMenuProps {
  item: MenuItemType;
}

const MenuWithSub: React.FC<SubMenuProps> = ({ item }) => {
  const { isMobile, state, setOpenMobile } = useSidebar();
  const pathname: string = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Skeleton className="flex items-center justify-between w-full h-12 bg-primary-50 font-14-medium text-gray-600 px-2">
        <div className="w-fit flex space-x-2 items-center">
          <CarIcon className="size-4" />
          <p>___</p>
        </div>
        <ChevronRight className="ml-auto size-4" />
      </Skeleton>
    );
  }
  return (
    <SidebarMenuItem>
      {mounted && state === 'collapsed' && !isMobile ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className={cn(
                pathname === item.url &&
                  'bg-primary-200 font-14-bold text-gray-800 stroke-gray-800',
                'justify-center'
              )}
            >
              {item.icon && <item.icon />}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {item.items &&
              item?.items.map((subItem: SubMenuItemType) => (
                <DropdownMenuItem
                  className={cn(
                    pathname === subItem.url &&
                      'bg-primary-200 font-14-bold text-gray-800 stroke-gray-800'
                  )}
                  key={subItem.title}
                  onClick={(event) => {
                    if (pathname.startsWith(subItem.url)) {
                      event.preventDefault();
                    }
                    router.push(subItem.url);
                  }}
                >
                  {subItem.title}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Collapsible className="group/collapsible">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              className={cn(
                pathname.split('/')[1] === item.url.split('/')[1] &&
                  'bg-primary-200 font-14-bold text-gray-800 stroke-gray-800 '
              )}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="py-3">
            <SidebarMenuSub>
              {item.items &&
                item.items.map((subItem) => (
                  <SidebarMenuSubItem
                    key={subItem.title}
                    className={cn(pathname === subItem.url && 'border-l-2 border-gray-800')}
                  >
                    <SidebarMenuSubButton
                      asChild
                      className={cn(
                        pathname === subItem.url &&
                          'bg-primary-200 font-14-bold text-gray-800 stroke-gray-800'
                      )}
                      onClick={(event) => {
                        if (pathname.startsWith(subItem.url)) {
                          event.preventDefault();
                        }
                        router.push(subItem.url);
                        setOpenMobile(false);
                      }}
                    >
                      <p className="cursor-pointer">{subItem.title}</p>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      )}
    </SidebarMenuItem>
  );
};

export default MenuWithSub;
