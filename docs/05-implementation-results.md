# Triển khai và kết quả

## 4.1. Môi trường và công nghệ triển khai
SourceVerify được xây dựng dưới dạng ứng dụng web minh họa nhằm hỗ trợ kiểm chứng ảnh số trong môi trường học thuật và thử nghiệm. Việc lựa chọn mô hình ứng dụng web giúp hệ thống dễ truy cập, thuận tiện trình bày trực tiếp và phù hợp với định hướng phát triển sản phẩm có khả năng sử dụng thực tế sau này.

Trong quá trình triển khai, nhóm ưu tiên các công nghệ có cộng đồng mạnh, tài liệu phong phú, dễ bảo trì và phù hợp với năng lực của sinh viên trong giai đoạn Project I. Mục tiêu không chỉ là làm ra một giao diện hoạt động được, mà còn là tổ chức một cấu trúc triển khai hợp lý để có thể tiếp tục mở rộng ở các học phần sau.

### 4.1.1. Công nghệ sử dụng
- **Frontend:** Next.js và React để xây dựng giao diện web hiện đại, hỗ trợ tổ chức thành phần rõ ràng.
- **Ngôn ngữ:** TypeScript để tăng tính an toàn kiểu dữ liệu, hỗ trợ bảo trì mã nguồn và giảm lỗi logic.
- **Xử lý ảnh:** Canvas và pixel buffer để đọc nội dung ảnh, chuyển thành dữ liệu số phục vụ phân tích.
- **Bộ phân tích:** các mô-đun nội bộ triển khai 5 phương pháp đã lựa chọn.
- **Cơ chế tổng hợp:** weighted scoring để sinh điểm AI cuối cùng từ nhiều phương pháp.
- **Tài liệu:** Markdown và LaTeX để soạn thảo báo cáo, thuận lợi cho việc chuyển sang PDF.

### 4.1.2. Lý do lựa chọn công nghệ
Next.js và React phù hợp với yêu cầu xây dựng nhanh giao diện có tính mô-đun, dễ cập nhật và thuận tiện khi trình bày trực tiếp. TypeScript hỗ trợ biểu diễn chặt chẽ các cấu trúc dữ liệu như metadata, kết quả phương pháp và kết quả tổng hợp. Canvas cho phép truy cập trực tiếp dữ liệu pixel ở phía trình duyệt, là điều cần thiết với các phương pháp phân tích ảnh dựa trên tín hiệu. Các công nghệ trên kết hợp với nhau tạo nên một nền tảng phù hợp với quy mô Project I.

### 4.1.3. Môi trường triển khai thử nghiệm
Hệ thống được triển khai trong môi trường phát triển cục bộ với đầy đủ các thành phần cần thiết để tải ảnh, xử lý dữ liệu và hiển thị kết quả. Ở mức thử nghiệm, cách tổ chức này đủ để minh họa quy trình xử lý và kiểm chứng ý tưởng. Trong tương lai, hệ thống có thể được triển khai trên hạ tầng cloud hoặc nền tảng hosting dành cho web app nếu cần mở rộng quy mô sử dụng.

## 4.2. Các chức năng đã triển khai
Trong giai đoạn hiện tại, sản phẩm đã triển khai được các chức năng chính sau:

1. **Tải ảnh lên để phân tích:** người dùng chọn ảnh từ thiết bị và gửi vào hệ thống.
2. **Kiểm tra tính hợp lệ của đầu vào:** hệ thống xác định định dạng, kích thước và khả năng đọc tệp.
3. **Đọc metadata và dữ liệu pixel:** trích xuất hai nhóm dữ liệu nền tảng để phục vụ phân tích.
4. **Chạy 5 phương pháp phân tích nổi bật:** hệ thống lần lượt kích hoạt từng phương pháp.
5. **Tổng hợp kết quả thành AI score:** kết hợp điểm của từng phương pháp bằng trọng số.
6. **Hiển thị kết quả kèm giải thích:** cung cấp cho người dùng kết quả cuối cùng và lý do hình thành kết quả.

### 4.2.1. Chức năng nhập dữ liệu
Giao diện nhập dữ liệu được thiết kế theo hướng đơn giản và trực quan. Người dùng chỉ cần chọn một tệp ảnh từ máy tính để bắt đầu quá trình phân tích. Cách tiếp cận này giúp giảm độ phức tạp khi sử dụng và phù hợp với mục tiêu minh họa của Project I.

### 4.2.2. Chức năng tiền xử lý
Sau khi nhận ảnh, hệ thống tiến hành các bước tiền xử lý như kiểm tra định dạng, đọc metadata, chuyển ảnh sang ma trận pixel và chuẩn hóa dữ liệu nếu cần. Bước này có vai trò rất quan trọng vì chất lượng dữ liệu đầu vào ảnh hưởng trực tiếp đến kết quả của các phương pháp phân tích.

### 4.2.3. Chức năng phân tích phương pháp
Mỗi phương pháp được triển khai như một mô-đun tương đối độc lập. Cách tổ chức này giúp dễ kiểm thử từng phần, dễ mở rộng thêm phương pháp mới và dễ giải thích trong báo cáo. Khi cần, nhóm có thể thay thế hoặc điều chỉnh một mô-đun mà không ảnh hưởng mạnh đến toàn bộ kiến trúc.

### 4.2.4. Chức năng tổng hợp và hiển thị
Sau khi các phương pháp hoàn thành, hệ thống đưa kết quả vào bộ tổng hợp điểm. Kết quả cuối cùng không chỉ bao gồm một điểm số, mà còn có phần giải thích để người dùng hiểu vì sao hệ thống nghiêng về ảnh thật hay ảnh AI. Đây là đặc điểm quan trọng giúp SourceVerify khác với các hệ thống chỉ trả về một nhãn cuối cùng mà không có diễn giải.

## 4.3. Quy trình xử lý một ảnh trong hệ thống
Quy trình xử lý trong hệ thống có thể mô tả theo các bước sau:

1. Người dùng tải ảnh lên từ giao diện web.
2. Hệ thống kiểm tra định dạng và khả năng đọc tệp.
3. Tệp ảnh được đưa vào khối tiền xử lý để trích xuất metadata và pixel.
4. Các mô-đun phân tích lần lượt chạy trên dữ liệu đầu vào.
5. Mỗi mô-đun trả về điểm số, mô tả ngắn và chi tiết tín hiệu.
6. Bộ tổng hợp tính toán điểm AI cuối cùng từ các kết quả thành phần.
7. Giao diện hiển thị kết quả tổng hợp và giải thích tương ứng.

Quy trình này tuy đơn giản nhưng đã thể hiện đầy đủ tinh thần của một hệ thống kiểm chứng đa phương pháp: nhận dữ liệu, phân tích, tổng hợp và giải thích.

## 4.4. Minh họa kết quả phân tích
Khi người dùng tải một ảnh lên, hệ thống trả về các thông tin chính sau:

- **Điểm AI tổng hợp** trên thang 100.
- **Mức nhận định** như nghiêng về ảnh thật, nghiêng về ảnh AI hoặc chưa đủ bằng chứng.
- **Điểm riêng của từng phương pháp** gồm Metadata Analysis, Noise Residual, DCT Block Artifacts, Chromatic Aberration và Spectral Nyquist Analysis.
- **Giải thích ngắn** về tín hiệu bất thường được phát hiện ở từng phương pháp.

### 4.4.1. Kịch bản minh họa 1: ảnh nghiêng về AI
Trong trường hợp ảnh có metadata cho thấy được tạo bằng công cụ AI hoặc không có dấu vết camera hợp lý, đồng thời phân tích nhiễu cho thấy ảnh quá sạch, cấu trúc miền tần số có mẫu lặp bất thường và dấu vết nén không phù hợp với lịch sử tệp, hệ thống sẽ đẩy điểm AI lên cao. Khi đó, kết quả cuối cùng có thể nghiêng về giả thuyết ảnh do AI tạo.

### 4.4.2. Kịch bản minh họa 2: ảnh nghiêng về ảnh thật
Nếu ảnh có metadata hợp lý từ camera, có nhiễu cảm biến tự nhiên, dấu vết nén JPEG phù hợp và không xuất hiện bất thường rõ trong miền tần số, hệ thống sẽ giảm điểm AI. Khi đó, ảnh được đánh giá là nghiêng về ảnh thật hoặc ít nhất là chưa có đủ dấu hiệu để nghiêng mạnh về AI.

### 4.4.3. Kịch bản minh họa 3: trường hợp không đủ bằng chứng
Một số ảnh sau khi qua nhiều bước xử lý như crop, resize, re-encode hoặc chụp màn hình có thể làm suy giảm các dấu vết ban đầu. Trong những trường hợp này, nhiều phương pháp có thể trả về điểm gần trung lập. Điều đó cho thấy hệ thống cần giữ thái độ thận trọng và tránh kết luận quá mức khi bằng chứng không rõ ràng.

## 4.5. Kết quả đạt được
Sau quá trình tìm hiểu và triển khai, đề tài đã đạt được các kết quả chính:

- Xây dựng được một sản phẩm web minh họa cho bài toán kiểm chứng ảnh AI.
- Tổ chức được quy trình phân tích từ đầu vào đến kết quả đầu ra.
- Chọn lọc và tích hợp thành công 5 phương pháp tiêu biểu có tính đại diện.
- Hình thành được cơ chế tổng hợp điểm có thể giải thích.
- Tạo nền tảng ban đầu cho việc nghiên cứu sâu hơn ở các giai đoạn tiếp theo.

Bên cạnh việc có một sản phẩm chạy được, kết quả quan trọng hơn là nhóm đã xây dựng được một mô hình tư duy rõ ràng cho bài toán: không kết luận chỉ từ một dấu hiệu, mà đặt kết quả vào bối cảnh của nhiều nguồn bằng chứng kỹ thuật khác nhau.

## 4.6. Đánh giá kết quả thực hiện
Trong phạm vi Project I, kết quả của SourceVerify nên được xem là **kết quả hỗ trợ tham khảo** chứ chưa phải hệ thống kết luận tuyệt đối. Giá trị lớn nhất của đề tài nằm ở những điểm sau:

- Khả năng trình bày rõ cách đặt vấn đề.
- Khả năng mô tả được hướng tiếp cận và giải pháp kỹ thuật.
- Việc hiện thực hóa ý tưởng thành sản phẩm minh họa cụ thể.
- Tính minh bạch khi giải thích vì sao hệ thống đưa ra kết quả.
- Khả năng mở rộng để tiếp tục nghiên cứu ở quy mô lớn hơn.

Nếu xét theo tiêu chí của Project I, đề tài đã đáp ứng tốt yêu cầu làm quen công nghệ, tìm hiểu hướng tiếp cận và có sản phẩm minh họa. Điểm mạnh của đề tài là sự kết hợp giữa phần nghiên cứu lý thuyết và phần triển khai thử nghiệm, giúp báo cáo không chỉ dừng ở mức ý tưởng.

## 4.7. Những hạn chế trong quá trình triển khai
Mặc dù đã đạt được một số kết quả tích cực, quá trình triển khai vẫn còn những hạn chế:
- Chưa có bộ dữ liệu chuẩn lớn để kiểm thử định lượng.
- Chưa thực hiện benchmark toàn diện cho từng phương pháp trên nhiều loại ảnh.
- Một số phương pháp nhạy với ảnh bị nén lại hoặc hậu xử lý.
- Hệ thống hiện chủ yếu phù hợp để minh họa nghiên cứu hơn là phục vụ sử dụng đại trà.

Những hạn chế này là bình thường trong phạm vi Project I, đồng thời cũng chỉ ra rõ những hướng phát triển tiếp theo cho đề tài.

## 4.8. Kết luận chương
Chương này cho thấy SourceVerify không chỉ dừng ở mức khảo sát lý thuyết mà đã được triển khai thành một hệ thống thử nghiệm có cấu trúc rõ ràng. Dù chưa phải sản phẩm hoàn chỉnh, hệ thống đã đủ để minh họa hướng tiếp cận kiểm chứng ảnh AI bằng 5 phương pháp nổi bật, đồng thời tạo nền tảng tốt để tiếp tục mở rộng ở các giai đoạn sau.