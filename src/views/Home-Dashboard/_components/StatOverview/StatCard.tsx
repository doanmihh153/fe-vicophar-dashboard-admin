/**
 * =============================================================================
 * FILE: StatCard.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Card hiển thị một số liệu thống kê trong StatOverview.
 *   Mỗi card là entry point để điều hướng đến trang chi tiết.
 *
 * INTERACTION (theo Design Constitution v1):
 *   - Hover: bg-muted/50, transition 150ms
 *   - Arrow indicator xuất hiện khi hover (opacity transition)
 *   - Không scale, không bounce, không shadow
 *
 * TYPOGRAPHY:
 *   - Label: text-sm (14px), muted-foreground
 *   - Value: text-3xl (30px), tabular-nums
 *   - Arrow: muted-foreground, transition opacity
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
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
// COMPONENT
// =============================================================================

/**
 * StatCard - Card thống kê đơn lẻ
 *
 * Layout:
 * ┌─────────────────────────────┐
 * │ Label (Tin tức)             │
 * │ 24                       →  │
 * └─────────────────────────────┘
 *
 * Hover: bg-muted/50, arrow xuất hiện
 */
export function StatCard({ stat, isLoading }: StatCardProps) {
  // Nếu loading, render skeleton
  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="mb-2 h-4 w-16 rounded-md" />
        <Skeleton className="h-8 w-12 rounded-md" />
      </div>
    );
  }

  return (
    <Link
      href={stat.href}
      className="group hover:bg-muted/50 block p-6 transition-colors duration-150"
    >
      {/* Label */}
      <span className="text-muted-foreground text-sm">{stat.label}</span>

      {/* Value + Arrow */}
      <div className="mt-1 flex items-baseline gap-2">
        {/* Số liệu - tabular-nums để căn đều */}
        <span className="text-3xl font-medium tabular-nums">{stat.value}</span>

        {/* Arrow indicator - chỉ hiện khi hover */}
        <span className="text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          →
        </span>
      </div>
    </Link>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default StatCard;
