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

import React from 'react';
import type { GAPerformanceData, ContentPerformanceItem } from '../../_data';
import { TrafficOverview } from './TrafficOverview';
import { ContentPerformance } from './ContentPerformance';

// =============================================================================
// TYPES
// =============================================================================

interface AnalyticsOverviewProps {
  /** Dữ liệu Traffic Overview (GA4) */
  gaPerformance?: GAPerformanceData;
  /** Dữ liệu Content Performance (CMS) */
  contentPerformance?: ContentPerformanceItem[];
  /** Trạng thái loading */
  isLoading: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AnalyticsOverview({
  gaPerformance,
  contentPerformance,
  isLoading,
}: AnalyticsOverviewProps) {
  return (
    <section className="space-y-4">
      {/*
       * BLOCK 1: Traffic Overview (Level 1: Vital Signs)
       * Container riêng biệt
       */}
      <div className="dashboard-section bg-slate-50 p-6 dark:bg-slate-900">
        <h2 className="text-foreground font-display mb-6 text-2xl">
          Tổng quan bài viết (Vital Signs)
        </h2>
        <TrafficOverview data={gaPerformance} isLoading={isLoading} />
      </div>

      {/*
       * BLOCK 2: Content Performance (Level 2: What works?)
       * Container riêng biệt
       */}
      <div className="dashboard-section bg-indigo-50 p-6 dark:bg-indigo-900">
        <ContentPerformance items={contentPerformance} isLoading={isLoading} />
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
