/**
 * =============================================================================
 * FILE: StatOverview/index.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Section hiển thị tổng quan các số liệu thống kê.
 *   Grid 4 cột trên desktop, 2 cột trên tablet, 1 cột trên mobile.
 *
 * LAYOUT:
 *   - Responsive: sm:grid-cols-2 lg:grid-cols-4
 *   - Gap: 16px (gap-4)
 *   - Section title: uppercase, tracking-wide, 12-14px
 *
 * NGUYÊN TẮC:
 *   - Không chứa business logic
 *   - Map data từ props xuống StatCard
 *   - Xử lý loading với skeleton placeholders
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

/**
 * StatOverview - Section tổng quan số liệu
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ TỔNG QUAN                                                               │
 * ├─────────────────┬─────────────────┬─────────────────┬─────────────────┤
 * │ Tin tức         │ Bài viết        │ Sản phẩm        │ Bản nháp        │
 * │ 24              │ 156             │ 89              │ 12              │
 * └─────────────────┴─────────────────┴─────────────────┴─────────────────┘
 */
export function StatOverview({ stats, isLoading }: StatOverviewProps) {
  // Dùng placeholders khi loading để giữ layout ổn định
  const displayStats = stats ?? STAT_PLACEHOLDERS;

  return (
    <section>
      {/* Section Title - theo Typography Law */}
      <h2 className="text-muted-foreground mb-4 text-sm font-medium tracking-wide uppercase">
        Tổng quan
      </h2>

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
