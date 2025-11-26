import React, { Fragment } from 'react';
import PathnameSelect from '@/app/(afterLogin)/components/tabs/pathname-select';
import PathnameLink from '@/app/(afterLogin)/components/tabs/pathname-link';

export interface TabItem {
  id: number;
  label: string;
  href: string;
}

interface TabLayoutProps {
  items: TabItem[];
}

const TabLayout: React.FC<TabLayoutProps> = ({ items }) => {
  return (
    <>
      <div className="w-full h-20 flex items-center justify-center lg:hidden">
        <PathnameSelect items={items} />
      </div>
      <div className="hidden w-50 h-full border-r border-primary-50 lg:flex flex-col px-4 py-5 space-y-1 font-16-medium text-gray-600">
        {items.map((item: TabItem) => (
          <Fragment key={item.id}>
            <PathnameLink item={item} />
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default TabLayout;
