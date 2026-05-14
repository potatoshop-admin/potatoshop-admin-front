import 'server-only';
import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

/**
 * 서버 컴포넌트에서 prefetch 용도로 사용하는 일회성 QueryClient.
 *
 * React 의 `cache` 로 감싸 같은 요청(request) 안에서는 단일 인스턴스를 공유하지만,
 * 다른 요청 사이에는 공유되지 않습니다. 클라이언트 측 QueryClient 와 분리되어 있어
 * 메모리 누수나 사용자간 데이터 누출을 막아줍니다.
 */
export const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          // dehydrate 가 미리 받은 데이터를 stale 로 간주하지 않도록 충분히 크게 설정
          staleTime: 60 * 1000,
        },
      },
    })
);
