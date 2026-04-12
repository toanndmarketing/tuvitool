# 📊 Data Schema (SQLite — better-sqlite3)

> Database file: `data/tuvi.db`
> WAL mode enabled, foreign keys ON

## Tables

### sao_interpret (Star Interpretations)
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | Auto-increment |
| sao_name | TEXT UNIQUE | Star name (e.g., "Tử Vi") |
| icon | TEXT | Emoji icon (default '⭐') |
| short_desc | TEXT | Short description |
| detail | TEXT | Detailed interpretation |
| good_aspects | TEXT | Positive aspects |
| bad_aspects | TEXT | Negative aspects |
| nature | TEXT | 'cat', 'hung', 'trung' (default 'trung') |
| sao_type | TEXT | 'chinh' or 'phu' (default 'phu') |
| created_at | DATETIME | Auto-timestamp |
| updated_at | DATETIME | Auto-timestamp |

**Seed data**: 14 chính tinh + ~50 phụ tinh (Tứ Hóa, Lộc Tồn, Kình Đà, etc.)

### cung_interpret (Palace Interpretations)
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | Auto-increment |
| cung_name | TEXT UNIQUE | Palace name in CAPS (e.g., "MỆNH") |
| icon | TEXT | Emoji icon (default '🔮') |
| description | TEXT | Palace description |
| key_aspects | TEXT | JSON array of aspects |
| created_at | DATETIME | Auto-timestamp |
| updated_at | DATETIME | Auto-timestamp |

**Seed data**: 12 cung (MỆNH → PHỤ MẪU)

### special_interpret (Special Conditions)
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | Auto-increment |
| condition_key | TEXT UNIQUE | Condition identifier (e.g., "am_duong_nghich_ly") |
| title | TEXT | Display title |
| icon | TEXT | Emoji icon |
| description | TEXT | Full description |
| advice | TEXT | Advice text |
| created_at | DATETIME | Auto-timestamp |
| updated_at | DATETIME | Auto-timestamp |

**Seed data**: am_duong_nghich_ly, cuc_khac_menh, than_menh_dong_cung, tu_hoa

### ai_cache (AI Response Cache)
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | Auto-increment |
| cache_key | TEXT UNIQUE | MD5 hash of chart "DNA" |
| response | TEXT | JSON stringified AI response |
| created_at | DATETIME | Auto-timestamp |
| expires_at | DATETIME | Expiration (default +720h = 30 days) |

**Cache key**: MD5 of `{ promptVersion, gender, yearView, cuc, menh, cungMenh, vanHan, dna }`

## Query Functions (db.js exports)
- `getDb()` — Initialize/return DB instance
- `getAllSaoInterpret()` — All star interpretations
- `getSaoByName(name)` — Single star by name
- `getAllCungInterpret()` — All palace interpretations
- `getCungByName(name)` — Single palace by name
- `getAllSpecialInterpret()` — All special conditions
- `getSpecialByKey(key)` — Single condition by key
- `getAiCache(key)` — Get cached AI response
- `setAiCache(key, response, ttlHours)` — Store AI response
