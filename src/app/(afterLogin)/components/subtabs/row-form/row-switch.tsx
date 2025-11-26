import React from 'react';
import { Switch } from '@/components/ui/switch';
import { CheckedState } from '@radix-ui/react-checkbox';

interface RowSwitchProps {
  label: string;
  falseData: string;
  trueData: string;
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

const RowSwitch: React.FC<RowSwitchProps> = ({ label, falseData, trueData, state, setState }) => {
  const checkedChange = (v: CheckedState): void => {
    setState(v === true);
  };

  return (
    <div className="w-full h-fit border-b border-gray-200 pb-1 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4">
      <p className="font-16-medium text-gray-600 w-40 whitespace-nowrap">{label}</p>
      <div className="font-14-bold text-gray-900 w-fit space-x-2 flex items-center">
        <p>{falseData}</p>
        <Switch checked={state} onCheckedChange={checkedChange} />
        <p>{trueData}</p>
      </div>
    </div>
  );
};
export default React.memo(RowSwitch);
