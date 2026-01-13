/**
 * =============================================================================
 * FILE: StatOverview/index.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Section hiển thị tổng quan các số liệu thống kê.
 *   Grid 4 cột với cards có rounded corners và backgrounds.
 *
 * LAYOUT (inspired by reference):
 *   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
 *   │ [Icon]    ↗  │  │ [Icon]    ↗  │  │ [Icon]    ↗  │  │ [Icon]    ↗  │
 *   │              │  │              │  │              │  │              │
 *   │ 24           │  │ 156          │  │ 89           │  │ 12           │
 *   │ Tin tức      │  │ Bài viết     │  │ Sản phẩm     │  │ Bản nháp     │
 *   │ ↑ Tăng...    │  │ ↑ Tăng...    │  │ ↑ Tăng...    │  │ ↑ Giảm...    │
 *   └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import { StatCard } from './StatCard';
import { STAT_PLACEHOLDERS, type StatItem } from '../../_data';

// =============================================================================
// TYPES
// =============================================================================

interface StatOverviewProps {
  /** Danh sách stat items */
  stats?: StatItem[];
  /** Trạng thái loading */
  isLoading: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function StatOverview({ stats, isLoading }: StatOverviewProps) {
  // Dùng placeholders khi loading để giữ layout ổn định
  const displayStats = stats ?? STAT_PLACEHOLDERS;

  return (
    <section>
      {/* Grid container - responsive 4 → 2 → 1 cột */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((stat) => (
          <StatCard key={stat.id} stat={stat} isLoading={isLoading} />
        ))}
      </div>
    </section>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default StatOverview;
export { StatCard } from './StatCard';
