# AUDIT REPORT: PURE DATA & BEHAVIOR (PHASE 2)

## 1. Định nghĩa DASHBOARD DATA CONTRACT
*Kiểm tra việc trả lời câu hỏi của từng Section.*

| Section | Câu hỏi | Đánh giá hiện tại | Nguồn Data | Kết luận |
| :--- | :--- | :--- | :--- | :--- |
| **StatOverview** | Hệ thống sống/chết? | ✅ **ĐẠT**. Hiển thị rõ số lượng Post/Product/Draft. | **Backend** (System Truth) | Giữ nguyên. |
| **RecentContent** | Admin vừa làm gì? | ✅ **ĐẠT**. List bài mới nhất/vừa sửa với status badge. | **Backend** (System Truth) | Giữ nguyên. |
| **Analytics** | Website tăng/giảm? | ⚠️ **THIẾU SÓT**. Đã có Trend & Top Content, nhưng **THIẾU biểu đồ Traffic Source**. | **Google Analytics** | **CẦN BỔ SUNG NGAY**. |
| **RightBar** | Làm gì tiếp theo? | ✅ **ĐẠT**. Task list & Calendar rõ ràng. | **Backend** (System Truth) | Giữ nguyên. |
| **ContextPanel** | Nhắc nhở nhanh? | ✅ **ĐẠT**. Số bài Draft, Lịch hẹn hôm nay. | **Backend** (System Truth) | Giữ nguyên. |

---

## 2. Chuẩn hoá DATA SOURCE
*Kiểm tra nguồn dữ liệu đã đúng chưa.*

- **Backend (System Truth)**:
  - `stats`: ✅ Đúng (Lấy Count từ DB).
  - `recentContent`: ✅ Đúng (Query `updated_at` từ DB).
  - `draggableItems` (Tasks): ✅ Đúng (Lưu trong DB config user).
  - `userContext`: ✅ Đúng (Lấy từ Session/DB).
  
- **Google Analytics**:
  - `gaPerformance`: ✅ Đúng (Dữ liệu hành vi người dùng).
    - *Lưu ý*: Hiện tại FE đang giả lập mock, BE cần job sync theo giờ.

---

## 3. Analytics — MINIMALISM CHECK
*Kiểm tra tiêu chí "4 loại analytics tối thiểu".*

1.  **Sessions / Users (7 ngày)**: ✅ Đã có trong `Vital Signs Grid` (Trend tăng giảm).
2.  **Trend so với 7 ngày trước**: ✅ Đã có `TrafficLineChart`.
3.  **Top Content**: ✅ Đã có `ContentPerformance` (Top bài view cao).
4.  **Traffic Source (Organic / Direct)**: ❌ **MISSING**. Hiện tại chưa có dữ liệu và UI cho phần này.

👉 **Hành động Required**: Cần thêm `TrafficSource` vào `GAPerformanceData` và hiển thị (Pie Chart hoặc List).

---

## 4. Chuẩn hoá API SHAPE
*Kiểm tra tính "Dumb" của Frontend.*

- **Current State**: Frontend nhận `data` object từ hook và mapping thẳng vào Component.
- **Dependency**: Không có logic tính toán phức tạp (như filter, reduce) ở View layer.
- **Contract**: JSON Structure hiện tại (`mockDashboardData.ts`) đã khớp 95% với yêu cầu, chỉ thiếu trường `trafficSource`.

---

## ĐỀ XUẤT HÀNH ĐỘNG NGAY (IMMEDIATE ACTIONS)

Để hoàn tất Phase 2 và khóa task này (không miss dữ liệu), cần thực hiện bổ sung:

1.  **Update `mockDashboardData.ts`**: Thêm trường `trafficSource` vào interface `GAPerformanceData`.
    ```ts
    trafficSource: {
      label: string; // Organic, Direct, Social
      value: number; // % hoặc count
    }[];
    ```
2.  **Update UI**: Thêm mục **Traffic Source** vào phần Analytics (có thể đặt cạnh chart TrafficTrend hoặc dưới Vital Signs).

> **Xác nhận**: Bạn có muốn tôi thực hiện bước bổ sung `TrafficSource` này ngay lập tức để đạt 100% tiêu chí audit không?
