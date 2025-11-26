import React from 'react';
import ReviewDetail from '@/app/(afterLogin)/reviews/[id]/components/reviewDetail';

interface PageProps {
  params: {
    [key: string]: string;
  };
}

export default async function Id({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="flex justify-center w-full h-dvh pointer-events-auto overscroll-none overflow-hidden">
      <ReviewDetail id={id} />
    </main>
  );
}
