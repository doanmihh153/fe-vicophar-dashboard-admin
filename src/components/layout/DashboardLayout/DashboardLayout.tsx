'use client';

/**
 * ===================================================================
 * DASHBOARD LAYOUT - LAYOUT CHÍNH CỦA ỨNG DỤNG
 * ===================================================================
 *
 * Đây là component Layout Controller trong kiến trúc 3 lớp.
 * Component này chịu trách nhiệm:
 * 1. Detect breakpoint (Desktop vs Tablet/Mobile)
 * 2. Quyết định render strategy (Grid vs Drawer)
 * 3. Tính toán grid-template-columns
 *
 * ===================================================================
 * KIẾN TRÚC 3 LỚP
 * ===================================================================
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ LỚP 1: BREAKPOINT DETECTION (useBreakpoint.ts)                 │
 * │ - Sử dụng matchMedia API                                       │
 * │ - Sync với Tailwind breakpoints                                │
 * │ - Cung cấp useIsDesktop(), useIsMobile(), useIsTablet()        │
 * └─────────────────────────────────────────────────────────────────┘
 *                              ↓
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ LỚP 2: PANEL STATE (DashboardContext.tsx)                      │
 * │ - Quản lý state: isLeftOpen, isRightOpen, isLeftCollapsed      │
 * │ - Device-agnostic: không biết đang ở mobile hay desktop        │
 * │ - Chỉ toggle boolean, không xử lý render logic                 │
 * └─────────────────────────────────────────────────────────────────┘
 *                              ↓
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ LỚP 3: LAYOUT CONTROLLER (DashboardLayout.tsx) ← FILE NÀY      │
 * │ - Kết hợp breakpoint + state để quyết định render              │
 * │ - Desktop: Grid layout với sidebars là columns                 │
 * │ - Tablet/Mobile: Drawer overlays                               │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * ===================================================================
 * NGUYÊN TẮC GRID ỔN ĐỊNH (CỰC KỲ QUAN TRỌNG)
 * ===================================================================
 *
 * DESKTOP GRID LUÔN LUÔN CÓ 3 CỘT
 * ---------------------------------
 * Tại sao? Vì nếu đổi số cột (3 → 2 → 3), browser phải reflow toàn bộ
 * layout, gây ra hiện tượng "nhảy" và có thể vỡ layout khi kết hợp
 * nhiều trạng thái (left collapse + right close).
 *
 * ❌ SAI (đổi số cột):
 * - RIGHT OPEN:  grid-cols-[260px_1fr_320px] (3 cột)
 * - RIGHT CLOSE: grid-cols-[260px_1fr]       (2 cột)
 * → Khi collapse SidebarLeft + close SidebarRight cùng lúc → grid vỡ
 *
 * ✅ ĐÚNG (giữ 3 cột, đổi width):
 * - LEFT OPEN   + RIGHT OPEN:   260px 1fr 320px
 * - LEFT CLOSE  + RIGHT OPEN:   64px  1fr 320px
 * - LEFT OPEN   + RIGHT CLOSE:  260px 1fr 0px
 * - LEFT CLOSE  + RIGHT CLOSE:  64px  1fr 0px  ← QUAN TRỌNG!
 *
 * ⚠️ PHẢI DÙNG 0px (KHÔNG PHẢI 0)
 * --------------------------------
 * grid-cols-[64px_1fr_0]   ← SAI! Browser drop toàn bộ grid
 * grid-cols-[64px_1fr_0px] ← ĐÚNG! Browser hiểu là cột width 0
 *
 * ===================================================================
 * RESPONSIVE BEHAVIOR
 * ===================================================================
 *
 * DESKTOP (≥ 1024px / Tailwind 'lg:')
 * ------------------------------------
 * - Layout: CSS Grid 3 cột
 * - SidebarLeft: Grid column, collapse = 260px → 64px
 * - SidebarRight: Grid column, close = 320px → 0px
 * - Toggle: Thay đổi grid-template-columns
 *
 * TABLET/MOBILE (< 1024px)
 * -------------------------
 * - Layout: CSS Grid 1 cột (chỉ Main)
 * - SidebarLeft: Drawer fixed overlay từ trái
 * - SidebarRight: Drawer fixed overlay từ phải
 * - Toggle: Show/hide drawer với animation
 *
 * ===================================================================
 * AUTO SYNC BEHAVIOR
 * ===================================================================
 *
 * Khi resize browser vượt breakpoint:
 * - Tablet → Desktop: Tự động mở cả 2 sidebar (grid mode)
 * - Desktop → Tablet: Tự động đóng cả 2 sidebar (drawer mode)
 *
 * Điều này đảm bảo UX nhất quán:
 * - Desktop: Sidebars hiển thị mặc định (như Notion, Linear)
 * - Mobile: Sidebars ẩn mặc định, mở bằng hamburger
 */

import React, { type ReactNode, useEffect } from 'react';

/*
 * ===================================================================
 * IMPORTS
 * ===================================================================
 */

// Hooks - Lớp 1: Breakpoint Detection
import { useIsDesktop } from '@/hooks';

// Context - Lớp 2: Panel State
import { useDashboard } from '@/components/providers/DashboardContext';
import { useRightPanelContent } from '@/components/providers/RightPanelContext';

// Components - UI Primitives
import { Header } from '@/components/layout/Header';
import { MainContent } from '@/components/layout/MainContent';
import {
  DrawerPanel, // Drawer overlay cho mobile/tablet
  LeftPanelContent, // Nội dung sidebar trái
  RightPanelContent, // Nội dung sidebar phải
} from '@/components/layout/panels';

import { cn } from '@/lib/utils';

/*
 * ===================================================================
 * TYPES
 * ===================================================================
 */

/**
 * Props cho DashboardLayout
 *
 * @property children - Nội dung trang, render trong MainContent
 * @property headerTitle - Title hiển thị trên header
 * @property headerActions - Custom buttons/actions cho header
 * @property headerContent - Override toàn bộ nội dung header
 * @property sidebarContent - Custom nội dung sidebar trái (thay thế LeftPanelContent)
 * @property rightPanelContent - Custom nội dung sidebar phải (thay thế RightPanelContent)
 * @property noPadding - Tắt padding cho main content
 * @property className - Class CSS bổ sung cho root container
 */
interface DashboardLayoutProps {
  children: ReactNode;
  headerTitle?: string;
  headerActions?: ReactNode;
  headerContent?: ReactNode;
  sidebarContent?: ReactNode;
  rightPanelContent?: ReactNode;
  noPadding?: boolean;
  className?: string;
}

/*
 * ===================================================================
 * COMPONENT
 * ===================================================================
 */

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
  /*
   * =================================================================
   * BREAKPOINT DETECTION
   * =================================================================
   *
   * Sử dụng hook useIsDesktop() để detect viewport size.
   * Hook này dùng matchMedia('(min-width: 1024px)'), sync với Tailwind 'lg:'.
   *
   * isDesktop = true:  Viewport ≥ 1024px → Grid layout
   * isDesktop = false: Viewport < 1024px → Drawer layout
   */
  const isDesktop = useIsDesktop();

  /*
   * =================================================================
   * PANEL STATE
   * =================================================================
   *
   * Lấy state từ DashboardContext.
   * Tất cả state đều device-agnostic (không biết mobile/desktop).
   *
   * - isLeftOpen: Sidebar trái có đang mở không
   * - isLeftCollapsed: Sidebar trái có đang thu gọn (chỉ icon) không
   * - isRightOpen: Sidebar phải có đang mở không
   * - setLeftOpen, setRightOpen: Set state cụ thể
   * - toggleLeft, toggleRight: Toggle state
   * - toggleLeftCollapse: Toggle collapse state
   */
  const {
    isLeftOpen,
    setLeftOpen,
    isLeftCollapsed,
    toggleLeftCollapse,
    isRightOpen,
    setRightOpen,
    toggleLeft,
    toggleRight,
  } = useDashboard();

  /*
   * =================================================================
   * SLOTTED RIGHT PANEL CONTENT
   * =================================================================
   *
   * Lấy nội dung sidebar phải từ Context (nếu có).
   * Ưu tiên: slottedContent > rightPanelContent prop > default
   */
  const slottedRightContent = useRightPanelContent();
  const finalRightContent = slottedRightContent || rightPanelContent;

  /*
   * =================================================================
   * AUTO SYNC STATE KHI BREAKPOINT THAY ĐỔI
   * =================================================================
   *
   * useEffect này tự động sync state khi viewport size thay đổi
   * vượt qua breakpoint 1024px.
   *
   * Desktop → Tablet:
   * - setLeftOpen(false): Đóng drawer trái
   * - setRightOpen(false): Đóng drawer phải
   *
   * Tablet → Desktop:
   * - setLeftOpen(true): Mở sidebar trái (grid column)
   * - setRightOpen(true): Mở sidebar phải (grid column)
   *
   * LƯU Ý: Điều này override user preference.
   * Ví dụ: User đã close sidebar trên desktop, sau đó resize xuống
   * mobile rồi resize lên lại desktop → sidebar sẽ tự mở.
   *
   * Đây là trade-off có chủ đích:
   * - PRO: UX nhất quán với design system (Notion, Linear)
   * - CON: Có thể bất ngờ với user
   */
  useEffect(() => {
    if (isDesktop) {
      // Viewport ≥ 1024px: Mở cả 2 sidebar (grid mode)
      setLeftOpen(true);
      setRightOpen(true);
    } else {
      // Viewport < 1024px: Đóng cả 2 sidebar (drawer mode)
      setLeftOpen(false);
      setRightOpen(false);
    }
  }, [isDesktop, setLeftOpen, setRightOpen]);

  /*
   * =================================================================
   * TÍNH TOÁN GRID COLUMNS (CSS VARIABLES)
   * =================================================================
   *
   * Fix FOUC (Flash of Unstyled Content):
   * Thay vì dùng JS để conditional render (gây chớp khi hydration),
   * ta dùng CSS Variables + Media Queries.
   *
   * --left-width:  Width của sidebar trái (260px hoặc 72px)
   * --right-width: Width của sidebar phải (320px hoặc 0px)
   *
   * Layout Logic:
   * - Mobile: grid-cols-1 (Mặc định)
   * - Desktop (lg:): grid-cols-[var(--left-width)_1fr_var(--right-width)]
   */
  const leftWidth = isLeftCollapsed ? '72px' : '260px';
  const rightWidth = isRightOpen ? '320px' : '0px';

  // Cast style to any to avoid TypeScript error with custom properties
  const gridStyle = {
    '--left-width': leftWidth,
    '--right-width': rightWidth,
  } as React.CSSProperties;

  /*
   * =================================================================
   * RENDER
   * =================================================================
   */
  return (
    <>
      {/*
       * ===============================================================
       * APP FRAME WRAPPER
       * ===============================================================
       */}
      <div className="bg-background flex h-screen w-full justify-center overflow-hidden">
        {/*
         * ===============================================================
         * CORE GRID LAYOUT
         * ===============================================================
         *
         * - Mobile: grid-cols-1
         * - Desktop (lg): 3 cột dựa trên CSS variables
         */}
        <div
          className={`grid h-full w-full max-w-[1920px] grid-cols-1 overflow-hidden transition-[grid-template-columns] duration-300 ease-in-out lg:grid-cols-[var(--left-width)_1fr_var(--right-width)] ${className} `}
          style={gridStyle}
        >
          {/*
           * =============================================================
           * CỘT 1: SIDEBAR LEFT
           * =============================================================
           *
           * - Mobile: hidden (Dùng Drawer)
           * - Desktop (lg): flex (Hiện trong Grid)
           *
           * LUÔN RENDER HTML (Server Side) -> Tránh layout shift
           */}
          <aside className="bg-background hidden flex-col overflow-hidden lg:mt-4 lg:flex">
            {/*
             * Custom sidebar content hoặc LeftPanelContent mặc định.
             */}
            {sidebarContent || (
              <LeftPanelContent
                showHeader={true}
                isCollapsed={isLeftCollapsed}
                onToggleCollapse={toggleLeftCollapse}
              />
            )}
          </aside>

          {/*
           * =============================================================
           * CỘT 2: MAIN AREA (Header + Content)
           * =============================================================
           *
           * Luôn hiện.
           */}
          {/*
           * =============================================================
           * CỘT 2: MAIN AREA (Header + Content)
           * =============================================================
           *
           * ISOLATED "ISLAND" LAYOUT:
           * - Desktop: Floating card style (margin, rounded, border)
           * - Mobile: Full screen (như cũ)
           */}
          <section
            className={cn(
              'bg-sidebar relative z-0 flex min-w-0 flex-col overflow-hidden',

              /* Mobile: Full height */
              'h-screen',

              /* Desktop: Island Style */
              'lg:border-sidebar-border lg:my-2 lg:h-[calc(100vh-16px)] lg:rounded-2xl'
            )}
          >
            {/* Header: Fixed height, sticky top or static driven by flex */}
            <Header className="bg-sidebar/80 sticky top-0 z-50 flex h-16 shrink-0 items-center px-4 backdrop-blur-md">
              {headerContent}
            </Header>

            {/* Content: Flex grow to fill remaining space */}
            <MainContent
              noPadding={noPadding}
              className="scrollbar-hidden flex-1 overflow-x-hidden overflow-y-auto"
            >
              {children}
            </MainContent>
          </section>

          {/*
           * =============================================================
           * CỘT 3: SIDEBAR RIGHT
           * =============================================================
           *
           * - Mobile: hidden
           * - Desktop (lg): flex
           *
           * Pointer events logic: disable click khi width = 0 (closed)
           */}
          <aside
            className={`bg-background scrollbar-hidden hidden h-screen flex-col overflow-hidden overflow-x-hidden overflow-y-auto lg:flex ${
              isRightOpen ? '' : 'pointer-events-none'
            } `}
          >
            {finalRightContent || <RightPanelContent />}
          </aside>
        </div>

        {/*
         * =================================================================
         * DRAWER LAYER (Tablet/Mobile)
         * =================================================================
         *
         * Render DrawerPanels khi viewport < 1024px.
         * Các drawer nằm NGOÀI grid, là fixed overlay.
         *
         * BEHAVIOR:
         * - position: fixed
         * - Overlay backdrop (click để đóng)
         * - Animation slide từ left/right
         * - Z-index cao hơn main content
         *
         * LEFT DRAWER:
         * - Slide từ trái
         * - isOpen = isLeftOpen state
         * - onClose = toggleLeft function
         *
         * RIGHT DRAWER:
         * - Slide từ phải
         * - isOpen = isRightOpen state
         * - onClose = toggleRight function
         */}
        {/*
         * =================================================================
         * DRAWER LAYER (Tablet/Mobile)
         * =================================================================
         *
         * Render DrawerPanels khi viewport < 1024px.
         * Các drawer nằm NGOÀI grid, là fixed overlay.
         *
         * FIX FOUC:
         * Wrap trong div `lg:hidden` để đảm bảo khi Server render (isDesktop=false),
         * UI này vẫn bị ẩn trên Desktop browser nhờ CSS.
         */}
        <div className="lg:hidden">
          {!isDesktop && (
            <>
              {/* Left Drawer - Navigation */}
              <DrawerPanel
                side="left"
                isOpen={isLeftOpen}
                onClose={toggleLeft}
                headerTitle="Vicophar"
              >
                {/* Dùng LeftPanelContent không có header (drawer có header riêng) */}
                {sidebarContent || <LeftPanelContent showHeader={false} />}
              </DrawerPanel>

              {/* Right Drawer - Notes/Tasks/Options */}
              <DrawerPanel
                side="right"
                isOpen={isRightOpen}
                onClose={toggleRight}
                showCloseButton={false}
              >
                {/* RightPanelContent với close button riêng */}
                {finalRightContent || (
                  <RightPanelContent showCloseButton={true} />
                )}
              </DrawerPanel>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/*
 * ===================================================================
 * EXPORT
 * ===================================================================
 */
export default DashboardLayout;
