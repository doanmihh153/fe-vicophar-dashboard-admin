/**
 * =============================================================================
 * FILE: TaskItem.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Component hiển thị một công việc đơn lẻ trong DraggableItemList.
 *   Click để mở popup xem chi tiết.
 *
 * INTERACTION:
 *   - Click là primary action
 *   - Drag là secondary (sẽ implement sau nếu cần)
 *   - Hover: bg-muted/50, transition 150ms
 *
 * COLOR LAW (Exception):
 *   - Priority dot là ngoại lệ duy nhất cho rounded-full với màu
 *   - High: rose-500
 *   - Medium: amber-500
 *   - Low: muted-foreground/30
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import type { DraggableItem } from '../../_data';

// =============================================================================
// TYPES
// =============================================================================

interface TaskItemProps {
  /** Dữ liệu task */
  item: DraggableItem;
  /** Callback khi click để xem chi tiết */
  onClick?: (item: DraggableItem) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * TaskItem - Item công việc trong Right Bar
 *
 * Layout:
 * ┌─────────────────────────────────────────────────┐
 * │ ● Review bài viết SEO sản phẩm mới              │
 * └─────────────────────────────────────────────────┘
 *
 * ● = Priority dot (rose/amber/muted theo priority)
 */
export function TaskItem({ item, onClick }: TaskItemProps) {
  /**
   * Xác định class cho priority dot
   * Đây là exception theo Design Constitution:
   * "Priority indicator là exception, chỉ dùng cho right bar"
   */
  const getPriorityDotClass = () => {
    switch (item.priority) {
      case 'high':
        return 'bg-rose-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
      default:
        return 'bg-muted-foreground/30';
    }
  };

  return (
    <button
      onClick={() => onClick?.(item)}
      className="hover:bg-muted/50 flex w-full items-center gap-3 p-3 text-left transition-colors duration-150"
    >
      {/* Priority indicator dot */}
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${getPriorityDotClass()}`}
      />

      {/* Task title - truncate nếu dài */}
      <span className="min-w-0 flex-1 truncate text-sm">{item.title}</span>
    </button>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default TaskItem;
