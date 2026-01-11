/* eslint-disable react-hooks/set-state-in-effect */
'use client';

/**
 * ===================================================================
 * HOOK: useMediaQuery - CORE HOOK CHO RESPONSIVE DETECTION
 * ===================================================================
 *
 * Hook này sử dụng matchMedia API để detect breakpoint.
 * Đây là lớp BREAKPOINT DETECTION trong kiến trúc 3 lớp.
 *
 * ===================================================================
 * VAI TRÒ TRONG KIẾN TRÚC 3 LỚP
 * ===================================================================
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ LỚP 1: BREAKPOINT DETECTION (useBreakpoint.ts) ← FILE NÀY      │
 * │                                                                 │
 * │ Trách nhiệm:                                                   │
 * │ - Detect viewport size bằng matchMedia                         │
 * │ - Cung cấp hooks: useIsDesktop, useIsMobile, useIsTablet       │
 * │ - Đồng bộ với Tailwind CSS breakpoints                         │
 * │                                                                 │
 * │ KHÔNG làm:                                                     │
 * │ - Quyết định render strategy                                   │
 * │ - Quản lý state                                                │
 * │ - Xử lý UI logic                                               │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * ===================================================================
 * TẠI SAO DÙNG matchMedia THAY VÌ window.innerWidth?
 * ===================================================================
 *
 * 1. SYNC VỚI TAILWIND CSS
 * -------------------------
 * matchMedia('(min-width: 1024px)') = Tailwind 'lg:'
 * Chính xác 100%, không bị lệch 1px.
 *
 * Nếu dùng window.innerWidth:
 * - Có thể bị off-by-one error
 * - Phải tính toán manual
 * - Có thể không khớp với CSS media queries
 *
 * 2. PERFORMANCE
 * ---------------
 * matchMedia chỉ fire event khi THỰC SỰ vượt qua breakpoint.
 *
 * Ví dụ: Breakpoint 1024px
 * - Viewport 1024px → 1023px: Fire 1 lần
 * - Viewport 1023px → 1024px: Fire 1 lần
 * - Viewport 1100px → 1200px: KHÔNG fire (vẫn trong cùng breakpoint)
 *
 * window.resize: Fire LIÊN TỤC khi kéo → cần debounce/throttle.
 * matchMedia: Tự optimize → không cần xử lý thêm.
 *
 * 3. NATIVE BROWSER API
 * ----------------------
 * - Được browser optimize
 * - Không cần thư viện bên ngoài
 * - Là cách tiêu chuẩn để detect media queries trong JS
 *
 * ===================================================================
 * SSR SAFETY
 * ===================================================================
 *
 * Vấn đề:
 * - Server không có window object
 * - Server không biết viewport size
 * - Nếu render khác client → hydration mismatch
 *
 * Giải pháp:
 * - Default state = false (giả sử mobile-first)
 * - Update state trong useEffect (chỉ chạy trên client)
 * - Render lần đầu = mobile → client update = desktop (nếu cần)
 *
 * Trade-off:
 * - Có thể có flash of mobile layout trên desktop
 * - Nhưng tránh được hydration error
 *
 * ===================================================================
 * CÁCH SỬ DỤNG
 * ===================================================================
 *
 * // Cách 1: Dùng convenience hooks
 * const isDesktop = useIsDesktop(); // true khi ≥ 1024px
 * const isMobile = useIsMobile();   // true khi < 768px
 * const isTablet = useIsTablet();   // true khi 768px - 1023px
 *
 * // Cách 2: Custom media query
 * const isWideScreen = useMediaQuery('(min-width: 1440px)');
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 */

import { useState, useEffect, useCallback } from 'react';

/*
 * ===================================================================
 * CORE HOOK: useMediaQuery
 * ===================================================================
 */

/**
 * Hook detect media query sử dụng matchMedia API
 *
 * @param query - CSS media query string
 * @returns boolean - true nếu query match, false nếu không
 *
 * @example
 * // Detect desktop viewport
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 *
 * @example
 * // Detect dark mode preference
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 *
 * @example
 * // Detect reduced motion preference
 * const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 */
export function useMediaQuery(query: string): boolean {
  /**
   * STATE: Kết quả match
   *
   * Mặc định false để:
   * 1. Tránh hydration mismatch (SSR luôn là false)
   * 2. Mobile-first approach (giả sử mobile trước)
   */
  const [matches, setMatches] = useState(false);

  /**
   * Handler khi media query thay đổi
   *
   * Sử dụng useCallback để stable reference.
   * Tránh tạo mới function mỗi render.
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
     *
     * Đây là native browser API, performance tốt nhất.
     * Không cần thư viện bên ngoài.
     */
    const mediaQuery = window.matchMedia(query);

    /**
     * Set giá trị ban đầu
     *
     * Gọi handleChange với mediaQuery để lấy giá trị hiện tại.
     * mediaQuery.matches = true/false dựa trên viewport hiện tại.
     */
    handleChange(mediaQuery);

    /**
     * Lắng nghe thay đổi
     *
     * Event 'change' chỉ fire khi VƯỢT QUA breakpoint.
     * Không fire liên tục như window.resize.
     *
     * Ví dụ với query '(min-width: 1024px)':
     * - 1023px → 1024px: Fire (false → true)
     * - 1024px → 1023px: Fire (true → false)
     * - 1100px → 1200px: KHÔNG fire (vẫn true)
     */
    mediaQuery.addEventListener('change', handleChange);

    /**
     * Cleanup
     *
     * Gỡ bỏ listener khi component unmount hoặc query thay đổi.
     * Tránh memory leak.
     */
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query, handleChange]);

  return matches;
}

/*
 * ===================================================================
 * TAILWIND BREAKPOINT CONSTANTS
 * ===================================================================
 *
 * Các media query strings đồng bộ với Tailwind CSS.
 *
 * Tailwind defaults:
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px (DESKTOP BREAKPOINT CHÍNH)
 * - xl: 1280px
 * - 2xl: 1536px
 *
 * QUAN TRỌNG:
 * Nếu thay đổi Tailwind config, phải update constants này.
 */
export const BREAKPOINTS = {
  /** ≥ 640px - Small devices (landscape phones) */
  SM: '(min-width: 640px)',

  /** ≥ 768px - Medium devices (tablets) */
  MD: '(min-width: 768px)',

  /** ≥ 1024px - Large devices (desktops) - BREAKPOINT CHÍNH */
  LG: '(min-width: 1024px)',

  /** ≥ 1280px - Extra large devices (large desktops) */
  XL: '(min-width: 1280px)',

  /** ≥ 1536px - 2X Extra large devices (larger desktops) */
  XXL: '(min-width: 1536px)',
} as const;

/*
 * ===================================================================
 * CONVENIENCE HOOKS
 * ===================================================================
 *
 * Pre-built hooks cho các use cases phổ biến.
 * Sử dụng BREAKPOINTS constants để đảm bảo sync với Tailwind.
 */

/**
 * Hook kiểm tra có phải Desktop không (≥ 1024px / lg)
 *
 * ĐÂY LÀ BREAKPOINT CHÍNH của ứng dụng:
 * - Desktop (≥ 1024px): Grid layout với sidebars là columns
 * - Tablet/Mobile (< 1024px): Drawer overlays
 *
 * @returns true nếu viewport ≥ 1024px
 *
 * @example
 * function MyComponent() {
 *   const isDesktop = useIsDesktop();
 *
 *   if (isDesktop) {
 *     return <GridLayout />;
 *   }
 *   return <DrawerLayout />;
 * }
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(BREAKPOINTS.LG);
}

/**
 * Hook kiểm tra có phải Tablet không (≥ 768px và < 1024px)
 *
 * Tablet = giữa Mobile và Desktop.
 * - Màn hình lớn hơn phone
 * - Nhưng vẫn dùng drawer layout
 *
 * @returns true nếu viewport từ 768px đến 1023px
 */
export function useIsTablet(): boolean {
  const isAboveMd = useMediaQuery(BREAKPOINTS.MD);
  const isAboveLg = useMediaQuery(BREAKPOINTS.LG);
  return isAboveMd && !isAboveLg;
}

/**
 * Hook kiểm tra có phải Mobile không (< 768px)
 *
 * Mobile = màn hình nhỏ nhất.
 * - Chủ yếu là phone portrait
 *
 * @returns true nếu viewport < 768px
 */
export function useIsMobile(): boolean {
  const isAboveMd = useMediaQuery(BREAKPOINTS.MD);
  return !isAboveMd;
}

/*
 * ===================================================================
 * DEFAULT EXPORT
 * ===================================================================
 */
export default useMediaQuery;
