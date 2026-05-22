'use client';

/**
 * React Query Provider + 글로벌 캐싱 전략
 *
 * [캐싱 전략]
 * - staleTime: 데이터가 "신선"하다고 간주하는 시간 → 이 시간 내엔 백그라운드 재요청 없음
 * - gcTime (구 cacheTime): 사용하지 않는 캐시가 메모리에서 삭제되는 시간
 * - retry: 실패 시 재시도 횟수 (기본 3 → 1로 줄여 빠른 에러 피드백)
 * - refetchOnWindowFocus: 탭 전환 시 재요청 (어드민은 false가 적합)
 *
 * 개별 쿼리에서 override 가능. 전역 기본값은 보수적으로 설정.
 */
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        /**
         * SSR hydration 시 즉시 재요청 방지
         * 어드민 데이터는 실시간 업데이트 필요성이 낮으므로 60초로 설정
         * - 주문 같은 휘발성 데이터는 개별 쿼리에서 단축 가능
         * - 설정, 스토어 정보 등 변경 빈도 낮은 데이터는 개별 쿼리에서 연장 가능
         */
        staleTime: 60 * 1000, // 60초

        /**
         * 사용하지 않는 캐시 유지 시간
         * 다른 페이지로 이동 후 돌아올 때 캐시 히트 가능
         */
        gcTime: 5 * 60 * 1000, // 5분

        /**
         * 어드민 패널은 탭 전환이 빈번하지 않고
         * 탭 전환 시 불필요한 요청이 UX 저하 가능
         */
        refetchOnWindowFocus: false,

        /**
         * 기본 3회 재시도 → 1회로 줄임
         * 이유: 에러(토큰 만료, 권한 오류 등) 발생 시 빠른 피드백 필요
         * 네트워크 불안정으로 인한 일시적 오류는 1회 재시도로 충분
         */
        retry: 1,

        /**
         * 재시도 딜레이: 지수 백오프 (1초, 2초 ...)
         * 기본값이지만 명시적으로 설정하여 의도를 드러냄
         */
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
      },
      mutations: {
        /**
         * mutation 실패 시 재시도 안 함 (중복 요청 방지)
         * 예: 주문 상태 변경을 두 번 시도하면 오류 발생 가능
         */
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
