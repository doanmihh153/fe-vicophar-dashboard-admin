/**
 * =============================================================================
 * FILE: TrafficOverview/index.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Section hiển thị Level 1: Tổng quan sức khỏe hệ thống ("Vital Signs").
 *   Layout:
 *    [ Metrics Grid ] (4 cols)
 *    [ Charts Row   ] -> [ Trend Line Chart (2/3) ] + [ Traffic Source (1/3) ]
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import { TrafficLineChart } from './TrafficLineChart';
import { MetricItem } from './components/MetricItem/MetricItem';
import { TrafficSource } from './components/TrafficSource/TrafficSource';
import type { GAPerformanceData } from '../../../../../_data';
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
// MAIN COMPONENT
// =============================================================================

export function TrafficOverview({ data, isLoading }: TrafficOverviewProps) {
  const { overview, trafficTrend, trafficSource } = data || {};

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

      {/* 2. Analytics Row (Trend + Source) */}
      <div className="border-border/40 border-t pt-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT: Traffic Trend Chart (2/3) */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                Xu hướng truy cập (7 ngày)
              </h3>
              {/* Legend */}
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <div className="h-2 w-2 rounded-full bg-[#0fb9b1]"></div>
                <span>Page Views</span>
              </div>
            </div>

            {isLoading ? (
              <Skeleton className="h-[220px] w-full rounded-xl" />
            ) : (
              <div className="h-[220px] w-full">
                <TrafficLineChart
                  data={trafficTrend?.values ?? []}
                  labels={trafficTrend?.labels ?? []}
                  height={220}
                  color="#0fb9b1"
                />
              </div>
            )}
          </div>

          {/* RIGHT: Traffic Source (1/3) */}
          <div className="border-border/40 pt-8 lg:border-l lg:pt-0 lg:pl-8">
            <TrafficSource data={trafficSource} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
