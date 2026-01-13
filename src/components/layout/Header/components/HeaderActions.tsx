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
 * NOTE: Đã xóa animate-ui tooltips vì gây lag khi toggle theme.
 */

'use client';

import React from 'react';
import { ThemeToggler } from '@/components/ui/DarkTheme/ThemeToggler';
import { HeaderSearch } from './HeaderSearch/HeaderSearch';
import { HeaderNotifications } from './HeaderNotifications/HeaderNotifications';
import { HeaderUser } from './HeaderUser/HeaderUser';

export function HeaderActions() {
  return (
    <div className="flex items-center gap-2 lg:gap-4">
      {/* Search */}
      <HeaderSearch />

      {/* Notification */}
      <HeaderNotifications />

      {/* Avatar / User Profile */}
      <HeaderUser />

      {/* Theme Toggler */}
      <ThemeToggler />
    </div>
  );
}
