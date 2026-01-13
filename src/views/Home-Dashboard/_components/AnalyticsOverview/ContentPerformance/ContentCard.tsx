'use client';

import React from 'react';
import {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardPortal,
  PreviewCardPositioner,
  PreviewCardPopup,
} from '@/components/ui/preview-card';
import type { ContentPerformanceItem } from '../../../_data';
import { Eye, Clock } from 'lucide-react';
import { formatNumber } from '../../../_utils';
import { VisualCard } from '@/components/custom/VisualCard';
import { cn } from '@/lib/utils';

interface ContentCardProps {
  item: ContentPerformanceItem;
  rank: number;
}

export function ContentCard({ item, rank }: ContentCardProps) {
  // Create Badge for VisualCard
  const Badge = (
    <div className="flex gap-2">
      {/* Rank Badge */}
      <div className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white backdrop-blur-md">
        {rank}
      </div>
      {/* Status Badge */}
      <div
        className={cn(
          'flex items-center rounded-full px-2 text-xs font-semibold tracking-wider uppercase backdrop-blur-md',
          item.status === 'published'
            ? 'bg-emerald-500/20 text-emerald-100'
            : 'bg-amber-500/20 text-amber-100'
        )}
      >
        {item.status}
      </div>
    </div>
  );

  return (
    <PreviewCard>
      {/*
       * TRIGGER AREA: Card chính
       * Sử dụng VisualCard (2:1) làm thành phần kích hoạt
       */}
      <PreviewCardTrigger>
        <VisualCard
          title={item.title}
          subtitle={item.category}
          image={item.thumbnail}
          aspectRatio="2/1"
          badge={Badge}
        >
          {/* Slot Footer: Hiển thị nhanh số liệu (Views + Time) */}
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-white/90">
              <Eye className="h-3.5 w-3.5" />
              <span>{formatNumber(item.metrics.views)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-white/90">
              <Clock className="h-3.5 w-3.5" />
              <span>{Math.round(item.metrics.avgTime / 60)}m</span>
            </div>
          </div>
        </VisualCard>
      </PreviewCardTrigger>

      {/*
       * PREVIEW POPUP
       * Hiển thị khi hover (Logic Floating UI)
       * Mobile: w-[85vw] | Desktop: w-[320px]
       */}
      <PreviewCardPortal>
        <PreviewCardPositioner>
          <PreviewCardPopup className="w-[85vw] p-4 sm:w-[320px]">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <h4 className="text-foreground text-lg leading-tight font-bold">
                  {item.title}
                </h4>
                {/* Badge trạng thái (Mini) */}
                <span
                  className={cn(
                    'flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                    item.status === 'published'
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                  )}
                >
                  {item.status}
                </span>
              </div>

              {/* Metadata: Danh mục & Ngày đăng */}
              <p className="text-muted-foreground text-sm font-medium">
                {item.category} •{' '}
                {new Date(item.publishedAt).toLocaleDateString('vi-VN')}
              </p>

              {/* Detailed Metrics Box */}
              <div className="mt-2 flex gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                  <Eye className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-bold tabular-nums">
                    {formatNumber(item.metrics.views)}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-bold tabular-nums">
                    {Math.round(item.metrics.avgTime / 60)}m
                  </span>
                </div>
              </div>
            </div>
          </PreviewCardPopup>
        </PreviewCardPositioner>
      </PreviewCardPortal>
    </PreviewCard>
  );
}
