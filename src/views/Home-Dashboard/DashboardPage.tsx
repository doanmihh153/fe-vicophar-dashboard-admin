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
// import './home-dashboard.css';

// Import Components
import { MainContent, RightBarContent } from './_components';

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
       */}
      <div className="col-span-12 lg:col-span-9">
        <MainContent data={data} isLoading={isLoading} />
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
