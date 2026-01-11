'use client';

/**
 * ===================================================================
 * HEADER COMPONENT
 * ===================================================================
 *
 * Header cố định phía trên main content area.
 *
 * ===================================================================
 * BUTTON TOGGLE SIDEBAR (QUAN TRỌNG)
 * ===================================================================
 *
 * BUTTON TOGGLE SIDEBARRIGHT:
 * - PHẢI nằm trong Header (không nằm trong SidebarRight)
 * - Vì SidebarRight trên Desktop bị UNMOUNT khi close
 * - Nếu button trong SidebarRight → khi close → button mất → không mở lại được
 *
 * BUTTON HAMBURGER (SIDEBARLEFT):
 * - Chỉ hiện trên Tablet/Mobile (< lg = 1024px)
 * - Trên Desktop, SidebarLeft có nút collapse riêng bên trong
 * - Vì SidebarLeft trên Desktop KHÔNG BAO GIỜ bị unmount (chỉ collapse)
 *
 * ===================================================================
 * BREAKPOINT SYNC
 * ===================================================================
 * - lg:hidden: Ẩn hamburger từ 1024px trở lên (Desktop)
 * - Đồng bộ với matchMedia('(min-width: 1024px)') trong DashboardLayout
 */

import React, { type ReactNode } from 'react';
import { useDashboard } from '@/components/providers/DashboardContext';
import { Menu, PanelRightOpen, PanelRightClose } from 'lucide-react';

/* ===== TYPES ===== */

interface HeaderProps {
  title?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/* ===== COMPONENT ===== */

export function Header({
  title,
  actions,
  children,
  className = '',
}: HeaderProps) {
  const { toggleLeft, toggleRight, isRightOpen } = useDashboard();

  // Override mode
  if (children) {
    return (
      <header
        className={`border-border bg-background flex h-16 items-center justify-between border-b px-4 ${className}`}
      >
        {children}
      </header>
    );
  }

  return (
    <header
      className={`border-border bg-background flex h-16 items-center justify-between border-b px-4 ${className}`}
    >
      {/* ===== BÊN TRÁI: Hamburger + Title ===== */}
      <div className="flex items-center gap-3">
        {/**
         * NÚT HAMBURGER MENU
         * - lg:hidden: Chỉ hiện trên Tablet/Mobile (< 1024px)
         * - Dùng để toggle SidebarLeft drawer
         *
         * Tại sao lg:hidden mà không phải md:hidden?
         * - Breakpoint Desktop là 1024px (lg) theo thiết kế
         * - Dưới 1024px, SidebarLeft chuyển sang drawer mode
         * - Cần hamburger để mở drawer
         */}
        <button
          onClick={toggleLeft}
          className="hover:bg-accent rounded-lg p-2 transition-colors lg:hidden"
          aria-label="Mở menu điều hướng"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Title */}
        {title && (
          <h1 className="font-display truncate text-lg font-medium">{title}</h1>
        )}
      </div>

      {/* ===== BÊN PHẢI: Actions + Toggle SidebarRight ===== */}
      <div className="flex items-center gap-2">
        {actions}

        {/**
         * NÚT TOGGLE SIDEBAR PHẢI
         * - LUÔN hiện trên tất cả breakpoints
         * - Vì SidebarRight có thể bị unmount (trên Desktop khi close)
         * - Button PHẢI nằm ngoài SidebarRight để user có thể mở lại
         *
         * FLOW:
         * User click button → toggleRight() → isRightOpen thay đổi
         * → DashboardLayout re-render → SidebarRight mount/unmount
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

export default Header;
