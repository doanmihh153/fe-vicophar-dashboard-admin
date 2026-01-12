/**
 * =============================================================================
 * FILE: DashboardPage.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Container chính cho trang Home Dashboard.
 *   Đây là Smart Component - chỉ quản lý data flow và layout.
 *
 * VAI TRÒ:
 *   - Fetch data thông qua useDashboardData hook
 *   - Phân phối data xuống các component con qua props
 *   - Định nghĩa layout grid chính
 *   - Inject content vào RightPanelSlot
 *
 * NGUYÊN TẮC (theo Design Constitution v1):
 *   - Không chứa logic UI phức tạp
 *   - Không style inline (trừ layout grid)
 *   - Data từ hook → props → UI components
 *   - Spacing: 32px (gap-8) cho section, 48px (p-12) cho page padding
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import { RightPanelSlot } from '@/components/providers/RightPanelContext';
import { useDashboardData } from './_hooks';

// Components Phase 2
import {
  HomeMainHeader,
  StatOverview,
  RecentContent,
  AnalyticsOverview,
} from './_components';

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Home Dashboard Page
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────┐
 * │  MAIN CONTENT (trong MainContent area của layout)  │
 * │  ┌─────────────────────────────────────────────┐   │
 * │  │ HomeMainHeader (Welcome + Context Panel)    │   │
 * │  ├─────────────────────────────────────────────┤   │
 * │  │ StatOverview (Grid 4 cột)                   │   │
 * │  ├─────────────────────────────────────────────┤   │
 * │  │ RecentContent    │  AnalyticsOverview       │   │
 * │  │ (2fr)            │  (1fr)                   │   │
 * │  └─────────────────────────────────────────────┘   │
 * └─────────────────────────────────────────────────────┘
 *
 * RIGHT BAR (inject qua RightPanelSlot):
 * ┌─────────────────────┐
 * │ DraggableItemList   │
 * │ CalendarPanel       │
 * └─────────────────────┘
 */
export function DashboardHomePage() {
  // Fetch data từ hook
  const { data, isLoading } = useDashboardData();

  return (
    <>
      {/*
       * =====================================================
       * MAIN CONTENT AREA
       * =====================================================
       *
       * Layout CSS Grid:
       * - Page padding: 48px (p-12 trên desktop), 24px (p-6 trên mobile)
       * - Section gap: 32px (gap-8)
       *
       * Tuân thủ Spacing System: 4/8/12/16/24/32/48/64
       */}
      <div className="p-6 lg:p-12">
        <div className="grid gap-8">
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
           * ROW 2: Stat Overview (Grid 4 cột)
           * ===============================================
           */}
          <StatOverview stats={data?.stats} isLoading={isLoading} />

          {/*
           * ===============================================
           * ROW 3: Recent Content + Analytics (Grid 2 cột)
           * ===============================================
           *
           * Layout: [2fr 1fr]
           * - RecentContent chiếm 2 phần
           * - AnalyticsOverview chiếm 1 phần
           */}
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <RecentContent items={data?.recentContent} isLoading={isLoading} />
            <AnalyticsOverview
              analytics={data?.analytics}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/*
       * =====================================================
       * RIGHT BAR CONTENT
       * =====================================================
       *
       * Inject vào RightPanelSlot (thay thế default RightPanelContent)
       * Chứa: DraggableItemList + CalendarPanel
       *
       * TODO: Phase 3 - Tạo RightBarContent component riêng
       */}
      <RightPanelSlot>
        <div className="flex h-full flex-col p-4">
          {/* Công việc */}
          <div className="mb-8 flex-1">
            <h3 className="text-muted-foreground mb-4 text-xs font-medium tracking-wide uppercase">
              Công việc
            </h3>
            <ul className="space-y-1">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <li key={i} className="flex items-center gap-3 p-3">
                      <div className="bg-muted h-2 w-2 animate-pulse rounded-full" />
                      <div className="bg-muted h-4 w-full animate-pulse rounded-md" />
                    </li>
                  ))
                : data?.draggableItems.map((item) => (
                    <li key={item.id}>
                      <button className="hover:bg-muted/50 flex w-full items-center gap-3 p-3 text-left transition-colors duration-150">
                        {/*
                         * Priority dot - Exception theo Design Constitution
                         * Đây là ngoại lệ duy nhất cho rounded-full với màu
                         */}
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            item.priority === 'high'
                              ? 'bg-rose-500'
                              : item.priority === 'medium'
                                ? 'bg-amber-500'
                                : 'bg-muted-foreground/30'
                          }`}
                        />
                        <span className="min-w-0 flex-1 truncate text-sm">
                          {item.title}
                        </span>
                      </button>
                    </li>
                  ))}
            </ul>
          </div>

          {/* Calendar placeholder */}
          <div>
            <h3 className="text-muted-foreground mb-4 text-xs font-medium tracking-wide uppercase">
              Lịch
            </h3>
            <div className="text-muted-foreground text-center text-sm">
              {/* TODO: Phase 3 - CalendarPanel component */}
              <p>Calendar sẽ được thêm ở Phase 3</p>
            </div>
          </div>
        </div>
      </RightPanelSlot>
    </>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default DashboardHomePage;
