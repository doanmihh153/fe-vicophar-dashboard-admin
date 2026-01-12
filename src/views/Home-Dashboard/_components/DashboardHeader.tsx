'use client';

/**
 * =============================================================================
 * FILE: DashboardHeader.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Header chào mừng cho Dashboard với Lottie animation.
 *
 * =============================================================================
 */

import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';
import welcomeAnimation from '@/assets/lottie/Welcom-lottie.json';

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <Skeleton className="h-full min-h-[200px] w-full" />,
});

interface DashboardHeaderProps {
  userName: string;
  greeting: string;
  isLoading: boolean;
}

export function DashboardHeader({
  userName,
  greeting,
  isLoading,
}: DashboardHeaderProps) {
  return (
    <div className="border-border/50 relative w-full overflow-hidden rounded-3xl border bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm">
      <div className="flex min-h-[300px] flex-col items-center justify-between gap-6 p-2 md:flex-row lg:p-4">
        {/* LOTTIE ANIMATION */}
        <div className="w-[150px] shrink-0 lg:w-[200px]">
          {isLoading ? (
            <Skeleton className="aspect-square w-full rounded-xl" />
          ) : (
            <Lottie
              animationData={welcomeAnimation}
              loop={true}
              className="h-full w-full"
            />
          )}
        </div>
        {/* TEXT CONTENT */}
        <div className="z-10 flex-1 space-y-3 text-center md:text-left">
          {isLoading ? (
            <>
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-6 w-80" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold lg:text-4xl">
                <span className="font-signature text-muted-foreground mr-2 font-normal">
                  Xin chào,
                </span>
                <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                  {userName}!
                </span>
                <span className="ml-2">👋</span>
              </h1>
              <p className="text-muted-foreground max-w-md text-base lg:text-lg">
                {greeting}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
