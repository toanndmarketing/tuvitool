# 💼 Business Logic — tu-vi-la-so (V2 - Next.js Monorepo)

## Mô tả nền tảng
Là Nền tảng Huyền Học Việt Nam tích hợp Trí tuệ Nhân tạo (AI Astrology Platform), chuyên sâu về Tử Vi Đẩu Số và Thần Số Học, được định hình như một **Virtual Astrologer (Thầy Tử Vi Ảo)** thông qua hình thức Chat/Session.

### 1. Tử Vi Đẩu Số (Core Feature)
- **Input**: Tên, giới tính, ngày/giờ sinh (Dương hoặc Âm lịch), cung mệnh khởi nguyên.
- **Processing** (`src/lib/astrology`): 
  - Lập lá số 12 cung, an đủ 108 vì sao.
  - Xét đắc hãm (Miếu/Vượng/Đắc/Hãm).
  - Tích hợp bộ chuyển đổi Âm Dương Lịch `AmLich.ts` thuần Việt.
- **Output**: Component Giao diện Ma trận Tử Vi 12 cung hiện đại (`PalaceMatrix.tsx`).

### 2. Thần Số Học (Numerology)
- **Input**: Cùng form ngữ cảnh với Tử Vi.
- **Processing** (`src/lib/astrology/Numerology.ts`): Tính các chỉ số cốt lõi theo hệ phái phương Tây Pythagoras (Biểu đạt - Expression, Đường đời, Chỉ số Tên...).
- **Output**: Biểu đồ phân tích số học (`NumerologyContent.tsx`).

### 3. Tương tác AI Thông minh (Virtual Astrologer)
- Tính năng không trả về text tĩnh 1 chiều mà hoạt động qua **ChatSession** và **ChatMessage**.
- Hệ thống gửi `astrologyData` (Dữ liệu tĩnh json của lá số 108 sao) vào làm System Context cho LLM.
- **Google Gemini SDK** sẽ sử dụng Context này để trò chuyện, giải đáp thắc mắc cặn kẽ và riêng biệt cho mỗi người dùng thay thế một thầy Tử Vi thật (File: `src/lib/astrology/AiUtils.ts`).

## Kiến trúc Hệ Sinh Thái
- **Core Framework**: Next.js 16 (App Router)
- **Monorepo**: Tổ chức theo cấu trúc `apps/web` qua thư viện PNPM.
- **Database (SQLite + Prisma)**: Lưu trữ Session (Cuộc trò chuyện) và Message (Tin nhắn) thay vì cache text cứng. 
- **Styling**: Tailwind CSS + UI components hiện đại (Khuynh hướng Glassmorphism).

## Core Business Rules (Rule of Thumb)
1. **Source of Truth**: Mọi logic tính toán Tử Vi Đẩu Số và Âm Dương Lịch phải hoàn toàn độc lập, chạy nội bộ không phụ thuộc API bên ngoài. Dữ liệu chuẩn gốc nằm trong `cungData.json`, `saoData.json`.
2. **Session-driven AI**: Context AI phản hồi PHẢI dựa trên Data lá số đã được phân tách JSON ở phía Server, không để AI tự bịa lá số.
3. **Môi trường Code**: Chỉ sử dụng chuẩn TypeScript, ưu tiên các Server Components cho fetching và Client Components cho tương tác UI. Tất cả tập trung vào tốc độ và trải nghiệm (React 19).