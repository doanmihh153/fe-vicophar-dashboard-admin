/**
 * =============================================================================
 * FILE: _components/index.ts
 * =============================================================================
 *
 * MÔ TẢ:
 *   Export tập trung cho tất cả components của Home Dashboard.
 *   Import từ file này thay vì import trực tiếp từ từng folder.
 *
 * CẤU TRÚC:
 *   - HomeMainHeader: Welcome + Context Panel
 *   - StatOverview: Grid 4 cột thống kê
 *   - RecentContent: Danh sách nội dung gần đây
 *   - AnalyticsOverview: Thống kê analytics đơn giản
 *
 * =============================================================================
 */

// =============================================================================
// HOME MAIN HEADER
// =============================================================================
export { HomeMainHeader } from './HomeMainHeader';
export { WelcomeSection } from './HomeMainHeader';
export { ContextQuickPanel } from './HomeMainHeader';

// =============================================================================
// STAT OVERVIEW
// =============================================================================
export { StatOverview } from './StatOverview';
export { StatCard } from './StatOverview';

// =============================================================================
// RECENT CONTENT
// =============================================================================
export { RecentContent } from './RecentContent';
export { RecentItem } from './RecentContent';

// =============================================================================
// ANALYTICS OVERVIEW
// =============================================================================
export { AnalyticsOverview } from './AnalyticsOverview';
