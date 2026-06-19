# BÀI THUYẾT TRÌNH BẢO VỆ ĐỒ ÁN — SourceVerify

---

## SLIDE 1 – TRANG BÌA

Xin chào thầy cô và các bạn. Em là **Bạch Minh Quang**, lớp **Project I**. Đồ án của em mang tên **SourceVerify — Nền tảng hỗ trợ kiểm chứng ảnh số có khả năng được tạo bởi AI**.

Đây là hệ thống phân tích pháp y đa phương pháp chạy hoàn toàn trên trình duyệt, không gửi dữ liệu lên máy chủ, thuộc khuôn khổ học kỳ II năm học 2025–2026, Trường Công nghệ Thông tin và Truyền thông — Đại học Bách khoa Hà Nội.

---

## SLIDE 2 – VẤN ĐỀ

Trong vài năm gần đây, AI tạo sinh phát triển cực kỳ nhanh. Các mô hình như Midjourney, Stable Diffusion, DALL·E có thể tạo ra ảnh chất lượng rất cao từ vài dòng mô tả.

Điều này dẫn đến một vấn đề lớn: **ảnh thật và ảnh AI ngày càng khó phân biệt bằng mắt thường.** Một người dùng phổ thông dựa vào cảm tính để phán đoán rất dễ bị đánh lừa.

Cụ thể có ba vấn đề chính:

- **Thứ nhất**, ảnh giả lan truyền nhanh trên mạng xã hội, gây hiểu lầm và mất niềm tin.
- **Thứ hai**, người dùng thiếu công cụ khách quan để tự kiểm chứng.
- **Thứ ba**, nhu cầu kiểm chứng là rất thực tế — cần công cụ phân tích dấu hiệu đáng ngờ kèm giải thích nguyên nhân.

Đây chính là lý do đề tài SourceVerify ra đời.

---

## SLIDE 3 – ẢNH THẬT vs AI

Vậy **ảnh thật khác ảnh AI ở điểm nào về mặt khoa học?**

Nếu nhìn vào quy trình hình thành, hai loại ảnh này hoàn toàn khác nhau.

**Ảnh chụp thật** đi qua một chuỗi vật lý: ánh sáng từ thế giới thực đi qua **ống kính** — gây ra quang sai, đến **cảm biến** — tạo nhiễu PRNU đặc trưng, qua **ISP** — xử lý màu sắc và độ nét, qua **nén JPEG** với các khối DCT 8×8, và cuối cùng lưu lại **metadata EXIF** của máy ảnh. Mỗi bước đều để lại dấu vết.

**Ảnh AI** thì ngược lại: được sinh từ một vector ngẫu nhiên trong không gian tiềm ẩn, đi qua mạng nơ-ron generator, qua các tầng upsampling và thường được lưu dưới dạng **PNG** — không có nén DCT, không có metadata camera, không có dấu vết quang học vật lý.

→ **SourceVerify phân tích sự khác biệt giữa hai chuỗi này để đưa ra đánh giá.**

---

## SLIDE 4 – MỤC TIÊU

Đề tài hướng tới 4 mục tiêu chính:

| Mục tiêu | Mô tả |
|---|---|
| **5 phương pháp** | Áp dụng 5 phương pháp phân tích pháp y tiêu biểu, không chỉ dùng một phương pháp duy nhất |
| **100% browser** | Hệ thống chạy hoàn toàn trên trình duyệt — công nghệ web, không cần cài đặt |
| **0 upload** | Toàn bộ xử lý cục bộ, bảo vệ quyền riêng tư tuyệt đối |
| **Explain** | Mỗi tín hiệu đều có giải thích — người dùng hiểu được tại sao hệ thống đưa ra kết luận đó |

Về phạm vi, đồ án tập trung vào **ảnh tĩnh**, dùng phương pháp **heuristic giải thích được** thay vì mô hình hộp đen. Đây là Project I nên mục tiêu là minh họa hướng tiếp cận, chưa phải sản phẩm thương mại.

---

## SLIDE 5 – NĂM PHƯƠNG PHÁP

Năm phương pháp được chọn đại diện cho năm loại dấu vết khác nhau.

| Phương pháp | Trọng số | Nhóm tín hiệu | Nguyên lý |
|---|---|---|---|
| **PP-01 — Metadata Analysis** | w = 1.5 | Nguồn gốc tệp | Đọc "lý lịch" tệp ảnh — nếu thấy tên phần mềm Midjourney, DALL·E, hoặc thiếu thông tin camera → tín hiệu đáng nghi |
| **PP-02 — Noise Residual** | w = **3.5** | Nhiễu cảm biến | Nhiễu cảm biến thật tăng dần theo độ sáng; ảnh AI thường quá sạch hoặc nhiễu đều đều |
| **PP-03 — DCT Block Artifacts** | w = 2.0 | Nén ảnh | Vết nén JPEG ô vuông 8×8 — ảnh thật có vết khối tự nhiên, ảnh AI lưu PNG không có vết này |
| **PP-04 — Chromatic Aberration** | w = 0.5 | Quang học | Viền màu đỏ/xanh ở rìa ảnh do ống kính thật gây ra — ảnh AI thường thiếu |
| **PP-05 — Spectral Nyquist** | w = 1.5 | Phổ tần số | Phân tích phổ tần số — ảnh thật phổ mượt, ảnh AI có đỉnh bất thường do upsampling |

Sau đó, hệ thống **cộng có trọng số** để ra kết luận cuối cùng: **Thật, AI, hoặc Chưa rõ**.

Phương pháp càng đáng tin thì trọng số càng cao. Noise Residual mạnh nhất với w = 3.5.

---

## SLIDE 6 – METADATA ANALYSIS (PP-01)

### Ý tưởng cốt lõi — nói dễ hiểu

Mỗi bức ảnh số, khi được chụp từ máy ảnh hoặc tạo từ AI, đều đi kèm một **"lý lịch"** ẩn gọi là metadata. Giống như một tấm thẻ căn cước — nó ghi lại thông tin về nguồn gốc của ảnh.

Hãy tưởng tượng: khi bạn chụp ảnh bằng máy ảnh kỹ thuật số, máy sẽ tự động ghi lại:
- **Camera nào chụp?** Ví dụ: Canon EOS, iPhone 15
- **Chụp lúc nào?** Thời gian, ngày tháng
- **Chụp với cài đặt gì?** Khẩu độ, tốc độ màn trập, ISO, GPS nếu có

Khi AI tạo ảnh, những thông tin này thường **không có hoặc bị sai lệch**.

### Cách phân tích cụ thể

Chúng tôi đọc metadata của ảnh và kiểm tra 3 dấu hiệu:

**1. Phát hiện tên phần mềm AI**
Trong metadata có một trường gọi là `Software`. Nếu trường này chứa tên như "Midjourney", "Stable Diffusion", "DALL·E", "Adobe Firefly" — thì gần như chắc chắn ảnh do AI tạo.

**Ví dụ thực tế:**
```
Software  : Midjourney v6     ← AI
Camera    : (trống)           ← không có máy ảnh
DateTime  : (trống)           ← không có thời gian chụp
```
Ba dấu hiệu này kết hợp với nhau là một tín hiệu cực kỳ mạnh.

**2. Kiểm tra tính nhất quán**
Nếu ảnh được cho là "ảnh chụp từ điện thoại" mà metadata lại không có tên điện thoại, không có GPS, không có thông số ống kính — đó là mâu thuẫn đáng ngờ.

**3. Kiểm tra C2PA — chuẩn xác thực nội dung**
Đây là công nghệ mới giúp "ký số" vào ảnh để chứng minh nguồn gốc. SourceVerify có thể kiểm tra nếu ảnh có chứa những chứng nhận này.

### Kết quả đạt được

**95 điểm AI** — rất cao. Nhưng cần hiểu rõ:

⚠️ **Điểm yếu:** Metadata có thể bị xóa rất dễ dàng. Khi bạn upload ảnh lên Facebook, Zalo, hay bất kỳ mạng xã hội nào, metadata gốc thường bị loại bỏ. Nếu ảnh bị xóa metadata rồi, phương pháp này gần như mất tác dụng.

→ **Metadata Analysis là một lớp bằng chứng về nguồn gốc tệp. Không nên dùng nó làm bằng chứng duy nhất, nhưng nếu có nó thì rất đáng tin.**

---

## SLIDE 7 – NOISE RESIDUAL (PP-02)

### Ý tưởng cốt lõi — nói dễ hiểu

Phương pháp này dựa trên một hiểu biết rất thú vị về vật lý: **khi máy ảnh chụp ảnh, cảm biến luôn tạo ra một lượng nhiễu nhất định.**

Hãy tưởng tượng như thế này:
- Giống như khi bạn quay một video trong điều kiện thiếu sáng — hình ảnh sẽ bị **nhiễu hạt** (grainy). Đó là vì cảm biến phải "gắng sức" để thu sáng.
- Quan trọng hơn: nhiễu này **tăng dần** ở những vùng sáng hơn. Vùng tối thì nhiễu ít, vùng sáng thì nhiễu nhiều — đây gọi là **shot noise**.
- Đây là đặc tính không thể tránh khỏi của cảm biến máy ảnh vật lý.

Còn ảnh AI:
- AI tạo ra ảnh quá **"sạch"** — vì mô hình được huấn luyện để tạo ảnh đẹp nhất, mượt nhất
- Nếu có nhiễu thì nhiễu cũng rất **đều đều** — không có sự thay đổi theo vùng sáng tối như ảnh thật

### Cách phân tích cụ thể

Chúng tôi thực hiện 3 bước:

**Bước 1 — Lọc lấy nhiễu:** Dùng một bộ lọc gọi là Laplacian 3×3 — nó hoạt động như một "tấm lọc" để tách phần nhiễu ra khỏi phần nội dung chính của ảnh. Kết quả là một bức ảnh chỉ toàn nhiễu — gọi là **noise residual**.

**Bước 2 — Chia nhỏ và đo:** Chia ảnh nhiễu thành các ô vuông nhỏ. Với mỗi ô, tính độ lệch chuẩn (standard deviation) — tức là đo xem nhiễu trong ô đó **biến động nhiều hay ít**.

**Bước 3 — So sánh phân bố:** Đo kurtosis — một đại lượng thống kê cho biết hình dạng của phân bố nhiễu. Ảnh thật và ảnh AI sẽ có kurtosis khác nhau.

### Minh họa bằng đồ thị

Nhìn vào đồ thị trong slide:
- **Đường xanh lá** (ảnh thật): nhiễu tăng dần từ trái sang phải — tức là từ vùng tối đến vùng sáng
- **Đường tím** (ảnh AI): nhiễu là đường thẳng nằm ngang — tức là nhiễu không thay đổi gì theo độ sáng

Sự khác biệt này rất rõ rệt và là cơ sở để phân biệt ảnh thật với ảnh AI.

### Kết quả đạt được

**72 điểm AI** — và đây là phương pháp **mạnh nhất** trong 5 phương pháp nên được gán trọng số cao nhất (w = 3.5). Benchmark thực tế cho thấy độ chính xác **67.5%** — cao hơn hẳn so với đoán ngẫu nhiên 50%.

---

## SLIDE 8 – DCT BLOCK ARTIFACTS (PP-03)

### Ý tưởng cốt lõi — nói dễ hiểu

Khi bạn lưu ảnh dưới dạng JPEG, máy tính sẽ nén ảnh lại để tiết kiệm dung lượng. Cách nén này có một đặc điểm rất thú vị: nó chia ảnh thành **từng ô vuông nhỏ 8×8 pixel** và xử lý từng ô một.

Hãy tưởng tượng:
- Giống như bạn lát gạch nền nhà — mỗi viên gạch là một ô 8×8
- Khi lát xong, bạn sẽ thấy đường viền giữa các viên gạch
- Trong ảnh thật JPEG, đường viền này xuất hiện **một cách tự nhiên**

### Tại sao ảnh AI khác?

Ảnh AI thường được lưu dưới định dạng **PNG**, không phải JPEG. PNG nén ảnh theo cách khác — không chia ô 8×8 như JPEG. Vì vậy:

| Trường hợp | Vết khối 8×8 | Kết luận |
|---|---|---|
| Ảnh thật JPEG | Có vết khối **tự nhiên, không đều** | Bình thường |
| Ảnh AI lưu PNG | **Không có** vết khối nào | Đáng nghi |
| Ảnh AI lưu lại thành JPEG | Vết khối **quá đều, quá hoàn hảo** | Cũng đáng nghi |

Vết khối "quá đều" xảy ra vì AI tạo ra ảnh có cấu trúc pixel quá hoàn hảo. Khi nén JPEG, đường biên 8×8 cũng trở nên quá hoàn hảo — khác với ảnh thật vốn đã qua nhiều lần xử lý trong máy ảnh.

### Kết quả đạt được

**65 điểm AI**. Phương pháp này phát huy hiệu quả nhất với ảnh JPEG — loại ảnh phổ biến nhất trên internet. Tuy nhiên, nếu ảnh đã bị resize, cắt xén hoặc chuyển đổi nhiều lần, vết khối có thể bị xóa mờ.

---

## SLIDE 9 – CHROMATIC ABERRATION (PP-04)

### Ý tưởng cốt lõi — nói dễ hiểu

Đây có lẽ là phương pháp thú vị nhất vì nó dựa vào **tính không hoàn hảo của ống kính máy ảnh**.

Hãy tưởng tượng:
- Khi bạn nhìn qua một lăng kính, ánh sáng trắng bị tách thành 7 màu cầu vồng
- Ống kính máy ảnh cũng có tác dụng tương tự, nhưng ở mức độ rất nhỏ
- Kết quả là: ở rìa ảnh, đặc biệt là những chỗ có viền tương phản cao (ví dụ: bầu trời xanh cạnh tòa nhà tối), bạn sẽ thấy **một đường viền màu đỏ hoặc xanh rất mờ**

Hiện tượng này gọi là **Chromatic Aberration** (quang sai màu). Nó là một **khiếm khuyết vật lý** của ống kính thật.

### Ảnh AI thì sao?

Ảnh AI không đi qua ống kính nào cả. Nó được tạo ra từ các con số trong máy tính. Vì vậy, ảnh AI **không có lý do gì để có quang sai màu** — trừ khi mô hình AI vô tình học được và tạo ra, nhưng điều đó rất hiếm.

**Cụ thể cách kiểm tra:**
1. Chúng tôi xét các vùng ở rìa ảnh (vì quang sai xuất hiện nhiều ở rìa)
2. So sánh sự khác biệt giữa kênh màu ĐỎ và kênh màu XANH
3. Nếu thấy độ lệch đáng kể → ảnh có thể là ảnh thật
4. Nếu không thấy độ lệch → ảnh có thể do AI tạo

### Tại sao trọng số lại thấp (w = 0.5)?

Vì:
- Không phải ảnh thật nào cũng có quang sai rõ — ống kính tốt thì quang sai rất nhỏ
- Nhiều ảnh đã qua chỉnh sửa (ví dụ: xóa viền màu) nên làm mất tín hiệu
- Ống kính chất lượng cao (trên máy ảnh chuyên nghiệp) cũng giảm thiểu quang sai

### Kết quả đạt được

**68 điểm AI**. Phương pháp này đóng vai trò **bổ sung** cho hệ thống — nó đại diện cho **góc nhìn quang học** mà 4 phương pháp kia không có.

---

## SLIDE 10 – SPECTRAL NYQUIST (PP-05)

### Ý tưởng cốt lõi — nói dễ hiểu

Đây là phương pháp khó hiểu nhất trong 5 phương pháp, nhưng tôi sẽ giải thích một cách đơn giản.

**Bối cảnh:**
Mọi bức ảnh số đều có thể được phân tích dưới góc nhìn **tần số** — giống như một bài hát có các nốt trầm, nốt cao. Ảnh cũng vậy:
- Vùng chi tiết nhỏ (tóc, lá cây, kết cấu vải) → **tần số cao**
- Vùng mượt mà (bầu trời, tường, da mặt) → **tần số thấp**

Khi AI tạo ảnh, nó thường phải phóng to (upscale) từ một ảnh nhỏ lên ảnh lớn. Quá trình này để lại dấu vết trong miền tần số.

### Cụ thể cách kiểm tra

**Bước 1 — Tính phổ tần số:**
Áp dụng DFT (Discrete Fourier Transform) — một phép toán biến đổi ảnh từ miền không gian (pixel) sang miền tần số. Kết quả là một biểu đồ cho thấy năng lượng ở mỗi tần số.

**Bước 2 — Tìm đỉnh bất thường:**
Trong ảnh thật, năng lượng giảm dần **mượt mà** từ tần số thấp đến tần số cao — giống như một đường cong trơn.

Trong ảnh AI, do quá trình upsampling, thường xuất hiện **một đỉnh nhọn (spike)** ở gần ngưỡng Nyquist (tần số tối đa). Đây là dấu hiệu cho thấy ảnh đã được phóng to bằng thuật toán, không phải do cảm biến thật.

**Bước 3 — Đo tỷ lệ spike:**
So sánh năng lượng tại đỉnh Nyquist với vùng lân cận. Nếu tỷ lệ cao bất thường → đáng nghi.

### Trực quan trên đồ thị

- **Đường xanh** (ảnh thật): phổ mượt giảm dần, không có gai nhọn
- **Đường tím** (ảnh AI): xuống gần đến cuối thì **đột ngột nhảy vọt lên** tạo thành đỉnh

### Kết quả đạt được

**60 điểm AI**. Đây là phương pháp có **chiều sâu học thuật cao nhất** vì liên quan đến lý thuyết xử lý tín hiệu số. Tuy nhiên, nó khá nhạy cảm với việc resize ảnh và nén lại, nên kết quả thực tế chỉ ở mức trung bình.

### Tổng kết ngắn 5 phương pháp

| Phương pháp | Ví von dễ hiểu | Trọng số |
|---|---|---|
| Metadata | "Đọc lý lịch" của ảnh | 1.5 |
| Noise Residual | Kiểm tra "làn da" có quá mịn không | **3.5** |
| DCT Block | Kiểm tra "vết gạch lát nền" 8×8 | 2.0 |
| Chromatic Ab. | Kiểm tra "viền màu" do ống kính | 0.5 |
| Spectral Nyquist | "Soi" ảnh dưới góc nhìn tần số | 1.5 |

---

## SLIDE 11 – TỔNG HỢP ĐIỂM

Sau khi có kết quả từ 5 phương pháp, hệ thống tổng hợp bằng **weighted score**.

```
Score_AI = Σ(score_i × weight_i) / Σ(weight_i)
```

**Ví dụ tổng hợp:**

| Phương pháp | Trọng số | Điểm | Đóng góp |
|---|---|---|---|
| Noise Residual | w = 3.5 | 72 | Cao nhất |
| Chromatic Aberration | w = 0.5 | 68 | Bổ sung |
| DCT Block | w = 2.0 | 65 | Trung bình |
| Spectral Nyquist | w = 1.5 | 60 | Trung bình |
| Metadata | w = 1.5 | 50 | Thấp |

**Ngưỡng kết luận:**
- Score ≥ 55 → **AI**
- Score ≤ 40 → **Real**
- Ở giữa → **Uncertain** (chưa đủ bằng chứng)

---

## SLIDE 12 – KIẾN TRÚC HỆ THỐNG

Hệ thống được tổ chức thành **5 lớp**:

1. **Giao diện người dùng** — React / Next.js
2. **Lớp điều phối** — analyzer.ts, xác thực dữ liệu, gọi các mô-đun
3. **5 phương pháp phân tích** — mỗi phương pháp là module độc lập
4. **Tổng hợp weighted score**
5. **Kết luận + giải thích**

**Luồng xử lý tuần tự:**
Người dùng tải ảnh → Kiểm tra định dạng → Đọc metadata + pixel → Chạy 5 phương pháp → Tổng hợp điểm → Hiển thị kết quả

Kiến trúc này phù hợp Project I vì **đơn giản, dễ hiểu, dễ mở rộng**. Mỗi module độc lập giúp dễ kiểm thử và bổ sung phương pháp mới sau này.

---

## SLIDE 13 – BENCHMARK

Benchmark trên **120 ảnh thật + 120 ảnh AI** — strict accuracy:

| Phương pháp | Accuracy | Nhận xét |
|---|---|---|
| **Noise Residual** | **67.5%** | Cao nhất, vượt ngưỡng ngẫu nhiên rõ rệt |
| DCT Block | 54.6% | Hơi trên ngưỡng ngẫu nhiên |
| Chromatic Aberration | 50.4% | Gần ngưỡng ngẫu nhiên → phù hợp trọng số thấp |
| Spectral Nyquist | 50.0% | Ngang ngưỡng ngẫu nhiên ở strict accuracy |
| **Server Analyzer (tổng hợp)** | **100%** | Với tín hiệu tổng hợp trên tập kiểm thử |

→ **Noise Residual là phương pháp hứa hẹn nhất.** Các phương pháp yếu hơn đóng vai trò bổ sung để tăng độ tin cậy khi kết hợp.

---

## SLIDE 14 – DEMO & KẾT LUẬN

**Giao diện minh họa:** Khi người dùng tải ảnh lên, hệ thống hiển thị:
- **Verdict badge:** AI-GENERATED hoặc REAL (kèm màu sắc)
- **Confidence score:** ví dụ 64%
- **Điểm từng phương pháp** với gauge chart và giải thích ngắn
- **Điểm tổng hợp** dạng donut chart

Người dùng có thể xem chi tiết từng phương pháp để hiểu tại sao ảnh bị đánh giá là AI hay thật.

---

## KẾT LUẬN CHUNG

**SourceVerify** tiếp cận bài toán kiểm chứng ảnh AI theo hướng **digital image forensics đa phương pháp**.

Điểm quan trọng nhất: **đề tài không khẳng định tuyệt đối ảnh thật hay giả, mà đưa ra khung tiếp cận hợp lý, có giải thích và minh bạch.**

**Các công việc đã hoàn thành:**
- Khảo sát bài toán và cơ sở lý thuyết
- Lựa chọn và phân tích 5 phương pháp tiêu biểu
- Thiết kế kiến trúc hệ thống module
- Xây dựng sản phẩm web minh họa

**Hạn chế:**
- Chưa có tập dữ liệu chuẩn lớn
- Một số phương pháp mới dừng ở heuristic
- Hệ thống phù hợp hỗ trợ tham khảo hơn là kết luận cuối cùng

**Phương hướng phát triển:**
- Xây dựng bộ dữ liệu kiểm thử lớn hơn
- Kết hợp với machine learning để tăng độ chính xác
- Mở rộng sang video và văn bản
- Tích hợp chuẩn provenance C2PA

> **Kết luận cuối cùng:** SourceVerify đã đáp ứng đúng tinh thần Project I — tìm hiểu công nghệ, đặt vấn đề, đề xuất giải pháp và hiện thực hóa thành sản phẩm minh họa có ý nghĩa. Giá trị lớn nhất không chỉ là sản phẩm, mà là nền tảng tư duy và cấu trúc kỹ thuật đã xây dựng được.

---

*Em xin cảm ơn thầy cô và các bạn đã lắng nghe. Em sẵn sàng trả lời câu hỏi.*
