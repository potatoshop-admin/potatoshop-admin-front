import React from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/app/(afterLogin)/components/navigation/app-sidebar';
import GetPathname from '@/app/(afterLogin)/components/navigation/get-pathname';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
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
