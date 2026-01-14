/**
 * =============================================================================
 * FILE: TrafficOverview/index.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Section hiển thị Level 1: Tổng quan sức khỏe hệ thống ("Vital Signs").
 *   Layout: Vertical Stack [Metrics Grid] + [Trend Chart].
 *
 * LAYOUT:
 *   ┌──────────────────────────────────────────────┐
 *   │  Users    Sessions    Avg Time    Views      │
 *   │  1.2k     3.4k        2m 25s      12.4k      │
 *   │  ↑ 12%    ↑ 5%        --          ↓ 2%       │
 *   ├──────────────────────────────────────────────┤
 *   │                                              │
 *   │           [ Minimalist Line Chart ]          │
 *   │                                              │
 *   └──────────────────────────────────────────────┘
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import { TrafficLineChart } from './TrafficLineChart';
import { MetricItem } from './components/MetricItem/MetricItem';
import type { GAPerformanceData } from '../../../../../_data';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';

import { formatNumber } from '../../../../../_utils';

// =============================================================================
// TYPES
// =============================================================================

interface TrafficOverviewProps {
  data?: GAPerformanceData;
  isLoading: boolean;
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================
// Imported from ./components/MetricItem/MetricItem

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function TrafficOverview({ data, isLoading }: TrafficOverviewProps) {
  const { overview, trafficTrend } = data || {};

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Vital Signs Grid (4 cột) */}
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        <MetricItem
          label="Total Users"
          value={formatNumber(overview?.totalUsers.value ?? 0)}
          trend={overview?.totalUsers.trend}
          percent={overview?.totalUsers.percent}
          isLoading={isLoading}
        />
        <MetricItem
          label="Sessions"
          value={formatNumber(overview?.sessions.value ?? 0)}
          trend={overview?.sessions.trend}
          percent={overview?.sessions.percent}
          isLoading={isLoading}
        />
        <MetricItem
          label="Avg. Time"
          value={overview?.avgEngagementTime.value}
          unit={overview?.avgEngagementTime.unit}
          trend={overview?.avgEngagementTime.trend}
          isLoading={isLoading}
        />
        <MetricItem
          label="Page Views"
          value={formatNumber(overview?.pageViews.value ?? 0)}
          trend={overview?.pageViews.trend}
          percent={overview?.pageViews.percent}
          isLoading={isLoading}
        />
      </div>

      {/* 2. Traffic Trend Chart */}
      <div className="border-border/40 border-t pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-foreground text-sm font-medium">
            Traffic Trend (7 days)
          </h3>
          {/* Simple Legend */}
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <div className="h-2 w-2 rounded-full bg-[#0fb9b1]"></div>
            <span>Page Views</span>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-[200px] w-full rounded-xl" />
        ) : (
          <TrafficLineChart
            data={trafficTrend?.values ?? []}
            labels={trafficTrend?.labels ?? []}
            height={220}
            color="#0fb9b1" // Primary Chart Color
          />
        )}
      </div>
    </div>
  );
}
