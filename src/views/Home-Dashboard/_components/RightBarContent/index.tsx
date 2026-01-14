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
 *   - Quản lý state popup (view/edit/create task)
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

import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { DraggableItemList } from './DraggableItemList';
import { CalendarPanel } from './CalendarPanel';
import { ItemDetailPopup } from './ItemDetailPopup';
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
 * │ CÔNG VIỆC                        [+ Thêm]      │
 * │ ● Review bài viết SEO...                        │
 * │ ● Cập nhật banner...                            │
 * │ ● ...                                           │
 * │                                                 │
 * ├─────────────────────────────────────────────────┤
 * │ LỊCH                                            │
 * │ [Calendar Grid]                                 │
 * └─────────────────────────────────────────────────┘
 */
export function RightBarContent({
  items: initialItems,
  isLoading,
}: RightBarContentProps) {
  // ============== STATE ==============

  // Danh sách tasks (local state để có thể update khi save)
  const [items, setItems] = useState<DraggableItem[]>(initialItems || []);

  // Popup state
  const [selectedItem, setSelectedItem] = useState<DraggableItem | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMode, setPopupMode] = useState<'view' | 'edit'>('view');

  // NOTE: KHÔNG sync initialItems từ props vào local state qua useEffect
  // vì sẽ gây ra bug: khi popup đóng, re-render sẽ reset local state về props cũ
  // useState(initialItems) đã handle initial sync rồi

  // ============== HANDLERS ==============

  /**
   * Mở popup xem chi tiết task
   */
  const handleItemClick = useCallback((item: DraggableItem) => {
    setSelectedItem(item);
    setPopupMode('view');
    setIsPopupOpen(true);
  }, []);

  /**
   * Mở popup tạo task mới
   */
  const handleAddTask = useCallback(() => {
    setSelectedItem(null); // null = create new
    setPopupMode('edit');
    setIsPopupOpen(true);
  }, []);

  /**
   * Đóng popup
   */
  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
    setSelectedItem(null);
  }, []);

  /**
   * Lưu task (create hoặc update)
   * - Update: thay thế tại vị trí cũ (giữ nguyên thứ tự đã kéo)
   * - Create: insert vào đúng vị trí theo thứ tự thời gian (deadline ascending)
   */
  const handleSaveTask = useCallback((updatedItem: DraggableItem) => {
    setItems((prevItems) => {
      // Kiểm tra xem là update hay create
      const existingIndex = prevItems.findIndex((i) => i.id === updatedItem.id);

      if (existingIndex !== -1) {
        // ============================================
        // UPDATE EXISTING: Giữ nguyên vị trí đã kéo
        // ============================================
        const newItems = [...prevItems];
        newItems[existingIndex] = updatedItem;
        return newItems;
      } else {
        // ============================================
        // CREATE NEW: Insert vào đúng vị trí theo deadline
        // Logic: Tìm vị trí đầu tiên có deadline > task mới
        // ============================================
        const newDate = new Date(updatedItem.date).getTime();

        // Tìm vị trí insert (sorted by deadline ascending)
        let insertIndex = prevItems.length; // Mặc định: cuối danh sách

        for (let i = 0; i < prevItems.length; i++) {
          const itemDate = new Date(prevItems[i].date).getTime();
          // Tìm vị trí đầu tiên có deadline SAU task mới
          if (itemDate > newDate) {
            insertIndex = i;
            break;
          }
        }

        // Insert tại vị trí đã tìm
        const newItems = [...prevItems];
        newItems.splice(insertIndex, 0, updatedItem);
        return newItems;
      }
    });
  }, []);

  /**
   * Xử lý khi items được reorder (từ DraggableItemList)
   * Điều này đảm bảo parent luôn có thứ tự mới nhất
   */
  const handleItemsReorder = useCallback((reorderedItems: DraggableItem[]) => {
    setItems(reorderedItems);
  }, []);

  // ============== RENDER ==============

  return (
    <div className="flex h-full flex-col p-2">
      {/*
       * ====================================
       * Công việc (Task List) - PRIMARY
       * ====================================
       * Header với nút "+ Thêm công việc"
       */}
      <div className="dashboard-section bg-sidebar pb-4">
        {/* Header: Tiêu đề + Nút thêm */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-foreground text-base font-medium">Công việc</h3>
          <button
            onClick={handleAddTask}
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm
          </button>
        </div>

        {/* Task List - key forces re-render when items change */}
        <DraggableItemList
          key={items
            .map((i) => `${i.id}-${i.priority}-${new Date(i.date).getTime()}`)
            .join(',')}
          items={items}
          isLoading={isLoading}
          onItemClick={handleItemClick}
          onItemsReorder={handleItemsReorder}
        />
      </div>

      {/*
       * ====================================
       * Lịch (Calendar) - SECONDARY
       * ====================================
       * Cố định ở cuối, spacing 32px (mt-8) tách khỏi task list
       */}
      {/*
       * ====================================
       * Lịch (Calendar) - SECONDARY
       * ====================================
       */}
      <div className="mt-2">
        <CalendarPanel />
      </div>

      {/*
       * ====================================
       * Item Detail Popup
       * ====================================
       * Hiển thị chi tiết / chỉnh sửa / tạo mới task
       */}
      {isPopupOpen && (
        <ItemDetailPopup
          item={selectedItem}
          onClose={handleClosePopup}
          onSave={handleSaveTask}
          defaultMode={popupMode}
        />
      )}
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
