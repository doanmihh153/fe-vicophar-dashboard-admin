import Link from 'next/link';
import { TextHover } from '@/components/ui/TextHover';

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

export function NavItem({
  icon: Icon,
  label,
  badge,
  isActive = false,
  isCollapsed = false,
  href = '#',
}: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        if (isActive) {
          e.preventDefault();
        }
      }}
      className={`group focus-visible:ring-ring relative flex items-center rounded-lg p-2 font-normal transition-colors duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isCollapsed ? 'justify-center gap-0' : 'gap-2'
      } ${
        isActive
          ? 'bg-hover-card! text-sidebar-text-heading cursor-default font-semibold'
          : 'text-muted-foreground hover:bg-hover-card! hover:text-accent-foreground'
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
       * - Active: Màu được override bởi sidebar-text-heading
       */}
      <Icon className={'h-5 w-5 shrink-0'} />

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
        className={`truncate whitespace-nowrap transition-all duration-200 ${
          isCollapsed
            ? 'w-0 flex-none overflow-hidden opacity-0'
            : 'w-auto flex-1 opacity-100'
        } `}
      >
        <TextHover disabled={isActive}>{label}</TextHover>
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
          className={`bg-label-bg text-label-text rounded-full text-xs font-medium transition-all duration-200 ${
            isCollapsed
              ? 'w-0 scale-0 overflow-hidden p-0 opacity-0'
              : 'w-auto scale-100 px-2 py-0.5 opacity-100'
          } `}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}
