/**
 * ============================================
 * HEADER SEARCH COMPONENT
 * ============================================
 *
 * Component tìm kiếm trên Header.
 * Hiển thị dạng Dialog popup khi click vào icon.
 *
 * Tính năng:
 * - Icon trigger mở dialog
 * - Input với nút clear (X)
 * - Có thể truyền callback onSearch từ parent
 *
 * Cấu trúc files:
 * - HeaderSearch.tsx: Component chính (file này)
 * - types.ts: TypeScript interfaces
 * - useSearch.ts: Custom hook xử lý logic
 */

import React from 'react';
import { Search, X } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/animate-ui/components/radix/dialog';

// Local imports
import type { HeaderSearchProps } from './types';
import { useSearch } from './useSearch';

export function HeaderSearch({
  onSearch,
  placeholder = 'Bạn tìm kiếm điều gì?',
  title = 'Tìm kiếm',
}: HeaderSearchProps) {
  const { searchValue, setSearchValue, handleClear, handleSubmit } = useSearch({
    onSearch,
  });

  /**
   * Xử lý khi user nhấn Enter
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="bg-background flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors focus:outline-none"
          aria-label="Mở tìm kiếm"
        >
          <Search className="text-muted-foreground h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[550px]">
        <DialogHeader className="px-4 py-2">
          <DialogTitle className="font-signature! py-2 text-base lg:text-xl">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4">
          <div className="relative flex items-center">
            {/* Icon tìm kiếm bên trái */}
            <Search className="text-muted-foreground absolute left-3 h-4 w-4" />

            {/* Input chính */}
            <input
              className="bg-sidebar placeholder:text-foreground/60 flex h-12 w-full rounded-full px-10 py-3 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              aria-label="Nhập từ khóa tìm kiếm"
            />

            {/* Nút clear (X) - Chỉ hiện khi có text */}
            {searchValue && (
              <button
                onClick={handleClear}
                className="text-muted-foreground hover:bg-background hover:text-foreground absolute right-3 rounded-full p-1 transition-all"
                aria-label="Xóa nội dung tìm kiếm"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Placeholder cho kết quả hoặc lịch sử tìm kiếm */}
          <div className="mt-8 py-4 text-center">
            <p className="text-muted-foreground text-sm italic">
              Nhập từ khóa để bắt đầu tìm kiếm...
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
