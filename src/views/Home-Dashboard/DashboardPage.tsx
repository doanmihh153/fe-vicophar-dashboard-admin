/**
 * =============================================================================
 * FILE: DashboardPage.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Container chính cho trang Home Dashboard.
 *   Smart Component - quản lý data flow và layout.
 *
 * LAYOUT (Phase 5 - Redesigned):
 *   ┌─────────────────────────────────────────────────────────────────────────┐
 *   │  Header (Welcome + Context Stats)                                       │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │  StatCards (Grid 4 cột với icons)                                       │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │  Analytics (Full-width với charts)                                      │
 *   ├─────────────────────────────────────────────────────────────────────────┤
 *   │  RecentContent (Cards)                                                  │
 *   └─────────────────────────────────────────────────────────────────────────┘
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import { RightPanelSlot } from '@/components/providers/RightPanelContext';
import { useDashboardData } from './_hooks';

// Import CSS riêng cho Dashboard
import './home-dashboard.css';

// Import tất cả components
import {
  HomeMainHeader,
  StatOverview,
  RecentContent,
  AnalyticsOverview,
  RightBarContent,
} from './_components';

// =============================================================================
// COMPONENT
// =============================================================================

export function DashboardHomePage() {
  // Fetch data từ hook
  const { data, isLoading } = useDashboardData();

  return (
    <>
      {/*
       * =====================================================
       * MAIN CONTENT AREA
       * =====================================================
       * Layout với section stacking rõ ràng
       * Mỗi section có background separation
       */}
      <div className="p-6 lg:p-8">
        <div className="space-y-8">
          {/*
           * ===============================================
           * ROW 1: Main Header (Welcome + Context Panel)
           * ===============================================
           */}
          <HomeMainHeader
            userContext={data?.userContext}
            isLoading={isLoading}
          />

          {/*
           * ===============================================
           * ROW 2: Stat Overview (Grid 4 cột với icons)
           * ===============================================
           * Mỗi card có rounded corners và background
           */}
          <StatOverview stats={data?.stats} isLoading={isLoading} />

          {/*
           * ===============================================
           * ROW 3: Analytics (Full-width với charts)
           * ===============================================
           * 3 columns: Bar Chart + Donut + Top Content
           */}
          <AnalyticsOverview
            analytics={data?.analytics}
            isLoading={isLoading}
          />

          {/*
           * ===============================================
           * ROW 4: Recent Content
           * ===============================================
           */}
          <RecentContent items={data?.recentContent} isLoading={isLoading} />
        </div>
      </div>

      {/*
       * =====================================================
       * RIGHT BAR CONTENT
       * =====================================================
       */}
      <RightPanelSlot>
        <RightBarContent items={data?.draggableItems} isLoading={isLoading} />
      </RightPanelSlot>
    </>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default DashboardHomePage;
