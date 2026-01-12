/**
 * ============================================
 * TYPES CHO HEADER SEARCH
 * ============================================
 *
 * File này chứa các TypeScript interface cho HeaderSearch component.
 * Tách riêng để dễ maintain và reuse.
 */

/**
 * Props cho HeaderSearch component
 *
 * @property onSearch - Callback khi user submit tìm kiếm
 * @property placeholder - Text placeholder cho input (mặc định: "Bạn tìm kiếm điều gì?")
 * @property title - Tiêu đề dialog (mặc định: "Tìm kiếm")
 */
export interface HeaderSearchProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  title?: string;
}
