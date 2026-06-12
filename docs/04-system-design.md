# Phân tích và thiết kế hệ thống

## 3.1. Mục tiêu thiết kế hệ thống
Hệ thống SourceVerify được thiết kế để hỗ trợ người dùng kiểm tra nhanh một ảnh số và nhận về kết quả đánh giá có giải thích. Với đặc thù của Project I, mục tiêu thiết kế không phải là xây dựng một hệ thống thương mại hoàn chỉnh, mà là tạo ra một nền tảng minh họa rõ ràng cho quy trình phân tích ảnh bằng nhiều phương pháp forensic.

## 3.2. Yêu cầu hệ thống
### 3.2.1. Yêu cầu chức năng
Hệ thống cần đáp ứng các chức năng chính sau:

1. Cho phép người dùng tải ảnh lên từ giao diện web.
2. Kiểm tra định dạng và tính hợp lệ của tệp ảnh.
3. Trích xuất metadata và dữ liệu pixel từ ảnh đầu vào.
4. Thực hiện phân tích theo 5 phương pháp đã chọn.
5. Tổng hợp điểm từ các phương pháp thành kết quả chung.
6. Hiển thị mức độ nghi ngờ ảnh do AI tạo cùng giải thích cho từng phương pháp.

### 3.2.2. Yêu cầu phi chức năng
- **Tính mở rộng:** dễ bổ sung thêm phương pháp mới sau này.
- **Tính minh bạch:** phải hiển thị được lý do hình thành kết quả.
- **Hiệu năng:** thời gian phân tích ở mức chấp nhận được với ảnh phổ biến.
- **Tính an toàn dữ liệu:** ưu tiên xử lý cục bộ, hạn chế gửi ảnh lên máy chủ.

## 3.3. Kiến trúc tổng thể của hệ thống
SourceVerify được thiết kế theo kiến trúc web đơn giản, gồm các lớp chính:

- **Lớp giao diện người dùng:** tiếp nhận thao tác tải ảnh và hiển thị kết quả.
- **Lớp điều phối phân tích:** xác định loại dữ liệu, gọi các mô-đun xử lý tương ứng.
- **Lớp phương pháp phân tích:** triển khai 5 phương pháp forensic đã chọn.
- **Lớp tổng hợp điểm:** kết hợp kết quả từ các phương pháp để đưa ra nhận định cuối.
- **Lớp trình bày kết quả:** diễn giải tín hiệu và mức độ nghi ngờ cho người dùng.

Kiến trúc này phù hợp với Project I vì dễ hiểu, dễ triển khai và thuận tiện cho việc trình bày trực tiếp.

## 3.4. Phân rã chức năng hệ thống
Có thể phân rã hệ thống thành 5 khối chức năng chính:

### 3.4.1. Khối nhập dữ liệu
- Nhận tệp ảnh từ người dùng.
- Kiểm tra định dạng tệp như JPG, PNG, WebP.
- Tạo phiên làm việc phân tích.

### 3.4.2. Khối tiền xử lý
- Đọc metadata của tệp.
- Chuyển ảnh thành ma trận pixel.
- Chuẩn hóa kích thước nếu ảnh quá lớn.

### 3.4.3. Khối phân tích phương pháp
- Chạy **Metadata Analysis**.
- Chạy **Noise Residual**.
- Chạy **DCT Block Artifacts**.
- Chạy **Chromatic Aberration**.
- Chạy **Spectral Nyquist Analysis**.

### 3.4.4. Khối tổng hợp điểm
- Thu thập điểm từ từng phương pháp.
- Áp dụng trọng số cho từng phương pháp.
- Tính AI score tổng hợp.
- Sinh nhãn kết quả và mức độ tin cậy.

### 3.4.5. Khối hiển thị kết quả
- Hiển thị điểm tổng hợp.
- Hiển thị điểm riêng của từng phương pháp.
- Giải thích ngắn gọn nguyên nhân phương pháp nghiêng về AI hay ảnh thật.

## 3.5. Luồng dữ liệu của hệ thống
Luồng xử lý cho một lần phân tích ảnh gồm các bước sau:

1. Người dùng tải ảnh lên hệ thống.
2. Hệ thống kiểm tra định dạng và kích thước tệp.
3. Ảnh được đọc metadata và trích xuất dữ liệu pixel.
4. Bộ điều phối lần lượt gọi 5 phương pháp phân tích.
5. Mỗi phương pháp trả về điểm số và mô tả tín hiệu.
6. Bộ tổng hợp tính điểm AI cuối cùng theo trọng số.
7. Giao diện hiển thị kết quả tổng hợp và giải thích chi tiết.

## 3.6. Thiết kế dữ liệu
Để thống nhất kết quả giữa các phương pháp, hệ thống sử dụng ba cấu trúc logic chính:

### 3.6.1. FileMetadata
Lưu các thông tin mô tả tệp như tên tệp, định dạng, kích thước, phần mềm tạo ảnh, thông tin EXIF và các thuộc tính liên quan đến nguồn gốc tệp.

### 3.6.2. AnalysisMethod
Lưu kết quả của một phương pháp phân tích gồm:
- Tên phương pháp.
- Điểm số.
- Trọng số.
- Mô tả ngắn.
- Chi tiết tín hiệu phát hiện.

### 3.6.3. AnalysisResult
Lưu kết quả cuối cùng của cả phiên phân tích gồm:
- Điểm AI tổng hợp.
- Nhãn nhận định.
- Danh sách các phương pháp đã chạy.
- Giải thích kết quả tổng quát.

## 3.7. Lý do lựa chọn kiến trúc hiện tại
Nhóm chọn mô hình **Next.js kết hợp module phân tích nội bộ** thay vì microservice hoặc mô hình học máy end-to-end vì các lý do sau:

- Phù hợp phạm vi Project I.
- Giảm độ phức tạp triển khai.
- Dễ trình bày rõ luồng xử lý và các phương pháp.
- Thuận tiện cho việc mở rộng thêm phương pháp trong các giai đoạn tiếp theo.

## 3.8. Kết luận chương
Từ phân tích trên, có thể thấy SourceVerify được thiết kế theo hướng đơn giản nhưng có cấu trúc rõ ràng. Hệ thống đủ khả năng minh họa quy trình kiểm chứng ảnh số bằng 5 phương pháp nổi bật, đồng thời vẫn giữ được khả năng mở rộng cho các nghiên cứu sau này.