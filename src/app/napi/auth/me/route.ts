/**
 * GET /api/auth/me
 *
 * 역할:
 * - 페이지 새로고침 시 Zustand 스토어 재수화(hydration)에 사용
 * - httpOnly 쿠키에서 토큰을 읽어 user info 반환
 * - 만료된 토큰이면 쿠키를 삭제하고 401 반환
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  name: string;
  sub: string;
  role: string;
  storeId: number;
  exp: number;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // 토큰 만료 여부 확인 (exp는 초 단위)
    if (decoded.exp * 1000 < Date.now()) {
      // 만료된 쿠키 삭제
      cookieStore.set('token', '', { maxAge: 0, path: '/' });
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        name: decoded.name,
        id: decoded.sub,
        role: decoded.role,
        storeId: decoded.storeId,
      },
    });
  } catch {
    // 토큰 파싱 오류
    cookieStore.set('token', '', { maxAge: 0, path: '/' });
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }
}
