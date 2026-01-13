/**
 * =============================================================================
 * FILE: AnalyticsOverview/index.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Section hiển thị thống kê analytics đơn giản.
 *   Chỉ mang tính signal, không phân tích sâu.
 *
 * HIỂN THỊ:
 *   - Lượt xem hôm nay + trend indicator
 *   - Top 3 nội dung được xem nhiều
 *
 * NGUYÊN TẮC (theo Design Constitution v1):
 *   - Analytics chỉ là signal cho Home Dashboard
 *   - Không filter phức tạp
 *   - Không chart
 *   - Trend indicator dùng text color (emerald/rose)
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
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
// COMPONENT
// =============================================================================

/**
 * AnalyticsOverview - Section thống kê analytics
 *
 * Layout:
 * ┌─────────────────────────────────────┐
 * │ ANALYTICS                           │
 * ├─────────────────────────────────────┤
 * │ Lượt xem hôm nay                    │
 * │ 1.247                          ↑12% │
 * ├─────────────────────────────────────┤
 * │ Nội dung hot                        │
 * │ Trang chủ                       523 │
 * │ Sản phẩm Vitamin                234 │
 * │ Tin tức công ty                 189 │
 * └─────────────────────────────────────┘
 */
export function AnalyticsOverview({
  analytics,
  isLoading,
}: AnalyticsOverviewProps) {
  return (
    <section className="opacity-80">
      {/*
       * Section Header - nhỏ nhất, uppercase
       * Analytics là signal, không phải focus chính
       */}
      <h2 className="text-muted-foreground/60 mb-6 text-[10px] font-medium tracking-widest uppercase">
        Thống kê
      </h2>

      <div className="space-y-6">
        {/*
         * ====================================
         * Lượt xem hôm nay
         * ====================================
         */}
        <div>
          <span className="text-muted-foreground text-sm">
            Lượt xem hôm nay
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            {isLoading ? (
              <Skeleton className="h-8 w-16 rounded-md" />
            ) : (
              <>
                {/* Số liệu chính - nhỏ hơn StatCard */}
                <span className="text-2xl font-medium tabular-nums">
                  {formatNumber(analytics?.todayPageviews ?? 0)}
                </span>

                {/*
                 * Trend indicator
                 * Dùng text color theo Color Law:
                 * - Up: emerald
                 * - Down: rose
                 */}
                {analytics && (
                  <span
                    className={`text-sm ${
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
                        : '→'}{' '}
                    {analytics.trendPercent}%
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/*
         * ====================================
         * Top nội dung (Nội dung hot)
         * ====================================
         */}
        <div>
          <span className="text-muted-foreground/80 text-xs">Nội dung hot</span>
          <ul className="mt-2 space-y-1.5">
            {isLoading
              ? // Skeleton placeholders
                Array.from({ length: 3 }).map((_, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <Skeleton className="h-4 w-32 rounded-md" />
                    <Skeleton className="h-4 w-8 rounded-md" />
                  </li>
                ))
              : // Actual top content (giới hạn 3)
                analytics?.topContent.slice(0, 3).map((item, i) => (
                  <li key={i} className="flex justify-between text-xs">
                    {/* Title - truncate nếu dài */}
                    <span className="truncate opacity-90">{item.title}</span>
                    {/* Views count - tabular-nums */}
                    <span className="text-muted-foreground/70 tabular-nums">
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
