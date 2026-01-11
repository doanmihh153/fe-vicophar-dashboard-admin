/**
 * ===================================================================
 * LAYOUT COMPONENTS - EXPORT TẬP TRUNG
 * ===================================================================
 *
 * File này export tất cả layout components để dễ dàng import.
 *
 * KIẾN TRÚC 3 LỚP:
 * 1. Layout Controller: DashboardLayout
 * 2. Panel State: DashboardContext (ở providers/)
 * 3. Panel Renderers: SidebarPanel, DrawerPanel, PanelContent/*
 */

// Layout wrapper chính (Layout Controller)
export { DashboardLayout } from './DashboardLayout';

// UI Primitives (Panel Renderers)
export {
  SidebarPanel,
  DrawerPanel,
  LeftPanelContent,
  RightPanelContent,
} from './panels';

// Các sub-components
export { Header } from './Header';
export { MainContent } from './MainContent';

// Legacy components (giữ lại cho backward compatibility)
export { SidebarLeft } from './SidebarLeft';
export { SidebarRight } from './SidebarRight';
