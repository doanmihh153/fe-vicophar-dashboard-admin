/**
 * ============================================
 * RIGHT PANEL CONTENT (DEPRECATED)
 * ============================================
 *
 * File này giờ chỉ re-export SidebarRight để backward compatibility.
 * Nên dùng trực tiếp: import { SidebarRight } from './RightPanel'
 *
 * @deprecated Dùng SidebarRight thay thế
 */

export {
  SidebarRight as RightPanelContent,
  SidebarRight as default,
} from './RightPanel';
