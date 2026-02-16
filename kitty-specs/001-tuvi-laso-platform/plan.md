# Implementation Plan: Tử Vi Lá Số Platform

**Branch**: `001-tuvi-laso-platform` | **Date**: 2026-02-16 | **Spec**: `kitty-specs/001-tuvi-laso-platform/spec.md`
**Input**: Feature specification from `/kitty-specs/001-tuvi-laso-platform/spec.md`

## Summary

Dự án Tử Vi Lá Số là ứng dụng web single-page tính toán lá số Tử Vi cổ truyền (12 cung, 14 chính tinh, 60+ phụ tinh) và Thần Số Học Pythagoras (15+ chỉ số), tích hợp AI phân tích chuyên sâu qua Google Gemini API. Kiến trúc monolithic đơn giản: Express backend serve static + API, Vanilla JS frontend xử lý toàn bộ logic tính toán phía client.

## Technical Context

**Architecture**: Monolithic — Express.js backend + Vanilla JS frontend
**Language/Version**: JavaScript ES6+ (client + server), Node.js 20 Alpine
**Primary Dependencies**: Express.js 4.21, better-sqlite3 11.7, @google/generative-ai 0.25
**Storage**: SQLite (single file `data/tuvi.db`)
**Security**: Helmet 8, express-rate-limit 7.4, session-based auth (in-memory)
**Frontend**: Vanilla HTML5 + CSS3 + JavaScript (NO framework)
**Package Manager**: npm
**Testing**: Manual + script-based (`/test-tuvi` workflow)
**Target Platform**: Web (responsive: desktop 1200px + mobile 320px)
**Project Type**: Single-service web application
**Performance Goals**: Chart calculation < 100ms (client), AI response < 30s (server)
**Constraints**: Docker-first deploy, port 8950 fixed, all ENV via `.env`
**Scale/Scope**: 1 HTML page, 2 tabs (Tử Vi + Thần Số Học), 17 client JS files, 4 server files

## Constitution Check

*GATE: Must pass before any implementation.*

- [x] Port range: 8950 (within 8900-8999, compliant)
- [x] Docker-first: App runs in Docker container
- [x] No hardcoded values: API keys, credentials via ENV
- [x] ENV validation: GEMINI_API_KEY throws if missing, GEMINI_MODEL warns
- [x] Absolute paths only
- [x] Vietnamese communication language

## Project Structure

### Documentation (this feature)

```
kitty-specs/001-tuvi-laso-platform/
  meta.json              # Feature metadata
  spec.md                # SSR Specification (full system spec)
  plan.md                # This file
  tasks.md               # Work package index
  tasks/                 # Work package prompt files
  checklists/            # Quality validation checklists
```

### Source Code (existing repository)

```
tu-vi-la-so/
├── .env                          # Runtime configuration
├── .env.example                  # ENV documentation
├── Dockerfile                    # Node 20 Alpine + better-sqlite3
├── docker-compose.yml            # Single service, port 8950
│
├── server/                       # Backend (Express.js)
│   ├── server.js                 # Routes, middleware, auth, SPA fallback
│   ├── db.js                     # SQLite setup, seed data, queries
│   ├── gemini.js                 # Gemini API: prompt build, cache, parse
│   └── package.json              # Express + better-sqlite3 + helmet + rate-limit
│
├── public/                       # Frontend (Vanilla JS - served as static)
│   ├── index.html                # Single HTML page (form + sections)
│   ├── styles.css                # Full CSS (82KB, responsive)
│   ├── app.js                    # Main orchestrator: form events, tab routing
│   ├── auth.js                   # Session management, login modal
│   │
│   ├── am-lich.js                # Solar↔Lunar calendar conversion
│   ├── tu-vi-calc.js             # Core: Mệnh, Thân, Cục, Cung, Tràng Sinh
│   ├── tu-vi-sao.js              # Place 14 major + 60+ minor stars
│   ├── tu-vi-star-patterns.js    # Star attributes: Miếu/Hãm, special combos
│   ├── tu-vi-event-rules.js      # 26 event rules × 4 categories
│   ├── tu-vi-templates.js        # Template strings for interpretation
│   ├── tu-vi-event-scanner.js    # Logic engine: rule evaluation + pattern scan
│   ├── tu-vi-luu-nien.js         # P2-P6 advanced annual analysis
│   ├── tu-vi-render.js           # 4×4 grid rendering, center cell, timeline
│   ├── tu-vi-interpret.js        # Orchestration: load data → analyze → render
│   │
│   ├── than-so-hoc.js            # Pythagoras engine: 15+ calculations
│   ├── than-so-hoc-data.js       # Numerology meaning data (36KB)
│   └── than-so-hoc-render.js     # Numerology UI render (7 sections)
│
└── data/                         # Persistent storage
    ├── tuvi.db                   # SQLite database
    └── TEST_CHUAN_NGUYEN_DUC_TOAN.md  # Reference test data
```

**Structure Decision**: Monolithic architecture — Express serves both static files và API từ cùng 1 process. Phù hợp cho quy mô dự án nhỏ, cần tốc độ phát triển cao. Frontend hoàn toàn client-side rendering — tất cả tính toán Tử Vi + Thần Số Học chạy trong browser, server chỉ phục vụ DB lookups (diễn giải text) và Gemini AI proxy.

## Port Allocation

| Service | Port | Container | Purpose |
|---------|------|-----------|---------|
| App (Express) | 8950 | tuvi-app | Web server + API (only service) |

*Single service — no separate DB container needed (SQLite is embedded).*

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| 82KB CSS in single file | All styles for 2 tabs (TV + TSH) + responsive | Splitting would complicate Docker volume mount for live dev |
| 65KB tu-vi-interpret.js | Full orchestration logic for all analysis types | Splitting would create circular dependencies with shared state |
| In-memory auth tokens | Simplest auth for single-user scenario | JWT would be overkill for 1-2 admin users needing AI access |

## Module Architecture

### M1: Tử Vi Calculation Engine (Client-side, P0)

```
Execution Flow:
1. User Input (ngày/giờ/giới tính)
     │
2. AmLich.convertSolarToLunar()     → Ngày/Tháng/Năm Âm lịch
     │
3. TuViCalc.calculateChart()        → Mệnh, Thân, Cục, Nạp Âm
     │
4. TuViSao.placeAllStars()          → 14 chính tinh + 60+ phụ tinh
     │
5. TuViStarPatterns.evaluateAll()   → Miếu/Hãm + Bộ sao đặc biệt
     │
6. TuViCalc.calculateDaiVan()       → 12 Đại Vận periods
     │
7. TuViRender.renderGrid()          → 4×4 HTML grid
```

### M2: Lưu Niên Analysis Engine (Client-side, P0)

```
Execution Flow:
1. User selects năm xem
     │
2. TuViLuuNien.placeLuuNienStars()  → Sao lưu niên (12+ sao)
     │
3. TuViEventScanner.scanAllRules()  → 26 rules × 4 categories
     │
4. TuViStarPatterns.scanPatterns()  → Bộ Đại Hung/Cát/Tâm Linh
     │
5. TuViLuuNien.analyzeP2toP6()     → Lưu Tứ Hóa, Trigger, Thái Tuế,
     │                                  12-month forecast, Energy Score
6. TuViInterpret.renderAll()        → Full analysis display
```

### M3: Thần Số Học Engine (Client-side, P1)

```
Execution Flow:
1. User Input (ngày sinh + họ tên)
     │
2. ThanSoHoc.calculate()            → 15+ indices
     │
3. ThanSoHocData.lookup()           → Meanings for each index
     │
4. ThanSoHocRender.renderAll()      → 7 sections UI
```

### M4: AI Analysis Pipeline (Server-side, P1)

```
Execution Flow:
1. Client sends compact chart data
     │
2. Server: buildCacheKey()           → MD5 hash of chart DNA
     │
3. Server: checkCache(key)           → Hit? Return cached response
     │ (miss)
4. Server: buildPrompt(data)         → System instruction + compact data
     │
5. Server: Gemini API call           → Raw AI text response
     │
6. Server: parseResponse()           → Structured sections
     │
7. Server: saveCache(key, resp)      → SQLite with 24h TTL
     │
8. Client: renderAIAnalysis()        → Display in UI
```

### M5: Authentication (Server-side, P1)

```
Flow:
1. POST /api/auth/login (username, password)
2. Validate against ENV vars
3. Generate 32-byte hex token
4. Store in Map with 30min expiry
5. Client stores in sessionStorage
6. Bearer token in subsequent AI requests
```

## Parallel Work Analysis

### Dependency Graph

```
M1 (Tử Vi Engine)  ──────────────────────────┐
                                               ├──> M2 (Lưu Niên) ──┐
                                               │                     ├──> M4 (AI Analysis)
M5 (Auth) ────────────────────────────────────┘                     │
                                                                     │
M3 (Thần Số Học) ──────────────── independent ──────────────────────┘

Infrastructure (Docker, DB seed) ──> All modules
```

### Work Distribution

- **Core engine files** (M1): Đã hoàn thiện. Cần review + fix nếu có lỗi.
- **Lưu Niên** (M2): Phụ thuộc M1. Đã hoàn thiện cơ bản, cần improve P2-P6.
- **Thần Số Học** (M3): Độc lập hoàn toàn. Đã hoàn thiện.
- **AI** (M4): Phụ thuộc M1 + M5. Đã hoàn thiện, cần optimize cache.
- **Auth** (M5): Đã hoàn thiện đơn giản.

### Coordination Points

- **Chart Data Contract**: Output format của M1 quyết định input format của M2 + M4. Bất kỳ thay đổi nào ở M1 phải cập nhật M2 + M4.
- **Gemini Prompt Format**: Thay đổi prompt structure (M4) phải test với nhiều lá số khác nhau.
- **Star Placement Accuracy**: M1 sao đặt sai → M2 events sai → M4 AI analysis sai. Chain effect nghiêm trọng.
