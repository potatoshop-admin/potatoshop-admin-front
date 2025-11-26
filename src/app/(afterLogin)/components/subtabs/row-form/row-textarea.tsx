import React, { ChangeEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface RowTextareaSelectProps {
  label: string;
  value: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

const RowTextarea: React.FC<RowTextareaSelectProps> = ({ label, value, setState }) => {
  return (
    <div className="w-full h-fit border-b border-gray-200 pb-1 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2">
      <p className="font-16-medium text-gray-600 w-40 whitespace-nowrap">{label}</p>
      <div className="w-full flex-col space-y-4">
        <Textarea
          value={value}
          className="w-full"
          placeholder="Type your message here."
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            const value = e.target.value;
            setState(value);
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(RowTextarea);
