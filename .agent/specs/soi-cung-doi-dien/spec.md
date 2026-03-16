# Feature: Soi Cung Đối Diện & Tam Hợp

## Overview
Khi hover vào ô cung trên lá số, vẽ đường SVG từ trung tâm tới 4 cung liên quan:
- **Trục chính** (cam): Cung đang xem ↔ Đối cung (cách 6 vị trí)
- **Tam hợp** (xanh): 2 cung tam hợp (cách 4 vị trí mỗi bên)

## UI Reference
Mẫu: vibe.j2team.org — SVG `<line>` từ tâm center-cell tới tâm 4 ô cung.

## User Scenario
- **Actor**: Người xem lá số
- **Action**: Hover (desktop) hoặc tap (mobile) vào ô cung bất kỳ
- **Result**: 4 đường line hiện ra từ trung tâm tới 4 cung. Hover out → line biến mất.

## Functional Requirements
1. SVG overlay position: absolute trên center-cell (grid 2-3, row 2-3)
2. Tọa độ line: từ tâm SVG → tâm mỗi ô cung đích
3. Màu: cam (#FF6B4A) cho trục chính, xanh (#38BDF8) cho tam hợp
4. Line width: 2px, opacity 0.8, smooth animation
5. Hover out → line ẩn
6. Mobile: tap → toggle hiển thị

## Logic Tam Hợp & Đối Cung
| Nhóm Tam Hợp | Đối Cung 1 | Đối Cung 2 |
|---|---|---|
| Dần-Ngọ-Tuất | Dần↔Thân | Ngọ↔Tý |
| Thân-Tý-Thìn | Tuất↔Thìn | Sửu↔Mùi |
| Tỵ-Dậu-Sửu | Tỵ↔Hợi | Dậu↔Mão |
| Hợi-Mão-Mùi | | |

## Success Criteria
- ✅ Hover vào cung → 4 đường SVG xuất hiện
- ✅ Đường cam nối tâm ↔ cung chọn ↔ đối cung
- ✅ Đường xanh nối tâm ↔ 2 cung tam hợp
- ✅ Hover out → đường biến mất
- ✅ Không ảnh hưởng layout ô cung
