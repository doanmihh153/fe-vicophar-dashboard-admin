/**
 * =============================================================================
 * FILE: TaskPopup.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Popup hiển thị chi tiết công việc với 2 chế độ:
 *   - View Mode: Xem thông tin đầy đủ
 *   - Edit Mode: Form chỉnh sửa
 *
 * PROPS:
 *   - item: DraggableItem | null - Item cần hiển thị/chỉnh sửa
 *   - onClose: () => void - Callback đóng
 *   - onSave: (item: DraggableItem) => void - Callback lưu
 *
 * =============================================================================
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Pencil, Calendar, Clock, Tag } from 'lucide-react';
import type { DraggableItem } from '../../../../_data';

// =============================================================================
// TYPES
// =============================================================================

interface TaskPopupProps {
  /** Item cần hiển thị chi tiết (null = tạo mới) */
  item: DraggableItem | null;
  /** Callback khi đóng popup */
  onClose: () => void;
  /** Callback khi lưu thay đổi */
  onSave?: (updatedItem: DraggableItem) => void;
  /** Chế độ mặc định: 'view' (xem) hoặc 'edit' (chỉnh sửa/tạo mới) */
  defaultMode?: 'view' | 'edit';
}

interface FormState {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  priority: 'high' | 'medium' | 'low';
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getPriorityInfo = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high':
      return {
        label: 'Cao',
        dotClass: 'bg-rose-500',
        textClass: 'text-rose-600 dark:text-rose-400',
        bgClass: 'bg-rose-50 dark:bg-rose-950/30',
      };
    case 'medium':
      return {
        label: 'Trung bình',
        dotClass: 'bg-blue-500',
        textClass: 'text-blue-600 dark:text-blue-400',
        bgClass: 'bg-blue-50 dark:bg-blue-950/30',
      };
    case 'low':
    default:
      return {
        label: 'Thấp',
        dotClass: 'bg-green-500',
        textClass: 'text-green-600 dark:text-green-400',
        bgClass: 'bg-green-50 dark:bg-green-950/30',
      };
  }
};

const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTimeForInput = (date: Date): string => {
  return date.toTimeString().slice(0, 5);
};

const formatDateTimeDisplay = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} lúc ${hours}:${minutes}`;
};

// =============================================================================
// COMPONENT
// =============================================================================

export function TaskPopup({
  item,
  onClose,
  onSave,
  defaultMode = 'view',
}: TaskPopupProps) {
  const [mode, setMode] = useState<'view' | 'edit'>(
    item ? defaultMode : 'edit'
  );

  const [form, setForm] = useState<FormState>(() => {
    const now = new Date();
    return {
      title: item?.title || '',
      description: item?.description || '',
      date: item
        ? formatDateForInput(new Date(item.date))
        : formatDateForInput(now),
      time: item
        ? formatTimeForInput(new Date(item.date))
        : formatTimeForInput(now),
      priority: item?.priority || 'medium',
    };
  });

  // Sync state when item changes
  useEffect(() => {
    const now = new Date();
    setForm({
      title: item?.title || '',
      description: item?.description || '',
      date: item
        ? formatDateForInput(new Date(item.date))
        : formatDateForInput(now),
      time: item
        ? formatTimeForInput(new Date(item.date))
        : formatTimeForInput(now),
      priority: item?.priority || 'medium',
    });
    setMode(item ? defaultMode : 'edit');
  }, [item?.id, defaultMode]);

  // Handle Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSave = useCallback(() => {
    if (!form.title.trim()) return;

    const [year, month, day] = form.date.split('-').map(Number);
    const [hours, minutes] = form.time.split(':').map(Number);
    const newDate = new Date(year, month - 1, day, hours, minutes);

    const updatedItem: DraggableItem = {
      id: item?.id || `task-${Date.now()}`,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      date: newDate,
      priority: form.priority,
    };

    onSave?.(updatedItem);
    onClose();
  }, [form, item, onSave, onClose]);

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const priority = getPriorityInfo(form.priority);
  const isCreateMode = !item;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="bg-background border-border fixed top-1/2 left-1/2 z-50 w-[340px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-5">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-foreground text-base font-semibold">
            {mode === 'view'
              ? 'Chi tiết công việc'
              : isCreateMode
                ? 'Thêm công việc'
                : 'Chỉnh sửa công việc'}
          </h3>
          <div className="flex items-center gap-2">
            {mode === 'view' && (
              <button
                onClick={() => setMode('edit')}
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-1.5 transition-colors"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-1.5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* View Mode */}
        {mode === 'view' && item && (
          <div className="space-y-4">
            <div>
              <span className="text-muted-foreground mb-1 flex items-center gap-1.5 text-xs">
                📋 Tiêu đề
              </span>
              <p className="text-foreground font-medium">{item.title}</p>
            </div>

            {item.description && (
              <div>
                <span className="text-muted-foreground mb-1 flex items-center gap-1.5 text-xs">
                  📝 Mô tả
                </span>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            )}

            <div>
              <span className="text-muted-foreground mb-1 flex items-center gap-1.5 text-xs">
                <Clock className="h-3 w-3" /> Deadline
              </span>
              <p className="text-foreground tabular-nums">
                {formatDateTimeDisplay(new Date(item.date))}
              </p>
            </div>

            {/* Mức độ ưu tiên */}
            <div>
              <span className="text-muted-foreground mb-1 flex items-center gap-1.5 text-xs">
                <Tag className="h-3 w-3" /> Mức độ ưu tiên
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium ${priority?.bgClass}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${priority?.dotClass}`}
                  />
                  <span className={priority?.textClass}>{priority?.label}</span>
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="bg-muted hover:bg-muted/80 text-foreground flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={() => setMode('edit')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {mode === 'edit' && (
          <div className="space-y-4">
            <div>
              <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                Tiêu đề *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="border-border bg-muted/30 focus:ring-primary/20 w-full rounded-xl border px-3 py-2.5 text-sm transition-all outline-none focus:border-transparent focus:ring-2"
              />
            </div>

            <div>
              <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                Mô tả
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="border-border bg-muted/30 focus:ring-primary/20 w-full resize-none rounded-xl border px-3 py-2.5 text-sm transition-all outline-none focus:border-transparent focus:ring-2"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                  Ngày
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="border-border bg-muted/30 focus:ring-primary/20 w-full rounded-xl border px-3 py-2.5 text-sm transition-all outline-none focus:border-transparent focus:ring-2"
                />
              </div>
              <div>
                <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                  Giờ
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => updateField('time', e.target.value)}
                  className="border-border bg-muted/30 focus:ring-primary/20 w-full rounded-xl border px-3 py-2.5 text-sm transition-all outline-none focus:border-transparent focus:ring-2"
                />
              </div>
            </div>

            <div>
              <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                Prioriy
              </label>
              <select
                value={form.priority}
                onChange={(e) => updateField('priority', e.target.value as any)}
                className="border-border bg-muted/30 focus:ring-primary/20 w-full rounded-xl border px-3 py-2.5 text-sm transition-all outline-none focus:border-transparent focus:ring-2"
              >
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => (isCreateMode ? onClose() : setMode('view'))}
                className="bg-muted hover:bg-muted/80 text-foreground flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Lưu
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
