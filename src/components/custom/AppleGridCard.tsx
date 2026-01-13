/**
 * =============================================================================
 * FILE: AppleGridCard.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Card component mô phỏng style "Apple Feature Grid".
 *   Đặc điểm:
 *   - Dark Theme mặc định.
 *   - Text nằm trên (Top-Left).
 *   - Hình ảnh minh họa nằm dưới hoặc tràn viền.
 *   - Nút (+) ở góc dưới phải.
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface AppleGridCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle: string;
  image: string;
  /** Nút action tùy chỉnh (mặc định là Plus button) */
  action?: React.ReactNode;
  /** Badge hiển thị góc trên phải (Optional) */
  badge?: React.ReactNode;
}

export function AppleGridCard({
  title,
  subtitle,
  image,
  action,
  badge,
  className,
  ...props
}: AppleGridCardProps) {
  return (
    <div
      className={cn(
        'group bg-background text-foreground relative h-full w-full overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02]',
        className
      )}
      {...props}
    >
      {/*
       * 1. BACKGROUND LAYER
       * Gradient nhẹ để text dễ đọc
       */}
      <div className="bg-background absolute inset-0 z-0" />

      {/*
       * 2. CONTENT LAYER (Top)
       */}
      <div className="relative z-20 flex h-full flex-col p-6">
        {/* Header: Subtitle + Title */}
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs font-semibold tracking-widest uppercase">
            {subtitle}
          </span>
          <h3 className="font-display text-foreground line-clamp-2 max-w-[80%] text-2xl leading-tight font-bold tracking-tight md:text-3xl">
            {title}
          </h3>
        </div>

        {/* Badge Slot (Top Right) */}
        {badge && <div className="absolute top-6 right-6 z-30">{badge}</div>}

        {/* Action Button (Bottom Right) */}
        <div className="mt-auto flex w-full items-end justify-between px-1 pb-1">
          {/* Spacer */}
          <div />
        </div>
      </div>

      {/*
       * 3. IMAGE LAYER (Bottom / Background)
       * Mask gradient để hòa trộn với nền đen
       */}
      <div className="absolute top-1/2 right-0 bottom-0 left-0 z-10 transition-transform duration-700 ease-out group-hover:scale-105">
        <div className="relative h-full w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="aspect-2/1 object-cover object-center opacity-90"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Gradient Overlay: Fade to Black at top */}
          <div className="from-background absolute inset-0 bg-linear-to-b via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}
