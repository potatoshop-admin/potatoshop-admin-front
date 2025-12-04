import axios from 'axios';
import Cookies from 'js-cookie';

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (토큰 붙이기)
apiInstance.interceptors.request.use((config) => {
  const token: string | undefined = Cookies.get('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// 응답 인터셉터 (에러 처리)
apiInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove('token');
      const loginErrorMessages: string[] = [
        '존재하지 않는 유저입니다.',
        '비밀번호가 일치하지 않습니다.',
      ];
      const statusMessage: string = err.response?.data.statusMessage;
      if (!loginErrorMessages.includes(statusMessage)) {
        // 토큰 만료 → 로그인 페이지로 보내기
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(err);
  }
);

export default apiInstance;
