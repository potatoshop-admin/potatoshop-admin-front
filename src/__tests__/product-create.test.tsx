/**
 * 상품 등록 (Product Create) 페이지 테스트
 * Tests for the product registration page
 *
 * 테스트 대상:
 * - 폼 렌더링 (Form rendering)
 * - 필수 항목 유효성 검사 토스트 (Required field validation toasts)
 * - 원가 > 정가 유효성 검사 (Cost > list price validation)
 * - 할인율 기반 판매가 자동 계산 (Auto-calculation of sale price from discount rate)
 * - 상품 등록 API 호출 (Product registration API call)
 * - 숫자만 허용하는 입력 검증 (Number-only input validation)
 */
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const mockMutateItem = jest.fn();
const mockMutateImage = jest.fn();
jest.mock('@/api/items', () => ({
  usePostItems: jest.fn((options) => ({ mutate: mockMutateItem })),
  usePostItemImages: jest.fn(() => ({ mutate: mockMutateImage })),
}));

jest.mock('@/constants', () => ({
  categoriesSelect: [
    { label: '상의', value: 'TOP' },
    { label: '하의', value: 'BOTTOM' },
  ],
  seasonsSelect: [
    { label: '봄/여름', value: 'SS' },
    { label: '가을/겨울', value: 'FW' },
  ],
}));

jest.mock('@/app/(afterLogin)/components/subtabs/row-form', () => ({
  RowInput: ({ label, value, onChange, placeholder, inputAssist }: any) => (
    <div>
      <label>{label}{inputAssist ? ` (${inputAssist})` : ''}</label>
      <input aria-label={label} value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  ),
  RowSelect: ({ label, options, value, onChange, placeholder }: any) => (
    <div>
      <label>{label}</label>
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder}</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  ),
  RowDisplay: ({ label, value, inputAssist }: any) => (
    <div>
      <label>{label}</label>
      <span data-testid="sale-price-display">{value}</span>
      {inputAssist && <span>{inputAssist}</span>}
    </div>
  ),
  RowDragAndDropImages: ({ label }: any) => (
    <div>
      <label>{label}</label>
      <input type="file" aria-label={label} />
    </div>
  ),
}));

import Create from '@/app/(afterLogin)/products-management/create/page';
import { toast } from 'sonner';

describe('Product Create (상품 등록) 페이지', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('상품 등록 폼이 올바르게 렌더링된다 | product registration form renders correctly', () => {
    render(<Create />);

    expect(screen.getByLabelText('상품 명')).toBeInTheDocument();
    expect(screen.getByLabelText('상품 설명')).toBeInTheDocument();
    expect(screen.getByLabelText('카테고리')).toBeInTheDocument();
    expect(screen.getByLabelText('시즌')).toBeInTheDocument();
    expect(screen.getByLabelText('원가')).toBeInTheDocument();
    expect(screen.getByLabelText('정가')).toBeInTheDocument();
    expect(screen.getByLabelText('할인율')).toBeInTheDocument();
    expect(screen.getByLabelText('재고')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '상품 등록' })).toBeInTheDocument();
  });

  it('상품명이 비어있을 때 경고 토스트가 표시된다 | info toast shown when title is empty', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Create />);

    await user.click(screen.getByRole('button', { name: '상품 등록' }));

    expect(toast.info).toHaveBeenCalledWith('상품 명을 입력해주세요.');
    expect(mockMutateItem).not.toHaveBeenCalled();
  });

  it('카테고리 미선택 시 경고 토스트가 표시된다 | info toast shown when category not selected', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Create />);

    await user.type(screen.getByLabelText('상품 명'), '테스트 상품');
    await user.click(screen.getByRole('button', { name: '상품 등록' }));

    expect(toast.info).toHaveBeenCalledWith('상품 카테고리를 선택해주세요.');
  });

  it('시즌 미선택 시 경고 토스트가 표시된다 | info toast shown when season not selected', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Create />);

    await user.type(screen.getByLabelText('상품 명'), '테스트 상품');
    await user.selectOptions(screen.getByLabelText('카테고리'), 'TOP');
    await user.click(screen.getByRole('button', { name: '상품 등록' }));

    expect(toast.info).toHaveBeenCalledWith('상품 시즌을 선택해주세요.');
  });

  it('원가가 정가보다 높으면 경고 토스트가 표시된다 | info toast when cost price is higher than list price', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Create />);

    await user.type(screen.getByLabelText('상품 명'), '테스트 상품');
    await user.selectOptions(screen.getByLabelText('카테고리'), 'TOP');
    await user.selectOptions(screen.getByLabelText('시즌'), 'SS');

    // 원가를 정가보다 높게 설정
    await user.clear(screen.getByLabelText('원가'));
    await user.type(screen.getByLabelText('원가'), '50000');
    await user.clear(screen.getByLabelText('정가'));
    await user.type(screen.getByLabelText('정가'), '30000');

    await user.click(screen.getByRole('button', { name: '상품 등록' }));

    expect(toast.info).toHaveBeenCalledWith('원가격보다 정가격이 낮게 기입되었습니다.');
  });

  it('재고가 0이면 경고 토스트가 표시된다 | info toast when stock is 0', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Create />);

    await user.type(screen.getByLabelText('상품 명'), '테스트 상품');
    await user.selectOptions(screen.getByLabelText('카테고리'), 'TOP');
    await user.selectOptions(screen.getByLabelText('시즌'), 'SS');
    // 재고는 기본값 '0'으로 유지

    await user.click(screen.getByRole('button', { name: '상품 등록' }));

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith('상품 재고량을 입력해주세요.');
    });
  });

  it('모든 유효한 값 입력 후 상품 등록 API가 올바른 payload로 호출된다 | API called with correct payload on valid submit', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Create />);

    await user.type(screen.getByLabelText('상품 명'), '여름 티셔츠');
    await user.type(screen.getByLabelText('상품 설명'), '시원한 여름용');
    await user.selectOptions(screen.getByLabelText('카테고리'), 'TOP');
    await user.selectOptions(screen.getByLabelText('시즌'), 'SS');

    await user.clear(screen.getByLabelText('원가'));
    await user.type(screen.getByLabelText('원가'), '10000');
    await user.clear(screen.getByLabelText('정가'));
    await user.type(screen.getByLabelText('정가'), '20000');
    await user.clear(screen.getByLabelText('할인율'));
    await user.type(screen.getByLabelText('할인율'), '10');
    await user.clear(screen.getByLabelText('재고'));
    await user.type(screen.getByLabelText('재고'), '100');

    // 판매가 계산 debounce (500ms) 대기
    act(() => {
      jest.advanceTimersByTime(600);
    });

    await user.click(screen.getByRole('button', { name: '상품 등록' }));

    expect(mockMutateItem).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '여름 티셔츠',
        description: '시원한 여름용',
        category: 'TOP',
        season: 'SS',
        costPrice: 10000,
        listPrice: 20000,
        discountRateBps: 10,
        stock: 100,
      })
    );
  });

  it('숫자가 아닌 값은 원가 입력란에 입력되지 않는다 | non-numeric input ignored in cost price field', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Create />);

    const costInput = screen.getByLabelText('원가');
    await user.type(costInput, 'abc');

    // validateData 함수가 문자열(알파벳)을 걸러내므로 값에 영문자가 없어야 함
    const value = (costInput as HTMLInputElement).value;
    expect(value).not.toMatch(/[a-zA-Z]/);
  });

  it('판매가가 정가 × (1 - 할인율/100) 로 자동 계산된다 | sale price auto-calculated as listPrice * (1 - rate/100)', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Create />);

    await user.clear(screen.getByLabelText('정가'));
    await user.type(screen.getByLabelText('정가'), '20000');
    await user.clear(screen.getByLabelText('할인율'));
    await user.type(screen.getByLabelText('할인율'), '20');

    act(() => {
      jest.advanceTimersByTime(600);
    });

    await waitFor(() => {
      const display = screen.getByTestId('sale-price-display');
      expect(display).toHaveTextContent('16000');
    });
  });
});
