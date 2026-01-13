/**
 * =============================================================================
 * FILE: ContextQuickPanel.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Block hiển thị các quick stats theo Bento UI style.
 *   ĐÂY LÀ 1 BLOCK RIÊNG BIỆT - không dính với WelcomeSection.
 *
 * BENTO RULES:
 *   - 1 Block = 1 Chức năng (Quick Stats)
 *   - Height đồng bộ với WelcomeSection (bento-block--header)
 *   - Sử dụng bento-item class cho pills
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import { FileEdit, Calendar, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/Skeleton';
import type { UserContext } from '../../_data';

// =============================================================================
// TYPES
// =============================================================================

interface ContextQuickPanelProps {
  context?: UserContext;
  isLoading: boolean;
}

interface PanelItem {
  key: keyof Pick<
    UserContext,
    'draftsCount' | 'todayAppointments' | 'pendingReviews'
  >;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  bgClass: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const PANEL_ITEMS: PanelItem[] = [
  {
    key: 'draftsCount',
    label: 'Bài nháp',
    Icon: FileEdit,
    iconClass: 'text-amber-600 dark:text-amber-400',
    bgClass: 'bg-amber-100 dark:bg-amber-900/30',
  },
  {
    key: 'todayAppointments',
    label: 'Lịch hôm nay',
    Icon: Calendar,
    iconClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    key: 'pendingReviews',
    label: 'Chờ duyệt',
    Icon: Clock,
    iconClass: 'text-rose-600 dark:text-rose-400',
    bgClass: 'bg-rose-100 dark:bg-rose-900/30',
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * ContextQuickPanel - Bento Block cho Quick Stats
 *
 * Sử dụng class: bento-block bento-block--header
 * Height đồng bộ với WelcomeSection
 */
export function ContextQuickPanel({
  context,
  isLoading,
}: ContextQuickPanelProps) {
  return (
    <div className="bento-block bento-block--header bento-block--context h-full w-64">
      {/* Title nhỏ */}
      <h3 className="text-muted-foreground/60 mb-3 text-[10px] font-medium tracking-widest uppercase">
        Nhắc nhở
      </h3>

      {/* Grid items - vertical stack */}
      <div className="flex flex-1 flex-col justify-center gap-2">
        {PANEL_ITEMS.map((item) => {
          const { Icon } = item;

          return (
            <div
              key={item.key}
              className="bento-item bg-muted/50 flex items-center gap-3 px-3 py-2"
            >
              {/* Icon với background */}
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${item.bgClass}`}
              >
                <Icon className={`h-3.5 w-3.5 ${item.iconClass}`} />
              </div>

              {/* Content */}
              <div className="flex items-center gap-1.5">
                {isLoading ? (
                  <Skeleton className="h-4 w-16 rounded-full" />
                ) : (
                  <>
                    <span className="text-sm font-semibold tabular-nums">
                      {context?.[item.key] ?? 0}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {item.label}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default ContextQuickPanel;
