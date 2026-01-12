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

// Components - UI Primitives
import { Header } from '@/components/layout/Header';
import { MainContent } from '@/components/layout/MainContent';
import {
  DrawerPanel, // Drawer overlay cho mobile/tablet
  LeftPanelContent, // Nội dung sidebar trái
  RightPanelContent, // Nội dung sidebar phải
} from '@/components/layout/panels';

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
   * TÍNH TOÁN GRID COLUMNS (INLINE STYLE)
   * =================================================================
   *
   * Thay vì dùng Tailwind dynamic class (dễ lỗi), ta dùng Inline Style.
   *
   * DESKTOP (isDesktop = true):
   * ---------------------------
   * Set trực tiếp gridTemplateColumns.
   * - Left: 260px (open) / 60px (collapsed)
   * - Right: 320px (open) / 0px (closed)
   *
   * TABLET/MOBILE:
   * ----------------
   * style = undefined. Dùng class 'grid-cols-1' của Tailwind.
   */
  const leftWidth = isLeftCollapsed ? '72px' : '260px';
  const rightWidth = isRightOpen ? '320px' : '0px';
  const desktopGridStyle = {
    gridTemplateColumns: `${leftWidth} 1fr ${rightWidth}`,
  };

  /*
   * =================================================================
   * RENDER
   * =================================================================
   */
  return (
    <>
      {/*
       * ===============================================================
       * APP FRAME WRAPPER (Large Screen UX)
       * ===============================================================
       *
       * Mục tiêu: Cải thiện UX trên màn hình siêu rộng (2K, 4K).
       * Thay vì để Dashboard giãn full viewport (có thể lên tới 3000px+),
       * ta "đóng khung" (App Frame) nó lại ở max-width: 1920px.
       *
       * Cấu trúc:
       * - Flex container (Parent): Căn giữa (justify-center), full height.
       * - Grid container (Child): Max-width 1920px, shadow, border để tạo điểm nhấn.
       *
       * Tại sao cần wrapper này?
       * 1. Giảm mỏi mắt/cổ: Không phải liếc từ mép trái sang mép phải quá xa.
       * 2. Tăng thẩm mỹ: Tạo cảm giác "Application" chuyên nghiệp.
       * 3. An toàn: Logic Grid bên trong KHÔNG bị ảnh hưởng.
       *
       * Background: Dùng màu nền trung tính cho vùng đệm 2 bên.
       */}
      <div className="bg-background flex h-screen w-full justify-center overflow-hidden">
        {/*
         * ===============================================================
         * CORE GRID LAYOUT
         * ===============================================================
         *
         * Đây là layout chính của ứng dụng.
         *
         * Updates cho App Frame:
         * - h-full: Chiếm full chiều cao wrapper (vẫn là 100vh).
         * - w-full: Chiếm full chiều ngang wrapper.
         * - max-w-[1920px]: Giới hạn độ rộng tối đa.
         * - 2xl:shadow-2xl: Đổ bóng khi màn hình > 1536px để tách biệt.
         * - 2xl:border-x: Viền 2 bên để neo thị giác.
         */}
        <div
          className={`grid h-full w-full max-w-[1920px] overflow-hidden transition-all duration-300 ease-in-out ${
            !isDesktop ? 'grid-cols-1' : ''
          } ${className} `}
          style={isDesktop ? desktopGridStyle : undefined}
        >
          {/*
           * =============================================================
           * CỘT 1: SIDEBAR LEFT (Desktop Grid Mode)
           * =============================================================
           *
           * ĐIỀU KIỆN RENDER: isDesktop = true
           * Trên Tablet/Mobile, sidebar render bằng     DrawerPanel ở dưới.
           *
           * BEHAVIOR:
           * - LUÔN render khi isDesktop (không unmount)
           * - Width thay đổi theo grid-template-columns
           * - Collapse = đổi width column (260px → 64px)
           * - Content bên trong ẩn bằng opacity, KHÔNG unmount
           *
           * TẠI SAO KHÔNG UNMOUNT?
           * ----------------------
           * Nếu unmount SidebarLeft khi collapsed:
           * - Grid mất 1 item
           * - MainContent nhảy sang vị trí của SidebarLeft
           * - Layout vỡ hoàn toàn
           *
           * CLASSES:
           * - bg-sidebar: Background từ theme
           * - border-sidebar-border: Border color từ theme
           * - border-r: Border bên phải (ngăn cách với Main)
           * - h-screen: Full height
           * - overflow-hidden: Ẩn content tràn khi collapsed
           * - transition-all duration-300: Animation mượt
           */}
          {isDesktop && (
            <aside className="bg-sidebar m-2 flex h-[calc(100vh-16px)] flex-col overflow-hidden rounded-2xl transition-all duration-300">
              {/*
               * Custom sidebar content hoặc LeftPanelContent mặc định.
               *
               * LeftPanelContent nhận:
               * - showHeader: Hiển thị logo header
               * - isCollapsed: Đang thu gọn không
               * - onToggleCollapse: Callback toggle collapse
               */}
              {sidebarContent || (
                <LeftPanelContent
                  showHeader={true}
                  isCollapsed={isLeftCollapsed}
                  onToggleCollapse={toggleLeftCollapse}
                />
              )}
            </aside>
          )}

          {/*
           * =============================================================
           * CỘT 2: MAIN AREA (Header + Content)
           * =============================================================
           *
           * Luôn render, chiếm cột giữa (1fr).
           *
           * STRUCTURE:
           * ┌─────────────────────────────────────┐
           * │ Header (64px fixed height)          │
           * ├─────────────────────────────────────┤
           * │ MainContent (chiếm phần còn lại)    │
           * │                                     │
           * │                                     │
           * └─────────────────────────────────────┘
           *
           * CLASSES:
           * - grid grid-rows-[64px_1fr]: 2 rows, header 64px + content 1fr
           * - min-w-0: Prevent overflow issues với flex children
           * - h-screen: Full height
           * - overflow-hidden: Chặn scroll ở container
           */}
          <div className="grid h-screen min-w-0 grid-rows-[64px_1fr] overflow-hidden">
            {/*
             * HEADER
             * ------
             * Hiển thị title, actions, và toggle buttons.
             *
             * Toggle buttons:
             * - Hamburger (lg:hidden): Toggle left drawer trên mobile
             * - Panel Right: Toggle right sidebar/drawer
             *
             * Buttons nằm trong Header (không trong Sidebar) vì:
             * - SidebarRight có thể bị unmount (width 0px)
             * - Nếu button trong Sidebar → button mất → không mở lại được
             */}
            <Header
              title={headerTitle}
              actions={headerActions}
              className="bg-background flex h-16 items-center px-4"
            >
              {headerContent}
            </Header>

            {/*
             * MAIN CONTENT
             * ------------
             * Nội dung trang chính, truyền từ children.
             *
             * - noPadding: Bỏ padding nếu cần layout full-bleed
             * - overflow-y-auto: Enable vertical scroll cho content
             * - overscroll-contain: Prevent scroll chaining
             */}
            <MainContent
              noPadding={noPadding}
              className="bg-background scrollbar-hidden overflow-x-hidden overflow-y-auto"
            >
              {children}
            </MainContent>
          </div>

          {/*
           * =============================================================
           * CỘT 3: SIDEBAR RIGHT (Desktop Grid Mode)
           * =============================================================
           *
           * ĐIỀU KIỆN RENDER: isDesktop = true
           *
           * BEHAVIOR:
           * - LUÔN render để giữ grid 3 cột ổn định
           * - Close = width 0px (do grid-template-columns)
           * - Content tự động bị cắt bởi overflow-hidden
           * - pointer-events-none khi closed để prevent click
           *
           * TẠI SAO KHÔNG UNMOUNT?
           * ----------------------
           * Nếu unmount khi close:
           * - Grid structure thay đổi (3 → 2 cột)
           * - Phải tính lại grid-template-columns
           * - Có thể conflict với SidebarLeft collapse
           * - Layout unstable
           *
           * GIỮ VÀ SET WIDTH 0px:
           * - Grid structure ổn định (luôn 3 cột)
           * - Content bị ẩn tự nhiên bởi width 0
           * - Không cần conditional render phức tạp
           */}
          {isDesktop && (
            <aside
              className={`bg-sidebar scrollbar-hidden flex h-screen flex-col overflow-hidden overflow-x-hidden overflow-y-auto transition-all duration-300 ${isRightOpen ? '' : 'pointer-events-none'} `}
            >
              {/* Custom content hoặc RightPanelContent mặc định */}
              {rightPanelContent || <RightPanelContent />}
            </aside>
          )}
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
              {rightPanelContent || (
                <RightPanelContent showCloseButton={true} />
              )}
            </DrawerPanel>
          </>
        )}
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
