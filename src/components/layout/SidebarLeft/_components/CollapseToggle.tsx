'use client';

/**
 * CollapseToggle Component
 * Nút toggle để mở rộng sidebar khi đang collapsed
 */

import React from 'react';
import { useDashboard } from '@/components/providers/DashboardContext';
import { ChevronLeft } from 'lucide-react';

export function CollapseToggle() {
  const { toggleLeftSidebar } = useDashboard();

  return (
    <div className="mt-auto p-3">
      <button
        onClick={toggleLeftSidebar}
        className="bg-accent text-foreground hover:bg-accent/80 mx-auto flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
        aria-label="Mở rộng sidebar"
        title="Mở rộng sidebar"
      >
        <ChevronLeft className="h-5 w-5 rotate-180" />
      </button>
    </div>
  );
}

export default CollapseToggle;
