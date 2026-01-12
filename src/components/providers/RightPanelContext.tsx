/**
 * ============================================
 * RIGHT PANEL CONTEXT - SLOT SYSTEM
 * ============================================
 *
 * Context cho phép mỗi page tự define nội dung sidebar phải.
 *
 * ============================================
 * CÁCH SỬ DỤNG
 * ============================================
 *
 * BƯỚC 1: Trong page.tsx, import RightPanelSlot
 *
 *   import { RightPanelSlot } from '@/components/providers/RightPanelContext';
 *
 * BƯỚC 2: Wrap nội dung sidebar trong RightPanelSlot
 *
 *   export default function ProductsPage() {
 *     return (
 *       <Fragment>
 *         <div>Nội dung chính</div>
 *         <RightPanelSlot>
 *           <div>Nội dung sidebar</div>
 *         </RightPanelSlot>
 *       </Fragment>
 *     );
 *   }
 *
 * ============================================
 * CÁCH HOẠT ĐỘNG
 * ============================================
 *
 * 1. layout.tsx wrap RightPanelProvider quanh DashboardLayout
 * 2. Page render RightPanelSlot với children
 * 3. RightPanelSlot LƯU content vào Context (không render gì)
 * 4. DashboardLayout ĐỌC từ Context và render trong sidebar phải
 *
 * Kết quả: Mỗi page có sidebar phải riêng biệt!
 */

'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

// ============================================
// TYPES
// ============================================
interface RightPanelContextType {
  /** Nội dung hiện tại của right panel */
  content: ReactNode | null;
  /** Set nội dung */
  setContent: (content: ReactNode | null) => void;
}

// ============================================
// CONTEXT
// ============================================
const RightPanelContext = createContext<RightPanelContextType | undefined>(
  undefined
);

// ============================================
// PROVIDER (Đặt trong layout.tsx)
// ============================================
interface RightPanelProviderProps {
  children: ReactNode;
}

export function RightPanelProvider({ children }: RightPanelProviderProps) {
  const [content, setContent] = useState<ReactNode | null>(null);

  return (
    <RightPanelContext.Provider value={{ content, setContent }}>
      {children}
    </RightPanelContext.Provider>
  );
}

// ============================================
// HOOK (Dùng trong DashboardLayout)
// ============================================
export function useRightPanelContent(): ReactNode | null {
  const context = useContext(RightPanelContext);
  if (!context) {
    return null; // Graceful fallback nếu không có Provider
  }
  return context.content;
}

// ============================================
// SLOT COMPONENT (Dùng trong page.tsx)
// ============================================
interface RightPanelSlotProps {
  children: ReactNode;
}

/**
 * Component để page "slot" nội dung vào right sidebar.
 * Không render gì - chỉ lưu content vào context.
 */
export function RightPanelSlot({ children }: RightPanelSlotProps) {
  const context = useContext(RightPanelContext);

  useEffect(() => {
    if (context) {
      context.setContent(children);
    }
    // Cleanup khi unmount
    return () => {
      if (context) {
        context.setContent(null);
      }
    };
  }, [children, context]);

  return null; // Không render gì - chỉ slot vào context
}

// ============================================
// EXPORTS
// ============================================
export { RightPanelContext };
