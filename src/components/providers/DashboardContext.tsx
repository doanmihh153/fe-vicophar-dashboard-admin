'use client';

/**
 * ===================================================================
 * DASHBOARD CONTEXT - PANEL STATE MANAGER (Device-Agnostic)
 * ===================================================================
 *
 * Context này quản lý STATE cho các panels của Dashboard.
 * Đây là lớp PANEL STATE trong kiến trúc 3 lớp.
 *
 * ===================================================================
 * VAI TRÒ TRONG KIẾN TRÚC 3 LỚP
 * ===================================================================
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ LỚP 1: BREAKPOINT DETECTION (useBreakpoint.ts)                 │
 * │ - Chỉ trả về true/false: isDesktop, isMobile, isTablet         │
 * │ - KHÔNG quyết định gì về UI                                    │
 * └─────────────────────────────────────────────────────────────────┘
 *                              ↓
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ LỚP 2: PANEL STATE (DashboardContext.tsx) ← FILE NÀY           │
 * │ - Chỉ quản lý state: isLeftOpen, isRightOpen, etc.             │
 * │ - KHÔNG biết về device (mobile/desktop)                        │
 * │ - KHÔNG quyết định render strategy                             │
 * └─────────────────────────────────────────────────────────────────┘
 *                              ↓
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ LỚP 3: LAYOUT CONTROLLER (DashboardLayout.tsx)                 │
 * │ - KẾT HỢP breakpoint + state để quyết định render              │
 * │ - Desktop: Grid layout                                         │
 * │ - Mobile: Drawer layout                                        │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * ===================================================================
 * NGUYÊN TẮC QUAN TRỌNG
 * ===================================================================
 *
 * 1. STATE KHÔNG BIẾT VỀ DEVICE
 * ------------------------------
 * - isLeftOpen, isRightOpen là boolean đơn giản
 * - KHÔNG có logic if/else cho mobile/desktop
 * - KHÔNG check window.innerWidth
 *
 * Ví dụ:
 * ❌ SAI:
 * const toggleLeft = () => {
 *   if (window.innerWidth < 768) {
 *     // Logic cho mobile
 *   } else {
 *     // Logic cho desktop
 *   }
 * }
 *
 * ✅ ĐÚNG:
 * const toggleLeft = () => {
 *   setLeftOpen(prev => !prev); // Chỉ toggle boolean
 * }
 *
 * 2. CHỈ QUẢN LÝ STATE, KHÔNG QUYẾT ĐỊNH RENDER
 * -----------------------------------------------
 * - Context chỉ cho biết "panel có đang open không?"
 * - KHÔNG quyết định "render drawer hay grid?"
 * - Việc render là trách nhiệm của Layout Controller
 *
 * 3. DÙNG CHUNG CHO MỌI THIẾT BỊ
 * --------------------------------
 * - State được chia sẻ giữa grid column và drawer
 * - Toggle 1 lần, cả 2 mode đều phản ánh
 *
 * ===================================================================
 * SO SÁNH VỚI KIẾN TRÚC CŨ
 * ===================================================================
 *
 * CŨ (SAI):
 * ---------
 * - toggleLeftSidebar() check window.innerWidth
 * - Có 2 state riêng: isLeftSidebarCollapsed (desktop) + isLeftSidebarOpen (mobile)
 * - Logic rối rắm, khó maintain
 *
 * MỚI (ĐÚNG):
 * -----------
 * - toggleLeft() chỉ toggle boolean
 * - 1 state duy nhất: isLeftOpen (device-agnostic)
 * - Logic rõ ràng, dễ hiểu
 *
 * ===================================================================
 * CẤU TRÚC STATE
 * ===================================================================
 *
 * SIDEBAR TRÁI:
 * - isLeftOpen: boolean - Sidebar trái có đang mở không
 * - isLeftCollapsed: boolean - Sidebar trái có đang thu gọn (icon-only) không
 *
 * SIDEBAR PHẢI:
 * - isRightOpen: boolean - Sidebar phải có đang mở không
 * - rightPanelMode: 'notes' | 'tasks' | 'options' - Mode hiển thị
 *
 * SELECTED ITEM:
 * - selectedItem: unknown | null - Item đang được chọn trong Main Content
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

/*
 * ===================================================================
 * TYPES
 * ===================================================================
 */

/**
 * Các mode hiển thị của Sidebar phải
 *
 * - 'notes': Hiển thị panel ghi chú
 * - 'tasks': Hiển thị panel công việc
 * - 'options': Hiển thị tùy chọn cho item được chọn
 */
export type RightPanelMode = 'notes' | 'tasks' | 'options';

/**
 * Interface định nghĩa context value
 *
 * LƯU Ý: Tất cả state đều device-agnostic.
 * Không có logic if/else mobile/desktop trong các functions.
 */
interface DashboardContextType {
  /*
   * ===============================================================
   * SIDEBAR TRÁI (NEW API)
   * ===============================================================
   */

  /**
   * Sidebar trái có đang mở không
   *
   * Giá trị này được dùng chung cho:
   * - Desktop: Điều khiển grid column visibility
   * - Mobile: Điều khiển drawer visibility
   *
   * true: Hiển thị (dù là grid column hay drawer)
   * false: Ẩn (dù là grid column hay drawer)
   */
  isLeftOpen: boolean;

  /**
   * Toggle trạng thái open/close của sidebar trái
   *
   * Device-agnostic: không biết đang ở mobile hay desktop.
   * Chỉ đơn giản toggle boolean.
   */
  toggleLeft: () => void;

  /**
   * Set trạng thái open cụ thể
   *
   * Dùng khi cần set giá trị cụ thể (không phải toggle).
   * Ví dụ: Auto-sync khi resize browser.
   */
  setLeftOpen: (open: boolean) => void;

  /**
   * Sidebar trái có đang thu gọn (chỉ hiện icon) không
   *
   * CHỈ áp dụng khi sidebar đang mở trên desktop.
   * Trên mobile, không có collapsed mode (drawer luôn full width).
   *
   * true: Chỉ hiện icon (icon rail - 64px)
   * false: Hiện đầy đủ (260px)
   */
  isLeftCollapsed: boolean;

  /**
   * Toggle trạng thái collapsed
   */
  toggleLeftCollapse: () => void;

  /**
   * Set trạng thái collapsed cụ thể
   */
  setLeftCollapsed: (collapsed: boolean) => void;

  /*
   * ===============================================================
   * SIDEBAR PHẢI (NEW API)
   * ===============================================================
   */

  /**
   * Sidebar phải có đang mở không
   *
   * Desktop: Điều khiển grid column width (320px ↔ 0px)
   * Mobile: Điều khiển drawer visibility
   */
  isRightOpen: boolean;

  /**
   * Toggle trạng thái open/close của sidebar phải
   */
  toggleRight: () => void;

  /**
   * Set trạng thái open cụ thể
   */
  setRightOpen: (open: boolean) => void;

  /**
   * Mode hiện tại của sidebar phải
   *
   * - 'notes': Panel ghi chú
   * - 'tasks': Panel công việc
   * - 'options': Panel tùy chọn (cho selected item)
   */
  rightPanelMode: RightPanelMode;

  /**
   * Set mode cho sidebar phải
   */
  setRightPanelMode: (mode: RightPanelMode) => void;

  /*
   * ===============================================================
   * SELECTED ITEM
   * ===============================================================
   */

  /**
   * Item hiện đang được chọn (từ Main Content)
   *
   * Sử dụng để sidebar phải hiển thị thông tin/options tương ứng.
   * Ví dụ: Click vào một product → Right sidebar hiện product details.
   */
  selectedItem: unknown | null;

  /**
   * Set item được chọn
   */
  setSelectedItem: (item: unknown | null) => void;

  /**
   * Clear item được chọn
   */
  clearSelection: () => void;

  /*
   * ===============================================================
   * BACKWARD COMPATIBILITY
   * ===============================================================
   *
   * Các aliases để tương thích với code cũ.
   * TODO: Dần dần migrate và xóa những aliases này.
   *
   * Mapping:
   * - isLeftSidebarCollapsed → isLeftCollapsed
   * - toggleLeftSidebar → toggleLeft
   * - isLeftSidebarOpen → isLeftOpen
   * - isRightPanelOpen → isRightOpen
   * - toggleRightPanel → toggleRight
   */
  isLeftSidebarCollapsed: boolean;
  toggleLeftSidebar: () => void;
  setLeftSidebarCollapsed: (collapsed: boolean) => void;
  isLeftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  isRightPanelOpen: boolean;
  toggleRightPanel: () => void;
}

/*
 * ===================================================================
 * CONTEXT
 * ===================================================================
 */

/**
 * Context object
 *
 * undefined = chưa có Provider
 * Được check trong useDashboard hook
 */
const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

/*
 * ===================================================================
 * PROVIDER
 * ===================================================================
 */

/**
 * Props cho DashboardProvider
 */
interface DashboardProviderProps {
  children: ReactNode;

  /**
   * Sidebar trái mặc định mở hay đóng
   * @default true (mở)
   */
  defaultLeftOpen?: boolean;

  /**
   * Sidebar trái mặc định thu gọn hay mở rộng
   * @default false (mở rộng)
   */
  defaultLeftCollapsed?: boolean;

  /**
   * Sidebar phải mặc định mở hay đóng
   * @default true (mở)
   */
  defaultRightOpen?: boolean;

  /**
   * Mode mặc định của sidebar phải
   * @default 'notes'
   */
  defaultRightPanelMode?: RightPanelMode;
}

export function DashboardProvider({
  children,
  defaultLeftOpen = true,
  defaultLeftCollapsed = false,
  defaultRightOpen = true,
  defaultRightPanelMode = 'notes',
}: DashboardProviderProps) {
  /*
   * =================================================================
   * STATE DECLARATIONS
   * =================================================================
   *
   * Tất cả state đều device-agnostic.
   * KHÔNG có logic liên quan đến mobile/desktop.
   */

  /**
   * Sidebar trái: open/close
   * Device-agnostic - áp dụng cho cả grid và drawer
   */
  const [isLeftOpen, setLeftOpen] = useState(defaultLeftOpen);

  /**
   * Sidebar trái: collapsed (icon-only) khi đang open
   * CHỈ có ý nghĩa khi isLeftOpen = true trên desktop
   */
  const [isLeftCollapsed, setLeftCollapsed] = useState(defaultLeftCollapsed);

  /**
   * Sidebar phải: open/close
   * Device-agnostic - áp dụng cho cả grid và drawer
   */
  const [isRightOpen, setRightOpen] = useState(defaultRightOpen);

  /**
   * Sidebar phải: mode hiển thị
   */
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>(
    defaultRightPanelMode
  );

  /**
   * Selected item từ Main Content
   */
  const [selectedItem, setSelectedItem] = useState<unknown | null>(null);

  /*
   * =================================================================
   * CALLBACK FUNCTIONS
   * =================================================================
   *
   * Tất cả callbacks đều đơn giản: toggle boolean hoặc set value.
   * KHÔNG có logic if/else phức tạp.
   * KHÔNG check device type.
   */

  /**
   * Toggle sidebar trái open/close
   *
   * KHÔNG check device - chỉ toggle boolean đơn giản.
   * Layout Controller sẽ quyết định render grid hay drawer.
   */
  const toggleLeft = useCallback(() => {
    setLeftOpen((prev) => !prev);
  }, []);

  /**
   * Toggle sidebar trái collapsed/expanded
   *
   * Chỉ có ý nghĩa trên desktop với grid layout.
   * Trên mobile, không có collapsed mode.
   */
  const toggleLeftCollapse = useCallback(() => {
    setLeftCollapsed((prev) => !prev);
  }, []);

  /**
   * Toggle sidebar phải open/close
   */
  const toggleRight = useCallback(() => {
    setRightOpen((prev) => !prev);
  }, []);

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    setSelectedItem(null);
  }, []);

  /*
   * =================================================================
   * CONTEXT VALUE
   * =================================================================
   */

  const value: DashboardContextType = {
    // Sidebar trái (new API)
    isLeftOpen,
    toggleLeft,
    setLeftOpen,
    isLeftCollapsed,
    toggleLeftCollapse,
    setLeftCollapsed,

    // Sidebar phải (new API)
    isRightOpen,
    toggleRight,
    setRightOpen,
    rightPanelMode,
    setRightPanelMode,

    // Selected item
    selectedItem,
    setSelectedItem,
    clearSelection,

    /*
     * Backward compatibility aliases
     * Mapping API cũ → API mới
     */
    isLeftSidebarCollapsed: isLeftCollapsed,
    toggleLeftSidebar: toggleLeft,
    setLeftSidebarCollapsed: setLeftCollapsed,
    isLeftSidebarOpen: isLeftOpen,
    setLeftSidebarOpen: setLeftOpen,
    isRightPanelOpen: isRightOpen,
    toggleRightPanel: toggleRight,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

/*
 * ===================================================================
 * HOOK
 * ===================================================================
 */

/**
 * Hook để truy cập Dashboard context
 *
 * @throws Error nếu sử dụng ngoài DashboardProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   // Lấy state và callbacks từ context
 *   const { isLeftOpen, toggleLeft, isRightOpen, toggleRight } = useDashboard();
 *
 *   return (
 *     <div>
 *       <button onClick={toggleLeft}>Toggle Left</button>
 *       <button onClick={toggleRight}>Toggle Right</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDashboard(): DashboardContextType {
  const context = useContext(DashboardContext);

  if (context === undefined) {
    throw new Error(
      'useDashboard phải được sử dụng bên trong DashboardProvider. ' +
        'Hãy đảm bảo component của bạn nằm trong cây component có DashboardProvider.'
    );
  }

  return context;
}

/*
 * ===================================================================
 * EXPORT
 * ===================================================================
 */
export { DashboardContext };
