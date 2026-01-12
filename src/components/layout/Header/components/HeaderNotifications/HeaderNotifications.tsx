'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/animate-ui/primitives/radix/dropdown-menu';
import { TextHover } from '@/components/ui/TextHover';

// Local imports
import { useNotifications } from './useNotifications';
import { NotificationItem } from './NotificationItem';

// ============================================
// Component
// ============================================
export function HeaderNotifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="bg-background relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full"
          aria-label="Thông báo"
        >
          <Bell className="h-5 w-5" />
          {/* Chỉ hiện badge khi có thông báo chưa đọc */}
          {unreadCount > 0 && (
            <span className="dark:border-background absolute top-2.5 right-2.5 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="bg-popover text-popover-foreground z-50 w-[320px] overflow-hidden rounded-xl border p-0 shadow-lg"
      >
        {/* Header */}
        <div className="px-3 py-2">
          <DropdownMenuLabel className="flex items-center justify-between p-0">
            <span className="text-sm font-semibold">Thông báo</span>
            {unreadCount > 0 && (
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                {unreadCount} chưa đọc
              </span>
            )}
          </DropdownMenuLabel>
        </div>

        <DropdownMenuSeparator className="bg-border m-0 h-px" />

        {/* Scrollable Notification List - Max height 300px, hidden scrollbar */}
        <div className="scrollbar-hide max-h-[300px] overflow-y-auto p-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))}
        </div>

        {/* Footer - Mark all as read */}
        {unreadCount > 0 && (
          <>
            <DropdownMenuSeparator className="bg-border m-0 h-px" />
            <div className="p-2">
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  markAllAsRead();
                }}
                className="text-primary flex cursor-pointer justify-center rounded-lg px-2 py-2 text-sm font-normal outline-none"
              >
                <TextHover>Đánh dấu tất cả là đã đọc</TextHover>
              </DropdownMenuItem>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
