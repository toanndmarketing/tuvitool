# Feature Specification: Tối ưu Form Nhập Liệu & Đồng bộ Ngày Âm Dương

## 1. Overview

Tối ưu hóa trải nghiệm người dùng khi nhập thông tin ngày sinh bằng cách cung cấp giao diện nhập liệu đồng thời (Dual-Input) cho cả Dương lịch và Âm lịch. Loại bỏ việc chuyển đổi qua lại giữa các tab hoặc radio button. Đồng thời tích hợp tính năng lưu trạng thái qua URL (GET parameters) để hỗ trợ việc làm mới trang (F5) mà không mất dữ liệu.

## 2. User Scenarios

| ID | Actor | Action | Value |
|----|-------|--------|-------|
| US-01 | Người dùng | Nhập ngày sinh Dương lịch | Các ô nhập ngày Âm lịch tự động cập nhật giá trị tương ứng ngay lập tức. |
| US-02 | Người dùng | Nhập ngày sinh Âm lịch | Các ô nhập ngày Dương lịch tự động cập nhật giá trị tương ứng ngay lập tức. |
| US-03 | Người dùng | Nhấn nút "Lập Lá Số" | Trang web cập nhật URL với các tham số đã nhập (Query Parameters). |
| US-04 | Người dùng | Nhấn F5 (Refresh) | Trang web tự động đọc tham số từ URL, điền vào form và hiển thị kết quả lá số mà không cần nhập lại. |

## 3. Requirements

### 3.1. Giao diện (UI)

- **Cấu trúc**: Gom nhóm các trường thông tin ngày sinh vào một hàng hoặc khu vực trực quan.
- **Dương lịch**: Gồm Ngày (select), Tháng (select), Năm (input number).
- **Âm lịch**: Gồm Ngày (input number), Tháng (input number), Năm (input number), Tháng nhuận (checkbox).
- **Loại bỏ**: Xóa bỏ bộ chọn `dateType` (radio buttons) và logic ẩn/hiện các group input.
- **Tính gọn gàng**: Sử dụng grid/flexbox để đảm bảo các ô nhập liệu cân đối trên cả desktop và mobile.

### 3.2. Logic đồng bộ (Synchronization)

- **Solar to Lunar**: Khi bất kỳ trường nào trong nhóm Dương lịch thay đổi:
  - Gọi `AmLich.solarToLunar(d, m, y)`.
  - Cập nhật giá trị vào các ô: Ngày Âm, Tháng Âm, Năm Âm, Tháng nhuận.
- **Lunar to Solar**: Khi bất kỳ trường nào trong nhóm Âm lịch thay đổi (bao gồm cả checkbox Nhuận):
  - Gọi `AmLich.lunarToSolarJd(lDay, lMonth, lYear, lLeap)`.
  - Chuyển đổi JD sang ngày Dương bằng `AmLich.jdToDate(jd)`.
  - Cập nhật giá trị vào các ô: Ngày Dương, Tháng Dương, Năm Dương.
- **Validate**: Đảm bảo ngày nhập vào không vượt quá giới hạn hợp lệ của tháng (ví dụ: ngày 31 tháng 4 âm/dương).

### 3.3. Persistence (GET Method)

- **Submission**: Thay đổi logic `tuViForm.addEventListener('submit')`. Thay vì chỉ xử lý nội bộ, thực hiện cập nhật URL bằng cách thay đổi `window.location.search` hoặc sử dụng `URLSearchParams` + `history.pushState`.
- **Initialization**: Khi trang được tải:
  - Kiểm tra `window.location.search`.
  - Nếu có tham số (ví dụ: `?hoTen=...&gioiTinh=...&ngay=...&thang=...&nam=...&gioSinh=...&namXem=...`):
    - Điền dữ liệu vào form.
    - Gọi hàm lập lá số tự động (`generateChart()`).

## 4. Success Criteria

- [ ] Giao diện hiển thị đồng thời cả 2 loại lịch, không bị chồng chéo.
- [ ] Thay đổi Ngày Dương -> Ngày Âm cập nhật chính xác (Kiểm chứng bằng AmLich module).
- [ ] Thay đổi Ngày Âm -> Ngày Dương cập nhật chính xác.
- [ ] URL thay đổi tương ứng với dữ liệu form sau khi nhấn "Lập Lá Số".
- [ ] Reload trang (F5) hiển thị đúng lá số dựa trên URL.
