# Cơ sở lý thuyết

## Tổng quan về AI-generated content
AI-generated content là nội dung được tạo ra hoàn toàn hoặc một phần bởi mô hình trí tuệ nhân tạo. Với ảnh, các mô hình phổ biến gồm GAN, diffusion model và các biến thể text-to-image. Với văn bản, các mô hình ngôn ngữ lớn có thể tạo đoạn văn trôi chảy, nhất quán và có phong cách gần giống con người. Với video, các mô hình deepfake và text-to-video có thể mô phỏng chuyển động, biểu cảm và bối cảnh.

Điểm khó của bài toán là nội dung AI ngày càng giống thật. Nếu chỉ quan sát bằng mắt, người dùng có thể bỏ qua các lỗi nhỏ về thống kê tín hiệu. Ngược lại, các method forensic cố gắng tìm dấu vết mà mắt người khó nhận thấy: sự thiếu tự nhiên của nhiễu cảm biến, phân bố tần số bất thường, tương quan màu không hợp lý, hoặc metadata cho thấy phần mềm tạo ảnh.

## Cơ sở của digital image forensics
Digital image forensics là lĩnh vực nghiên cứu các kỹ thuật kiểm tra tính xác thực của ảnh số. Một bức ảnh chụp từ camera thật thường chịu ảnh hưởng của nhiều yếu tố vật lý:

- Cảm biến ảnh tạo ra nhiễu đặc trưng theo thiết bị.
- Ống kính gây sai lệch màu, méo hình hoặc khác biệt ánh sáng nhỏ.
- Bộ xử lý ảnh trong camera thực hiện demosaicing, sharpening và nén JPEG.
- Quá trình lưu, truyền và chỉnh sửa để lại artifact ở metadata, miền tần số và miền không gian.

Ảnh AI không đi qua đầy đủ chuỗi vật lý đó. Mô hình sinh ảnh học phân bố dữ liệu và tạo ảnh mới từ không gian ẩn. Vì vậy, ảnh AI có thể trông rất thật nhưng vẫn thiếu một số dấu vết camera hoặc có mẫu thống kê quá đều. SourceVerify khai thác chính sự khác biệt này.

## Cách tiếp cận đa tín hiệu
Một method đơn lẻ thường không đủ kết luận chắc chắn. Ví dụ, ảnh thật được nén lại nhiều lần có thể mất metadata; ảnh AI được chỉnh sửa hậu kỳ có thể có artifact giống ảnh thật; ảnh chụp màn hình có thể làm thay đổi dấu vết nén. Vì vậy, SourceVerify áp dụng cách tiếp cận đa tín hiệu: nhiều method cùng phân tích một tệp, sau đó hệ thống tổng hợp điểm.

Ưu điểm của hướng đa tín hiệu là:

- Giảm phụ thuộc vào một dấu hiệu duy nhất.
- Dễ giải thích kết quả cho người dùng.
- Có thể mở rộng dần bằng cách thêm method mới.
- Phù hợp với giai đoạn Project I vì không bắt buộc phải có tập dữ liệu huấn luyện lớn.

## Mô hình tổng hợp điểm
Mỗi method trả về một điểm trong khoảng từ 0 đến 100. Điểm cao biểu thị xu hướng nghiêng về AI, điểm thấp biểu thị xu hướng nghiêng về ảnh thật, còn điểm xấp xỉ 50 thể hiện chưa đủ bằng chứng. Hệ thống dùng trọng số để phản ánh mức độ quan trọng tương đối của từng method.

`Score_AI = Σ(score_i × weight_i) / Σ(weight_i)`

Sau bước trung bình có trọng số, hệ thống có thể điều chỉnh thêm theo số lượng tín hiệu mạnh. Nếu nhiều method độc lập cùng nghiêng về AI, điểm tổng tăng; nếu nhiều method cùng nghiêng về ảnh thật, điểm tổng giảm. Mục tiêu của bước này là phản ánh mức độ đồng thuận giữa các method.

## Năm nhóm tín hiệu hiệu quả của SourceVerify
Hệ thống phân tích ảnh thành 5 nhóm tín hiệu chính: nguồn gốc tệp, miền tần số, nhiễu/kết cấu, biên cạnh/thống kê và màu sắc/nén ảnh.

### Metadata Analysis
Metadata là thông tin mô tả đi kèm tệp ảnh, ví dụ tên phần mềm, thời gian tạo, kích thước, thiết bị chụp, thông tin EXIF hoặc profile màu. Nếu metadata ghi nhận phần mềm tạo ảnh như một công cụ AI, đây là tín hiệu mạnh. Ngược lại, nếu ảnh có thông tin camera hợp lý, điều đó có thể ủng hộ giả thuyết ảnh thật.

Tuy nhiên, metadata rất dễ bị xoá hoặc sửa. Do đó, SourceVerify không dùng metadata làm bằng chứng duy nhất. Method này phù hợp để phát hiện các trường hợp rõ ràng, đồng thời hỗ trợ người dùng hiểu nguồn gốc tệp ban đầu.

### Spectral Nyquist Analysis
Phân tích Nyquist tập trung vào miền tần số của ảnh. Ảnh sinh bởi AI hoặc ảnh được upscale có thể để lại các mẫu lặp ở tần số cao, nhất là gần biên Nyquist. Những mẫu này không phải lúc nào cũng thấy bằng mắt thường nhưng có thể xuất hiện khi phân tích gradient hoặc phổ tần số.

### Multi-scale Reconstruction
Multi-scale Reconstruction đánh giá sự ổn định của ảnh ở nhiều mức phân giải. Ảnh tự nhiên thường có biến thiên cục bộ phức tạp; khi giảm và khôi phục kích thước, sai số tái tạo có thể thay đổi theo vùng. Ảnh AI đôi khi có sai số đồng đều hơn do cấu trúc được sinh ra từ mô hình.

### Noise Residual
Noise Residual tách phần nhiễu còn lại sau khi loại bỏ thành phần mượt của ảnh. Camera thật thường tạo nhiễu cảm biến không hoàn toàn đồng nhất. Nhiễu còn phụ thuộc ánh sáng, ISO, cảm biến và pipeline xử lý ảnh. Ảnh AI có thể quá sạch hoặc có nhiễu không giống nhiễu vật lý.

### Edge Coherence
Edge Coherence phân tích các đường biên và vùng chuyển tiếp. Ảnh thật thường có biên cạnh chịu ảnh hưởng bởi vật thể, ánh sáng, chuyển động, lens blur và sharpening. Ảnh AI có thể tạo đường biên quá mượt, thiếu vi sai hoặc không nhất quán giữa các vùng.

### Gradient Micro-Texture
Gradient Micro-Texture đánh giá các thay đổi rất nhỏ trong vùng chuyển sắc và vùng bề mặt. Ảnh thật thường có micro-texture do cảm biến, chất liệu vật thể, ánh sáng và nhiễu tự nhiên. Ảnh AI, đặc biệt ảnh được làm mịn, có thể thiếu loại kết cấu nhỏ này.

### Benford's Law
Benford's Law là quy luật thống kê về phân bố chữ số đầu trong nhiều dữ liệu tự nhiên. Trong ảnh, ý tưởng tương tự có thể áp dụng cho phân bố độ lớn gradient hoặc các đặc trưng số học khác. Nếu phân bố lệch quá nhiều so với mẫu tự nhiên, ảnh có thể đã qua tổng hợp hoặc xử lý bất thường.

### Chromatic Aberration
Chromatic Aberration là sai lệch màu nhỏ do ống kính thật gây ra, thường xuất hiện ở vùng biên có độ tương phản cao. Camera thật và ống kính vật lý có thể để lại viền màu nhẹ giữa các kênh RGB. Ảnh AI không nhất thiết có dấu vết quang học này.

### DCT Block Artifacts
JPEG sử dụng biến đổi DCT theo khối. Quá trình nén tạo ra artifact đặc trưng, nhất là ở ảnh đã lưu nhiều lần hoặc có chất lượng nén thấp. Ảnh thật thường có dấu vết nén phù hợp với lịch sử lưu ảnh, trong khi ảnh AI có thể có vết nén quá đều, thiếu tự nhiên hoặc không tương thích với metadata.

### Color Channel Correlation
Trong ảnh tự nhiên, ba kênh màu R, G, B có tương quan do ánh sáng, bề mặt vật thể, cảm biến và pipeline xử lý ảnh. Ảnh AI có thể sinh kênh màu theo cách không hoàn toàn giống camera thật, dẫn đến tương quan bất thường hoặc quá đều.

## Tóm tắt 5 nhóm tín hiệu
1. Nguồn gốc tệp — Metadata Analysis — phần mềm tạo ảnh, EXIF, kích thước, tên tệp — dễ bị xoá/sửa.
2. Miền tần số — Spectral Nyquist, Multi-scale Reconstruction — đỉnh tần số, artifact upsampling, sai số tái tạo bất thường — bị ảnh hưởng bởi resize.
3. Nhiễu/kết cấu — Noise Residual, Gradient Micro-Texture — nhiễu quá sạch, thiếu micro-texture tự nhiên — nhạy với nén/filter.
4. Biên cạnh/thống kê — Edge Coherence, Benford's Law — biên quá mượt, phân bố gradient lệch tự nhiên — không kết luận đơn lẻ.
5. Màu sắc/nén ảnh — Chromatic Aberration, DCT Block Artifacts, Color Channel Correlation — sai lệch màu, vết nén JPEG, tương quan RGB bất thường — phụ thuộc chỉnh sửa ảnh.