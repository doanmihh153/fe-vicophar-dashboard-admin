/**
 * =============================================================================
 * FILE: mockDashboardData.ts
 * =============================================================================
 *
 * MÔ TẢ:
 *   Dữ liệu mock tập trung cho trang Home Dashboard.
 *   Tất cả data được định nghĩa tại đây, UI component chỉ nhận qua props.
 *
 * NGUYÊN TẮC (theo Design Constitution v1):
 *   - Data tập trung về 1 nơi
 *   - Không hardcode trong component
 *   - Dễ thay thế bằng API thật sau này
 *
 * =============================================================================
 */

// =============================================================================
// TYPES - Định nghĩa kiểu dữ liệu
// =============================================================================

/**
 * Thông tin ngữ cảnh của user hiện tại
 * Hiển thị trong Welcome Section và Context Quick Panel
 */
export interface UserContext {
  /** Tên hiển thị của admin */
  userName: string;
  /** Lời chào tùy theo thời điểm trong ngày */
  greeting: string;
  /** Số bài viết đang ở trạng thái draft */
  draftsCount: number;
  /** Số lịch hẹn trong ngày hôm nay */
  todayAppointments: number;
  /** Số bài chờ duyệt */
  pendingReviews: number;
}

/**
 * Item thống kê trong StatOverview
 * Mỗi item là entry point điều hướng đến trang chi tiết
 */
export interface StatItem {
  /** ID duy nhất */
  id: string;
  /** Nhãn hiển thị (vd: "Tin tức", "Sản phẩm") */
  label: string;
  /** Giá trị số */
  value: number;
  /** Link điều hướng khi click */
  href: string;
  /** Màu sắc Icon/Text (Hex) */
  color?: string;
  /** Màu nền Card (Hex/Var) */
  bgColor?: string;
  /** Tùy chỉnh class Tailwind cho background (ghi đè bgColor) */
  className?: string;
  /** Tùy chỉnh class Tailwind cho Icon/Text (ghi đè color) */
  iconClassName?: string;
  /** Tùy chỉnh class Tailwind cho Pattern Dots (dùng text-color) */
  patternClassName?: string;
}

/**
 * Nội dung gần đây (bài viết, sản phẩm, tin tức)
 * Hiển thị trong RecentContent section
 */
export interface RecentContentItem {
  /** ID duy nhất */
  id: string;
  /** Tiêu đề nội dung */
  title: string;
  /** Loại nội dung */
  type: 'article' | 'product' | 'news';
  /** Trạng thái: draft (nháp) hoặc published (đã xuất bản) */
  status: 'draft' | 'published';
  /** Thời gian tạo */
  createdAt: Date;
  /** Link đến trang chi tiết */
  href: string;
}

/**
 * Dữ liệu Analytics overview
 * Chỉ hiển thị signal đơn giản, không phân tích sâu
 */
export interface AnalyticsData {
  /** Lượt xem trang hôm nay */
  todayPageviews: number;
  /** Xu hướng so với hôm qua */
  trend: 'up' | 'down' | 'stable';
  /** Phần trăm thay đổi */
  trendPercent: number;
  /** Top nội dung được xem nhiều */
  topContent: Array<{
    title: string;
    views: number;
  }>;
}

/**
 * Item trong danh sách công việc (Right Bar)
 * Có thể kéo thả để sắp xếp
 */
export interface DraggableItem {
  /** ID duy nhất */
  id: string;
  /** Tiêu đề công việc */
  title: string;
  /** Ngày liên quan */
  date: Date;
  /** Mức độ ưu tiên - chỉ dùng để hiển thị dot màu nhỏ */
  priority: 'high' | 'medium' | 'low';
}

/**
 * Tổng hợp toàn bộ dữ liệu Dashboard
 */
export interface DashboardData {
  userContext: UserContext;
  stats: StatItem[];
  recentContent: RecentContentItem[];
  analytics: AnalyticsData;
  draggableItems: DraggableItem[];
}

// =============================================================================
// MOCK DATA - Dữ liệu giả lập
// =============================================================================

/**
 * Tạo greeting dựa trên thời gian hiện tại
 * @returns Lời chào phù hợp với buổi trong ngày
 */
function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Chúc bạn một buổi sáng làm việc hiệu quả!';
  } else if (hour < 18) {
    return 'Chúc bạn một buổi chiều năng động!';
  } else {
    return 'Làm việc muộn nhỉ? Nhớ nghỉ ngơi nhé!';
  }
}

/**
 * Dữ liệu ngữ cảnh user
 */
const mockUserContext: UserContext = {
  userName: 'Đoàn Minh',
  greeting: getTimeBasedGreeting(),
  draftsCount: 5,
  todayAppointments: 2,
  pendingReviews: 8,
};

/**
 * Dữ liệu thống kê tổng quan
 * Mỗi item là entry point điều hướng
 */
const mockStats: StatItem[] = [
  {
    id: 'news',
    label: 'Tin tức',
    value: 24,
    href: '/cms/news',
  },
  {
    id: 'articles',
    label: 'Bài viết',
    value: 156,
    href: '/cms/articles',
  },
  {
    id: 'products',
    label: 'Sản phẩm',
    value: 89,
    href: '/cms/products',
  },
  {
    id: 'drafts',
    label: 'Bản nháp',
    value: 12,
    href: '/cms/drafts',
  },
];

/**
 * Tạo ngày trong quá khứ
 * @param daysAgo Số ngày trước
 */
function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * Danh sách nội dung gần đây
 */
const mockRecentContent: RecentContentItem[] = [
  {
    id: '1',
    title: 'Hướng dẫn sử dụng hệ thống quản lý kho mới',
    type: 'article',
    status: 'published',
    createdAt: daysAgo(0),
    href: '/cms/articles/1',
  },
  {
    id: '2',
    title: 'Vitamin C 1000mg - Cập nhật thông tin sản phẩm',
    type: 'product',
    status: 'draft',
    createdAt: daysAgo(1),
    href: '/cms/products/2',
  },
  {
    id: '3',
    title: 'Thông báo nghỉ lễ Tết Nguyên Đán 2026',
    type: 'news',
    status: 'published',
    createdAt: daysAgo(2),
    href: '/cms/news/3',
  },
  {
    id: '4',
    title: 'Chương trình khuyến mãi tháng 1',
    type: 'news',
    status: 'draft',
    createdAt: daysAgo(3),
    href: '/cms/news/4',
  },
  {
    id: '5',
    title: 'Cập nhật chính sách bảo hành sản phẩm',
    type: 'article',
    status: 'published',
    createdAt: daysAgo(5),
    href: '/cms/articles/5',
  },
];

/**
 * Dữ liệu Analytics
 * Chỉ mang tính signal, không phân tích sâu
 */
const mockAnalytics: AnalyticsData = {
  todayPageviews: 1247,
  trend: 'up',
  trendPercent: 12,
  topContent: [
    { title: 'Trang chủ', views: 523 },
    { title: 'Sản phẩm Vitamin', views: 234 },
    { title: 'Tin tức công ty', views: 189 },
  ],
};

/**
 * Danh sách công việc trong Right Bar
 * Priority dùng để hiển thị dot màu nhỏ (theo Design Constitution)
 */
const mockDraggableItems: DraggableItem[] = [
  {
    id: '1',
    title: 'Review bài viết SEO sản phẩm mới',
    date: new Date(),
    priority: 'high',
  },
  {
    id: '2',
    title: 'Cập nhật banner trang chủ',
    date: new Date(),
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Kiểm tra đơn hàng tồn đọng',
    date: daysAgo(-1), // Ngày mai
    priority: 'high',
  },
  {
    id: '4',
    title: 'Dọn dẹp media library',
    date: daysAgo(-2),
    priority: 'low',
  },
  {
    id: '5',
    title: 'Backup database định kỳ',
    date: daysAgo(-3),
    priority: 'medium',
  },
];

// =============================================================================
// EXPORT - Xuất dữ liệu
// =============================================================================

/**
 * Dữ liệu Dashboard đầy đủ
 * UI components sẽ nhận data này qua useDashboardData hook
 */
export const mockDashboardData: DashboardData = {
  userContext: mockUserContext,
  stats: mockStats,
  recentContent: mockRecentContent,
  analytics: mockAnalytics,
  draggableItems: mockDraggableItems,
};

/**
 * Placeholder cho StatOverview khi loading
 */
export const STAT_PLACEHOLDERS: StatItem[] = [
  { id: 'placeholder-1', label: '...', value: 0, href: '#' },
  { id: 'placeholder-2', label: '...', value: 0, href: '#' },
  { id: 'placeholder-3', label: '...', value: 0, href: '#' },
  { id: 'placeholder-4', label: '...', value: 0, href: '#' },
];
