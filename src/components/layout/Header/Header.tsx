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
import {
  Menu,
  PanelRightOpen,
  PanelRightClose,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import AnimatedHeaderButton from './AnimatedHeaderButton';
import { HeaderActions } from './components/HeaderActions';

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
  const {
    toggleLeft,
    toggleRight,
    isRightOpen,
    toggleLeftCollapse,
    isLeftCollapsed,
  } = useDashboard();

  /*
   * OVERRIDE MODE
   * -------------
   * Nếu có children, bỏ qua layout mặc định và chỉ render children.
   * Cho phép pages customize hoàn toàn header.
   */
  if (children) {
    return (
      <header
        className={`bg-background flex h-16 items-center justify-between px-4 ${className} `}
      >
        {children}
      </header>
    );
  }

  /*
   * NEW LAYOUT: Btn1 -- Search -- Actions -- Btn2
   */
  return (
    <header
      className={`bg-sidebar relative flex h-16 items-center justify-between px-4 lg:top-2 lg:mx-2 lg:rounded-2xl ${className} `}
    >
      {/*
       * =========================================================
       * LEFT SECTION: Hamburger + Btn1 (Sidebar Toggle) + Title
       * =========================================================
       */}
      <div className="flex shrink-0 items-center gap-3">
        {/* Mobile Hamburger */}
        <button
          onClick={toggleLeft}
          className="hover:bg-accent rounded-lg p-2 transition-colors lg:hidden"
          aria-label="Mở menu điều hướng"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop Animated Button for Left Sidebar */}
        <div className="hidden lg:block">
          <AnimatedHeaderButton
            onClick={toggleLeftCollapse}
            label="Sidebar"
            icon={
              isLeftCollapsed ? (
                <ArrowRight className="h-5 w-5" />
              ) : (
                <ArrowLeft className="h-5 w-5" />
              )
            }
          />
        </div>

        {/* Title (Hidden on mobile if space is tight, usually good to keep) */}
        {title && (
          <h1 className="font-display ml-2 hidden truncate text-lg font-medium xl:block">
            {title}
          </h1>
        )}
      </div>

      {/*
       * =========================================================
       * RIGHT SECTION: Actions + Btn2 (Panel Toggle)
       * =========================================================
       */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Standard Actions (Avatar, Notification, Theme) */}
        <HeaderActions />

        {/* Mobile Right Toggle */}
        <button
          onClick={toggleRight}
          className={`rounded-lg p-2 transition-colors lg:hidden ${
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

        {/* Desktop Animated Button for Right Panel */}
        <div className="ml-2 hidden lg:block">
          <AnimatedHeaderButton
            onClick={toggleRight}
            label="Panel"
            icon={
              isRightOpen ? (
                <ArrowRight className="h-5 w-5" />
              ) : (
                <ArrowLeft className="h-5 w-5" />
              )
            }
          />
        </div>
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
