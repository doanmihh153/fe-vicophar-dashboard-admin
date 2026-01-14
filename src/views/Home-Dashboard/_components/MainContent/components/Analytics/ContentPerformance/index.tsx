/**
 * =============================================================================
 * FILE: ContentPerformance/index.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Section hiển thị Level 2: Hiệu suất nội dung ("Content Performance").
 *   Layout: Horizontal Scroll / Carousel hoặc Grid.
 *   Question: "Bài nào đang gánh team?"
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import type { ContentPerformanceItem } from '../../../../../_data';
import { Skeleton } from '@/components/ui/Skeleton';
import { ContentCard } from './ContentCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// =============================================================================
// TYPES
// =============================================================================

interface ContentPerformanceProps {
  items?: ContentPerformanceItem[];
  isLoading: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function ContentPerformance({
  items,
  isLoading,
}: ContentPerformanceProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Action Row */}
      <div className="flex items-center justify-between">
        <h3 className="text-foreground text-lg font-semibold">
          Top 4 bài viết có lượt xem cao nhất
        </h3>
        <Link
          href="/cms/articles"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm font-medium transition-colors"
        >
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Content Grid/List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[240px] w-full rounded-2xl" />
            ))
          : items
              ?.slice(0, 4)
              .map((item, index) => (
                <ContentCard key={item.id} item={item} rank={index + 1} />
              ))}
      </div>
    </div>
  );
}
