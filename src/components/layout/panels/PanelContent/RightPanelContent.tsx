'use client';

/**
 * ===================================================================
 * RIGHT PANEL CONTENT - NỘI DUNG SIDEBAR PHẢI
 * ===================================================================
 *
 * Component này chứa NỘI DUNG của sidebar phải (notes/tasks/options).
 * Được dùng bởi cả SidebarPanel (grid) và DrawerPanel (drawer).
 *
 * ===================================================================
 * NGUYÊN TẮC
 * ===================================================================
 * - KHÔNG chứa logic breakpoint
 * - KHÔNG chứa styling cho container (wrapper)
 * - CHỈ chứa nội dung bên trong
 *
 * ===================================================================
 * MODES
 * ===================================================================
 * - 'notes': Panel ghi chú
 * - 'tasks': Panel công việc
 * - 'options': Panel tùy chọn cho item được chọn
 */

import React from 'react';
import {
  useDashboard,
  type RightPanelMode,
} from '@/components/providers/DashboardContext';
import { X } from 'lucide-react';

/* ===== TYPES ===== */

interface RightPanelContentProps {
  /** Có hiển thị tabs hay không */
  showTabs?: boolean;
  /** Có hiển thị close button hay không */
  showCloseButton?: boolean;
}

/* ===== SUB-COMPONENTS ===== */

/**
 * Panel Ghi Chú
 */
function NotesPanel() {
  return (
    <div className="p-4">
      <h3 className="font-display mb-4 text-lg">📝 Ghi Chú</h3>
      <div className="space-y-3">
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
 * Panel Công Việc
 */
function TasksPanel() {
  return (
    <div className="p-4">
      <h3 className="font-display mb-4 text-lg">✅ Công Việc</h3>
      <div className="space-y-2">
        {['Task 1', 'Task 2', 'Task 3'].map((task, index) => (
          <label
            key={index}
            className="border-border bg-card hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors"
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
 * Panel Tùy Chọn
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
          <div className="border-border bg-card rounded-lg border p-4">
            <p className="text-muted-foreground mb-2 text-sm">
              Item đang chọn:
            </p>
            <pre className="bg-muted overflow-auto rounded p-2 text-xs">
              {JSON.stringify(selectedItem, null, 2)}
            </pre>
          </div>
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
function PanelContentByMode({ mode }: { mode: RightPanelMode }) {
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

/* ===== COMPONENT ===== */

export function RightPanelContent({
  showTabs = true,
  showCloseButton = true,
}: RightPanelContentProps) {
  const { rightPanelMode, setRightPanelMode, toggleRight } = useDashboard();

  return (
    <>
      {/* ===== HEADER: Tabs + Close Button ===== */}
      {(showTabs || showCloseButton) && (
        <div className="border-border flex items-center border-b">
          {/* Close button (optional) */}
          {showCloseButton && (
            <button
              onClick={toggleRight}
              className="text-muted-foreground hover:bg-accent hover:text-foreground p-3 transition-colors"
              aria-label="Đóng panel"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Tab Notes */}
          {showTabs && (
            <>
              <button
                onClick={() => setRightPanelMode('notes')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  rightPanelMode === 'notes'
                    ? 'text-primary border-primary border-b-2'
                    : 'text-muted-foreground hover:text-foreground'
                } `}
                aria-label="Ghi chú"
              >
                📝
              </button>

              {/* Tab Tasks */}
              <button
                onClick={() => setRightPanelMode('tasks')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  rightPanelMode === 'tasks'
                    ? 'text-primary border-primary border-b-2'
                    : 'text-muted-foreground hover:text-foreground'
                } `}
                aria-label="Công việc"
              >
                ✅
              </button>

              {/* Tab Options */}
              <button
                onClick={() => setRightPanelMode('options')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  rightPanelMode === 'options'
                    ? 'text-primary border-primary border-b-2'
                    : 'text-muted-foreground hover:text-foreground'
                } `}
                aria-label="Tùy chọn"
              >
                ⚙️
              </button>
            </>
          )}
        </div>
      )}

      {/* ===== PANEL CONTENT ===== */}
      <div className="flex-1 overflow-y-auto">
        <PanelContentByMode mode={rightPanelMode} />
      </div>
    </>
  );
}

/* ===== DEFAULT EXPORT ===== */
export default RightPanelContent;
