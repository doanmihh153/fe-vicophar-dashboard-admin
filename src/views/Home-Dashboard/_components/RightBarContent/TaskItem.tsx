import React from 'react';
import {
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatShortDate } from '../../_utils';
import type { DraggableItem } from '../../_data';

export function TaskItem({
  item,
  onClick,
}: {
  item: DraggableItem;
  onClick?: (item: DraggableItem) => void;
}) {
  // --- Theme Logic ---
  const getTheme = () => {
    switch (item.priority) {
      case 'high':
        return {
          bg: 'bg-red-400 dark:bg-red-700',
          icon: AlertCircle,
        };
      case 'medium':
        return {
          bg: 'bg-blue-400 dark:bg-blue-700',
          icon: Clock,
        };
      case 'low':
      default:
        return {
          bg: 'bg-green-400 dark:bg-green-700',
          icon: CheckCircle2,
        };
    }
  };

  const theme = getTheme();
  const Icon = theme.icon;

  return (
    <button
      onClick={() => onClick?.(item)}
      className={cn(
        'group relative flex w-full flex-col justify-between overflow-hidden rounded-2xl p-4 text-left transition-all duration-300',
        'min-h-[140px]', // Fixed Minimum Height
        // 'hover:scale-[1.02] hover:shadow-lg',
        theme.bg
      )}
    >
      {/*
       * 1. DECORATIVE BACKGROUND
       * Icon to, mờ nhạt nằm background bên phải
       */}
      <div className="absolute -right-4 -bottom-4 rotate-[-15deg] opacity-20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-0">
        <Icon className="h-24 w-24 text-white" />
      </div>

      {/*
       * 2. CONTENT
       */}
      <div className="relative z-10 flex h-full flex-col justify-between gap-3 text-white">
        {/* Top: Priority Badge (Coupon Code Style) */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 backdrop-blur-md">
            <span className="text-xs font-bold tracking-wider uppercase">
              {item.priority} Priority
            </span>
          </div>
          {/* Action Icon */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        {/* Middle: Title */}
        <div>
          <h4 className="font-display line-clamp-2 text-base">{item.title}</h4>
        </div>

        {/* Bottom: Date */}
        <div className="mt-1 flex items-center gap-2 opacity-90">
          <Calendar className="h-3 w-3" />
          <span className="text-sm font-medium">
            Deadline:{' '}
            <span className="font-bold">{formatShortDate(item.date)}</span>
          </span>
        </div>
      </div>

      {/* SHINE EFFECT on Hover */}
      <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </button>
  );
}
