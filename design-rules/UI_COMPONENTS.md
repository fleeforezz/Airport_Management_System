# HƯỚNG DẪN THI CÔNG COMPONENT: SWISS MODERNISM 2.0

Tài liệu này cung cấp các đoạn code mẫu (React + Tailwind CSS) và các quy chuẩn chi tiết khi triển khai hoặc yêu cầu AI tạo mới bất kỳ thành phần UI nào trong dự án.

---

## 1. Bảng Quy Tắc Bắt Buộc (DOs & DON'Ts)

| Quy Tắc | ĐƯỢC PHÉP (DO) | TUYỆT ĐỐI CẤM (DON'T) |
| :--- | :--- | :--- |
| **Bo góc (Border Radius)** | `rounded-none`, `border-radius: 0px` | `rounded-lg`, `rounded-full`, `rounded-md`, `rounded-pill` |
| **Độ sâu (Elevation)** | Phẳng hoàn toàn, viền 1px `#E5E7EB` hoặc `#000000` | `shadow-sm`, `shadow-lg`, `shadow-xl`, `box-shadow` |
| **Màu nhấn (Accent)** | Dùng `#DC2626` (Swiss Red) có kiểm soát cho CTA/Alert | Tô màu cầu vồng, gradient nhiều màu, pastel rực rỡ |
| **Font chữ** | `font-sans` (Inter) và `font-mono` (JetBrains Mono) | Comic Sans, Serif hoa mỹ, font viết tay |
| **Chỉ mục (Indexing)** | Dùng định dạng `[ 01 ]`, `SYS / KJFK-V2.0`, `01 / OVERVIEW` | Đánh số kiểu tròn, badge tròn chấm bi |
| **Chỉ báo trạng thái** | Khối vuông nhỏ 6px × 6px (`w-1.5 h-1.5 inline-block`) | Chấm tròn xoay tròn kiểu iOS, capsule mềm mại |

---

## 2. Mã Nguồn Mẫu Chuẩn Cho Từng Component

### 2.1. Nút Bấm (Buttons)

```tsx
// 1. Primary Action Button
<button className="px-4 py-2 bg-black hover:bg-[#DC2626] text-white font-mono text-xs font-bold uppercase tracking-wider transition-none border border-black flex items-center gap-2">
  <span>TIẾP TỤC ĐẶT CHỖ</span>
  <span>→</span>
</button>

// 2. Secondary / Outline Button
<button className="px-4 py-2 bg-white hover:bg-black hover:text-white text-black font-mono text-xs font-bold uppercase tracking-wider transition-none border border-black">
  HỦY BỎ
</button>

// 3. Critical / Emergency Button
<button className="px-3 py-1.5 bg-white border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white font-mono text-[10px] font-bold uppercase tracking-wider transition-none flex items-center gap-1.5">
  <span className="material-symbols-outlined text-[14px]">warning</span>
  <span>CẢNH BÁO KHẨN CẤP</span>
</button>
```

---

### 2.2. Ô Nhập Liệu & Bộ Chọn (Inputs & Selects)

```tsx
// Input Text với nhãn Label-Caps
<div>
  <label className="block font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">
    SỐ HIỆU CHUYẾN BAY (VD: VN-124) *
  </label>
  <input
    type="text"
    placeholder="Nhập mã chuyến bay..."
    className="w-full h-10 px-3 bg-[#F5F5F5] border border-[#E5E7EB] focus:border-black font-mono text-xs text-black placeholder-[#9CA3AF] focus:outline-none"
  />
</div>

// Select Box Chuẩn Thụy Sĩ
<select className="w-full h-10 px-3 bg-white border border-[#E5E7EB] focus:border-black font-mono text-xs text-black focus:outline-none">
  <option value="SGN">TP. Hồ Chí Minh (SGN)</option>
  <option value="HAN">Hà Nội (HAN)</option>
  <option value="DAD">Đà Nẵng (DAD)</option>
</select>
```

---

### 2.3. Thẻ Trạng Thái (Status Badges)

```tsx
// Status Badge với chỉ báo vuông 6px (Square Indicator)
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#F5F5F5] border border-[#E5E7EB] text-black font-mono text-[10px] font-bold uppercase tracking-wider select-none">
  {/* Đổi màu: bg-[#22C55E] (xanh), bg-[#DC2626] (đỏ), bg-[#F59E0B] (vàng) */}
  <span className="w-1.5 h-1.5 bg-[#22C55E] inline-block flex-shrink-0" />
  <span>ĐÃ THANH TOÁN</span>
</span>
```

---

### 2.4. Bảng Dữ Liệu Hairline (Data Table)

```tsx
<div className="w-full overflow-x-auto bg-white border border-[#E5E7EB] select-none">
  <table className="w-full text-left border-collapse font-sans text-xs">
    <thead>
      <tr className="bg-[#F5F5F5] border-b border-[#E5E7EB]">
        <th className="py-2.5 px-3 font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">
          MÃ PNR
        </th>
        <th className="py-2.5 px-3 font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">
          HÀNH KHÁCH
        </th>
        <th className="py-2.5 px-3 font-mono text-[10px] font-bold text-[#4B5563] uppercase tracking-wider text-right">
          TỔNG TIỀN
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-[#E5E7EB]">
      <tr className="hover:bg-[#F9F9F9] transition-none text-black">
        <td className="py-2.5 px-3 font-mono font-bold">AERO-8849-VN</td>
        <td className="py-2.5 px-3">Alex Morgan</td>
        <td className="py-2.5 px-3 font-mono font-bold text-right">13.700.000 ₫</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

### 2.5. Hộp Thoại & Ngăn Kéo (Modals & Drawers)

```tsx
// Cấu trúc chuẩn của một Drawer phẳng
<div className="fixed inset-0 z-50 flex justify-end bg-black/50 select-none">
  <div className="w-full max-w-xl bg-white border-l-2 border-black h-full flex flex-col justify-between shadow-none">
    {/* Header */}
    <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F5F5F5]">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-[#DC2626]" />
        <h2 className="font-mono text-sm font-black uppercase text-black">
          CHI TIẾT VÉ HÀNG KHÔNG
        </h2>
      </div>
      <button className="w-8 h-8 border border-[#E5E7EB] bg-white flex items-center justify-center font-mono text-sm">
        ✕
      </button>
    </div>

    {/* Content */}
    <div className="p-6 overflow-y-auto flex-1 space-y-4 font-mono text-xs">
      {/* Các nội dung hiển thị */}
    </div>

    {/* Footer */}
    <div className="p-4 border-t border-[#E5E7EB] bg-[#F5F5F5] flex justify-between">
      <button className="px-3 py-1.5 border border-[#E5E7EB] font-mono text-xs uppercase">
        ĐÓNG
      </button>
      <button className="px-4 py-2 bg-black text-white font-mono text-xs font-bold uppercase">
        LƯU THAY ĐỔI
      </button>
    </div>
  </div>
</div>
```
