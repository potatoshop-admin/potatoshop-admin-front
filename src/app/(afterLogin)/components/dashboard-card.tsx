import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCardProps {
  label: string;
  value: string;
  review?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ label, value, review }) => {
  return (
    <Card className="w-full h-30 borer-gray-50 truncate px-4 bg-transparent">
      <CardHeader className="mt-0">
        <CardDescription className="font-12-medium sm:text-[14px] text-gray-600">
          {label}
        </CardDescription>
        <CardTitle className="font-28-medium sm:text-[36px] text-gray-900">{value}</CardTitle>
      </CardHeader>
      <div className="h-4 flex items-center mt-3">
        {review && (
          <CardContent className="mt-0">
            <p className="font-12-medium text-gray-500 overflow-hidden whitespace-nowrap">
              {review}
            </p>
          </CardContent>
        )}
      </div>
    </Card>
  );
};
export default React.memo(DashboardCard);
