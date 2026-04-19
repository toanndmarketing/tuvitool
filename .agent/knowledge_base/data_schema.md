# 📊 Data Schema (V2 — Prisma + SQLite)

> Database: `apps/web/prisma/dev.db` (SQLite via Prisma ORM)
> Schema: `apps/web/prisma/schema.prisma`

## Models

### UserContext (Thông tin Đương Số)
| Field | Type | Notes |
|-------|------|-------|
| id | String @id | CUID auto-gen |
| userId | String? | Có thể ẩn danh |
| name | String? | Tên đương số |
| gender | String? | 'nam' / 'nữ' |
| dob | DateTime? | Ngày sinh dương lịch |
| birthHour | Int? | Giờ sinh (0-11, index Chi) |
| cungMenh | String? | Tên cung Mệnh |
| createdAt | DateTime | Auto-timestamp |
| updatedAt | DateTime | Auto-update |
| sessions | ChatSession[] | Relation 1-N |

### ChatSession (Phiên trò chuyện AI)
| Field | Type | Notes |
|-------|------|-------|
| id | String @id | CUID auto-gen |
| userContextId | String? | FK → UserContext |
| topic | String? | Chủ đề phiên (tự động hoặc user đặt) |
| astrologyData | String? | **JSON string chứa toàn bộ ChartMatrix** |
| createdAt | DateTime | Auto-timestamp |
| updatedAt | DateTime | Auto-update |
| messages | ChatMessage[] | Relation 1-N |

### ChatMessage (Tin nhắn trong phiên)
| Field | Type | Notes |
|-------|------|-------|
| id | String @id | CUID auto-gen |
| sessionId | String | FK → ChatSession |
| role | String | 'user', 'assistant', 'system' |
| content | String | Nội dung tin nhắn |
| createdAt | DateTime | Auto-timestamp |

> **Cascade Delete**: Khi xóa ChatSession → tự động xóa tất cả ChatMessage liên quan.

## Data tĩnh (JSON files — không qua DB)
| File | Vị trí | Nội dung |
|------|--------|----------|
| `cungData.json` | `src/lib/astrology/` | Metadata 12 cung (icon, key aspects) |
| `saoData.json` | `src/lib/astrology/` | Metadata 108+ sao (nature, type, mô tả) |
| `specialData.json` | `src/lib/astrology/` | Điều kiện đặc biệt (Âm Dương Nghịch Lý, Cục Khắc Mệnh...) |

## Quy tắc quan trọng
1. `astrologyData` trong ChatSession lưu dưới dạng **JSON.stringify(ChartMatrix)** — chứa toàn bộ lá số 108 sao đã tính toán. Đây là context nền cho AI chat.
2. Logic tính toán Tử Vi **KHÔNG** query từ DB. Tất cả chạy real-time bằng TypeScript engine (`TuViEngine.generateChart()`).
3. DB chỉ lưu **kết quả tương tác** (sessions, messages), **KHÔNG** lưu cache kết quả tính toán.
