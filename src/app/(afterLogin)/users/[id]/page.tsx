import React from 'react';
import UserDetail from '@/app/(afterLogin)/users/[id]/components/userDetail';

interface PageProps {
  params: {
    [key: string]: string;
  };
}

export default async function Id({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="flex justify-center w-full h-dvh pointer-events-auto overscroll-none overflow-hidden">
      <UserDetail id={id} />
    </main>
  );
}
