/**
 * POST /api/auth/login
 *
 * 역할:
 * 1. Spring 백엔드 /auth/login 호출
 * 2. 응답 헤더의 JWT를 httpOnly 쿠키로 저장 (JS에서 접근 불가 → XSS 방어)
 * 3. 클라이언트에는 user info만 반환 (토큰 자체는 절대 노출 안 함)
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';

// BACKEND_URL은 Spring context-path까지 포함 (SERVER_PATH=/fashion-admin/api)
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080/fashion-admin/api';

interface JwtPayload {
  name: string;
  sub: string;
  role: string;
  storeId: number;
  exp: number;
  iat: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Spring 백엔드 로그인 호출
    const backendRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // 응답 파싱 — Spring이 HTML(404 등)을 반환해도 500 대신 적절한 에러 반환
    let data: Record<string, unknown> = {};
    const resContentType = backendRes.headers.get('content-type') ?? '';
    if (resContentType.includes('application/json')) {
      data = await backendRes.json();
    }

    if (!backendRes.ok) {
      return NextResponse.json(
        data.statusMessage
          ? data
          : { success: false, statusMessage: `인증 서버 오류 (${backendRes.status})` },
        { status: backendRes.status }
      );
    }

    // Authorization 헤더에서 JWT 추출
    const token = backendRes.headers.get('authorization');

    if (!token) {
      return NextResponse.json(
        { success: false, statusMessage: '서버로부터 인증 토큰을 받지 못했습니다.' },
        { status: 500 }
      );
    }

    // JWT 디코딩 (서버에서만 수행 — 클라이언트에 토큰 전달 X)
    const decoded = jwtDecode<JwtPayload>(token);

    // 만료 시간 계산 (JWT exp는 초 단위)
    const maxAge = decoded.exp - Math.floor(Date.now() / 1000);

    // httpOnly 쿠키 설정
    // httpOnly: JS에서 접근 불가 (document.cookie에 노출 안 됨)
    // secure: HTTPS 환경에서만 전송
    // sameSite: CSRF 방어
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: maxAge > 0 ? maxAge : 60 * 60 * 24,
      path: '/',
    });

    // 클라이언트에 user info만 반환 (토큰은 절대 응답 바디에 포함 안 함)
    return NextResponse.json({
      success: data.success,
      statusMessage: data.statusMessage,
      statusNumber: data.statusNumber,
      user: {
        name: decoded.name,
        id: decoded.sub,
        role: decoded.role,
        storeId: decoded.storeId,
      },
    });
  } catch (error) {
    console.error('[Auth Login Route] Error:', error);
    return NextResponse.json(
      { success: false, statusMessage: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
