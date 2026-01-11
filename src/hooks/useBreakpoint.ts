/* eslint-disable react-hooks/set-state-in-effect */
'use client';

/**
 * ===================================================================
 * HOOK: useMediaQuery - CORE HOOK CHO RESPONSIVE
 * ===================================================================
 *
 * Hook này sử dụng matchMedia API để detect breakpoint.
 *
 * ===================================================================
 * TẠI SAO DÙNG matchMedia THAY VÌ window.innerWidth?
 * ===================================================================
 * 1. SYNC VỚI TAILWIND CSS:
 *    - matchMedia('(min-width: 1024px)') = Tailwind 'lg:'
 *    - Chính xác 100%, không bị lệch 1px
 *
 * 2. PERFORMANCE:
 *    - matchMedia chỉ fire event khi THỰC SỰ vượt breakpoint
 *    - window.resize fire LIÊN TỤC khi kéo
 *
 * 3. NATIVE API:
 *    - Không cần debounce/throttle
 *    - Browser tự optimize
 *
 * ===================================================================
 * CÁCH SỬ DỤNG
 * ===================================================================
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 * // isDesktop = true khi viewport ≥ 1024px (lg)
 * // isDesktop = false khi viewport < 1024px
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook detect media query sử dụng matchMedia API
 *
 * @param query - CSS media query string, ví dụ: '(min-width: 1024px)'
 * @returns boolean - true nếu query match, false nếu không
 */
export function useMediaQuery(query: string): boolean {
  /**
   * STATE: Kết quả match
   * Mặc định false để tránh hydration mismatch (SSR luôn là false)
   */
  const [matches, setMatches] = useState(false);

  /**
   * Handler khi media query thay đổi
   * Sử dụng useCallback để stable reference
   */
  const handleChange = useCallback(
    (event: MediaQueryListEvent | MediaQueryList) => {
      setMatches(event.matches);
    },
    []
  );

  useEffect(() => {
    /**
     * Tạo MediaQueryList object
     * Đây là native browser API, performance tốt nhất
     */
    const mediaQuery = window.matchMedia(query);

    // Set giá trị ban đầu
    handleChange(mediaQuery);

    /**
     * Lắng nghe thay đổi
     * - Chỉ fire khi VƯỢT QUA breakpoint
     * - Không fire liên tục như window.resize
     */
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query, handleChange]);

  return matches;
}

/* ===== TAILWIND BREAKPOINT CONSTANTS ===== */

/**
 * Các breakpoint đồng bộ với tailwind.config.js
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px (DESKTOP BREAKPOINT CHÍNH)
 * - xl: 1280px
 * - 2xl: 1536px
 */
export const BREAKPOINTS = {
  SM: '(min-width: 640px)',
  MD: '(min-width: 768px)',
  LG: '(min-width: 1024px)', // Desktop breakpoint
  XL: '(min-width: 1280px)',
  XXL: '(min-width: 1536px)',
} as const;

/* ===== CONVENIENCE HOOKS ===== */

/**
 * Hook kiểm tra có phải Desktop không (≥ 1024px / lg)
 *
 * Desktop = Grid layout với sidebars là columns
 * Tablet/Mobile = Drawer overlay
 *
 * @returns true nếu viewport ≥ 1024px
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(BREAKPOINTS.LG);
}

/**
 * Hook kiểm tra có phải Tablet không (≥ 768px và < 1024px)
 */
export function useIsTablet(): boolean {
  const isAboveMd = useMediaQuery(BREAKPOINTS.MD);
  const isAboveLg = useMediaQuery(BREAKPOINTS.LG);
  return isAboveMd && !isAboveLg;
}

/**
 * Hook kiểm tra có phải Mobile không (< 768px)
 */
export function useIsMobile(): boolean {
  const isAboveMd = useMediaQuery(BREAKPOINTS.MD);
  return !isAboveMd;
}

/* ===== DEFAULT EXPORT ===== */
export default useMediaQuery;
