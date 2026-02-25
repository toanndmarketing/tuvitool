# Feature Specification: Hệ Thống Luận Giải Thần Số Học Chuyên Sâu (AI-Powered)

## Overview

Tính năng này nâng cấp khả năng luận giải Thần Số Hòa hiện tại từ các văn bản tĩnh (static) sang một hệ thống luận giải chi tiết, chuyên nghiệp và có chiều sâu hơn. Hệ thống sẽ cung cấp một bản "Raw Data" đầy đủ thông số kỹ thuật để AI (như ChatGPT, Gemini) có thể dựa vào đó viết một bản luận giải cá nhân hóa cao, hành văn chuyên nghiệp như một chuyên gia Thần Số Học thực thụ.

## User Scenarios

### Scenario 1: Người dùng muốn xem bản đồ cuộc đời chi tiết

- **Actor:** Người dùng cuối
- **Action:** Nhập Họ tên và Ngày sinh dương lịch.
- **Value:** Nhận được một bản báo cáo dài, phân tích mọi khía cạnh từ tính cách, sự nghiệp, tình duyên đến các vận hạn theo năm và các chu kỳ đỉnh cao, với ngôn từ chuyên sâu và gợi ý hành động cụ thể.

### Scenario 2: Chuyên gia/Consultant muốn có dữ liệu gốc để tư vấn

- **Actor:** Chuyên gia Thần Số Học
- **Action:** Sử dụng hệ thống để xuất thông số "Raw Data".
- **Value:** Có đầy đủ các chỉ số (Life Path, Soul Urge, Birthday, Arrows, Pinnacles, Challenges, v.v.) dưới dạng JSON/Text để nạp vào AI prompt hoặc làm tài liệu cơ sở để viết tay bản luận giải cho khách hàng.

## Requirements

### 1. Cấu trúc Luận giải Chuyên nghiệp (Output Template)

Bản luận giải phải bao gồm các phần:

- **Lời dẫn:** Giới thiệu về ý nghĩa của các con số và thông điệp chung.
- **Giải mã Con số Chủ đạo (Life Path):** Phân tích sâu về bản chất, năng lực cốt lõi và bài học cuộc đời.
- **Phân tích Biểu đồ Ngày sinh (Birth Chart):** Tác động của các bộ số, các mũi tên (mạnh/yếu) và cách hóa giải các mũi tên trống.
- **Khao khát Nội tâm & Nhân cách (Soul Urge & Personality):** Điều gì thôi thúc bên trong và cách thế giới nhìn nhận bạn.
- **Sứ mệnh & Trưởng thành (Expression & Maturity):** Bạn sinh ra để làm gì và bạn sẽ trở thành ai khi về già.
- **Dự báo Vận trình (Cycles & Personal Year):** Phân tích năm hiện tại và lộ trình 4 đỉnh cao cuộc đời.
- **Lời khuyên & Định hướng:** Các hành động cụ thể để phát huy thế mạnh và khắc phục điểm yếu.

### 2. Định dạng Raw Data (Prompt Input)

Raw Data phải cung cấp cho AI các thông tin sau:

- `fullName`: Họ và tên đầy đủ.
- `dob`: Ngày tháng năm sinh.
- `coreNumbers`: Danh sách các chỉ số chính (Life Path, Soul Urge, v.v.).
- `chartData`: Trạng thái các ô trong biểu đồ ngày sinh (số lần xuất hiện).
- `arrows`: Danh sách các mũi tên sức mạnh và mũi tên trống.
- `cycles`: Chi tiết 4 đỉnh cao (năm, tuổi, con số) và 4 thách thức.
- `personalTimeline`: Con số năm cá nhân hiện tại và các năm lân cận.

## Success Criteria

- [ ] Có file `spec.md` mô tả rõ ràng các yêu cầu (đã xong).
- [ ] Có cấu trúc Prompt mẫu (Raw Data) chuyên nghiệp.
- [ ] Bản luận giải mẫu khi chạy qua AI đạt độ dài > 2000 từ và có cấu trúc mạch lạc.
- [ ] Tích hợp được vào giao diện hiện tại (nút "Xuất dữ liệu cho AI" hoặc "Luận giải bằng AI").
