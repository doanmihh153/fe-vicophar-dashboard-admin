'use client';

/**
 * ===================================================================
 * DASHBOARD CONTEXT
 * ===================================================================
 *
 * Context này quản lý state chung cho toàn bộ Dashboard layout:
 * - Trạng thái collapse/expand của sidebar trái
 * - Trạng thái hiển thị và mode của sidebar phải
 * - Selected item để tương tác giữa Main Content và Sidebar phải
 *
 * Sử dụng:
 * - Wrap layout với <DashboardProvider>
 * - Trong component con, dùng hook useDashboard() để truy cập state
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
 * - null: Ẩn sidebar phải
 */
export type RightPanelMode = 'notes' | 'tasks' | 'options' | null;

/**
 * Interface định nghĩa context value
 */
interface DashboardContextType {
  /* ===== SIDEBAR TRÁI ===== */
  /** Trạng thái sidebar trái có đang thu gọn không */
  isLeftSidebarCollapsed: boolean;
  /** Toggle trạng thái collapse của sidebar trái */
  toggleLeftSidebar: () => void;
  /** Set trạng thái collapse cụ thể */
  setLeftSidebarCollapsed: (collapsed: boolean) => void;

  /* ===== SIDEBAR PHẢI ===== */
  /** Mode hiện tại của sidebar phải */
  rightPanelMode: RightPanelMode;
  /** Set mode cho sidebar phải */
  setRightPanelMode: (mode: RightPanelMode) => void;
  /** Kiểm tra sidebar phải có đang mở không */
  isRightPanelOpen: boolean;
  /** Toggle sidebar phải (mở/đóng) */
  toggleRightPanel: () => void;

  /* ===== SELECTED ITEM ===== */
  /**
   * Item hiện đang được chọn (từ Main Content)
   * Sử dụng để sidebar phải hiển thị thông tin/options tương ứng
   */
  selectedItem: unknown | null;
  /** Set item được chọn */
  setSelectedItem: (item: unknown | null) => void;
  /** Clear item được chọn và đóng options panel */
  clearSelection: () => void;
}

/* ===== CONTEXT ===== */

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

/* ===== PROVIDER ===== */

interface DashboardProviderProps {
  children: ReactNode;
  /**
   * Trạng thái collapse mặc định của sidebar trái
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * Mode mặc định của sidebar phải
   * @default null (ẩn)
   */
  defaultRightPanelMode?: RightPanelMode;
}

export function DashboardProvider({
  children,
  defaultCollapsed = false,
  defaultRightPanelMode = null,
}: DashboardProviderProps) {
  /* ----- State cho Sidebar trái ----- */
  const [isLeftSidebarCollapsed, setLeftSidebarCollapsed] =
    useState(defaultCollapsed);

  /* ----- State cho Sidebar phải ----- */
  const [rightPanelMode, setRightPanelMode] = useState<RightPanelMode>(
    defaultRightPanelMode
  );

  /* ----- State cho Selected Item ----- */
  const [selectedItem, setSelectedItem] = useState<unknown | null>(null);

  /* ===== CALLBACKS ===== */

  /** Toggle sidebar trái */
  const toggleLeftSidebar = useCallback(() => {
    setLeftSidebarCollapsed((prev) => !prev);
  }, []);

  /** Tính toán sidebar phải có đang mở không */
  const isRightPanelOpen = rightPanelMode !== null;

  /** Toggle sidebar phải (mở notes nếu đang đóng, đóng nếu đang mở) */
  const toggleRightPanel = useCallback(() => {
    setRightPanelMode((prev) => (prev === null ? 'notes' : null));
  }, []);

  /** Clear selection và đóng options panel */
  const clearSelection = useCallback(() => {
    setSelectedItem(null);
    // Nếu đang ở mode options, chuyển về null hoặc mode trước đó
    setRightPanelMode((prev) => (prev === 'options' ? null : prev));
  }, []);

  /* ===== VALUE ===== */

  const value: DashboardContextType = {
    // Sidebar trái
    isLeftSidebarCollapsed,
    toggleLeftSidebar,
    setLeftSidebarCollapsed,
    // Sidebar phải
    rightPanelMode,
    setRightPanelMode,
    isRightPanelOpen,
    toggleRightPanel,
    // Selected item
    selectedItem,
    setSelectedItem,
    clearSelection,
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
 *   const { isLeftSidebarCollapsed, toggleLeftSidebar } = useDashboard();
 *   return <button onClick={toggleLeftSidebar}>Toggle</button>;
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
