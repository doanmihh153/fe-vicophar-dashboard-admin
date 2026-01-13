/**
 * =============================================================================
 * FILE: WelcomeSection.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Block chào mừng theo Bento UI style.
 *   Lottie animation fill toàn bộ chiều cao bên trái (như reference)
 *
 * REFERENCE: Banana card - image fill height, tràn ra ngoài
 *
 * =============================================================================
 */

'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';
import supermanAnimation from '@/assets/lottie/Supperman-business.json';

// =============================================================================
// DYNAMIC IMPORT
// =============================================================================

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-xl" />,
});

// =============================================================================
// TYPES
// =============================================================================

interface WelcomeSectionProps {
  userName?: string;
  greeting?: string;
  isLoading: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * WelcomeSection - Bento Block với image fill height
 *
 * Layout (như reference - banana card):
 * ┌─────────────────────────────────────────────────────────┐
 * │         │                                               │
 * │ [Lottie │   Xin chào, Đoàn Minh                        │
 * │  FILL   │   Chúc bạn một ngày...                       │
 * │ HEIGHT] │                                               │
 * └─────────────────────────────────────────────────────────┘
 */
export function WelcomeSection({
  userName,
  greeting,
  isLoading,
}: WelcomeSectionProps) {
  const [hasPlayed, setHasPlayed] = useState(false);

  return (
    <div className="bento-block bento-block--header bento-block--welcome bento-pattern flex items-center overflow-hidden p-0">
      {/* Grid 2 cột: Lottie fill left + Text với padding */}
      <div className="grid h-full w-full grid-cols-[auto_1fr] items-center gap-4">
        {/*
         * Cột 1: Lottie Container
         * - Dùng bento-lottie-square class (160x160px)
         * - Có background nhẹ
         */}
        <div className="bento-lottie-square flex items-center justify-center">
          {isLoading ? (
            <Skeleton className="h-3/4 w-3/4 rounded-xl" />
          ) : (
            <Lottie
              animationData={supermanAnimation}
              loop={true}
              autoplay={!hasPlayed}
              onComplete={() => setHasPlayed(true)}
              className="h-full w-full"
            />
          )}
        </div>

        {/*
         * Cột 2: Text Content
         * - Có padding riêng
         * - Căn giữa vertical
         */}
        <div className="flex flex-col justify-center space-y-2 p-6">
          {isLoading ? (
            <>
              <Skeleton className="h-9 w-56 rounded-lg" />
              <Skeleton className="h-5 w-72 rounded-lg" />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-semibold tracking-tight">
                <span className="font-signature text-muted-foreground">
                  Xin chào,
                </span>{' '}
                <span className="text-foreground">{userName}</span>
              </h1>
              <p className="text-muted-foreground text-lg">{greeting}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default WelcomeSection;
