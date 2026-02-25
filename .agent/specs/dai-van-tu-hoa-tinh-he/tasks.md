---
title: Tasks - Đại Vận Tứ Hóa & Lục Thập Tinh Hệ
status: DONE
version: 1.0.0
created: 2026-02-25
---

## Phase 1: Setup & Foundation

- [x] T001 [P] Tạo file `public/tu-vi-dai-van-hoa.js` với module structure `TuViDaiVanHoa` (IIFE pattern giống files hiện có)
  - File: `public/tu-vi-dai-van-hoa.js`
  - Action: Tạo skeleton module với constants CAN_CUNG_DAN + hàm `tinhCanCung(canNam, cungPos)`
  - Verify: `tinhCanCung(0, 2)` trả về 2 (Giáp năm → Bính Dần)

- [x] T002 [P] Thêm hàm `anDaiVanTuHoa(canNam, daiVanPos, saoMap, cungMap)` vào `tu-vi-dai-van-hoa.js`
  - File: `public/tu-vi-dai-van-hoa.js`
  - Action: Gọi `tinhCanCung()` → lấy Can → gọi `TuViSao.anTuHoa(canCung)` → tìm vị trí sao trên saoMap → trả về object ĐV Tứ Hóa
  - Depends: T001

- [x] T003 [P] Tạo file `public/tu-vi-tinh-he.js` với module structure `TuViTinhHe` + data 5 tinh hệ đầu tiên
  - File: `public/tu-vi-tinh-he.js`
  - Action: Tạo skeleton + data cho: Tử-Phủ, Tử-Phá, Tử-Sát, Cơ-Lương, Nhật-Nguyệt
  - Verify: `getTinhHe(cungPos, saoMap)` trả về tinh hệ object khi có Tử Vi + Thiên Phủ ở cùng cung

## Phase 2: Đại Vận Tứ Hóa Integration [US1]

- [x] T004 [US1.1] Tích hợp `TuViDaiVanHoa.calculate()` vào flow chính trong `app.js`
  - File: `public/app.js`
  - Action: Sau khi tính xong Đại Vận, gọi `TuViDaiVanHoa.calculate()` → gắn kết quả vào `lasoData.daiVanTuHoa`
  - Depends: T002

- [x] T005 [US1.1] Hiển thị Đại Vận Tứ Hóa trên UI (`tu-vi-render.js`)
  - File: `public/tu-vi-render.js`
  - Action: Thêm section "Đại Vận Tứ Hóa" dưới info Đại Vận hiện tại, hiển thị 4 Hóa + cung rơi vào
  - Depends: T004

- [x] T006 [US1.2] Thêm `analyzeDaiVanTuHoa()` vào `tu-vi-luu-nien.js`
  - File: `public/tu-vi-luu-nien.js`
  - Action: Luận giải ĐV Hóa Lộc/Kỵ rơi vào cung nào → tạo text cảnh báo/thuận lợi. Phát hiện "Kỵ trùng phùng" (ĐV Kỵ + Lưu Kỵ cùng cung)
  - Depends: T004

- [x] T007 [US1.2] Tích hợp ĐV Hóa Kỵ bonus vào Event Scanner
  - File: `public/tu-vi-event-scanner.js`
  - Action: Trong `evaluateRule()`, check nếu ĐV Hóa Kỵ rơi vào focus house → `totalScore += DAI_VAN_HOA_KY_BONUS`
  - Depends: T004

## Phase 3: Lục Thập Tinh Hệ Data [US2]

- [x] T008 [US2.1] Bổ sung 15 tinh hệ còn lại vào `tu-vi-tinh-he.js` (20 total)
  - File: `public/tu-vi-tinh-he.js`
  - Action: Thêm data cho 15 tinh hệ: Cơ-Cự, Cơ-Âm, Vũ-Tướng, Vũ-Sát, Vũ-Tham, Vũ-Phá, Đồng-Lương, Đồng-Âm, Đồng-Cự, Liêm-Tham, Liêm-Sát, Liêm-Phá, Sát-Phá, Cự-Nhật, Tử-Tham
  - Depends: T003

- [x] T009 [US2.1] Thêm hàm `getProfileText(tinhHeId, cungName)` — luận giải theo cung
  - File: `public/tu-vi-tinh-he.js`
  - Action: Hàm trả về text luận giải tính cách dựa trên tinh hệ + tên cung
  - Depends: T008

- [x] T010 [US2.2] Hiển thị Tinh Hệ Mệnh trên UI
  - File: `public/tu-vi-render.js`
  - Action: Dưới thông tin cung Mệnh, hiển thị "Tinh Hệ: [tên]" + profile text
  - Depends: T009

## Phase 4: AI Integration [US1.3, US2.3]

- [x] T011 [US1.3] Tích hợp Đại Vận Tứ Hóa vào Gemini compact data
  - File: `server/gemini.js`
  - Action: Trong `buildCompactData()`, thêm `vanHanInfo.daiVanTuHoa` chứa 4 Hóa + cung
  - Depends: T006

- [x] T012 [US2.3] Tích hợp Tinh Hệ Mệnh vào Gemini compact data
  - File: `server/gemini.js`
  - Action: Thêm `tinhHeMenh` vào compact data (tên tinh hệ + profile text)
  - Depends: T009

- [x] T013 Cập nhật Gemini system prompt để luận giải ĐV Tứ Hóa + Tinh Hệ
  - File: `server/gemini.js`
  - Action: Trong `buildPrompt()`, thêm hướng dẫn: "Phân tích Đại Vận Tứ Hóa" + "Luận giải theo Tinh Hệ Mệnh"
  - Depends: T011, T012

## Phase 5: HTML & Polish

- [x] T014 Thêm script tags cho 2 file mới vào `index.html`
  - File: `public/index.html`
  - Action: Thêm `<script src="tu-vi-dai-van-hoa.js">` và `<script src="tu-vi-tinh-he.js">` đúng thứ tự dependency
  - Depends: T001, T003

- [x] T015 Cập nhật `analyzeFull()` trong `tu-vi-luu-nien.js` include ĐV Tứ Hóa
  - File: `public/tu-vi-luu-nien.js`
  - Action: Trong `analyzeFull()`, thêm `daiVanTuHoa: analyzeDaiVanTuHoa(lasoData)` vào return object
  - Depends: T006

- [x] T016 Test toàn bộ với data Nguyễn Đức Toàn (1991-Tân Mùi)
  - Action: Verify ĐV Tứ Hóa đúng, Tinh Hệ Mệnh đúng, UI hiển thị OK, Gemini nhận data
  - Depends: T014, T015

## Dependency Graph

```
T001 → T002 → T004 → T005
                  ↓
              T006 → T007
                  ↓
              T011 → T013
                  
T003 → T008 → T009 → T010
                  ↓
              T012 → T013

T001 + T003 → T014
T006 → T015
All → T016
```

## Summary

| Phase | Tasks | Files Affected | Est. Time |
|-------|-------|---------------|-----------|
| 1: Setup | T001-T003 | 2 new files | 30 min |
| 2: ĐV Tứ Hóa | T004-T007 | 4 files | 40 min |
| 3: Tinh Hệ Data | T008-T010 | 2 files | 45 min |
| 4: AI | T011-T013 | 1 file | 20 min |
| 5: Polish | T014-T016 | 2 files | 15 min |
| **Total** | **16 tasks** | **7 files** | **~2.5 hours** |
