/**
 * ===================================================================
 * CALENDAR PAGE
 * ===================================================================
 *
 * Trang lịch, hiển thị tại URL: /calendar
 *
 * File: src/app/(dashboard)/calendar/page.tsx
 * Tự động có DashboardLayout từ (dashboard)/layout.tsx
 */

import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function CalendarPage() {
  // Placeholder data
  const currentMonth = 'January 2026';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 35 }, (_, i) => i - 4); // Start from previous month

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-muted-foreground text-sm">
              Xem và quản lý lịch của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="hover:bg-accent rounded-lg p-2 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">{currentMonth}</h2>
          <button className="hover:bg-accent rounded-lg p-2 transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <button className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium">
          Hôm nay
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="border-border overflow-hidden rounded-xl border">
        {/* Day headers */}
        <div className="bg-muted/50 grid grid-cols-7">
          {days.map((day) => (
            <div
              key={day}
              className="border-border border-b p-3 text-center text-sm font-medium"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7">
          {dates.map((date, i) => (
            <div
              key={i}
              className={`border-border hover:bg-accent/50 min-h-[100px] border-r border-b p-2 transition-colors last:border-r-0 ${
                date <= 0 || date > 31
                  ? 'text-muted-foreground bg-muted/30'
                  : ''
              }`}
            >
              <span
                className={`text-sm ${date === 12 ? 'bg-primary text-primary-foreground rounded-full px-2 py-1' : ''}`}
              >
                {date <= 0 ? 31 + date : date > 31 ? date - 31 : date}
              </span>
              {/* Event placeholder */}
              {date === 12 && (
                <div className="mt-1 rounded bg-blue-100 p-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  Team Meeting
                </div>
              )}
              {date === 20 && (
                <div className="mt-1 rounded bg-green-100 p-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Project Due
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
