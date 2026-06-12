# Giới thiệu đề tài

## 1.1. Tên đề tài
**SourceVerify – Nền tảng hỗ trợ kiểm chứng ảnh số có khả năng được tạo bởi AI**

Tên đề tài phản ánh trực tiếp mục tiêu nghiên cứu của nhóm: xây dựng một hệ thống hỗ trợ phân tích và kiểm chứng ảnh số trong bối cảnh nội dung do trí tuệ nhân tạo tạo sinh đang phát triển mạnh. Từ khóa “SourceVerify” nhấn mạnh hai ý tưởng cốt lõi. Thứ nhất là **source** – nguồn gốc của tệp ảnh, tức xuất xứ, quá trình hình thành và các dấu vết kỹ thuật liên quan. Thứ hai là **verify** – xác minh, kiểm chứng, tức sử dụng các phương pháp kỹ thuật để đánh giá mức độ đáng tin cậy của ảnh.

Đề tài không hướng tới việc tuyên bố tuyệt đối một ảnh là thật hay giả trong mọi tình huống, mà hướng tới xây dựng một công cụ hỗ trợ phân tích có giải thích. Điều này phù hợp với tinh thần của Project I: sinh viên phải biết cách đặt vấn đề, lựa chọn hướng tiếp cận, nghiên cứu công nghệ nền tảng và xây dựng một sản phẩm hoặc mô hình minh họa có cơ sở rõ ràng.

## 1.2. Bối cảnh hình thành đề tài
Trong vài năm gần đây, trí tuệ nhân tạo tạo sinh đã tạo ra bước chuyển lớn trong lĩnh vực sáng tạo nội dung số. Nếu như trước đây việc tạo một bức ảnh chất lượng cao cần máy ảnh, thiết bị dựng hình hoặc kỹ năng thiết kế đồ họa chuyên sâu, thì hiện nay nhiều hệ thống AI có thể tạo ra ảnh chỉ từ vài dòng mô tả. Các mô hình như GAN, diffusion model hay text-to-image model đã thay đổi căn bản cách con người sản xuất và tiếp cận hình ảnh.

Ở góc độ tích cực, AI tạo sinh hỗ trợ mạnh cho giáo dục, quảng cáo, thiết kế sản phẩm, truyền thông số và nghiên cứu sáng tạo. Người dùng có thể tạo nhanh ảnh minh họa, thử ý tưởng thiết kế, xây dựng concept hoặc tạo dữ liệu mô phỏng phục vụ học tập. Đối với doanh nghiệp, AI giúp rút ngắn thời gian sản xuất nội dung và giảm đáng kể chi phí.

Tuy nhiên, cùng với lợi ích đó là rủi ro ngày càng lớn liên quan tới nội dung không rõ nguồn gốc. Ảnh AI có thể được sử dụng để mô phỏng sự kiện không có thật, tạo bằng chứng giả, làm sai lệch ngữ cảnh truyền thông hoặc gây ảnh hưởng đến uy tín cá nhân, tổ chức. Trên mạng xã hội, nơi tốc độ lan truyền thông tin rất cao, người dùng thường không có đủ thời gian và công cụ để xác minh nội dung trước khi chia sẻ. Điều này khiến các nội dung tạo sinh có khả năng tác động mạnh đến nhận thức cộng đồng.

Trong thực tế, khả năng phân biệt ảnh thật và ảnh do AI tạo bằng mắt thường đang giảm dần. Các mô hình hiện đại ngày càng tạo được bố cục hợp lý, ánh sáng thuyết phục và chi tiết bề mặt gần giống ảnh thật. Các lỗi hình thái vốn dễ nhận thấy ở thế hệ mô hình cũ như ngón tay thừa, khuôn mặt méo hoặc biên vật thể thiếu tự nhiên đã giảm đáng kể. Vì vậy, nếu chỉ dựa vào cảm quan trực quan, người dùng rất dễ đưa ra kết luận sai.

Từ thực tế đó, việc nghiên cứu các phương pháp hỗ trợ kiểm chứng ảnh số trở nên cần thiết. Nhóm lựa chọn đề tài **SourceVerify** như một hướng tiếp cận phù hợp cho Project I vì đề tài vừa mang tính thời sự, vừa giúp sinh viên tiếp xúc với nhiều mảng kiến thức nền tảng như xử lý ảnh số, digital forensics, thiết kế hệ thống web, tổ chức dữ liệu phân tích và giải thích kết quả kỹ thuật.

## 1.3. Tính cấp thiết của đề tài
### 1.3.1. Tính cấp thiết về mặt xã hội
Trong bối cảnh xã hội số hóa mạnh, hình ảnh không còn chỉ là dữ liệu minh họa mà còn là phương tiện tác động đến nhận thức, hành vi và quyết định của con người. Một bức ảnh có thể làm thay đổi cách công chúng nhìn nhận một sự kiện, một tổ chức hoặc một cá nhân. Vì vậy, khi ảnh giả mạo hoặc ảnh AI được phát tán rộng rãi, hậu quả không chỉ dừng ở mức kỹ thuật mà còn liên quan trực tiếp đến truyền thông, pháp lý, đạo đức và niềm tin xã hội.

Các tình huống có thể xảy ra bao gồm:
- Ảnh giả về một sự kiện xã hội gây hoang mang dư luận.
- Ảnh sản phẩm không có thật gây hiểu nhầm cho người tiêu dùng.
- Ảnh chân dung bị tạo dựng làm ảnh hưởng danh dự cá nhân.
- Ảnh minh họa sai nguồn gốc làm giảm độ tin cậy của nội dung báo chí hoặc học thuật.

Trong những tình huống như vậy, người dùng phổ thông thường không có đủ kỹ năng chuyên môn để xác định ảnh có bị tạo sinh hay không. Do đó, nhu cầu về những công cụ phân tích có khả năng giải thích, dễ sử dụng và có tính hỗ trợ ra quyết định là rất cần thiết.

### 1.3.2. Tính cấp thiết về mặt kỹ thuật
Về kỹ thuật, bài toán phát hiện ảnh AI là một bài toán khó và vẫn đang được nghiên cứu rộng rãi. Một số lý do chính gồm:
- Các mô hình sinh ảnh ngày càng mạnh hơn và học tốt hơn phân bố của ảnh thật.
- Ảnh sau khi được tạo có thể tiếp tục bị nén lại, cắt, resize hoặc chỉnh sửa hậu kỳ, làm thay đổi các dấu vết kỹ thuật ban đầu.
- Không có một phương pháp đơn lẻ nào đủ mạnh để kết luận chính xác trong mọi trường hợp.
- Một số dấu vết chỉ xuất hiện rõ ở một số loại ảnh hoặc một số quy trình tạo ảnh nhất định.

Điều này dẫn đến yêu cầu phải tiếp cận bài toán theo hướng **đa tín hiệu** hoặc **đa phương pháp**. Thay vì chỉ dựa vào một chỉ báo đơn lẻ, hệ thống cần tổng hợp nhiều nhóm dấu hiệu khác nhau như metadata, nhiễu cảm biến, dấu vết nén, dấu vết quang học và miền tần số. Đây chính là hướng mà đề tài SourceVerify lựa chọn.

### 1.3.3. Tính cấp thiết trong phạm vi học thuật Project I
Đối với học phần Project I, mục tiêu quan trọng không chỉ là làm ra một sản phẩm, mà là chứng minh khả năng tìm hiểu công nghệ, đặt vấn đề và đưa ra hướng giải quyết hợp lý. Đề tài SourceVerify phù hợp với tinh thần đó vì:
- Có vấn đề thực tiễn rõ ràng.
- Có nhiều nền tảng kỹ thuật để nghiên cứu.
- Có thể trình bày được cả phần lý thuyết lẫn thiết kế hệ thống.
- Có thể hiện thực hóa thành sản phẩm minh họa ở quy mô phù hợp với thời lượng học phần.

## 1.4. Mục tiêu của đề tài
Đề tài hướng tới các mục tiêu chính sau:

### 1.4.1. Mục tiêu tổng quát
Xây dựng một nền tảng hỗ trợ kiểm chứng ảnh số bằng cách kết hợp nhiều phương pháp digital forensics nhằm đánh giá khả năng ảnh được tạo bởi AI, đồng thời cung cấp kết quả có thể giải thích cho người dùng.

### 1.4.2. Mục tiêu cụ thể
- Tìm hiểu bài toán phát hiện ảnh có khả năng được tạo bởi AI trong bối cảnh hiện nay.
- Nghiên cứu các cơ sở lý thuyết liên quan đến digital image forensics.
- Khảo sát các nền tảng công nghệ phục vụ xây dựng hệ thống phân tích ảnh số trên web.
- Lựa chọn 5 phương pháp nổi bật có cơ sở lý thuyết rõ ràng và phù hợp với phạm vi Project I.
- Thiết kế kiến trúc hệ thống có khả năng nhận ảnh, tiền xử lý, phân tích, tổng hợp điểm và hiển thị kết quả.
- Xây dựng sản phẩm minh họa để thể hiện tính khả thi của hướng tiếp cận.
- Đề xuất các hướng phát triển tiếp theo để nâng hệ thống từ mức minh họa lên mức nghiên cứu nghiêm túc hơn.

### 1.4.3. Ý nghĩa của việc thu hẹp phạm vi vào 5 phương pháp
Trong thực tế có rất nhiều hướng nghiên cứu phát hiện ảnh AI, bao gồm cả hướng dựa trên học sâu và hướng dựa trên các đặc trưng thống kê. Tuy nhiên, để bảo đảm báo cáo có chiều sâu, dễ trình bày và phù hợp với khuôn khổ Project I, nhóm chủ động thu hẹp phạm vi vào 5 phương pháp nổi bật. Cách làm này giúp tập trung phân tích bản chất kỹ thuật, tránh sa đà vào việc liệt kê quá nhiều phương pháp nhưng thiếu chiều sâu. Đồng thời, 5 phương pháp được chọn cũng đại diện cho 5 nhóm dấu hiệu có tính bổ trợ lẫn nhau.

## 1.5. Đối tượng và phạm vi nghiên cứu
### 1.5.1. Đối tượng nghiên cứu
Đối tượng nghiên cứu của đề tài là **ảnh số có khả năng được tạo hoặc chỉnh sửa bởi AI**, cùng với các dấu vết kỹ thuật, thống kê và vật lý có thể hỗ trợ kiểm chứng. Bên cạnh đối tượng ảnh, đề tài còn quan tâm đến quá trình xử lý tệp, cấu trúc metadata, sự biến đổi tín hiệu ảnh và cách biểu diễn kết quả phân tích dưới dạng dễ hiểu đối với người dùng.

### 1.5.2. Phạm vi nội dung
Trong phạm vi Project I, nhóm tập trung chủ yếu vào **ảnh số** thay vì mở rộng đầy đủ sang video và văn bản. Lý do là ảnh là loại dữ liệu phù hợp nhất để trình bày các khái niệm forensics ở mức nền tảng. Ảnh vừa đủ trực quan để minh họa, vừa chứa các dấu vết kỹ thuật đa dạng như metadata, nhiễu, nén ảnh, quang học và tín hiệu tần số.

Đề tài chỉ tập trung phân tích **5 phương pháp tiêu biểu** sau:
1. **Metadata Analysis**
2. **Noise Residual**
3. **DCT Block Artifacts**
4. **Chromatic Aberration**
5. **Spectral Nyquist Analysis**

Năm phương pháp này lần lượt đại diện cho các góc nhìn khác nhau trong kiểm chứng ảnh số:
- **Nguồn gốc tệp** thông qua metadata.
- **Tính tự nhiên của ảnh** thông qua nhiễu cảm biến.
- **Dấu vết nén** thông qua artifact JPEG.
- **Dấu vết quang học** thông qua sai lệch màu do ống kính.
- **Cấu trúc miền tần số** thông qua phân tích phổ gần ngưỡng Nyquist.

### 1.5.3. Phạm vi kỹ thuật và triển khai
Về mặt kỹ thuật, sản phẩm minh họa được xây dựng trên nền tảng web bằng Next.js và TypeScript. Hệ thống hướng tới xử lý cục bộ các dữ liệu cần thiết để giảm phụ thuộc vào máy chủ. Trong giai đoạn Project I, nhóm chưa đặt mục tiêu xây dựng một hệ thống benchmark quy mô lớn hay huấn luyện mô hình deep learning chuyên biệt, mà tập trung vào việc tổ chức quy trình phân tích và giải thích kết quả.

## 1.6. Phương pháp thực hiện
Quy trình thực hiện đề tài được tổ chức thành nhiều bước kế tiếp nhau nhằm bảo đảm tính logic và khả năng kiểm soát phạm vi.

### 1.6.1. Khảo sát bài toán
Ở bước đầu tiên, nhóm khảo sát bối cảnh phát triển của AI tạo sinh, các rủi ro liên quan tới nội dung ảnh không rõ nguồn gốc và các nhu cầu thực tế về kiểm chứng. Bước này giúp xác định đúng vấn đề cần giải quyết.

### 1.6.2. Nghiên cứu cơ sở lý thuyết
Sau khi xác định bài toán, nhóm tìm hiểu các nền tảng lý thuyết về digital image forensics, xử lý ảnh số, cấu trúc tệp ảnh và các đặc trưng thường được dùng trong phát hiện bất thường.

### 1.6.3. Lựa chọn phương pháp
Từ tập lớn các phương pháp có thể áp dụng, nhóm sàng lọc để chọn ra 5 phương pháp nổi bật, đáp ứng đồng thời các tiêu chí: dễ giải thích, có tính đại diện, phù hợp thời lượng học phần và có thể tích hợp vào hệ thống minh họa.

### 1.6.4. Thiết kế hệ thống
Tiếp theo, nhóm xây dựng mô hình kiến trúc hệ thống, phân rã chức năng, mô hình dữ liệu và luồng xử lý. Đây là bước biến phần nghiên cứu lý thuyết thành cấu trúc hệ thống cụ thể.

### 1.6.5. Triển khai thử nghiệm
Nhóm tiến hành hiện thực hóa hệ thống bằng sản phẩm web, tích hợp các mô-đun phân tích và xây dựng giao diện hiển thị kết quả. Giai đoạn này nhằm chứng minh tính khả thi của giải pháp.

### 1.6.6. Đánh giá và hoàn thiện báo cáo
Cuối cùng, nhóm đối chiếu kết quả triển khai với mục tiêu đề ra, rút ra các hạn chế, đề xuất hướng phát triển và hoàn thiện nội dung báo cáo dưới dạng quyển đồ án.

## 1.7. Ý nghĩa của đề tài
### 1.7.1. Ý nghĩa học thuật
Đề tài giúp sinh viên làm quen với cách tiếp cận một bài toán công nghệ mới theo hướng bài bản: xác định vấn đề, nghiên cứu lý thuyết, chọn giải pháp, thiết kế hệ thống và triển khai minh họa. Ngoài ra, đề tài cũng giúp củng cố kiến thức liên ngành giữa xử lý ảnh số, lập trình web và tổ chức hệ thống phân tích.

### 1.7.2. Ý nghĩa thực tiễn
Sản phẩm SourceVerify tuy mới ở mức minh họa nhưng cho thấy một hướng tiếp cận có giá trị thực tế: hỗ trợ người dùng đánh giá nhanh các dấu hiệu đáng nghi của ảnh số. Trong bối cảnh ảnh AI ngày càng phổ biến, những công cụ như vậy có tiềm năng hỗ trợ giáo dục truyền thông số, kiểm tra nguồn gốc nội dung và nâng cao nhận thức sử dụng AI có trách nhiệm.

### 1.7.3. Ý nghĩa định hướng phát triển
Thông qua đề tài này, nhóm tạo được một nền tảng ban đầu để có thể tiếp tục nghiên cứu sâu hơn ở các đồ án sau. Các hướng có thể mở rộng bao gồm mở rộng sang video, văn bản, chuẩn provenance, đánh giá định lượng bằng bộ dữ liệu chuẩn hoặc kết hợp với mô hình học máy.

## 1.8. Kết luận chương
Chương này đã trình bày bối cảnh hình thành đề tài, lý do lựa chọn chủ đề, tính cấp thiết, mục tiêu, phạm vi nghiên cứu và ý nghĩa của SourceVerify. Từ đó có thể thấy đây là một đề tài vừa có giá trị thực tiễn, vừa phù hợp với mục tiêu rèn luyện tư duy công nghệ của Project I. Những nội dung ở chương tiếp theo sẽ đi sâu vào cơ sở lý thuyết và phân tích chi tiết 5 phương pháp cốt lõi được lựa chọn.