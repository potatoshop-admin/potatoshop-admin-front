import React from 'react';
import Link from 'next/link';
import { SidebarGroupLabel, useSidebar } from '@/components/ui/sidebar';
import logoImage from '@/../public/common/smallPotato.png';
import Image from 'next/image';
import cancelICon from '@/../public/common/cancel-icon.svg';

const SidebarTop = () => {
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <SidebarGroupLabel className="h-10 items-center justify-between">
      <Link href="/" onClick={() => setOpenMobile(false)}>
        <Image
          src={logoImage}
          alt="logo"
          height={30}
          width={100}
          style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
          priority
        />
      </Link>
      {isMobile && (
        <div className="size-fit cursor-pointer" onClick={() => setOpenMobile(false)}>
          <Image src={cancelICon} alt="button for cancel" height={16} width={16} />
        </div>
      )}
    </SidebarGroupLabel>
  );
};

export default SidebarTop;
