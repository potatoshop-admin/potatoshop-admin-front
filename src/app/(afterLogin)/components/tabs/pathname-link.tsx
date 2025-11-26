'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { TabItem } from '@/app/(afterLogin)/components/tabs/tab-layout';

export interface PathnameProps {
  item: TabItem;
}

const PathnameLink: React.FC<PathnameProps> = ({ item }) => {
  const pathname: string = usePathname();

  return (
    <Link
      key={item.id}
      href={item.href}
      className={cn(
        'w-full h-10 flex items-center hover:bg-primary-50 rounded-lg px-1',
        pathname === item.href && 'font-bold text-primary-500'
      )}
    >
      {item.label}
    </Link>
  );
};

export default PathnameLink;
