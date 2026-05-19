/**
 * useInput 커스텀 훅 단위 테스트
 * Unit tests for the useInput custom hook
 */
import { renderHook, act } from '@testing-library/react';
import { useInput } from '@/hooks/use-input';

describe('useInput hook', () => {
  it('초기값으로 올바르게 초기화된다 | initializes with the given initial value', () => {
    const { result } = renderHook(() => useInput('hello'));
    expect(result.current.value).toBe('hello');
  });

  it('숫자 초기값도 올바르게 초기화된다 | initializes with numeric initial value', () => {
    const { result } = renderHook(() => useInput(0));
    expect(result.current.value).toBe(0);
  });

  it('onChange 이벤트로 값이 변경된다 | value updates on onChange event', () => {
    const { result } = renderHook(() => useInput(''));
    act(() => {
      result.current.onChange({
        target: { value: 'new value' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.value).toBe('new value');
  });

  it('reset 호출 시 초기값으로 되돌아간다 | reset returns value to initial', () => {
    const { result } = renderHook(() => useInput('initial'));
    act(() => {
      result.current.onChange({
        target: { value: 'changed' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.value).toBe('changed');
    act(() => {
      result.current.reset();
    });
    expect(result.current.value).toBe('initial');
  });

  it('changeValue로 직접 값을 변경할 수 있다 | changeValue sets value directly', () => {
    const { result } = renderHook(() => useInput(''));
    act(() => {
      result.current.changeValue('direct');
    });
    expect(result.current.value).toBe('direct');
  });

  it('validator가 false 반환 시 값이 업데이트되지 않는다 | value not updated when validator returns false', () => {
    const numberOnlyValidator = (value: string | number) => /^\d*$/.test(String(value));
    const { result } = renderHook(() => useInput('', numberOnlyValidator));

    act(() => {
      result.current.onChange({
        target: { value: 'abc' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.value).toBe('');
  });

  it('validator가 true 반환 시 값이 업데이트된다 | value updated when validator returns true', () => {
    const numberOnlyValidator = (value: string | number) => /^\d*$/.test(String(value));
    const { result } = renderHook(() => useInput('', numberOnlyValidator));

    act(() => {
      result.current.onChange({
        target: { value: '123' },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.value).toBe('123');
  });
});
