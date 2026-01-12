/**
 * =============================================================================
 * FILE: HomeMainHeader/index.tsx
 * =============================================================================
 *
 * MÔ TẢ:
 *   Container cho phần header chính của Home Dashboard.
 *   Bao gồm WelcomeSection (trái) và ContextQuickPanel (phải).
 *
 * LAYOUT:
 *   Grid 2 cột: [1fr auto]
 *   - Cột 1: WelcomeSection (chiếm không gian còn lại)
 *   - Cột 2: ContextQuickPanel (auto width, ẩn trên mobile)
 *
 * NGUYÊN TẮC:
 *   - Component này chỉ làm layout
 *   - Không chứa logic xử lý data
 *   - Pass props xuống component con
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
  /** Thông tin ngữ cảnh user từ API/hook */
  userContext?: UserContext;
  /** Trạng thái loading */
  isLoading: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * HomeMainHeader - Header chính của Home Dashboard
 *
 * Layout (Desktop):
 * ┌─────────────────────────────────────────────────────────────┐
 * │ [Lottie]  Xin chào, Đoàn Minh      │  5    2    8          │
 * │           Chúc bạn một ngày...      │ Nháp Lịch Duyệt       │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Layout (Mobile):
 * ┌─────────────────────────────────────────────────────────────┐
 * │ [Lottie]  Xin chào, Đoàn Minh                               │
 * │           Chúc bạn một ngày...                              │
 * └─────────────────────────────────────────────────────────────┘
 * (ContextQuickPanel ẩn trên mobile)
 */
export function HomeMainHeader({
  userContext,
  isLoading,
}: HomeMainHeaderProps) {
  return (
    <section className="flex items-center justify-between">
      {/* Cột trái: Welcome Section */}
      <WelcomeSection
        userName={userContext?.userName}
        greeting={userContext?.greeting}
        isLoading={isLoading}
      />

      {/* Cột phải: Context Quick Panel (ẩn trên mobile) */}
      <ContextQuickPanel context={userContext} isLoading={isLoading} />
    </section>
  );
}

// =============================================================================
// EXPORT
// =============================================================================

export default HomeMainHeader;
export { WelcomeSection } from './WelcomeSection';
export { ContextQuickPanel } from './ContextQuickPanel';
