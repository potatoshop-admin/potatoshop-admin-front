'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronRightIcon } from 'lucide-react';
import { BREAD_CRUMB_PATH, URL } from '@/constants';

export const getTitle = (segment: string): string => {
  let title = segment;
  for (const menu of BREAD_CRUMB_PATH) {
    if (menu.url.endsWith(segment)) {
      title = menu.title;
    }
  }
  return title;
};
export const getBreadcrumbByPath = (pathname: string): { title: string; url: string }[] => {
  const segments = pathname.split('/').filter(Boolean);
  let currentPath = '';

  return segments.map((segment) => {
    currentPath += `/${segment}`;
    const title = getTitle(segment);
    return {
      title: title, // 기본은 segment 값 (필요시 매핑 가능)
      url: currentPath,
    };
  });
};

const GetPathname = () => {
  const pathname = usePathname();
  const router = useRouter();
  const breadcrumbs = getBreadcrumbByPath(pathname);

  const blockedPath: string[] = [URL.PRODUCTS_MANAGEMENT];
  const pathButton = (event: React.MouseEvent, url: string) => {
    if (pathname === url) {
      event.preventDefault();
      return;
    }
    if (blockedPath.includes(url)) {
      event.preventDefault();
      return;
    }
    router.push(url);
  };
  return (
    <div className="w-full flex items-center space-x-2 overflow-x-scroll">
      {pathname === '/' ? (
        <div className="flex items-center font-14-bold sm:text-[16px]">
          <h1 className="text-primary cursor-pointer">대시보드</h1>
        </div>
      ) : (
        <div className="w-full flex items-center font-14-bold sm:text-[16px]">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              <button
                onClick={(event: React.MouseEvent) => pathButton(event, crumb.url)}
                className="w-fit whitespace-nowrap text-primary cursor-pointer px-3 py-3 rounded-sm hover:bg-primary-200"
              >
                {crumb.title}
              </button>
              {index < breadcrumbs.length - 1 && <ChevronRightIcon className="ml-2 size-4" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetPathname;
