/**
 * =============================================================================
 * FILE: DonutChart.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   SVG Donut Chart component hiển thị progress percentage.
 *   Inspired by: Crextio "Project Progress 41%" style.
 *
 * FEATURES:
 *   - Circular progress với center text
 *   - Animated progress
 *   - Customizable colors
 *
 * =============================================================================
 */

'use client';

import React from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface DonutChartProps {
  /** Giá trị phần trăm (0-100) */
  value: number;
  /** Size của chart */
  size?: number;
  /** Độ dày của stroke */
  strokeWidth?: number;
  /** Màu accent */
  accentColor?: string;
  /** Label trung tâm (optional, default = value%) */
  label?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * DonutChart - Circular progress chart
 *
 * Layout:
 * ┌─────────────────┐
 * │      ╭───╮      │
 * │     ╱     ╲     │
 * │    │  41%  │    │
 * │     ╲     ╱     │
 * │      ╰───╯      │
 * └─────────────────┘
 */
export function DonutChart({
  value,
  size = 120,
  strokeWidth = 12,
  accentColor = 'var(--dashboard-accent-primary)',
  label,
}: DonutChartProps) {
  // Calculations
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted-foreground/10"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={accentColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tabular-nums">
          {label ?? `${Math.round(value)}%`}
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default DonutChart;
