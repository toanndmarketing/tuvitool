# 🌐 API Standards

## Base URL
- `/api/` (KHÔNG có /v1/ — dự án này dùng flat routing)

## Authentication
- **Login**: `POST /api/auth/login` → returns `{ token, expiresIn }`
- **Protected routes**: Bearer token in `Authorization` header
- **Auto-bypass**: Localhost requests & `SKIP_AUTH=true` skip auth
- **TTL**: 30 phút, in-memory Map storage

## API Routes
| Method | Path | Rate | Auth | Description |
|--------|------|------|------|-------------|
| GET | `/api/interpretations/sao` | 30/min | No | All star interpretations |
| GET | `/api/interpretations/cung` | 30/min | No | All palace interpretations |
| GET | `/api/interpretations/special` | 30/min | No | Special conditions |
| GET | `/api/interpretations/all` | 30/min | No | Combined data |
| POST | `/api/auth/login` | 30/min | No | Login → token |
| POST | `/api/interpret/ai` | 5/min | **Yes** | AI deep analysis |
| POST | `/api/iching/cast` | 30/min | No | Cast hexagram |
| POST | `/api/soi-bai/draw` | 30/min | No | Draw cards |
| GET | `/api/soi-bai/decode/:suit/:rank` | - | No | Decode card |
| GET | `/api/health` | - | No | Health check |

## Error Format
```json
{ "error": "Error message in Vietnamese" }
```

## Response Format
- Interpretation APIs: keyed objects `{ [name]: { ...data } }`
- AI API: `{ sections: [], palaceSections: {}, raw: string }`
- Auth: `{ success: true, token: string, expiresIn: number }`
- Health: `{ status: "ok", timestamp: string, geminiConfigured: boolean }`

## Rate Limiting
- `express-rate-limit` package
- Window: 1 phút
- General API: 30 requests/window
- AI endpoint: 5 requests/window (protect Gemini quota)
- Gemini retry: 3 retries on 429 with exponential backoff