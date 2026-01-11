'use client';

/**
 * ===================================================================
 * DASHBOARD LAYOUT COMPONENT
 * ===================================================================
 *
 * Layout wrapper chính cho toàn bộ Dashboard application.
 * Cấu trúc 3 cột: Sidebar Left | Center (Header + Main) | Sidebar Right
 *
 * Cấu trúc visual:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │                      VIEWPORT (100vw x 100vh)                    │
 * ├────────────┬──────────────────────────────────────┬──────────────┤
 * │            │              HEADER                  │              │
 * │  SIDEBAR   ├──────────────────────────────────────┤   SIDEBAR    │
 * │   LEFT     │                                      │    RIGHT     │
 * │            │           MAIN CONTENT               │              │
 * │  (scroll)  │              (scroll)                │   (scroll)   │
 * │   260px    │               1fr                    │    320px     │
 * └────────────┴──────────────────────────────────────┴──────────────┘
 *
 * Sử dụng:
 * ```tsx
 * // Trong layout.tsx
 * <DashboardProvider>
 *   <DashboardLayout
 *     headerTitle="Dashboard"
 *     sidebarContent={<MyNavigation />}
 *   >
 *     {children}
 *   </DashboardLayout>
 * </DashboardProvider>
 * ```
 */

import React, { type ReactNode } from 'react';
import { useDashboard } from '@/components/providers/DashboardContext';
import { SidebarLeft } from '@/components/layout/SidebarLeft';
import { SidebarRight } from '@/components/layout/SidebarRight';
import { Header } from '@/components/layout/Header';
import { MainContent } from '@/components/layout/MainContent';

/* ===== TYPES ===== */

interface DashboardLayoutProps {
  /** Nội dung page (children) - sẽ được render trong MainContent */
  children: ReactNode;

  /* ----- Header Props ----- */
  /** Title hiển thị trên header */
  headerTitle?: string;
  /** Custom actions cho header (buttons, search, etc.) */
  headerActions?: ReactNode;
  /** Override toàn bộ nội dung header */
  headerContent?: ReactNode;

  /* ----- Sidebar Left Props ----- */
  /** Custom nội dung cho sidebar trái (navigation menu) */
  sidebarContent?: ReactNode;

  /* ----- Sidebar Right Props ----- */
  /** Custom nội dung cho sidebar phải (override mặc định) */
  rightPanelContent?: ReactNode;

  /* ----- Main Content Props ----- */
  /** Tắt padding mặc định của main content */
  noPadding?: boolean;

  /** Class CSS bổ sung cho wrapper */
  className?: string;
}

/* ===== COMPONENT ===== */

export function DashboardLayout({
  children,
  headerTitle = 'Dashboard',
  headerActions,
  headerContent,
  sidebarContent,
  rightPanelContent,
  noPadding = false,
  className = '',
}: DashboardLayoutProps) {
  const { isLeftSidebarCollapsed, isRightPanelOpen } = useDashboard();

  // Tính toán class dựa trên state
  const layoutClasses = [
    'dashboard-layout',
    isLeftSidebarCollapsed ? 'sidebar-collapsed' : '',
    !isRightPanelOpen ? 'right-hidden' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={layoutClasses}>
      {/* ===== CỘT 1: SIDEBAR TRÁI ===== */}
      <SidebarLeft>{sidebarContent}</SidebarLeft>

      {/* ===== CỘT 2: CENTER (HEADER + MAIN) ===== */}
      <div className="center-column">
        {/* Header cố định */}
        <Header title={headerTitle} actions={headerActions}>
          {headerContent}
        </Header>

        {/* Main content với scroll riêng */}
        <MainContent noPadding={noPadding}>{children}</MainContent>
      </div>

      {/* ===== CỘT 3: SIDEBAR PHẢI ===== */}
      <SidebarRight>{rightPanelContent}</SidebarRight>
    </div>
  );
}

/* ===== EXPORT MẶC ĐỊNH ===== */
export default DashboardLayout;
