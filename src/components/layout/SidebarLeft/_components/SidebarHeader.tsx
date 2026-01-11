'use client';

/**
 * SidebarHeader Component
 * Header của sidebar với Logo và Toggle button
 */

import React from 'react';
import { useDashboard } from '@/components/providers/DashboardContext';
import { CheckCircle, ChevronLeft } from 'lucide-react';

export interface SidebarHeaderProps {
  /** Brand name hiển thị bên cạnh logo */
  brandName?: string;
  /** Custom logo icon (mặc định: CheckCircle) */
  logoIcon?: React.ReactNode;
}

export function SidebarHeader({
  brandName = 'Vicophar',
  logoIcon,
}: SidebarHeaderProps) {
  const { isLeftSidebarCollapsed, toggleLeftSidebar } = useDashboard();

  return (
    <div
      className={`flex items-center px-4 py-5 ${isLeftSidebarCollapsed ? 'justify-center' : 'justify-between'}`}
    >
      {/* Logo + Brand Name (ẩn khi collapsed) */}
      {!isLeftSidebarCollapsed && (
        <div className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-lg">
            {logoIcon || <CheckCircle className="h-6 w-6" />}
          </div>
          {/* Brand Name */}
          <span className="font-display text-xl font-bold">{brandName}</span>
        </div>
      )}

      {/* Nút Toggle - LUÔN hiển thị */}
      {/**
       * - Khi MỞ: Icon ChevronLeft (thu gọn)
       * - Khi ĐÓNG: Icon ChevronRight (mở rộng)
       */}
      <button
        onClick={toggleLeftSidebar}
        className={`text-muted-foreground hover:bg-accent hover:text-foreground flex items-center justify-center rounded-lg transition-colors ${isLeftSidebarCollapsed ? 'bg-accent/50 h-10 w-10' : 'h-8 w-8'} `}
        aria-label={
          isLeftSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'
        }
        title={isLeftSidebarCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
      >
        <ChevronLeft
          className={`h-5 w-5 transition-transform duration-300 ${isLeftSidebarCollapsed ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  );
}

export default SidebarHeader;
