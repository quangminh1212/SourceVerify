# Kết luận và phương hướng phát triển

## Kết luận chung
SourceVerify là đề tài có ý nghĩa thực tiễn trong bối cảnh nội dung số do AI tạo sinh ngày càng phổ biến. Báo cáo đã trình bày từ bối cảnh, tính cấp thiết, cơ sở lý thuyết, phân tích thiết kế hệ thống đến kết quả triển khai. Trọng tâm báo cáo là 5 nhóm tín hiệu ảnh hiệu quả, được phân tích theo ý tưởng, dấu hiệu phát hiện, ưu điểm và hạn chế.

Qua đề tài, sinh viên làm quen với nhiều nền tảng công nghệ: xử lý ảnh, phân tích thống kê, thiết kế web bằng Next.js, tổ chức module TypeScript và thiết kế hệ thống theo hướng dễ mở rộng.

## Các công việc đã hoàn thành
- Khảo sát bài toán phát hiện nội dung AI và các rủi ro liên quan.
- Thiết kế kiến trúc tổng thể của SourceVerify.
- Xây dựng mô hình dữ liệu cho method, signal và kết quả phân tích.
- Trình bày 5 nhóm tín hiệu ảnh nổi bật trong hệ thống.
- Xây dựng sản phẩm minh họa có khả năng phân tích và giải thích kết quả.
- Hoàn thiện báo cáo theo dạng quyển đồ án có sơ đồ, bảng biểu và tài liệu tham khảo.

## Các hạn chế còn tồn tại
- Chưa có benchmark dataset lớn, cân bằng và được gán nhãn chuẩn.
- Một số method hiện dựa trên heuristic nên chưa thể thay thế mô hình học máy chuyên sâu.
- Chưa có đánh giá định lượng đầy đủ bằng accuracy, precision, recall, F1-score và ROC-AUC.
- Kết quả có thể bị ảnh hưởng bởi ảnh bị nén lại, crop, resize hoặc chỉnh sửa qua nhiều nền tảng.

## Phương hướng phát triển
1. Xây dựng tập dữ liệu kiểm thử gồm ảnh thật, ảnh AI, ảnh đã chỉnh sửa và ảnh đã nén lại.
2. Bổ sung pipeline benchmark để đo hiệu quả từng method và hiệu quả khi kết hợp nhiều method.
3. Kết hợp method heuristic với mô hình machine learning hoặc deep learning để tăng độ chính xác.
4. Mở rộng phân tích video bằng optical flow, temporal consistency, lip-sync và audio-visual synchronization.
5. Mở rộng phân tích văn bản bằng perplexity, burstiness, stylometry, coherence và syntactic complexity.
6. Tích hợp chuẩn provenance như C2PA để kiểm tra nguồn gốc nội dung có chữ ký xác thực.