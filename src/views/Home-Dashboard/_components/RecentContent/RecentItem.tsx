/**
 * =============================================================================
 * FILE: RecentItem.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Item đơn lẻ trong danh sách nội dung gần đây.
 *   Hiển thị tiêu đề, thời gian tạo, và trạng thái.
 *
 * INTERACTION:
 *   - Hover: bg-muted/50, transition 150ms
 *   - Click: điều hướng đến trang chi tiết
 *
 * COLOR LAW:
 *   - Status draft: text-amber (không dùng badge background)
 *   - Status published: text-emerald
 *   - Accent color chỉ dùng cho trạng thái, không trang trí
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatRelativeTime } from '../../_utils';
import type { RecentContentItem } from '../../_data';

// =============================================================================
// TYPES
// =============================================================================

interface RecentItemProps {
  /** Dữ liệu item */
  item: RecentContentItem;
  /** Trạng thái loading */
  isLoading: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * RecentItem - Item trong danh sách nội dung gần đây
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Tiêu đề bài viết rất dài có thể bị cắt...       Đã xuất bản    │
 * │ 2 giờ trước                                                     │
 * └─────────────────────────────────────────────────────────────────┘
 */
export function RecentItem({ item, isLoading }: RecentItemProps) {
  // Skeleton khi loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-4">
        <div className="flex-1">
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="mt-2 h-3 w-24 rounded-md" />
        </div>
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className="hover:bg-muted/50 flex items-center justify-between p-4 transition-colors duration-150"
    >
      {/* Nội dung trái: Title + Time */}
      <div className="min-w-0 flex-1">
        {/* Title - truncate nếu quá dài */}
        <span className="block truncate font-medium">{item.title}</span>

        {/* Thời gian tạo - dùng relative time */}
        <span className="text-muted-foreground mt-1 block text-xs">
          {formatRelativeTime(item.createdAt)}
        </span>
      </div>

      {/*
       * Status indicator
       * Chỉ dùng text color, KHÔNG dùng badge background (theo Design Constitution)
       * Amber cho draft, Emerald cho published
       */}
      <span
        className={`text-xs font-medium ${
          item.status === 'draft'
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-emerald-600 dark:text-emerald-400'
        }`}
      >
        {item.status === 'draft' ? 'Nháp' : 'Đã xuất bản'}
      </span>
    </Link>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default RecentItem;
