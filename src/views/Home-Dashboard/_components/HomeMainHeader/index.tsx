/**
 * =============================================================================
 * FILE: HomeMainHeader/index.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Container cho phần header của Home Dashboard theo Bento UI.
 *   BENTO ROW - 2 blocks riêng biệt với height đồng bộ.
 *
 * BENTO RULES:
 *   - Sử dụng bento-row class để đảm bảo align-items: stretch
 *   - 2 blocks riêng biệt với height bằng nhau
 *   - Grid layout với gap lớn
 *
 * =============================================================================
 */

'use client';

import React from 'react';
import { WelcomeSection } from './WelcomeSection';
import { ContextQuickPanel } from './ContextQuickPanel';
import type { UserContext } from '../../_data';

// =============================================================================
// TYPES
// =============================================================================

interface HomeMainHeaderProps {
  userContext?: UserContext;
  isLoading: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * HomeMainHeader - Bento Row với 2 blocks
 *
 * Layout:
 * ┌────────────────────────────────────┐  ┌────────────────┐
 * │  [Lottie]  Xin chào, Đoàn Minh    │  │ 📝 5 Bài nháp  │
 * │            Chúc bạn một ngày...    │  │ 📅 2 Lịch...   │
 * │                                    │  │ ⏰ 8 Chờ...    │
 * └────────────────────────────────────┘  └────────────────┘
 */
export function HomeMainHeader({
  userContext,
  isLoading,
}: HomeMainHeaderProps) {
  return (
    <section className="bento-row grid-cols-[1fr_auto] items-stretch lg:gap-4">
      {/* Block 1: Welcome Section */}
      <WelcomeSection
        userName={userContext?.userName}
        greeting={userContext?.greeting}
        isLoading={isLoading}
      />

      {/* Block 2: Context Quick Panel - h-full để follow height của block 1 */}
      <div className="hidden h-full lg:block">
        <ContextQuickPanel context={userContext} isLoading={isLoading} />
      </div>
    </section>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default HomeMainHeader;
export { WelcomeSection } from './WelcomeSection';
export { ContextQuickPanel } from './ContextQuickPanel';
