'use client';

/**
 * ===================================================================
 * DASHBOARD CONTEXT - PANEL STATE (Device-Agnostic)
 * ===================================================================
 *
 * Context này quản lý STATE cho các panels của Dashboard.
 * Đây là lớp PANEL STATE trong kiến trúc 3 lớp.
 *
 * ===================================================================
 * NGUYÊN TẮC QUAN TRỌNG
 * ===================================================================
 * 1. STATE KHÔNG BIẾT VỀ DEVICE
 *    - isLeftOpen, isRightOpen là boolean đơn giản
 *    - KHÔNG có logic if/else cho mobile/desktop
 *    - KHÔNG check window.innerWidth
 *
 * 2. CHỈ QUẢN LÝ STATE, KHÔNG QUYẾT ĐỊNH RENDER
 *    - Context chỉ cho biết "panel có đang open không?"
 *    - KHÔNG quyết định "render drawer hay grid?"
 *    - Việc render là trách nhiệm của Layout Controller
 *
 * 3. DÙNG CHUNG CHO MỌI THIẾT BỊ
 *    - State được chia sẻ giữa grid column và drawer
 *    - Toggle 1 lần, cả 2 mode đều phản ánh
 *
 * ===================================================================
 * SO SÁNH VỚI KIẾN TRÚC CŨ
 * ===================================================================
 * CŨ (SAI):
 * - toggleLeftSidebar() check window.innerWidth
 * - Có 2 state riêng: isLeftSidebarCollapsed (desktop) + isLeftSidebarOpen (mobile)
 *
 * MỚI (ĐÚNG):
 * - toggleLeft() chỉ toggle boolean
 * - 1 state duy nhất: isLeftOpen (device-agnostic)
 *
 * ===================================================================
 * CẤU TRÚC STATE
 * ===================================================================
 * - isLeftOpen: boolean - Sidebar trái có đang mở không
 * - isRightOpen: boolean - Sidebar phải có đang mở không
 * - leftCollapsed: boolean - Sidebar trái có đang thu gọn (icon-only) không
 * - rightPanelMode: 'notes' | 'tasks' | 'options' - Mode hiển thị của right panel
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

/* ===== TYPES ===== */

/**
 * Các mode hiển thị của Sidebar phải
 * - 'notes': Hiển thị panel ghi chú
 * - 'tasks': Hiển thị panel công việc
 * - 'options': Hiển thị tùy chọn cho item được chọn
 */
export type RightPanelMode = 'notes' | 'tasks' | 'options';

/**
 * Interface định nghĩa context value
 * LƯU Ý: Tất cả state đều device-agnostic
 */
interface DashboardContextType {
  /* ===== SIDEBAR TRÁI ===== */
  /**
   * Sidebar trái có đang mở không
   * - true: Hiển thị (dù là grid column hay drawer)
   * - false: Ẩn (dù là grid column hay drawer)
   */
  isLeftOpen: boolean;

  /**
   * Toggle trạng thái open/close của sidebar trái
   * Device-agnostic - không biết đang ở mobile hay desktop
   */
  toggleLeft: () => void;

  /**
   * Set trạng thái open cụ thể
   */
  setLeftOpen: (open: boolean) => void;

  /**
   * Sidebar trái có đang thu gọn (chỉ hiện icon) không
   * CHỈ áp dụng khi sidebar đang mở trên desktop
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

  /* ===== SIDEBAR PHẢI ===== */
  /**
   * Sidebar phải có đang mở không
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
   */
  rightPanelMode: RightPanelMode;

  /**
   * Set mode cho sidebar phải
   */
  setRightPanelMode: (mode: RightPanelMode) => void;

  /* ===== SELECTED ITEM ===== */
  /**
   * Item hiện đang được chọn (từ Main Content)
   * Sử dụng để sidebar phải hiển thị thông tin/options tương ứng
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

  /* ===== BACKWARD COMPATIBILITY ===== */
  /**
   * Các aliases để tương thích với code cũ
   * TODO: Dần dần migrate và xóa
   */
  isLeftSidebarCollapsed: boolean;
  toggleLeftSidebar: () => void;
  setLeftSidebarCollapsed: (collapsed: boolean) => void;
  isLeftSidebarOpen: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  isRightPanelOpen: boolean;
  toggleRightPanel: () => void;
}

/* ===== CONTEXT ===== */

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

/* ===== PROVIDER ===== */

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
  /* ===== STATE ===== */

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

  /* ===== CALLBACKS ===== */

  /**
   * Toggle sidebar trái open/close
   * KHÔNG check device - chỉ toggle boolean đơn giản
   */
  const toggleLeft = useCallback(() => {
    setLeftOpen((prev) => !prev);
  }, []);

  /**
   * Toggle sidebar trái collapsed/expanded
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

  /* ===== VALUE ===== */

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

    // Backward compatibility aliases
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

/* ===== HOOK ===== */

/**
 * Hook để truy cập Dashboard context
 * @throws Error nếu sử dụng ngoài DashboardProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isLeftOpen, toggleLeft } = useDashboard();
 *   return <button onClick={toggleLeft}>Toggle</button>;
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

/* ===== EXPORT ===== */
export { DashboardContext };
