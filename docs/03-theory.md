# Cơ sở lý thuyết

## 2.1. Tổng quan về bài toán phát hiện ảnh do AI tạo
Ảnh do AI tạo sinh là ảnh được tạo ra hoàn toàn hoặc một phần bởi các mô hình như GAN, diffusion model hoặc các hệ thống text-to-image hiện đại. Những ảnh này có thể đạt chất lượng rất cao, bố cục hợp lý và màu sắc thuyết phục, khiến việc nhận biết bằng mắt thường ngày càng khó khăn.

Khác với ảnh chụp từ camera thật, ảnh AI không nhất thiết trải qua đầy đủ chuỗi hình thành vật lý như thu nhận ánh sáng qua ống kính, biến đổi trên cảm biến, xử lý tín hiệu ảnh trong camera và ghi lại metadata gốc. Vì vậy, dù bề ngoài rất chân thực, ảnh AI vẫn có thể để lộ một số bất thường về tần số, nhiễu, nén, quang học hoặc nguồn gốc tệp.

## 2.2. Cơ sở của digital image forensics
Digital image forensics là lĩnh vực nghiên cứu các kỹ thuật kiểm tra tính xác thực của ảnh số thông qua những dấu vết kỹ thuật còn sót lại trong tệp ảnh. Một ảnh chụp thật thường chịu tác động của:

- Hệ quang học của camera.
- Nhiễu cảm biến và điều kiện chụp.
- Thuật toán xử lý ảnh trong thiết bị.
- Quá trình nén, lưu trữ và chỉnh sửa hậu kỳ.

Trong khi đó, ảnh AI được sinh từ mô hình học máy nên có thể thiếu hoặc mô phỏng chưa hoàn toàn chính xác các dấu vết vật lý trên. Từ đây, các phương pháp forensic có thể khai thác khác biệt giữa ảnh thật và ảnh AI.

## 2.3. Cách tiếp cận của SourceVerify
SourceVerify áp dụng hướng tiếp cận **đa phương pháp**. Thay vì kết luận dựa trên một tín hiệu đơn lẻ, hệ thống cho nhiều phương pháp cùng phân tích ảnh, sau đó tổng hợp các kết quả để đưa ra điểm đánh giá cuối cùng.

Trong phạm vi báo cáo này, nhóm chỉ tập trung vào **5 phương pháp nổi bật nhất**, được chọn theo các tiêu chí:

- Có cơ sở lý thuyết rõ ràng.
- Đại diện cho các nhóm tín hiệu quan trọng khác nhau.
- Có khả năng giải thích được kết quả.
- Phù hợp với phạm vi tìm hiểu của Project I.

Năm phương pháp được chọn gồm:
1. Metadata Analysis
2. Noise Residual
3. DCT Block Artifacts
4. Chromatic Aberration
5. Spectral Nyquist Analysis

## 2.4. Mô hình tổng hợp điểm
Mỗi phương pháp trả về một điểm trong khoảng từ 0 đến 100:

- Điểm gần **100**: ảnh có xu hướng nghiêng về AI.
- Điểm gần **0**: ảnh có xu hướng nghiêng về ảnh thật.
- Điểm gần **50**: phương pháp chưa đủ bằng chứng để kết luận.

Điểm tổng hợp được tính theo trung bình có trọng số:

`Score_AI = Σ(score_i × weight_i) / Σ(weight_i)`

Cách tính này giúp những phương pháp có giá trị phân biệt cao hơn đóng góp mạnh hơn vào kết quả cuối.

## 2.5. Phân tích 5 phương pháp nổi bật

### 2.5.1. Metadata Analysis
**Nguyên lý:**
Metadata là tập thông tin mô tả đi kèm tệp ảnh như EXIF, tên phần mềm tạo ảnh, thời gian tạo, thiết bị chụp, profile màu hoặc các trường liên quan đến xử lý hậu kỳ.

**Ý nghĩa trong phát hiện ảnh AI:**
Nếu metadata cho thấy ảnh được tạo bằng một công cụ như Midjourney, Stable Diffusion, DALL·E, Adobe Firefly hoặc một trình biên tập AI, đây là dấu hiệu rất mạnh cho thấy ảnh không phải ảnh chụp gốc từ camera. Ngược lại, nếu metadata thể hiện thông tin camera hợp lý, điều đó có thể ủng hộ giả thuyết ảnh thật.

**Ưu điểm:**
- Dễ triển khai và dễ giải thích.
- Hiệu quả với các trường hợp ảnh còn giữ nguyên thông tin gốc.
- Hữu ích trong việc truy vết nguồn tạo ảnh.

**Hạn chế:**
- Metadata có thể bị xoá hoặc chỉnh sửa rất dễ dàng.
- Ảnh chụp màn hình hoặc ảnh tải lại từ mạng xã hội thường mất metadata.
- Không thể dùng như bằng chứng duy nhất.

### 2.5.2. Noise Residual
**Nguyên lý:**
Noise Residual là phần nhiễu còn lại sau khi loại bỏ thành phần mượt của ảnh bằng bộ lọc hoặc phép làm trơn. Ở ảnh chụp thật, nhiễu cảm biến thường chịu ảnh hưởng của phần cứng camera, mức ISO, ánh sáng và pipeline xử lý ảnh.

**Ý nghĩa trong phát hiện ảnh AI:**
Ảnh AI thường có xu hướng quá sạch, quá đều hoặc có nhiễu không giống nhiễu vật lý của camera thật. Việc phân tích phần nhiễu dư có thể giúp phát hiện các vùng thiếu tự nhiên.

**Ưu điểm:**
- Có liên hệ chặt với đặc trưng cảm biến thật.
- Phù hợp để phân tích mức độ tự nhiên của bề mặt ảnh.
- Bổ sung tốt cho các phương pháp miền tần số.

**Hạn chế:**
- Nhạy với nén ảnh mạnh, lọc làm đẹp và resize.
- Một số ảnh thật đã qua xử lý hậu kỳ cũng có thể bị “quá sạch”.

### 2.5.3. DCT Block Artifacts
**Nguyên lý:**
Ảnh JPEG được nén theo từng khối thông qua phép biến đổi DCT. Quá trình này để lại các artifact đặc trưng về biên khối, phân bố hệ số tần số và mức độ mất mát thông tin.

**Ý nghĩa trong phát hiện ảnh AI:**
Ảnh thật thường mang lịch sử nén phù hợp với thiết bị và quá trình lưu ảnh. Trong khi đó, ảnh AI hoặc ảnh đã qua nhiều bước xử lý có thể xuất hiện dấu hiệu nén bất thường, vết khối quá đều hoặc không tương thích với lịch sử tệp.

**Ưu điểm:**
- Phù hợp với các ảnh JPEG phổ biến ngoài thực tế.
- Dễ kết hợp với metadata để đánh giá tính hợp lý của tệp.
- Có giá trị trong việc phát hiện ảnh bị xử lý lại nhiều lần.

**Hạn chế:**
- Độ hiệu quả giảm nếu ảnh dùng PNG hoặc WebP.
- Resize và re-encode có thể làm thay đổi mạnh artifact.

### 2.5.4. Chromatic Aberration
**Nguyên lý:**
Chromatic Aberration là hiện tượng lệch màu nhỏ giữa các kênh RGB do ống kính thật gây ra, thường thấy ở các vùng có tương phản cao hoặc gần rìa ảnh.

**Ý nghĩa trong phát hiện ảnh AI:**
Ảnh chụp từ camera thật thường mang một mức sai lệch quang học nhất định. Ảnh AI có thể thiếu loại dấu vết vật lý này, hoặc tạo ra sai lệch màu không nhất quán với cấu trúc quang học tự nhiên.

**Ưu điểm:**
- Đại diện rõ cho dấu vết quang học của hệ camera thật.
- Giúp bổ sung góc nhìn vật lý cho hệ thống.
- Có tính giải thích tốt khi phân tích ảnh có biên tương phản rõ.

**Hạn chế:**
- Không phải mọi ảnh thật đều thể hiện rõ sai lệch màu.
- Ảnh đã qua chỉnh sửa hoặc dùng ống kính chất lượng cao có thể làm tín hiệu này yếu đi.

### 2.5.5. Spectral Nyquist Analysis
**Nguyên lý:**
Phương pháp này phân tích phổ tần số của ảnh, đặc biệt ở vùng tần số cao gần ngưỡng Nyquist. Ảnh được sinh hoặc upscale bởi mô hình có thể để lại các mẫu lặp, đỉnh tần số bất thường hoặc cấu trúc quá đều trong miền phổ.

**Ý nghĩa trong phát hiện ảnh AI:**
Các mô hình sinh ảnh đôi khi tạo ra cấu trúc tần số không giống quá trình lấy mẫu của camera thật. Bằng cách phân tích miền phổ, hệ thống có thể phát hiện các dấu hiệu nhân tạo mà mắt thường khó nhận ra.

**Ưu điểm:**
- Khai thác được dấu vết ẩn trong miền tần số.
- Hiệu quả với một số ảnh có dấu hiệu upscaling hoặc sinh chi tiết nhân tạo.
- Bổ sung tốt cho phân tích nhiễu và nén.

**Hạn chế:**
- Tính toán phức tạp hơn các phương pháp đơn giản.
- Kết quả có thể bị ảnh hưởng bởi resize hoặc nén lại ảnh.

## 2.6. So sánh vai trò của 5 phương pháp
| Phương pháp | Nhóm tín hiệu | Điểm mạnh chính | Hạn chế chính |
|---|---|---|---|
| Metadata Analysis | Nguồn gốc tệp | Truy vết công cụ tạo ảnh, dễ giải thích | Dễ bị xoá hoặc sửa |
| Noise Residual | Nhiễu cảm biến | Phản ánh mức độ tự nhiên của ảnh | Nhạy với lọc và nén |
| DCT Block Artifacts | Nén ảnh | Phù hợp ảnh JPEG thực tế | Phụ thuộc định dạng và re-encode |
| Chromatic Aberration | Quang học | Bám sát đặc trưng ống kính thật | Tín hiệu có thể yếu ở nhiều ảnh |
| Spectral Nyquist Analysis | Miền tần số | Phát hiện mẫu nhân tạo khó thấy | Tính toán phức tạp, nhạy với resize |

## 2.7. Kết luận chương
Từ cơ sở lý thuyết trên có thể thấy không có phương pháp nào đủ mạnh để kết luận tuyệt đối trong mọi trường hợp. Tuy nhiên, việc kết hợp 5 phương pháp tiêu biểu giúp SourceVerify tạo được một nền tảng phân tích có tính giải thích tốt, phù hợp với định hướng tìm hiểu công nghệ và thiết kế giải pháp của Project I.