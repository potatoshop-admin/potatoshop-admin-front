import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export interface RowOption {
  value: string;
  label: string;
}

export interface DoubleSelectValue {
  a: string; // 첫번째 Select 값
  b: string; // 두번째 Select 값
}

interface RowSelectDoubleProps {
  label: string;
  optionsA?: RowOption[]; // 첫번째 Select 옵션 (없으면 빈 배열)
  optionsB?: RowOption[]; // 두번째 Select 옵션 (없으면 빈 배열)
  state: DoubleSelectValue[]; // 행 목록
  setState: React.Dispatch<React.SetStateAction<DoubleSelectValue[]>>;
  placeholderA?: string;
  placeholderB?: string;
}

const RowSelectDouble: React.FC<RowSelectDoubleProps> = ({
  label,
  optionsA = [],
  optionsB = [],
  state,
  setState,
  placeholderA = '값을 선택하세요',
  placeholderB = '값을 선택하세요',
}) => {
  const updateRow = (index: number, next: Partial<DoubleSelectValue>) => {
    setState((prev) => prev.map((row, i) => (i === index ? { ...row, ...next } : row)));
  };

  const addRow = () => setState((prev) => [...prev, { a: '', b: '' }]);
  const removeRow = (index: number) => setState((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="w-full h-fit border-b border-gray-200 pb-1 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4">
      <p className="font-16-medium text-gray-600 w-40 whitespace-nowrap">{label}</p>
      <div className="flex flex-col w-full space-y-2">
        {state.map((row, index) => (
          <div
            key={index}
            className="w-full flex items-center justify-start sm:justify-between space-x-2"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full ">
              <div className="w-full sm:w-fit flex items-start">
                <p className="font-14-medium text-gray-600 whitespace-nowrap">동승자 {index + 1}</p>
              </div>
              <Select value={row.a} onValueChange={(val) => updateRow(index, { a: val })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={placeholderA} />
                </SelectTrigger>
                <SelectContent>
                  {optionsA.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={row.b} onValueChange={(val) => updateRow(index, { b: val })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={placeholderB} />
                </SelectTrigger>
                <SelectContent>
                  {optionsB.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              onClick={() => removeRow(index)}
              variant="destructive"
              size="default"
              className="whitespace-nowrap cursor-pointer"
            >
              삭제
            </Button>
          </div>
        ))}
        <Button className="w-full" variant="outline" size="lg" onClick={addRow}>
          동승자 추가
        </Button>
      </div>
    </div>
  );
};
export default RowSelectDouble;
