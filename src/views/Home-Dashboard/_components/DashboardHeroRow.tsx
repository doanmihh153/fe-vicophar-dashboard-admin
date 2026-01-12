/**
 * =============================================================================
 * FILE: DashboardHeroRow.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Grid 2 cột cho Dashboard Hero Section.
 *   - Cột 1 (lớn): DashboardHeader
 *   - Cột 2 (nhỏ): Placeholder với gradient background
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import { DashboardHeader } from './DashboardHeader';

interface DashboardHeroRowProps {
  userName: string;
  greeting: string;
  isLoading?: boolean;
}

export function DashboardHeroRow({
  userName,
  greeting,
  isLoading = false,
}: DashboardHeroRowProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
      {/* Cột 1: DashboardHeader (lớn hơn - 2fr) */}
      <DashboardHeader
        userName={userName}
        greeting={greeting}
        isLoading={isLoading}
      />

      {/* Cột 2: Placeholder với gradient (nhỏ hơn - 1fr) */}
      <div className="from-primary/20 border-border/50 hidden min-h-[300px] items-center justify-center rounded-3xl border bg-linear-to-br via-purple-500/20 to-pink-500/20 backdrop-blur-sm lg:flex">
        <div className="p-6 text-center">
          <div className="mb-2 text-4xl">🚀</div>
          <p className="text-muted-foreground text-sm">Sắp có nội dung mới!</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeroRow;
