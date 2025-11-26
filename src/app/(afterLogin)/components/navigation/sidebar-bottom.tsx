import React from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/app/(afterLogin)/components/navigation/mode-toggle';
import ProfileDropdown from '@/app/(afterLogin)/components/navigation/profile-dropdown';

const SidebarMenuBottom = () => {
  const { isMobile, state } = useSidebar();

  return (
    <div
      className={cn(
        'w-full h-fit pb-2',
        state === 'collapsed' && !isMobile
          ? 'flex flex-col items-center space-y-2'
          : 'flex justify-end items-center px-2 space-x-2'
      )}
    >
      <ModeToggle />
      <ProfileDropdown />
    </div>
  );
};

export default SidebarMenuBottom;
