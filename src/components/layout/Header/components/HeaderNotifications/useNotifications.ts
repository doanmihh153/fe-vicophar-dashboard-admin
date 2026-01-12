import { useState } from 'react';
import type { Notification } from './types';
import { mockNotifications } from './data';

/**
 * Custom hook quản lý state của notifications
 * @returns notifications, unreadCount, markAsRead, markAllAsRead
 */
export function useNotifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  // Đếm số thông báo chưa đọc
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Đánh dấu một thông báo là đã đọc
  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Đánh dấu tất cả là đã đọc
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}
