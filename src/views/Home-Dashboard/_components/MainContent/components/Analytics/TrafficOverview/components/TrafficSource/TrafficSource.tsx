import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

interface TrafficSourceItem {
  label: string;
  value: number;
}

interface TrafficSourceProps {
  data?: TrafficSourceItem[];
  isLoading: boolean;
}

const SOURCE_COLORS = [
  '#10b981', // Organic: Emerald-500
  '#3b82f6', // Direct: Blue-500
  '#f59e0b', // Social: Amber-500
  '#8b5cf6', // Referral: Violet-500
];

export function TrafficSource({ data, isLoading }: TrafficSourceProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-32" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-3 w-3 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 uppercase">
        Nguồn Truy cập
      </h3>
      <div className="space-y-5">
        {data?.map((item, index) => {
          // Assign color based on index (cyclic)
          const color = SOURCE_COLORS[index % SOURCE_COLORS.length];

          return (
            <div key={item.label} className="group">
              <div className="mb-1 flex justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-200">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {item.label}
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {item.value}%
                </span>
              </div>
              {/* Progress Bar Background */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                {/* Actual Progress */}
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${item.value}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
