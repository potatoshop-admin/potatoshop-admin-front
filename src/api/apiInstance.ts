/**
 * Axios 인스턴스 — 모든 API 요청을 Next.js Proxy 경유
 *
 * [보안 변경 사항]
 * - 이전: 클라이언트에서 js-cookie로 JWT를 직접 읽어 Authorization 헤더에 추가 (XSS 취약)
 * - 현재: 모든 요청이 /api/proxy를 통해 Next.js 서버로 전달됨
 *         Next.js 서버가 httpOnly 쿠키에서 JWT를 읽어 Authorization 헤더 주입
 *         클라이언트 JS는 토큰에 접근 불가
 *
 * basePath(/fashion-admin) + /api/proxy/[path] 로 라우팅됨
 */
import axios from 'axios';

// Next.js basePath(/fashion-admin)를 반영한 프록시 기본 URL
// 브라우저: window.location.origin 기준으로 프록시 경로 구성
// SSR(서버 컴포넌트에서 호출 시): NEXT_PUBLIC_APP_URL 사용
const PROXY_BASE_URL =
  typeof window !== 'undefined'
    ? `${window.location.origin}/fashion-admin/api/proxy`
    : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/fashion-admin/api/proxy`;

const apiInstance = axios.create({
  baseURL: PROXY_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
// 토큰은 프록시 서버(httpOnly 쿠키)에서 주입하므로 클라이언트에서 따로 처리 불필요
apiInstance.interceptors.request.use((config) => {
  return config;
});

// 응답 인터셉터 — 401 처리
// useLogin은 fetch를 직접 사용하므로 이 인터셉터를 통과하지 않음
// → apiInstance를 통과하는 401은 전부 토큰 만료/무효 상황
apiInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      // 토큰 만료 → 서버에서 httpOnly 쿠키 삭제 후 로그인 페이지로
      try {
        await fetch('/fashion-admin/api/auth/logout', { method: 'POST' });
      } catch {
        // logout 실패해도 리다이렉트 진행
      }
      window.location.href = '/fashion-admin/sign-in';
    }
    return Promise.reject(err);
  }
);

export default apiInstance;
