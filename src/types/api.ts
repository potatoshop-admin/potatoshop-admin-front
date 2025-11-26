import { AxiosHeaders, AxiosRequestConfig } from 'axios';

export interface ApiResponseType<T> {
  success: boolean;
  data: T | null;
  statusMessage: string;
  statusNumber: number;
}

// 서버가 내려주는 표준 에러 응답 구조
export interface ApiErrorResponse {
  success: boolean;
  data: null;
  statusMessage: string;
  statusNumber: number;
}

// Axios 에러 전체 구조
export interface AxiosErrorResponse {
  message: string;
  name: 'AxiosError';
  code: string;
  config: AxiosRequestConfig;
  request?: XMLHttpRequest;
  response: {
    status: number;
    statusText: string;
    headers: AxiosHeaders;
    data: ApiErrorResponse;
    config: AxiosRequestConfig;
  };
  stack?: string;
}
