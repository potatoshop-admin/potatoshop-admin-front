/**
 * POST /api/auth/logout
 *
 * httpOnly 쿠키를 서버에서 삭제.
 * 클라이언트 JS로는 이 쿠키를 직접 삭제할 수 없기 때문에 반드시 서버 라우트 필요.
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();

  // 쿠키 만료시간을 과거로 설정하여 즉시 삭제
  cookieStore.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return NextResponse.json({ success: true, statusMessage: '로그아웃 되었습니다.' });
}
