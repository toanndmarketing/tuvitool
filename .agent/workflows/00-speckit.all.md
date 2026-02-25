---
description: Full Pipeline (Specify → Clarify → Plan → Tasks → Analyze)
---

# 🚀 Full Pipeline

## Pre-conditions
- `.agent/memory/constitution.md` đã tồn tại (chạy `/01-speckit.constitution` trước)

## Steps

1. **@speckit.specify** — Tạo spec.md từ mô tả feature
   - Input: Developer mô tả feature bằng ngôn ngữ tự nhiên
   - Output: `.agent/specs/[feature]/spec.md`

2. **GATE**: Kiểm tra spec.md có đủ User Scenarios + Success Criteria?
   - Nếu THIẾU → quay lại step 1

3. **@speckit.clarify** — Giải quyết mơ hồ
   - Output: Updated spec.md (mọi ambiguity resolved)

4. **@speckit.plan** — Tạo kiến trúc kỹ thuật
   - Output: plan.md, data-model.md, contracts/

5. **GATE**: Plan có vi phạm Constitution?
   - Nếu CÓ → báo lỗi, yêu cầu fix

6. **@speckit.tasks** — Breakdown thành atomic tasks
   - Output: tasks.md

7. **@speckit.analyze** — Kiểm tra consistency
   - Output: Coverage score + Gap analysis

## Success Criteria
- ✅ spec.md, plan.md, tasks.md tồn tại và nhất quán
- ✅ Coverage score ≥ 90%
- ✅ Không vi phạm Constitution
