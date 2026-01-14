/**
 * =============================================================================
 * FILE: TrafficLineChart.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   SVG Line Chart tối giản (Sparkline style).
 *   Hiển thị xu hướng traffic (L1 Question: "Tăng hay giảm?").
 *
 * FEATURES:
 *   - Smooth Curve (Bezier)
 *   - Gradient Fill dưới line
 *   - Hover tooltip đơn giản
 *   - Responsive width
 *
 * =============================================================================
 */

'use client';

import React, { useMemo, useState } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface TrafficLineChartProps {
  data: number[];
  labels: string[];
  height?: number;
  color?: string; // Hex color
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Tạo path d cho SVG cubic bezier curve
 */
function createPath(data: number[], width: number, height: number): string {
  if (data.length === 0) return '';

  const max = Math.max(...data, 1);
  const min = 0; // Luôn bắt đầu từ 0 để thấy quy mô thật
  const range = max - min;

  // Tính tọa độ (x, y) cho từng điểm
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height; // Invert y vì SVG y=0 ở trên
    return { x, y };
  });

  // Tạo lệnh path
  return points.reduce((path, point, i, arr) => {
    if (i === 0) return `M ${point.x},${point.y}`;

    // Cubic bezier control points (làm mượt)
    const prev = arr[i - 1];
    const controlX1 = prev.x + (point.x - prev.x) * 0.4;
    const controlY1 = prev.y;
    const controlX2 = point.x - (point.x - prev.x) * 0.4;
    const controlY2 = point.y;

    return `${path} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${point.x},${point.y}`;
  }, '');
}

// =============================================================================
// COMPONENT
// =============================================================================

export function TrafficLineChart({
  data,
  labels,
  height = 200,
  color = '#0fb9b1', // Default Teal
}: TrafficLineChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // SVG ViewBox dimensions (fix width internal 1000 unit để dễ tính toán)
  const VIEW_WIDTH = 1000;

  const pathD = useMemo(
    () => createPath(data, VIEW_WIDTH, height - 40), // -40 cho padding bottom axis
    [data, height]
  );

  const fillPathD = `${pathD} L ${VIEW_WIDTH},${height} L 0,${height} Z`;

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Area Fill */}
        <path d={fillPathD} fill="url(#chartGradient)" />

        {/* Line Stroke */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hover Interaction Layer */}
        {data.map((val, i) => {
          const x = (i / (data.length - 1)) * VIEW_WIDTH;
          // Normalized Y lại cần tính lại để đặt dot
          const max = Math.max(...data, 1);
          const y = height - 40 - (val / max) * (height - 40);

          return (
            <g
              key={i}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {/* Invisible Hit Area */}
              <rect
                x={x - VIEW_WIDTH / data.length / 2}
                y={0}
                width={VIEW_WIDTH / data.length}
                height={height}
                fill="transparent"
                className="cursor-crosshair"
              />

              {/* Active Dot & Line */}
              {hoverIndex === i && (
                <>
                  <line
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={height}
                    stroke={color}
                    strokeDasharray="4 4"
                    strokeOpacity={0.5}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={6}
                    fill={color}
                    stroke="white"
                    strokeWidth={2}
                  />
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* Accesssible/Visual Labels (Trục X) */}
      <div className="text-muted-foreground absolute bottom-0 flex w-full justify-between px-2 text-xs font-medium tracking-wider uppercase">
        {labels.map((label, i) => (
          <span
            key={i}
            className={hoverIndex === i ? 'text-foreground font-bold' : ''}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Tooltip Floating Absolute */}
      {hoverIndex !== null && (
        <div
          className="bg-background pointer-events-none absolute top-0 -translate-x-1/2 transform rounded border px-2 py-1 text-xs font-semibold shadow-lg transition-all"
          style={{
            left: `${(hoverIndex / (data.length - 1)) * 100}%`,
            borderColor: color,
          }}
        >
          {data[hoverIndex]} views
        </div>
      )}
    </div>
  );
}
