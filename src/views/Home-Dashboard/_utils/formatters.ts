/**
 * =============================================================================
 * FILE: formatters.ts
 * =============================================================================
 *
 * MÔ TẢ:
 *   Utility functions để format dữ liệu hiển thị trong Dashboard.
 *   Tất cả format functions được tập trung tại đây để:
 *   - Đảm bảo tính nhất quán trong toàn app
 *   - Dễ dàng thay đổi format khi cần
 *   - Hỗ trợ i18n sau này
 *
 * =============================================================================
 */

// =============================================================================
// DATE/TIME FORMATTERS
// =============================================================================

/**
 * Format thời gian tương đối (vd: "2 giờ trước", "Hôm qua")
 * Phù hợp cho RecentContent items
 *
 * @param date - Date object hoặc timestamp
 * @returns Chuỗi thời gian tương đối tiếng Việt
 *
 * @example
 * formatRelativeTime(new Date()) // "Vừa xong"
 * formatRelativeTime(daysAgo(1)) // "Hôm qua"
 * formatRelativeTime(daysAgo(5)) // "5 ngày trước"
 */
export function formatRelativeTime(date: Date | number): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Vừa xong (dưới 1 phút)
  if (diffMinutes < 1) {
    return 'Vừa xong';
  }

  // X phút trước
  if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`;
  }

  // X giờ trước
  if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  }

  // Hôm qua
  if (diffDays === 1) {
    return 'Hôm qua';
  }

  // X ngày trước (dưới 7 ngày)
  if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  }

  // Tuần trước (7-13 ngày)
  if (diffDays < 14) {
    return 'Tuần trước';
  }

  // Format ngày cụ thể (từ 2 tuần trở lên)
  return target.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format ngày ngắn gọn cho Calendar
 *
 * @param date - Date object
 * @returns Chuỗi ngày (vd: "13/01")
 */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  });
}

// =============================================================================
// NUMBER FORMATTERS
// =============================================================================

/**
 * Format số với dấu phân cách hàng nghìn
 * Dùng cho Analytics và các số liệu thống kê
 *
 * @param num - Số cần format
 * @returns Chuỗi số đã format (vd: "1.247")
 *
 * @example
 * formatNumber(1247) // "1.247"
 * formatNumber(1000000) // "1.000.000"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Format số với suffix K/M cho số lớn
 * Tiết kiệm không gian UI
 *
 * @param num - Số cần format
 * @returns Chuỗi số rút gọn (vd: "1.2K", "5M")
 *
 * @example
 * formatCompactNumber(1200) // "1.2K"
 * formatCompactNumber(5000000) // "5M"
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return num.toString();
}

// =============================================================================
// TEXT FORMATTERS
// =============================================================================

/**
 * Truncate text với ellipsis
 * Đảm bảo text không vượt quá chiều dài cho phép
 *
 * @param text - Text gốc
 * @param maxLength - Chiều dài tối đa (mặc định 50)
 * @returns Text đã được cắt (nếu cần)
 *
 * @example
 * truncateText("Một đoạn văn rất dài...", 20) // "Một đoạn văn rất d..."
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 3)}...`;
}

// =============================================================================
// STATUS FORMATTERS
// =============================================================================

/**
 * Chuyển đổi status code thành label tiếng Việt
 *
 * @param status - Status code
 * @returns Label tiếng Việt
 */
export function formatContentStatus(status: 'draft' | 'published'): string {
  const statusMap: Record<typeof status, string> = {
    draft: 'Nháp',
    published: 'Đã xuất bản',
  };
  return statusMap[status];
}
