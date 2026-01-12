/**
 * =============================================================================
 * FILE: RightBarContent/index.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Container chính cho nội dung Right Bar của Home Dashboard.
 *   Bao gồm DraggableItemList (công việc) và CalendarPanel (lịch).
 *
 * VAI TRÒ:
 *   - Layout container cho right bar
 *   - Phân phối data xuống component con
 *   - Right bar là CONTEXT panel, không phải navigation
 *
 * LAYOUT:
 *   - Flex column, h-full
 *   - TaskList chiếm flex-1 (phần chính)
 *   - Calendar ở cuối (cố định)
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import { DraggableItemList } from './DraggableItemList';
import { CalendarPanel } from './CalendarPanel';
import type { DraggableItem } from '../../_data';

// =============================================================================
// TYPES
// =============================================================================

interface RightBarContentProps {
  /** Danh sách công việc */
  items?: DraggableItem[];
  /** Trạng thái loading */
  isLoading: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * RightBarContent - Container cho Right Bar
 *
 * Layout:
 * ┌─────────────────────────────────────────────────┐
 * │ CÔNG VIỆC                                       │
 * │ ● Review bài viết SEO...                        │
 * │ ● Cập nhật banner...                            │
 * │ ● ...                                           │
 * │                                                 │
 * ├─────────────────────────────────────────────────┤
 * │ LỊCH                                            │
 * │ [Calendar Grid]                                 │
 * └─────────────────────────────────────────────────┘
 */
export function RightBarContent({ items, isLoading }: RightBarContentProps) {
  return (
    <div className="flex h-full flex-col p-4">
      {/*
       * ====================================
       * Công việc (Task List)
       * ====================================
       * Chiếm phần lớn không gian (flex-1)
       */}
      <div className="mb-8 flex-1">
        <h3 className="text-muted-foreground mb-4 text-xs font-medium tracking-wide uppercase">
          Công việc
        </h3>
        <DraggableItemList items={items} isLoading={isLoading} />
      </div>

      {/*
       * ====================================
       * Lịch (Calendar)
       * ====================================
       * Cố định ở cuối right bar
       */}
      <div>
        <h3 className="text-muted-foreground mb-4 text-xs font-medium tracking-wide uppercase">
          Lịch
        </h3>
        <CalendarPanel />
      </div>
    </div>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default RightBarContent;
export { DraggableItemList } from './DraggableItemList';
export { TaskItem } from './TaskItem';
export { ItemDetailPopup } from './ItemDetailPopup';
export { CalendarPanel } from './CalendarPanel';
