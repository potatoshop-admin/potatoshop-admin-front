import { useQuery } from '@tanstack/react-query';
import apiInstance from '@/api/apiInstance';

export const useGetDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await apiInstance.get('/dashboard');
      return data;
    },
    staleTime: 1000 * 60, // 1분 (대시보드는 최신성 중요)
    refetchInterval: 1000 * 60, // 1분마다 자동 갱신 (staleTime과 일치)
    refetchIntervalInBackground: false, // 탭 비활성 시 폴링 중단
  });
};
