import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'draft' | 'published';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold uppercase',
        status === 'published'
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
        className
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'
        )}
      />
      {status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
    </span>
  );
}
