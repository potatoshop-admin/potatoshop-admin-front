/**
 * Next.js Middleware — 인증 라우팅 보호
 *
 * httpOnly 쿠키를 읽어 인증 여부를 판단합니다.
 * - 미인증 사용자 → /sign-in 리다이렉트
 * - 이미 인증된 사용자가 로그인 페이지 접근 → 홈으로 리다이렉트
 * - API 경로와 정적 파일은 그대로 통과
 */
import { NextRequest, NextResponse } from 'next/server';

// basePath: /fashion-admin
const BASE_PATH = '/fashion-admin';

// 인증 없이 접근 가능한 경로 (basePath 제외한 상대 경로)
const PUBLIC_PATHS = ['/sign-in', '/create/sign-up', '/create/store'];

// 미들웨어를 적용하지 않을 경로
const SKIP_PATHS = [
  '/api/', // Next.js API 라우트 (개발 환경 호환)
  '/napi/', // Next.js 내부 API (proxy, auth) — Spring /api/ 충돌 방지용 경로
  '/_next/', // Next.js 내부 파일
  '/favicon.ico',
  '/fonts/',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 스킵 경로 확인 (basePath 포함)
  const pathWithoutBase = pathname.replace(BASE_PATH, '') || '/';

  const shouldSkip = SKIP_PATHS.some((skip) => pathWithoutBase.startsWith(skip));
  if (shouldSkip) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  const isPublicPath = PUBLIC_PATHS.some((p) => pathWithoutBase.startsWith(p));

  // 인증 안 됨 + 보호 경로 → 로그인으로
  if (!token && !isPublicPath) {
    const signInUrl = new URL(`${BASE_PATH}/sign-in`, request.url);
    return NextResponse.redirect(signInUrl);
  }

  // 인증 됨 + 공개 경로(로그인/회원가입) 접근 → 홈으로
  if (token && isPublicPath) {
    const homeUrl = new URL(BASE_PATH, request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  // basePath 포함 모든 경로에 적용 (이미지, 폰트 제외)
  matcher: ['/fashion-admin/((?!_next/static|_next/image|favicon.ico).*)'],
};
