'use client';

/**
 * ===================================================================
 * HEADER COMPONENT - HEADER CỐ ĐỊNH PHÍA TRÊN MAIN CONTENT
 * ===================================================================
 *
 * Header hiển thị:
 * - Title/Breadcrumb
 * - Action buttons
 * - Toggle buttons cho sidebars
 *
 * ===================================================================
 * VAI TRÒ TRONG KIẾN TRÚC
 * ===================================================================
 *
 * Header là một phần của Main Area, không phải toàn trang.
 *
 * ┌───────────────────────────────────────────────────────────────┐
 * │          ┌─────────────────────────────┐                      │
 * │ Sidebar  │         HEADER              │  Sidebar             │
 * │  Left    ├─────────────────────────────┤  Right               │
 * │          │                             │                      │
 * │          │       Main Content          │                      │
 * │          │                             │                      │
 * └───────────────────────────────────────────────────────────────┘
 *
 * Header KHÔNG fixed toàn trang (như Facebook navbar).
 * Header CHỈ thuộc Main Area và scroll cùng Main Area nếu cần.
 *
 * ===================================================================
 * BUTTON TOGGLE SIDEBAR (CỰC KỲ QUAN TRỌNG)
 * ===================================================================
 *
 * NGUYÊN TẮC VÀNG:
 * ----------------
 * Button toggle một component phải nằm NGOÀI component đó
 * nếu component đó có thể bị unmount khi close.
 *
 * BUTTON TOGGLE SIDEBARRIGHT:
 * ---------------------------
 * - PHẢI nằm trong Header (không nằm trong SidebarRight)
 * - Vì SidebarRight trên Desktop bị UNMOUNT khi close (width = 0px)
 * - Nếu button trong SidebarRight:
 *   - User click close → SidebarRight unmount → button mất
 *   - User không thể mở lại được
 *
 * BUTTON HAMBURGER (SIDEBARLEFT):
 * --------------------------------
 * - Chỉ hiện trên Tablet/Mobile (< lg = 1024px)
 * - Trên Desktop, SidebarLeft có nút collapse riêng bên trong
 * - Tại sao có thể đặt trong? Vì SidebarLeft trên Desktop
 *   KHÔNG BAO GIỜ bị unmount (chỉ collapse từ 260px → 64px)
 *
 * ===================================================================
 * BREAKPOINT SYNC VỚI TAILWIND
 * ===================================================================
 *
 * Hamburger button dùng class lg:hidden:
 * - lg = 1024px trong Tailwind
 * - lg:hidden = ẩn khi viewport ≥ 1024px
 *
 * Điều này đồng bộ với:
 * - useIsDesktop() hook dùng matchMedia('(min-width: 1024px)')
 * - DashboardLayout switch giữa Grid và Drawer ở 1024px
 *
 * ⚠️ KHÔNG được dùng md:hidden (768px) vì:
 * - Breakpoint chính là 1024px
 * - Sẽ không sync với layout switching logic
 */

import React, { type ReactNode } from 'react';
import { useDashboard } from '@/components/providers/DashboardContext';
import { Menu, PanelRightOpen, PanelRightClose } from 'lucide-react';

/*
 * ===================================================================
 * TYPES
 * ===================================================================
 */

/**
 * Props cho Header component
 *
 * @property title - Title hiển thị (breadcrumb/page name)
 * @property actions - Custom action buttons (search, notifications, etc.)
 * @property children - Override toàn bộ nội dung header
 * @property className - Class CSS bổ sung
 */
interface HeaderProps {
  title?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/*
 * ===================================================================
 * COMPONENT
 * ===================================================================
 */

export function Header({
  title,
  actions,
  children,
  className = '',
}: HeaderProps) {
  /*
   * Lấy state và callbacks từ DashboardContext.
   *
   * - toggleLeft: Toggle sidebar trái (cho mobile drawer)
   * - toggleRight: Toggle sidebar phải (cho cả desktop và mobile)
   * - isRightOpen: State hiện tại của sidebar phải
   */
  const { toggleLeft, toggleRight, isRightOpen } = useDashboard();

  /*
   * OVERRIDE MODE
   * -------------
   * Nếu có children, bỏ qua layout mặc định và chỉ render children.
   * Cho phép pages customize hoàn toàn header.
   */
  if (children) {
    return (
      <header
        className={`border-border bg-background flex h-16 items-center justify-between border-b px-4 ${className} `}
      >
        {children}
      </header>
    );
  }

  /*
   * DEFAULT LAYOUT
   * --------------
   * ┌────────────────────────────────────────────────────┐
   * │ [Hamburger] Title     ...     [Actions] [Toggle]  │
   * └────────────────────────────────────────────────────┘
   */
  return (
    <header
      className={`border-border bg-background flex h-16 items-center justify-between border-b px-4 ${className} `}
    >
      {/*
       * =========================================================
       * BÊN TRÁI: Hamburger + Title
       * =========================================================
       */}
      <div className="flex items-center gap-3">
        {/*
         * ---------------------------------------------------------
         * NÚT HAMBURGER MENU (Mobile/Tablet only)
         * ---------------------------------------------------------
         *
         * CLASS lg:hidden:
         * - Hiện khi viewport < 1024px (mobile/tablet)
         * - Ẩn khi viewport ≥ 1024px (desktop)
         *
         * TẠI SAO lg:hidden MÀ KHÔNG PHẢI md:hidden?
         * ------------------------------------------
         * - Breakpoint chính của layout là 1024px (lg)
         * - Dưới 1024px: Sidebar là drawer
         * - Trên 1024px: Sidebar là grid column
         * - Hamburger chỉ cần khi sidebar là drawer
         *
         * FUNCTION: toggleLeft
         * - Dùng chung cho drawer (mobile) và grid (desktop)
         * - Trên mobile: Mở/đóng left drawer
         * - Trên desktop: Thường không trigger (vì button hidden)
         */}
        <button
          onClick={toggleLeft}
          className="hover:bg-accent rounded-lg p-2 transition-colors lg:hidden"
          aria-label="Mở menu điều hướng"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/*
         * ---------------------------------------------------------
         * TITLE / BREADCRUMB
         * ---------------------------------------------------------
         *
         * Hiển thị page title hoặc breadcrumb.
         * - font-display: Font heading từ theme
         * - truncate: Cắt text dài bằng "..."
         */}
        {title && (
          <h1 className="font-display truncate text-lg font-medium">{title}</h1>
        )}
      </div>

      {/*
       * =========================================================
       * BÊN PHẢI: Actions + Toggle SidebarRight
       * =========================================================
       */}
      <div className="flex items-center gap-2">
        {/* Custom actions từ props (search, notifications, etc.) */}
        {actions}

        {/*
         * ---------------------------------------------------------
         * NÚT TOGGLE SIDEBAR PHẢI
         * ---------------------------------------------------------
         *
         * ⚠️ BUTTON NÀY PHẢI NẰM TRONG HEADER, KHÔNG TRONG SIDEBARRIGHT
         *
         * TẠI SAO?
         * --------
         * - SidebarRight trên Desktop có thể bị unmount (width = 0px)
         * - Nếu button trong SidebarRight:
         *   - Close → SidebarRight unmount → button mất
         *   - User không thể click để mở lại
         *
         * - Button trong Header:
         *   - Header luôn render
         *   - Button luôn tồn tại
         *   - User luôn có thể toggle
         *
         * HIỂN THỊ: Trên TẤT CẢ breakpoints
         * - Desktop: Toggle grid column (320px ↔ 0px)
         * - Mobile: Toggle right drawer
         *
         * ICON THAY ĐỔI THEO STATE:
         * - isRightOpen = true: PanelRightClose (có nút X)
         * - isRightOpen = false: PanelRightOpen (có mũi tên mở)
         *
         * STYLE THAY ĐỔI THEO STATE:
         * - Open: bg-primary (highlight rõ rằng panel đang mở)
         * - Closed: hover:bg-accent (subtle)
         *
         * FLOW SAU KHI CLICK:
         * toggleRight() → setRightOpen(!isRightOpen)
         * → DashboardLayout re-render → getGridColumns() đổi
         * → grid-template-columns thay đổi (320px ↔ 0px)
         * → SidebarRight animate width
         */}
        <button
          onClick={toggleRight}
          className={`rounded-lg p-2 transition-colors ${
            isRightOpen
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent text-muted-foreground hover:text-foreground'
          } `}
          aria-label={isRightOpen ? 'Đóng panel phải' : 'Mở panel phải'}
          aria-pressed={isRightOpen}
        >
          {isRightOpen ? (
            <PanelRightClose className="h-5 w-5" />
          ) : (
            <PanelRightOpen className="h-5 w-5" />
          )}
        </button>
      </div>
    </header>
  );
}

/*
 * ===================================================================
 * EXPORT
 * ===================================================================
 */
export default Header;
