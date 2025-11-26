import { ChangeEvent, useState } from 'react';

export interface UseInput {
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
  changeValue: (data: number | string) => void;
}

export const useInput = (
  initialValue: string | number,
  validator?: (value: string | number) => boolean
): UseInput => {
  const [value, setValue] = useState(initialValue);
  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const {
      target: { value },
    } = event;
    let willUpdate: boolean = true;
    if (typeof validator === 'function') {
      willUpdate = validator(value);
    }
    if (willUpdate) {
      setValue(value);
    }
  };

  const reset = () => setValue(initialValue);

  const changeValue = (data: number | string) => {
    setValue(data);
  };
  return { value, onChange, reset, changeValue };
};
