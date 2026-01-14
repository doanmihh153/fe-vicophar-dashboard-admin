/**
 * =============================================================================
 * FILE: useTaskDrag.ts
 * =============================================================================
 * MÔ TẢ:
 *   Hook xử lý logic Drag & Drop cho danh sách công việc.
 *   Tách biệt logic tương tác của DndKit khỏi UI component.
 *
 * TÁC VỤ:
 *   - Khởi tạo Sensors (Pointer, Keyboard)
 *   - Xử lý DragStart, DragOver, DragEnd
 *   - Tính toán danh sách items sau khi reorder
 *
 * =============================================================================
 */

'use client';

import { useState } from 'react';
import {
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import type { DraggableItem } from '../../../_data';

interface UseTaskDragProps {
  items: DraggableItem[];
  /** Callback khi thứ tự thay đổi (chưa final save) - dùng cho optimistic UI */
  onDragUpdate?: (items: DraggableItem[]) => void;
  /** Callback khi kết thúc drag (final save) */
  onDragEnd?: (items: DraggableItem[]) => void;
}

export function useTaskDrag({
  items,
  onDragUpdate,
  onDragEnd,
}: UseTaskDragProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // --- SENSORS ---
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Kéo 8px mới bắt đầu drag (tránh click nhầm)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- HANDLERS ---

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId !== overId) {
      // Tìm index cũ và mới
      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === overId);

      // Tạo mảng mới tạm thời để visualize
      const newItems = arrayMove(items, oldIndex, newIndex);

      // Gọi callback để update UI
      onDragUpdate?.(newItems);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      let newItems = arrayMove(items, oldIndex, newIndex);

      // ============================================================
      // DRAG-BASED PRIORITY BOOST (LOGIC CŨ):
      // Nếu kéo lên đầu danh sách -> Tự động set High Priority
      // ============================================================
      if (newItems.length > 0 && newItems[0].id === active.id) {
        newItems = newItems.map((item, index) =>
          index === 0 ? { ...item, priority: 'high' } : item
        );
      }

      // Gọi callback final save
      onDragEnd?.(newItems);
    }
  };

  return {
    sensors,
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
