/**
 * 로그인 폼 (SignInForm) 컴포넌트 테스트
 * Tests for the SignInForm component
 *
 * [보안 변경 반영]
 * - jwt-decode, js-cookie 더 이상 클라이언트에서 사용 안 함
 * - useLogin이 Next.js /api/auth/login 라우트를 fetch로 호출
 * - 성공 응답에 user 정보가 포함됨 (토큰 미포함)
 *
 * 테스트 대상:
 * - 폼 렌더링 (Form rendering)
 * - 입력값 유효성에 따른 버튼 활성화 (Button enable/disable based on input validation)
 * - 비밀번호 토글 (Password visibility toggle)
 * - 로그인 API 호출 (Login API mutation call)
 * - 성공/실패 처리 + Zustand 스토어 업데이트 (Success/error handling)
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockMutate = jest.fn();
jest.mock('@/api/adminUser', () => ({
  useLogin: jest.fn((options) => ({
    mutate: mockMutate,
  })),
}));

const mockSetLogInUser = jest.fn();
jest.mock('@/stores/useLogInUser', () => ({
  useLogInUser: jest.fn(() => ({
    logInUser: { name: '', id: '', role: 'STAFF' },
    setLogInUser: mockSetLogInUser,
    deleteLogInUser: jest.fn(),
  })),
}));

import SignInForm from '@/app/(beforeLogin)/sign-in/components/sign-in-form';
import { toast } from 'sonner';

describe('SignInForm 컴포넌트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled();
  });

  it('아이디 3자 미만이면 버튼이 비활성화 상태를 유지한다 | button stays disabled when id < 3 chars', async () => {
    const user = userEvent.setup();
    render(<SignInForm />);
    await user.type(screen.getByLabelText('아이디'), 'ab');
    await user.type(screen.getByLabelText('비밀번호'), 'password123');
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled();
    });
  });

  it('비밀번호 3자 이하이면 버튼이 비활성화 상태를 유지한다 | button stays disabled when password <= 3 chars', async () => {
    const user = userEvent.setup();
    render(<SignInForm />);
    await user.type(screen.getByLabelText('아이디'), 'admin');
    await user.type(screen.getByLabelText('비밀번호'), 'pwd');
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled();
    });
  });

  it('아이디 3자+, 비밀번호 4자+ 입력 시 버튼이 활성화된다 | button enabled when id >= 3 and password > 3', async () => {
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

    const passwordWrapper = passwordInput.closest('div');
    const toggleButton = passwordWrapper?.querySelector('svg');
    expect(toggleButton).not.toBeNull();
    if (toggleButton) await user.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByLabelText('비밀번호')).toHaveAttribute('type', 'text');
    });
  });

  it('로그인 버튼 클릭 시 useLogin mutate가 올바른 payload로 호출된다 | useLogin mutate called with correct payload', async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText('아이디'), 'admin123');
    await user.type(screen.getByLabelText('비밀번호'), 'password123');
    await waitFor(() => expect(screen.getByRole('button', { name: '로그인' })).not.toBeDisabled());

    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(mockMutate).toHaveBeenCalledWith({
      logInId: 'admin123',
      password: 'password123',
    });
  });

  it('로그인 성공 시 Zustand 스토어에 user 정보가 저장되고 홈으로 이동한다 | on success: store user info and redirect home', async () => {
    // 성공 콜백이 즉시 실행되도록 mock 구성
    jest.requireMock('@/api/adminUser').useLogin.mockImplementation((options: any) => {
      options.onSuccess({
        success: true,
        statusMessage: '로그인 성공',
        statusNumber: 200,
        data: null,
        user: { name: '홍길동', id: 'hong', role: 'MANAGER', storeId: 1 },
      });
      return { mutate: jest.fn() };
    });

    render(<SignInForm />);

    await waitFor(() => {
      // user info가 토큰 없이 Zustand에 저장됨 (httpOnly 쿠키 방식)
      expect(mockSetLogInUser).toHaveBeenCalledWith({
        name: '홍길동',
        id: 'hong',
        role: 'MANAGER',
      });
      expect(toast.success).toHaveBeenCalledWith('로그인 성공');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('로그인 실패 시 에러 토스트가 표시된다 | error toast shown on login failure', async () => {
    jest.requireMock('@/api/adminUser').useLogin.mockImplementation((options: any) => {
      options.onError({
        response: { data: { statusMessage: '비밀번호가 일치하지 않습니다.' } },
      });
      return { mutate: jest.fn() };
    });

    render(<SignInForm />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('비밀번호가 일치하지 않습니다.');
    });
  });
});
