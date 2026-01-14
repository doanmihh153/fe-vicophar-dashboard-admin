/**
 * =============================================================================
 * FILE: MainContent.tsx
 * =============================================================================
 * MÔ TẢ:
 *   Layout chính của Home Dashboard (Cột trái).
 *   Chứa: Header, Stats, Analytics, Recent Activities.
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import { HomeMainHeader } from './components/Header';
import { StatOverview } from './components/Stats';
import { AnalyticsOverview } from './components/Analytics';
import { RecentContent } from './components/RecentActivities';
import type { DashboardData } from '../../_data';

// =============================================================================
// TYPES
// =============================================================================

interface MainContentProps {
  data: DashboardData | null;
  isLoading: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function MainContent({ data, isLoading }: MainContentProps) {
  return (
    <div className="space-y-4 p-2">
      {/* 1. HEADER */}
      <HomeMainHeader userContext={data?.userContext} isLoading={isLoading} />

      {/* 2. STATS */}
      <StatOverview stats={data?.stats} isLoading={isLoading} />

      {/* 3. ANALYTICS */}
      <AnalyticsOverview
        gaPerformance={data?.gaPerformance}
        contentPerformance={data?.contentPerformance}
        isLoading={isLoading}
      />

      {/* 4. RECENT ACTIVITIES */}
      <RecentContent items={data?.recentContent} isLoading={isLoading} />
    </div>
  );
}
