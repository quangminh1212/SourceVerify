# Kết luận và phương hướng phát triển

## 5.1. Kết luận chung
Đề tài **SourceVerify** đã giúp làm rõ một vấn đề thực tiễn và có tính thời sự: kiểm chứng ảnh số trong bối cảnh AI tạo sinh phát triển mạnh. Trong khuôn khổ Project I, nhóm đã tiếp cận bài toán theo hướng digital image forensics thay vì phụ thuộc hoàn toàn vào mô hình học sâu lớn. Đây là hướng đi phù hợp với mục tiêu học phần vì vừa giúp hiểu nền tảng công nghệ, vừa rèn luyện tư duy phân tích và thiết kế hệ thống.

Điểm quan trọng của đề tài không nằm ở việc khẳng định tuyệt đối một ảnh là thật hay giả, mà nằm ở chỗ đề tài đưa ra được một khung tiếp cận hợp lý cho bài toán. Từ việc nhận diện vấn đề, khảo sát rủi ro, lựa chọn nền tảng kỹ thuật, thu hẹp phạm vi vào 5 phương pháp tiêu biểu, cho tới thiết kế và triển khai sản phẩm minh họa, nhóm đã hình thành được một quá trình nghiên cứu tương đối đầy đủ.

Báo cáo đã trình bày được:
- Bối cảnh và tính cấp thiết của đề tài.
- Cơ sở lý thuyết của bài toán kiểm chứng ảnh AI.
- Phân tích và thiết kế hệ thống SourceVerify.
- Kết quả triển khai sản phẩm minh họa.
- Vai trò của 5 phương pháp nổi bật trong quá trình phân tích ảnh.

Ngoài ra, đề tài còn thể hiện được một quan điểm học thuật quan trọng: trong bài toán kiểm chứng nội dung số, cần ưu tiên cách tiếp cận đa bằng chứng, có khả năng giải thích, thay vì chỉ phụ thuộc vào một mô hình “hộp đen”. Quan điểm này giúp SourceVerify phù hợp với tinh thần nghiên cứu nền tảng của Project I.

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

Nếu nhìn dưới góc độ quá trình học tập, nhóm không chỉ hoàn thành các đầu việc riêng lẻ mà còn tích lũy được kinh nghiệm trong cách tiếp cận một đề tài công nghệ mới. Từ khâu đọc tài liệu, lựa chọn phương pháp, thiết kế hệ thống tới hiện thực hóa ý tưởng, đề tài giúp kết nối lý thuyết với thực hành một cách tương đối đầy đủ.

## 5.3. Giá trị đạt được từ đề tài
### 5.3.1. Giá trị về kiến thức
Đề tài giúp củng cố và mở rộng kiến thức ở nhiều mảng khác nhau như xử lý ảnh số, tín hiệu ảnh, cấu trúc tệp ảnh, thống kê kỹ thuật, thiết kế hệ thống web và tư duy phân tích bài toán. Đây là giá trị lớn nhất của Project I vì sinh viên cần được rèn khả năng tìm hiểu công nghệ nền tảng thay vì chỉ chạy theo việc làm sản phẩm bề mặt.

### 5.3.2. Giá trị về kỹ năng
Thông qua quá trình triển khai, nhóm rèn luyện được các kỹ năng quan trọng như:
- Phân tích yêu cầu và thu hẹp phạm vi đề tài.
- Tổ chức nội dung báo cáo theo cấu trúc học thuật.
- Thiết kế hệ thống theo hướng mô-đun.
- Chuyển ý tưởng lý thuyết thành sản phẩm minh họa.
- Đánh giá kết quả một cách thận trọng và có cơ sở.

### 5.3.3. Giá trị thực tiễn
Mặc dù sản phẩm hiện còn ở mức minh họa, SourceVerify cho thấy một hướng ứng dụng thực tế đáng chú ý. Trong tương lai, những hệ thống tương tự có thể hỗ trợ giáo dục truyền thông số, hỗ trợ kiểm tra nguồn gốc nội dung hoặc hỗ trợ người dùng phổ thông nâng cao cảnh giác với ảnh AI.

## 5.4. Hạn chế của đề tài
Bên cạnh các kết quả đã đạt được, đề tài vẫn còn một số hạn chế:

- Chưa có tập dữ liệu chuẩn lớn để đánh giá định lượng nghiêm ngặt.
- Một số phương pháp hiện mới dừng ở mức heuristic và hỗ trợ giải thích.
- Kết quả có thể bị ảnh hưởng bởi resize, nén lại hoặc hậu xử lý ảnh.
- Hệ thống hiện phù hợp hơn với vai trò hỗ trợ tham khảo hơn là công cụ kết luận cuối cùng.
- Chưa có cơ chế benchmark sâu để so sánh khách quan hiệu quả từng phương pháp trên nhiều nhóm dữ liệu.
- Chưa mở rộng sang video và văn bản trong phần triển khai thực tế.

Những hạn chế này phản ánh đúng phạm vi của Project I. Chúng không làm giảm giá trị của đề tài, mà ngược lại còn chỉ ra rõ những việc cần làm tiếp nếu muốn nâng hệ thống từ mức minh họa lên mức nghiên cứu và ứng dụng cao hơn.

## 5.5. Phương hướng phát triển
Trong thời gian tới, đề tài có thể được mở rộng theo các hướng sau:

1. Xây dựng bộ dữ liệu kiểm thử gồm ảnh thật, ảnh AI và ảnh chỉnh sửa.
2. Đánh giá định lượng các phương pháp theo accuracy, precision, recall và F1-score.
3. Kết hợp 5 phương pháp hiện tại với mô hình machine learning để cải thiện độ chính xác.
4. Mở rộng thêm các phương pháp forensic khác khi phạm vi nghiên cứu cho phép.
5. Mở rộng hệ thống sang video và văn bản trong các giai đoạn tiếp theo.
6. Tích hợp các chuẩn provenance như C2PA để kiểm tra nguồn gốc nội dung có xác thực.

### 5.5.1. Hướng phát triển về dữ liệu
Một hướng rất quan trọng là xây dựng bộ dữ liệu kiểm thử đủ lớn và có gán nhãn rõ ràng. Khi có dữ liệu chuẩn, nhóm có thể tiến hành benchmark nghiêm túc hơn, từ đó xác định trọng số tốt hơn cho từng phương pháp và đánh giá khách quan hiệu quả của bộ phân tích tổng hợp.

### 5.5.2. Hướng phát triển về thuật toán
Ngoài các phương pháp hiện tại, nhóm có thể mở rộng thêm các kỹ thuật forensic khác như phân tích PRNU, consistency map, patch-level analysis hoặc kết hợp đặc trưng thủ công với mô hình học máy. Việc kết hợp heuristic và machine learning có thể là hướng cân bằng tốt giữa tính giải thích và hiệu quả dự đoán.

### 5.5.3. Hướng phát triển về hệ thống
Về mặt hệ thống, SourceVerify có thể phát triển thành một nền tảng đa phương tiện, không chỉ dành cho ảnh mà còn cho video và văn bản. Khi đó, kiến trúc hiện tại với cách tổ chức mô-đun sẽ phát huy rõ ưu điểm mở rộng.

### 5.5.4. Hướng phát triển về ứng dụng thực tiễn
Nếu được hoàn thiện hơn, hệ thống có thể được dùng như công cụ hỗ trợ giảng dạy, công cụ kiểm tra tham khảo trong môi trường truyền thông số hoặc một phần trong pipeline kiểm tra nguồn gốc nội dung. Tuy nhiên, để đạt tới mức đó, hệ thống cần được bổ sung dữ liệu, benchmark và cơ chế đánh giá nghiêm ngặt hơn.

## 5.6. Kết luận cuối cùng
Nhìn chung, SourceVerify đã đáp ứng đúng tinh thần của Project I: **tìm hiểu công nghệ, đặt vấn đề, đề xuất hướng giải quyết và hiện thực hóa thành một sản phẩm minh họa có ý nghĩa**. Trọng tâm 5 phương pháp nổi bật giúp báo cáo gọn hơn, rõ hơn và đồng thời vẫn đủ chiều sâu để phát triển thành một quyển báo cáo cuối kì có chất lượng.

Từ góc độ học thuật, đề tài cho thấy việc tiếp cận bài toán ảnh AI không nhất thiết phải bắt đầu bằng các mô hình lớn và phức tạp. Một hướng đi dựa trên digital image forensics, nếu được tổ chức hợp lý, vẫn có thể tạo ra giá trị nghiên cứu rõ ràng. Từ góc độ thực tiễn, đề tài cho thấy nhu cầu kiểm chứng nội dung số là hoàn toàn có thật và sẽ ngày càng quan trọng trong tương lai gần.

Có thể xem SourceVerify như một bước khởi đầu tốt để nhóm tiếp tục phát triển lên các đồ án hoặc nghiên cứu tiếp theo. Giá trị lớn nhất của đề tài không chỉ nằm ở sản phẩm hiện có, mà còn nằm ở nền tảng tư duy và cấu trúc kỹ thuật mà đề tài đã xây dựng được.