# Phân tích và thiết kế hệ thống

## Yêu cầu hệ thống
### Yêu cầu chức năng
Hệ thống SourceVerify cần đáp ứng các chức năng sau:

1. Người dùng có thể tải lên nội dung cần kiểm tra.
2. Hệ thống xác định loại dữ liệu và kiểm tra tính hợp lệ của tệp.
3. Với ảnh, hệ thống đọc metadata và ma trận pixel để chạy các method forensic.
4. Với văn bản và video, hệ thống có cấu trúc mở để bổ sung method tương ứng.
5. Hệ thống tổng hợp kết quả thành điểm AI, nhãn dự đoán và độ tin cậy.

### Yêu cầu phi chức năng
- Tính mở rộng: thêm method mới không làm thay đổi toàn bộ kiến trúc.
- Tính minh bạch: kết quả phải có giải thích, không chỉ trả về nhãn cuối.
- Hiệu năng: ảnh lớn cần được giới hạn kích thước xử lý để tránh quá tải.
- Độ tin cậy: kiểm tra định dạng và dữ liệu đầu vào trước khi phân tích.

## Kiến trúc tổng thể
Kiến trúc SourceVerify được thiết kế theo hướng đơn giản trước, đúng với nguyên tắc Project I: ưu tiên hiểu rõ bài toán và có sản phẩm minh họa ổn định, sau đó mới mở rộng các thành phần phức tạp hơn.

Các lớp chính gồm:
- Client Layer / React UI
- Application Layer / Next.js Routes
- Analysis Layer / Analyzer Engine
- Method Layer / Image / Text / Video
- Scoring Layer / Weighted Voting
- Presentation Layer / Result Explainability

## Phân rã chức năng
Các khối chức năng chính của SourceVerify gồm:
- Nhập dữ liệu
- Tiền xử lý
- Phân tích method
- Tổng hợp điểm
- Hiển thị kết quả

## Luồng dữ liệu phân tích ảnh
Luồng dữ liệu của một lần phân tích ảnh:
1. Upload ảnh
2. Validate tệp
3. Trích xuất metadata và pixel
4. Chạy 5 nhóm tín hiệu
5. Thu danh sách signal
6. Weighted scoring
7. Sinh AI score / verdict
8. Giải thích kết quả

## Thiết kế dữ liệu và lựa chọn kiến trúc
Dữ liệu phân tích được tổ chức theo các cấu trúc logic sau: `FileMetadata`, `AnalysisMethod` và `AnalysisResult`. Thiết kế này giúp kết quả phân tích có cấu trúc thống nhất để bộ tổng hợp có thể dùng lại cho nhiều loại method.

### So sánh lựa chọn kiến trúc
- **Monolithic Next.js + module analyzer**: dễ triển khai, dễ hiểu, phù hợp Project I, ít phụ thuộc hạ tầng; nhược điểm là khó mở rộng khi tải lớn.
- **Microservice analyzer riêng**: dễ scale từng service, phù hợp sản phẩm lớn; nhược điểm là cần hạ tầng, queue, API nội bộ, monitoring.
- **Mô hình ML end-to-end**: có thể đạt độ chính xác cao nếu có dataset lớn; nhược điểm là cần dữ liệu gán nhãn, training, đánh giá nghiêm ngặt.

Quyết định hiện tại là dùng kiến trúc Next.js kết hợp analyzer module nội bộ. Lý do là nhóm thực hiện cần tập trung vào hiểu bài toán và trình bày method, trong khi microservice hoặc training model sẽ làm tăng độ phức tạp vượt phạm vi Project I.