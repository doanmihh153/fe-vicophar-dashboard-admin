/**
 * =============================================================================
 * FILE: ContextQuickPanel.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Panel tóm tắt trạng thái nhanh trong HomeMainHeader.
 *   Hiển thị các số liệu quan trọng: bài nháp, lịch hôm nay, chờ duyệt.
 *
 * NGUYÊN TẮC (theo Design Constitution v1):
 *   - Không divider, không border
 *   - Phân tách bằng spacing (gap-6 = 24px)
 *   - Số liệu dùng tabular-nums để căn đều
 *   - Typography: số = 24px, label = 12px
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';
import type { UserContext } from '../../_data';

// =============================================================================
// TYPES
// =============================================================================

interface ContextQuickPanelProps {
  /** Thông tin ngữ cảnh user */
  context?: UserContext;
  /** Trạng thái loading */
  isLoading: boolean;
}

/**
 * Config cho các item trong panel
 * Tách riêng để dễ thêm/bớt items sau này
 */
interface PanelItem {
  /** Key để lấy giá trị từ context */
  key: keyof Pick<
    UserContext,
    'draftsCount' | 'todayAppointments' | 'pendingReviews'
  >;
  /** Label hiển thị */
  label: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Danh sách items trong Context Quick Panel
 * Thêm/bớt items tại đây, UI tự động update
 */
const PANEL_ITEMS: PanelItem[] = [
  { key: 'draftsCount', label: 'Bài nháp' },
  { key: 'todayAppointments', label: 'Lịch hôm nay' },
  { key: 'pendingReviews', label: 'Chờ duyệt' },
];

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ContextQuickPanel - Tóm tắt trạng thái nhanh
 *
 * Layout:
 * ┌────────────────────────────────────────┐
 * │   5           2           8            │
 * │ Bài nháp  Lịch hôm nay  Chờ duyệt      │
 * └────────────────────────────────────────┘
 *
 * Phân tách: gap-6 (24px), không divider
 */
export function ContextQuickPanel({
  context,
  isLoading,
}: ContextQuickPanelProps) {
  return (
    <div className="hidden items-center gap-6 opacity-70 lg:flex">
      {PANEL_ITEMS.map((item) => (
        <div key={item.key} className="text-center">
          {isLoading ? (
            // Skeleton cho số - căn giữa
            <Skeleton className="mx-auto h-5 w-6 rounded-md" />
          ) : (
            // Số liệu - giảm size xuống text-lg để không tranh spotlight
            <span className="text-lg font-medium tabular-nums">
              {context?.[item.key] ?? 0}
            </span>
          )}
          {/* Label - giữ nguyên size nhỏ */}
          <span className="text-muted-foreground mt-1 block text-[10px] tracking-wider uppercase">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default ContextQuickPanel;
