---
title: Que Kinh Dich - Chuc nang Gieo Que
status: APPROVED
version: 1.0.0
created: 2026-03-09
---

## 1. Overview
Tich hop chuc nang gieo que Kinh Dich vao ung dung Tu Vi. Nguoi dung chon phuong thuc gieo que (3 dong xu hoac 6 dong xu) va nhan duoc que ket qua voi day du phan tu, tuong tu tieng Viet.

## 2. User Scenarios
- US1: As a user, I want to cast coins virtually to receive a hexagram, so that I can get guidance.
- US2: As a user, I want to see name, symbol, judgment, and image text in Vietnamese.
- US3: As a user, I want to choose 3-coin or 6-coin method.

## 3. Functional Requirements
- FR01: POST /api/iching/cast returns result in < 500ms.
- FR02: System randomly casts 6 lines (yang/yin).
- FR03: Binary to hexagram ID mapping is 100% accurate.
- FR04: 64 hexagrams data: id, name, unicode, binary, judgment, image in Vietnamese.
- FR05: HTML/JS UI shows Unicode symbol, name, 6 lines, judgment, image text.
- FR06: "Gieo Que" button has animation, result appears after 1.2s.

## 4. Non-Functional Requirements
- NFR01: API response < 500ms.
- NFR02: Rate limit 30 req/min/IP.
- NFR03: No login required, public endpoint.

## 5. Success Criteria
- SC01: POST /api/iching/cast returns valid JSON with hexagramId, name, lines[6].
- SC02: 64 hexagrams in hexagrams.json, no duplicate binary.
- SC03: UI renders correct Unicode hexagram symbol.
- SC04: Rate limit returns 429 when exceeded.
