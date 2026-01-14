import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';

import { Skeleton } from '@/components/ui/Skeleton';
import { TaskItem } from './TaskItem';
import type { DraggableItem } from '../../_data';

// =============================================================================
// TYPES
// =============================================================================

interface DraggableItemListProps {
  items?: DraggableItem[];
  isLoading: boolean;
  /** Callback khi click vào item (forward lên parent) */
  onItemClick?: (item: DraggableItem) => void;
  /** Callback khi items được reorder (sync lên parent) */
  onItemsReorder?: (items: DraggableItem[]) => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SKELETON_COUNT = 5;

// =============================================================================
// SUB-COMPONENT: Sortable Item Wrapper
// =============================================================================

function SortableTaskItem({
  item,
  onClick,
}: {
  item: DraggableItem;
  onClick: (item: DraggableItem) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    // Use Translate to avoid scaling deformation
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 0 : 'auto',
    opacity: isDragging ? 0.25 : 1, // Ghost effect
    position: 'relative' as const,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none select-none"
    >
      <TaskItem item={item} onClick={onClick} />
    </li>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function DraggableItemList({
  items: initialItems,
  isLoading,
  onItemClick,
  onItemsReorder,
}: DraggableItemListProps) {
  // Local state for DnD reordering
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Sync từ props khi có thay đổi (LUÔN sync, không chỉ khi length > 0)
  // Điều này đảm bảo khi RightBarContent update item, DraggableItemList cũng update
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(initialItems || []);
  }, [initialItems]);

  // Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- SMART PRIORITY COLOR LOGIC V3 (Hybrid: User Priority + Dynamic Rules) ---
  // Logic: "Ưu tiên cao nhất thắng"
  // - User's saved priority là baseline
  // - Position/Time rules có thể BOOST priority (không bao giờ hạ)
  // - Nếu user set "high" -> luôn đỏ
  // - Nếu user set "low" nhưng ở vị trí 0 hoặc sắp deadline -> boost lên "high"
  const getDynamicPriority = (
    item: DraggableItem,
    index: number,
    allItems: DraggableItem[]
  ): 'high' | 'medium' | 'low' => {
    // Helper: Priority ordering (high > medium > low)
    const priorityOrder: Record<'high' | 'medium' | 'low', number> = {
      high: 3,
      medium: 2,
      low: 1,
    };

    // Start with user's saved priority as baseline
    let dynamicPriority: 'high' | 'medium' | 'low' = item.priority || 'medium';

    // Helper: Only boost, never lower
    const boostTo = (newPriority: 'high' | 'medium' | 'low') => {
      if (priorityOrder[newPriority] > priorityOrder[dynamicPriority]) {
        dynamicPriority = newPriority;
      }
    };

    // Helper: Calculate HOURS between two dates
    const hoursBetween = (from: Date, to: Date): number => {
      const msPerHour = 60 * 60 * 1000;
      return (to.getTime() - from.getTime()) / msPerHour;
    };

    // Helper: Calculate DAYS between two dates
    const daysBetween = (date1: Date, date2: Date): number => {
      const msPerDay = 24 * 60 * 60 * 1000;
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      d1.setHours(0, 0, 0, 0);
      d2.setHours(0, 0, 0, 0);
      return Math.round((d2.getTime() - d1.getTime()) / msPerDay);
    };

    const now = new Date();
    const itemDate = new Date(item.date);

    // Skip dynamic rules if date is invalid
    if (isNaN(itemDate.getTime())) {
      return dynamicPriority;
    }

    const hoursUntilDeadline = hoursBetween(now, itemDate);

    // ============================================================
    // TẤT CẢ BOOST RULES ĐÃ ĐƯỢC XÓA
    // User's explicit priority selection is now ALWAYS respected
    // - Không boost dựa trên position (index 0)
    // - Không boost dựa trên deadline/time
    // - Nếu user chọn "low" (🟢) -> hiển thị GREEN
    // - Nếu user chọn "medium" (🔵) -> hiển thị BLUE
    // - Nếu user chọn "high" (🔴) -> hiển thị RED
    // ============================================================

    // Return user's explicit priority choice without any modifications
    return dynamicPriority;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId !== overId) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === activeId);
        const newIndex = items.findIndex((item) => item.id === overId);

        // Move item live to visualize position change
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    // Final reorder and apply position-based priority boost
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === active.id);
        const newIndex = prevItems.findIndex((item) => item.id === over.id);
        let newItems = arrayMove(prevItems, oldIndex, newIndex);

        // ============================================================
        // DRAG-BASED PRIORITY BOOST:
        // Item được kéo lên vị trí 0 (top) → tự động chuyển HIGH (đỏ)
        // Chỉ áp dụng khi DRAG, không áp dụng khi tạo/edit trong popup
        // ============================================================
        if (newItems.length > 0 && newItems[0].id === active.id) {
          // Task vừa được kéo lên top → set priority = 'high'
          newItems = newItems.map((item, index) =>
            index === 0 ? { ...item, priority: 'high' as const } : item
          );
        }

        // Sync reordered items back to parent
        onItemsReorder?.(newItems);

        return newItems;
      });
    }
  };

  // Forward click event to parent
  const handleItemClick = (item: DraggableItem) => {
    onItemClick?.(item);
  };

  // Max height for ~5 items (140px each + spacing)
  const CONTAINER_HEIGHT_CLASS = 'max-h-[760px]';

  // Helper to get active item with dynamic priority
  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;
  const activeIndex = activeItem ? items.indexOf(activeItem) : -1;
  const activeItemWithColor = activeItem
    ? {
        ...activeItem,
        priority: getDynamicPriority(activeItem, activeIndex, items),
      }
    : null;

  return (
    <>
      <div
        className={`scrollbar-hidden overflow-y-auto rounded-3xl ${CONTAINER_HEIGHT_CLASS}`}
      >
        {isLoading ? (
          <ul className="space-y-3">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <li key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-3 pb-2">
                {items.map((item, index) => (
                  <SortableTaskItem
                    key={item.id}
                    item={{
                      ...item,
                      priority: getDynamicPriority(item, index, items),
                    }}
                    onClick={handleItemClick}
                  />
                ))}
              </ul>
            </SortableContext>

            {/* 
              DRAG OVERLAY:
              Render the separate "flying" card here. 
            */}
            <DragOverlay>
              {activeItemWithColor ? (
                <div className="scale-105 cursor-grabbing opacity-90">
                  <TaskItem item={activeItemWithColor} onClick={() => {}} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      {/* Popup đã chuyển lên RightBarContent để quản lý tập trung */}
    </>
  );
}

export default DraggableItemList;
