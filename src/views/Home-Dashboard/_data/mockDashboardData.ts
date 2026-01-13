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
 * Dữ liệu Traffic Overview (Level 1 & 3)
 * Nguồn: Google Analytics 4
 */
export interface GAPerformanceData {
  overview: {
    totalUsers: {
      value: number;
      trend: 'up' | 'down' | 'stable';
      percent: number;
    };
    sessions: {
      value: number;
      trend: 'up' | 'down' | 'stable';
      percent: number;
    };
    pageViews: {
      value: number;
      trend: 'up' | 'down' | 'stable';
      percent: number;
    };
    avgEngagementTime: {
      value: number;
      unit: string;
      trend: 'stable' | 'up' | 'down';
    };
  };
  /** Dữ liệu Line Chart cho Traffic Trend */
  trafficTrend: {
    labels: string[]; // Mon, Tue...
    values: number[]; // Pageviews
  };
}

/**
 * Dữ liệu Content Performance (Level 2)
 * Nguồn: Backend CMS + GA Metrics Sync
 */
export interface ContentPerformanceItem {
  id: string;
  title: string;
  thumbnail: string; // 📸 Visual element
  category: string;
  status: 'draft' | 'published';
  publishedAt: Date;
  metrics: {
    views: number;
    avgTime: number; // seconds
  };
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
  recentContent: RecentContentItem[]; // Giữ lại cho section Recent
  draggableItems: DraggableItem[];
  // New Analytics Architecture
  gaPerformance: GAPerformanceData;
  contentPerformance: ContentPerformanceItem[];
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

const mockGAPerformance: GAPerformanceData = {
  overview: {
    totalUsers: { value: 1205, trend: 'up', percent: 12 },
    sessions: { value: 3450, trend: 'up', percent: 5 },
    pageViews: { value: 12450, trend: 'down', percent: -2 },
    avgEngagementTime: { value: 145, unit: 'seconds', trend: 'stable' },
  },
  trafficTrend: {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    values: [1200, 1500, 1800, 1400, 2000, 2500, 3000],
  },
};

const mockContentPerformance: ContentPerformanceItem[] = [
  {
    id: '1',
    title: 'Hướng dẫn sử dụng Vitamin C đúng cách',
    thumbnail:
      'https://images.unsplash.com/photo-1511688878353-3a2f5be94c74?w=800&auto=format&fit=crop&q=60',
    category: 'Sức khỏe',
    status: 'published',
    publishedAt: daysAgo(2),
    metrics: { views: 5230, avgTime: 180 },
  },
  {
    id: '2',
    title: 'Top 5 loại thực phẩm chức năng cho người già',
    thumbnail:
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=60',
    category: 'Sản phẩm',
    status: 'published',
    publishedAt: daysAgo(5),
    metrics: { views: 3120, avgTime: 240 },
  },
  {
    id: '3',
    title: 'Lịch nghỉ Tết Nguyên Đán 2026',
    thumbnail:
      'https://images.unsplash.com/photo-1543269664-7eef42226a21?w=800&auto=format&fit=crop&q=60',
    category: 'Tin tức',
    status: 'published',
    publishedAt: daysAgo(1),
    metrics: { views: 8900, avgTime: 60 },
  },
];

// ... existing code ...

const mockDraggableItems: DraggableItem[] = [
  // ... existing items ...
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

// ... existing export ...

export const mockDashboardData: DashboardData = {
  userContext: mockUserContext,
  stats: mockStats,
  recentContent: mockRecentContent,
  draggableItems: mockDraggableItems,
  gaPerformance: mockGAPerformance,
  contentPerformance: mockContentPerformance,
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
