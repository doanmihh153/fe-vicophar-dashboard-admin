/**
 * ===================================================================
 * TASKS PAGE
 * ===================================================================
 *
 * Trang quản lý công việc, hiển thị tại URL: /tasks
 *
 * ===================================================================
 * ROUTE MAPPING
 * ===================================================================
 *
 * File: src/app/(dashboard)/tasks/page.tsx
 * URL: /tasks
 *
 * ===================================================================
 * LAYOUT INHERITANCE
 * ===================================================================
 *
 * Page này tự động có DashboardLayout từ (dashboard)/layout.tsx
 * Không cần import hay config gì thêm.
 */

import { ClipboardList, Plus, Filter, Search } from 'lucide-react';

/**
 * Tasks Page Component
 *
 * Placeholder cho trang quản lý tasks.
 * TODO: Thêm task list, filters, create task form.
 */
export default function TasksPage() {
  return (
    <div className="p-6">
      {/*
       * PAGE HEADER
       * Hiển thị title và action buttons
       */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Tasks</h1>
            <p className="text-muted-foreground text-sm">
              Quản lý công việc của bạn
            </p>
          </div>
        </div>

        <button className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90">
          <Plus className="h-4 w-4" />
          Tạo Task Mới
        </button>
      </div>

      {/*
       * FILTERS BAR
       * Search và filter options
       */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm tasks..."
            className="border-border bg-background focus:ring-primary w-full rounded-lg border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
        <button className="border-border hover:bg-accent inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors">
          <Filter className="h-4 w-4" />
          Lọc
        </button>
      </div>

      {/*
       * TASK LIST PLACEHOLDER
       * TODO: Thay bằng actual task list component
       */}
      <div className="border-border rounded-xl border">
        {/* Task items */}
        {[
          {
            title: 'Hoàn thành báo cáo Q4',
            status: 'In Progress',
            priority: 'High',
          },
          { title: 'Review code frontend', status: 'Todo', priority: 'Medium' },
          { title: 'Meeting với team design', status: 'Done', priority: 'Low' },
          {
            title: 'Update documentation',
            status: 'In Progress',
            priority: 'Medium',
          },
        ].map((task, i) => (
          <div
            key={i}
            className="border-border hover:bg-accent/50 flex items-center justify-between border-b p-4 transition-colors last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                defaultChecked={task.status === 'Done'}
              />
              <span
                className={
                  task.status === 'Done'
                    ? 'text-muted-foreground line-through'
                    : ''
                }
              >
                {task.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  task.priority === 'High'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : task.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                }`}
              >
                {task.priority}
              </span>
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  task.status === 'Done'
                    ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    : task.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                }`}
              >
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
