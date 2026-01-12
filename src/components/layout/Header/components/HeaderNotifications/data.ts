import type { Notification } from './types';

/**
 * Mock data cho thông báo
 * Sau này thay bằng API call
 */
export const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'Đơn hàng mới',
    message: 'Bạn có đơn hàng #1234 mới',
    time: '5 phút trước',
    isRead: false,
  },
  {
    id: 2,
    title: 'Thanh toán thành công',
    message: 'Đơn hàng #1233 đã được thanh toán',
    time: '1 giờ trước',
    isRead: false,
  },
  {
    id: 3,
    title: 'Cập nhật hệ thống',
    message: 'Phiên bản mới đã sẵn sàng',
    time: '2 giờ trước',
    isRead: true,
  },
  {
    id: 4,
    title: 'Đơn hàng hoàn tất',
    message: 'Đơn hàng #1232 đã giao thành công',
    time: '3 giờ trước',
    isRead: true,
  },
  {
    id: 5,
    title: 'Khuyến mãi mới',
    message: 'Chương trình giảm giá 20% bắt đầu',
    time: '5 giờ trước',
    isRead: true,
  },
];
