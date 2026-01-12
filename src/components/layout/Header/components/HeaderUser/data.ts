import type { UserData } from './types';

/**
 * ============================================
 * MOCK DATA CHO HEADER USER
 * ============================================
 *
 * File này chứa dữ liệu mẫu cho user.
 * Sau này sẽ được thay thế bằng API call thật.
 *
 * Tách riêng file để:
 * 1. Dễ thay thế khi có API
 * 2. Không lẫn lộn với logic component
 * 3. Có thể import ở nhiều nơi (test, storybook, etc.)
 */

export const mockUserData: UserData = {
  name: 'Đoàn Minh',
  email: 'doanmihh15@gmail.com',
  avatarUrl: undefined, // Chưa có ảnh thật
  coverUrl: undefined, // Chưa có ảnh bìa thật
};
