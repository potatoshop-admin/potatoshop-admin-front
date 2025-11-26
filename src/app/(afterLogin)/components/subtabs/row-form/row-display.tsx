import React from 'react';

interface RowDisplayProps {
  label: string;
  inputAssist?: string;
  value: string | number;
}

const RowDisplay: React.FC<RowDisplayProps> = ({ label, value, inputAssist }) => {
  return (
    <div className="w-full h-fit border-b border-gray-200 pb-1 flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <p className="font-16-medium text-gray-600 w-40 whitespace-nowrap">{label}</p>
      <div className="w-fit flex space-x-2 items-center font-14-bold text-gray-900">
        {value}
        <p className="font-14-medium pl-4">{inputAssist}</p>
      </div>
    </div>
  );
};

export default React.memo(RowDisplay);
