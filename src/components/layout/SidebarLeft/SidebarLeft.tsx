'use client';

/**
 * ===================================================================
 * SIDEBAR LEFT COMPONENT
 * ===================================================================
 *
 * Sidebar trái chứa navigation menu của dashboard.
 * Có khả năng thu gọn (collapse) để tiết kiệm không gian màn hình.
 *
 * Đặc điểm:
 * - Scroll độc lập (không ảnh hưởng đến main content)
 * - Thu gọn thành icon khi collapsed
 * - Responsive: Ẩn thành drawer trên mobile
 */

import React, { type ReactNode } from 'react';
import { useDashboard } from '@/components/providers/DashboardContext';

/* ===== TYPES ===== */

interface SidebarLeftProps {
  /** Nội dung bên trong sidebar (menu, logo, user info...) */
  children?: ReactNode;
  /** Class CSS bổ sung */
  className?: string;
}

/* ===== COMPONENT ===== */

export function SidebarLeft({ children, className = '' }: SidebarLeftProps) {
  const { isLeftSidebarCollapsed, toggleLeftSidebar } = useDashboard();

  return (
    <aside
      className={`sidebar-left ${isLeftSidebarCollapsed ? 'collapsed' : ''} ${className}`}
      aria-label="Sidebar điều hướng chính"
    >
      {/* Header Sidebar: Logo + Toggle Button */}
      <div className="border-sidebar-border flex items-center justify-between border-b p-4">
        {/* Logo - Ẩn khi collapsed */}
        {!isLeftSidebarCollapsed && (
          <div className="font-display text-lg font-semibold">Dashboard</div>
        )}

        {/* Nút Toggle Collapse */}
        <button
          onClick={toggleLeftSidebar}
          className="hover:bg-sidebar-accent flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
          aria-label={
            isLeftSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'
          }
          title={isLeftSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
        >
          <svg
            className={`h-5 w-5 transition-transform duration-300 ${isLeftSidebarCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Nội dung Sidebar */}
      {children || (
        <div className="p-4">
          {/* Menu items placeholder */}
          <nav className="space-y-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className={`bg-sidebar-accent animate-pulse rounded ${isLeftSidebarCollapsed ? 'mx-auto h-10 w-10' : 'h-10 w-full'}`}
              />
            ))}
          </nav>

          {/* Collapsed mode: Hiển thị label nhỏ */}
          {isLeftSidebarCollapsed && (
            <p className="text-muted-foreground mt-4 text-center text-xs">
              Hover để xem
            </p>
          )}
        </div>
      )}
    </aside>
  );
}

/* ===== EXPORT MẶC ĐỊNH ===== */
export default SidebarLeft;
