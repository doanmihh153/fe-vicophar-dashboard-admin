/**
 * ============================================
 * MOTION NAV - CỔ VŨ ADMIN
 * ============================================
 *
 * Component hiển thị animation Lottie và câu cổ vũ cho admin.
 * Nằm ở bottom của Left Panel.
 *
 * Tính năng:
 * - Lottie animation (Supperman-business)
 * - Câu cổ vũ ngẫu nhiên
 * - Skeleton loading state
 * - Tỉ lệ 1.8:1
 */

'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';

// Dynamic import Lottie để tránh SSR issues
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <MotionNavSkeleton />,
});

// Import animation data
import welcomeAnimation from '@/assets/lottie/Welcom-lottie.json';

// ============================================
// CÂU CỔ VŨ CHO ADMIN
// ============================================
const motivationalQuotes = [
  'Bạn đang làm rất tốt! 💪',
  'Hôm nay là ngày tuyệt vời!',
  'Mỗi bước đi là một tiến bộ!',
  'Sự kiên trì sẽ đưa bạn đến thành công!',
  'Bạn là nguồn cảm hứng! ✨',
  'Tiếp tục phát huy nhé!',
  'Cố lên, bạn làm được mà!',
  'Thành công đang chờ bạn phía trước!',
  'Năng lượng hôm nay tràn đầy! 🔥',
  'Bạn là người không thể thay thế!',
];

// ============================================
// SKELETON COMPONENT
// ============================================
function MotionNavSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 p-3">
      {/* Lottie placeholder */}
      <Skeleton
        className="w-full rounded-xl"
        style={{ aspectRatio: '1.8 / 1' }}
      />
      {/* Quote placeholder */}
      <Skeleton className="h-4 w-3/4 rounded-md" />
    </div>
  );
}

// ============================================
// PROPS
// ============================================
interface MotionNavProps {
  /** Có đang collapsed không (chỉ hiện Lottie, ẩn text) */
  isCollapsed?: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================
export function MotionNav({ isCollapsed = false }: MotionNavProps) {
  const [mounted, setMounted] = useState(false);
  const [quote, setQuote] = useState('');

  // Random quote khi mount
  useEffect(() => {
    // Dùng queueMicrotask để tránh cascading renders warning
    queueMicrotask(() => {
      setMounted(true);
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setQuote(motivationalQuotes[randomIndex]);
    });
  }, []);

  return (
    <div
      className={`flex flex-col items-center gap-2 p-3 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'h-0 overflow-hidden p-0 opacity-0' : 'h-auto opacity-100'
      }`}
    >
      {/* Lottie Animation - Tỉ lệ 1.8:1 */}
      <div
        className="w-full overflow-hidden rounded-xl"
        style={{ aspectRatio: '1.8 / 1' }}
      >
        <Lottie
          animationData={welcomeAnimation}
          loop
          autoplay
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Câu cổ vũ */}
      <p className="text-muted-foreground text-center text-sm font-medium">
        {quote}
      </p>
    </div>
  );
}

export default MotionNav;
