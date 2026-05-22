'use client';

/**
 * AuthHydrator
 *
 * 페이지 새로고침 시 Zustand의 logInUser 스토어를 재수화(hydration)합니다.
 *
 * 문제: Zustand는 메모리 상태이므로 새로고침 시 초기화됨
 * 해결: 마운트 시 /api/auth/me 호출 → httpOnly 쿠키의 JWT를 서버에서 디코딩
 *       → user info를 Zustand에 설정
 *
 * 인증 실패 시 middleware.ts가 이미 /sign-in으로 리다이렉트하므로
 * 여기서는 스토어 채우기만 담당합니다.
 */
import { useEffect } from 'react';
import { useLogInUser } from '@/stores/useLogInUser';
import { RoleType } from '@/types/adminUser';

interface MeResponse {
  success: boolean;
  user: {
    name: string;
    id: string;
    role: RoleType;
    storeId: number;
  } | null;
}

export default function AuthHydrator() {
  const { logInUser, setLogInUser } = useLogInUser();

  useEffect(() => {
    // 이미 스토어에 유저 정보가 있으면 재요청 불필요
    if (logInUser.name !== '') return;

    const hydrate = async () => {
      try {
        const res = await fetch('/fashion-admin/api/auth/me');
        if (!res.ok) return; // middleware가 이미 처리했으므로 여기서 별도 처리 불필요

        const data: MeResponse = await res.json();
        if (data.success && data.user) {
          setLogInUser({
            name: data.user.name,
            id: data.user.id,
            role: data.user.role,
          });
        }
      } catch {
        // 네트워크 오류는 무시 (미들웨어가 인증 보호)
      }
    };

    hydrate();
  }, []); // 마운트 1회만 실행

  return null; // UI 없음, 사이드 이펙트만
}
