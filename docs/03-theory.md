# Cơ sở lý thuyết

## 2.1. Tổng quan về bài toán phát hiện ảnh do AI tạo
Ảnh do AI tạo sinh là ảnh được tạo ra hoàn toàn hoặc một phần bởi các mô hình như GAN, diffusion model hoặc các hệ thống text-to-image hiện đại. Những ảnh này có thể đạt chất lượng rất cao, bố cục hợp lý và màu sắc thuyết phục, khiến việc nhận biết bằng mắt thường ngày càng khó khăn. Trong nhiều trường hợp, người dùng chỉ dựa trên cảm nhận trực quan sẽ rất dễ đánh giá sai, đặc biệt khi ảnh đã được hậu xử lý hoặc sử dụng trong bối cảnh thông tin thiếu kiểm chứng.

Nếu xét về bản chất, ảnh chụp từ camera thật và ảnh sinh bởi mô hình AI hình thành theo hai quy trình hoàn toàn khác nhau. Ảnh camera thật trải qua quá trình thu nhận ánh sáng từ thế giới vật lý, đi qua ống kính, cảm biến, hệ xử lý tín hiệu ảnh, thuật toán cân bằng trắng, khử nhiễu, nén và lưu trữ. Trong khi đó, ảnh AI được sinh ra từ quá trình suy diễn của mô hình trên không gian đặc trưng đã học. Chính sự khác biệt về quy trình hình thành này là cơ sở để nhiều phương pháp forensic phát hiện các dấu vết bất thường.

Trong bối cảnh các mô hình AI ngày càng tiến bộ, bài toán phát hiện ảnh AI không thể chỉ dựa vào những lỗi hình thái dễ nhận biết như khuôn mặt méo, ngón tay bất thường hay biên vật thể sai lệch. Các lỗi trực quan đó ngày càng ít xuất hiện hơn ở các mô hình mới. Thay vào đó, việc kiểm chứng cần đi sâu vào các tín hiệu thống kê, tín hiệu vật lý và dấu vết kỹ thuật khó nhận biết bằng mắt thường.

## 2.2. Cơ sở của digital image forensics
Digital image forensics là lĩnh vực nghiên cứu các kỹ thuật kiểm tra tính xác thực của ảnh số thông qua những dấu vết kỹ thuật còn sót lại trong tệp ảnh. Mục tiêu của lĩnh vực này không chỉ là phát hiện ảnh giả hay ảnh bị chỉnh sửa, mà còn là hiểu quá trình hình thành và biến đổi của ảnh để đưa ra nhận định hợp lý.

Một ảnh chụp thật thường chịu tác động của nhiều yếu tố:
- **Hệ quang học của camera:** ống kính gây ra các sai lệch quang học nhất định như mờ biên, chromatic aberration hoặc méo hình.
- **Nhiễu cảm biến và điều kiện chụp:** mức ISO, ánh sáng, nhiệt độ cảm biến và phần cứng camera tạo ra đặc trưng nhiễu riêng.
- **Thuật toán xử lý ảnh trong thiết bị:** cân bằng trắng, nội suy màu, làm sắc nét, khử nhiễu và nén JPEG đều để lại dấu vết.
- **Quá trình lưu trữ và chỉnh sửa hậu kỳ:** crop, resize, re-encode hoặc chỉnh sửa bằng phần mềm làm thay đổi cấu trúc tín hiệu ban đầu.

Trong khi đó, ảnh AI được sinh từ mô hình học máy nên có thể thiếu hoặc mô phỏng chưa hoàn toàn chính xác các dấu vết vật lý nêu trên. Một số mô hình có thể tạo ra ảnh có vẻ rất chân thực nhưng vẫn để lộ những bất thường như nhiễu quá đồng đều, miền tần số không tự nhiên, metadata bất thường hoặc thiếu các dấu vết quang học đặc trưng của camera thật.

Digital image forensics thường không đưa ra bằng chứng tuyệt đối trong một lần kiểm tra duy nhất. Thay vào đó, nó cung cấp tập hợp các chỉ báo kỹ thuật để hỗ trợ đưa ra nhận định. Tư duy này rất phù hợp với mục tiêu của SourceVerify: hệ thống đóng vai trò công cụ hỗ trợ phân tích chứ không thay thế hoàn toàn chuyên gia giám định số.

## 2.3. Cách tiếp cận của SourceVerify
SourceVerify áp dụng hướng tiếp cận **đa phương pháp**. Thay vì kết luận dựa trên một tín hiệu đơn lẻ, hệ thống cho nhiều phương pháp cùng phân tích ảnh, sau đó tổng hợp các kết quả để đưa ra điểm đánh giá cuối cùng. Đây là cách tiếp cận hợp lý vì mỗi phương pháp chỉ nhìn thấy một mặt của bài toán.

Ví dụ, metadata có thể rất mạnh khi ảnh còn giữ nguyên thông tin gốc, nhưng gần như mất tác dụng nếu ảnh đã bị xóa metadata. Ngược lại, phân tích nhiễu có thể hữu ích khi đánh giá tính tự nhiên của bề mặt ảnh, nhưng cũng dễ bị ảnh hưởng bởi nén mạnh hoặc hậu xử lý. Do đó, nếu chỉ dùng một phương pháp thì rủi ro kết luận sai sẽ cao.

Trong phạm vi báo cáo này, nhóm chỉ tập trung vào **5 phương pháp nổi bật nhất**, được chọn theo các tiêu chí:
- Có cơ sở lý thuyết rõ ràng.
- Đại diện cho các nhóm tín hiệu quan trọng khác nhau.
- Có khả năng giải thích được kết quả.
- Phù hợp với phạm vi tìm hiểu của Project I.
- Có thể tích hợp vào sản phẩm minh họa với chi phí triển khai hợp lý.

Năm phương pháp được chọn gồm:
1. Metadata Analysis
2. Noise Residual
3. DCT Block Artifacts
4. Chromatic Aberration
5. Spectral Nyquist Analysis

Việc chỉ tập trung vào 5 phương pháp giúp báo cáo giữ được chiều sâu học thuật. Mỗi phương pháp không chỉ được nêu tên mà còn được phân tích theo nguyên lý, vai trò, ưu điểm, hạn chế và mối liên hệ với bài toán kiểm chứng ảnh AI.

## 2.4. Mô hình tổng hợp điểm
Mỗi phương pháp trong SourceVerify trả về một điểm trong khoảng từ 0 đến 100:
- Điểm gần **100**: ảnh có xu hướng nghiêng về AI.
- Điểm gần **0**: ảnh có xu hướng nghiêng về ảnh thật.
- Điểm gần **50**: phương pháp chưa đủ bằng chứng để kết luận.

Điểm tổng hợp được tính theo trung bình có trọng số:

`Score_AI = Σ(score_i × weight_i) / Σ(weight_i)`

Mô hình này cho phép các phương pháp có độ tin cậy hoặc giá trị phân biệt tốt hơn đóng góp nhiều hơn vào kết quả cuối cùng. Chẳng hạn, trong một số trường hợp metadata có thể là tín hiệu mạnh nếu phát hiện được trực tiếp công cụ tạo ảnh, trong khi ở trường hợp khác nó chỉ nên đóng vai trò tham khảo. Tương tự, các phương pháp miền tần số hoặc nhiễu có thể hữu ích hơn khi ảnh không còn metadata.

Về mặt tư duy, mô hình tổng hợp điểm có một số ưu điểm:
- Dễ cài đặt và dễ giải thích.
- Có thể điều chỉnh trọng số khi có thêm dữ liệu đánh giá.
- Phù hợp với phạm vi Project I vì không yêu cầu huấn luyện mô hình phức tạp.
- Giúp chuyển từ tập hợp các tín hiệu rời rạc sang một kết quả tổng quát dễ hiểu hơn.

Tuy nhiên, mô hình này cũng có hạn chế. Nếu trọng số chưa được hiệu chỉnh bằng dữ liệu thực nghiệm lớn, kết quả tổng hợp vẫn mang tính tham khảo. Đây là lý do báo cáo luôn nhấn mạnh rằng SourceVerify là công cụ hỗ trợ phân tích, không phải công cụ phán quyết tuyệt đối.

## 2.5. Phân tích 5 phương pháp nổi bật

### 2.5.1. Metadata Analysis
#### Nguyên lý
Metadata là tập thông tin mô tả đi kèm tệp ảnh như EXIF, tên phần mềm tạo ảnh, thời gian tạo, thiết bị chụp, profile màu hoặc các trường liên quan đến xử lý hậu kỳ. Đây là lớp thông tin không nằm trực tiếp trong nội dung pixel nhưng lại có giá trị rất lớn khi cần truy vết nguồn gốc tệp.

Trong ảnh chụp thật, metadata thường chứa tên thiết bị, tiêu cự, khẩu độ, thời gian chụp, thông tin cân bằng trắng hoặc phần mềm xử lý hậu kỳ. Trong ảnh được tạo bằng công cụ AI hoặc được xuất từ nền tảng đồ họa, metadata có thể ghi nhận tên phần mềm, pipeline xuất ảnh hoặc một số dấu hiệu cho thấy ảnh không đi qua quá trình chụp vật lý.

#### Ý nghĩa trong phát hiện ảnh AI
Nếu metadata cho thấy ảnh được tạo bằng một công cụ như Midjourney, Stable Diffusion, DALL·E, Adobe Firefly hoặc một trình biên tập AI, đây là dấu hiệu rất mạnh cho thấy ảnh không phải ảnh chụp gốc từ camera. Ngược lại, nếu metadata thể hiện thông tin camera hợp lý, điều đó có thể ủng hộ giả thuyết ảnh thật.

Metadata còn có giá trị trong việc phát hiện các mâu thuẫn. Ví dụ, nếu ảnh được mô tả là ảnh chụp trực tiếp từ hiện trường nhưng metadata lại cho thấy được xuất từ phần mềm tạo ảnh hoặc đã qua nhiều bước xử lý không phù hợp, đó là tín hiệu đáng nghi.

#### Ưu điểm
- Dễ triển khai và dễ giải thích cho người đọc báo cáo.
- Hiệu quả với các trường hợp ảnh còn giữ nguyên thông tin gốc.
- Hữu ích trong việc truy vết nguồn tạo ảnh.
- Có thể kết hợp tốt với các phương pháp khác để kiểm tra tính nhất quán của tệp.

#### Hạn chế
- Metadata có thể bị xoá hoặc chỉnh sửa rất dễ dàng.
- Ảnh chụp màn hình hoặc ảnh tải lại từ mạng xã hội thường mất metadata.
- Không thể dùng như bằng chứng duy nhất.
- Một số ảnh thật sau hậu kỳ chuyên nghiệp cũng có thể có metadata phần mềm, gây nhiễu cho kết luận.

#### Nhận xét học thuật
Metadata Analysis là phương pháp có tính thực dụng cao vì dễ giải thích và gần gũi với người dùng. Tuy nhiên, xét riêng về độ bền vững forensic, đây không phải tín hiệu mạnh nhất do dễ bị thao tác. Vì vậy, trong SourceVerify, phương pháp này được xem như một lớp bằng chứng về nguồn gốc tệp hơn là một phán quyết độc lập.

### 2.5.2. Noise Residual
#### Nguyên lý
Noise Residual là phần nhiễu còn lại sau khi loại bỏ thành phần mượt của ảnh bằng bộ lọc hoặc phép làm trơn. Trong ảnh chụp thật, nhiễu cảm biến xuất hiện do đặc tính phần cứng camera, điều kiện ánh sáng, ISO, nhiệt độ và các bước xử lý tín hiệu. Nhiễu này thường không hoàn toàn ngẫu nhiên cũng không hoàn toàn đồng đều.

Ý tưởng của phương pháp là tách phần tín hiệu “mịn” ra khỏi ảnh, sau đó quan sát phần còn lại. Nếu phần dư này có đặc tính quá sạch, quá đồng đều hoặc không mang tính vật lý tự nhiên, đó có thể là dấu hiệu của ảnh AI hoặc ảnh đã qua xử lý mạnh.

#### Ý nghĩa trong phát hiện ảnh AI
Ảnh AI thường có xu hướng quá sạch hoặc có kiểu nhiễu không giống nhiễu vật lý của camera thật. Một số mô hình tạo sinh tối ưu mạnh vào chất lượng thị giác nên vô tình làm mất các biến động nhỏ vốn rất tự nhiên trong ảnh chụp. Việc phân tích phần nhiễu dư có thể giúp nhận ra các vùng bề mặt thiếu tính ngẫu nhiên tự nhiên.

Ở chiều ngược lại, nếu ảnh có phân bố nhiễu hợp lý, thay đổi theo cấu trúc vùng sáng tối và phù hợp với ảnh chụp từ thiết bị thật, điều đó góp phần giảm nghi ngờ AI.

#### Ưu điểm
- Có liên hệ chặt với đặc trưng cảm biến thật.
- Phù hợp để đánh giá mức độ tự nhiên của bề mặt ảnh.
- Hữu ích khi metadata không còn hoặc không đủ thông tin.
- Bổ sung tốt cho các phương pháp miền tần số và nén ảnh.

#### Hạn chế
- Nhạy với nén ảnh mạnh, lọc làm đẹp và resize.
- Một số ảnh thật đã qua hậu kỳ có thể trở nên quá sạch.
- Cần xử lý cẩn thận để tránh diễn giải sai các biến động do nội dung ảnh.

#### Nhận xét học thuật
Noise Residual là phương pháp thể hiện rõ tinh thần forensic: thay vì nhìn hình ảnh ở mức trực quan, hệ thống quan sát cấu trúc tín hiệu ẩn phía sau. Phương pháp này phù hợp với đề tài vì cho thấy khác biệt giữa ảnh thật và ảnh AI không chỉ nằm ở “trông có giống thật hay không”, mà nằm ở bản chất thống kê của tín hiệu ảnh.

### 2.5.3. DCT Block Artifacts
#### Nguyên lý
Ảnh JPEG được nén theo từng khối thông qua phép biến đổi DCT. Quá trình này biến đổi tín hiệu ảnh từ miền không gian sang miền tần số cục bộ, sau đó lượng tử hóa để giảm dung lượng. Kết quả là ảnh mang theo các artifact đặc trưng về biên khối, phân bố hệ số tần số và mức độ mất mát thông tin.

Khi ảnh được lưu nhiều lần, re-encode hoặc chỉnh sửa rồi nén lại, các artifact này có thể thay đổi theo cách nhất định. Nếu ảnh AI được xuất ra rồi nén lại, hoặc nếu lịch sử nén không tương thích với đặc điểm metadata và nội dung ảnh, dấu vết DCT có thể cung cấp tín hiệu đáng giá.

#### Ý nghĩa trong phát hiện ảnh AI
Ảnh thật thường mang lịch sử nén phù hợp với thiết bị và quá trình lưu ảnh. Trong khi đó, ảnh AI hoặc ảnh qua nhiều bước xử lý có thể xuất hiện dấu hiệu nén bất thường, vết khối quá đều hoặc không tương thích với lịch sử tệp. Việc phân tích artifact DCT giúp quan sát mối quan hệ giữa nội dung hiện tại của ảnh và cách tệp đã được nén, từ đó phát hiện khả năng ảnh không đi qua pipeline camera thông thường.

#### Ưu điểm
- Phù hợp với các ảnh JPEG phổ biến ngoài thực tế.
- Dễ kết hợp với metadata để đánh giá tính hợp lý của tệp.
- Có giá trị trong việc phát hiện ảnh bị xử lý lại nhiều lần.
- Giúp người học hiểu sâu hơn mối liên hệ giữa nén ảnh và forensics.

#### Hạn chế
- Độ hiệu quả giảm nếu ảnh dùng PNG hoặc WebP.
- Resize và re-encode có thể làm thay đổi mạnh artifact.
- Khó diễn giải chính xác nếu ảnh đã qua nhiều bước xử lý trung gian.

#### Nhận xét học thuật
DCT Block Artifacts là phương pháp có giá trị giáo dục cao vì kết nối trực tiếp giữa kiến thức nén ảnh số và bài toán kiểm chứng. Đây là ví dụ tốt cho thấy những kỹ thuật rất cơ bản trong xử lý ảnh vẫn có thể trở thành công cụ forensic hiệu quả khi được đặt đúng ngữ cảnh.

### 2.5.4. Chromatic Aberration
#### Nguyên lý
Chromatic Aberration là hiện tượng lệch màu nhỏ giữa các kênh RGB do ống kính thật gây ra, thường xuất hiện ở các vùng có tương phản cao hoặc gần rìa ảnh. Hiện tượng này xảy ra vì các bước sóng ánh sáng khác nhau không hoàn toàn hội tụ tại cùng một điểm trên cảm biến.

Trong ảnh chụp thật, mức lệch màu này có thể rất nhỏ nhưng vẫn tồn tại như một dấu vết quang học tự nhiên. Ở ảnh AI, do quá trình hình thành không đi qua hệ quang học vật lý, dấu vết này có thể không xuất hiện hoặc xuất hiện không nhất quán.

#### Ý nghĩa trong phát hiện ảnh AI
Ảnh chụp từ camera thật thường mang một mức sai lệch quang học nhất định. Ảnh AI có thể thiếu loại dấu vết vật lý này, hoặc tạo ra sai lệch màu không nhất quán với cấu trúc quang học tự nhiên. Do đó, Chromatic Aberration là phương pháp đại diện tốt cho góc nhìn “vật lý của quá trình chụp ảnh”.

#### Ưu điểm
- Đại diện rõ cho dấu vết quang học của hệ camera thật.
- Giúp bổ sung góc nhìn vật lý cho hệ thống.
- Có tính giải thích tốt khi phân tích ảnh có biên tương phản rõ.
- Tạo sự đa dạng cho bộ phương pháp vì không trùng lặp với phân tích nhiễu hay nén.

#### Hạn chế
- Không phải mọi ảnh thật đều thể hiện rõ sai lệch màu.
- Ảnh đã qua chỉnh sửa hoặc dùng ống kính chất lượng cao có thể làm tín hiệu này yếu đi.
- Một số vùng ảnh không đủ biên tương phản để quan sát rõ hiện tượng.

#### Nhận xét học thuật
Chromatic Aberration giúp báo cáo tránh bị thiên hoàn toàn về thống kê tín hiệu, vì nó đưa vào một phương pháp có nền tảng quang học rõ ràng. Điều này làm cho bộ 5 phương pháp của SourceVerify cân bằng hơn giữa góc nhìn tệp, góc nhìn cảm biến, góc nhìn nén và góc nhìn vật lý chụp ảnh.

### 2.5.5. Spectral Nyquist Analysis
#### Nguyên lý
Phương pháp này phân tích phổ tần số của ảnh, đặc biệt ở vùng tần số cao gần ngưỡng Nyquist. Trong xử lý tín hiệu số, ngưỡng Nyquist liên quan đến giới hạn lấy mẫu và khả năng biểu diễn tín hiệu mà không gây chồng phổ. Khi ảnh được tạo hoặc upscale bởi mô hình, cấu trúc miền tần số có thể xuất hiện những đỉnh bất thường, mẫu lặp hoặc phân bố quá đều so với ảnh tự nhiên.

Phân tích miền phổ giúp quan sát những dấu vết mà mắt người hầu như không thể nhìn thấy trực tiếp. Đây là lý do phương pháp này có giá trị trong việc phát hiện các ảnh có bề ngoài rất chân thực nhưng cấu trúc tín hiệu ẩn lại thiếu tự nhiên.

#### Ý nghĩa trong phát hiện ảnh AI
Các mô hình sinh ảnh đôi khi tạo ra cấu trúc tần số không giống quá trình lấy mẫu của camera thật. Nếu nội dung chi tiết của ảnh được mô hình sinh theo những mẫu có tính nhân tạo, điều đó có thể phản ánh trên phổ tần số. Bằng cách phân tích miền phổ, hệ thống có thể phát hiện các dấu hiệu mà cách quan sát thông thường bỏ qua.

#### Ưu điểm
- Khai thác được dấu vết ẩn trong miền tần số.
- Hiệu quả với một số ảnh có dấu hiệu upscaling hoặc sinh chi tiết nhân tạo.
- Bổ sung tốt cho phân tích nhiễu và nén.
- Có chiều sâu học thuật cao vì gắn với lý thuyết xử lý tín hiệu số.

#### Hạn chế
- Tính toán phức tạp hơn các phương pháp đơn giản.
- Kết quả có thể bị ảnh hưởng bởi resize hoặc nén lại ảnh.
- Khó giải thích trực quan cho người dùng phổ thông nếu không có diễn giải phù hợp.

#### Nhận xét học thuật
Spectral Nyquist Analysis là phương pháp tiêu biểu cho hướng tiếp cận miền tần số trong forensics. Nó góp phần nâng tầm học thuật của đề tài vì liên kết bài toán phát hiện ảnh AI với nền tảng xử lý tín hiệu số, thay vì chỉ dừng ở các biểu hiện dễ quan sát trên bề mặt ảnh.

## 2.6. So sánh vai trò của 5 phương pháp
| Phương pháp | Nhóm tín hiệu | Điểm mạnh chính | Hạn chế chính |
|---|---|---|---|
| Metadata Analysis | Nguồn gốc tệp | Truy vết công cụ tạo ảnh, dễ giải thích | Dễ bị xoá hoặc sửa |
| Noise Residual | Nhiễu cảm biến | Phản ánh mức độ tự nhiên của ảnh | Nhạy với lọc và nén |
| DCT Block Artifacts | Nén ảnh | Phù hợp ảnh JPEG thực tế | Phụ thuộc định dạng và re-encode |
| Chromatic Aberration | Quang học | Bám sát đặc trưng ống kính thật | Tín hiệu có thể yếu ở nhiều ảnh |
| Spectral Nyquist Analysis | Miền tần số | Phát hiện mẫu nhân tạo khó thấy | Tính toán phức tạp, nhạy với resize |

Nếu nhìn tổng thể, có thể thấy 5 phương pháp này bổ sung cho nhau theo nhiều chiều. Metadata cho biết xuất xứ tệp, Noise Residual phản ánh tính tự nhiên của bề mặt ảnh, DCT Block Artifacts xem xét lịch sử nén, Chromatic Aberration đại diện cho góc nhìn quang học, còn Spectral Nyquist Analysis khai thác miền tần số. Chính sự bổ trợ này làm cho hệ thống có cơ sở tốt hơn khi đưa ra nhận định tổng hợp.

## 2.7. Kết luận chương
Từ cơ sở lý thuyết trên có thể thấy không có phương pháp nào đủ mạnh để kết luận tuyệt đối trong mọi trường hợp. Tuy nhiên, việc kết hợp 5 phương pháp tiêu biểu giúp SourceVerify tạo được một nền tảng phân tích có tính giải thích tốt, phù hợp với định hướng tìm hiểu công nghệ và thiết kế giải pháp của Project I.

Quan trọng hơn, chương này cho thấy bài toán phát hiện ảnh AI không chỉ là bài toán “nhìn bằng mắt” mà là bài toán phân tích nhiều lớp thông tin kỹ thuật của ảnh số. Chính nhờ cách tiếp cận đó, SourceVerify có thể trở thành một đề tài học thuật có chiều sâu, thay vì chỉ là một ứng dụng minh họa giao diện đơn thuần.