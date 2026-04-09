---
name: "speckit.domain.ziwei.patterns"
description: "Thuật toán quét Hội Chiếu & Nhận diện Cách Cục (Tam Phương Tứ Chính)."
---

# speckit.domain.ziwei.patterns — Pattern Recognition & Associations

Kỹ năng này chịu trách nhiệm xây dựng cấu trúc Data Graph để truy xuất các mối quan hệ (Tam Hợp, Sung Chiếu) và thuật toán "Quét" (Scanner) nhận diện các Cách cục kinh điển trong Tử Vi. Đây là bước chuẩn bị Data quan trọng nhất để nạp vào LLM luận án.

## 1. THUẬT TOÁN "TAM PHƯƠNG TỨ CHÍNH" (THE ASTROLOGICAL TRIAD & OPPOSITE)
Mọi luận giải của mỗi cung không bao giờ đứng độc lập mà phụ thuộc vào "Tam phương Tứ chính".
- **Tam Hợp (Triad):** Tạo thành góc tam giác với cung hiện tại (Khoảng cách ±4 index).
  Ví dụ: Mệnh ở `Tý` (Index 0). Tam hợp sẽ là `Thìn` (Index 4) và `Thân` (Index 8).
- **Xung Chiếu (Opposite):** Cung đối diện trực tiếp (Khoảng cách ±6 index).
  Ví dụ: `Tý` (0) đối `Ngọ` (6).
- **Nhị Hợp & Lục Hại:** Các mối quan hệ bổ trợ (Lấy trục dọc/ngang đối xứng).

> **AI Coding Rule:** Khi viết hàm truy xuất thông tin 1 cung, AI phải viết hàm `getAssociatedPalaces(palaceIndex)` trả về danh sách 4 cung: [Bản cung, Tam hợp 1, Tam hợp 2, Xung chiếu]. Từ đó lấy gộp tổng các sao ở 4 cung này lại (Total Stars).

## 2. NHẬN DIỆN CÁCH CỤC (PATTERN SCANNER)
Để LLM luận được chính xác, hệ thống code trước đó nên "đọc" được sơ bộ các Cách Cục hiển nhiên rồi sinh ra Tags (ví dụ: `tags: ["SatPhaTham", "TuPhuVuTuong"]`).

Cấu trúc logic để viết Pattern Scanner Function:
### 2.1 Nhóm Cách Cục Đặc Trưng (Bộ 3)
1. **Sát - Phá - Tham:** Kiểm tra xem Mệnh, Tài, Quan có chứa bộ 3 sao (Thất Sát, Phá Quân, Tham Lang) hay không. (Ba sao này luôn nằm trong tam hợp của nhau).
2. **Tử - Phủ - Vũ - Tướng:** Kiểm tra Mệnh, Tài, Quan có chứa (Tử Vi, Thiên Phủ, Vũ Khúc, Thiên Tướng).
3. **Cơ - Nguyệt - Đồng - Lương:** Tam hợp có (Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương).
4. **Cự - Nhật:** Mệnh có Cự Môn hoặc Thái Dương đồng cung hoặc chiếu.

### 2.2 Nhóm Cát Tinh / Hung Tinh Hội Chiếu
- **Lục Cát Tinh:** Tả-Hữu, Xương-Khúc, Khôi-Việt. Nếu hội chiếu đủ tại Mệnh -> Gắn tag `QuyNhân` (Quý Nhân).
- **Lục Sát Tinh:** Kình-Đà, Không-Kiếp, Hỏa-Linh. Nếu hội chiếu trên 3 sao tại Mệnh -> Gắn tag `SatTinhXungPho`.

## 3. CHỈ THỊ (ACTION RULES)
Khi nhận yêu cầu: *"Viết hàm tạo dữ liệu để mớm cho AI luận giải"*
- **Agent Hành động:** Không bao giờ nạp toàn bộ mảng thô 12 cung vào Prompt. Phải chạy qua vòng `PatternScanner`, gom nhóm các sao tại Tam Phương Tứ Chính của các cung cường (Mệnh, Quan, Tài, Phu/Thê, Phúc), sau đó nạp đoạn JSON cô đọng vào Prompt.
- **Nghiêm cấm:** Trả về dữ liệu không có tính chất Hội Chiếu. Code phải là: `Mệnh Cung = (Chính tinh Cung Mệnh + Các sao từ Xung chiếu + Các sao từ Tam hợp)`.
