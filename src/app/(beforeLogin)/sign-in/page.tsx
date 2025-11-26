import React from 'react';
import SignInForm from '@/app/(beforeLogin)/sign-in/components/sign-in-form';
import PotatoAdmin from '@/../public/common/potatoAdmin.png';
import Image from 'next/image';

const SignIn = () => {
  return (
    <div className="w-dvw h-dvh flex">
      <div className="hidden sm:flex flex-1 items-center justify-center h-full bg-background">
        <Image
          src={PotatoAdmin}
          alt="로고"
          height={400}
          width={400}
          className="min-h-70 min-w-70"
        />
      </div>
      <div className="flex flex-1 h-full items-center justify-center bg-gray-100">
        <div className="fixed top-0 right-3 font-16-medium text-gray-600 w-fit space-x-3 p-2">
          <a href="/create/store">스토어 생성</a>
          <a href="/create/sign-up">아이디 생성</a>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <SignInForm />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
