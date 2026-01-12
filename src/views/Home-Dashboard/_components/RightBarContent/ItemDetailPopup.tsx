/**
 * =============================================================================
 * FILE: ItemDetailPopup.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Popup hiển thị chi tiết công việc khi click vào item.
 *   Chỉ để xem thông tin, không edit sâu.
 *
 * NGUYÊN TẮC (theo Design Constitution):
 *   - Popup chỉ để xem, không chứa form phức tạp
 *   - Không shadow (exception: backdrop overlay là ok)
 *   - Transition 150ms
 *
 * UI:
 *   - Overlay backdrop mờ
 *   - Card popup ở giữa hoặc slide từ phải
 *   - Close khi click backdrop hoặc nút X
 *
 * =============================================================================
 */

'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { formatShortDate } from '../../_utils';
import type { DraggableItem } from '../../_data';

// =============================================================================
// TYPES
// =============================================================================

interface ItemDetailPopupProps {
  /** Item cần hiển thị chi tiết */
  item: DraggableItem;
  /** Callback khi đóng popup */
  onClose: () => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ItemDetailPopup - Popup xem chi tiết công việc
 *
 * Layout:
 * ┌─────────────────────────────────────────────────┐
 * │ Chi tiết công việc                           X  │
 * ├─────────────────────────────────────────────────┤
 * │ Tiêu đề                                         │
 * │ Review bài viết SEO sản phẩm mới                │
 * │                                                 │
 * │ Ngày                                            │
 * │ 13/01/2026                                      │
 * │                                                 │
 * │ Ưu tiên                                         │
 * │ ● Cao                                           │
 * └─────────────────────────────────────────────────┘
 */
export function ItemDetailPopup({ item, onClose }: ItemDetailPopupProps) {
  /**
   * Handle ESC key để đóng popup
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  /**
   * Lấy label và màu cho priority
   */
  const getPriorityInfo = () => {
    switch (item.priority) {
      case 'high':
        return {
          label: 'Cao',
          dotClass: 'bg-rose-500',
          textClass: 'text-rose-600 dark:text-rose-400',
        };
      case 'medium':
        return {
          label: 'Trung bình',
          dotClass: 'bg-amber-500',
          textClass: 'text-amber-600 dark:text-amber-400',
        };
      case 'low':
      default:
        return {
          label: 'Thấp',
          dotClass: 'bg-muted-foreground/30',
          textClass: 'text-muted-foreground',
        };
    }
  };

  const priority = getPriorityInfo();

  return (
    <>
      {/*
       * Backdrop overlay
       * Click để đóng popup
       */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/*
       * Popup content
       * Position: fixed, center on desktop, bottom on mobile
       * Không dùng shadow theo Design Constitution
       * Thay vào đó dùng bg khác biệt với backdrop
       */}
      <div className="bg-background fixed top-1/2 left-1/2 z-50 w-80 -translate-x-1/2 -translate-y-1/2 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
            Chi tiết công việc
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors duration-150"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Tiêu đề */}
          <div>
            <span className="text-muted-foreground text-xs">Tiêu đề</span>
            <p className="mt-1 font-medium">{item.title}</p>
          </div>

          {/* Ngày */}
          <div>
            <span className="text-muted-foreground text-xs">Ngày</span>
            <p className="mt-1 tabular-nums">{formatShortDate(item.date)}</p>
          </div>

          {/* Ưu tiên */}
          <div>
            <span className="text-muted-foreground text-xs">Ưu tiên</span>
            <div className="mt-1 flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${priority.dotClass}`} />
              <span className={priority.textClass}>{priority.label}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default ItemDetailPopup;
