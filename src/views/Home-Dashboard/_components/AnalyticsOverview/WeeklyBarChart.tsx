/**
 * =============================================================================
 * FILE: WeeklyBarChart.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   SVG Bar Chart component hiển thị dữ liệu theo tuần (S M T W T F S).
 *   Inspired by reference images: Donezo & Crextio dashboards.
 *
 * FEATURES:
 *   - Bar chart đơn giản với 7 cột (mỗi ngày trong tuần)
 *   - Hover effect cho từng bar
 *   - Responsive height
 *   - Không sử dụng external chart library
 *
 * =============================================================================
 */

'use client';

import React from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface BarData {
  /** Nhãn ngày */
  day: string;
  /** Giá trị (0-100 để normalize) */
  value: number;
  /** Có phải ngày highlight không (vd: hôm nay) */
  isHighlight?: boolean;
}

interface WeeklyBarChartProps {
  /** Dữ liệu 7 ngày */
  data: BarData[];
  /** Chiều cao chart */
  height?: number;
  /** Màu accent chính */
  accentColor?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_HEIGHT = 120;
const BAR_WIDTH = 24;
const BAR_GAP = 12;
const BAR_RADIUS = 6;

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * WeeklyBarChart - Bar chart cho dữ liệu hàng tuần
 *
 * Layout:
 * ┌─────────────────────────────────────────────┐
 * │  █     █           █                        │
 * │  █  █  █     █     █     █                  │
 * │  █  █  █  █  █  █  █  █  █                  │
 * │  S  M  T  W  T  F  S                        │
 * └─────────────────────────────────────────────┘
 */
export function WeeklyBarChart({
  data,
  height = DEFAULT_HEIGHT,
  accentColor = 'var(--dashboard-accent-primary)',
}: WeeklyBarChartProps) {
  // Tính toán dimensions
  const chartWidth = data.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP;
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full">
      {/* SVG Chart */}
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${chartWidth} ${height}`}
        preserveAspectRatio="xMidYMax meet"
        className="overflow-visible"
      >
        {data.map((bar, index) => {
          // Normalize value để fit trong height
          const barHeight = (bar.value / maxValue) * (height - 24);
          const x = index * (BAR_WIDTH + BAR_GAP);
          const y = height - 24 - barHeight;

          return (
            <g key={index}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={BAR_WIDTH}
                height={barHeight}
                rx={BAR_RADIUS}
                ry={BAR_RADIUS}
                fill={bar.isHighlight ? accentColor : 'currentColor'}
                className={
                  bar.isHighlight
                    ? 'opacity-100 transition-opacity duration-150 hover:opacity-80'
                    : 'text-muted-foreground/20 hover:text-muted-foreground/40 transition-colors duration-150'
                }
              />

              {/* Value label (hiện khi highlight) */}
              {bar.isHighlight && bar.value > 0 && (
                <text
                  x={x + BAR_WIDTH / 2}
                  y={y - 8}
                  textAnchor="middle"
                  className="fill-current text-[10px] font-medium"
                  style={{ fill: accentColor }}
                >
                  {bar.value}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Day labels */}
      <div
        className="text-muted-foreground/60 mt-2 flex justify-between"
        style={{ width: chartWidth }}
      >
        {data.map((bar, index) => (
          <span
            key={index}
            className={`text-[10px] font-medium ${
              bar.isHighlight ? 'text-foreground' : ''
            }`}
            style={{ width: BAR_WIDTH, textAlign: 'center' }}
          >
            {bar.day}
          </span>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default WeeklyBarChart;
