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
 * REFACTORING NOTE
 * ===================================================================
 *
 * Component này đã được tách nhỏ thành các sub-components:
 * - NavItem: Item trong menu
 * - NavSection: Group các items
 * - LeftPanelHeader: Logo + Toggle button
 * - PromoCard: Quảng cáo download app
 *
 * Tất cả được import từ ./LeftPanel
 */

import { usePathname } from 'next/navigation';
import { NAV_SECTIONS } from '@/config/navigation';

/*
 * ===================================================================
 * SUB-COMPONENTS IMPORTS
 * ===================================================================
 */
import { NavItem, NavSection, LeftPanelHeader } from './LeftPanel';

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
 * MAIN COMPONENT
 * ===================================================================
 */

export function LeftPanelContent({
  showHeader = true,
  isCollapsed = false,
  onToggleCollapse,
}: LeftPanelContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/*
       * =========================================================
       * HEADER: Logo + Toggle Button
       * =========================================================
       */}
      <LeftPanelHeader
        showHeader={showHeader}
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
      />

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
        {NAV_SECTIONS.map((section) => (
          <NavSection
            key={section.title}
            title={section.title}
            isCollapsed={isCollapsed}
          >
            {section.items.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.title}
                href={item.href}
                badge={item.badge}
                isActive={
                  item.href === '/'
                    ? pathname === '/'
                    : pathname?.startsWith(item.href)
                }
                isCollapsed={isCollapsed}
              />
            ))}
          </NavSection>
        ))}
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
