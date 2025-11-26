'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TabItem } from '@/app/(afterLogin)/components/tabs/tab-layout';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface PathnameProps {
  items: TabItem[];
}

const PathnameSelect: React.FC<PathnameProps> = ({ items }) => {
  const pathname: string = usePathname();
  const router = useRouter();
  const selectedItem = items.find((item) => pathname.startsWith(item.href));

  const pathChangeHandler = (data: string) => {
    if (data === pathname) return;
    router.push(data);
  };

  return (
    <Select value={selectedItem?.href} onValueChange={(data: string) => pathChangeHandler(data)}>
      <SelectTrigger className="w-2/3">
        <SelectValue placeholder="선택하세요">{selectedItem?.label || '선택하세요'}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item: TabItem) => (
            <SelectItem key={item.id} value={item.href}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default PathnameSelect;
