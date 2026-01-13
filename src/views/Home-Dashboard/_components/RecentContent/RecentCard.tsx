/**
 * =============================================================================
 * FILE: RecentCard.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Card hiển thị nội dung gần đây (Bài viết, Sản phẩm, Tin tức).
 *   Sử dụng: VisualCard (2:1) + PreviewCard (Popup interaction).
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardPortal,
  PreviewCardPositioner,
  PreviewCardPopup,
} from '@/components/ui/preview-card';
import type { RecentContentItem } from '../../_data';
import { VisualCard } from '@/components/custom/VisualCard';
import { cn } from '@/lib/utils';
import { Eye, Clock, FileText, ShoppingBag, Newspaper } from 'lucide-react';
import { formatRelativeTime } from '../../_utils';

interface RecentCardProps {
  item: RecentContentItem;
}

export function RecentCard({ item }: RecentCardProps) {
  // --- Badge ---
  const Badge = (
    <div
      className={cn(
        'flex items-center rounded-full px-3 py-1 text-[10px] font-bold tracking-widest text-white/90 uppercase shadow-sm backdrop-blur-md',
        item.status === 'published' ? 'bg-black/30' : 'bg-amber-500/30'
      )}
    >
      {item.status === 'published' ? 'Promoted' : 'Draft'}
    </div>
  );

  // --- Icon Type ---
  const TypeIcon =
    {
      article: FileText,
      product: ShoppingBag,
      news: Newspaper,
    }[item.type] || FileText;

  // --- Subtitle (Date) ---
  const relativeTime = formatRelativeTime(item.createdAt);

  return (
    <PreviewCard>
      {/* TRIGGER */}
      <PreviewCardTrigger>
        <VisualCard
          title={item.title}
          subtitle={item.type.toUpperCase()}
          image={item.thumbnail}
          aspectRatio="2/1"
          badge={Badge}
          className="border-none shadow-none" // Force no border/shadow
          variant="dark"
        >
          {/* Footer Info & Action Button */}
          <div className="flex w-full items-end justify-between">
            <div className="flex items-center gap-2 text-white/80">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{relativeTime}</span>
            </div>

            {/* Apple-style Plus Button */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform duration-300 hover:scale-110 hover:bg-white hover:text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </div>
          </div>
        </VisualCard>
      </PreviewCardTrigger>

      {/* POPUP */}
      <PreviewCardPortal>
        <PreviewCardPositioner>
          <PreviewCardPopup className="w-[85vw] p-4 sm:w-[320px]">
            <div className="flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-foreground line-clamp-2 text-lg leading-tight font-bold">
                  {item.title}
                </h4>
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    item.type === 'product'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : item.type === 'news'
                        ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  )}
                >
                  <TypeIcon className="h-4 w-4" />
                </div>
              </div>

              {/* Date & ID */}
              <div className="flex flex-col gap-1">
                <p className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  Đã tạo {relativeTime}
                </p>
                <p className="text-muted-foreground/60 font-mono text-xs tracking-wider uppercase">
                  ID: {item.id}
                </p>
              </div>

              {/* Status Badge Large */}
              <div className="mt-1">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold uppercase',
                    item.status === 'published'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      item.status === 'published'
                        ? 'bg-emerald-500'
                        : 'bg-amber-500'
                    )}
                  />
                  {item.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                </span>
              </div>
            </div>
          </PreviewCardPopup>
        </PreviewCardPositioner>
      </PreviewCardPortal>
    </PreviewCard>
  );
}
