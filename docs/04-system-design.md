# Phân tích và thiết kế hệ thống

## 3.1. Mục tiêu thiết kế hệ thống
Hệ thống SourceVerify được thiết kế để hỗ trợ người dùng kiểm tra nhanh một ảnh số và nhận về kết quả đánh giá có giải thích. Với đặc thù của Project I, mục tiêu thiết kế không phải là xây dựng một hệ thống thương mại hoàn chỉnh, mà là tạo ra một nền tảng minh họa rõ ràng cho quy trình phân tích ảnh bằng nhiều phương pháp forensic.

Bên cạnh đó, thiết kế hệ thống còn phải bảo đảm một số định hướng quan trọng. Thứ nhất là hệ thống cần đủ đơn giản để sinh viên có thể nắm rõ và trình bày được toàn bộ luồng xử lý. Thứ hai là kiến trúc phải đủ mở để sau này có thể bổ sung thêm phương pháp, dữ liệu hoặc loại nội dung khác như video và văn bản. Thứ ba là kết quả phân tích phải có khả năng giải thích, bởi đây là yêu cầu rất quan trọng trong các hệ thống hỗ trợ kiểm chứng.

Nói cách khác, mục tiêu của chương này không chỉ là mô tả các thành phần kỹ thuật, mà còn cho thấy cách nhóm biến ý tưởng nghiên cứu thành một hệ thống có cấu trúc rõ ràng, có luồng xử lý hợp lý và có khả năng mở rộng trong tương lai.

## 3.2. Yêu cầu hệ thống
### 3.2.1. Yêu cầu chức năng
Hệ thống cần đáp ứng các chức năng chính sau:

1. Cho phép người dùng tải ảnh lên từ giao diện web.
2. Kiểm tra định dạng và tính hợp lệ của tệp ảnh.
3. Trích xuất metadata và dữ liệu pixel từ ảnh đầu vào.
4. Thực hiện phân tích theo 5 phương pháp đã chọn.
5. Tổng hợp điểm từ các phương pháp thành kết quả chung.
6. Hiển thị mức độ nghi ngờ ảnh do AI tạo cùng giải thích cho từng phương pháp.

Các yêu cầu chức năng trên được xây dựng xoay quanh một kịch bản sử dụng điển hình: người dùng đưa một ảnh vào hệ thống và mong muốn nhận được một kết quả tổng hợp đủ dễ hiểu để hỗ trợ đánh giá. Vì vậy, hệ thống không chỉ cần “chạy ra kết quả”, mà còn phải cung cấp ngữ cảnh diễn giải cho kết quả đó.

### 3.2.2. Yêu cầu phi chức năng
- **Tính mở rộng:** dễ bổ sung thêm phương pháp mới sau này.
- **Tính minh bạch:** phải hiển thị được lý do hình thành kết quả.
- **Hiệu năng:** thời gian phân tích ở mức chấp nhận được với ảnh phổ biến.
- **Tính an toàn dữ liệu:** ưu tiên xử lý cục bộ, hạn chế gửi ảnh lên máy chủ.
- **Tính bảo trì:** mã nguồn cần được tổ chức rõ ràng theo mô-đun.
- **Tính ổn định:** hệ thống phải xử lý được các trường hợp đầu vào không hợp lệ.

Những yêu cầu phi chức năng này có ý nghĩa rất lớn trong định hình kiến trúc. Ví dụ, nếu không ưu tiên tính minh bạch thì nhóm có thể chọn một mô hình học sâu “hộp đen” để ra kết quả nhanh hơn, nhưng điều đó lại không phù hợp với tinh thần học thuật của Project I. Tương tự, nếu bỏ qua tính mở rộng thì hệ thống có thể đơn giản ở giai đoạn đầu nhưng sẽ rất khó nâng cấp trong tương lai.

## 3.3. Kiến trúc tổng thể của hệ thống
SourceVerify được thiết kế theo kiến trúc web đơn giản, gồm các lớp chính:

- **Lớp giao diện người dùng:** tiếp nhận thao tác tải ảnh và hiển thị kết quả.
- **Lớp điều phối phân tích:** xác định loại dữ liệu, gọi các mô-đun xử lý tương ứng.
- **Lớp phương pháp phân tích:** triển khai 5 phương pháp forensic đã chọn.
- **Lớp tổng hợp điểm:** kết hợp kết quả từ các phương pháp để đưa ra nhận định cuối.
- **Lớp trình bày kết quả:** diễn giải tín hiệu và mức độ nghi ngờ cho người dùng.

Kiến trúc này phù hợp với Project I vì dễ hiểu, dễ triển khai và thuận tiện cho việc trình bày trực tiếp. Đồng thời, việc tách thành các lớp cũng giúp làm rõ trách nhiệm của từng thành phần. Giao diện không phải gánh logic phân tích, còn các phương pháp phân tích không cần quan tâm tới cách hiển thị kết quả. Điều đó giúp hệ thống bớt rối và dễ bảo trì hơn.

### 3.3.1. Lớp giao diện người dùng
Đây là lớp đầu tiên tương tác trực tiếp với người dùng. Nhiệm vụ chính của lớp này là nhận tệp ảnh, hiển thị trạng thái xử lý và trình bày kết quả cuối cùng dưới dạng dễ quan sát. Đối với Project I, lớp giao diện không cần quá phức tạp, nhưng phải đủ trực quan để phục vụ trình bày trực tiếp.

### 3.3.2. Lớp điều phối phân tích
Lớp điều phối đóng vai trò “trung tâm điều khiển” của hệ thống. Sau khi nhận dữ liệu đầu vào từ giao diện, lớp này chịu trách nhiệm xác thực dữ liệu, chuẩn hóa cấu trúc cần thiết và kích hoạt các phương pháp phân tích theo đúng thứ tự. Đây là thành phần quan trọng để bảo đảm toàn bộ hệ thống vận hành nhất quán.

### 3.3.3. Lớp phương pháp phân tích
Mỗi phương pháp được triển khai như một mô-đun tương đối độc lập. Đây là cách tổ chức phù hợp với tư duy thiết kế hiện đại: mỗi mô-đun chịu trách nhiệm cho một nhiệm vụ cụ thể, giúp dễ kiểm thử, dễ thay thế và dễ mở rộng. Nếu trong tương lai cần thêm phương pháp mới, nhóm có thể bổ sung mà không phải viết lại toàn bộ hệ thống.

### 3.3.4. Lớp tổng hợp điểm
Sau khi nhận kết quả từ các mô-đun, lớp tổng hợp sử dụng cơ chế weighted scoring để tính toán điểm AI cuối cùng. Lớp này đóng vai trò chuyển từ các tín hiệu riêng lẻ sang một nhận định tổng quát, giúp người dùng có cái nhìn dễ hiểu hơn về ảnh đang được kiểm tra.

### 3.3.5. Lớp trình bày kết quả
Khác với nhiều hệ thống chỉ trả về điểm số cuối cùng, SourceVerify cố gắng trình bày cả phần diễn giải. Điều này giúp hệ thống có tính minh bạch cao hơn, đồng thời hỗ trợ tốt hơn cho mục tiêu học thuật và trình bày báo cáo.

## 3.4. Phân rã chức năng hệ thống
Có thể phân rã hệ thống thành 5 khối chức năng chính:

### 3.4.1. Khối nhập dữ liệu
- Nhận tệp ảnh từ người dùng.
- Kiểm tra định dạng tệp như JPG, PNG, WebP.
- Tạo phiên làm việc phân tích.

Khối này tuy đơn giản nhưng có ý nghĩa rất quan trọng vì nó quyết định chất lượng dữ liệu đi vào toàn hệ thống. Nếu đầu vào không được kiểm tra kỹ, các bước sau có thể trả về kết quả sai hoặc gây lỗi xử lý.

### 3.4.2. Khối tiền xử lý
- Đọc metadata của tệp.
- Chuyển ảnh thành ma trận pixel.
- Chuẩn hóa kích thước nếu ảnh quá lớn.

Tiền xử lý là bước “làm sạch và chuẩn hóa” đầu vào trước khi đưa sang các mô-đun phân tích. Trong bài toán ảnh số, việc trích xuất được cả metadata lẫn dữ liệu pixel là nền tảng cho hầu hết các phương pháp forensic.

### 3.4.3. Khối phân tích phương pháp
- Chạy **Metadata Analysis**.
- Chạy **Noise Residual**.
- Chạy **DCT Block Artifacts**.
- Chạy **Chromatic Aberration**.
- Chạy **Spectral Nyquist Analysis**.

Khối này là lõi chuyên môn của hệ thống. Mỗi phương pháp đại diện cho một hướng nhìn riêng về ảnh, do đó sự kết hợp của 5 phương pháp tạo thành một bức tranh tổng quát hơn về mức độ đáng nghi của ảnh.

### 3.4.4. Khối tổng hợp điểm
- Thu thập điểm từ từng phương pháp.
- Áp dụng trọng số cho từng phương pháp.
- Tính AI score tổng hợp.
- Sinh nhãn kết quả và mức độ tin cậy.

Bộ tổng hợp giúp biến nhiều tín hiệu phức tạp thành một chỉ báo trung tâm. Đây là thành phần quan trọng để hệ thống có thể phục vụ cả người dùng phổ thông, những người không nhất thiết phải đọc từng tín hiệu kỹ thuật riêng lẻ.

### 3.4.5. Khối hiển thị kết quả
- Hiển thị điểm tổng hợp.
- Hiển thị điểm riêng của từng phương pháp.
- Giải thích ngắn gọn nguyên nhân phương pháp nghiêng về AI hay ảnh thật.

Khối hiển thị kết quả có vai trò chuyển hóa thông tin kỹ thuật thành nội dung người dùng có thể hiểu và sử dụng. Trong các hệ thống hỗ trợ quyết định, đây là khâu rất quan trọng vì kết quả đúng nhưng khó hiểu thì giá trị sử dụng vẫn bị hạn chế.

## 3.5. Luồng dữ liệu của hệ thống
Luồng xử lý cho một lần phân tích ảnh gồm các bước sau:

1. Người dùng tải ảnh lên hệ thống.
2. Hệ thống kiểm tra định dạng và kích thước tệp.
3. Ảnh được đọc metadata và trích xuất dữ liệu pixel.
4. Bộ điều phối lần lượt gọi 5 phương pháp phân tích.
5. Mỗi phương pháp trả về điểm số và mô tả tín hiệu.
6. Bộ tổng hợp tính điểm AI cuối cùng theo trọng số.
7. Giao diện hiển thị kết quả tổng hợp và giải thích chi tiết.

### 3.5.1. Ý nghĩa của luồng dữ liệu
Luồng dữ liệu trên phản ánh tư duy thiết kế tuần tự, rõ ràng và phù hợp với phạm vi Project I. Mỗi bước đều có đầu vào và đầu ra tương đối tách bạch, giúp việc kiểm soát lỗi và trình bày logic hệ thống trở nên dễ dàng hơn.

### 3.5.2. Khả năng mở rộng của luồng xử lý
Nếu trong tương lai nhóm muốn bổ sung thêm các phương pháp mới hoặc mở rộng sang video, chỉ cần chèn thêm mô-đun phân tích và cập nhật khối tổng hợp mà không phải thay đổi bản chất luồng xử lý. Đây chính là ưu điểm lớn của việc thiết kế hệ thống theo dạng mô-đun.

## 3.6. Thiết kế dữ liệu
Để thống nhất kết quả giữa các phương pháp, hệ thống sử dụng ba cấu trúc logic chính:

### 3.6.1. FileMetadata
Lưu các thông tin mô tả tệp như tên tệp, định dạng, kích thước, phần mềm tạo ảnh, thông tin EXIF và các thuộc tính liên quan đến nguồn gốc tệp.

Vai trò của cấu trúc này là tạo một biểu diễn thống nhất cho tất cả dữ liệu phụ trợ của tệp. Nhờ đó, các phương pháp cần metadata có thể truy cập theo cùng một chuẩn thay vì phải đọc lại tệp theo nhiều cách khác nhau.

### 3.6.2. AnalysisMethod
Lưu kết quả của một phương pháp phân tích gồm:
- Tên phương pháp.
- Điểm số.
- Trọng số.
- Mô tả ngắn.
- Chi tiết tín hiệu phát hiện.

Cấu trúc này rất quan trọng vì nó giúp chuẩn hóa đầu ra của tất cả các phương pháp. Dù cách hoạt động bên trong mỗi phương pháp rất khác nhau, kết quả cuối cùng vẫn được đóng gói theo cùng một kiểu dữ liệu. Nhờ đó, bộ tổng hợp có thể hoạt động thống nhất.

### 3.6.3. AnalysisResult
Lưu kết quả cuối cùng của cả phiên phân tích gồm:
- Điểm AI tổng hợp.
- Nhãn nhận định.
- Danh sách các phương pháp đã chạy.
- Giải thích kết quả tổng quát.

Cấu trúc này giúp hệ thống gắn toàn bộ thông tin của một phiên phân tích vào cùng một đối tượng logic. Điều đó thuận tiện cho việc hiển thị, ghi log, tái sử dụng hoặc mở rộng thành báo cáo tự động sau này.

## 3.7. Lý do lựa chọn kiến trúc hiện tại
Nhóm chọn mô hình **Next.js kết hợp module phân tích nội bộ** thay vì microservice hoặc mô hình học máy end-to-end vì các lý do sau:

- Phù hợp phạm vi Project I.
- Giảm độ phức tạp triển khai.
- Dễ trình bày rõ luồng xử lý và các phương pháp.
- Thuận tiện cho việc mở rộng thêm phương pháp trong các giai đoạn tiếp theo.
- Không yêu cầu hạ tầng phức tạp như queue, service orchestration hoặc môi trường training riêng.

Nếu nhóm chọn kiến trúc microservice ngay từ đầu, chi phí triển khai và trình bày sẽ tăng lên đáng kể, trong khi giá trị học thuật thu được ở giai đoạn này chưa chắc tương xứng. Ngược lại, nếu chọn mô hình deep learning end-to-end, nhóm sẽ phải phụ thuộc rất mạnh vào dữ liệu huấn luyện và khâu đánh giá, dễ vượt khỏi phạm vi học phần. Vì vậy, kiến trúc hiện tại là phương án cân bằng tốt giữa tính khả thi, tính minh bạch và khả năng mở rộng.

## 3.8. Kết luận chương
Từ phân tích trên, có thể thấy SourceVerify được thiết kế theo hướng đơn giản nhưng có cấu trúc rõ ràng. Hệ thống đủ khả năng minh họa quy trình kiểm chứng ảnh số bằng 5 phương pháp nổi bật, đồng thời vẫn giữ được khả năng mở rộng cho các nghiên cứu sau này.

Chương này cũng cho thấy một điểm quan trọng của đồ án: giá trị của đề tài không chỉ nằm ở việc “có sản phẩm”, mà còn nằm ở cách tổ chức tư duy hệ thống. Việc xác định đúng yêu cầu, phân lớp rõ ràng, chuẩn hóa dữ liệu và thiết kế luồng xử lý hợp lý chính là nền tảng để SourceVerify có thể phát triển tiếp ở những giai đoạn sau.