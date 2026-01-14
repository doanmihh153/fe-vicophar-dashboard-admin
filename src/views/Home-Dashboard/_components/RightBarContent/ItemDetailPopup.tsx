/**
 * =============================================================================
 * FILE: ItemDetailPopup.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Popup hiển thị chi tiết công việc với 2 chế độ:
 *   - View Mode: Xem thông tin đầy đủ (tiêu đề, mô tả, deadline ngày+giờ, priority)
 *   - Edit Mode: Form chỉnh sửa dạng mini (input, dropdown priority, date/time picker)
 *
 * PROPS:
 *   - item: DraggableItem | null - Item cần hiển thị/chỉnh sửa (null = create new)
 *   - onClose: () => void - Callback đóng popup
 *   - onSave: (item: DraggableItem) => void - Callback lưu thay đổi
 *   - defaultMode?: 'view' | 'edit' - Chế độ mặc định khi mở popup
 *
 * =============================================================================
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Pencil, Calendar, Clock, Tag } from 'lucide-react';
import type { DraggableItem } from '../../_data';

// =============================================================================
// TYPES
// =============================================================================

interface ItemDetailPopupProps {
  /** Item cần hiển thị chi tiết (null = tạo mới) */
  item: DraggableItem | null;
  /** Callback khi đóng popup */
  onClose: () => void;
  /** Callback khi lưu thay đổi */
  onSave?: (updatedItem: DraggableItem) => void;
  /** Chế độ mặc định: 'view' (xem) hoặc 'edit' (chỉnh sửa/tạo mới) */
  defaultMode?: 'view' | 'edit';
}

// Form state type
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

/**
 * Lấy label và màu cho priority
 */
const getPriorityInfo = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high':
      return {
        label: 'Cao',
        emoji: '🔴',
        dotClass: 'bg-rose-500',
        textClass: 'text-rose-600 dark:text-rose-400',
        bgClass: 'bg-rose-50 dark:bg-rose-950/30',
      };
    case 'medium':
      return {
        label: 'Trung bình',
        emoji: '🔵',
        dotClass: 'bg-blue-500',
        textClass: 'text-blue-600 dark:text-blue-400',
        bgClass: 'bg-blue-50 dark:bg-blue-950/30',
      };
    case 'low':
    default:
      return {
        label: 'Thấp',
        emoji: '🟢',
        dotClass: 'bg-green-500',
        textClass: 'text-green-600 dark:text-green-400',
        bgClass: 'bg-green-50 dark:bg-green-950/30',
      };
  }
};

/**
 * Format date to YYYY-MM-DD for input[type="date"]
 * IMPORTANT: Dùng local date methods, KHÔNG dùng toISOString() vì nó chuyển sang UTC
 */
const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format time to HH:mm for input[type="time"]
 */
const formatTimeForInput = (date: Date): string => {
  return date.toTimeString().slice(0, 5);
};

/**
 * Format date for display (Vietnamese format)
 */
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

export function ItemDetailPopup({
  item,
  onClose,
  onSave,
  defaultMode = 'view',
}: ItemDetailPopupProps) {
  // ============== STATE ==============
  // Nếu không có item (tạo mới) thì luôn ở Edit mode
  const [mode, setMode] = useState<'view' | 'edit'>(
    item ? defaultMode : 'edit'
  );

  // Form state
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

  // ============== EFFECTS ==============

  /**
   * Sync form state khi mở popup cho TASK KHÁC (dựa vào item.id)
   * IMPORTANT: Chỉ sync khi item.id thay đổi, KHÔNG phải khi item object reference thay đổi
   * Điều này tránh reset form khi user đang edit mà parent re-render
   */
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
    // Reset mode khi mở popup cho task khác

    setMode(item ? defaultMode : 'edit');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id, defaultMode]); // Chỉ sync khi item.id thay đổi

  /**
   * Handle ESC key để đóng popup
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // ============== HANDLERS ==============

  /**
   * Chuyển sang Edit mode
   */
  const handleEditClick = useCallback(() => {
    setMode('edit');
  }, []);

  /**
   * Hủy chỉnh sửa, quay về View mode (hoặc đóng nếu tạo mới)
   */
  const handleCancel = useCallback(() => {
    if (!item) {
      // Tạo mới -> đóng popup
      onClose();
    } else {
      // Reset form về giá trị ban đầu
      setForm({
        title: item.title,
        description: item.description || '',
        date: formatDateForInput(new Date(item.date)),
        time: formatTimeForInput(new Date(item.date)),
        priority: item.priority,
      });
      setMode('view');
    }
  }, [item, onClose]);

  /**
   * Lưu thay đổi
   */
  const handleSave = useCallback(() => {
    if (!form.title.trim()) {
      // Validate: title bắt buộc
      return;
    }

    // Tạo Date từ form
    const [year, month, day] = form.date.split('-').map(Number);
    const [hours, minutes] = form.time.split(':').map(Number);
    const newDate = new Date(year, month - 1, day, hours, minutes);

    const updatedItem: DraggableItem = {
      id: item?.id || `task-${Date.now()}`, // Tạo ID mới nếu là create
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      date: newDate,
      priority: form.priority,
    };

    onSave?.(updatedItem);
    onClose();
  }, [form, item, onSave, onClose]);

  /**
   * Update form field
   */
  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ============== RENDER ==============

  // Sử dụng form.priority thay vì item.priority để hiển thị đúng màu khi đã edit
  const priority = getPriorityInfo(form.priority);
  const isCreateMode = !item;

  return (
    <>
      {/*
       * Backdrop overlay
       * Click để đóng popup
       */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/*
       * Popup content
       * Centered modal với rounded corners
       */}
      <div className="bg-background border-border fixed top-1/2 left-1/2 z-50 w-[340px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-5">
        {/* ============== HEADER ============== */}
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-foreground text-base font-semibold">
            {mode === 'view'
              ? 'Chi tiết công việc'
              : isCreateMode
                ? 'Thêm công việc'
                : 'Chỉnh sửa công việc'}
          </h3>
          <div className="flex items-center gap-2">
            {/* Nút chỉnh sửa (chỉ hiện trong View mode) */}
            {mode === 'view' && (
              <button
                onClick={handleEditClick}
                className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-1.5 transition-colors"
                aria-label="Chỉnh sửa"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            {/* Nút đóng */}
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-1.5 transition-colors"
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ============== VIEW MODE ============== */}
        {mode === 'view' && item && (
          <div className="space-y-4">
            {/* Tiêu đề */}
            <div>
              <span className="text-muted-foreground mb-1 flex items-center gap-1.5 text-xs">
                📋 Tiêu đề
              </span>
              <p className="text-foreground font-medium">{item.title}</p>
            </div>

            {/* Mô tả (nếu có) */}
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

            {/* Deadline */}
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

            {/* Footer: Nút Đóng + Chỉnh sửa */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={onClose}
                className="bg-muted hover:bg-muted/80 text-foreground flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handleEditClick}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        )}

        {/* ============== EDIT MODE ============== */}
        {mode === 'edit' && (
          <div className="space-y-4">
            {/* Input: Tiêu đề */}
            <div>
              <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                Tiêu đề <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Nhập tiêu đề công việc..."
                className="border-border bg-muted/30 focus:ring-primary/20 w-full rounded-xl border px-3 py-2.5 text-sm transition-all outline-none focus:border-transparent focus:ring-2"
              />
            </div>

            {/* Textarea: Mô tả */}
            <div>
              <label className="text-muted-foreground mb-1.5 block text-xs font-medium">
                Mô tả
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Mô tả chi tiết công việc (tuỳ chọn)..."
                rows={2}
                className="border-border bg-muted/30 focus:ring-primary/20 w-full resize-none rounded-xl border px-3 py-2.5 text-sm transition-all outline-none focus:border-transparent focus:ring-2"
              />
            </div>

            {/* Date + Time pickers */}
            <div className="grid grid-cols-2 gap-3">
              {/* Ngày deadline */}
              <div>
                <label className="text-muted-foreground mb-1.5 flex items-center gap-1 text-xs font-medium">
                  <Calendar className="h-3 w-3" /> Ngày
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="border-border bg-muted/30 focus:ring-primary/20 w-full rounded-xl border px-3 py-2.5 text-sm transition-all outline-none focus:border-transparent focus:ring-2"
                />
              </div>

              {/* Giờ deadline */}
              <div>
                <label className="text-muted-foreground mb-1.5 flex items-center gap-1 text-xs font-medium">
                  <Clock className="h-3 w-3" /> Giờ
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => updateField('time', e.target.value)}
                  className="border-border bg-muted/30 focus:ring-primary/20 w-full rounded-xl border px-3 py-2.5 text-sm transition-all outline-none focus:border-transparent focus:ring-2"
                />
              </div>
            </div>

            {/* Dropdown: Priority */}
            <div>
              <label className="text-muted-foreground mb-1.5 flex items-center gap-1 text-xs font-medium">
                <Tag className="h-3 w-3" /> Mức độ ưu tiên
              </label>
              <select
                value={form.priority}
                onChange={(e) =>
                  updateField(
                    'priority',
                    e.target.value as 'high' | 'medium' | 'low'
                  )
                }
                className="border-border bg-muted/30 focus:ring-primary/20 w-full appearance-none rounded-xl border px-3 py-2.5 text-sm transition-all outline-none focus:border-transparent focus:ring-2"
              >
                <option value="high">🔴 Cao</option>
                <option value="medium">🔵 Trung bình</option>
                <option value="low">🟢 Thấp</option>
              </select>
            </div>

            {/* Footer: Nút Hủy + Lưu */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleCancel}
                className="bg-muted hover:bg-muted/80 text-foreground flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isCreateMode ? 'Thêm' : 'Lưu'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default ItemDetailPopup;
