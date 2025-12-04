import React from 'react';
import CsDetail from '@/app/(afterLogin)/cs/[id]/components/csDetail';
import { PageProps } from '@/types/pageType';

export default async function Id({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="flex justify-center w-full h-dvh pointer-events-auto overscroll-none overflow-hidden">
      <CsDetail id={id} />
    </main>
  );
}
