import React from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';

interface NumberAdjusterProps {
  label: string;
  value: number;
  setState: React.Dispatch<React.SetStateAction<number>>;
}

const RowNumberAdjuster: React.FC<NumberAdjusterProps> = ({ label, value, setState }) => {
  const minusButton = () => {
    setState(value - 1);
  };
  const plusButton = () => {
    setState(value + 1);
  };
  return (
    <div className="w-full h-fit border-b border-gray-200 pb-1 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4">
      <p className="font-16-medium text-gray-600 w-40 whitespace-nowrap">{label}</p>
      <div className="font-14-bold text-gray-900  flex items-center space-x-2">
        <MinusIcon onClick={minusButton} className="cursor-pointer size-5" />
        <p className="w-2">{value}</p>
        <PlusIcon onClick={plusButton} className="cursor-pointer size-5" />
      </div>
    </div>
  );
};

export default React.memo(RowNumberAdjuster);
