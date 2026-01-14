# Home Dashboard V2 Module

## Giới thiệu
Module `Home-Dashboard` là màn hình chính của Admin Dashboard, được thiết kế theo phong cách **Structured Minimalism** và kiến trúc **Enterprise Maintainable Architecture**.

Phiên bản V2 này tập trung vào việc tách biệt rõ ràng giữa **MainContent** (Hiển thị dữ liệu) và **RightBar** (Tác vụ cá nhân), đồng thời áp dụng nghiêm ngặt các nguyên tắc Clean Code.

## Cấu trúc Thư mục (Directory Structure)

Áp dụng chiến lược **Folder-per-component**: Mỗi component, dù nhỏ, cũng nên có folder riêng nếu cần mở rộng (trừ các atomic sub-components quá nhỏ).

```
src/views/Home-Dashboard/
├── _components/                # Tất cả components con nằm ở đây
│   ├── MainContent/            # CỘT TRÁI: Dữ liệu chính
│   │   ├── components/
│   │   │   ├── Header/         # Bento Grid Header (Welcome + Context)
│   │   │   ├── Stats/          # 3D Metric Cards
│   │   │   ├── Analytics/      # Traffic & Content Performance Charts
│   │   │   └── RecentActivities/ # Horizontal Scroll Content
│   │   └── MainContent.tsx     # Orchestrator Component
│   │
│   └── RightBar/               # CỘT PHẢI: Personal Tools
│       ├── components/
│       │   ├── TaskList/       # Drag & Drop Tasks
│       │   ├── Calendar/       # Mini Calendar
│       │   └── TaskPopup/      # Add/Edit Task Modal
│       ├── _hooks/             # Logic Hooks (useTaskDrag, useTaskLogic)
│       └── RightBar.tsx        # Orchestrator Component
│
├── _data/                      # MOCK DATA & Types Definitions
├── _hooks/                     # Shared Hooks (nếu có)
├── DashboardPage.tsx           # Entry Point (Layout Grid)
└── README.md                   # Tài liệu này
```

## Nguyên tắc Phát triển (Development Rules)

### 1. Separation of Concerns (Tách biệt logic)
- **UI Components** (`.tsx`): Chỉ chịu trách nhiệm hiển thị (Render). Tuyệt đối không chứa logic xử lý phức tạp (CRUD, sorting algos).
- **Hooks** (`_hooks/*.ts`): Chứa toàn bộ logic nghiệp vụ, state management, và side-effects.
- **Data**: Định nghĩa trong `_data` hoặc lấy từ API/Store, truyền xuống qua Props.

### 2. Index Files
- File `index.ts` **CHỈ DÙNG ĐỂ EXPORT**.
- Không viết code logic hay định nghĩa component trong `index.ts`.
- Ví dụ đúng: `export * from './Component';`

### 3. Component Isolation
- Các sub-components nhỏ (như `MetricItem`, `StatusBadge`) nên được tách ra folder `components/` bên trong component cha nếu chúng chỉ được dùng cục bộ.
- Giữ cho Main Component (ví dụ `TrafficOverview.tsx`) sạch sẽ, dưới 200 dòng code.

### 4. Loading State (Skeleton)
- Mọi component có call API hoặc chờ dữ liệu **BẮT BUỘC** phải có trạng thái loading.
- Sử dụng `Skeleton` component để hiển thị khung placeholder, tránh layout shift (CLS).
- Kích thước Skeleton phải khớp chính xác với kích thước content thật.

## Hướng dẫn Chỉnh sửa (Change Log)

### Cập nhật Header
Header sử dụng Bento Grid layout. Để thêm block mới:
1. Vào `MainContent/components/Header`.
2. Tạo component mới cho block.
3. Import vào `HomeMainHeader.tsx` và thêm vào grid.

### Thêm Chart mới
Logic chart nằm trong `MainContent/components/Analytics`.
- Sử dụng SVG thuần hoặc thư viện chart nhẹ.
- Tách riêng component Chart (ví dụ `TrafficLineChart.tsx`) khỏi container (`TrafficOverview.tsx`).

---
*Documented by AntiGravity - 2026*
