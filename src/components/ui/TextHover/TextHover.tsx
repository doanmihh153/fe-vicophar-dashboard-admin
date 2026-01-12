/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * TextHover - Hiệu ứng text slide từng ký tự khi hover
 * Mỗi ký tự sẽ trượt lên với delay tạo hiệu ứng wave
 */
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TextHoverProps {
  /** Text cần hiển thị */
  children: string;
  /** Custom className */
  className?: string;
  /** Duration của animation (ms) */
  duration?: number;
  /** Độ nghiêng khi animation */
  skewIntensity?: number;
  /** Màu khi hover */
  hoverColor?: string;
  /** Delay giữa các ký tự (ms) */
  charDelay?: number;
  /** Disable animation */
  disabled?: boolean;
}

export function TextHover({
  children,
  className = '',
  duration = 300,
  skewIntensity = 3,
  hoverColor,
  charDelay = 15,
  disabled = false,
}: TextHoverProps) {
  // Nếu disabled, chỉ render text thường
  if (disabled) {
    return <span className={className}>{children}</span>;
  }

  // Tách text thành mảng các ký tự
  const characters = children.split('');

  return (
    <span
      className={cn('group relative inline-block cursor-pointer', className)}
    >
      {characters.map((char, index) => (
        <span key={index} className="relative inline-block overflow-hidden">
          {/* Ký tự gốc - trượt lên khi hover */}
          <span
            className="block translate-y-0.5 skew-y-0 transform-gpu transition-all ease-[cubic-bezier(0.25,0.46,0.45,0.94)] will-change-transform group-hover:-translate-y-[110%]"
            style={{
              transitionDuration: `${duration}ms`,
              transitionDelay: `${index * charDelay}ms`,
              // @ts-expect-error
              '--tw-skew-y': `${skewIntensity}deg`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>

          {/* Ký tự clone - xuất hiện từ dưới */}
          <span
            className={cn(
              'absolute top-0 left-0 block translate-y-[110%] transform-gpu transition-all ease-[cubic-bezier(0.25,0.46,0.45,0.94)] will-change-transform group-hover:translate-y-0.5 group-hover:skew-y-0',
              hoverColor && `text-${hoverColor}`
            )}
            style={{
              transitionDuration: `${duration}ms`,
              transitionDelay: `${index * charDelay}ms`,
              // @ts-expect-error
              '--tw-skew-y': `${skewIntensity}deg`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </span>
  );
}
