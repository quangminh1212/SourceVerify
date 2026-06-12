# Kết luận và phương hướng phát triển

## 5.1. Kết luận chung
Đề tài **SourceVerify** đã giúp làm rõ một vấn đề thực tiễn và có tính thời sự: kiểm chứng ảnh số trong bối cảnh AI tạo sinh phát triển mạnh. Trong khuôn khổ Project I, nhóm đã tiếp cận bài toán theo hướng digital image forensics thay vì phụ thuộc hoàn toàn vào mô hình học sâu lớn. Đây là hướng đi phù hợp với mục tiêu học phần vì vừa giúp hiểu nền tảng công nghệ, vừa rèn luyện tư duy phân tích và thiết kế hệ thống.

Báo cáo đã trình bày được:
- Bối cảnh và tính cấp thiết của đề tài.
- Cơ sở lý thuyết của bài toán kiểm chứng ảnh AI.
- Phân tích và thiết kế hệ thống SourceVerify.
- Kết quả triển khai sản phẩm minh họa.
- Vai trò của 5 phương pháp nổi bật trong quá trình phân tích ảnh.

## 5.2. Các công việc đã hoàn thành
Các nội dung đã thực hiện được trong đề tài gồm:

1. Khảo sát bài toán phát hiện ảnh có khả năng được tạo bởi AI.
2. Tìm hiểu nền tảng công nghệ phục vụ xây dựng hệ thống web phân tích ảnh.
3. Lựa chọn và phân tích 5 phương pháp tiêu biểu:
   - Metadata Analysis
   - Noise Residual
   - DCT Block Artifacts
   - Chromatic Aberration
   - Spectral Nyquist Analysis
4. Thiết kế kiến trúc hệ thống theo hướng dễ mở rộng.
5. Xây dựng sản phẩm minh họa có khả năng nhận ảnh, phân tích và giải thích kết quả.
6. Hoàn thiện nội dung báo cáo theo cấu trúc quyển đồ án cuối kì.

## 5.3. Hạn chế của đề tài
Bên cạnh các kết quả đã đạt được, đề tài vẫn còn một số hạn chế:

- Chưa có tập dữ liệu chuẩn lớn để đánh giá định lượng nghiêm ngặt.
- Một số phương pháp hiện mới dừng ở mức heuristic và hỗ trợ giải thích.
- Kết quả có thể bị ảnh hưởng bởi resize, nén lại hoặc hậu xử lý ảnh.
- Hệ thống hiện phù hợp hơn với vai trò hỗ trợ tham khảo hơn là công cụ kết luận cuối cùng.

## 5.4. Phương hướng phát triển
Trong thời gian tới, đề tài có thể được mở rộng theo các hướng sau:

1. Xây dựng bộ dữ liệu kiểm thử gồm ảnh thật, ảnh AI và ảnh chỉnh sửa.
2. Đánh giá định lượng các phương pháp theo accuracy, precision, recall và F1-score.
3. Kết hợp 5 phương pháp hiện tại với mô hình machine learning để cải thiện độ chính xác.
4. Mở rộng thêm các phương pháp forensic khác khi phạm vi nghiên cứu cho phép.
5. Mở rộng hệ thống sang video và văn bản trong các giai đoạn tiếp theo.
6. Tích hợp các chuẩn provenance như C2PA để kiểm tra nguồn gốc nội dung có xác thực.

## 5.5. Kết luận cuối cùng
Nhìn chung, SourceVerify đã đáp ứng đúng tinh thần của Project I: **tìm hiểu công nghệ, đặt vấn đề, đề xuất hướng giải quyết và hiện thực hóa thành một sản phẩm minh họa có ý nghĩa**. Trọng tâm 5 phương pháp nổi bật giúp báo cáo gọn hơn, rõ hơn và phù hợp hơn với hình thức báo cáo cuối kì.