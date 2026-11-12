# THƯ MỤC QUY TẮC THIẾT KẾ (DESIGN RULES CATALOG)

Thư mục này chứa toàn bộ các tài liệu đặc tả, hướng dẫn thi công và bộ template prompt chuẩn dành cho dự án **Hệ thống Quản lý và Đặt chỗ Sân bay (AeroOps / AeroFlight)**.

---

## 📁 Danh Mục Tài Liệu

| Tên Tệp Tin | Mục Đích Sử Dụng | Cách Prompt Tham Chiếu |
| :--- | :--- | :--- |
| 📘 [`DESIGN.md`](./DESIGN.md) | **Đặc tả thiết kế cốt lõi Swiss Modernism 2.0**: Bảng màu, typography, tỉ lệ không gian, quy chuẩn 0px radius và triết lý kiến trúc trực giao. | `@design-rules/DESIGN.md` |
| 🧩 [`UI_COMPONENTS.md`](./UI_COMPONENTS.md) | **Hướng dẫn thi công component**: Bảng DOs & DON'Ts, code mẫu React + Tailwind cho Button, Input, Table, Drawer, Badge... | `@design-rules/UI_COMPONENTS.md` |
| ✈️ [`AIRPORT_DOMAIN_RULES.md`](./AIRPORT_DOMAIN_RULES.md) | **Quy chuẩn nghiệp vụ hàng không**: Mã sân bay IATA (SGN, DAD, NRT, JFK), cấu trúc mã PNR, định dạng số hiệu chuyến bay, logic tính giá vé. | `@design-rules/AIRPORT_DOMAIN_RULES.md` |
| 💬 [`PROMPT_TEMPLATES.md`](./PROMPT_TEMPLATES.md) | **Mẫu câu lệnh prompt**: Các prompt mẫu sẵn sàng copy để giao việc cho AI tạo trang mới, thêm component, hoặc kết nối backend. | `@design-rules/PROMPT_TEMPLATES.md` |

---

## 🚀 Cách Sử Dụng Nhanh Khi Prompt Cho AI

Khi bạn muốn yêu cầu AI tạo một tính năng hoặc một giao diện mới:
1. Gõ `@design-rules/` trong khung chat để đính kèm tài liệu mong muốn (hoặc copy mẫu prompt tương ứng trong [`PROMPT_TEMPLATES.md`](./PROMPT_TEMPLATES.md)).
2. Nhắc AI kiểm tra các điều kiện tiên quyết:
   - `0px border-radius` xuyên suốt (`rounded-none`).
   - Không đổ bóng `box-shadow: none`.
   - Viền hairline 1px `#E5E7EB`.
   - Màu nhấn đỏ duy nhất `#DC2626`.
   - Kiểu chữ `Inter` & `JetBrains Mono`.
