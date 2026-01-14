import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

interface MetricItemProps {
  label: string;
  value?: string | number;
  trend?: 'up' | 'down' | 'stable';
  percent?: number;
  unit?: string;
  isLoading: boolean;
}

export function MetricItem({
  label,
  value,
  trend,
  percent,
  unit,
  isLoading,
}: MetricItemProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-24" />
      </div>
    );
  }

  // Color logic cho trend
  const trendColor =
    trend === 'up'
      ? 'text-emerald-600 dark:text-emerald-400'
      : trend === 'down'
        ? 'text-rose-600 dark:text-rose-400'
        : 'text-muted-foreground';

  const trendIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';

  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-foreground text-2xl font-semibold tracking-tight tabular-nums lg:text-3xl">
          {value}
          {unit && (
            <span className="text-muted-foreground ml-1 text-sm font-normal">
              {unit}
            </span>
          )}
        </span>
      </div>
      {/* Trend Row */}
      {trend && (
        <div
          className={cn(
            'mt-1 flex items-center gap-1 text-xs font-semibold',
            trendColor
          )}
        >
          <span>{trendIcon}</span>
          {percent !== undefined && <span>{Math.abs(percent)}%</span>}
        </div>
      )}
    </div>
  );
}
