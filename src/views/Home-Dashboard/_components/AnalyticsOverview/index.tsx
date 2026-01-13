/**
 * =============================================================================
 * FILE: AnalyticsOverview/index.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Section Analytics với full-width layout và visual charts.
 *   Theo reference images: Donezo & Crextio dashboards.
 *
 * LAYOUT (Inspired by references):
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  THỐNG KÊ TUẦN NÀY                                                      │
 *   │  ┌─────────────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
 *   │  │  Lượt xem              │  │  Tiến độ         │  │  Top nội dung  │  │
 *   │  │  [Bar Chart S-S]       │  │  [Donut 85%]     │  │  - Item 1      │  │
 *   │  │  1.247 views           │  │  Hoàn thành      │  │  - Item 2      │  │
 *   │  └─────────────────────────┘  └──────────────────┘  └────────────────┘  │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { WeeklyBarChart } from './WeeklyBarChart';
import { DonutChart } from './DonutChart';
import { formatNumber } from '../../_utils';
import type { AnalyticsData } from '../../_data';

// =============================================================================
// TYPES
// =============================================================================

interface AnalyticsOverviewProps {
  /** Dữ liệu analytics */
  analytics?: AnalyticsData;
  /** Trạng thái loading */
  isLoading: boolean;
}

// =============================================================================
// MOCK DATA cho Bar Chart (sẽ lấy từ API sau)
// =============================================================================

const WEEKLY_DATA = [
  { day: 'T2', value: 45, isHighlight: false },
  { day: 'T3', value: 62, isHighlight: false },
  { day: 'T4', value: 78, isHighlight: true }, // Hôm nay
  { day: 'T5', value: 55, isHighlight: false },
  { day: 'T6', value: 89, isHighlight: false },
  { day: 'T7', value: 42, isHighlight: false },
  { day: 'CN', value: 35, isHighlight: false },
];

// =============================================================================
// COMPONENT
// =============================================================================

export function AnalyticsOverview({
  analytics,
  isLoading,
}: AnalyticsOverviewProps) {
  // Progress percentage (mock - sẽ tính từ data thật)
  const progressPercent = 85;

  return (
    <section className="dashboard-section">
      {/* Section Header */}
      <h2 className="text-muted-foreground/70 mb-6 text-xs font-medium tracking-widest uppercase">
        Thống kê tuần này
      </h2>

      {/* Grid Layout: 3 columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/*
         * ====================================
         * Column 1: Lượt xem + Bar Chart
         * ====================================
         */}
        <div className="lg:col-span-1">
          <div className="mb-4">
            <span className="text-muted-foreground text-sm">Lượt xem</span>
            <div className="mt-1 flex items-baseline gap-2">
              {isLoading ? (
                <Skeleton className="h-8 w-20 rounded-md" />
              ) : (
                <>
                  <span className="text-3xl font-semibold tabular-nums">
                    {formatNumber(analytics?.todayPageviews ?? 0)}
                  </span>
                  {/* Trend indicator */}
                  {analytics && (
                    <span
                      className={`text-sm font-medium ${
                        analytics.trend === 'up'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : analytics.trend === 'down'
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-muted-foreground'
                      }`}
                    >
                      {analytics.trend === 'up'
                        ? '↑'
                        : analytics.trend === 'down'
                          ? '↓'
                          : '→'}
                      {analytics.trendPercent}%
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Weekly Bar Chart */}
          {isLoading ? (
            <Skeleton className="h-[120px] w-full rounded-md" />
          ) : (
            <WeeklyBarChart data={WEEKLY_DATA} height={120} />
          )}
        </div>

        {/*
         * ====================================
         * Column 2: Donut Chart - Tiến độ
         * ====================================
         */}
        <div className="flex flex-col items-center justify-center lg:col-span-1">
          <span className="text-muted-foreground mb-4 text-sm">
            Tiến độ tháng
          </span>
          {isLoading ? (
            <Skeleton className="h-[120px] w-[120px] rounded-full" />
          ) : (
            <DonutChart value={progressPercent} size={120} strokeWidth={10} />
          )}
          <span className="text-muted-foreground/70 mt-2 text-xs">
            Hoàn thành
          </span>
        </div>

        {/*
         * ====================================
         * Column 3: Top nội dung
         * ====================================
         */}
        <div className="lg:col-span-1">
          <span className="text-muted-foreground text-sm">Nội dung hot</span>
          <ul className="mt-4 space-y-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <li key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-4 w-8 rounded-md" />
                  </li>
                ))
              : analytics?.topContent.slice(0, 3).map((item, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Ranking indicator */}
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                          i === 0
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="max-w-[140px] truncate text-sm">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs tabular-nums">
                      {formatNumber(item.views)}
                    </span>
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default AnalyticsOverview;
export { WeeklyBarChart } from './WeeklyBarChart';
export { DonutChart } from './DonutChart';
