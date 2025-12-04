import React from 'react';
import ReviewDetail from '@/app/(afterLogin)/reviews/[id]/components/reviewDetail';
import { PageProps } from '@/types/pageType';

export default async function Id({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="flex justify-center w-full h-dvh pointer-events-auto overscroll-none overflow-hidden">
      <ReviewDetail id={id} />
    </main>
  );
}
