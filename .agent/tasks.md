# Task Breakdown: Tối ưu Form & Đồng bộ Ngày Âm Dương

## 🟢 Task Group 1: UI Reconstruction (HTML/CSS)

- [ ] **Task 1.1**: Xóa bỏ bộ chọn `dateType` (radio buttons) trong `index.html` (L70-L80).
- [ ] **Task 1.2**: Gom nhóm `solarInputGroup` và `lunarInputGroup` vào một khung hiển thị chung. Đặt ID mới là `dateInputGroup`.
- [ ] **Task 1.3**: Thêm các nhãn (labels) hoặc biểu tượng để phân biệt 2 bên Dương lịch / Âm lịch trực quan.

## 🟡 Task Group 2: Synchronization Logic (JS)

- [ ] **Task 2.1**: Trong `app.js`, định nghĩa hàm `syncSolarToLunar()` dựa trên các `solarDay`, `solarMonth`, `solarYear`.
- [ ] **Task 2.2**: Định nghĩa hàm `syncLunarToSolar()` dựa trên các `lDay`, `lMonth`, `lYear`, `lLeap`.
- [ ] **Task 2.3**: Gắn listener `change` và `input` cho các ô Solar -> gọi `syncSolarToLunar()`.
- [ ] **Task 2.4**: Gắn listener `change` và `input` cho các ô Lunar -> gọi `syncLunarToSolar()`.
- [ ] **Task 2.5**: Xóa bỏ `dateTypeRadios.forEach(...)` (L107-L117).

## 🔵 Task Group 3: URL Persistence (GET Parameter)

- [ ] **Task 3.1**: Hàm `loadStateFromUrl()`: Đọc `window.location.search`, gán value cho tất cả các trường form.
- [ ] **Task 3.2**: Hàm `updateUrlFromForm()`: Sử dụng `history.pushState` để lưu các trường `hoTen`, `gioiTinh`, `gioSinh`, `namXem`, `ngay`, `thang`, `nam`.
- [ ] **Task 3.3**: Cập nhật hàm `tuViForm.submit` listener để gọi `updateUrlFromForm()`.
- [ ] **Task 3.4**: Trong `DOMContentLoaded`, gọi `loadStateFromUrl()` và nếu thành công, tự động gọi `generateChart()`.

## 🛡️ Task Group 4: Verification & Bug Fix

- [ ] **Task 4.1**: Kiểm tra đồng bộ khi nhập ngày nhuận.
- [ ] **Task 4.2**: Kiểm tra F5 trang web sau khi nhấn nút "Lập Lá Số".
- [ ] **Task 4.3**: Review mobile layout (styles.css nếu cần).
