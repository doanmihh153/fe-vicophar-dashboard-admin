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
import type { UserContext } from '../../../../_data';

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
    iconClass: '', // Unused in new design
    bgClass: 'watermark-card--drafts',
  },
  {
    key: 'todayAppointments',
    label: 'Lịch hôm nay',
    Icon: Calendar,
    iconClass: '',
    bgClass: 'watermark-card--appointments',
  },
  {
    key: 'pendingReviews',
    label: 'Chờ duyệt',
    Icon: Clock,
    iconClass: '',
    bgClass: 'watermark-card--pending',
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
      <h3 className="mb-3 text-base font-medium tracking-widest uppercase">
        Nhắc nhở
      </h3>

      {/* Grid items - vertical stack */}
      <div className="flex flex-1 flex-col gap-2">
        {PANEL_ITEMS.map((item) => {
          const { Icon } = item;

          return (
            <div
              key={item.key}
              className={`watermark-card flex-1 ${item.bgClass}`}
            >
              {/* Content Layer (z-10) */}
              <div className="relative z-10 flex cursor-pointer items-center justify-between">
                <div className="flex flex-col">
                  {isLoading ? (
                    <Skeleton className="h-6 w-8 bg-white/20" />
                  ) : (
                    <span className="text-xl leading-none font-bold">
                      {context?.[item.key] ?? 0}
                    </span>
                  )}
                  <span className="font-signature text-sm opacity-90">
                    {item.label}
                  </span>
                </div>
              </div>

              {/* Watermark Icon Layer (z-0) */}
              <Icon className="watermark-icon" />
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
