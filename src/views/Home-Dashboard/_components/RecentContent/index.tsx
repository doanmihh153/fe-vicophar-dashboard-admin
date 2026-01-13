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
  maxItems = 6,
}: RecentContentProps) {
  return (
    <section className="group/carousel">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground font-display text-base tracking-widest uppercase">
          Những bài viết gần đây
        </h2>
        {/* Navigation Hints (Optional) */}
        <div className="text-muted-foreground hidden text-xs font-medium opacity-0 transition-opacity group-hover/carousel:opacity-100 md:block">
          Cuộn ngang để xem thêm &rarr;
        </div>
      </div>

      {/*
       * CAROUSEL LAYOUT (Apple Style)
       * - Flex row + Overflow Auto
       * - Snap X để bắt dính
       * - Hide Scrollbar
       */}
      <div className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {isLoading
          ? // Skeleton Loop
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[85vw] snap-center md:min-w-[300px] lg:min-w-[320px]"
              >
                <Skeleton className="aspect-2/1 w-full rounded-2xl" />
              </div>
            ))
          : // Actual Items
            items?.slice(0, maxItems).map((item) => (
              <div
                key={item.id}
                className="min-w-[85vw] snap-center select-none md:min-w-[300px] lg:min-w-[320px]"
              >
                <RecentCard item={item} />
              </div>
            ))}
      </div>
    </section>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default RecentContent;
export { RecentCard } from './RecentCard';
