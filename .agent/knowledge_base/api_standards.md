# 🌐 API Standards (V2 — Next.js App Router)

## Kiến trúc API
- **Framework**: Next.js 16 App Router (Route Handlers)
- **Path convention**: `src/app/api/{resource}/route.ts`
- **Response**: `NextResponse.json()` hoặc Stream (cho AI chat)

## API Routes hiện tại
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/chart` | No | Tính toán lá số Tử Vi đầy đủ (ChartMatrix) |
| POST | `/api/chat` | No | Chat AI — Stream response (Gemini SDK) |
| GET/POST | `/api/sessions` | No | Quản lý Chat Sessions (Prisma) |

## Chi tiết API

### POST `/api/chart`
**Input:**
```json
{
  "profileA": { "ngay": 15, "thang": 3, "nam": 1990, "gioSinh": 5, "gioiTinh": "nam", "hoTen": "..." },
  "profileB": null,
  "isTwin": false,
  "namXem": 2026
}
```
**Output:** `{ success: true, data: { isTwin, chartA: ChartMatrix, chartB: null } }`

### POST `/api/chat`
**Input:**
```json
{
  "messages": [{ "role": "user", "content": "..." }],
  "sessionId": "cuid...",
  "chartData": { /* ChartMatrix JSON */ }
}
```
**Output:** Stream (AI SDK `toDataStreamResponse()`)
- System prompt được đọc từ file template (`public/prompts/tuvi_master_compact.v11.prompt`)
- `chartData` được nén qua `compactAstrologyData()` rồi inject vào prompt placeholder `{{JSON_DATA}}`
- Message được lưu vào Prisma DB (ChatMessage model)

### GET `/api/sessions`
**Output:** Danh sách ChatSession từ Prisma.

## Quy tắc chung
1. **Error format**: `{ error: "Vietnamese message" }` + HTTP status code tương ứng.
2. **Validation**: Kiểm tra input trước khi xử lý. Trả 400 nếu thiếu dữ liệu bắt buộc.
3. **AI Model**: Đọc từ `process.env.GEMINI_MODEL`, fallback `gemini-1.5-flash-latest`.
4. **Stream**: Chat API trả về Stream, KHÔNG trả JSON đầy đủ. Frontend dùng `useChat` hook (AI SDK).
5. **No Authentication gate hiện tại**: Tất cả API đều public (V2 chưa implement auth layer).