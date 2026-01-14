/**
 * =============================================================================
 * FILE: _components/index.ts
 * =============================================================================
 *
 * MÔ TẢ:
 *   Export tập trung cho tất cả components của Home Dashboard.
 *
 * CẤU TRÚC:
 *   - MainContent: Cột trái (Header, Stats, Analytics, Recent)
 *   - RightBar: Sidebar phải (Task + Calendar)
 *
 * =============================================================================
 */

// =============================================================================
// MAIN CONTENT (NEW STRUCTURE)
// =============================================================================
export { MainContent } from './MainContent';

// =============================================================================
// RIGHT BAR CONTENT (NEW STRUCTURE)
// =============================================================================
export { RightBar as RightBarContent } from './RightBar';

// Export legacy (if any) or shared types here if needed
