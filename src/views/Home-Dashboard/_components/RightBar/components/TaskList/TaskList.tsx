/**
 * =============================================================================
 * FILE: TaskList.tsx
 * =============================================================================
 * MÔ TẢ:
 *   Component hiển thị danh sách công việc có thể kéo thả.
 *   Logic Drag & Drop được tách ra hook `useTaskDrag`.
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Skeleton } from '@/components/ui/Skeleton';
import { TaskItem } from './TaskItem';
import { useTaskDrag } from '../../_hooks';
import type { DraggableItem } from '../../../../_data';

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

interface TaskListProps {
  items: DraggableItem[];
  isLoading: boolean;
  onItemClick: (item: DraggableItem) => void;
  onItemsReorder: (items: DraggableItem[]) => void;
}

const SKELETON_COUNT = 5;
const CONTAINER_HEIGHT_CLASS = 'max-h-[760px]';

export function TaskList({
  items,
  isLoading,
  onItemClick,
  onItemsReorder,
}: TaskListProps) {
  // Sử dụng hook Drag Logic
  const { sensors, activeId, handleDragStart, handleDragOver, handleDragEnd } =
    useTaskDrag({
      items,
      onDragEnd: onItemsReorder,
    });

  // Helper để lấy active item cho Overlay
  const activeItem = activeId ? items.find((i) => i.id === activeId) : null;

  return (
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
          /* Fix lỗi modifier import */
          // modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-3 pb-2">
              {items.map((item) => (
                <SortableTaskItem
                  key={item.id}
                  item={item}
                  onClick={onItemClick}
                />
              ))}
            </ul>
          </SortableContext>

          {/* DRAG OVERLAY */}
          <DragOverlay>
            {activeItem ? (
              <div className="scale-105 cursor-grabbing opacity-90">
                <TaskItem item={activeItem} onClick={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
