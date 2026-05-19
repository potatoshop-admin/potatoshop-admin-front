/**
 * 스토어 등록 (Store) 컴포넌트 테스트
 * Tests for the Store creation component
 *
 * 테스트 대상:
 * - 폼 렌더링 (Form rendering)
 * - 스토어 명 입력 및 API 호출 (Store name input and API call)
 * - 성공 후 라우팅 (Routing after success)
 * - 실패 시 에러 토스트 (Error toast on failure)
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockMutateStore = jest.fn();
jest.mock('@/api/stores', () => ({
  usePostStores: jest.fn((options) => ({
    mutate: mockMutateStore,
  })),
}));

jest.mock('@/app/(afterLogin)/components/subtabs/row-form', () => ({
  RowInput: ({ label, value, onChange, placeholder }: any) => (
    <div>
      <label>{label}</label>
      <input
        aria-label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  ),
}));

import StorePage from '@/app/(beforeLogin)/create/store/page';
import { toast } from 'sonner';

describe('Store (스토어 등록) 컴포넌트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('스토어 등록 폼이 올바르게 렌더링된다 | store registration form renders correctly', () => {
    render(<StorePage />);

    expect(screen.getByLabelText('스토어 명')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '스토어 생성' })).toBeInTheDocument();
  });

  it('스토어 명 입력 후 생성 버튼 클릭 시 API가 호출된다 | API called with store name on submit', async () => {
    const user = userEvent.setup();
    render(<StorePage />);

    await user.type(screen.getByLabelText('스토어 명'), '강남 플래그십');
    await user.click(screen.getByRole('button', { name: '스토어 생성' }));

    expect(mockMutateStore).toHaveBeenCalledWith({
      storeName: '강남 플래그십',
    });
  });

  it('스토어 명이 비어있어도 API가 호출된다 (서버에서 유효성 검사) | API called even with empty name (server validates)', async () => {
    const user = userEvent.setup();
    render(<StorePage />);

    await user.click(screen.getByRole('button', { name: '스토어 생성' }));

    expect(mockMutateStore).toHaveBeenCalledWith({
      storeName: '',
    });
  });

  it('스토어 생성 성공 시 로그인 페이지로 이동한다 | redirects to sign-in on success', async () => {
    const mockPush = jest.fn();
    jest.requireMock('next/navigation').useRouter.mockReturnValue({ push: mockPush });

    jest.requireMock('@/api/stores').usePostStores.mockImplementation((options: any) => {
      options.onSuccess({ statusMessage: '스토어가 생성되었습니다' });
      return { mutate: jest.fn() };
    });

    render(<StorePage />);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('스토어가 생성되었습니다');
      expect(mockPush).toHaveBeenCalledWith('/sign-in');
    });
  });

  it('스토어 생성 실패 시 에러 토스트가 표시된다 | error toast shown on failure', async () => {
    jest.requireMock('@/api/stores').usePostStores.mockImplementation((options: any) => {
      options.onError({ response: { data: { statusMessage: '이미 존재하는 스토어명입니다' } } });
      return { mutate: jest.fn() };
    });

    render(<StorePage />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('이미 존재하는 스토어명입니다');
    });
  });
});
