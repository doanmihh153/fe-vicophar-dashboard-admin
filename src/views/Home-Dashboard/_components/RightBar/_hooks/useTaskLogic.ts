/**
 * =============================================================================
 * FILE: useTaskLogic.ts
 * =============================================================================
 * MÔ TẢ:
 *   Hook quản lý logic nghiệp vụ (CRUD) cho danh sách Task.
 *   Xử lý việc Thêm mới, Cập nhật, và Sắp xếp lại danh sách.
 *
 * =============================================================================
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import type { DraggableItem } from '../../../_data';

export function useTaskLogic(initialItems: DraggableItem[] = []) {
  // State danh sách công việc
  const [items, setItems] = useState<DraggableItem[]>(initialItems);
  const [prevInitialItems, setPrevInitialItems] =
    useState<DraggableItem[]>(initialItems);

  // Sync state when prop changes (Pattern: Adjusting state during render)
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (initialItems !== prevInitialItems) {
    setPrevInitialItems(initialItems);
    setItems(initialItems || []);
  }

  /**
   * Add hoặc Update Task
   * Logic:
   * - Nếu task đã tồn tại (Update): Giữ nguyên vị trí.
   * - Nếu task mới (Create): Chèn vào đúng vị trí theo thời gian (Sorted).
   */
  const handleSaveTask = useCallback((updatedItem: DraggableItem) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.id === updatedItem.id);

      if (existingIndex !== -1) {
        // --- CASE UPDATE: Giữ nguyên vị trí ---
        const newItems = [...prevItems];
        newItems[existingIndex] = updatedItem;
        return newItems;
      } else {
        // --- CASE CREATE: Insert theo sort thời gian ---
        const newDate = new Date(updatedItem.date).getTime();
        let insertIndex = prevItems.length; // Mặc định cuối

        for (let i = 0; i < prevItems.length; i++) {
          const itemDate = new Date(prevItems[i].date).getTime();
          // Tìm vị trí đầu tiên mà thời gian lớn hơn task mới
          if (itemDate > newDate) {
            insertIndex = i;
            break;
          }
        }

        const newItems = [...prevItems];
        newItems.splice(insertIndex, 0, updatedItem);
        return newItems;
      }
    });
  }, []);

  /**
   * Xử lý khi danh sách bị thay đổi thứ tự (do Drag & Drop)
   */
  const handleReorder = useCallback((newItems: DraggableItem[]) => {
    setItems(newItems);
  }, []);

  return {
    items,
    setItems, // Expose nếu cần reset full list
    handleSaveTask,
    handleReorder,
  };
}
