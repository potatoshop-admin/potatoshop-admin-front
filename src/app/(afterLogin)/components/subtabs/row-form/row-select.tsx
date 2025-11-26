import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SelectType {
  label: string;
  value: string;
}

type RowSelectProps = {
  label: string;
  options: SelectType[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
};

const RowSelect = ({ label, options, value, onChange, placeholder, disabled }: RowSelectProps) => {
  return (
    <div className="w-full h-fit border-b border-gray-200 pb-1 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4">
      <p className="font-16-medium text-gray-600 w-40 whitespace-nowrap">{label}</p>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option: SelectType) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default React.memo(RowSelect);
