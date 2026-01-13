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
import { cn } from '@/lib/utils';
import type { RecentContentItem } from '../../_data';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

  // --- Drag to Scroll Logic ---
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Scroll-fast
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  // --- Button Navigation ---
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of one card approx
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative">
      {/* Header with Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground font-display text-base tracking-widest uppercase">
          Những bài viết gần đây
        </h2>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="bg-background flex h-10 w-10 items-center justify-center rounded-full"
            aria-label="Scroll Left"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => scroll('right')}
            className="bg-background flex h-10 w-10 items-center justify-center rounded-full"
            aria-label="Scroll Right"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/*
       * CAROUSEL LAYOUT
       * - Drag events attached
       * - cursor-grab active
       */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={cn(
          // Grid Layout
          'grid w-full auto-cols-[85vw] grid-flow-col gap-4 pt-2 pb-6 md:auto-cols-[300px] lg:auto-cols-[320px]',
          // Scroll & Snap
          'snap-x snap-mandatory overflow-x-auto scroll-smooth',
          // Hide Scrollbar (Cross-browser & Aggressive)
          '[-ms-overflow-style:none] [scrollbar-width:none]',
          '[&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0',
          // Interaction
          isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab'
        )}
        style={{
          scrollbarWidth: 'none',

          msOverflowStyle: 'none',
        }}
      >
        {isLoading
          ? // Skeleton Loop
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="snap-center">
                <Skeleton className="aspect-2/1 w-full rounded-2xl" />
              </div>
            ))
          : // Actual Items
            items?.slice(0, maxItems).map((item) => (
              <div key={item.id} className="snap-center select-none">
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
