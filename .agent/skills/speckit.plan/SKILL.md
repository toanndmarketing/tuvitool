---
name: speckit.plan
description: Technical Planner - Tạo plan.md từ spec (data model, API contracts, research).
role: System Architect
---

## 🎯 Mission
Chuyển spec.md (WHAT) thành plan.md (HOW) — kiến trúc kỹ thuật chi tiết.

## 📥 Input
- `.agent/specs/[feature]/spec.md`
- `.agent/memory/constitution.md`

## 📋 Protocol

### Phase 0: Research
- Scan spec → liệt kê unknowns ("NEEDS CLARIFICATION").
- Nghiên cứu giải pháp → ghi vào `research.md`.

### Phase 1: Data Model
- Từ entities trong spec → tạo `data-model.md`:
  ```prisma
  model User {
    id    String @id @default(cuid())
    email String @unique
    // ...
  }
  ```
- Xác định relationships (1:N, N:N).

### Phase 2: API Contracts
- Từ User Scenarios → tạo `contracts/[entity].md`:
  ```
  POST /api/v1/users
  Body: { email, password }
  Response: { data: User, token: string }
  Error: 400 | 409 | 500
  ```

### Phase 3: Architecture
- Tạo `plan.md` với:
  - Folder structure
  - Component hierarchy
  - State management approach
  - Authentication flow
  - Docker service topology

### Gate Check
- So sánh plan vs constitution → BÁO LỖI nếu vi phạm rules.

## 📤 Output
- `.agent/specs/[feature]/plan.md`
- `.agent/specs/[feature]/data-model.md`
- `.agent/specs/[feature]/contracts/*.md`
- `.agent/specs/[feature]/research.md` (nếu có unknowns)

## 🚫 Guard Rails
- KHÔNG viết code trong bước planning — chỉ kiến trúc.
- Mọi tech choice PHẢI justify lý do (không dùng tech vì "thích").
- PHẢI check constitution compliance trước khi output.
