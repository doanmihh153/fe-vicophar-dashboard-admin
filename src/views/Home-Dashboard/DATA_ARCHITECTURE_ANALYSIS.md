# Phân Tích & Kiến trúc Dữ liệu - Home Dashboard V2

## 1. Hiện trạng Data Flow
Hiện tại, Frontend đang áp dụng mô hình **Centralized Data Injection**:
- **Source**: `useDashboardData.ts` là nơi duy nhất chịu trách nhiệm lấy dữ liệu.
- **Distribution**: Data được truyền xuống `DashboardPage` và từ đó phân phối (prop-drilling) xuống `MainContent` và `RightBar`.
- **Ưu điểm**: Frontend rất sạch, View (`MainContent`, `RightBar`) hoàn toàn "ngu" (dumb), chỉ hiển thị những gì được truyền vào. Dễ test và dễ thay đổi API.

## 2. Đề xuất API Contract (Backend <-> Frontend)

Để đảm bảo hiệu năng và tính nhất quán, Backend nên cung cấp **01 Endpoint duy nhất** (Composite API) cho toàn bộ trang Dashboard, thay vì gọi rời rạc 4-5 APIs.

**Endpoint**: `GET /api/v1/dashboard/overview`

### Response Schema (JSON)
Backend Developer cần trả về cấu trúc JSON y hệt như sau:

```json
{
  "userContext": {
    "userName": "Đoàn Minh",
    "greeting": "Buổi sáng tốt lành",
    "draftsCount": 5,           // Số bài nháp (dùng cho QuickPanel)
    "todayAppointments": 2,     // Số lịch hẹn hôm nay
    "pendingReviews": 8         // Số bài chờ duyệt
  },
  
  "stats": [
    { "id": "news", "label": "Tin tức", "value": 24, "href": "/cms/news" },
    { "id": "articles", "label": "Bài viết", "value": 156, "href": "/cms/articles" },
    { "id": "products", "label": "Sản phẩm", "value": 89, "href": "/cms/products" }
    // Lưu ý: Backend nên tính toán sẵn các con số này & cache lại
  ],

  "recentContent": [
    // Mixed content từ Articles, Products, News (ORDER BY created_at DESC LIMIT 5)
    {
      "id": "uuid-1",
      "title": "Hướng dẫn sử dụng...",
      "type": "article",
      "thumbnail": "https://...",
      "status": "published",
      "createdAt": "2024-01-20T08:00:00Z", // ISO String
      "href": "/cms/articles/uuid-1"
    }
  ],

  "gaPerformance": {
    "overview": {
      "totalUsers": { "value": 1205, "trend": "up", "percent": 12 },
      // ... các metric khác từ Google Analytics Reporting API
    },
    "trafficTrend": {
      "labels": ["T2", "T3", "..."],
      "values": [1200, 1500, ...]
    },
    "trafficSource": [
      { "label": "Organic Search", "value": 45,  },
      { "label": "Direct", "value": 30, },
      { "label": "Social", "value": 15, },
      { "label": "Referral", "value": 10, }
    ]
  },

  "contentPerformance": [
    // Top bài viết view cao nhất (Join CMS DB + GA Data)
    {
      "id": "post-1",
      "title": "Top 5...",
      "metrics": { "views": 5000, "avgTime": 180 }
    }
  ],

  "tasks": [
    // Personal Tasks của Admin đó
    { "id": "t1", "title": "Check mail", "priority": "high", "date": "..." }
  ]
}
```

## 3. Lưu ý Kỹ thuật (Technical Notes)

### Vấn đề 1: Performance (Analytics Data)
Dữ liệu `gaPerformance` lấy từ Google Analytics có thể rất chậm (>1s).
- **Giải pháp BE**: Sử dụng Background Job để sync data GA về DB của mình theo giờ (e.g., mỗi 1 tiếng sync 1 lần). API Dashboard chỉ đọc từ DB Local -> **Response < 100ms**.

### Vấn đề 2: Date Object
JSON API luôn trả về `string` (ISO 8601).
- **Giải pháp FE**: Tại `useDashboardData.ts`, cần một lớp **Adapter (Transformer)** để convert string thành Date Object trước khi `setData`.
- *Không được để View Component tự parse Date string.*

### Vấn đề 3: Personal Tasks (RightBar)
Đây là dữ liệu tương tác (CRUD).
- Backend cần thêm các endpoint phụ:
   - `PUT /api/v1/dashboard/tasks`: Để lưu vị trí (reorder) hoặc update task.
   - `POST /api/v1/dashboard/tasks`: Tạo task mới.

## 4. Kết luận
Kiến trúc hiện tại của `Home-Dashboard` đã **CHUẨN** (Centralized).
Frontend chỉ cần đợi Backend build đúng API theo schema trên là có thể tích hợp ngay lập tức (Plug & Play).
