import React from 'react';
import { DropdownMenuItem } from '@/components/animate-ui/primitives/radix/dropdown-menu';
import type { NotificationItemProps } from './types';

/**
 * Component hiển thị một notification item
 */
export function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  return (
    <DropdownMenuItem
      onClick={() => onMarkAsRead(notification.id)}
      className={`hover:bg-hover-card focus:bg-hover-card my-1 flex cursor-pointer flex-col gap-1 rounded-lg px-2 py-2 text-sm outline-none ${
        !notification.isRead ? 'bg-primary/5' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        {/* Chấm tròn chỉ báo chưa đọc */}
        {!notification.isRead && (
          <span className="bg-label-bg h-2 w-2 shrink-0 rounded-full"></span>
        )}
        <span
          className={`font-display ${notification.isRead ? 'text-foreground' : 'text-primary'}`}
        >
          {notification.title}
        </span>
      </div>
      <span className="text-muted-foreground pl-4 text-xs">
        {notification.message}
      </span>
      <span className="text-muted-foreground pl-4 text-xs">
        {notification.time}
      </span>
    </DropdownMenuItem>
  );
}
