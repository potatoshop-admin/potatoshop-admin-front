/**
 * 로그인 폼 (SignInForm) 컴포넌트 테스트
 * Tests for the SignInForm component
 *
 * 테스트 대상:
 * - 폼 렌더링 (Form rendering)
 * - 입력값 유효성에 따른 버튼 활성화 (Button enable/disable based on input validation)
 * - 비밀번호 토글 (Password visibility toggle)
 * - 로그인 API 호출 (Login API mutation call)
 * - 성공/실패 처리 (Success/error handling)
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockPush = jest.fn();
const mockReplace = jest.fn();

// Next.js router mock
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// js-cookie mock
jest.mock('js-cookie', () => ({
  get: jest.fn(() => undefined),
  set: jest.fn(),
  remove: jest.fn(),
}));

// sonner toast mock
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// JWT decode mock
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(() => ({
    name: '테스트관리자',
    sub: 'admin001',
    role: 'MANAGER',
    storeId: 1,
    exp: 9999999999,
    iat: 1000000000,
  })),
}));

const mockMutate = jest.fn();
jest.mock('@/api/adminUser', () => ({
  useLogin: jest.fn((options) => ({
    mutate: mockMutate,
  })),
}));

const mockSetLogInUser = jest.fn();
const mockDeleteLogInUser = jest.fn();
jest.mock('@/stores/useLogInUser', () => ({
  useLogInUser: jest.fn(() => ({
    logInUser: { name: '', id: '', role: 'STAFF' },
    setLogInUser: mockSetLogInUser,
    deleteLogInUser: mockDeleteLogInUser,
  })),
}));

import SignInForm from '@/app/(beforeLogin)/sign-in/components/sign-in-form';
import Cookies from 'js-cookie';
import { toast } from 'sonner';

describe('SignInForm 컴포넌트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Cookies.get as jest.Mock).mockReturnValue(undefined);
    const { useRouter } = jest.requireMock('next/navigation');
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush, replace: mockReplace });
  });

  it('로그인 폼 요소들이 올바르게 렌더링된다 | login form elements render correctly', () => {
    render(<SignInForm />);

    expect(screen.getByLabelText('아이디')).toBeInTheDocument();
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
  });

  it('초기 상태에서 로그인 버튼이 비활성화 되어있다 | login button is disabled initially', () => {
    render(<SignInForm />);
    const button = screen.getByRole('button', { name: '로그인' });
    expect(button).toBeDisabled();
  });

  it('아이디가 3자 미만이면 버튼이 비활성화 상태를 유지한다 | button stays disabled when id is less than 3 chars', async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText('아이디'), 'ab');
    await user.type(screen.getByLabelText('비밀번호'), 'password123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled();
    });
  });

  it('비밀번호가 3자 이하이면 버튼이 비활성화 상태를 유지한다 | button stays disabled when password is 3 chars or less', async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText('아이디'), 'admin');
    await user.type(screen.getByLabelText('비밀번호'), 'pwd');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled();
    });
  });

  it('아이디 3자 이상, 비밀번호 4자 이상 입력 시 버튼이 활성화된다 | button enabled when id >= 3 and password > 3 chars', async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText('아이디'), 'admin');
    await user.type(screen.getByLabelText('비밀번호'), 'password');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '로그인' })).not.toBeDisabled();
    });
  });

  it('비밀번호 토글 클릭 시 비밀번호가 보이게 된다 | password becomes visible on toggle click', async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    const passwordInput = screen.getByLabelText('비밀번호');
    expect(passwordInput).toHaveAttribute('type', 'password');

    // 비밀번호 래퍼 안의 svg(아이콘) 클릭
    const passwordWrapper = passwordInput.closest('div');
    const toggleButton = passwordWrapper?.querySelector('svg');
    expect(toggleButton).not.toBeNull();
    if (toggleButton) {
      await user.click(toggleButton);
    }

    // type이 text로 바뀌었는지 확인
    await waitFor(() => {
      expect(screen.getByLabelText('비밀번호')).toHaveAttribute('type', 'text');
    });
  });

  it('로그인 버튼 클릭 시 useLogin mutate가 호출된다 | useLogin mutate is called on button click', async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText('아이디'), 'admin123');
    await user.type(screen.getByLabelText('비밀번호'), 'password123');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '로그인' })).not.toBeDisabled();
    });

    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(mockMutate).toHaveBeenCalledWith({
      logInId: 'admin123',
      password: 'password123',
    });
  });

  it('이미 토큰이 있으면 홈으로 리다이렉트 된다 | redirects to home if token already exists', async () => {
    (Cookies.get as jest.Mock).mockReturnValue('existing-token');

    render(<SignInForm />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/');
    });
  });
});
