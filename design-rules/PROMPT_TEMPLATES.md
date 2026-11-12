# MẪU PROMPT CHUẨN DÀNH CHO AI (PROMPT TEMPLATES)

Khi làm việc với các trợ lý AI (như Antigravity, Claude, ChatGPT, Cursor...), bạn chỉ cần copy các mẫu prompt dưới đây hoặc gõ kèm `@design-rules/DESIGN.md` để đảm bảo AI sinh mã nguồn tuân thủ 100% phong cách **Swiss Modernism 2.0** và nghiệp vụ sân bay của dự án.

---

## 1. Mẫu Prompt Tạo Trang Mới Trong WebApp Người Dùng

```markdown
Tôi muốn tạo một trang mới trong WebApp tại đường dẫn `frontend/src/pages/[TÊN_TRANG].tsx`.
Yêu cầu bắt buộc:
1. Đọc và tuân thủ tuyệt đối các quy tắc trong @design-rules/DESIGN.md và @design-rules/UI_COMPONENTS.md:
   - Toàn bộ component phải có border-radius: 0px (rounded-none).
   - Tuyệt đối không dùng shadow, blur hay gradient. Bề mặt phẳng (flat 2D), viền hairline 1px `#E5E7EB` hoặc `#000000`.
   - Màu sắc: Nền #F5F5F5 hoặc #FFFFFF, màu chính #000000, điểm nhấn đỏ duy nhất #DC2626.
   - Typography: Font Inter và JetBrains Mono, chỉ mục theo dạng `[ 01 ]`, nhãn in hoa label-caps tracking 0.08em.
2. Bọc toàn bộ nội dung trong component `<PageShell>` có đầy đủ breadcrumbs, title và badge.
3. Nghiệp vụ trang: [MÔ TẢ CHI TIẾT TÍNH NĂNG VÀ CÁC THÀNH PHẦN TRÊN TRANG].
4. Sử dụng TypeScript đầy đủ kiểu dữ liệu từ `frontend/src/types/index.ts`.
```

---

## 2. Mẫu Prompt Tạo Trang Mới Trong Cổng Admin Dispatcher

```markdown
Tôi muốn thêm một trang quản trị mới vào cổng Admin tại `frontend/src/admin/pages/[TÊN_TRANG_ADMIN].tsx` và tích hợp vào `frontend/src/admin/components/Sidebar.tsx` + `frontend/src/admin/App.tsx`.
Yêu cầu bắt buộc:
1. Tuân thủ phong cách Swiss Modernism 2.0 của AeroOps Dispatch System (@design-rules/DESIGN.md):
   - Không bo góc, không đổ bóng.
   - Bảng hiển thị dữ liệu sử dụng component `<Table>` hairline.
   - Các thao tác xem chi tiết / chỉnh sửa sử dụng component `<Drawer>` trượt phẳng.
2. Dữ liệu quản lý gồm: [DANH SÁCH CÁC CỘT DỮ LIỆU CẦN QUẢN LÝ].
3. Có thanh tìm kiếm nhanh, nút thêm mới `+ TẠO MỚI` và các nút hành động `XEM / SỬA / DUYỆT`.
```

---

## 3. Mẫu Prompt Tạo Component Giao Diện Mới

```markdown
Hãy tạo một component mới tại `frontend/src/components/[THƯ_MỤC]/[TênComponent].tsx`.
Tuân thủ nghiêm ngặt design system trong @design-rules/DESIGN.md:
- 0px border-radius trên tất cả thẻ div, button, input, badge.
- Viền hairline: border border-[#E5E7EB] hoặc border-black.
- Icon: Sử dụng font Google Material Symbols Outlined (`<span className="material-symbols-outlined">...</span>`).
- Không có bất kỳ hiệu ứng drop-shadow nào.
- Xuất khẩu component qua `index.ts` tương ứng.
```

---

## 4. Mẫu Prompt Tích Hợp API Backend C# .NET

```markdown
Hãy kết nối component/trang này với API Backend C# (.NET) trong thư mục `AirportManagementSystem`:
1. Định nghĩa endpoint mới trong `frontend/src/utils/apiPaths.ts`.
2. Gọi API thông qua `axiosInstance` trong `frontend/src/utils/axiosInstance.ts` (đã có token interceptor và base URL).
3. Sử dụng hook `useFetch` hoặc custom hook trong `frontend/src/hooks/` để xử lý trạng thái Loading, EmptyState và ErrorState theo chuẩn Swiss 2.0.
4. Đảm bảo types trong `frontend/src/types/` đồng bộ với các Model C# tương ứng.
```

---

## 5. System Prompt Rút Gọn (Dán vào đầu phiên chat với bất kỳ AI nào)

```markdown
Bạn là chuyên gia lập trình Front-end cho dự án "AeroOps Airport Booking & Flight Management System".
Bạn PHẢI TUÂN THỦ NGHIÊM NGẶT các nguyên tắc thiết kế Swiss Modernism 2.0:
- ZERO ROUNDED SILHOUETTES: Tuyệt đối không bo góc (border-radius: 0px / rounded-none ở tất cả mọi nơi).
- ZERO ELEVATION: Không drop shadow (box-shadow: none). Bề mặt phẳng docking 2D, ngăn cách bởi đường viền 1px (#E5E7EB hoặc #000000).
- BẢNG MÀU: Nền #F5F5F5 / #FFFFFF, văn bản chính #000000, màu nhấn đỏ duy nhất #DC2626 cho tương tác quan trọng/cảnh báo.
- TYPOGRAPHY: Font Inter (sans) và JetBrains Mono (mono). Nhãn in hoa label-caps (tracking 0.08em), đánh số kỹ thuật [ 01 ], [ 02 ].
- Mã nguồn viết bằng React + TypeScript + Tailwind CSS sạch sẽ, có xử lý lỗi và kiểu dữ liệu chuẩn mực.
```
