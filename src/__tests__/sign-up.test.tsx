/**
 * 회원가입 (SignUp) 컴포넌트 테스트
 * Tests for the SignUp (admin user registration) component
 *
 * 테스트 대상:
 * - 폼 렌더링 (Form rendering)
 * - 스토어 목록 로드 및 셀렉트 옵션 구성 (Store list loading and select options)
 * - 회원가입 API 호출 (Sign-up API call)
 * - 성공/실패 처리 및 라우팅 (Success/error handling and routing)
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
    info: jest.fn(),
  },
}));

const mockMutateAdminUser = jest.fn();
jest.mock('@/api/adminUser', () => ({
  usePostAdminUsers: jest.fn((options) => ({
    mutate: mockMutateAdminUser,
  })),
}));

const mockStoresData = {
  statusMessage: '스토어 목록 조회 성공',
  data: [
    { storeId: 1, storeName: '서울 스토어' },
    { storeId: 2, storeName: '부산 스토어' },
  ],
};

jest.mock('@/api/stores', () => ({
  useGetStores: jest.fn(() => ({
    data: mockStoresData,
  })),
}));

// Radix UI Select mock (headless 렌더링 이슈 방지)
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
  RowSelect: ({ label, options, value, onChange, placeholder }: any) => (
    <div>
      <label>{label}</label>
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

import SignUp from '@/app/(beforeLogin)/create/sign-up/page';
import { toast } from 'sonner';

describe('SignUp (회원가입) 컴포넌트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('회원가입 폼이 올바르게 렌더링된다 | sign-up form renders correctly', () => {
    render(<SignUp />);

    expect(screen.getByLabelText('스토어')).toBeInTheDocument();
    expect(screen.getByLabelText('이름')).toBeInTheDocument();
    expect(screen.getByLabelText('아이디')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '아이디 생성' })).toBeInTheDocument();
  });

  it('스토어 목록이 셀렉트 옵션으로 표시된다 | store list is shown as select options', async () => {
    render(<SignUp />);

    await waitFor(() => {
      expect(screen.getByText('서울 스토어')).toBeInTheDocument();
      expect(screen.getByText('부산 스토어')).toBeInTheDocument();
    });
  });

  it('스토어 목록 로드 시 성공 토스트가 표시된다 | success toast shown on store data load', async () => {
    render(<SignUp />);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('스토어 목록 조회 성공');
    });
  });

  it('모든 필드 입력 후 제출 시 usePostAdminUsers mutate가 올바른 payload로 호출된다 | mutate called with correct payload', async () => {
    const user = userEvent.setup();
    render(<SignUp />);

    await user.selectOptions(screen.getByLabelText('스토어'), '1');
    await user.type(screen.getByLabelText('이름'), '홍길동');
    await user.type(screen.getByLabelText('아이디'), 'hong123');
    await user.type(screen.getByLabelText('비밀번호'), 'pass1234');

    await user.click(screen.getByRole('button', { name: '아이디 생성' }));

    expect(mockMutateAdminUser).toHaveBeenCalledWith({
      name: '홍길동',
      storeId: 1,
      logInId: 'hong123',
      password: 'pass1234',
    });
  });

  it('회원가입 성공 시 로그인 페이지로 이동한다 | redirects to sign-in page on success', async () => {
    const mockPush = jest.fn();
    jest.requireMock('next/navigation').useRouter.mockReturnValue({ push: mockPush });

    jest.requireMock('@/api/adminUser').usePostAdminUsers.mockImplementation((options: any) => {
      options.onSuccess({ statusMessage: '가입 성공' });
      return { mutate: jest.fn() };
    });

    render(<SignUp />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/sign-in');
    });
  });
});
