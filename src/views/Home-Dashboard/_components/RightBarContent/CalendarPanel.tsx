/**
 * =============================================================================
 * FILE: CalendarPanel.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Component hiển thị mini calendar trong Right Bar.
 *   Hiển thị lịch theo tháng với khả năng chọn ngày.
 *
 * NGUYÊN TẮC (theo Design Constitution):
 *   - Calendar chỉ để xem, không phải Google Calendar
 *   - Selected date là EXCEPTION duy nhất cho bg-foreground
 *   - Hover: bg-muted/50, transition 150ms
 *   - Không border cho cells
 *
 * LAYOUT:
 *   - Grid 7 cột cho 7 ngày trong tuần
 *   - Row header: Mon Tue Wed...
 *   - Date cells: số ngày
 *
 * =============================================================================
 */

'use client';

import React, { useState, useMemo } from 'react';

// =============================================================================
// CONSTANTS
// =============================================================================

/** Tên các ngày trong tuần (viết tắt tiếng Việt) */
const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

// =============================================================================
// TYPES
// =============================================================================

interface CalendarDay {
  /** Date object của ngày */
  date: Date;
  /** Số ngày hiển thị */
  dayNumber: number;
  /** Có phải ngày hôm nay không */
  isToday: boolean;
  /** Có phải ngày được chọn không */
  isSelected: boolean;
  /** Có phải ngày của tháng hiện tại không (false = ngày tháng trước/sau) */
  isCurrentMonth: boolean;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Tạo mảng các ngày để hiển thị trong calendar grid
 * @param year Năm
 * @param month Tháng (0-11)
 * @param selectedDate Ngày được chọn
 */
function generateCalendarDays(
  year: number,
  month: number,
  selectedDate: Date
): CalendarDay[] {
  const today = new Date();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Ngày đầu tuần (0 = Sun, 1 = Mon, ...)
  // Chuyển sang Monday-first (0 = Mon, 6 = Sun)
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek < 0) startDayOfWeek = 6;

  const days: CalendarDay[] = [];

  // Thêm ngày của tháng trước để lấp đầy hàng đầu
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const date = new Date(year, month - 1, dayNum);
    days.push({
      date,
      dayNumber: dayNum,
      isToday: isSameDay(date, today),
      isSelected: isSameDay(date, selectedDate),
      isCurrentMonth: false,
    });
  }

  // Thêm ngày của tháng hiện tại
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const date = new Date(year, month, day);
    days.push({
      date,
      dayNumber: day,
      isToday: isSameDay(date, today),
      isSelected: isSameDay(date, selectedDate),
      isCurrentMonth: true,
    });
  }

  // Thêm ngày của tháng sau để lấp đầy hàng cuối
  const remainingDays = 42 - days.length; // 6 hàng x 7 cột = 42
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    days.push({
      date,
      dayNumber: day,
      isToday: isSameDay(date, today),
      isSelected: isSameDay(date, selectedDate),
      isCurrentMonth: false,
    });
  }

  return days;
}

/**
 * Kiểm tra 2 ngày có cùng ngày/tháng/năm không
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * CalendarPanel - Mini calendar trong Right Bar
 *
 * Layout:
 * ┌─────────────────────────────────────────────────┐
 * │ T2  T3  T4  T5  T6  T7  CN                      │
 * │ 30  31   1   2   3   4   5                      │
 * │  6   7   8   9  10  11  12                      │
 * │ 13  14  15  16  17  18  19  ← 13 selected       │
 * │ ...                                              │
 * └─────────────────────────────────────────────────┘
 */
// ... (imports remain same)
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ... (helpers remain same)

export function CalendarPanel() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const calendarDays = useMemo(
    () =>
      generateCalendarDays(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        selectedDate
      ),
    [currentDate, selectedDate]
  );

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Format: "Tháng 8, 2021"
  const monthLabel = currentDate.toLocaleDateString('vi-VN', { month: 'long' });
  const yearLabel = currentDate.getFullYear();

  return (
    <div className="dashboard-section bg-sidebar p-5">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <h3 className="text-foreground text-base font-bold capitalize">
            {monthLabel},
          </h3>
          <span className="text-muted-foreground text-base font-normal">
            {yearLabel}
          </span>
        </div>

        <div className="flex gap-1">
          <button
            onClick={goToPreviousMonth}
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-900/30 dark:hover:text-orange-400"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={goToNextMonth}
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-900/30 dark:hover:text-orange-400"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-y-3 text-center">
        {/* Weekdays */}
        {WEEKDAYS.map((day) => (
          <span
            key={day}
            className="text-[10px] font-bold tracking-wider text-orange-400 uppercase"
          >
            {day}
          </span>
        ))}

        {/* Cells */}
        {calendarDays.map((day, i) => {
          // Logic style:
          // 1. Selected: Solid orange bg, white text
          // 2. Today (Not Selected): Orange text bold
          // 3. Other: Normal text
          // 4. Not current month: Muted

          let cellClass =
            'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs transition-all duration-200 ';

          if (day.isSelected) {
            cellClass +=
              'bg-orange-400 text-white shadow-md shadow-orange-200 dark:shadow-none font-semibold';
          } else if (day.isToday) {
            cellClass +=
              'text-orange-500 font-bold bg-orange-50 dark:bg-orange-950/30 ring-1 ring-orange-200 dark:ring-orange-800';
          } else {
            cellClass +=
              'text-foreground hover:bg-orange-50 dark:hover:bg-orange-900/20';
            if (!day.isCurrentMonth) {
              cellClass += ' text-muted-foreground/30';
            }
          }

          return (
            <button
              key={i}
              onClick={() => setSelectedDate(day.date)}
              className={cellClass}
            >
              {day.dayNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default CalendarPanel;
