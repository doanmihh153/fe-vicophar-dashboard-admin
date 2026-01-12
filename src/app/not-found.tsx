'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { DashboardLayout } from '@/components/layout';
import notFoundAnimation from '@/assets/lottie/404-not-found.json';

import { Skeleton } from '@/components/ui/Skeleton';

// Dynamic import Lottie to avoid SSR issues with canvas/window
const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full max-w-[400px]" />,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as React.ComponentType<any>;

/**
 * ===================================================================
 * GLOBAL 404 PAGE
 * ===================================================================
 *
 * Page này hiển thị khi user truy cập route không tồn tại.
 * Được wrap bởi DashboardLayout để giữ sidebar navigation.
 */
export default function NotFound() {
  return (
    <DashboardLayout headerTitle="Page Not Found">
      <div className="flex h-full flex-col items-center justify-center space-y-6 p-8 text-center">
        {/* Lottie Animation */}
        <div className="w-full max-w-[400px]">
          <Lottie
            animationData={notFoundAnimation}
            loop={true}
            className="h-auto w-full"
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Không tìm thấy trang này</h3>
          <p className="font-signature text-muted-foreground max-w-md">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>

        {/* Back Button */}
        <Link
          href="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-2.5 font-medium transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </DashboardLayout>
  );
}
