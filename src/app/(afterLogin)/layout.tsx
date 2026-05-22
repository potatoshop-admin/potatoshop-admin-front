import React from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/app/(afterLogin)/components/navigation/app-sidebar';
import GetPathname from '@/app/(afterLogin)/components/navigation/get-pathname';
import AuthHydrator from '@/app/(afterLogin)/components/auth-hydrator';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* 새로고침 시 Zustand logInUser 스토어 재수화 */}
      <AuthHydrator />
      <AppSidebar />
      <SidebarInset>
        <div className="h-full w-full flex flex-col overscroll-contain">
          <div className="h-16 w-full flex items-center border-b-2 border-gray-50 space-x-2">
            <SidebarTrigger />
            <GetPathname />
          </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
