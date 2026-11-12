# QUY CHUẨN NGHIỆP VỤ HÀNG KHÔNG & SÂN BAY (AIRPORT DOMAIN CONVENTIONS)

Tài liệu này định nghĩa các định dạng dữ liệu, quy ước hàng không quốc tế (IATA/ICAO) và logic nghiệp vụ được áp dụng thống nhất trong toàn bộ hệ thống AeroOps / AeroFlight.

---

## 1. Định Dạng Mã & Ký Hiệu Hàng Không

### 1.1. Mã Sân Bay (Airport Codes)
- Luôn sử dụng mã **IATA 3 ký tự in hoa**:
  - `SGN`: Cảng Hàng không Quốc tế Tân Sơn Nhất (TP. Hồ Chí Minh).
  - `HAN`: Cảng Hàng không Quốc tế Nội Bài (Hà Nội).
  - `DAD`: Cảng Hàng không Quốc tế Đà Nẵng (Đà Nẵng).
  - `PQC`: Cảng Hàng không Quốc tế Phú Quốc (Kiên Giang).
  - `NRT`: Sân bay Quốc tế Narita (Tokyo, Nhật Bản).
  - `JFK`: John F. Kennedy International Airport (New York, Hoa Kỳ).

### 1.2. Số Hiệu Chuyến Bay (Flight Numbers)
- Định dạng: `[Mã Hãng Hàng Không]-[Số Hiệu 3-4 Chữ Số]`.
- Ví dụ:
  - `VN-124`: Chuyến bay Vietnam Airlines.
  - `VJ-326`: Chuyến bay Vietjet Air.
  - `QH-208`: Chuyến bay Bamboo Airways.
  - `JL-752`: Chuyến bay Japan Airlines.

### 1.3. Mã Đặt Chỗ Hàng Không (PNR - Passenger Name Record)
- Định dạng chuẩn AeroOps: `AERO-[4 CHỮ SỐ RANDOM]-[MÃ QUỐC GIA/HÃNG]`.
- Ví dụ: `AERO-8849-VN`, `AERO-9912-VJ`.
- PNR là mã định danh duy nhất cho mỗi giao dịch đặt vé dùng để:
  - Check-in tại quầy Kiosk sân bay.
  - In thẻ lên tàu (Boarding Pass).
  - Tra cứu tình trạng an ninh và hành lý.

---

## 2. Quy Định Phân Loại Hành Khách & Biểu Phí

### 2.1. Phân Loại Hành Khách
1. **Người lớn (Adults - ADT):** Từ đủ 12 tuổi trở lên.
   - Áp dụng 100% giá vé cơ bản.
   - Tiêu chuẩn hành lý xách tay: 10kg - 12kg + 23kg ký gửi.
2. **Trẻ em (Children - CHD):** Từ 2 tuổi đến dưới 12 tuổi.
   - Áp dụng **75% giá vé cơ bản của người lớn**.
   - Có ghế ngồi riêng trên máy bay.
3. **Em bé (Infants - INF):** Dưới 2 tuổi (ngồi cùng người lớn).
   - Áp dụng 10% giá vé hoặc mức phí cố định theo hãng.

### 2.2. Công Thức Tính Tiền Tổng (Total Pricing)
```text
Tổng Tiền = (Giá vé người lớn × Số người lớn) 
          + (Giá vé người lớn × 0.75 × Số trẻ em) 
          - Khuyến mãi Coupon (nếu có)
```
- Thuế sân bay, phí soi chiếu an ninh hàng không và phí dịch vụ hành khách đã được gộp trọn gói (All-Inclusive).

---

## 3. Quy Ước Sơ Đồ Ghế Ngồi (Seat Map Allocations)

- Ghế được ký hiệu theo: `[Số Hàng Ghế][Ký Tự Chữ Cái Cột Ghế]`.
  - Cột `A`, `F`: Ghế sát cửa sổ (Window Seat).
  - Cột `B`, `E`: Ghế ở giữa (Middle Seat).
  - Cột `C`, `D`: Ghế lối đi (Aisle Seat).
- Ví dụ: `12A`, `12B`, `14C`, `15A`.

---

## 4. Hệ Thống Trạng Thái (Flight & Booking Status Lifecycle)

### 4.1. Vòng Đời Đặt Vé (Booking Status)
1. `PENDING`: Hành khách đã chọn chuyến, đang chờ thanh toán qua ZaloPay / Chuyển khoản (giữ chỗ tối đa 15 phút).
2. `CONFIRMED`: Đặt chỗ đã được ghi nhận trên hệ thống nhưng đang đợi xác minh ngân hàng.
3. `PAID`: Đã thanh toán thành công, hệ thống tự động xuất mã PNR và E-ticket.
4. `COMPLETED`: Chuyến bay đã hoàn tất, hành khách đã hạ cánh an toàn.
5. `CANCELLED`: Vé đã bị hủy (do hành khách yêu cầu hoặc quá thời gian giữ chỗ).

### 4.2. Trạng Thái Vận Hành Chuyến Bay (Flight Status)
1. `ON_TIME`: Chuyến bay vận hành đúng lịch trình.
2. `BOARDING`: Đang mở cửa đón khách lên tàu bay tại cửa ra máy bay (Gate).
3. `DELAYED`: Chậm chuyến vì lý do thời tiết hoặc kỹ thuật điều phối.
4. `CANCELLED`: Hủy chuyến khẩn cấp.
