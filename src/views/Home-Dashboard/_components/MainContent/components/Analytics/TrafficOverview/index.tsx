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

/**
 * MetricItem: Một ô chỉ số đơn giản, clean
 */
function MetricItem({
  label,
  value,
  trend,
  percent,
  unit,
  isLoading,
}: {
  label: string;
  value?: string | number;
  trend?: 'up' | 'down' | 'stable';
  percent?: number;
  unit?: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-24" />
      </div>
    );
  }

  // Color logic cho trend
  const trendColor =
    trend === 'up'
      ? 'text-emerald-600 dark:text-emerald-400'
      : trend === 'down'
        ? 'text-rose-600 dark:text-rose-400'
        : 'text-muted-foreground';

  const trendIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';

  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-foreground text-2xl font-semibold tracking-tight tabular-nums lg:text-3xl">
          {value}
          {unit && (
            <span className="text-muted-foreground ml-1 text-sm font-normal">
              {unit}
            </span>
          )}
        </span>
      </div>
      {/* Trend Row */}
      {trend && (
        <div
          className={cn(
            'mt-1 flex items-center gap-1 text-xs font-semibold',
            trendColor
          )}
        >
          <span>{trendIcon}</span>
          {percent !== undefined && <span>{Math.abs(percent)}%</span>}
        </div>
      )}
    </div>
  );
}

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
