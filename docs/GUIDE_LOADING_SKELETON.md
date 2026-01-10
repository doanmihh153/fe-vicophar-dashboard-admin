# 📖 Hướng Dẫn: Loading UI & Skeleton Architecture

> Tài liệu này hướng dẫn cách xây dựng trải nghiệm loading mượt mà, tránh "giật layout" (Layout Shift) cho các dự án Next.js (App Router).

---

## 🏗️ Kiến Trúc Tổng Quan

Chúng ta sử dụng chiến lược **2 lớp Loading**:

1.  **Page Loading ([loading.tsx](src/app/loading.tsx))**:
    -   Xử lý loading **toàn trang** khi User chuyển hướng (navigation).
    -   Next.js tự động giữ nguyên Layout (Sidebar, Header) và chỉ thay thế phần nội dung chính bằng Skeleton.
    -   **Lợi ích**: User thấy phản hồi tức thì, không bị trắng trang.

2.  **Component Loading (Skeleton)**:
    -   Xử lý loading **cục bộ** cho các thành phần con đang fetch data (VD: User Profile trên Header).
    -   Dùng Skeleton có **kích thước thật** để giữ chỗ -> Layout không bị co giãn khi data về.

---

## 🛠️ Components

### 1. Skeleton Component ([ui/Skeleton.tsx](src/components/ui/Skeleton.tsx))

Component cơ bản tạo hiệu ứng "xương" nhấp nháy.

```tsx
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted/50", className)}
            {...props}
        />
    );
}
```

**Cách dùng:**

```tsx
// Hình tròn (Avatar)
<Skeleton className="h-10 w-10 rounded-full" />

// Hình chữ nhật (Text line)
<Skeleton className="h-4 w-[200px]" />
```

---

## 🚀 Hướng Dẫn Thực Hiện

### Bước 1: Tạo [loading.tsx](src/app/loading.tsx)

Đặt file [loading.tsx](src/app/loading.tsx) ngang cấp với [page.tsx](src/app/page.tsx) hoặc [layout.tsx](src/app/layout.tsx) mà bạn muốn áp dụng loading.

```tsx
// src/app/loading.tsx
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-1/3" /> {/* Title */}
            <div className="grid grid-cols-3 gap-4">
                 <Skeleton className="h-32" /> {/* Cards */}
                 <Skeleton className="h-32" />
                 <Skeleton className="h-32" />
            </div>
        </div>
    )
}
```

### Bước 2: Xử Lý Logic `isLoading`

Trong Context hoặc Hook fetching data, luôn trả về trạng thái `isLoading`.

```tsx
// user-context.tsx
export function UserProvider() {
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        fetchUser().then(() => {
            // ... set user ...
            setIsLoading(false);
        });
    }, []);

    // ...
}
```

### Bước 3: Quy Trình Phân Tích & Implement (BẮT BUỘC)

Để đảm bảo không bao giờ bị "Duplicate Layout" và "Layout Shift", mọi component phải tuân thủ nghiêm ngặt 4 bước sau:

#### 1. Phân Tích Luồng Dữ Liệu (Data Flow)
- Xác định UI nào cần data gì.
- Data `undefined/null` thì render gì? Data đang load thì render gì?

#### 2. Tự Tạo "Internal Prompt" (Tư Duy)
- **Tư duy sai:** "Loading là hiển thị component Skeleton".
- **Tư duy đúng:** "Loading là trạng thái Data chưa về -> Hiển thị Placeholder vào đúng vị trí Data đó".
- **Luật Bất Biến:** Layout Wrapper (các thẻ div flex/grid) CHỈ ĐƯỢC VIẾT 1 LẦN. Không bao giờ được viết `if (loading) return <SkeletonLayout />`.

#### 3. Implement Codes (Strict Mode)
- Chỉ dùng toán tử 3 ngôi `condition ? <Skeleton /> : <Content />` tại đúng Node lá (Leaf Node).

**❌ Sai (Duplicate Layout):**
```tsx
// SAI LẦM CHẾT NGƯỜI: Tạo ra 2 phiên bản layout
if (isLoading) {
    return (
        <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-20" />
        </div>
    );
}
return (
    <div className="flex gap-2"> {/* LẶP LẠI LAYOUT -> RỦI RO MAINTAIN */}
        <img src={src} className="h-10 w-10 rounded-full" />
        <span>{text}</span>
    </div>
)
```

**✅ Đúng (Single Layout Source):**
```tsx
// CHUẨN: Layout chỉ viết 1 lần duy nhất
return (
    <div className="flex gap-2">
        {/* Avatar Slot */}
        {isLoading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
        ) : (
            <img src={src} className="h-10 w-10 rounded-full" />
        )}

        {/* Text Slot */}
        {isLoading ? (
            <Skeleton className="h-4 w-20" />
        ) : (
            <span>{text}</span>
        )}
    </div>
);
```

#### 4. Verification
- So sánh chiều cao (Height) của Skeleton và Content thật. Nếu lệch 1px cũng là LỖI (gây Layout Shift).
- Đảm bảo khi sửa CSS ở Wrapper, cả Loading và Content đều tự cập nhật theo (vì dùng chung Layout).

#### 5. Mẫu Internal Prompt (Template)

Hãy copy nội dung dưới đây và điền vào trước khi code component mới:

```markdown
# INTERNAL PROMPT: [COMPONENT NAME]

## 1. Phân Tích Layout (UI First)
- Wrapper chính là gì? (Flex/Grid?): ...
- Các Slot dữ liệu nằm ở đâu?: ...

## 2. Ánh Xạ Dữ Liệu (Data Mapping)

| UI Slot | Data Source | Logic Loading (Skeleton) | Logic Hiển Thị |
| :--- | :--- | :--- | :--- |
| Slot A | `user.name` | `<Skeleton className="h-7 w-32" />` | `{user.name}` |
| Slot B | `user.img` | `<Skeleton className="h-10 w-10 circle" />` | `<img src={...} />` |

## 3. Checklist Tự Kiểm Tra
1. [ ] Tôi có đang tạo 2 layout không? (Phải là NO)
2. [ ] Kích thước Skeleton có khớp text thật không? (Phải là YES)
3. [ ] Nếu data loading, tôi có return null không? (Phải là NO - trừ khi data null VÀ loading false)
```

---

## 💡 Mẹo nhỏ (Tips)

1.  **Kích thước Skeleton**: Hãy đo kích thước thật của nội dung (dùng DevTools) và set `w-` `h-` cho Skeleton tương ứng.
2.  **Delay giả lập**: Khi dev local, mạng quá nhanh nên loading chớp tắt. Dùng `setTimeout` trong Context để test hiệu ứng loading (như project này đang dùng 500ms).
3.  **Color**: Skeleton dùng màu `bg-muted/50` để tương thích tốt với cả Light Mode và Dark Mode (nhờ CSS Variables).
