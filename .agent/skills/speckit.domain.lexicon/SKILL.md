---
name: "speckit.domain.lexicon"
description: "Từ Điển Dữ Liệu & Naming Convention cho ứng dụng Tử Vi (Huyền Học)."
---

# speckit.domain.lexicon — Naming Convention & Data Dictionary

Kỹ năng này cung cấp từ điển chuẩn (Data Dictionary) và quy ước đặt tên (Naming Convention) bắt buộc khi code hoặc thiết kế Database cho dự án `tu-vi-la-so`.

## 1. NGUYÊN TẮC CƠ BẢN
- **Không dịch nghĩa sang tiếng Anh:** Tuyệt đối KHÔNG dùng các từ tiếng Anh dịch nghĩa mường tượng (như `Emperor` cho Tử Vi, `Destiny` cho Mệnh, `Sun` cho Thái Dương). Điều này gây nhầm lẫn lớn.
- **Sử dụng Chuẩn Pinyin/Việt hóa:** Các entity cốt lõi phải dùng Pinyin chuẩn hoặc tiếng Anh quy ước chuyên ngành để mapping chuẩn với các bộ thư viện mở (như `iztro`).
- **Data Structure:** Mọi dữ liệu về lá số dùng định dạng JSON.

## 2. TỪ ĐIỂN MAPPING VÀ TÊN BIẾN CHUẨN

### 2.1. Cấu trúc thời gian & Ngũ hành
| Khái niệm (VN) | Khái niệm (Pinyin/English) | Database Field / Tên Biến Code | Ví dụ Cấu Trúc |
| :--- | :--- | :--- | :--- |
| Âm/Dương | Yin/Yang | `yinYang` | Enum: `Yin` (-1), `Yang` (1) |
| Ngũ Hành | Five Elements | `fiveElement` | Enum: `Metal`, `Wood`, `Water`, `Fire`, `Earth` |
| Thiên Can | Heavenly Stems | `heavenlyStem` | Array: `['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui']` |
| Địa Chi | Earthly Branches | `earthlyBranch` | Array: `['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai']` |

### 2.2. 12 Cung (Palaces)
Tên biến (Key) cho 12 cung Đóng đinh theo chuẩn sau (không thay đổi):
1. **Mệnh:** `Life` (Tuyệt đối không dùng `Destiny`)
2. **Huynh Đệ:** `Siblings`
3. **Phu Thê:** `Spouse`
4. **Tử Nữ:** `Children`
5. **Tài Bạch:** `Wealth`
6. **Tật Ách:** `Health`
7. **Thiên Di:** `Travel`
8. **Nô Bộc:** `Friends`
9. **Quan Lộc:** `Career` (Tuyệt đối không dùng `Job`)
10. **Điền Trạch:** `Property`
11. **Phúc Đức:** `Karma` (Lý do: Phúc Đức liên quan đến nghiệp mủ)
12. **Phụ Mẫu:** `Parents`

Mảng: `palaces = ['Life', 'Siblings', 'Spouse', 'Children', 'Wealth', 'Health', 'Travel', 'Friends', 'Career', 'Property', 'Karma', 'Parents']`

### 2.3. Hệ thống 108 Sao (Stars)
Các biến phân nhóm sao:
- `majorStars`: 14 Chính tinh (Tử Vi, Tướng Quân...) -> Map theo `StarName`
- `minorStars`: Phụ tinh (Tả Hữu, Xương Khúc...)
- `mutations`: Tứ hóa (Khoa, Quyền, Lộc, Kỵ) -> `HuaLu` (Hóa Lộc), `HuaQuan` (Hóa Quyền), `HuaKe` (Hóa Khoa), `HuaJi` (Hóa Kỵ).

#### 14 Chính Tinh (Major Stars Naming):
Sử dụng giá trị chuỗi Pinyin tiêu chuẩn để lưu trữ làm `key` hoặc `id`:
- `ziwei` (Tử Vi)
- `tianji` (Thiên Cơ)
- `taiyang` (Thái Dương)
- `wuqu` (Vũ Khúc)
- `tiantong` (Thiên Đồng)
- `lianzhen` (Liêm Trinh)
- `tianfu` (Thiên Phủ)
- `taiyin` (Thái Âm)
- `tanlang` (Tham Lang)
- `jumen` (Cự Môn)
- `tianxiang` (Thiên Tướng)
- `tianliang` (Thiên Lương)
- `qishar` (Thất Sát)
- `pojun` (Phá Quân)

## 3. CHỈ THỊ (ACTION RULES)
Khi nhận yêu cầu: *"Viết AI Prompt hoặc API trả về sao Mệnh"*
- **Agent Hành động:** Trả về JSON với key chuẩn. Ví dụ:
  ```json
  {
    "palace": "Life",
    "branch": "Zi",
    "majorStars": ["ziwei", "tianfu"]
  }
  ```
- **Nghiêm cấm:** Trả về `{ "room": "Destiny", "stars": ["Emperor"] }`
