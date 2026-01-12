/**
 * ============================================
 * HEADER ACTIONS COMPONENT
 * ============================================
 *
 * Component này gom nhóm các action buttons trên Header.
 *
 * Bao gồm:
 * - Search: Mở dialog tìm kiếm
 * - Notifications: Mở dropdown thông báo
 * - User: Mở dropdown profile
 * - Theme Toggler: Đổi giao diện sáng/tối
 *
 * Tính năng:
 * - TooltipProvider bọc toàn bộ để có tooltip cho các icon
 * - Responsive gap: nhỏ hơn trên mobile (gap-2), to hơn trên desktop (gap-4)
 */

'use client';

import React from 'react';
import { ThemeToggler } from '@/components/ui/DarkTheme/ThemeToggler';
import { HeaderSearch } from './HeaderSearch/HeaderSearch';
import { HeaderNotifications } from './HeaderNotifications/HeaderNotifications';
import { HeaderUser } from './HeaderUser/HeaderUser';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/animate-ui/primitives/animate/tooltip';

export function HeaderActions() {
  return (
    <TooltipProvider openDelay={300} closeDelay={100}>
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Search - Có tooltip "Tìm kiếm" */}
        <Tooltip side="bottom" sideOffset={8}>
          <TooltipTrigger asChild>
            <div>
              <HeaderSearch />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-sidebar text-sidebar-foreground z-50 rounded-lg border px-3 py-1.5 text-sm shadow-md">
            Tìm kiếm
          </TooltipContent>
        </Tooltip>

        {/* Notification - Có tooltip "Thông báo" */}
        <Tooltip side="bottom" sideOffset={8}>
          <TooltipTrigger asChild>
            <div>
              <HeaderNotifications />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-sidebar text-sidebar-foreground z-50 rounded-lg border px-3 py-1.5 text-sm shadow-md">
            Thông báo
          </TooltipContent>
        </Tooltip>

        {/* Avatar / User Profile - Có tooltip "Tài khoản" */}
        <Tooltip side="bottom" sideOffset={8}>
          <TooltipTrigger asChild>
            <div>
              <HeaderUser />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-sidebar text-sidebar-foreground z-50 rounded-lg border px-3 py-1.5 text-sm shadow-md">
            Tài khoản
          </TooltipContent>
        </Tooltip>

        {/* Theme Toggler - Có tooltip "Dark-mode" */}
        <Tooltip side="bottom" sideOffset={8}>
          <TooltipTrigger asChild>
            <div>
              <ThemeToggler />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-sidebar text-sidebar-foreground z-50 rounded-lg border px-3 py-1.5 text-sm shadow-md">
            Dark-mode
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
