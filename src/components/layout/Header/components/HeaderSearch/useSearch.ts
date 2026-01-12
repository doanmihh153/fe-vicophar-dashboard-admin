import { useState, useCallback } from 'react';

/**
 * ============================================
 * CUSTOM HOOK CHO SEARCH LOGIC
 * ============================================
 *
 * Hook này quản lý toàn bộ logic của Search:
 * - State value của input
 * - Hành động clear input
 * - Hành động submit search
 *
 * Tách ra khỏi component để:
 * 1. Dễ test riêng logic
 * 2. Có thể reuse ở nơi khác
 * 3. Component gọn hơn, chỉ lo render UI
 */

interface UseSearchOptions {
  /** Callback khi user submit tìm kiếm */
  onSearch?: (query: string) => void;
}

interface UseSearchReturn {
  /** Giá trị hiện tại của ô input */
  searchValue: string;
  /** Setter cho searchValue */
  setSearchValue: (value: string) => void;
  /** Xóa nội dung ô input */
  handleClear: () => void;
  /** Submit tìm kiếm (gọi onSearch callback) */
  handleSubmit: () => void;
}

export function useSearch({
  onSearch,
}: UseSearchOptions = {}): UseSearchReturn {
  const [searchValue, setSearchValue] = useState('');

  /**
   * Xóa nội dung input
   * Được gọi khi user bấm nút X
   */
  const handleClear = useCallback(() => {
    setSearchValue('');
  }, []);

  /**
   * Submit tìm kiếm
   * Gọi callback onSearch nếu có và value không rỗng
   */
  const handleSubmit = useCallback(() => {
    if (searchValue.trim() && onSearch) {
      onSearch(searchValue.trim());
    }
  }, [searchValue, onSearch]);

  return {
    searchValue,
    setSearchValue,
    handleClear,
    handleSubmit,
  };
}
