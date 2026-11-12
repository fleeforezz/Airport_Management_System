---
name: Swiss Modernism 2.0
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#bb0112'
  on-secondary: '#ffffff'
  secondary-container: '#e02928'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb4ab'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#93000b'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  swiss-black: '#000000'
  swiss-charcoal: '#111111'
  swiss-muted: '#4B5563'
  swiss-subtle: '#9CA3AF'
  swiss-border: '#E5E7EB'
  swiss-borderDark: '#1F2937'
  swiss-bg: '#F5F5F5'
  swiss-white: '#FFFFFF'
  swiss-red: '#DC2626'
  swiss-redHover: '#B91C1C'
  swiss-redSubtle: '#FEF2F2'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: '800'
    lineHeight: 76px
    letterSpacing: -0.04em
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
  mono-index:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

# HỆ THỐNG THIẾT KẾ: SWISS MODERNISM 2.0 (AEROSPACE & AIRPORT OPS)

Tài liệu này là đặc tả chuẩn mực giao diện kỹ thuật số cho toàn bộ dự án **Hệ thống Quản lý và Đặt chỗ Hàng không / Sân bay (Airport Management & Booking System)**.
Hệ thống kế thừa phong cách *International Typographic Style* của Thụy Sĩ giữa thế kỷ 20, tập trung vào sự khách quan, chính xác tuyệt đối, kỷ luật hình học và triệt tiêu trang trí thừa.

---

## 1. Triết Lý Thiết Kế Cốt Lõi (Core Philosophy)

1. **Nội dung là kiến trúc (Content as Architecture):**
   - Khung sườn cấu trúc rõ ràng, minh bạch, được định hướng bởi kỷ luật toán học và lưới module nghiêm ngặt.
2. **Hình học trực giao (Strict Orthogonal Geometry):**
   - **Tuyệt đối không bo góc (0px radius xuyên suốt toàn bộ hệ thống).**
   - Không bo tròn capsule, không pill buttons, không circular badges. Mọi góc cạnh đều là góc vuông 90 độ.
3. **Mặt phẳng 2 chiều tuyệt đối (Zero Elevation & Flat Surfaces):**
   - Không drop-shadow (đổ bóng), không blur khí quyển, không hiệu ứng layer 3D giả lập.
   - Các bề mặt docking phẳng với nhau, phân định ranh giới bằng đường hairline 1px (`#E5E7EB` hoặc `#000000`).
4. **Nhịp điệu và Khoảng trắng chủ động (Purposeful Whitespace):**
   - Khoảng trắng được coi là một thành phần bố cục mang sức nặng thị giác, giúp kiểm soát mật độ thông tin cao.

---

## 2. Hệ Thống Màu Sắc (Color Palette)

Hệ màu tương phản cao, mang tính chất đo đạc và định danh kỹ thuật:

| Tên Màu | Mã HEX | Vai Trò & Ứng Dụng |
| :--- | :--- | :--- |
| **Pure White** | `#FFFFFF` | Nền thẻ (cards), modal, drawer, background chính của nội dung văn bản. |
| **Crisp Light Gray** | `#F5F5F5` / `#F9F9F9` | Nền canvas tổng thể của trang, cell xen kẽ trong bảng, input background. |
| **Solid Core Black** | `#000000` | Typography chính, viền active/focus, primary buttons, thẻ số chỉ mục `[ 01 ]`. |
| **Swiss Red (Accent)** | `#DC2626` | **Điểm nhấn duy nhất trong toàn hệ thống.** Dùng có kiểm soát cho: nút khẩn cấp, cảnh báo chậm chuyến, CTA thanh toán, icon chỉ mục live. |
| **Hairline Dividers** | `#E5E7EB` | Đường kẻ phân tách ô dữ liệu, đường lưới 1px phân chia layout. |
| **Subordinate Text** | `#4B5563` | Màu chữ phụ: mô tả, tọa độ GPS, nhãn chỉ mục, telemetry. |
| **Subtle Label** | `#9CA3AF` | Timestamp, chữ mờ, watermark frame index. |
| **Operational Green** | `#22C55E` | Chỉ báo trạng thái hệ thống: `SYS: ONLINE`, `ĐÃ THANH TOÁN`, `ĐÚNG GIỜ`. |

---

## 3. Hệ Thống Typography & Font Chữ

- **Font Sans chính:** `Inter`, `"Helvetica Neue"`, `Helvetica`, `Arial`, `sans-serif`.
- **Font Mono kỹ thuật:** `"JetBrains Mono"`, `ui-monospace`, `Menlo`, `monospace`.
- **Tập số Tabular:** Sử dụng `font-feature-settings: 'tnum'` để các cột số căn thẳng hàng tuyệt đối.

### Thang Phân Cấp Kiểu Chữ (Type Scale)
- **Display Hero:** 72px / line-height 76px / letter-spacing -0.04em / weight 800 (In hoa, flush-left).
- **Headline Lg:** 48px / line-height 52px / letter-spacing -0.03em / weight 700.
- **Headline Md:** 32px / line-height 38px / letter-spacing -0.02em / weight 600.
- **Headline Sm:** 24px / line-height 30px / letter-spacing -0.01em / weight 600.
- **Title Md:** 18px / line-height 24px / letter-spacing -0.01em / weight 600.
- **Body Lg / Md:** 16px & 14px / line-height 20-24px / weight 400.
- **Label Caps:** 10-11px / line-height 14px / letter-spacing 0.08em / font-weight 700 / in hoa toàn bộ.
- **Mono Index:** 10-12px / JetBrains Mono / weight 500-700 / letter-spacing 0.02-0.12em (ví dụ: `[ 01 ]`, `SYS / KJFK-V2.0`).

---

## 4. Quy Chuẩn Thành Phần (Component Anatomy)

### 4.1. Nút Bấm (Buttons)
- **Primary:** Background `#000000`, chữ `#FFFFFF`, viền 1px solid `#000000`, radius `0px`. Hover đổi sang `#DC2626` (Swiss Red).
- **Secondary / Outline:** Background `#FFFFFF`, chữ `#000000`, viền 1px solid `#000000`, radius `0px`. Hover đổi màu nghịch đảo (Invert) thành nền đen chữ trắng.
- **Critical / Accent:** Background `#DC2626`, chữ `#FFFFFF`, viền 1px solid `#DC2626`. Hover đổi sang `#000000`.
- **Text / Index Action:** Căn lề trái flush-left, có ký tự mũi tên điều hướng (`→`).

### 4.2. Ô Nhập Liệu (Input Fields)
- Khung chữ nhật phẳng (`0px radius`), viền 1px solid `#E5E7EB`.
- Nền: `#FFFFFF` hoặc `#F5F5F5`.
- Focus / Active: Viền chuyển sang 1px solid `#000000` (Không có outer glow, không box-shadow).
- Nhãn: Luôn đặt phía trên input bằng kiểu chữ `label-caps` in hoa (`#4B5563`).

### 4.3. Bảng Dữ Liệu (Data Tables)
- Phân cách giữa các dòng bằng hairline rule 1px `#E5E7EB`.
- Header nền `#F5F5F5`, chữ in hoa theo phong cách telemetry.
- Cột đầu tiên luôn là chỉ số thứ tự hoặc mã PNR/Flight căn trái flush-left.

### 4.4. Huy Hiệu Trạng Thái (Status Chips & Badges)
- Khung chữ nhật sắc nét, `0px radius`, viền 1px solid `#E5E7EB`, nền `#F5F5F5`.
- Chứa một **khối vuông solid kích thước 6px × 6px** để hiển thị trạng thái màu:
  - Xanh lục (`#22C55E`): Đã thanh toán / Đúng giờ / Hoạt động.
  - Vàng cam (`#F59E0B`): Chờ xử lý / Đang lên tàu.
  - Đỏ Thụy Sĩ (`#DC2626`): Đã hủy / Chậm chuyến / Khẩn cấp.
  - Đen (`#000000`): Hoàn tất / Mặc định.

### 4.5. Ngăn Kéo & Hộp Thoại (Drawers & Modals)
- Bề mặt phẳng, docking trực tiếp lên layer raster trên cùng.
- Viền cứng 2px solid `#000000` hoặc 1px hairline.
- Background backdrop mờ: `bg-black/50` hoặc `bg-black/60` không kèm blur nhằm duy trì độ sắc nét của đồ họa.
