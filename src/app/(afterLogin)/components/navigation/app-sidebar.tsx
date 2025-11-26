'use client';
import React from 'react';
import SidebarTop from '@/app/(afterLogin)/components/navigation/sidebar-top';
import MenuWithSub from '@/app/(afterLogin)/components/navigation/sidebar-middle/menu-with-sub';
import MenuWithoutSub from '@/app/(afterLogin)/components/navigation/sidebar-middle/menu-without-sub';
import SidebarMenuBottom from '@/app/(afterLogin)/components/navigation/sidebar-bottom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { MENU_ITEMS, MenuItemType } from '@/constants';

//isMobile떄는 side가 top으로 가도록 설정

export function AppSidebar() {
  const { isMobile } = useSidebar();
  const [side, setSide] = React.useState<'left' | 'top'>('left');

  React.useEffect(() => {
    setSide(isMobile ? 'top' : 'left');
  }, [isMobile]);
  return (
    <Sidebar collapsible="icon" side={side}>
      <SidebarContent className="flex-col justify-between">
        <SidebarHeader className="overflow-y-scroll">
          <SidebarGroup>
            <SidebarTop />
            <SidebarGroupContent>
              <SidebarMenu>
                {MENU_ITEMS.map((item: MenuItemType) => (
                  <React.Fragment key={item.title}>
                    {item.items ? <MenuWithSub item={item} /> : <MenuWithoutSub item={item} />}
                  </React.Fragment>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarHeader>
        <SidebarMenuBottom />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
