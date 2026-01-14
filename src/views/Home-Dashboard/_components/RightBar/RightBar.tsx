/**
 * =============================================================================
 * FILE: RightBar.tsx
 * =============================================================================
 * MÔ TẢ:
 *   Container chính cho Right Bar (Sidebar phải).
 *   Quản lý layout và kết nối Logic CRUD với UI Components.
 *
 * =============================================================================
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { TaskList } from './components/TaskList/TaskList';
import { CalendarPanel } from './components/Calendar/CalendarPanel';
import { TaskPopup } from './components/TaskPopup/TaskPopup';
import { useTaskLogic } from './_hooks';
import type { DraggableItem } from '../../_data';

interface RightBarProps {
  items?: DraggableItem[];
  isLoading: boolean;
}

export function RightBar({ items: initialItems, isLoading }: RightBarProps) {
  // 1. Logic Hook (CRUD + State)
  const { items, handleSaveTask, handleReorder } = useTaskLogic(initialItems);

  // 2. UI State (Popup)
  const [selectedItem, setSelectedItem] = useState<DraggableItem | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMode, setPopupMode] = useState<'view' | 'edit'>('view');

  // --- Handlers ---
  const handleItemClick = useCallback((item: DraggableItem) => {
    setSelectedItem(item);
    setPopupMode('view');
    setIsPopupOpen(true);
  }, []);

  const handleAddTask = useCallback(() => {
    setSelectedItem(null);
    setPopupMode('edit');
    setIsPopupOpen(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setIsPopupOpen(false);
    setSelectedItem(null);
  }, []);

  return (
    <div className="flex h-full flex-col p-2">
      {/* SECTION 1: TASK LIST */}
      <div className="dashboard-section bg-sidebar pb-4">
        {/* Header */}
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

        {/* List */}
        <TaskList
          items={items}
          isLoading={isLoading}
          onItemClick={handleItemClick}
          onItemsReorder={handleReorder}
        />
      </div>

      {/* SECTION 2: CALENDAR */}
      <div className="mt-2">
        <CalendarPanel />
      </div>

      {/* POPUP OVERLAY */}
      {isPopupOpen && (
        <TaskPopup
          item={selectedItem}
          onClose={handleClosePopup}
          onSave={handleSaveTask}
          defaultMode={popupMode}
        />
      )}
    </div>
  );
}
