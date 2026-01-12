import { useState, useEffect } from 'react';
import type { UserData } from './types';
import { mockUserData } from './data';

/**
 * ============================================
 * CUSTOM HOOK CHO USER LOGIC
 * ============================================
 *
 * Hook này quản lý toàn bộ logic của HeaderUser:
 * - State loading (đang fetch data)
 * - State userData (dữ liệu user)
 * - Simulate fetch nếu không có props
 *
 * Tách ra khỏi component để:
 * 1. Dễ test riêng logic
 * 2. Có thể reuse ở nơi khác
 * 3. Component gọn hơn, chỉ lo render UI
 * 4. Tránh ESLint warning về setState trong useEffect
 */

interface UseUserOptions {
  /** Dữ liệu user từ parent (nếu có) */
  user?: UserData;
  /** Trạng thái loading từ parent (nếu có) */
  isLoading?: boolean;
}

interface UseUserReturn {
  /** Dữ liệu user hiện tại */
  userData: UserData | undefined;
  /** Đang loading hay không */
  loading: boolean;
}

export function useUser({
  user,
  isLoading = false,
}: UseUserOptions = {}): UseUserReturn {
  const [loading, setLoading] = useState(isLoading);
  const [userData, setUserData] = useState<UserData | undefined>(user);

  useEffect(() => {
    // Nếu có user prop thì dùng luôn
    if (user) {
      setUserData(user);
      setLoading(isLoading);
      return;
    }

    // Nếu không có user prop, simulate fetch với mock data
    // Sau này thay bằng API call thật
    setLoading(true);
    const timer = setTimeout(() => {
      setUserData(mockUserData);
      setLoading(false);
    }, 1500); // Delay 1.5s để simulate network

    return () => clearTimeout(timer);
  }, [user, isLoading]);

  return {
    userData,
    loading,
  };
}
