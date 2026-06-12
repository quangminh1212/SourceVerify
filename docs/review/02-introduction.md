# Giới thiệu đề tài

## Bối cảnh hình thành đề tài
AI tạo sinh đã thay đổi mạnh mẽ cách con người sản xuất nội dung số. Trước đây, việc tạo một bức ảnh chân thực hoặc một đoạn nội dung thuyết phục thường cần thiết bị chuyên dụng, kỹ năng thiết kế và thời gian biên tập. Hiện nay, người dùng phổ thông có thể tạo ảnh, bài viết, video ngắn, giọng nói hoặc mô phỏng khuôn mặt chỉ bằng một lời nhắc ngắn. Điều này đem lại nhiều giá trị tích cực cho giáo dục, sáng tạo nội dung, truyền thông và nghiên cứu.

Tuy nhiên, mặt trái của xu hướng này là sự gia tăng của nội dung không rõ nguồn gốc. Một bức ảnh AI có thể được dùng để minh họa sự kiện không có thật; một đoạn văn AI có thể được dùng để tạo bình luận giả; một video deepfake có thể gây ảnh hưởng đến uy tín cá nhân hoặc tổ chức. Khi nội dung số trở nên khó phân biệt bằng mắt thường, xã hội cần các công cụ hỗ trợ kiểm chứng để giảm rủi ro tiếp nhận sai thông tin.

SourceVerify ra đời từ nhu cầu đó. Hệ thống không cố gắng thay thế chuyên gia giám định số, mà đóng vai trò như một công cụ hỗ trợ phân tích ban đầu. Bằng cách tổng hợp nhiều tín hiệu khác nhau, SourceVerify giúp người dùng hiểu vì sao một nội dung có thể đáng nghi, tín hiệu nào ủng hộ giả thuyết AI và tín hiệu nào ủng hộ giả thuyết nội dung thật.

## Tính cấp thiết của đề tài
Đề tài có tính cấp thiết ở cả khía cạnh xã hội và kỹ thuật.

Về xã hội, nội dung giả mạo có thể ảnh hưởng đến nhận thức cộng đồng, danh dự cá nhân và quyết định của tổ chức. Khi người dùng thiếu công cụ kiểm tra, họ dễ phụ thuộc vào cảm nhận chủ quan. Điều này đặc biệt nguy hiểm trong bối cảnh mạng xã hội lan truyền thông tin với tốc độ cao.

Về kỹ thuật, bài toán phát hiện AI-generated content là bài toán mở. Các mô hình sinh ảnh ngày càng tốt hơn, còn các dấu vết bất thường ngày càng tinh vi hơn. Do đó, việc tìm hiểu nhiều nhóm method khác nhau là cần thiết: metadata, tần số, nhiễu, biên cạnh, nén ảnh, màu sắc, kết cấu và provenance. Project I là cơ hội phù hợp để tiếp cận bài toán theo hướng nền tảng, không quá phụ thuộc vào mô hình học sâu lớn nhưng vẫn có tính thực tiễn.

## Mục tiêu nghiên cứu
Đề tài SourceVerify đặt ra các mục tiêu chính sau:

- Tìm hiểu bài toán kiểm chứng nội dung số trong bối cảnh AI tạo sinh.
- Khảo sát các nhóm phương pháp forensic có thể áp dụng cho ảnh, văn bản và video.
- Phân tích sâu 5 nhóm tín hiệu ảnh hiệu quả nhất, có khả năng giải thích tốt và phù hợp với phạm vi Project I.
- Thiết kế kiến trúc hệ thống web có khả năng nhận tệp, tiền xử lý, phân tích, tổng hợp điểm và hiển thị kết quả.
- Xây dựng sản phẩm minh họa bằng Next.js, React, TypeScript và các module phân tích nội bộ.
- Đề xuất hướng phát triển tiếp theo để nâng hệ thống từ mức thử nghiệm lên mức đánh giá định lượng nghiêm túc hơn.

## Đối tượng và phạm vi nghiên cứu
Đối tượng nghiên cứu của đề tài là nội dung số có khả năng được tạo hoặc chỉnh sửa bởi AI. Trong phạm vi sản phẩm SourceVerify, hệ thống có hướng mở rộng cho ảnh, văn bản và video. Tuy nhiên, do thời lượng Project I có hạn, báo cáo tập trung nhiều nhất vào ảnh vì ảnh số chứa nhiều dấu vết vật lý và thống kê có thể giải thích rõ ràng.

Phạm vi báo cáo gồm:

- Trình bày tổng quan bài toán phát hiện nội dung AI.
- Phân tích 5 nhóm tín hiệu ảnh nổi bật theo ý tưởng, đầu vào, đầu ra, ưu điểm và hạn chế.
- Thiết kế hệ thống SourceVerify ở mức kiến trúc, chức năng và luồng dữ liệu.
- Mô tả kết quả triển khai ban đầu của sản phẩm phần mềm.

## Phương pháp thực hiện
Quy trình thực hiện đề tài được chia thành năm bước: khảo sát bài toán, chọn method, thiết kế kiến trúc, triển khai thử nghiệm và đánh giá định tính. Hình `fig:research-process` mô tả quy trình thực hiện ở mức tổng quát.