/**
 * =============================================================================
 * FILE: RecentContent/index.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Section hiển thị danh sách nội dung gần đây.
 *   Hiển thị tối đa 5 items mới nhất.
 *
 * LAYOUT:
 *   - space-y-1 (4px gap giữa items)
 *   - Section title uppercase theo Typography Law
 *
 * NGUYÊN TẮC:
 *   - Không CRUD tại đây
 *   - Click → điều hướng sang trang chi tiết
 *   - Data từ props, không fetch trong component
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import { RecentItem } from './RecentItem';
import { Skeleton } from '@/components/ui/Skeleton';
import type { RecentContentItem } from '../../_data';

// =============================================================================
// TYPES
// =============================================================================

interface RecentContentProps {
  /** Danh sách nội dung gần đây */
  items?: RecentContentItem[];
  /** Trạng thái loading */
  isLoading: boolean;
  /** Số item tối đa hiển thị (mặc định 5) */
  maxItems?: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Số lượng skeleton items khi loading */
const SKELETON_COUNT = 5;

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * RecentContent - Section nội dung gần đây
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ NỘI DUNG GẦN ĐÂY                                                │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ Hướng dẫn sử dụng hệ thống...                     Đã xuất bản  │
 * │ Vừa xong                                                        │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ Vitamin C 1000mg - Cập nhật...                          Nháp   │
 * │ Hôm qua                                                         │
 * └─────────────────────────────────────────────────────────────────┘
 */
export function RecentContent({
  items,
  isLoading,
  maxItems = 5,
}: RecentContentProps) {
  return (
    <section>
      {/* Section Title - theo Typography Law */}
      <h2 className="text-muted-foreground mb-4 text-sm font-medium tracking-wide uppercase">
        Nội dung gần đây
      </h2>

      {/* Items container - space-y-1 (4px) */}
      <div className="space-y-1">
        {isLoading
          ? // Skeleton placeholders
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <Skeleton className="h-5 w-48 rounded-md" />
                  <Skeleton className="mt-2 h-3 w-24 rounded-md" />
                </div>
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
            ))
          : // Actual items - giới hạn theo maxItems
            items
              ?.slice(0, maxItems)
              .map((item) => (
                <RecentItem key={item.id} item={item} isLoading={false} />
              ))}
      </div>
    </section>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default RecentContent;
export { RecentItem } from './RecentItem';
