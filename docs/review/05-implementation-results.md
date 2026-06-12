# Triển khai và kết quả

## Môi trường và công nghệ triển khai
Sản phẩm SourceVerify được triển khai trên nền tảng web hiện đại. Next.js và React xử lý giao diện, TypeScript tăng an toàn kiểu dữ liệu, Canvas cho phép đọc ảnh và pixel. Các module method được đóng gói thành hàm riêng, dễ dàng kiểm thử và tái sử dụng.

### Công nghệ sử dụng
- Frontend: React / Next.js — xây dựng giao diện và trang kết quả
- Ngôn ngữ: TypeScript — an toàn kiểu, dễ bảo trì module
- Xử lý ảnh: Canvas / Pixel buffer — đọc ảnh, lấy ma trận pixel
- Analyzer: Module nội bộ — chạy method và trả signal thống nhất
- Scoring: Weighted scoring — tổng hợp điểm và sinh verdict
- Tài liệu: LaTeX — quyển báo cáo học thuật

## Các chức năng đã triển khai và minh họa kết quả
Trong phạm vi sản phẩm thử nghiệm, SourceVerify đã có giao diện chính, cơ chế phân tích ảnh đa method, trang tài liệu method và i18n.

Minh họa tổng hợp điểm từ nhiều nhóm tín hiệu:
- AI Score trung tâm: 68/100
- Các nhóm tín hiệu xung quanh: Metadata, Frequency, Noise, Edges, Color

## Đánh giá kết quả thực hiện
Đề tài đã đạt được các kết quả quan trọng:

- Xác định rõ bài toán kiểm chứng nội dung số trong thời đại AI tạo sinh.
- Xây dựng được kiến trúc hệ thống có thể mở rộng theo method.
- Tìm hiểu và trình bày được 5 nhóm tín hiệu ảnh hiệu quả trong digital forensics.
- Triển khai sản phẩm minh họa có giao diện web và module phân tích nội bộ.

Ở giai đoạn Project I, kết quả của SourceVerify nên được hiểu là kết quả hỗ trợ tham khảo. Hệ thống chưa thể kết luận tuyệt đối một ảnh là AI hay thật trong mọi trường hợp, nhưng có ưu điểm là minh bạch và giải thích được lý do dự đoán.