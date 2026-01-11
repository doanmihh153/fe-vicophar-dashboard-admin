'use client';

/**
 * ===================================================================
 * HEADER COMPONENT
 * ===================================================================
 *
 * Header cố định phía trên main content area.
 * Chứa các thành phần như: breadcrumb, search, actions, user menu...
 *
 * Đặc điểm:
 * - Chiều cao cố định (--header-height)
 * - Không scroll theo content
 * - Có thể chứa các action buttons
 */

import React, { type ReactNode } from 'react';
import { useDashboard } from '@/components/providers/DashboardContext';

/* ===== TYPES ===== */

interface HeaderProps {
  /** Nội dung breadcrumb hoặc title */
  title?: string;
  /** Các action buttons bên phải */
  actions?: ReactNode;
  /** Override toàn bộ nội dung header */
  children?: ReactNode;
  /** Class CSS bổ sung */
  className?: string;
}

/* ===== COMPONENT ===== */

export function Header({
  title,
  actions,
  children,
  className = '',
}: HeaderProps) {
  const { toggleLeftSidebar, toggleRightPanel, isRightPanelOpen } =
    useDashboard();

  // Nếu có children, render children thay vì layout mặc định
  if (children) {
    return (
      <header className={`dashboard-header ${className}`}>{children}</header>
    );
  }

  return (
    <header className={`dashboard-header ${className}`}>
      {/* Bên trái: Toggle sidebar + Title/Breadcrumb */}
      <div className="flex items-center gap-4">
        {/* Nút toggle sidebar trái (hiện trên mobile/tablet) */}
        <button
          onClick={toggleLeftSidebar}
          className="hover:bg-accent rounded-lg p-2 transition-colors lg:hidden"
          aria-label="Toggle sidebar trái"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Title hoặc Breadcrumb */}
        {title && (
          <h1 className="font-display truncate text-lg font-medium">{title}</h1>
        )}
      </div>

      {/* Bên phải: Actions */}
      <div className="ml-auto flex items-center gap-2">
        {/* Custom actions */}
        {actions}

        {/* Nút toggle sidebar phải */}
        <button
          onClick={toggleRightPanel}
          className={`rounded-lg p-2 transition-colors ${
            isRightPanelOpen
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent'
          }`}
          aria-label="Toggle sidebar phải"
          aria-pressed={isRightPanelOpen}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}

/* ===== EXPORT MẶC ĐỊNH ===== */
export default Header;
