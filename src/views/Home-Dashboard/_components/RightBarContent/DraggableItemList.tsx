/**
 * =============================================================================
 * FILE: DraggableItemList.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Danh sách các công việc trong Right Bar.
 *   Hiện tại implement Click-to-view.
 *   Drag-to-reorder có thể thêm sau với dnd-kit.
 *
 * INTERACTION (theo Design Constitution):
 *   - Click = primary action (mở popup xem chi tiết)
 *   - Drag = secondary action (sắp xếp lại)
 *
 * NGUYÊN TẮC:
 *   - Không chứa business logic
 *   - Quản lý state selected item
 *   - Trigger ItemDetailPopup khi click
 *
 * =============================================================================
 */

'use client';

import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import { TaskItem } from './TaskItem';
import { ItemDetailPopup } from './ItemDetailPopup';
import type { DraggableItem } from '../../_data';

// =============================================================================
// TYPES
// =============================================================================

interface DraggableItemListProps {
  /** Danh sách items */
  items?: DraggableItem[];
  /** Trạng thái loading */
  isLoading: boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Số lượng skeleton items khi loading */
const SKELETON_COUNT = 5;

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * DraggableItemList - Danh sách công việc
 *
 * Layout:
 * ┌─────────────────────────────────────────────────┐
 * │ ● Review bài viết SEO sản phẩm mới              │
 * │ ● Cập nhật banner trang chủ                     │
 * │ ● Kiểm tra đơn hàng tồn đọng                    │
 * │ ...                                              │
 * └─────────────────────────────────────────────────┘
 */
export function DraggableItemList({
  items,
  isLoading,
}: DraggableItemListProps) {
  // State quản lý item đang được chọn để xem detail
  const [selectedItem, setSelectedItem] = useState<DraggableItem | null>(null);

  /**
   * Handler khi click vào một item
   */
  const handleItemClick = (item: DraggableItem) => {
    setSelectedItem(item);
  };

  /**
   * Handler khi đóng popup
   */
  const handleClosePopup = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <ul className="space-y-1">
        {isLoading
          ? // Skeleton placeholders
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <li key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-4 w-full rounded-md" />
              </li>
            ))
          : // Actual task items
            items?.map((item) => (
              <li key={item.id}>
                <TaskItem item={item} onClick={handleItemClick} />
              </li>
            ))}
      </ul>

      {/* Detail Popup - hiển thị khi có item được chọn */}
      {selectedItem && (
        <ItemDetailPopup item={selectedItem} onClose={handleClosePopup} />
      )}
    </>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default DraggableItemList;
