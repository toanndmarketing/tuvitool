# Technical Plan: Tối ưu Form & Đồng bộ Ngày Âm Dương

## 1. Mục tiêu

- **Giao diện**: Đồng thời hiển thị cả 2 loại lịch Solar/Lunar trên form.
- **Tính năng**: Đồng bộ hóa dữ liệu 2 chiều giữa 2 loại lịch.
- **Persistence**: Lưu thông tin form lên URL (Query Params) để hỗ trợ F5.

## 2. Các thay đổi dự kiến (Implementation Details)

### 2.1. index.html

- Loại bỏ `<div class="form-group date-type-group">` (Chế độ chọn radio).
- Hợp nhất `solarInputGroup` và `lunarInputGroup` thành một cấu trúc duy nhất:
  - Sử dụng `display: grid` hoặc `flex` để phân chia 2 cột/vùng: "Dương Lịch" và "Âm Lịch".
  - Các ô nhập Ngày/Tháng/Năm Dương lịch.
  - Các ô nhập Ngày/Tháng/Năm/Nhuận Âm lịch.
- Giữ nguyên tất cả các `id` cũ (`solarDay`, `lDay`, ...) để tránh crash code logic ở những file khác.

### 2.2. app.js

- **Synchronization Logic**:
  - Xóa bỏ logic `dateTypeRadios` toggle hidden/grid.
  - Tạo hàm `syncSolarToLunar()`: Đọc `solarDay`, `solarMonth`, `solarYear` -> gọi `AmLich.solarToLunar` -> Gán lại value cho `lDay`, `lMonth`, `lYear`, `lLeap`.
  - Tạo hàm `syncLunarToSolar()`: Đọc `lDay`, `lMonth`, `lYear`, `lLeap` -> gọi `AmLich.lunarToSolarJd` -> `AmLich.jdToDate` -> Gán lại value cho `solarDay`, `solarMonth`, `solarYear`.
  - Đăng ký listener `change` và `input` cho toàn bộ các trường liên quan.
- **Persistence Logic**:
  - Tạo hàm `fillFormFromUrl()`:
    - Sử dụng `new URLSearchParams(window.location.search)`.
    - Điền dữ liệu vào form: `hoTen`, `gioiTinh`, `ngay`, `thang`, `nam`, `gioSinh`, `namXem`.
    - Nếu có dữ liệu hợp lệ, tự động gọi `generateChart()`.
  - Sửa đổi hàm `generateChart()` (hoặc `submit` event):
    - Trước khi tính toán, cập nhật URL bằng `history.pushState` tương ứng với các giá trị hiện tại trên form.

## 3. Rủi ro & Giải pháp (Risks & Mitigation)

- **Vòng lặp vô tận (Infinite Loop)**: Khi Solar đổi cập nhật Lunar, Lunar đổi lại cập nhật Solar.
  - *Giải pháp*: Sử dụng một cờ (flag) `isSyncing = false` hoặc chỉ kích hoạt sync khi người dùng tương tác trực tiếp (event listener trên client).
- **Ngày không hợp lệ**: Âm lịch có tháng nhuận, hoặc ngày 30, 29 khác nhau giữa các tháng.
  - *Giải pháp*: Khi chuyển đổi, module `AmLich` đã xử lý JD chuẩn. Cần cập nhật lại giá trị các trường input một cách an toàn.

## 4. Tasks Hierarchy

1. Modify `index.html` structure. (15 min)
2. Implement synchronization logic in `app.js`. (15 min)
3. Implement URL Persistence (GET param) logic in `app.js`. (15 min)
4. Integration test: Validate form sync and F5 persistence. (5 min)
