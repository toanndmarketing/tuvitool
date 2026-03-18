# 🔮 Workflow: Luận Giải Tử Vi Chuyên Sâu

Workflow này thực hiện quy trình lập lá số và luận giải chi tiết thông qua công cụ CLI (ưu tiên) hoặc Giao diện Web.

## 📋 Thông tin cần thiết
- **Họ tên**: Tên đầy đủ của đương số.
- **Ngày sinh**: Ngày/Tháng/Năm (Dương lịch).
- **Giờ sinh**: Chỉ số giờ (0: Tý, 1: Sửu, ..., 6: Ngọ, ...).
- **Giới tính**: nam hoặc nu.
- **Năm xem**: Năm muốn xem vận hạn (mặc định là 2026).

## 🚀 Các bước thực hiện

### Bước 0: Xác thực thông tin (Quan trọng nhất)
Trước khi chạy lệnh, AI Agent **BẮT BUỘC** phải kiểm tra tính đầy đủ và rõ ràng của thông tin:
- Nếu thiếu bất kỳ thông tin nào trong danh sách trên (Họ tên, Ngày, Tháng, Năm, Giờ, Giới tính).
- Nếu thông tin mâu thuẫn (Ví dụ: 30/02) hoặc không rõ ràng (Ví dụ: "sinh buổi chiều" mà không rõ giờ cụ thể).
- **Hành động**: Dừng lại và sử dụng `notify_user` để hỏi lại anh Toàn cho rõ ràng, KHÔNG tự ý giả định.

### Bước 1: Chạy lệnh CLI để lấy Raw Data
AI Agent sử dụng lệnh sau để lấy toàn bộ dữ liệu lá số (bao gồm cả block JSON cuối cùng):

```powershell
docker compose exec tuvi-app node server/tuvi-cli.js "Họ Tên" "nam/nu" ngày tháng năm giờ_index 2026
```

### Bước 2: AI Phân Tích & Luận Giải (AI-First)
1. **Đọc Dữ Liệu**: AI **BẮT BUỘC** phải đọc block JSON `## 🤖 RAW DATA FOR AI`. Đây là nguồn tin cẩn trọng nhất, chứa đủ 12 cung và các trạng thái Hóa (Lộc, Quyền, Khoa, Kỵ).
2. **Luận Giải Toàn Diện**: AI phải phân tích **ĐẦY ĐỦ 12 CUNG** (không được bỏ sót hoặc làm sơ sài).
   - Phân tích Chính tinh & Phụ tinh cho từng cung.
   - Tìm kiếm các tổ hợp sao đặc biệt (Sát tinh, Hóa tinh, các bộ sao đặc thù như *Hỏa Tham*, *Lương Lộc*, *Liêm Kỵ*...).
3. **Bổ Sung Thông Tin Đặc Thù**:
   - **Đặc điểm nhận dạng**: Dựa vào chính tinh tại Mệnh để mô tả ngoại hình/phong thái.
   - **Tổng quan Ưu/Nhược**: Tóm tắt các điểm mạnh/yếu nổi bật nhất của lá số.
   - **Kiểm chứng Vận hạn năm cũ**: Phân tích ngắn gọn năm trước đó (ví dụ năm 2025 nếu đang xem năm 2026) để người dùng kiểm tra tính ứng nghiệm.
4. **Phân Tích Thân Cung**: Xác định vị trí cung Thân và tầm ảnh hưởng của nó sau tuổi 30.

### Bước 3: Xuất kết quả (Premium Report)
AI trình bày bản luận giải vào file `walkthrough.md` theo các tiêu chuẩn:
- **Ngôn ngữ**: Chuyên nghiệp, sâu sắc, mang tính chất tư vấn (như một CTO & BA Expert).
- **Cấu trúc**: Phân tách rõ ràng các phần (Nhận diện, Ưu/Nhược, 12 Cung, Vận hạn).
- **Trực quan**: Sử dụng Emoji và cấu trúc Markdown (Bảng, Bold, Header) để tăng khả năng scannable.
