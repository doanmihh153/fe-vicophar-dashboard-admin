/**
 * =============================================================================
 * FILE: VisualCard.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Component Card tập trung vào hình ảnh (Visual-led), phong cách Bento Grid.
 *   Thường dùng cho: Featured Content, Product Showcase, Recommendation.
 *
 * FEATURES:
 *   - Aspect Ratio: 2:1 (Cinematic).
 *   - Overlay: Gradient tối giúp text luôn nổi bật trên nền ảnh.
 *   - Typography: Clean, hiện đại.
 *   - Slot: Hỗ trợ Badge (góc trên) và Action Button (góc dưới).
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface VisualCardProps extends React.HTMLAttributes<HTMLDivElement> {
  // --- Data Props ---
  title: string;
  subtitle?: string;
  image?: string;

  // --- Visual Props ---
  /** Tỷ lệ khung hình. Default: 2/1 (Cinematic w/ request). 'custom' = tắt aspect-ratio để set h/w thủ công. */
  aspectRatio?: '2/1' | 'video' | 'square' | 'portrait' | '3/2' | 'custom';
  /** Tối ưu hiển thị text (Light on Dark hoặc Dark on Light) */
  variant?: 'dark' | 'light';

  // --- Slot Props ---
  /** Nút hành động chính (Góc dưới phải). Default: Plus Icon */
  action?: React.ReactNode;
  /** Badge trạng thái/Rank (Góc trên phải/trái) */
  badge?: React.ReactNode;
}

export function VisualCard({
  title,
  subtitle,
  image,
  aspectRatio = '2/1', // Quy định cứng 2:1 theo yêu cầu
  variant = 'dark',
  action,
  badge,
  className,
  children,
  ...props
}: VisualCardProps) {
  // Map Aspect Ratio -> Tailwind Classes
  // NOTE: Sử dụng aspect-ratio class của Tailwind
  const aspectClass = {
    '2/1': 'aspect-[2/1]',
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[1/2]',
    '3/2': 'aspect-[3/2]',
    custom: '',
  }[aspectRatio];

  return (
    <div
      className={cn(
        // GRID STACKING LAYOUT:
        // - display: grid -> Cho phép stack các layers lên nhau
        // - place-items: stretch -> Fill toàn bộ không gian
        'group relative grid w-full cursor-pointer overflow-hidden rounded-2xl',
        aspectClass,
        className
      )}
      {...props}
    >
      {/*
       * 1. BACKGROUND LAYER (Image)
       * - Grid Area: 1 / 1 / -1 / -1 (Chiếm toàn bộ ô grid)
       * - Z-index: Default (0)
       */}
      {image && (
        <div className="col-start-1 row-start-1 h-full w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Gradient Overlay: Đảm bảo text luôn dễ đọc */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      )}

      {/*
       * 2. CONTENT LAYER
       * - Grid Area: 1 / 1 / -1 / -1 (Stack lên trên Image)
       * - Z-index: 10
       * - Layout: Flex Column, Justify Space-Between
       */}
      <div className="z-10 col-start-1 row-start-1 flex flex-col justify-between p-5 md:p-6">
        {/* Header: Badge or Empty */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col items-start gap-1">
            {/* Subtitle nằm trên Title (Apple Style) */}
            {subtitle && (
              <span className="text-xs font-bold tracking-widest text-white/70">
                {subtitle}
              </span>
            )}
            <h3
              className={cn(
                'line-clamp-2 text-base font-bold tracking-tight text-white drop-shadow-sm md:text-lg'
              )}
            >
              {title}
            </h3>
          </div>

          {/* Badge Slot */}
          {badge && <div>{badge}</div>}
        </div>

        {/* Footer: Children & Action */}
        <div className="mt-auto flex items-end justify-between pt-4">
          {/* Left Slot: Metrics, etc */}
          <div className="flex items-center gap-3 text-white/80">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
