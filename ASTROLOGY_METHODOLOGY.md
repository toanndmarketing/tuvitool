# 🌌 Hệ Thống Luận Giải Tử Vi & Trường Phái (Astrology Methodology)

## 1. Tổng Quan Hệ Thống (System Architecture)

Ứng dụng sử dụng mô hình **Hybrid AI-Logic Engine**, kết hợp giữa tính toán chính xác của máy tính và khả năng biện luận linh hoạt của AI:

* **Logic Engine (Bản chất):** Sử dụng các thuật toán chuẩn (Hồ Ngọc Đức) để chuyển đổi lịch Âm Dương và an sao.
* **AI Interpretation (Trí tuệ):** Đóng vai chuyên gia Tử Vi (Gemini AI) thông qua bộ Instruction Deep-Prompt (v9) với Profile 30 năm kinh nghiệm.
* **Knowledge Base:** Hệ thống cơ sở dữ liệu SQLite (`tuvi.db`) lưu trữ ý nghĩa gốc của các sao làm tham chiếu (Reference Baseline) để AI không bị "ảo giác".

## 2. Trường Phái Tử Vi (School of Astrology)

Dự án được xây dựng dựa trên sự kết hợp tinh hoa của các trường phái Tử Vi chính:

### A. Nam Phái (Dòng Truyền Thống - Tam Hợp Phái)

* **Cơ sở:** Sử dụng nền tảng an sao cổ điển với đầy đủ 14 chính tinh và hệ thống phụ tinh phong phú.
* **Xác lập:** Tính toán độ Miếu/Hãm của sao tại từng cung để đánh giá sức mạnh nội tại.
* **Bố cục:** Phân tích sự tương tác trong 4 bộ Tam Hợp (Dần Ngọ Tuất, Thân Tý Thìn, Tỵ Dậu Sửu, Hợi Mão Mùi).

### B. Bắc Phái (Tứ Hóa Phái - Flying Star)

* **Trọng tâm:** Đặc biệt nhấn mạnh vào **Tứ Hóa (Lộc, Quyền, Khoa, Kỵ)**.
* **Cơ chế:** Áp dụng logic **"Tứ Hóa Xuyên Cung"**. AI được lập trình để soi kỹ cung chứa Hóa Kỵ (gây trở ngại) và Hóa Lộc (gây hanh thông).
* **Vận hạn:** Phân tích Đại vận và Tiểu vận dựa trên sự "kích động" của các sao Tứ Hóa qua từng năm.

### C. Khâm Thiên Môn (Kỹ Thuật Chuyển Cung)

* **Kỹ thuật:** Áp dụng **Biến Cung (Palace Rotation)** để soi các mối quan hệ phức tạp.
* **Ứng dụng:**
  * Hỗ trợ soi thái độ của "Bố mẹ vợ/chồng" từ cung Phu Thê.
  * Soi vận hạn của anh em/con cái thông qua cung gốc.

### D. Phương Pháp Tiếp Cận Hiện Đại (Modern Approach)

* **Phong cách:** Luận giải thực chiến, bình dân, lược bỏ 90% từ Hán Việt khó hiểu.
* **Mục tiêu:** Đưa ra lời khuyên hành động (Lộ trình cải vận) thực tế thay vì chỉ những nhận định định mệnh mơ hồ.

## 3. Quy Trình Phân Tích Logic

1. **Lấy dữ liệu:** Trích xuất Can Chi, Ngũ Hành, Vị trí 12 cung và các sao từ engine tính toán.
2. **Xác định Cách cục:** Nhận diện các bộ sao lớn (ví dụ: Tử Phủ Vũ Tướng, Sát Phá Tham, Cơ Nguyệt Đồng Lương).
3. **Soi Tứ Hóa & Logic Chuyển Cung:** AI tự động thực hiện phép "xoay" lá số để tìm các góc khuất (mẹ chồng, bố vợ, phúc đức dòng họ).
4. **Biện luận AI:** Gemini AI tổng hợp tất cả dữ kiện dựa trên Prompt chuyên gia để xuất ra báo cáo hoàn chỉnh.

## 4. Độ Tin Cậy & Kiểm Định

* **Tính chính xác:** Codebase đã được Audit nghiêm ngặt về hướng an 12 cung (Ngược chiều kim đồng hồ) - Xem `BAO_CAO_KIEM_TRA_TU_VI.md`.
* **Kiểm thử:** Đã test thực tế với các tập dữ liệu chuẩn (Nguyễn Đức Toàn) để đảm bảo kết quả trùng khớp với các chuyên gia Tử Vi hàng đầu.

---
*Cập nhật bởi: Antigravity AI Agent*
*Ngày: 02/03/2026*
