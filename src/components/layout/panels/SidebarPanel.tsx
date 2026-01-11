'use client';

/**
 * ===================================================================
 * SIDEBAR PANEL - UI PRIMITIVE CHO GRID MODE
 * ===================================================================
 *
 * Component này là UI PRIMITIVE thuần cho sidebar trong grid.
 *
 * ===================================================================
 * NGUYÊN TẮC COLLAPSE (QUAN TRỌNG)
 * ===================================================================
 *
 * COLLAPSE KHÔNG ĐƯỢC:
 * - hidden
 * - display: none
 * - unmount component
 * - width: 0
 *
 * COLLAPSE PHẢI:
 * - LUÔN render (giữ DOM structure)
 * - LUÔN chiếm grid column
 * - Width được điều khiển bởi PARENT (grid-template-columns)
 *
 * VÌ SAO COLLAPSE KHÔNG ĐƯỢC PHÁ GRID?
 * ------------------------------------
 * Grid layout dựa vào số lượng children items.
 * Nếu SidebarPanel bị hidden/unmount:
 * - Grid mất 1 item
 * - MainContent bị nhảy sang vị trí sai
 * - Layout vỡ hoàn toàn
 *
 * ===================================================================
 * WIDTH ĐƯỢC ĐIỀU KHIỂN BỞI PARENT
 * ===================================================================
 * Parent (DashboardLayout) set grid-template-columns:
 * - OPEN: grid-cols-[260px_1fr_320px]
 * - COLLAPSE: grid-cols-[64px_1fr_320px]
 *
 * SidebarPanel CHỈ nhận và fill grid column, KHÔNG set width riêng.
 * Điều này đảm bảo grid luôn ổn định.
 */

import React, { type ReactNode } from 'react';

/* ===== TYPES ===== */

interface SidebarPanelProps {
  /** Vị trí sidebar: trái hoặc phải */
  side: 'left' | 'right';

  /** Trạng thái thu gọn - dùng để điều chỉnh nội dung bên trong */
  isCollapsed?: boolean;

  /** Nội dung bên trong sidebar */
  children: ReactNode;

  /** Classes Tailwind bổ sung */
  className?: string;
}

/* ===== COMPONENT ===== */

export function SidebarPanel({
  side,
  isCollapsed = false,
  children,
  className = '',
}: SidebarPanelProps) {
  /**
   * BASE CLASSES
   * - flex flex-col: Layout dọc
   * - h-screen: Full height
   * - overflow-hidden: Ẩn phần tràn (quan trọng khi collapse)
   * - bg-sidebar: Background color từ theme
   *
   * ❌ KHÔNG có width class (w-[260px], w-[64px])
   * → Width được điều khiển bởi parent grid-template-columns
   */
  const baseClasses = 'flex flex-col h-screen overflow-hidden bg-sidebar';

  /**
   * BORDER CLASSES
   * - Left sidebar: border-r (viền bên phải)
   * - Right sidebar: border-l (viền bên trái)
   */
  const borderClasses =
    side === 'left'
      ? 'border-r border-sidebar-border'
      : 'border-l border-sidebar-border';

  /**
   * TRANSITION
   * Animation mượt khi parent thay đổi grid-template-columns
   */
  const transitionClasses = 'transition-all duration-300 ease-in-out';

  return (
    <aside
      className={` ${baseClasses} ${borderClasses} ${transitionClasses} ${className} `}
      aria-label={
        side === 'left' ? 'Sidebar điều hướng chính' : 'Sidebar phụ trợ'
      }
      /**
       * DATA ATTRIBUTE
       * Cho phép CSS external hoặc debug biết trạng thái collapse
       */
      data-collapsed={isCollapsed}
    >
      {children}
    </aside>
  );
}

export default SidebarPanel;
