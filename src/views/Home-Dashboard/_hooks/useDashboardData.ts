/**
 * =============================================================================
 * FILE: useDashboardData.ts
 * =============================================================================
 *
 * MÔ TẢ:
 *   Hook để fetch và quản lý dữ liệu Dashboard.
 *   Hiện tại dùng mock data, dễ dàng thay thế bằng API thật sau này.
 *
 * NGUYÊN TẮC (theo Design Constitution v1):
 *   - UI component không fetch data trực tiếp
 *   - Data được xử lý và chuẩn hóa tại hook
 *   - Trả về isLoading để UI hiển thị skeleton
 *
 * CÁCH THAY THẾ BẰNG API THẬT:
 *   1. Import API client thay vì mock data
 *   2. Thay setTimeout bằng fetch call
 *   3. Validate response với Zod schema (khuyến nghị)
 *
 * =============================================================================
 */

'use client';

import { useState, useEffect } from 'react';
import { mockDashboardData, type DashboardData } from '../_data';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Kết quả trả về từ hook
 */
interface UseDashboardDataReturn {
  /** Dữ liệu dashboard, null khi đang loading hoặc lỗi */
  data: DashboardData | null;
  /** Trạng thái loading - dùng để hiển thị skeleton */
  isLoading: boolean;
  /** Thông báo lỗi nếu có */
  error: string | null;
  /** Hàm refresh data (gọi lại API) */
  refetch: () => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Thời gian giả lập loading (ms)
 * Trong production, xóa bỏ setTimeout và dùng fetch thật
 */
const MOCK_LOADING_DELAY = 800;

// =============================================================================
// HOOK
// =============================================================================

/**
 * Hook quản lý dữ liệu cho Home Dashboard
 *
 * @example
 * ```tsx
 * function DashboardPage() {
 *   const { data, isLoading, error } = useDashboardData();
 *
 *   if (error) return <ErrorState message={error} />;
 *
 *   return (
 *     <StatOverview
 *       stats={data?.stats}
 *       isLoading={isLoading}
 *     />
 *   );
 * }
 * ```
 */
export function useDashboardData(): UseDashboardDataReturn {
  // State quản lý data
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Biến để track mount status (tránh update state sau unmount)
  const [fetchTrigger, setFetchTrigger] = useState(0);

  /**
   * Hàm fetch data
   * Trong production, thay thế bằng API call thật
   */
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      // Reset states
      setIsLoading(true);
      setError(null);

      try {
        // ============================================
        // TODO: Thay thế đoạn này bằng API call thật
        // ============================================
        // Ví dụ:
        // const response = await fetch('/api/dashboard');
        // const json = await response.json();
        // const validated = DashboardDataSchema.parse(json);
        //
        // Hiện tại: Giả lập loading delay với mock data
        await new Promise((resolve) => setTimeout(resolve, MOCK_LOADING_DELAY));

        // Chỉ update state nếu component vẫn mounted
        if (isMounted) {
          setData(mockDashboardData);
          setIsLoading(false);
        }
      } catch (err) {
        // Xử lý lỗi
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải dữ liệu'
          );
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function - đánh dấu unmounted
    return () => {
      isMounted = false;
    };
  }, [fetchTrigger]);

  /**
   * Hàm refetch - gọi khi cần refresh data
   */
  const refetch = () => {
    setFetchTrigger((prev) => prev + 1);
  };

  return {
    data,
    isLoading,
    error,
    refetch,
  };
}

// =============================================================================
// EXPORT
// =============================================================================

export default useDashboardData;
