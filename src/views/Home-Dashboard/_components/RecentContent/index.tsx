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
import { RecentCard } from './RecentCard';
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
  maxItems = 6, // Tăng lên 6 để lấp đầy grid 3 cột (2 hàng)
}: RecentContentProps) {
  return (
    <section>
      {/*
       * Section Header
       */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-foreground font-display text-base tracking-widest uppercase">
          Những bài viết gần đây
        </h2>
        {/* Có thể thêm View All Link ở đây nếu cần */}
      </div>

      {/*
       * GRID LAYOUT
       * Mobile: 1 cột
       * Tablet: 2 cột
       * Desktop: 3 cột
       */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? // Skeleton placeholders (Card shape)
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-2/1 w-full rounded-2xl" />
            ))
          : // Actual items
            items
              ?.slice(0, maxItems)
              .map((item) => <RecentCard key={item.id} item={item} />)}
      </div>
    </section>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default RecentContent;
export { RecentItem } from './RecentItem';
