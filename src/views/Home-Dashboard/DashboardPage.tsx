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

// Import các component con (sẽ tạo ở Phase 2)
// import { HomeMainHeader } from './_components/HomeMainHeader';
// import { StatOverview } from './_components/StatOverview';
// import { RecentContent } from './_components/RecentContent';
// import { AnalyticsOverview } from './_components/AnalyticsOverview';
// import { RightBarContent } from './_components/RightBarContent';

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
       * - Page padding: 48px (p-12 trên desktop), 32px (p-8 trên mobile)
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
          <section>
            {/* TODO: Phase 2 - HomeMainHeader component */}
            <div className="flex items-center justify-between">
              <div>
                {isLoading ? (
                  <div className="space-y-2">
                    <div className="bg-muted h-8 w-48 animate-pulse rounded-md" />
                    <div className="bg-muted h-4 w-64 animate-pulse rounded-md" />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-medium">
                      <span className="font-signature text-muted-foreground">
                        Xin chào,
                      </span>{' '}
                      <span className="text-foreground">
                        {data?.userContext.userName}
                      </span>
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      {data?.userContext.greeting}
                    </p>
                  </>
                )}
              </div>

              {/* Context Quick Panel */}
              <div className="hidden items-center gap-6 lg:flex">
                {isLoading ? (
                  <>
                    <div className="text-center">
                      <div className="bg-muted mx-auto h-6 w-8 animate-pulse rounded-md" />
                      <span className="text-muted-foreground mt-1 block text-xs">
                        Bài nháp
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="bg-muted mx-auto h-6 w-8 animate-pulse rounded-md" />
                      <span className="text-muted-foreground mt-1 block text-xs">
                        Lịch hôm nay
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="bg-muted mx-auto h-6 w-8 animate-pulse rounded-md" />
                      <span className="text-muted-foreground mt-1 block text-xs">
                        Chờ duyệt
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <span className="text-2xl font-medium tabular-nums">
                        {data?.userContext.draftsCount}
                      </span>
                      <span className="text-muted-foreground mt-1 block text-xs">
                        Bài nháp
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-medium tabular-nums">
                        {data?.userContext.todayAppointments}
                      </span>
                      <span className="text-muted-foreground mt-1 block text-xs">
                        Lịch hôm nay
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-medium tabular-nums">
                        {data?.userContext.pendingReviews}
                      </span>
                      <span className="text-muted-foreground mt-1 block text-xs">
                        Chờ duyệt
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/*
           * ===============================================
           * ROW 2: Stat Overview (Grid 4 cột)
           * ===============================================
           */}
          <section>
            <h2 className="text-muted-foreground mb-4 text-sm font-medium tracking-wide uppercase">
              Tổng quan
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {isLoading
                ? /* Skeleton placeholders */
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-6">
                      <div className="bg-muted mb-2 h-4 w-16 animate-pulse rounded-md" />
                      <div className="bg-muted h-8 w-12 animate-pulse rounded-md" />
                    </div>
                  ))
                : /* Stat cards */
                  data?.stats.map((stat) => (
                    <a
                      key={stat.id}
                      href={stat.href}
                      className="group hover:bg-muted/50 block p-6 transition-colors duration-150"
                    >
                      <span className="text-muted-foreground text-sm">
                        {stat.label}
                      </span>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-3xl font-medium tabular-nums">
                          {stat.value}
                        </span>
                        <span className="text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                          →
                        </span>
                      </div>
                    </a>
                  ))}
            </div>
          </section>

          {/*
           * ===============================================
           * ROW 3: Recent Content + Analytics (Grid 2 cột)
           * ===============================================
           */}
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Recent Content */}
            <section>
              <h2 className="text-muted-foreground mb-4 text-sm font-medium tracking-wide uppercase">
                Nội dung gần đây
              </h2>
              <div className="space-y-1">
                {isLoading
                  ? /* Skeleton placeholders */
                    Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4"
                      >
                        <div className="flex-1">
                          <div className="bg-muted h-5 w-48 animate-pulse rounded-md" />
                          <div className="bg-muted mt-2 h-3 w-24 animate-pulse rounded-md" />
                        </div>
                        <div className="bg-muted h-4 w-16 animate-pulse rounded-md" />
                      </div>
                    ))
                  : /* Recent items */
                    data?.recentContent.slice(0, 5).map((item) => (
                      <a
                        key={item.id}
                        href={item.href}
                        className="hover:bg-muted/50 flex items-center justify-between p-4 transition-colors duration-150"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="block truncate font-medium">
                            {item.title}
                          </span>
                          <span className="text-muted-foreground mt-1 block text-xs">
                            {/* TODO: Dùng formatRelativeTime từ _utils */}
                            {item.createdAt.toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            item.status === 'draft'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {item.status === 'draft' ? 'Nháp' : 'Đã xuất bản'}
                        </span>
                      </a>
                    ))}
              </div>
            </section>

            {/* Analytics Overview */}
            <section>
              <h2 className="text-muted-foreground mb-4 text-sm font-medium tracking-wide uppercase">
                Analytics
              </h2>
              <div className="space-y-6">
                {/* Pageview hôm nay */}
                <div>
                  <span className="text-muted-foreground text-sm">
                    Lượt xem hôm nay
                  </span>
                  <div className="mt-1 flex items-baseline gap-2">
                    {isLoading ? (
                      <div className="bg-muted h-8 w-16 animate-pulse rounded-md" />
                    ) : (
                      <>
                        <span className="text-3xl font-medium tabular-nums">
                          {data?.analytics.todayPageviews.toLocaleString(
                            'vi-VN'
                          )}
                        </span>
                        <span
                          className={`text-sm ${
                            data?.analytics.trend === 'up'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {data?.analytics.trend === 'up' ? '↑' : '↓'}{' '}
                          {data?.analytics.trendPercent}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Top content */}
                <div>
                  <span className="text-muted-foreground text-sm">
                    Nội dung hot
                  </span>
                  <ul className="mt-2 space-y-2">
                    {isLoading
                      ? Array.from({ length: 3 }).map((_, i) => (
                          <li key={i} className="flex justify-between text-sm">
                            <div className="bg-muted h-4 w-32 animate-pulse rounded-md" />
                            <div className="bg-muted h-4 w-8 animate-pulse rounded-md" />
                          </li>
                        ))
                      : data?.analytics.topContent
                          .slice(0, 3)
                          .map((item, i) => (
                            <li
                              key={i}
                              className="flex justify-between text-sm"
                            >
                              <span className="truncate">{item.title}</span>
                              <span className="text-muted-foreground tabular-nums">
                                {item.views}
                              </span>
                            </li>
                          ))}
                  </ul>
                </div>
              </div>
            </section>
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
                        {/* Priority dot - Exception theo Design Constitution */}
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
