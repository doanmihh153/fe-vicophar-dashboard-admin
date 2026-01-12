/**
 * =============================================================================
 * FILE: WelcomeSection.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Phần chào mừng với Lottie animation trong HomeMainHeader.
 *   Animation chỉ chạy 1 lần theo Design Constitution v1.
 *
 * NGUYÊN TẮC:
 *   - Không gradient text
 *   - Không emoji trong UI chính
 *   - Lottie loop = false (chạy 1 lần)
 *   - Typography theo hierarchy: page title 20-24px
 *
 * =============================================================================
 */

'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';
import welcomeAnimation from '@/assets/lottie/Welcom-lottie.json';

// =============================================================================
// DYNAMIC IMPORT - Lottie (client-only)
// =============================================================================

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-md" />,
});

// =============================================================================
// TYPES
// =============================================================================

interface WelcomeSectionProps {
  /** Tên user để hiển thị trong lời chào */
  userName?: string;
  /** Lời chào tùy theo thời điểm */
  greeting?: string;
  /** Trạng thái loading - hiển thị skeleton */
  isLoading: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * WelcomeSection - Phần chào mừng với animation
 *
 * Layout:
 * ┌─────────────────────────────────────────────────┐
 * │ [Lottie 80x80]  Xin chào, [userName]            │
 * │                 [greeting message]               │
 * └─────────────────────────────────────────────────┘
 */
export function WelcomeSection({
  userName,
  greeting,
  isLoading,
}: WelcomeSectionProps) {
  // Track animation đã chạy chưa (chỉ chạy 1 lần theo Design Constitution)
  const [hasPlayed, setHasPlayed] = useState(false);

  return (
    <div className="flex items-center gap-6">
      {/*
       * Lottie Animation Container
       * Size: 80x80 (h-20 w-20 = 80px)
       * Tuân thủ spacing system: 80 = 64 + 16
       */}
      <div className="h-20 w-20 shrink-0">
        {isLoading ? (
          <Skeleton className="h-full w-full rounded-md" />
        ) : (
          <Lottie
            animationData={welcomeAnimation}
            loop={false}
            autoplay={!hasPlayed}
            onComplete={() => setHasPlayed(true)}
            className="h-full w-full"
          />
        )}
      </div>

      {/*
       * Text Content
       * Typography: page title = 24px (text-2xl)
       * Greeting: muted-foreground, 16px (text-base)
       */}
      <div className="space-y-1">
        {isLoading ? (
          <>
            {/* Skeleton cho title */}
            <Skeleton className="h-8 w-48 rounded-md" />
            {/* Skeleton cho greeting */}
            <Skeleton className="h-4 w-64 rounded-md" />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-medium">
              {/* Dùng font-signature cho "Xin chào" theo design ban đầu */}
              <span className="font-signature text-muted-foreground">
                Xin chào,
              </span>{' '}
              <span className="text-foreground">{userName}</span>
            </h1>
            <p className="text-muted-foreground text-base">{greeting}</p>
          </>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default WelcomeSection;
