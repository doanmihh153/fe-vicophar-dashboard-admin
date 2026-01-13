/**
 * =============================================================================
 * FILE: StatCard.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Card hiển thị một số liệu thống kê với icon colorful.
 *   Inspired by: Donezo Dashboard với colored stat cards.
 *
 * LAYOUT (theo reference):
 *   ┌─────────────────────────────┐
 *   │  [Icon]                  →  │
 *   │                             │
 *   │  24                         │
 *   │  Tin tức                    │
 *   │  ↑ Increased from last...  │
 *   └─────────────────────────────┘
 *
 * FEATURES:
 *   - Icon với màu sắc khác nhau cho từng type
 *   - Rounded corner background (dashboard-section)
 *   - Hover effect subtle
 *   - Trend indicator
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Newspaper, FileText, Package, FileEdit } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import type { StatItem } from '../../_data';

// =============================================================================
// TYPES
// =============================================================================

interface StatCardProps {
  /** Dữ liệu stat item */
  stat: StatItem;
  /** Trạng thái loading */
  isLoading: boolean;
}

// =============================================================================
// ICON CONFIG
// =============================================================================

/**
 * Map icon và colors theo stat id
 * Inspired by reference: mỗi card có accent color riêng
 */
const STAT_ICONS: Record<
  string,
  {
    Icon: React.ComponentType<{ className?: string }>;
    bgClass: string;
    iconClass: string;
  }
> = {
  news: {
    Icon: Newspaper,
    bgClass: 'bg-teal-100 dark:bg-teal-900/30',
    iconClass: 'text-teal-600 dark:text-teal-400',
  },
  articles: {
    Icon: FileText,
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    iconClass: 'text-blue-600 dark:text-blue-400',
  },
  products: {
    Icon: Package,
    bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
  },
  drafts: {
    Icon: FileEdit,
    bgClass: 'bg-amber-100 dark:bg-amber-900/30',
    iconClass: 'text-amber-600 dark:text-amber-400',
  },
};

// Default icon config
const DEFAULT_ICON = {
  Icon: FileText,
  bgClass: 'bg-muted',
  iconClass: 'text-muted-foreground',
};

// =============================================================================
// COMPONENT
// =============================================================================

export function StatCard({ stat, isLoading }: StatCardProps) {
  // Lấy icon config based on stat.id
  const iconConfig = STAT_ICONS[stat.id] || DEFAULT_ICON;
  const { Icon, bgClass, iconClass } = iconConfig;

  // Nếu loading, render skeleton với card layout
  if (isLoading) {
    return (
      <div className="dashboard-section p-6">
        <div className="flex items-start justify-between">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <div className="mt-6">
          <Skeleton className="h-9 w-16 rounded-md" />
          <Skeleton className="mt-2 h-4 w-20 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <Link
      href={stat.href}
      className="dashboard-section group block p-6 transition-all duration-150 hover:scale-[1.02]"
    >
      {/* Row 1: Icon + Arrow */}
      <div className="flex items-start justify-between">
        {/* Icon with colored background */}
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${bgClass}`}
        >
          <Icon className={`h-5 w-5 ${iconClass}`} />
        </div>

        {/* Arrow indicator */}
        <span className="text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          ↗
        </span>
      </div>

      {/* Row 2: Value + Label */}
      <div className="mt-6">
        <span className="text-3xl font-semibold tabular-nums">
          {stat.value}
        </span>
        <span className="text-muted-foreground mt-1 block text-sm">
          {stat.label}
        </span>
      </div>

      {/* Row 3: Trend indicator (optional) */}
      <div className="mt-2">
        <span className="text-xs text-emerald-600 dark:text-emerald-400">
          ↑ Tăng so với tháng trước
        </span>
      </div>
    </Link>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default StatCard;
