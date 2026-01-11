'use client';

/**
 * ===================================================================
 * SIDEBAR RIGHT COMPONENT
 * ===================================================================
 *
 * Sidebar phải hỗ trợ nhiều mode hiển thị:
 * - 'notes': Panel ghi chú nội dung
 * - 'tasks': Panel quản lý công việc
 * - 'options': Panel tùy chọn cho item được chọn từ Main Content
 *
 * Đặc điểm:
 * - Scroll độc lập
 * - Có thể ẩn/hiện
 * - Responsive: Chuyển thành drawer overlay trên tablet
 * - Tương tác với Main Content thông qua DashboardContext
 */

import React, { type ReactNode } from 'react';
import {
  useDashboard,
  type RightPanelMode,
} from '@/components/providers/DashboardContext';

/* ===== TYPES ===== */

interface SidebarRightProps {
  /**
   * Override nội dung sidebar phải
   * Nếu không truyền, sẽ hiển thị UI dựa trên rightPanelMode
   */
  children?: ReactNode;
  /** Class CSS bổ sung */
  className?: string;
}

/* ===== SUB-COMPONENTS (PLACEHOLDER) ===== */

/**
 * Panel ghi chú - TODO: Implement UI thực tế
 */
function NotesPanel() {
  return (
    <div className="p-4">
      <h3 className="font-display mb-4 text-lg">📝 Ghi Chú</h3>
      <div className="space-y-3">
        {/* Placeholder notes */}
        {[1, 2, 3].map((note) => (
          <div
            key={note}
            className="bg-card border-border rounded-lg border p-3"
          >
            <div className="bg-muted mb-2 h-4 w-3/4 animate-pulse rounded" />
            <div className="bg-muted h-3 w-full animate-pulse rounded" />
            <div className="bg-muted mt-1 h-3 w-2/3 animate-pulse rounded" />
          </div>
        ))}
      </div>
      <button className="border-border text-muted-foreground hover:border-primary hover:text-primary mt-4 w-full rounded-lg border border-dashed py-2 transition-colors">
        + Thêm ghi chú
      </button>
    </div>
  );
}

/**
 * Panel công việc - TODO: Implement UI thực tế
 */
function TasksPanel() {
  return (
    <div className="p-4">
      <h3 className="font-display mb-4 text-lg">✅ Công Việc</h3>
      <div className="space-y-2">
        {/* Placeholder tasks */}
        {['Task 1', 'Task 2', 'Task 3'].map((task, index) => (
          <label
            key={index}
            className="bg-card border-border hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors"
          >
            <input type="checkbox" className="accent-primary h-4 w-4" />
            <span className="text-sm">{task}</span>
          </label>
        ))}
      </div>
      <button className="border-border text-muted-foreground hover:border-primary hover:text-primary mt-4 w-full rounded-lg border border-dashed py-2 transition-colors">
        + Thêm công việc
      </button>
    </div>
  );
}

/**
 * Panel tùy chọn - TODO: Implement UI thực tế
 * Hiển thị options cho selectedItem từ Main Content
 */
function OptionsPanel() {
  const { selectedItem, clearSelection } = useDashboard();

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg">⚙️ Tùy Chọn</h3>
        <button
          onClick={clearSelection}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Đóng panel tùy chọn"
        >
          ✕
        </button>
      </div>

      {selectedItem ? (
        <div className="space-y-4">
          <div className="bg-card border-border rounded-lg border p-4">
            <p className="text-muted-foreground mb-2 text-sm">
              Item đang chọn:
            </p>
            <pre className="bg-muted overflow-auto rounded p-2 text-xs">
              {JSON.stringify(selectedItem, null, 2)}
            </pre>
          </div>
          {/* Placeholder action buttons */}
          <div className="space-y-2">
            <button className="bg-primary text-primary-foreground w-full rounded-lg py-2 transition-opacity hover:opacity-90">
              Chỉnh sửa
            </button>
            <button className="bg-destructive text-primary-foreground w-full rounded-lg py-2 transition-opacity hover:opacity-90">
              Xóa
            </button>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          Chọn một item từ danh sách để xem tùy chọn.
        </p>
      )}
    </div>
  );
}

/**
 * Render panel content dựa trên mode
 */
function PanelContent({ mode }: { mode: RightPanelMode }) {
  switch (mode) {
    case 'notes':
      return <NotesPanel />;
    case 'tasks':
      return <TasksPanel />;
    case 'options':
      return <OptionsPanel />;
    default:
      return null;
  }
}

/* ===== COMPONENT CHÍNH ===== */

export function SidebarRight({ children, className = '' }: SidebarRightProps) {
  const { rightPanelMode, isRightPanelOpen, setRightPanelMode } =
    useDashboard();

  return (
    <aside
      className={`sidebar-right ${isRightPanelOpen ? 'open' : ''} ${className}`}
      aria-label="Sidebar phụ trợ"
    >
      {/* Header với tabs chuyển mode */}
      <div className="border-sidebar-border flex border-b">
        <button
          onClick={() => setRightPanelMode('notes')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            rightPanelMode === 'notes'
              ? 'text-primary border-primary border-b-2'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          📝
        </button>
        <button
          onClick={() => setRightPanelMode('tasks')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            rightPanelMode === 'tasks'
              ? 'text-primary border-primary border-b-2'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          ✅
        </button>
        <button
          onClick={() => setRightPanelMode('options')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            rightPanelMode === 'options'
              ? 'text-primary border-primary border-b-2'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          ⚙️
        </button>
      </div>

      {/* Nội dung panel */}
      {children || <PanelContent mode={rightPanelMode} />}
    </aside>
  );
}

/* ===== EXPORT MẶC ĐỊNH ===== */
export default SidebarRight;
