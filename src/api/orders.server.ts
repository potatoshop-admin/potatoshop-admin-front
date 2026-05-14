import 'server-only';
import { cookies } from 'next/headers';
import { OrderStatus } from '@/types/order';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * 서버 컴포넌트 / Route Handler / Server Action 에서 호출 가능한
 * 주문 목록 fetcher.
 *
 * - 클라이언트의 axios apiInstance 는 js-cookie + window 객체에 의존하므로 서버에서 사용 불가.
 * - 동일한 endpoint 와 응답 형태(`ApiResponseType<Order[]>`)를 유지해서
 *   client 의 useGetAllOrders 와 같은 queryKey 로 캐시를 공유한다.
 */
export async function getAllOrdersServer(params?: { orderStatus?: OrderStatus }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const search = new URLSearchParams();
  if (params?.orderStatus) {
    search.set('orderStatus', params.orderStatus);
  }
  const queryStr = search.toString();
  const url = `${API_URL}/orders${queryStr ? `?${queryStr}` : ''}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {}),
    },
    // 'orders' 태그를 붙여두면 revalidateTag('orders') 로 무효화 가능
    next: { tags: ['orders'], revalidate: 60 },
  });

  if (!res.ok) {
    // 401 등은 throw 하지 말고 빈 결과를 반환 → 클라이언트 측에서 useQuery 가 다시 시도,
    // axios 인터셉터가 sign-in 으로 리다이렉트 처리.
    if (res.status === 401) {
      return { data: [], statusCode: 401, statusMessage: 'Unauthorized' };
    }
    throw new Error(`Failed to fetch orders (${res.status})`);
  }

  return res.json();
}
