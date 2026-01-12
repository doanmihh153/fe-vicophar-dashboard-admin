/**
 * ============================================
 * TYPES CHO HEADER USER
 * ============================================
 *
 * File này chứa các TypeScript interface cho HeaderUser component.
 * Tách riêng để dễ maintain và reuse.
 */

/**
 * Dữ liệu user hiển thị trong dropdown
 *
 * @property name - Tên hiển thị của user
 * @property email - Email của user
 * @property avatarUrl - URL ảnh đại diện (optional)
 * @property coverUrl - URL ảnh bìa (optional)
 */
export interface UserData {
  name: string;
  email: string;
  avatarUrl?: string;
  coverUrl?: string;
}

/**
 * Props cho HeaderUser component
 *
 * @property user - Dữ liệu user (nếu không truyền, dùng mock data)
 * @property isLoading - Trạng thái loading
 * @property onEditProfile - Callback khi user bấm "Chỉnh sửa hồ sơ"
 */
export interface HeaderUserProps {
  user?: UserData;
  isLoading?: boolean;
  onEditProfile?: () => void;
}
