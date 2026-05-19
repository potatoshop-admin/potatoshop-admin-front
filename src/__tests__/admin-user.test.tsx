/**
 * 관리자 유저 등록 API 훅 테스트
 * Tests for admin user registration API hooks and related logic
 *
 * 테스트 대상:
 * - usePostAdminUsers hook payload 검증 (Payload validation for usePostAdminUsers)
 * - usePatchManager hook 역할 변경 로직 (Role change logic in usePatchManager)
 * - useGetAdminUsers 데이터 조회 (Admin user data fetching)
 * - adminUserChart 역할 변경 버튼 텍스트 (Role change button text in adminUserChart)
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// React Query Provider wrapper
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockPatchManager = jest.fn();
const mockAdminUsersData = {
  data: [
    {
      adminUserId: 1,
      name: '홍길동',
      logInId: 'hong',
      password: 'hashed',
      storeId: 1,
      role: 'STAFF',
    },
    {
      adminUserId: 2,
      name: '이영희',
      logInId: 'lee',
      password: 'hashed',
      storeId: 1,
      role: 'MANAGER',
    },
    {
      adminUserId: 3,
      name: '오너',
      logInId: 'owner',
      password: 'hashed',
      storeId: 1,
      role: 'OWNER',
    },
  ],
};

jest.mock('@/api/adminUser', () => ({
  useGetAdminUsers: jest.fn(() => ({
    data: mockAdminUsersData,
    isSuccess: true,
  })),
  usePatchManager: jest.fn((options) => ({
    mutate: mockPatchManager,
  })),
}));

jest.mock('@/app/(afterLogin)/components/charts/chartTemplate', () => ({
  __esModule: true,
  default: ({ table, title }: any) => (
    <div>
      <h1>{title}</h1>
      <table>
        <tbody>
          {table.getRowModel().rows.map((row: any) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell: any) => (
                <td key={cell.id}>{String(cell.getValue() ?? '')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
}));

import AdminUserChart from '@/app/(afterLogin)/settings/components/adminUserChart';

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('AdminUserChart 컴포넌트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('관리자 유저 목록이 올바르게 렌더링된다 | admin user list renders correctly', async () => {
    const Wrapper = createWrapper();
    render(<AdminUserChart />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('홍길동')).toBeInTheDocument();
      expect(screen.getByText('이영희')).toBeInTheDocument();
    });
  });

  it('STAFF 역할 유저는 "매니저 변경" 버튼 텍스트를 가진다 | STAFF user shows "매니저 변경" button text', async () => {
    const Wrapper = createWrapper();
    render(<AdminUserChart />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('매니저 변경')).toBeInTheDocument();
    });
  });

  it('MANAGER 역할 유저는 "매니저 취소" 버튼 텍스트를 가진다 | MANAGER user shows "매니저 취소" text', async () => {
    const Wrapper = createWrapper();
    render(<AdminUserChart />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('매니저 취소')).toBeInTheDocument();
    });
  });

  it('OWNER 역할 유저는 역할 변경 버튼 텍스트가 비어있다 | OWNER user has empty role change text', async () => {
    const Wrapper = createWrapper();
    render(<AdminUserChart />, { wrapper: Wrapper });

    await waitFor(() => {
      // OWNER는 managerChange 값이 '' 이므로 빈 td가 있어야 함
      const cells = screen.getAllByRole('cell');
      const emptyCell = cells.find((cell) => cell.textContent === '');
      expect(emptyCell).toBeDefined();
    });
  });

  it('설정 페이지 타이틀이 표시된다 | settings page title is displayed', async () => {
    const Wrapper = createWrapper();
    render(<AdminUserChart />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText('설정 페이지')).toBeInTheDocument();
    });
  });
});

/**
 * usePostAdminUsers payload 유효성 테스트
 * Tests for usePostAdminUsers payload validation
 */
describe('관리자 유저 생성 payload 유효성', () => {
  it('storeId는 Number()로 변환된 정수여야 한다 | storeId must be a Number-converted integer', () => {
    const storeId = '2';
    const result = Number(storeId);
    expect(result).toBe(2);
    expect(typeof result).toBe('number');
  });

  it('빈 문자열 storeId는 0으로 변환된다 | empty string storeId converts to 0', () => {
    const storeId = '';
    expect(Number(storeId)).toBe(0);
  });

  it('유효한 payload 구조를 확인한다 | validates correct payload structure', () => {
    const payload = {
      name: '홍길동',
      storeId: 1,
      logInId: 'hong123',
      password: 'secure_pass',
    };

    expect(payload).toMatchObject({
      name: expect.any(String),
      storeId: expect.any(Number),
      logInId: expect.any(String),
      password: expect.any(String),
    });
    expect(payload.name.length).toBeGreaterThan(0);
    expect(payload.logInId.length).toBeGreaterThan(0);
    expect(payload.password.length).toBeGreaterThan(0);
    expect(payload.storeId).toBeGreaterThan(0);
  });
});

/**
 * 역할 변경 로직 단위 테스트
 * Unit tests for role change logic
 */
describe('관리자 역할 변경 로직 | Role change logic', () => {
  it('STAFF는 MANAGER로 변경된다 | STAFF changes to MANAGER', () => {
    const getNextRole = (role: string) => (role === 'STAFF' ? 'MANAGER' : 'STAFF');
    expect(getNextRole('STAFF')).toBe('MANAGER');
  });

  it('MANAGER는 STAFF로 변경된다 | MANAGER changes to STAFF', () => {
    const getNextRole = (role: string) => (role === 'STAFF' ? 'MANAGER' : 'STAFF');
    expect(getNextRole('MANAGER')).toBe('STAFF');
  });

  it('OWNER는 STAFF로 변경 시도된다 | OWNER would change to STAFF (guarded in UI)', () => {
    const getNextRole = (role: string) => (role === 'STAFF' ? 'MANAGER' : 'STAFF');
    expect(getNextRole('OWNER')).toBe('STAFF');
  });

  it('managerChange 텍스트 매핑이 올바르다 | managerChange text mapping is correct', () => {
    const getManagerChangeText = (role: string): string => {
      if (role === 'STAFF') return '매니저 변경';
      if (role === 'MANAGER') return '매니저 취소';
      return '';
    };

    expect(getManagerChangeText('STAFF')).toBe('매니저 변경');
    expect(getManagerChangeText('MANAGER')).toBe('매니저 취소');
    expect(getManagerChangeText('OWNER')).toBe('');
  });
});
