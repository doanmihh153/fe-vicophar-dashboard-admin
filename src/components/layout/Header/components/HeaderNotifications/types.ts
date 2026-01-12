/**
 * Interface cho một thông báo đơn lẻ
 */
export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

/**
 * Props cho NotificationItem
 */
export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}
