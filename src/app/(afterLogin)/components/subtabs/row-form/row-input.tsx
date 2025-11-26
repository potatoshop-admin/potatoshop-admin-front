import React, { ChangeEvent } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface RowInputProps {
  label: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  inputAssist?: string;
  placeholder: string;
}

const RowInput: React.FC<RowInputProps> = ({
  label,
  value,
  onChange,
  type,
  className,
  inputAssist,
  placeholder,
}) => {
  return (
    <div className="w-full h-fit border-b border-gray-200 pb-1 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4">
      <p className="font-16-medium text-gray-600 w-40 whitespace-nowrap">{label}</p>
      <div className="w-fit flex space-x-2 items-center">
        <Input
          className={cn('w-full font-14-bold text-gray-900 p-2', className)}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={onChange}
        />
        <p>{inputAssist}</p>
      </div>
    </div>
  );
};

export default React.memo(RowInput);
