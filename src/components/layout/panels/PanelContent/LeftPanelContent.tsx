'use client';

/**
 * ===================================================================
 * LEFT PANEL CONTENT - NỘI DUNG SIDEBAR TRÁI
 * ===================================================================
 *
 * Component này chứa NỘI DUNG của sidebar trái.
 * Được thiết kế để tái sử dụng cho cả:
 * - Desktop: Render trong grid column
 * - Mobile/Tablet: Render trong DrawerPanel
 *
 * ===================================================================
 * VAI TRÒ TRONG KIẾN TRÚC
 * ===================================================================
 *
 * Đây là "dumb component" - chỉ render UI dựa trên props.
 * KHÔNG chứa:
 * - Logic breakpoint (useIsDesktop, matchMedia)
 * - Logic toggle state (useDashboard)
 * - Quyết định render strategy (grid vs drawer)
 *
 * TẤT CẢ những thứ trên là trách nhiệm của DashboardLayout.
 *
 * ===================================================================
 * NGUYÊN TẮC COLLAPSE (CỰC KỲ QUAN TRỌNG)
 * ===================================================================
 *
 * COLLAPSE ≠ REMOVE
 * COLLAPSE = GIỮ NODE + ĐỔI CÁCH HIỂN THỊ
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Cấu trúc 2 lớp cho mỗi NavItem:                                │
 * │                                                                 │
 * │ NavItem (LUÔN render)                                          │
 * │  ├─ Icon (LUÔN hiển thị, flex-shrink-0)                        │
 * │  └─ Text (opacity-0 + w-0 khi collapse)                        │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * ❌ SAI (những cách làm gây vỡ layout):
 * ----------------------------------------
 * {!isCollapsed && <span>Text</span>}
 * → Unmount DOM khi collapse
 * → Browser phải reflow
 * → Grid structure thay đổi đột ngột
 *
 * <span className="hidden">Text</span>
 * → display: none
 * → Element không chiếm không gian
 * → Layout shift
 *
 * <span className="w-0">Text</span> (cho cả wrapper)
 * → Mất click area
 * → User không click được để expand
 *
 * ✅ ĐÚNG (cách làm đúng):
 * -------------------------
 * <span className={isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}>
 * → DOM vẫn tồn tại
 * → Chỉ thay đổi visual (opacity + width)
 * → overflow-hidden để text không tràn
 * → transition để animation mượt
 * → Grid structure KHÔNG bị ảnh hưởng
 *
 * VÌ SAO PHẢI LÀM THẾ NÀY?
 * -------------------------
 * Khi collapse bằng conditional render:
 * - DOM structure thay đổi
 * - Browser phải tính lại layout
 * - Grid columns có thể bị reflow
 * - Animation không mượt
 *
 * Khi collapse bằng opacity/width:
 * - DOM structure giữ nguyên
 * - Chỉ thay đổi visual properties
 * - GPU có thể accelerate animation
 * - Grid hoàn toàn ổn định
 *
 * ===================================================================
 * BUTTON TOGGLE COLLAPSE
 * ===================================================================
 *
 * Button toggle collapse được đặt TRONG component này.
 *
 * TẠI SAO CÓ THỂ ĐẶT TRONG?
 * --------------------------
 * Vì SidebarLeft trên Desktop KHÔNG BAO GIỜ bị unmount.
 * - Desktop: SidebarLeft luôn render trong grid column
 * - Collapse = đổi width (260px → 64px), KHÔNG unmount
 * - Button vẫn tồn tại và có thể click
 *
 * SO SÁNH VỚI SIDEBARRIGHT:
 * --------------------------
 * SidebarRight trên Desktop CÓ THỂ bị unmount (width = 0px).
 * Nếu button trong SidebarRight:
 * - Khi close → SidebarRight unmount → button mất
 * - User không thể mở lại
 * → Button toggle SidebarRight phải nằm trong Header
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/*
 * ===================================================================
 * ICON IMPORTS
 * ===================================================================
 * Các icon cho navigation menu.
 * Sử dụng lucide-react để đồng bộ style với toàn bộ app.
 */
import {
  LayoutDashboard, // Dashboard icon
  ClipboardList, // Tasks icon
  Calendar, // Calendar icon
  BarChart3, // Analytics icon
  Users, // Team icon
  Settings, // Settings icon
  HelpCircle, // Help icon
  LogOut, // Logout icon
} from 'lucide-react';

/*
 * ===================================================================
 * TYPES
 * ===================================================================
 */

/**
 * Props cho LeftPanelContent
 *
 * @property showHeader - Có hiển thị header (logo + toggle) không
 *                        true: Render trong grid (có space cho header)
 *                        false: Render trong drawer (drawer có header riêng)
 *
 * @property isCollapsed - Có đang ở trạng thái thu gọn không
 *                         true: Chỉ hiện icon, text ẩn bằng opacity
 *                         false: Hiện đầy đủ icon + text
 *
 * @property onToggleCollapse - Callback khi user click toggle button
 *                              Chỉ truyền khi render trong grid mode
 *                              Drawer mode không cần (không có collapse)
 */
interface LeftPanelContentProps {
  showHeader?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

/*
 * ===================================================================
 * SUB-COMPONENTS
 * ===================================================================
 */

/**
 * ---------------------------------------------------------------
 * NavItem - Một item trong navigation menu
 * ---------------------------------------------------------------
 *
 * Implement cấu trúc 2 lớp cho collapse:
 * - Icon: Luôn hiển thị
 * - Text: Ẩn bằng opacity + width khi collapsed
 *
 * @property icon - Icon component từ lucide-react
 * @property label - Text label của menu item
 * @property badge - Badge hiển thị số (ví dụ: "12+")
 * @property isActive - Item có đang active không
 * @property isCollapsed - Đang ở trạng thái collapsed không
 * @property href - Link URL
 */
interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  href?: string;
}

function NavItem({
  icon: Icon,
  label,
  badge,
  isActive = false,
  isCollapsed = false,
  href = '#',
}: NavItemProps) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      } `}
      /*
       * MIN-WIDTH để giữ click area khi collapsed.
       *
       * Nếu không có min-width:
       * - Khi collapsed, width có thể co lại quá nhỏ
       * - User khó click vào icon
       * - UX kém
       *
       * min-width: 40px đảm bảo:
       * - Icon (20px) có padding đủ
       * - Vẫn có thể click
       * - Không làm vỡ layout khi expanded
       */
      style={{ minWidth: isCollapsed ? '40px' : undefined }}
    >
      {/*
       * =========================================================
       * ICON: LUÔN HIỂN THỊ
       * =========================================================
       *
       * Icon không bao giờ bị ẩn khi collapsed.
       * - h-5 w-5: Kích thước cố định 20x20
       * - shrink-0: Không co lại khi parent bị thu hẹp
       */}
      <Icon className="h-5 w-5 shrink-0" />

      {/*
       * =========================================================
       * TEXT: ẨN BẰNG OPACITY + WIDTH
       * =========================================================
       *
       * ❌ KHÔNG dùng: {!isCollapsed && <span>{label}</span>}
       * VÌ: Conditional render sẽ unmount DOM, gây reflow
       *
       * ✅ DÙNG: opacity-0 + w-0 + overflow-hidden
       * VÌ: Giữ DOM nguyên vẹn, chỉ đổi visual properties
       *
       * Classes khi COLLAPSED:
       * - w-0: Width = 0, text không chiếm không gian
       * - overflow-hidden: Cắt text không cho tràn
       * - opacity-0: Làm trong suốt hoàn toàn
       *
       * Classes khi EXPANDED:
       * - w-auto: Width tự động theo content
       * - opacity-100: Hiển thị bình thường
       *
       * Các class chung:
       * - flex-1: Chiếm phần còn lại
       * - truncate: Cắt text dài bằng "..."
       * - whitespace-nowrap: Không xuống dòng
       * - transition-all duration-200: Animation mượt
       */}
      <span
        className={`flex-1 truncate whitespace-nowrap transition-all duration-200 ${
          isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'
        } `}
      >
        {label}
      </span>

      {/*
       * =========================================================
       * BADGE: ẨN BẰNG OPACITY + SCALE
       * =========================================================
       *
       * Badge (như "12+") cũng ẩn khi collapsed.
       * Dùng scale-0 để animation co lại đẹp hơn.
       */}
      {badge && (
        <span
          className={`bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs font-medium transition-all duration-200 ${
            isCollapsed ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          } `}
        >
          {badge}
        </span>
      )}
    </a>
  );
}

/**
 * ---------------------------------------------------------------
 * NavSection - Một section chứa nhiều NavItem
 * ---------------------------------------------------------------
 *
 * Ví dụ: Section "MENU" chứa Dashboard, Tasks, Calendar, etc.
 *
 * Title của section cũng ẩn bằng opacity khi collapsed.
 */
function NavSection({
  title,
  isCollapsed,
  children,
}: {
  title: string;
  isCollapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="py-2">
      {/*
       * SECTION TITLE: ẩn bằng opacity + height
       *
       * Không dùng hidden vì sẽ gây layout shift.
       * h-0 + overflow-hidden ẩn mà vẫn giữ DOM.
       */}
      <div
        className={`text-muted-foreground mb-2 px-3 text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
          isCollapsed ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'
        } `}
      >
        {title}
      </div>

      {/* Container cho các NavItem */}
      <div className="space-y-1">{children}</div>
    </div>
  );
}

/*
 * ===================================================================
 * MAIN COMPONENT
 * ===================================================================
 */

export function LeftPanelContent({
  showHeader = true,
  isCollapsed = false,
  onToggleCollapse,
}: LeftPanelContentProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/*
       * =========================================================
       * HEADER: Logo + Toggle Button
       * =========================================================
       *
       * Chỉ hiển thị khi showHeader = true.
       * - true: Render trong grid mode (có space)
       * - false: Render trong drawer (drawer có header riêng)
       *
       * Cấu trúc:
       * ┌──────────────────────────────────┐
       * │ [Logo]              [Toggle Btn] │
       * └──────────────────────────────────┘
       */}
      {showHeader && (
        <div className="border-border flex min-h-[56px] items-center justify-between border-b p-3">
          {/*
           * LOGO: Ẩn bằng opacity khi collapsed
           *
           * Không unmount vì:
           * - Giữ layout ổn định
           * - Toggle button không bị nhảy vị trí
           */}
          <span
            className={`font-display text-lg font-bold transition-all duration-200 ${
              isCollapsed
                ? 'w-0 overflow-hidden opacity-0'
                : 'w-auto opacity-100'
            } `}
          >
            Vicophar
          </span>

          {/*
           * TOGGLE BUTTON: Luôn hiển thị
           *
           * Button này có thể nằm TRONG SidebarLeft vì:
           * - SidebarLeft trên Desktop KHÔNG BAO GIỜ bị unmount
           * - Collapse = đổi width, không unmount
           * - Button vẫn tồn tại và clickable
           *
           * Icon thay đổi theo state:
           * - Collapsed: ChevronRight (→) - click để expand
           * - Expanded: ChevronLeft (←) - click để collapse
           *
           * aria-label cho accessibility.
           */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="text-muted-foreground hover:bg-accent hover:text-foreground shrink-0 rounded-lg p-2 transition-colors"
              aria-label={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      )}

      {/*
       * =========================================================
       * NAVIGATION CONTENT
       * =========================================================
       *
       * Chứa các NavSection và NavItem.
       * Scrollable nếu content dài hơn viewport.
       *
       * overflow-x-hidden: Chặn horizontal scroll (quan trọng cho collapse)
       * overflow-y-auto: Enable vertical scroll
       */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto px-2 py-2">
        {/* Section: MENU */}
        <NavSection title="Menu" isCollapsed={isCollapsed}>
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            isActive
            isCollapsed={isCollapsed}
          />
          <NavItem
            icon={ClipboardList}
            label="Tasks"
            badge="12+"
            isCollapsed={isCollapsed}
          />
          <NavItem icon={Calendar} label="Calendar" isCollapsed={isCollapsed} />
          <NavItem
            icon={BarChart3}
            label="Analytics"
            isCollapsed={isCollapsed}
          />
          <NavItem icon={Users} label="Team" isCollapsed={isCollapsed} />
        </NavSection>

        {/* Section: GENERAL */}
        <NavSection title="General" isCollapsed={isCollapsed}>
          <NavItem icon={Settings} label="Settings" isCollapsed={isCollapsed} />
          <NavItem icon={HelpCircle} label="Help" isCollapsed={isCollapsed} />
          <NavItem icon={LogOut} label="Logout" isCollapsed={isCollapsed} />
        </NavSection>
      </div>

      {/*
       * =========================================================
       * PROMO CARD: Ẩn hoàn toàn khi collapsed
       * =========================================================
       *
       * Card quảng cáo download mobile app.
       * Ẩn khi collapsed vì không có đủ space.
       *
       * Cách ẩn:
       * - h-0: Height = 0
       * - opacity-0: Trong suốt
       * - scale-95: Thu nhỏ một chút (animation đẹp hơn)
       * - overflow-hidden: Cắt content
       * - p-0: Bỏ padding để không chiếm space
       */}
      <div
        className={`mt-auto p-3 transition-all duration-200 ${
          isCollapsed
            ? 'h-0 scale-95 overflow-hidden p-0 opacity-0'
            : 'h-auto scale-100 opacity-100'
        } `}
      >
        <div className="from-primary/20 to-primary/5 rounded-xl bg-gradient-to-br p-4">
          <div className="mb-2 text-sm font-medium">
            Download our Mobile App
          </div>
          <div className="text-muted-foreground mb-3 text-xs">
            Get easy in another way
          </div>
          <button className="bg-primary text-primary-foreground w-full rounded-lg py-2 text-sm font-medium transition-opacity hover:opacity-90">
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

/*
 * ===================================================================
 * EXPORT
 * ===================================================================
 */
export default LeftPanelContent;
