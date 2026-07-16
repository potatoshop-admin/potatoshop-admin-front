/**
 * Next.js API Proxy — /api/proxy/[...path]
 *
 * 역할:
 * - 클라이언트의 모든 백엔드 API 요청을 중계
 * - httpOnly 쿠키에서 JWT를 서버에서만 읽어 Authorization 헤더로 주입
 * - 클라이언트 JS는 토큰에 절대 접근 불가
 *
 * 지원: GET / POST / PATCH / PUT / DELETE (multipart 포함)
 */
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// BACKEND_URL은 Spring context-path까지 포함 (SERVER_PATH=/fashion-admin/api)
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080/fashion-admin/api';

async function handler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  // 쿼리 파라미터 전달
  const searchParams = request.nextUrl.searchParams.toString();
  const targetUrl = `${BACKEND_URL}/${path.join('/')}${searchParams ? `?${searchParams}` : ''}`;

  // 포워딩할 헤더 구성
  // - Authorization: httpOnly 쿠키에서 읽은 토큰 주입
  // - Content-Type: multipart/form-data의 boundary 포함하여 그대로 전달
  // - 클라이언트가 보낸 Authorization은 무시 (보안상 서버 쿠키 우선)
  const forwardHeaders = new Headers();

  if (token) {
    forwardHeaders.set('Authorization', token);
  }

  const contentType = request.headers.get('content-type');
  if (contentType) {
    forwardHeaders.set('Content-Type', contentType);
  }

  const isBodyMethod = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);

  const fetchOptions: RequestInit = {
    method: request.method,
    headers: forwardHeaders,
  };

  // body 전달 (GET/HEAD/OPTIONS 제외)
  // arrayBuffer로 읽어서 전달 — 스트리밍 방식보다 안정적으로 multipart 전달 가능
  if (isBodyMethod) {
    const body = await request.arrayBuffer();
    if (body.byteLength > 0) {
      fetchOptions.body = body;
    }
  }

  try {
    const backendRes = await fetch(targetUrl, fetchOptions);

    // 응답 Content-Type에 따라 처리

    const resContentType = backendRes.headers.get('content-type') ?? '';

    if (resContentType.includes('application/json')) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    }

    // JSON이 아닌 응답 (binary 등)
    const body = await backendRes.arrayBuffer();
    return new NextResponse(body, {
      status: backendRes.status,
      headers: { 'Content-Type': resContentType },
    });
  } catch (error) {
    console.error(`[Proxy] ${request.method} ${targetUrl} 실패:`, error);
    return NextResponse.json(
      { success: false, statusMessage: '백엔드 서버 연결에 실패했습니다.' },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
