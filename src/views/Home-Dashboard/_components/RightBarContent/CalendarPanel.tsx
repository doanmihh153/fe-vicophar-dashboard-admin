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
export function CalendarPanel() {
  // State cho ngày/tháng hiện tại đang hiển thị
  const [currentDate, setCurrentDate] = useState(new Date());
  // State cho ngày được chọn
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Tính toán các ngày trong calendar
  const calendarDays = useMemo(
    () =>
      generateCalendarDays(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        selectedDate
      ),
    [currentDate, selectedDate]
  );

  /**
   * Chuyển đến tháng trước
   */
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  /**
   * Chuyển đến tháng sau
   */
  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  /**
   * Format tháng/năm hiển thị
   */
  const monthYearLabel = currentDate.toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="text-sm">
      {/* Header: Navigation tháng */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="hover:bg-muted/50 p-1 transition-colors duration-150"
          aria-label="Tháng trước"
        >
          ←
        </button>
        <span className="text-muted-foreground text-xs capitalize">
          {monthYearLabel}
        </span>
        <button
          onClick={goToNextMonth}
          className="hover:bg-muted/50 p-1 transition-colors duration-150"
          aria-label="Tháng sau"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Weekday headers */}
        {WEEKDAYS.map((day) => (
          <span key={day} className="text-muted-foreground py-2 text-xs">
            {day}
          </span>
        ))}

        {/* Date cells */}
        {calendarDays.map((day, i) => (
          <button
            key={i}
            onClick={() => setSelectedDate(day.date)}
            className={`aspect-square p-1 text-xs transition-colors duration-150 ${!day.isCurrentMonth ? 'text-muted-foreground/50' : ''} ${day.isToday && !day.isSelected ? 'font-medium' : ''} ${
              day.isSelected
                ? 'bg-foreground text-background' // EXCEPTION: selected date
                : 'hover:bg-muted/50'
            } `}
          >
            {day.dayNumber}
          </button>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default CalendarPanel;
