/**
 * All method page i18n data — auto-generated from individual method i18n folders
 * This replaces 40+ separate folders with a single data source for the dynamic [slug] route
 */

export interface MethodPageData {
    name: string;
    description: string;
    algorithm: string;
    mechanism: string;
    parameters: string;
    accuracy: string;
    source: string;
    useCase: string;
    references?: { title: string; url: string }[];
    strengths?: string;
    limitations?: string;
}

export type MethodPageI18n = Record<string, MethodPageData>;

export const METHOD_PAGE_DATA: Record<string, MethodPageI18n> = {
    "benford": {
        "en": {
                "name": "Benfords Law",
                "description": "Tests pixel gradient distributions against Benfords Law - a statistical principle that natural data follows a specific first-digit distribution. AI-generated gradients deviate from this pattern.",
                "algorithm": "Benfords Law First-Digit Distribution Test",
                "mechanism": "Analyzes first significant digits in DCT coefficients of 8x8 image blocks. Natural images follow Benfords Law, while AI-generated images deviate from this statistical property.",
                "parameters": "Block size: 8x8, DCT coefficients: AC terms, Test: chi2 goodness-of-fit",
                "accuracy": "Moderate - 65-75%, best as complementary statistical test",
                "source": "Fu et al. (2007) Generalized Benfords Law for JPEG Coefficients, IEEE TIFS",
                "useCase": "Statistical validation of image naturalness through digit distribution",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TIFS.2007.903852",
                                "title": "Fu, D. et al. (2007). Generalized Benford's Law for JPEG Coefficients. IEEE TIFS."
                        },
                        {
                                "url": "https://doi.org/10.1109/ICIP.2007.4379254",
                                "title": "Perez-Gonzalez, F. et al. (2007). Benford's Law in Image Forensics. IEEE ICIP."
                        }
                ],
                "strengths": "• Based on well-established mathematical law\n• Fast computation with minimal overhead\n• Independent of image content type\n• Effective complementary statistical test",
                "limitations": "• Lower standalone accuracy (65-75%)\n• JPEG compression can mask deviations\n• Requires sufficient image complexity\n• Not effective for very small images"
        },
        "vi": {
                "name": "Luật Benford",
                "description": "Kiểm tra phân bố gradient pixel theo Luật Benford — nguyên lý thống kê rằng dữ liệu tự nhiên tuân theo phân bố chữ số đầu cụ thể. Gradient AI lệch khỏi mẫu này.",
                "algorithm": "Kiểm định phân bố chữ số đầu theo Luật Benford",
                "mechanism": "Phân tích chữ số có ý nghĩa đầu tiên trong hệ số DCT của các khối ảnh 8x8. Ảnh tự nhiên tuân theo Luật Benford, trong khi ảnh AI lệch khỏi thuộc tính thống kê này.",
                "parameters": "Kích thước khối: 8x8, Hệ số DCT: thành phần AC, Kiểm định: chi-bình phương goodness-of-fit",
                "accuracy": "Trung bình - 65-75%, hiệu quả nhất khi kết hợp kiểm định thống kê",
                "source": "Fu et al. (2007) - Generalized Benford's Law for JPEG Coefficients, IEEE TIFS",
                "useCase": "Xác nhận thống kê tính tự nhiên của ảnh qua phân bố chữ số",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TIFS.2007.903852",
                                "title": "Fu, D. et al. (2007). Generalized Benford's Law for JPEG Coefficients. IEEE TIFS."
                        },
                        {
                                "url": "https://doi.org/10.1109/ICIP.2007.4379254",
                                "title": "Perez-Gonzalez, F. et al. (2007). Benford's Law in Image Forensics. IEEE ICIP."
                        }
                ],
                "strengths": "• Dựa trên định luật toán học được thiết lập vững chắc\n• Tính toán nhanh với chi phí tối thiểu\n• Độc lập với loại nội dung ảnh\n• Kiểm định thống kê bổ sung hiệu quả",
                "limitations": "• Độ chính xác đơn lẻ thấp hơn (65-75%)\n• Nén JPEG có thể che giấu độ lệch\n• Cần độ phức tạp ảnh đủ lớn\n• Không hiệu quả cho ảnh rất nhỏ"
        },
        "zh": {
                "name": "Benfords Law",
                "description": "Tests pixel gradient distributions against Benfords Law - a statistical principle that natural data follows a specific first-digit distribution. AI-generated gradients deviate from this pattern.",
                "algorithm": "Benfords Law First-Digit Distribution Test",
                "mechanism": "Analyzes first significant digits in DCT coefficients of 8x8 image blocks. Natural images follow Benfords Law, while AI-generated images deviate from this statistical property.",
                "parameters": "Block size: 8x8, DCT coefficients: AC terms, Test: chi2 goodness-of-fit",
                "accuracy": "Moderate - 65-75%, best as complementary statistical test",
                "source": "Fu et al. (2007) Generalized Benfords Law for JPEG Coefficients, IEEE TIFS",
                "useCase": "Statistical validation of image naturalness through digit distribution"
        },
        "ja": {
                "name": "Benfords Law",
                "description": "Tests pixel gradient distributions against Benfords Law - a statistical principle that natural data follows a specific first-digit distribution. AI-generated gradients deviate from this pattern.",
                "algorithm": "Benfords Law First-Digit Distribution Test",
                "mechanism": "Analyzes first significant digits in DCT coefficients of 8x8 image blocks. Natural images follow Benfords Law, while AI-generated images deviate from this statistical property.",
                "parameters": "Block size: 8x8, DCT coefficients: AC terms, Test: chi2 goodness-of-fit",
                "accuracy": "Moderate - 65-75%, best as complementary statistical test",
                "source": "Fu et al. (2007) Generalized Benfords Law for JPEG Coefficients, IEEE TIFS",
                "useCase": "Statistical validation of image naturalness through digit distribution"
        },
        "ko": {
                "name": "Benfords Law",
                "description": "Tests pixel gradient distributions against Benfords Law - a statistical principle that natural data follows a specific first-digit distribution. AI-generated gradients deviate from this pattern.",
                "algorithm": "Benfords Law First-Digit Distribution Test",
                "mechanism": "Analyzes first significant digits in DCT coefficients of 8x8 image blocks. Natural images follow Benfords Law, while AI-generated images deviate from this statistical property.",
                "parameters": "Block size: 8x8, DCT coefficients: AC terms, Test: chi2 goodness-of-fit",
                "accuracy": "Moderate - 65-75%, best as complementary statistical test",
                "source": "Fu et al. (2007) Generalized Benfords Law for JPEG Coefficients, IEEE TIFS",
                "useCase": "Statistical validation of image naturalness through digit distribution"
        },
        "es": {
                "name": "Ley de Benford",
                "description": "Prueba las distribuciones de gradiente de pixeles contra la Ley de Benford.",
                "algorithm": "Benfords Law First-Digit Distribution Test",
                "mechanism": "Analyzes first significant digits in DCT coefficients of 8x8 image blocks. Natural images follow Benfords Law, while AI-generated images deviate from this statistical property.",
                "parameters": "Block size: 8x8, DCT coefficients: AC terms, Test: chi2 goodness-of-fit",
                "accuracy": "Moderate - 65-75%, best as complementary statistical test",
                "source": "Fu et al. (2007) Generalized Benfords Law for JPEG Coefficients, IEEE TIFS",
                "useCase": "Statistical validation of image naturalness through digit distribution"
        },
    },
    "binary_pattern": {
        "en": {
                "useCase": "Detecting synthetic micro-texture patterns characteristic of AI image generators",
                "mechanism": "Computes Local Binary Pattern (LBP) descriptors by comparing each pixel with its 8 neighbors in a circular pattern. The resulting binary codes are compiled into histograms that capture micro-texture characteristics. AI-generated images produce statistically distinct LBP distributions due to their synthetic texture generation process.",
                "accuracy": "Moderate - 72-82% for detecting synthetic texture patterns",
                "name": "Local Binary Pattern (LBP) Analysis",
                "source": "Ojala et al. (2002), IEEE TPAMI - Multiresolution Gray-Scale Texture Classification with LBP",
                "algorithm": "Uniform LBP + Histogram Feature Extraction",
                "parameters": "Radius: 1-3 pixels, Neighbors: 8/16/24, Pattern type: uniform/rotation-invariant, Histogram bins: 59 (uniform LBP)",
                "description": "Extracts micro-texture descriptors using LBP operators. AI-generated images produce distinct LBP histogram distributions compared to natural photographs.",
                "strengths": "• Computationally efficient and fast\n• Rotation invariant with uniform patterns\n• Captures fine-grained texture details\n• Works well across different image resolutions",
                "limitations": "• Sensitive to noise and compression artifacts\n• Limited to local texture analysis\n• May miss global structural anomalies\n• Performance degrades with heavy post-processing",
                "references": [
                        {
                                "title": "Ojala, T. et al. (2002). Multiresolution Gray-Scale and Rotation Invariant Texture Classification with LBP. IEEE TPAMI.",
                                "url": "https://doi.org/10.1109/TPAMI.2002.1017623"
                        },
                        {
                                "title": "Nataraj, L. et al. (2019). Detecting GAN Generated Fake Images using Co-occurrence Matrices. Electronic Imaging.",
                                "url": "https://doi.org/10.2352/ISSN.2470-1173.2019.5.MWSF-532"
                        }
                ]
        },
        "vi": {
                "useCase": "Phát hiện mẫu vi kết cấu tổng hợp đặc trưng của bộ tạo ảnh AI",
                "mechanism": "Tính toán bộ mô tả LBP bằng cách so sánh từng pixel với 8 pixel lân cận theo mẫu tròn. Mã nhị phân kết quả được biên dịch thành biểu đồ mô tả đặc điểm vi kết cấu. Ảnh AI tạo phân bố LBP khác biệt thống kê do quy trình tạo kết cấu tổng hợp.",
                "accuracy": "Trung bình - 72-82% phát hiện mẫu kết cấu tổng hợp",
                "name": "Phân tích mẫu nhị phân cục bộ (LBP)",
                "source": "Ojala et al. (2002), IEEE TPAMI - Phân loại kết cấu đa phân giải với LBP",
                "algorithm": "LBP đồng nhất + Trích xuất đặc trưng biểu đồ",
                "parameters": "Bán kính: 1-3 pixel, Lân cận: 8/16/24, Loại mẫu: đồng nhất/bất biến xoay, Bins histogram: 59 (LBP đồng nhất)",
                "description": "Trích xuất mô tả vi kết cấu bằng toán tử LBP. Ảnh AI tạo phân bố biểu đồ LBP khác biệt so với ảnh tự nhiên.",
                "strengths": "• Tính toán hiệu quả và nhanh\n• Bất biến xoay với mẫu đồng nhất\n• Nắm bắt chi tiết kết cấu tinh vi\n• Hoạt động tốt trên nhiều độ phân giải",
                "limitations": "• Nhạy cảm với nhiễu và hiện vật nén\n• Giới hạn ở phân tích kết cấu cục bộ\n• Có thể bỏ sót bất thường cấu trúc toàn cục\n• Hiệu suất giảm với hậu xử lý nặng",
                "references": [
                        {
                                "title": "Ojala, T. et al. (2002). Multiresolution Gray-Scale and Rotation Invariant Texture Classification with LBP. IEEE TPAMI.",
                                "url": "https://doi.org/10.1109/TPAMI.2002.1017623"
                        },
                        {
                                "title": "Nataraj, L. et al. (2019). Detecting GAN Generated Fake Images using Co-occurrence Matrices. Electronic Imaging.",
                                "url": "https://doi.org/10.2352/ISSN.2470-1173.2019.5.MWSF-532"
                        }
                ]
        },
        "zh": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Local Binary Pattern (LBP) Analysis",
                "source": "",
                "algorithm": "Uniform LBP + Histogram Feature Extraction",
                "parameters": "",
                "description": "Extracts micro-texture descriptors using LBP operators. AI-generated images produce distinct LBP histogram distributions compared to natural photographs.",
                "references": [
                        {
                                "title": "Ojala, T. et al. (2002). Multiresolution Gray-Scale and Rotation Invariant Texture Classification with LBP. IEEE TPAMI.",
                                "url": "https://doi.org/10.1109/TPAMI.2002.1017623"
                        },
                        {
                                "title": "Nataraj, L. et al. (2019). Detecting GAN Generated Fake Images using Co-occurrence Matrices. Electronic Imaging.",
                                "url": "https://doi.org/10.2352/ISSN.2470-1173.2019.5.MWSF-532"
                        }
                ]
        },
        "ja": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Local Binary Pattern (LBP) Analysis",
                "source": "",
                "algorithm": "Uniform LBP + Histogram Feature Extraction",
                "parameters": "",
                "description": "Extracts micro-texture descriptors using LBP operators. AI-generated images produce distinct LBP histogram distributions compared to natural photographs.",
                "references": [
                        {
                                "title": "Ojala, T. et al. (2002). Multiresolution Gray-Scale and Rotation Invariant Texture Classification with LBP. IEEE TPAMI.",
                                "url": "https://doi.org/10.1109/TPAMI.2002.1017623"
                        },
                        {
                                "title": "Nataraj, L. et al. (2019). Detecting GAN Generated Fake Images using Co-occurrence Matrices. Electronic Imaging.",
                                "url": "https://doi.org/10.2352/ISSN.2470-1173.2019.5.MWSF-532"
                        }
                ]
        },
        "ko": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Local Binary Pattern (LBP) Analysis",
                "source": "",
                "algorithm": "Uniform LBP + Histogram Feature Extraction",
                "parameters": "",
                "description": "Extracts micro-texture descriptors using LBP operators. AI-generated images produce distinct LBP histogram distributions compared to natural photographs.",
                "references": [
                        {
                                "title": "Ojala, T. et al. (2002). Multiresolution Gray-Scale and Rotation Invariant Texture Classification with LBP. IEEE TPAMI.",
                                "url": "https://doi.org/10.1109/TPAMI.2002.1017623"
                        },
                        {
                                "title": "Nataraj, L. et al. (2019). Detecting GAN Generated Fake Images using Co-occurrence Matrices. Electronic Imaging.",
                                "url": "https://doi.org/10.2352/ISSN.2470-1173.2019.5.MWSF-532"
                        }
                ]
        },
        "es": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Local Binary Pattern (LBP) Analysis",
                "source": "",
                "algorithm": "Uniform LBP + Histogram Feature Extraction",
                "parameters": "",
                "description": "Extracts micro-texture descriptors using LBP operators. AI-generated images produce distinct LBP histogram distributions compared to natural photographs.",
                "references": [
                        {
                                "title": "Ojala, T. et al. (2002). Multiresolution Gray-Scale and Rotation Invariant Texture Classification with LBP. IEEE TPAMI.",
                                "url": "https://doi.org/10.1109/TPAMI.2002.1017623"
                        },
                        {
                                "title": "Nataraj, L. et al. (2019). Detecting GAN Generated Fake Images using Co-occurrence Matrices. Electronic Imaging.",
                                "url": "https://doi.org/10.2352/ISSN.2470-1173.2019.5.MWSF-532"
                        }
                ]
        },
    },
    "cfa": {
        "en": {
                "name": "CFA Pattern Detection",
                "description": "Searches for Bayer Color Filter Array demosaicing artifacts left by real camera sensors. This fingerprint is a strong indicator of real photography and is absent in AI images.",
                "algorithm": "Color Filter Array (Bayer CFA) Demosaicing Trace Detection",
                "mechanism": "Detects periodic correlation patterns from Bayer CFA demosaicing in real cameras. These traces are absent in AI-generated images.",
                "parameters": "Analysis: 2D autocorrelation of green channel, Expected pattern: 2x2 periodic",
                "accuracy": "High - 80-92% for images from known camera sensors",
                "source": "Popescu and Farid (2005), ACM Workshop on Multimedia and Security",
                "useCase": "Verifying authentic camera origin through CFA demosaicing artifacts",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TSP.2005.855406",
                                "title": "Popescu, A.C. & Farid, H. (2005). Exposing Digital Forgeries in Color Filter Array Interpolated Images. IEEE TSP."
                        },
                        {
                                "url": "https://doi.org/10.1109/ICIP.2009.5413963",
                                "title": "Dirik, A.E. & Memon, N. (2009). Image tamper detection based on demosaicing artifacts. IEEE ICIP."
                        }
                ],
                "strengths": "• Strong indicator of real camera origin\n• Based on physical sensor hardware\n• Difficult for AI to simulate CFA patterns\n• Very low false positive rate on camera images",
                "limitations": "• Only detects presence/absence of CFA patterns\n• Some cameras apply heavy demosaicing that masks patterns\n• Resizing or heavy processing destroys CFA traces\n• Cannot identify specific camera model"
        },
        "vi": {
                "name": "Mẫu cảm biến CFA",
                "description": "Tìm kiếm lỗi demosaicing của Bộ lọc Bayer từ cảm biến thật. Dấu vân tay này là chỉ báo mạnh của ảnh chụp thật và không có trong ảnh AI.",
                "algorithm": "Phát hiện dấu vết Demosaicing bộ lọc màu CFA (Bayer)",
                "mechanism": "Phát hiện mẫu tương quan chu kỳ từ demosaicing CFA Bayer trong camera thật. Các dấu vết này vắng mặt trong ảnh AI.",
                "parameters": "Phân tích: tự tương quan 2D kênh xanh, Mẫu kỳ vọng: chu kỳ 2x2",
                "accuracy": "Cao - 80-92% cho ảnh từ cảm biến camera đã biết",
                "source": "Popescu & Farid (2005) - ACM Workshop on Multimedia and Security",
                "useCase": "Xác minh nguồn gốc camera xác thực qua hiện vật demosaicing CFA",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TSP.2005.855406",
                                "title": "Popescu, A.C. & Farid, H. (2005). Exposing Digital Forgeries in Color Filter Array Interpolated Images. IEEE TSP."
                        },
                        {
                                "url": "https://doi.org/10.1109/ICIP.2009.5413963",
                                "title": "Dirik, A.E. & Memon, N. (2009). Image tamper detection based on demosaicing artifacts. IEEE ICIP."
                        }
                ],
                "strengths": "• Chỉ báo mạnh về nguồn gốc camera thật\n• Dựa trên phần cứng cảm biến vật lý\n• AI khó mô phỏng mẫu CFA\n• Tỷ lệ dương tính giả rất thấp trên ảnh camera",
                "limitations": "• Chỉ phát hiện sự có/vắng mặt của mẫu CFA\n• Một số camera áp dụng demosaicing nặng che mẫu\n• Thay đổi kích thước hoặc xử lý nặng phá hủy dấu vết CFA\n• Không nhận dạng được model camera cụ thể"
        },
        "zh": {
                "name": "CFA Pattern Detection",
                "description": "Searches for Bayer Color Filter Array demosaicing artifacts left by real camera sensors. This fingerprint is a strong indicator of real photography and is absent in AI images.",
                "algorithm": "Color Filter Array (Bayer CFA) Demosaicing Trace Detection",
                "mechanism": "Detects periodic correlation patterns from Bayer CFA demosaicing in real cameras. These traces are absent in AI-generated images.",
                "parameters": "Analysis: 2D autocorrelation of green channel, Expected pattern: 2x2 periodic",
                "accuracy": "High - 80-92% for images from known camera sensors",
                "source": "Popescu and Farid (2005), ACM Workshop on Multimedia and Security",
                "useCase": "Verifying authentic camera origin through CFA demosaicing artifacts"
        },
        "ja": {
                "name": "CFA Pattern Detection",
                "description": "Searches for Bayer Color Filter Array demosaicing artifacts left by real camera sensors. This fingerprint is a strong indicator of real photography and is absent in AI images.",
                "algorithm": "Color Filter Array (Bayer CFA) Demosaicing Trace Detection",
                "mechanism": "Detects periodic correlation patterns from Bayer CFA demosaicing in real cameras. These traces are absent in AI-generated images.",
                "parameters": "Analysis: 2D autocorrelation of green channel, Expected pattern: 2x2 periodic",
                "accuracy": "High - 80-92% for images from known camera sensors",
                "source": "Popescu and Farid (2005), ACM Workshop on Multimedia and Security",
                "useCase": "Verifying authentic camera origin through CFA demosaicing artifacts"
        },
        "ko": {
                "name": "CFA Pattern Detection",
                "description": "Searches for Bayer Color Filter Array demosaicing artifacts left by real camera sensors. This fingerprint is a strong indicator of real photography and is absent in AI images.",
                "algorithm": "Color Filter Array (Bayer CFA) Demosaicing Trace Detection",
                "mechanism": "Detects periodic correlation patterns from Bayer CFA demosaicing in real cameras. These traces are absent in AI-generated images.",
                "parameters": "Analysis: 2D autocorrelation of green channel, Expected pattern: 2x2 periodic",
                "accuracy": "High - 80-92% for images from known camera sensors",
                "source": "Popescu and Farid (2005), ACM Workshop on Multimedia and Security",
                "useCase": "Verifying authentic camera origin through CFA demosaicing artifacts"
        },
        "es": {
                "name": "Deteccion de patron CFA",
                "description": "Busca artefactos de demosaicing del Filtro de Color Bayer dejados por sensores de camara reales.",
                "algorithm": "Color Filter Array (Bayer CFA) Demosaicing Trace Detection",
                "mechanism": "Detects periodic correlation patterns from Bayer CFA demosaicing in real cameras. These traces are absent in AI-generated images.",
                "parameters": "Analysis: 2D autocorrelation of green channel, Expected pattern: 2x2 periodic",
                "accuracy": "High - 80-92% for images from known camera sensors",
                "source": "Popescu and Farid (2005), ACM Workshop on Multimedia and Security",
                "useCase": "Verifying authentic camera origin through CFA demosaicing artifacts"
        },
    },
    "chi_square": {
        "en": {
                "useCase": "Detecting hidden information, compression irregularities, and AI-generated JPEG anomalies",
                "mechanism": "Analyzes the distribution of quantized DCT coefficients using chi-square statistics. Expected distributions follow predictable patterns for natural images; deviations indicate manipulation, AI generation, or hidden data embedding.",
                "accuracy": "Medium - 72-83% for detecting compression anomalies and AI artifacts",
                "name": "Chi-Square Analysis",
                "source": "Westfeld & Pfitzmann (2000) - Attacks on Steganographic Systems; Fridrich et al. (2003)",
                "algorithm": "Chi-Square Goodness-of-Fit Test on DCT Coefficients",
                "parameters": "Block size: 8x8 DCT, Test: chi-square goodness-of-fit, Significance: p < 0.05, Coefficients: AC components",
                "description": "Applies chi-square statistical test to DCT coefficient distributions to detect steganographic embedding and compression anomalies common in AI outputs.",
                "references": [
                        {
                                "url": "https://doi.org/10.1007/3-540-44499-8_5",
                                "title": "Westfeld, A. & Pfitzmann, A. (2000). Attacks on Steganographic Systems. Information Hiding."
                        },
                        {
                                "url": "https://doi.org/10.1007/978-3-540-39929-3_7",
                                "title": "Fridrich, J. et al. (2003). Detection of Double-Compression in JPEG Images. Information Hiding."
                        }
                ],
                "strengths": "• Well-established statistical framework\n• Detects both steganography and AI artifacts\n• Fast computation on DCT coefficients\n• Quantifiable p-value for confidence",
                "limitations": "• Only works on JPEG compressed images\n• Sensitive to image quality and size\n• High compression can mask anomalies\n• Limited effectiveness on PNG/WebP formats"
        },
        "vi": {
                "useCase": "Phát hiện bất thường nén và hiện vật AI JPEG",
                "mechanism": "Phân tích phân phối hệ số DCT lượng tử bằng thống kê Chi-Square.",
                "accuracy": "Trung bình - 72-83%",
                "name": "Phân tích Chi-Square",
                "source": "Westfeld & Pfitzmann (2000); Fridrich et al. (2003)",
                "algorithm": "Kiểm định Chi-Square trên hệ số DCT",
                "parameters": "Kích thước khối: 8x8, Kiểm định: Chi-Square, Ý nghĩa: p < 0.05",
                "description": "Áp dụng kiểm định Chi-Square lên phân phối hệ số DCT để phát hiện bất thường nén phổ biến trong đầu ra AI.",
                "references": [
                        {
                                "url": "https://doi.org/10.1007/3-540-44499-8_5",
                                "title": "Westfeld, A. & Pfitzmann, A. (2000). Attacks on Steganographic Systems. Information Hiding."
                        },
                        {
                                "url": "https://doi.org/10.1007/978-3-540-39929-3_7",
                                "title": "Fridrich, J. et al. (2003). Detection of Double-Compression in JPEG Images. Information Hiding."
                        }
                ],
                "strengths": "• Khung thống kê được thiết lập vững chắc\n• Phát hiện cả ẩn mã và hiện vật AI\n• Tính toán nhanh trên hệ số DCT\n• Giá trị p định lượng cho độ tin cậy",
                "limitations": "• Chỉ hoạt động trên ảnh nén JPEG\n• Nhạy cảm với chất lượng và kích thước ảnh\n• Nén cao có thể che giấu bất thường\n• Hiệu quả hạn chế trên định dạng PNG/WebP"
        },
        "zh": {
                "useCase": "检测压缩异常",
                "mechanism": "分析量化DCT系数的分布。",
                "accuracy": "中 - 72-83%",
                "name": "卡方分析",
                "source": "Westfeld & Pfitzmann (2000)",
                "algorithm": "DCT系数卡方检验",
                "parameters": "块: 8x8, 显著性: p < 0.05",
                "description": "对DCT系数分布进行卡方检验。"
        },
        "ja": {
                "useCase": "圧縮異常の検出",
                "mechanism": "量子化DCT係数の分布を分析。",
                "accuracy": "中 - 72-83%",
                "name": "カイ二乗分析",
                "source": "Westfeld (2000)",
                "algorithm": "DCT係数カイ二乗検定",
                "parameters": "ブロック: 8x8, 有意性: p < 0.05",
                "description": "DCT係数分布にカイ二乗検定を適用。"
        },
        "ko": {
                "useCase": "압축 이상 감지",
                "mechanism": "양자화된 DCT 계수의 분포를 분석합니다.",
                "accuracy": "중간 - 72-83%",
                "name": "카이제곱 분석",
                "source": "Westfeld (2000)",
                "algorithm": "DCT 계수 카이제곱 검정",
                "parameters": "블록: 8x8, 유의성: p < 0.05",
                "description": "DCT 계수 분포에 카이제곱 검정을 적용합니다."
        },
        "es": {
                "useCase": "Detectar anomalias de compresion",
                "mechanism": "Analiza la distribucion de coeficientes DCT cuantizados.",
                "accuracy": "Medio - 72-83%",
                "name": "Analisis Chi-cuadrado",
                "source": "Westfeld (2000)",
                "algorithm": "Prueba Chi-cuadrado de coeficientes DCT",
                "parameters": "Bloque: 8x8, Significancia: p < 0.05",
                "description": "Aplica prueba Chi-cuadrado a coeficientes DCT."
        },
    },
    "chromatic": {
        "en": {
                "name": "Chromatic Aberration",
                "description": "Detects color fringing at high-contrast edges produced by real camera lenses. AI-generated images typically lack this optical artifact since they dont simulate lens physics.",
                "algorithm": "Chromatic Aberration Pattern Detection",
                "mechanism": "Measures color channel misalignment across the image. Real camera lenses produce predictable radial chromatic aberration. AI images either lack this or produce physically implausible patterns.",
                "parameters": "Channel pairs: R-G, R-B, G-B, Measurement: phase correlation, Radial model: Brown-Conrady",
                "accuracy": "Moderate-High - 75-85% when chromatic aberration is detectable",
                "source": "Johnson and Farid (2006), ACM Workshop on Multimedia and Security",
                "useCase": "Detecting absence or inconsistency of lens-induced chromatic aberration",
                "references": [
                        {
                                "url": "https://doi.org/10.1145/1180639.1180649",
                                "title": "Johnson, M.K. & Farid, H. (2006). Exposing Digital Forgeries Through Chromatic Aberration. ACM Workshop MMS."
                        },
                        {
                                "url": "https://doi.org/10.1007/s11263-010-0403-1",
                                "title": "Yerushalmy, I. & Hel-Or, H. (2011). Digital Image Forgery Detection Based on Lens and Sensor Aberration. IJCV."
                        }
                ],
                "strengths": "• Based on physical optics of real lenses\n• AI generators rarely simulate lens physics\n• Predictable radial pattern in real photos\n• Strong authenticity indicator when present",
                "limitations": "• Not all real photos have detectable aberration\n• High-quality lens corrections may remove traces\n• Small or cropped images reduce detection\n• Some AI models are learning to add fake aberration"
        },
        "vi": {
                "name": "Quang sai sắc",
                "description": "Phát hiện viền màu tại cạnh tương phản cao do ống kính máy ảnh thật tạo ra. Ảnh AI thường thiếu hiện tượng quang học này vì không mô phỏng vật lý ống kính.",
                "algorithm": "Phát hiện mẫu quang sai sắc",
                "mechanism": "Đo lệch kênh màu trên toàn ảnh. Ống kính camera thật tạo quang sai sắc hướng tâm có thể dự đoán. Ảnh AI thiếu hoặc tạo mẫu không hợp lý về mặt vật lý.",
                "parameters": "Cặp kênh: R-G, R-B, G-B, Phép đo: tương quan pha, Mô hình tâm: Brown-Conrady",
                "accuracy": "Trung bình-Cao - 75-85% khi quang sai sắc có thể phát hiện",
                "source": "Johnson & Farid (2006) - ACM Workshop on Multimedia and Security",
                "useCase": "Phát hiện sự vắng mặt hoặc không nhất quán của quang sai sắc từ ống kính",
                "references": [
                        {
                                "url": "https://doi.org/10.1145/1180639.1180649",
                                "title": "Johnson, M.K. & Farid, H. (2006). Exposing Digital Forgeries Through Chromatic Aberration. ACM Workshop MMS."
                        },
                        {
                                "url": "https://doi.org/10.1007/s11263-010-0403-1",
                                "title": "Yerushalmy, I. & Hel-Or, H. (2011). Digital Image Forgery Detection Based on Lens and Sensor Aberration. IJCV."
                        }
                ],
                "strengths": "• Dựa trên quang học vật lý của ống kính thật\n• Bộ tạo AI hiếm khi mô phỏng vật lý ống kính\n• Mẫu bán kính có thể dự đoán trong ảnh thật\n• Chỉ báo xác thực mạnh khi có mặt",
                "limitations": "• Không phải ảnh thật nào cũng có quang sai phát hiện được\n• Hiệu chỉnh ống kính chất lượng cao có thể xóa dấu vết\n• Ảnh nhỏ hoặc cắt xén giảm khả năng phát hiện\n• Một số mô hình AI đang học thêm quang sai giả"
        },
        "zh": {
                "name": "Chromatic Aberration",
                "description": "Detects color fringing at high-contrast edges produced by real camera lenses. AI-generated images typically lack this optical artifact since they dont simulate lens physics.",
                "algorithm": "Chromatic Aberration Pattern Detection",
                "mechanism": "Measures color channel misalignment across the image. Real camera lenses produce predictable radial chromatic aberration. AI images either lack this or produce physically implausible patterns.",
                "parameters": "Channel pairs: R-G, R-B, G-B, Measurement: phase correlation, Radial model: Brown-Conrady",
                "accuracy": "Moderate-High - 75-85% when chromatic aberration is detectable",
                "source": "Johnson and Farid (2006), ACM Workshop on Multimedia and Security",
                "useCase": "Detecting absence or inconsistency of lens-induced chromatic aberration"
        },
        "ja": {
                "name": "Chromatic Aberration",
                "description": "Detects color fringing at high-contrast edges produced by real camera lenses. AI-generated images typically lack this optical artifact since they dont simulate lens physics.",
                "algorithm": "Chromatic Aberration Pattern Detection",
                "mechanism": "Measures color channel misalignment across the image. Real camera lenses produce predictable radial chromatic aberration. AI images either lack this or produce physically implausible patterns.",
                "parameters": "Channel pairs: R-G, R-B, G-B, Measurement: phase correlation, Radial model: Brown-Conrady",
                "accuracy": "Moderate-High - 75-85% when chromatic aberration is detectable",
                "source": "Johnson and Farid (2006), ACM Workshop on Multimedia and Security",
                "useCase": "Detecting absence or inconsistency of lens-induced chromatic aberration"
        },
        "ko": {
                "name": "Chromatic Aberration",
                "description": "Detects color fringing at high-contrast edges produced by real camera lenses. AI-generated images typically lack this optical artifact since they dont simulate lens physics.",
                "algorithm": "Chromatic Aberration Pattern Detection",
                "mechanism": "Measures color channel misalignment across the image. Real camera lenses produce predictable radial chromatic aberration. AI images either lack this or produce physically implausible patterns.",
                "parameters": "Channel pairs: R-G, R-B, G-B, Measurement: phase correlation, Radial model: Brown-Conrady",
                "accuracy": "Moderate-High - 75-85% when chromatic aberration is detectable",
                "source": "Johnson and Farid (2006), ACM Workshop on Multimedia and Security",
                "useCase": "Detecting absence or inconsistency of lens-induced chromatic aberration"
        },
        "es": {
                "name": "Aberracion cromatica",
                "description": "Detecta dispersion de color en bordes de alto contraste producida por lentes de camara reales.",
                "algorithm": "Chromatic Aberration Pattern Detection",
                "mechanism": "Measures color channel misalignment across the image. Real camera lenses produce predictable radial chromatic aberration. AI images either lack this or produce physically implausible patterns.",
                "parameters": "Channel pairs: R-G, R-B, G-B, Measurement: phase correlation, Radial model: Brown-Conrady",
                "accuracy": "Moderate-High - 75-85% when chromatic aberration is detectable",
                "source": "Johnson and Farid (2006), ACM Workshop on Multimedia and Security",
                "useCase": "Detecting absence or inconsistency of lens-induced chromatic aberration"
        },
    },
    "clip_detection": {
        "en": {
                "useCase": "Zero-shot and few-shot detection of AI-generated content across multiple generator types",
                "mechanism": "Encodes the input image using CLIP's ViT-L/14 vision encoder to produce a 768-dimensional feature vector. A trained linear probe classifier then determines whether the semantic features match patterns typical of AI-generated content. Leverages CLIP's understanding of visual-semantic relationships.",
                "accuracy": "High - 85-93% across diverse AI generators",
                "name": "CLIP-based AI Detection",
                "source": "Radford et al. (2021) - Learning Transferable Visual Models From Natural Language Supervision, ICML",
                "algorithm": "CLIP ViT-L/14 + Linear Probe Classifier",
                "parameters": "Backbone: ViT-L/14, Feature dim: 768, Classifier: linear probe, Input size: 224x224, Preprocessing: center crop + normalize",
                "description": "Leverages OpenAI CLIP vision-language model to detect semantic inconsistencies between image content and expected real-world properties. Uses contrastive learning for zero-shot detection.",
                "strengths": "• Excellent generalization across AI generators\n• Captures high-level semantic inconsistencies\n• Pre-trained on massive dataset (400M image-text pairs)\n• Works well without fine-tuning",
                "limitations": "• Requires significant computational resources\n• May not catch low-level pixel artifacts\n• Performance varies with image resolution\n• Large model size (~900MB)",
                "references": [
                        {
                                "title": "Radford, A. et al. (2021). Learning Transferable Visual Models From Natural Language Supervision. ICML.",
                                "url": "https://arxiv.org/abs/2103.00020"
                        },
                        {
                                "title": "Ojha, U. et al. (2023). Towards Universal Fake Image Detectors that Generalize Across Generative Models. CVPR.",
                                "url": "https://arxiv.org/abs/2302.10174"
                        }
                ]
        },
        "vi": {
                "useCase": "Phát hiện zero-shot và few-shot nội dung AI trên nhiều loại bộ tạo",
                "mechanism": "Mã hóa ảnh đầu vào bằng bộ mã hóa thị giác ViT-L/14 của CLIP để tạo vector đặc trưng 768 chiều. Bộ phân loại tuyến tính đã huấn luyện xác định xem đặc trưng ngữ nghĩa có khớp mẫu điển hình của nội dung AI hay không.",
                "accuracy": "Cao - 85-93% trên nhiều loại bộ tạo AI",
                "name": "Phát hiện AI dựa trên CLIP",
                "source": "Radford et al. (2021) - Học mô hình thị giác có thể chuyển giao từ giám sát ngôn ngữ tự nhiên, ICML",
                "algorithm": "CLIP ViT-L/14 + Bộ phân loại tuyến tính",
                "parameters": "Backbone: ViT-L/14, Chiều đặc trưng: 768, Bộ phân loại: tuyến tính, Đầu vào: 224x224, Tiền xử lý: cắt giữa + chuẩn hóa",
                "description": "Sử dụng mô hình thị giác-ngôn ngữ CLIP của OpenAI để phát hiện bất nhất quán ngữ nghĩa. Dùng học đối lập cho phát hiện zero-shot.",
                "strengths": "• Tổng quát hóa xuất sắc trên nhiều bộ tạo AI\n• Nắm bắt sự không nhất quán ngữ nghĩa cấp cao\n• Được huấn luyện trên tập dữ liệu khổng lồ (400M cặp ảnh-text)\n• Hoạt động tốt không cần tinh chỉnh",
                "limitations": "• Yêu cầu tài nguyên tính toán đáng kể\n• Có thể không phát hiện hiện vật mức pixel thấp\n• Hiệu suất thay đổi theo độ phân giải\n• Kích thước mô hình lớn (~900MB)",
                "references": [
                        {
                                "title": "Radford, A. et al. (2021). Learning Transferable Visual Models From Natural Language Supervision. ICML.",
                                "url": "https://arxiv.org/abs/2103.00020"
                        },
                        {
                                "title": "Ojha, U. et al. (2023). Towards Universal Fake Image Detectors that Generalize Across Generative Models. CVPR.",
                                "url": "https://arxiv.org/abs/2302.10174"
                        }
                ]
        },
        "zh": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "CLIP-based AI Detection",
                "source": "",
                "algorithm": "CLIP ViT-L/14 + Linear Probe Classifier",
                "parameters": "",
                "description": "Leverages OpenAI CLIP vision-language model to detect semantic inconsistencies between image content and expected real-world properties. Uses contrastive learning for zero-shot detection.",
                "references": [
                        {
                                "title": "Radford, A. et al. (2021). Learning Transferable Visual Models From Natural Language Supervision. ICML.",
                                "url": "https://arxiv.org/abs/2103.00020"
                        },
                        {
                                "title": "Ojha, U. et al. (2023). Towards Universal Fake Image Detectors that Generalize Across Generative Models. CVPR.",
                                "url": "https://arxiv.org/abs/2302.10174"
                        }
                ]
        },
        "ja": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "CLIP-based AI Detection",
                "source": "",
                "algorithm": "CLIP ViT-L/14 + Linear Probe Classifier",
                "parameters": "",
                "description": "Leverages OpenAI CLIP vision-language model to detect semantic inconsistencies between image content and expected real-world properties. Uses contrastive learning for zero-shot detection.",
                "references": [
                        {
                                "title": "Radford, A. et al. (2021). Learning Transferable Visual Models From Natural Language Supervision. ICML.",
                                "url": "https://arxiv.org/abs/2103.00020"
                        },
                        {
                                "title": "Ojha, U. et al. (2023). Towards Universal Fake Image Detectors that Generalize Across Generative Models. CVPR.",
                                "url": "https://arxiv.org/abs/2302.10174"
                        }
                ]
        },
        "ko": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "CLIP-based AI Detection",
                "source": "",
                "algorithm": "CLIP ViT-L/14 + Linear Probe Classifier",
                "parameters": "",
                "description": "Leverages OpenAI CLIP vision-language model to detect semantic inconsistencies between image content and expected real-world properties. Uses contrastive learning for zero-shot detection.",
                "references": [
                        {
                                "title": "Radford, A. et al. (2021). Learning Transferable Visual Models From Natural Language Supervision. ICML.",
                                "url": "https://arxiv.org/abs/2103.00020"
                        },
                        {
                                "title": "Ojha, U. et al. (2023). Towards Universal Fake Image Detectors that Generalize Across Generative Models. CVPR.",
                                "url": "https://arxiv.org/abs/2302.10174"
                        }
                ]
        },
        "es": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "CLIP-based AI Detection",
                "source": "",
                "algorithm": "CLIP ViT-L/14 + Linear Probe Classifier",
                "parameters": "",
                "description": "Leverages OpenAI CLIP vision-language model to detect semantic inconsistencies between image content and expected real-world properties. Uses contrastive learning for zero-shot detection.",
                "references": [
                        {
                                "title": "Radford, A. et al. (2021). Learning Transferable Visual Models From Natural Language Supervision. ICML.",
                                "url": "https://arxiv.org/abs/2103.00020"
                        },
                        {
                                "title": "Ojha, U. et al. (2023). Towards Universal Fake Image Detectors that Generalize Across Generative Models. CVPR.",
                                "url": "https://arxiv.org/abs/2302.10174"
                        }
                ]
        },
    },
    "color": {
        "en": {
                "name": "Color Channel Correlation",
                "description": "Examines how RGB color channels correlate with each other. Natural light produces predictable inter-channel correlations that AI generators fail to reproduce accurately.",
                "algorithm": "Inter-Channel Color Correlation Analysis",
                "mechanism": "Analyzes statistical correlations between R, G, B channels. Real photographs exhibit natural inter-channel correlations from scene illumination. AI images produce subtly different patterns.",
                "parameters": "Block size: 32x32, Metrics: Pearson correlation R-G/R-B/G-B, global histogram correlation",
                "accuracy": "Low-Moderate - 60-70%, best as complementary signal",
                "source": "Adapted from Gijsenij et al. (2011), color constancy forensics",
                "useCase": "Supplementary detection of AI-generated color distribution anomalies",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TIP.2010.2072681",
                                "title": "Gijsenij, A. et al. (2011). Computational Color Constancy: Survey and Experiments. IEEE TIP."
                        },
                        {
                                "url": "https://doi.org/10.1007/978-3-642-16435-4_5",
                                "title": "Riess, C. & Angelopoulou, E. (2010). Scene Illumination as an Indicator of Image Manipulation. Information Hiding."
                        }
                ],
                "strengths": "• Fast and computationally lightweight\n• Captures natural illumination properties\n• Works across different image formats\n• Good complementary signal with other methods",
                "limitations": "• Lower standalone accuracy (60-70%)\n• Color-corrected images may produce false results\n• Monochrome or limited-palette images are difficult\n• AI models improving at reproducing natural color correlations"
        },
        "vi": {
                "name": "Tương quan kênh màu",
                "description": "Kiểm tra tương quan giữa các kênh RGB. Ánh sáng tự nhiên tạo tương quan liên kênh dự đoán được mà AI không thể tái tạo chính xác.",
                "algorithm": "Phân tích tương quan màu liên kênh",
                "mechanism": "Phân tích tương quan thống kê giữa các kênh R, G, B. Ảnh thật có tương quan liên kênh tự nhiên từ chiếu sáng cảnh. Ảnh AI tạo mẫu hơi khác biệt.",
                "parameters": "Kích thước khối: 32x32, Chỉ số: tương quan Pearson R-G/R-B/G-B, tương quan histogram toàn cục",
                "accuracy": "Thấp-Trung bình - 60-70%, hiệu quả nhất khi kết hợp tín hiệu khác",
                "source": "Gijsenij et al. (2011) - Pháp y hằng số màu",
                "useCase": "Phát hiện bổ sung bất thường phân phối màu trong ảnh AI",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TIP.2010.2072681",
                                "title": "Gijsenij, A. et al. (2011). Computational Color Constancy: Survey and Experiments. IEEE TIP."
                        },
                        {
                                "url": "https://doi.org/10.1007/978-3-642-16435-4_5",
                                "title": "Riess, C. & Angelopoulou, E. (2010). Scene Illumination as an Indicator of Image Manipulation. Information Hiding."
                        }
                ],
                "strengths": "• Nhanh và nhẹ tài nguyên tính toán\n• Nắm bắt thuộc tính chiếu sáng tự nhiên\n• Hoạt động trên nhiều định dạng ảnh\n• Tín hiệu bổ sung tốt với các phương pháp khác",
                "limitations": "• Độ chính xác đơn lẻ thấp hơn (60-70%)\n• Ảnh đã chỉnh màu có thể tạo kết quả sai\n• Ảnh đơn sắc hoặc bảng màu hạn chế khó phân tích\n• Mô hình AI đang cải thiện tái tạo tương quan màu tự nhiên"
        },
        "zh": {
                "name": "Color Channel Correlation",
                "description": "Examines how RGB color channels correlate with each other. Natural light produces predictable inter-channel correlations that AI generators fail to reproduce accurately.",
                "algorithm": "Inter-Channel Color Correlation Analysis",
                "mechanism": "Analyzes statistical correlations between R, G, B channels. Real photographs exhibit natural inter-channel correlations from scene illumination. AI images produce subtly different patterns.",
                "parameters": "Block size: 32x32, Metrics: Pearson correlation R-G/R-B/G-B, global histogram correlation",
                "accuracy": "Low-Moderate - 60-70%, best as complementary signal",
                "source": "Adapted from Gijsenij et al. (2011), color constancy forensics",
                "useCase": "Supplementary detection of AI-generated color distribution anomalies"
        },
        "ja": {
                "name": "Color Channel Correlation",
                "description": "Examines how RGB color channels correlate with each other. Natural light produces predictable inter-channel correlations that AI generators fail to reproduce accurately.",
                "algorithm": "Inter-Channel Color Correlation Analysis",
                "mechanism": "Analyzes statistical correlations between R, G, B channels. Real photographs exhibit natural inter-channel correlations from scene illumination. AI images produce subtly different patterns.",
                "parameters": "Block size: 32x32, Metrics: Pearson correlation R-G/R-B/G-B, global histogram correlation",
                "accuracy": "Low-Moderate - 60-70%, best as complementary signal",
                "source": "Adapted from Gijsenij et al. (2011), color constancy forensics",
                "useCase": "Supplementary detection of AI-generated color distribution anomalies"
        },
        "ko": {
                "name": "Color Channel Correlation",
                "description": "Examines how RGB color channels correlate with each other. Natural light produces predictable inter-channel correlations that AI generators fail to reproduce accurately.",
                "algorithm": "Inter-Channel Color Correlation Analysis",
                "mechanism": "Analyzes statistical correlations between R, G, B channels. Real photographs exhibit natural inter-channel correlations from scene illumination. AI images produce subtly different patterns.",
                "parameters": "Block size: 32x32, Metrics: Pearson correlation R-G/R-B/G-B, global histogram correlation",
                "accuracy": "Low-Moderate - 60-70%, best as complementary signal",
                "source": "Adapted from Gijsenij et al. (2011), color constancy forensics",
                "useCase": "Supplementary detection of AI-generated color distribution anomalies"
        },
        "es": {
                "name": "Correlacion de canales de color",
                "description": "Examina como los canales de color RGB se correlacionan entre si.",
                "algorithm": "Inter-Channel Color Correlation Analysis",
                "mechanism": "Analyzes statistical correlations between R, G, B channels. Real photographs exhibit natural inter-channel correlations from scene illumination. AI images produce subtly different patterns.",
                "parameters": "Block size: 32x32, Metrics: Pearson correlation R-G/R-B/G-B, global histogram correlation",
                "accuracy": "Low-Moderate - 60-70%, best as complementary signal",
                "source": "Adapted from Gijsenij et al. (2011), color constancy forensics",
                "useCase": "Supplementary detection of AI-generated color distribution anomalies"
        },
    },
    "copymove": {
        "en": {
                "useCase": "Identifying cloned regions, texture duplication, and object removal cover-ups",
                "mechanism": "Extracts local feature descriptors using SIFT or SURF algorithms, then performs nearest-neighbor matching to identify duplicate regions. RANSAC filters geometric inconsistencies to confirm true copy-move forgeries.",
                "accuracy": "Medium-High - 80-90% for copy-move forgeries with minimal post-processing",
                "name": "Copy-Move Detection",
                "source": "Amerini et al. (2011) - A SIFT-Based Forensic Method for Copy-Move Attack Detection",
                "algorithm": "SIFT/SURF Keypoint Matching + RANSAC",
                "parameters": "Feature detector: SIFT, Match threshold: 0.75 (Lowe's ratio), Min matches: 10, RANSAC reproj threshold: 5.0",
                "description": "Detects duplicated regions within an image using keypoint matching. AI tools sometimes replicate texture patches, creating detectable copy-move patterns.",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TIFS.2011.2114532",
                                "title": "Amerini, I. et al. (2011). A SIFT-Based Forensic Method for Copy-Move Attack Detection. IEEE TIFS."
                        },
                        {
                                "url": "https://doi.org/10.1109/TIFS.2012.2218597",
                                "title": "Christlein, V. et al. (2012). An Evaluation of Popular Copy-Move Forgery Detection Approaches. IEEE TIFS."
                        }
                ],
                "strengths": "• Excellent for detecting cloned regions\n• RANSAC filtering reduces false positives\n• Can detect scaled/rotated copies\n• Well-proven forensic technique",
                "limitations": "• Only detects duplication within single image\n• Heavy post-processing can mask copied regions\n• Computationally expensive for large images\n• May miss very small duplicated areas"
        },
        "vi": {
                "useCase": "Xác định vùng nhân bản, sao chép kết cấu",
                "mechanism": "Trích xuất mô tả đặc trưng cục bộ, rồi khớp hàng xóm gần nhất để xác định vùng trùng lặp.",
                "accuracy": "Trung bình-Cao - 80-90%",
                "name": "Phát hiện Copy-Move",
                "source": "Amerini et al. (2011) - A SIFT-Based Forensic Method",
                "algorithm": "SIFT/SURF + RANSAC",
                "parameters": "Bộ phát hiện: SIFT, Ngưỡng khớp: 0.75, Số khớp tối thiểu: 10",
                "description": "Phát hiện vùng trùng lặp trong ảnh bằng khớp điểm đặc trưng. AI đôi khi sao chép vùng kết cấu tạo ra mẫu copy-move.",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TIFS.2011.2114532",
                                "title": "Amerini, I. et al. (2011). A SIFT-Based Forensic Method for Copy-Move Attack Detection. IEEE TIFS."
                        },
                        {
                                "url": "https://doi.org/10.1109/TIFS.2012.2218597",
                                "title": "Christlein, V. et al. (2012). An Evaluation of Popular Copy-Move Forgery Detection Approaches. IEEE TIFS."
                        }
                ],
                "strengths": "• Xuất sắc cho phát hiện vùng nhân bản\n• Lọc RANSAC giảm dương tính giả\n• Phát hiện bản sao có co giãn/xoay\n• Kỹ thuật pháp y đã được chứng minh",
                "limitations": "• Chỉ phát hiện nhân bản trong cùng một ảnh\n• Hậu xử lý nặng có thể che vùng sao chép\n• Tốn tài nguyên tính toán cho ảnh lớn\n• Có thể bỏ sót vùng nhân bản rất nhỏ"
        },
        "zh": {
                "useCase": "识别克隆区域",
                "mechanism": "提取局部特征描述符进行匹配。",
                "accuracy": "中高 - 80-90%",
                "name": "复制-移动检测",
                "source": "Amerini et al. (2011)",
                "algorithm": "SIFT/SURF + RANSAC",
                "parameters": "检测器: SIFT, 阈值: 0.75",
                "description": "使用关键点匹配检测图像内重复区域。"
        },
        "ja": {
                "useCase": "クローン領域の特定",
                "mechanism": "局所特徴記述子を抽出しマッチング。",
                "accuracy": "中-高 - 80-90%",
                "name": "コピー・ムーブ検出",
                "source": "Amerini et al. (2011)",
                "algorithm": "SIFT/SURF + RANSAC",
                "parameters": "検出器: SIFT, 閾値: 0.75",
                "description": "特徴点マッチングで画像内の重複領域を検出。"
        },
        "ko": {
                "useCase": "복제 영역 식별",
                "mechanism": "로컬 특징 기술자를 추출하여 매칭합니다.",
                "accuracy": "중-높음 - 80-90%",
                "name": "복사-이동 감지",
                "source": "Amerini et al. (2011)",
                "algorithm": "SIFT/SURF + RANSAC",
                "parameters": "검출기: SIFT, 임계값: 0.75",
                "description": "키포인트 매칭으로 이미지 내 복제 영역을 감지합니다."
        },
        "es": {
                "useCase": "Identificar regiones clonadas",
                "mechanism": "Extrae descriptores locales para coincidencia.",
                "accuracy": "Medio-Alto - 80-90%",
                "name": "Deteccion de copia-movimiento",
                "source": "Amerini et al. (2011)",
                "algorithm": "SIFT/SURF + RANSAC",
                "parameters": "Detector: SIFT, Umbral: 0.75",
                "description": "Detecta regiones duplicadas usando coincidencia de puntos clave."
        },
    },
    "dct": {
        "en": {
                "name": "DCT Block Artifacts",
                "description": "Analyzes Discrete Cosine Transform block boundaries from JPEG compression. Real camera JPEGs have natural block artifacts, while AI images lack or have uniform compression fingerprints.",
                "algorithm": "DCT Block Artifact Analysis",
                "mechanism": "Analyzes 8x8 DCT block boundary artifacts and quantization patterns from JPEG compression. AI images may lack or show inconsistent JPEG artifacts.",
                "parameters": "Block size: 8x8, Analysis: block boundary discontinuity, quantization table estimation",
                "accuracy": "Moderate - 65-80%, dependent on image format history",
                "source": "Fan and de Queiroz (2003), IEEE ICIP; Bianchi et al. (2012)",
                "useCase": "Detecting JPEG compression history inconsistencies in AI-generated images",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/ICIP.2003.1247434",
                                "title": "Fan, Z. & de Queiroz, R.L. (2003). Identification of Bitmap Compression History. IEEE ICIP."
                        },
                        {
                                "url": "https://doi.org/10.1109/TIFS.2012.2187516",
                                "title": "Bianchi, T. & Piva, A. (2012). Image Forgery Localization via Block-Grained Analysis. IEEE TIFS."
                        }
                ],
                "strengths": "• Direct analysis of JPEG compression artifacts\n• Can reveal compression history\n• Well-understood mathematical basis\n• Effective for detecting re-compression",
                "limitations": "• Only applicable to JPEG format\n• Non-JPEG AI images won't show DCT artifacts\n• Multiple re-compressions complicate analysis\n• Low quality images have less reliable patterns"
        },
        "vi": {
                "name": "Dấu vân DCT",
                "description": "Phân tích biên khối DCT từ nén JPEG. Ảnh JPEG từ máy ảnh có dấu vân khối tự nhiên, trong khi ảnh AI thiếu hoặc có dấu vân nén đồng nhất.",
                "algorithm": "Phân tích hiện vật khối DCT",
                "mechanism": "Phân tích hiện vật biên khối DCT 8x8 và mẫu lượng tử từ nén JPEG. Ảnh AI có thể thiếu hoặc có hiện vật JPEG không nhất quán.",
                "parameters": "Kích thước khối: 8x8, Phân tích: gián đoạn biên khối, ước lượng bảng lượng tử",
                "accuracy": "Trung bình - 65-80%, phụ thuộc lịch sử định dạng ảnh",
                "source": "Fan & de Queiroz (2003), IEEE ICIP; Bianchi et al. (2012)",
                "useCase": "Phát hiện lịch sử nén JPEG không nhất quán trong ảnh AI",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/ICIP.2003.1247434",
                                "title": "Fan, Z. & de Queiroz, R.L. (2003). Identification of Bitmap Compression History. IEEE ICIP."
                        },
                        {
                                "url": "https://doi.org/10.1109/TIFS.2012.2187516",
                                "title": "Bianchi, T. & Piva, A. (2012). Image Forgery Localization via Block-Grained Analysis. IEEE TIFS."
                        }
                ],
                "strengths": "• Phân tích trực tiếp hiện vật nén JPEG\n• Có thể tiết lộ lịch sử nén\n• Nền tảng toán học được hiểu rõ\n• Hiệu quả phát hiện nén lại",
                "limitations": "• Chỉ áp dụng cho định dạng JPEG\n• Ảnh AI không phải JPEG sẽ không có hiện vật DCT\n• Nén lại nhiều lần làm phức tạp phân tích\n• Ảnh chất lượng thấp có mẫu kém tin cậy"
        },
        "zh": {
                "name": "DCT Block Artifacts",
                "description": "Analyzes Discrete Cosine Transform block boundaries from JPEG compression. Real camera JPEGs have natural block artifacts, while AI images lack or have uniform compression fingerprints.",
                "algorithm": "DCT Block Artifact Analysis",
                "mechanism": "Analyzes 8x8 DCT block boundary artifacts and quantization patterns from JPEG compression. AI images may lack or show inconsistent JPEG artifacts.",
                "parameters": "Block size: 8x8, Analysis: block boundary discontinuity, quantization table estimation",
                "accuracy": "Moderate - 65-80%, dependent on image format history",
                "source": "Fan and de Queiroz (2003), IEEE ICIP; Bianchi et al. (2012)",
                "useCase": "Detecting JPEG compression history inconsistencies in AI-generated images"
        },
        "ja": {
                "name": "DCT Block Artifacts",
                "description": "Analyzes Discrete Cosine Transform block boundaries from JPEG compression. Real camera JPEGs have natural block artifacts, while AI images lack or have uniform compression fingerprints.",
                "algorithm": "DCT Block Artifact Analysis",
                "mechanism": "Analyzes 8x8 DCT block boundary artifacts and quantization patterns from JPEG compression. AI images may lack or show inconsistent JPEG artifacts.",
                "parameters": "Block size: 8x8, Analysis: block boundary discontinuity, quantization table estimation",
                "accuracy": "Moderate - 65-80%, dependent on image format history",
                "source": "Fan and de Queiroz (2003), IEEE ICIP; Bianchi et al. (2012)",
                "useCase": "Detecting JPEG compression history inconsistencies in AI-generated images"
        },
        "ko": {
                "name": "DCT Block Artifacts",
                "description": "Analyzes Discrete Cosine Transform block boundaries from JPEG compression. Real camera JPEGs have natural block artifacts, while AI images lack or have uniform compression fingerprints.",
                "algorithm": "DCT Block Artifact Analysis",
                "mechanism": "Analyzes 8x8 DCT block boundary artifacts and quantization patterns from JPEG compression. AI images may lack or show inconsistent JPEG artifacts.",
                "parameters": "Block size: 8x8, Analysis: block boundary discontinuity, quantization table estimation",
                "accuracy": "Moderate - 65-80%, dependent on image format history",
                "source": "Fan and de Queiroz (2003), IEEE ICIP; Bianchi et al. (2012)",
                "useCase": "Detecting JPEG compression history inconsistencies in AI-generated images"
        },
        "es": {
                "name": "Artefactos de bloques DCT",
                "description": "Analiza limites de bloques de Transformada Discreta del Coseno de compresion JPEG.",
                "algorithm": "DCT Block Artifact Analysis",
                "mechanism": "Analyzes 8x8 DCT block boundary artifacts and quantization patterns from JPEG compression. AI images may lack or show inconsistent JPEG artifacts.",
                "parameters": "Block size: 8x8, Analysis: block boundary discontinuity, quantization table estimation",
                "accuracy": "Moderate - 65-80%, dependent on image format history",
                "source": "Fan and de Queiroz (2003), IEEE ICIP; Bianchi et al. (2012)",
                "useCase": "Detecting JPEG compression history inconsistencies in AI-generated images"
        },
    },
    "diffusion": {
        "en": {
                "name": "Diffusion Model Detection",
                "description": "Detects artifacts specific to diffusion-based AI models (Stable Diffusion, DALL-E, Midjourney) by analyzing denoising step residuals and latent space patterns unique to the iterative denoising generation process.",
                "algorithm": "Diffusion Step Residual Analysis + Latent Space Pattern Detection",
                "mechanism": "The detection methodology:\n\n1. **High-frequency residual extraction**: Extracts high-frequency residuals correlating with the iterative denoising process.\n\n2. **Spatial autocorrelation**: Diffusion models operate in compressed latent space, creating characteristic spatial correlation patterns when decoded to pixel space.\n\n3. **Denoising artifact detection**: Step-by-step denoising leaves subtle but detectable traces, particularly in smooth gradient regions.\n\n4. **Cross-attention patterns**: Text-to-image diffusion models use cross-attention mechanisms creating detectable spatial coherence patterns.",
                "parameters": "Analysis window: 64x64, Noise extraction: Wiener filter\nSpatial correlation: autocorrelation maps\nTarget models: Stable Diffusion 1.5/2.1/XL, DALL-E 2/3, Midjourney v4/v5/v6",
                "accuracy": "High - 86-94%. Effectiveness varies by model version and generation parameters.",
                "source": "Corvi et al. (2023) - On the Detection of Synthetic Images Generated by Diffusion Models",
                "useCase": "Detecting content from modern diffusion AI models including Stable Diffusion, DALL-E, and Midjourney.",
                "strengths": "• Specifically designed for modern diffusion models\n• Detects even high-quality diffusion outputs\n• Works across different diffusion architectures\n• Effective with both text-to-image and image-to-image",
                "limitations": "• Rapid model evolution requires frequent updates\n• Img2img with high denoising strength is harder to detect\n• Very small generated regions may evade detection\n• Model fine-tuning can alter detectable patterns",
                "references": [
                        {
                                "title": "Corvi, R. et al. (2023). On the Detection of Synthetic Images Generated by Diffusion Models. ICASSP.",
                                "url": "https://arxiv.org/abs/2211.00680"
                        },
                        {
                                "title": "Ricker, J. et al. (2022). Towards the Detection of Diffusion Model Deepfakes.",
                                "url": "https://arxiv.org/abs/2210.14571"
                        },
                        {
                                "title": "Sha, Z. et al. (2023). DE-FAKE: Detection and Attribution. ACM CCS.",
                                "url": "https://arxiv.org/abs/2210.06998"
                        },
                        {
                                "title": "Wang, Z. et al. (2023). DIRE for Diffusion-Generated Image Detection. ICCV.",
                                "url": "https://arxiv.org/abs/2303.09295"
                        }
                ]
        },
        "vi": {
                "name": "Phát hiện mô hình Diffusion",
                "description": "Phát hiện hiện vật đặc trưng của mô hình AI dựa trên khuếch tán (Stable Diffusion, DALL-E, Midjourney) bằng cách phân tích dư từ bước khử nhiễu và mẫu không gian ẩn đặc trưng cho quá trình sinh ảnh khử nhiễu lặp.",
                "algorithm": "Phân tích dư bước Diffusion + Phát hiện mẫu không gian ẩn",
                "mechanism": "Phương pháp phát hiện:\n\n1. **Trích xuất dư tần cao**: Trích xuất dư tần số cao tương quan với quá trình khử nhiễu lặp.\n\n2. **Tự tương quan không gian**: Mô hình diffusion hoạt động trong không gian ẩn nén, tạo mẫu tương quan đặc trưng khi giải mã về pixel.\n\n3. **Phát hiện hiện vật khử nhiễu**: Quá trình khử nhiễu từng bước để lại dấu vết tinh tế, đặc biệt trong vùng gradient mượt.\n\n4. **Mẫu cross-attention**: Mô hình chuyển văn bản thành ảnh sử dụng cross-attention tạo mẫu nhất quán không gian.",
                "parameters": "Cửa sổ phân tích: 64x64, Trích nhiễu: bộ lọc Wiener\nTương quan không gian: bản đồ tự tương quan\nMô hình mục tiêu: Stable Diffusion 1.5/2.1/XL, DALL-E 2/3, Midjourney v4/v5/v6",
                "accuracy": "Cao - 86-94%. Hiệu quả thay đổi theo phiên bản mô hình.",
                "source": "Corvi et al. (2023) - On the Detection of Synthetic Images Generated by Diffusion Models",
                "useCase": "Phát hiện nội dung sinh bởi mô hình AI diffusion hiện đại.",
                "strengths": "• Thiết kế chuyên biệt cho mô hình diffusion hiện đại\n• Phát hiện cả đầu ra diffusion chất lượng cao\n• Hoạt động trên nhiều kiến trúc diffusion\n• Hiệu quả với cả text-to-image và image-to-image",
                "limitations": "• Mô hình phát triển nhanh đòi hỏi cập nhật thường xuyên\n• Img2img với denoising strength cao khó phát hiện\n• Vùng sinh rất nhỏ có thể tránh phát hiện\n• Tinh chỉnh mô hình có thể thay đổi mẫu",
                "references": [
                        {
                                "title": "Corvi, R. et al. (2023). On the Detection of Synthetic Images Generated by Diffusion Models. ICASSP.",
                                "url": "https://arxiv.org/abs/2211.00680"
                        },
                        {
                                "title": "Ricker, J. et al. (2022). Towards the Detection of Diffusion Model Deepfakes.",
                                "url": "https://arxiv.org/abs/2210.14571"
                        },
                        {
                                "title": "Sha, Z. et al. (2023). DE-FAKE: Detection and Attribution. ACM CCS.",
                                "url": "https://arxiv.org/abs/2210.06998"
                        },
                        {
                                "title": "Wang, Z. et al. (2023). DIRE for Diffusion-Generated Image Detection. ICCV.",
                                "url": "https://arxiv.org/abs/2303.09295"
                        }
                ]
        },
        "zh": {
                "useCase": "检测Stable Diffusion、DALL-E内容",
                "mechanism": "分析与去噪过程相关的高频残差。",
                "accuracy": "高 - 86-94%",
                "name": "扩散模型检测",
                "source": "Corvi et al. (2023)",
                "algorithm": "扩散步残差分析",
                "parameters": "窗口: 64x64, 噪声提取: Wiener滤波器",
                "description": "检测扩散模型特有的伪影。"
        },
        "ja": {
                "useCase": "Stable Diffusion、DALL-Eの検出",
                "mechanism": "ノイズ除去プロセスに関連する高周波残差を分析。",
                "accuracy": "高 - 86-94%",
                "name": "拡散モデル検出",
                "source": "Corvi et al. (2023)",
                "algorithm": "拡散ステップ残差分析",
                "parameters": "ウィンドウ: 64x64, ノイズ抽出: Wienerフィルタ",
                "description": "拡散モデル固有のアーティファクトを検出。"
        },
        "ko": {
                "useCase": "Stable Diffusion, DALL-E 감지",
                "mechanism": "노이즈 제거 과정 관련 고주파 잔차를 분석합니다.",
                "accuracy": "높음 - 86-94%",
                "name": "확산 모델 감지",
                "source": "Corvi et al. (2023)",
                "algorithm": "확산 단계 잔차 분석",
                "parameters": "윈도우: 64x64, 노이즈 추출: Wiener 필터",
                "description": "확산 모델 고유의 아티팩트를 감지합니다."
        },
        "es": {
                "useCase": "Detectar conttenido de Stable Diffusion, DALL-E",
                "mechanism": "Analiza residuos de alta frecuencia del proceso de eliminacion de ruido.",
                "accuracy": "Alto - 86-94%",
                "name": "Deteccion de modelo de difusion",
                "source": "Corvi et al. (2023)",
                "algorithm": "Analisis de residuos de difusion",
                "parameters": "Ventana: 64x64, Extraccion: filtro Wiener",
                "description": "Detecta artefactos de modelos de difusion."
        },
    },
    "double_jpeg": {
        "en": {
                "useCase": "Detecting image tampering through re-saving, quality manipulation, and spliced regions with different compression histories",
                "mechanism": "Analyzes DCT coefficient histograms for periodic patterns caused by double quantization. When a JPEG image is decompressed and re-compressed at a different quality, the DCT coefficients exhibit characteristic periodic artifacts (combing effect) in their histograms that are detectable through frequency analysis.",
                "accuracy": "High - 82-92% for images with detectable double compression",
                "name": "Double JPEG Compression Detection",
                "source": "Lukáš & Fridrich (2003) - Estimation of Primary Quantization Matrix in Double-Compressed JPEG Images, DFRWS",
                "algorithm": "DCT Coefficient Histogram Periodicity Analysis",
                "parameters": "Block size: 8x8 DCT, Quality range: 50-99, Analysis: histogram periodicity via DFT, Detection threshold: adaptive",
                "description": "Detects traces of double JPEG compression by analyzing DCT coefficient histograms. Tampering often involves re-saving, creating detectable periodic patterns in DCT domain.",
                "strengths": "• Very reliable for detecting re-saved JPEGs\n• Can estimate original compression quality\n• Localizes tampered regions\n• Mathematical foundation is well-established",
                "limitations": "• Only works on JPEG format images\n• Ineffective when both compressions use same quality\n• Cannot detect single-compressed AI images\n• Requires sufficient image size for statistical reliability",
                "references": [
                        {
                                "title": "Lukáš, J. & Fridrich, J. (2003). Estimation of Primary Quantization Matrix in Double-Compressed JPEG Images. DFRWS.",
                                "url": "https://doi.org/10.1016/S1742-2876(03)00007-4"
                        },
                        {
                                "title": "Bianchi, T. & Piva, A. (2012). Image Forgery Localization via Block-Grained Analysis of JPEG Artifacts. IEEE TIFS.",
                                "url": "https://doi.org/10.1109/TIFS.2012.2187516"
                        }
                ]
        },
        "vi": {
                "useCase": "Phát hiện chỉnh sửa ảnh qua việc lưu lại, thao túng chất lượng và vùng ghép có lịch sử nén khác nhau",
                "mechanism": "Phân tích biểu đồ hệ số DCT tìm mẫu tuần hoàn do lượng tử kép gây ra. Khi ảnh JPEG được giải nén rồi nén lại ở chất lượng khác, hệ số DCT thể hiện hiện vật tuần hoàn đặc trưng (hiệu ứng lược) trong biểu đồ có thể phát hiện qua phân tích tần số.",
                "accuracy": "Cao - 82-92% cho ảnh có nén kép phát hiện được",
                "name": "Phát hiện nén JPEG kép",
                "source": "Lukáš & Fridrich (2003) - Ước lượng ma trận lượng tử gốc trong ảnh JPEG nén kép, DFRWS",
                "algorithm": "Phân tích tuần hoàn biểu đồ hệ số DCT",
                "parameters": "Kích thước khối: 8x8 DCT, Dải chất lượng: 50-99, Phân tích: tính tuần hoàn biểu đồ qua DFT, Ngưỡng: thích ứng",
                "description": "Phát hiện dấu vết nén JPEG kép bằng phân tích biểu đồ hệ số DCT. Giả mạo thường lưu lại ảnh, tạo mẫu tuần hoàn phát hiện được trong miền DCT.",
                "strengths": "• Rất đáng tin cậy cho phát hiện JPEG lưu lại\n• Có thể ước lượng chất lượng nén gốc\n• Định vị vùng bị chỉnh sửa\n• Nền tảng toán học vững chắc",
                "limitations": "• Chỉ hoạt động trên ảnh định dạng JPEG\n• Không hiệu quả khi cả hai lần nén cùng chất lượng\n• Không phát hiện ảnh AI nén đơn\n• Cần kích thước ảnh đủ lớn cho độ tin cậy thống kê",
                "references": [
                        {
                                "title": "Lukáš, J. & Fridrich, J. (2003). Estimation of Primary Quantization Matrix in Double-Compressed JPEG Images. DFRWS.",
                                "url": "https://doi.org/10.1016/S1742-2876(03)00007-4"
                        },
                        {
                                "title": "Bianchi, T. & Piva, A. (2012). Image Forgery Localization via Block-Grained Analysis of JPEG Artifacts. IEEE TIFS.",
                                "url": "https://doi.org/10.1109/TIFS.2012.2187516"
                        }
                ]
        },
        "zh": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Double JPEG Compression Detection",
                "source": "",
                "algorithm": "DCT Coefficient Histogram Periodicity Analysis",
                "parameters": "",
                "description": "Detects traces of double JPEG compression by analyzing DCT coefficient histograms. Tampering often involves re-saving, creating detectable periodic patterns in DCT domain.",
                "references": [
                        {
                                "title": "Lukáš, J. & Fridrich, J. (2003). Estimation of Primary Quantization Matrix in Double-Compressed JPEG Images. DFRWS.",
                                "url": "https://doi.org/10.1016/S1742-2876(03)00007-4"
                        },
                        {
                                "title": "Bianchi, T. & Piva, A. (2012). Image Forgery Localization via Block-Grained Analysis of JPEG Artifacts. IEEE TIFS.",
                                "url": "https://doi.org/10.1109/TIFS.2012.2187516"
                        }
                ]
        },
        "ja": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Double JPEG Compression Detection",
                "source": "",
                "algorithm": "DCT Coefficient Histogram Periodicity Analysis",
                "parameters": "",
                "description": "Detects traces of double JPEG compression by analyzing DCT coefficient histograms. Tampering often involves re-saving, creating detectable periodic patterns in DCT domain.",
                "references": [
                        {
                                "title": "Lukáš, J. & Fridrich, J. (2003). Estimation of Primary Quantization Matrix in Double-Compressed JPEG Images. DFRWS.",
                                "url": "https://doi.org/10.1016/S1742-2876(03)00007-4"
                        },
                        {
                                "title": "Bianchi, T. & Piva, A. (2012). Image Forgery Localization via Block-Grained Analysis of JPEG Artifacts. IEEE TIFS.",
                                "url": "https://doi.org/10.1109/TIFS.2012.2187516"
                        }
                ]
        },
        "ko": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Double JPEG Compression Detection",
                "source": "",
                "algorithm": "DCT Coefficient Histogram Periodicity Analysis",
                "parameters": "",
                "description": "Detects traces of double JPEG compression by analyzing DCT coefficient histograms. Tampering often involves re-saving, creating detectable periodic patterns in DCT domain.",
                "references": [
                        {
                                "title": "Lukáš, J. & Fridrich, J. (2003). Estimation of Primary Quantization Matrix in Double-Compressed JPEG Images. DFRWS.",
                                "url": "https://doi.org/10.1016/S1742-2876(03)00007-4"
                        },
                        {
                                "title": "Bianchi, T. & Piva, A. (2012). Image Forgery Localization via Block-Grained Analysis of JPEG Artifacts. IEEE TIFS.",
                                "url": "https://doi.org/10.1109/TIFS.2012.2187516"
                        }
                ]
        },
        "es": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Double JPEG Compression Detection",
                "source": "",
                "algorithm": "DCT Coefficient Histogram Periodicity Analysis",
                "parameters": "",
                "description": "Detects traces of double JPEG compression by analyzing DCT coefficient histograms. Tampering often involves re-saving, creating detectable periodic patterns in DCT domain.",
                "references": [
                        {
                                "title": "Lukáš, J. & Fridrich, J. (2003). Estimation of Primary Quantization Matrix in Double-Compressed JPEG Images. DFRWS.",
                                "url": "https://doi.org/10.1016/S1742-2876(03)00007-4"
                        },
                        {
                                "title": "Bianchi, T. & Piva, A. (2012). Image Forgery Localization via Block-Grained Analysis of JPEG Artifacts. IEEE TIFS.",
                                "url": "https://doi.org/10.1109/TIFS.2012.2187516"
                        }
                ]
        },
    },
    "edge": {
        "en": {
                "name": "Edge Coherence",
                "description": "Analyzes edge sharpness gradients using Sobel operators. AI-generated images often have abnormally smooth or uniform edge transitions compared to natural photos.",
                "algorithm": "Sobel Edge Coherence Analysis",
                "mechanism": "Computes Sobel edge magnitude and direction maps, analyzing transition sharpness. AI images produce unnaturally smooth or uniform edge transitions, while real photos show natural variation.",
                "parameters": "Sobel kernel: 3x3, Edge threshold: adaptive Otsu, Metrics: edge density, coherence ratio",
                "accuracy": "Moderate - 70-80% as a supporting signal",
                "source": "Cozzolino et al. (2015), IEEE TIFS",
                "useCase": "Supplementary detection of AI-typical edge uniformity patterns",
                "strengths": "• Analysis nhanh và hiệu quả\n• Detection tốt sự đồng nhất cạnh bất thường\n• Bổ sung tốt cho các phương pháp tần số\n• Hoạt động tốt trên nhiều loại nội dung",
                "limitations": "• Images chụp macro hoặc có DOF nông có thể tạo dương tính giả\n• Hiệu quả giảm với Images đã qua sharpen/blur\n• Không phân biệt được giữa AI và CGI",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TPAMI.1986.4767851",
                                "title": "Canny, J. (1986). A Computational Approach to Edge Detection. IEEE TPAMI."
                        },
                        {
                                "url": "https://arxiv.org/abs/2008.10588",
                                "title": "Chai, L. et al. (2020). What Makes Fake Images Detectable? ECCV."
                        }
                ]
        },
        "vi": {
                "name": "Tính nhất quán cạnh",
                "description": "Phân tích gradient độ sắc nét cạnh bằng toán tử Sobel. Ảnh AI thường có chuyển tiếp cạnh mượt hoặc đồng nhất bất thường so với ảnh tự nhiên.",
                "algorithm": "Phân tích cạnh bằng toán tử Sobel",
                "mechanism": "Tính gradient cạnh bằng toán tử Sobel theo cả hai hướng ngang và dọc, sau đó phân tích phân bố độ lớn gradient. Ảnh thật có phân bố cạnh tự nhiên, trong khi ảnh AI thường có cạnh quá mượt hoặc quá sắc đồng nhất.",
                "parameters": "Toán tử: Sobel 3x3, Hướng: ngang + dọc, Chỉ số: phân bố gradient, kurtosis, skewness",
                "accuracy": "Trung bình - 72-82%",
                "source": "Canny (1986) - A Computational Approach to Edge Detection; ứng dụng pháp y",
                "useCase": "Phát hiện sự đồng nhất bất thường trong chuyển tiếp cạnh của ảnh AI",
                "strengths": "• Phân tích nhanh và hiệu quả\n• Phát hiện tốt sự đồng nhất cạnh bất thường\n• Bổ sung tốt cho các phương pháp tần số\n• Hoạt động tốt trên nhiều loại nội dung",
                "limitations": "• Ảnh chụp macro hoặc có DOF nông có thể tạo dương tính giả\n• Hiệu quả giảm với ảnh đã qua sharpen/blur\n• Không phân biệt được giữa AI và CGI",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TPAMI.1986.4767851",
                                "title": "Canny, J. (1986). A Computational Approach to Edge Detection. IEEE TPAMI."
                        },
                        {
                                "url": "https://arxiv.org/abs/2008.10588",
                                "title": "Chai, L. et al. (2020). What Makes Fake Images Detectable? ECCV."
                        }
                ]
        },
        "zh": {
                "name": "Edge Coherence",
                "description": "Analyzes edge sharpness gradients using Sobel operators. AI-generated images often have abnormally smooth or uniform edge transitions compared to natural photos.",
                "algorithm": "Sobel Edge Coherence Analysis",
                "mechanism": "Computes Sobel edge magnitude and direction maps, analyzing transition sharpness. AI images produce unnaturally smooth or uniform edge transitions, while real photos show natural variation.",
                "parameters": "Sobel kernel: 3x3, Edge threshold: adaptive Otsu, Metrics: edge density, coherence ratio",
                "accuracy": "Moderate - 70-80% as a supporting signal",
                "source": "Cozzolino et al. (2015), IEEE TIFS",
                "useCase": "Supplementary detection of AI-typical edge uniformity patterns"
        },
        "ja": {
                "name": "Edge Coherence",
                "description": "Analyzes edge sharpness gradients using Sobel operators. AI-generated images often have abnormally smooth or uniform edge transitions compared to natural photos.",
                "algorithm": "Sobel Edge Coherence Analysis",
                "mechanism": "Computes Sobel edge magnitude and direction maps, analyzing transition sharpness. AI images produce unnaturally smooth or uniform edge transitions, while real photos show natural variation.",
                "parameters": "Sobel kernel: 3x3, Edge threshold: adaptive Otsu, Metrics: edge density, coherence ratio",
                "accuracy": "Moderate - 70-80% as a supporting signal",
                "source": "Cozzolino et al. (2015), IEEE TIFS",
                "useCase": "Supplementary detection of AI-typical edge uniformity patterns"
        },
        "ko": {
                "name": "Edge Coherence",
                "description": "Analyzes edge sharpness gradients using Sobel operators. AI-generated images often have abnormally smooth or uniform edge transitions compared to natural photos.",
                "algorithm": "Sobel Edge Coherence Analysis",
                "mechanism": "Computes Sobel edge magnitude and direction maps, analyzing transition sharpness. AI images produce unnaturally smooth or uniform edge transitions, while real photos show natural variation.",
                "parameters": "Sobel kernel: 3x3, Edge threshold: adaptive Otsu, Metrics: edge density, coherence ratio",
                "accuracy": "Moderate - 70-80% as a supporting signal",
                "source": "Cozzolino et al. (2015), IEEE TIFS",
                "useCase": "Supplementary detection of AI-typical edge uniformity patterns"
        },
        "es": {
                "name": "Coherencia de bordes",
                "description": "Analiza gradientes de nitidez de bordes usando operadores Sobel.",
                "algorithm": "Sobel Edge Coherence Analysis",
                "mechanism": "Computes Sobel edge magnitude and direction maps, analyzing transition sharpness. AI images produce unnaturally smooth or uniform edge transitions, while real photos show natural variation.",
                "parameters": "Sobel kernel: 3x3, Edge threshold: adaptive Otsu, Metrics: edge density, coherence ratio",
                "accuracy": "Moderate - 70-80% as a supporting signal",
                "source": "Cozzolino et al. (2015), IEEE TIFS",
                "useCase": "Supplementary detection of AI-typical edge uniformity patterns"
        },
    },
    "ela": {
        "en": {
                "name": "Error Level Analysis (ELA)",
                "description": "Error Level Analysis resaves an image at a known JPEG quality and compares the error levels between the original and re-compressed version. AI-generated images show abnormally uniform error patterns, while authentic photos exhibit varying compression artifacts across different regions.",
                "algorithm": "JPEG Re-compression Differential Analysis",
                "mechanism": "The ELA analysis process:\n\n1. **Re-compression**: The image is re-saved at a fixed JPEG quality level (typically 95%).\n\n2. **Difference calculation**: Pixel-by-pixel comparison between the original and re-compressed image, creating an absolute difference map.\n\n3. **Error pattern analysis**: In an unmodified JPEG, the entire image has undergone the same compression, so error levels are relatively uniform. Manipulated or AI-generated regions show different error levels because they've undergone different compression histories.\n\n4. **Uniformity assessment**: AI images typically show abnormally uniform error levels across the entire image because all pixels were generated, not captured.",
                "parameters": "Re-compression quality: 95%, Color space: YCbCr, DCT block size: 8x8\nAnalysis: absolute pixel difference, regional error level variance\nThreshold: adaptive based on global error distribution",
                "accuracy": "High - 88-94% for JPEG images. Effectiveness significantly decreases for PNG images or multiply-compressed JPEGs.",
                "source": "Krawetz, N. (2007) — A Picture's Worth: Digital Image Analysis and Forensics. Hacker Factor Solutions.",
                "useCase": "Detection of local manipulation (cut-paste, editing), AI inpainting, and regions with inconsistent compression history. Widely used in digital image forensics and content verification.",
                "strengths": "• Intuitive and easy to understand for non-experts\n• Good detection of local manipulation and splicing\n• Low computational cost, fast analysis\n• Particularly effective with single-compression JPEGs",
                "limitations": "• Only effective for JPEG images, not applicable to PNG/WebP\n• Multiple JPEG compressions introduce noise into results\n• Resized or cropped images may produce false positives\n• Cannot distinguish AI from heavily post-processed real images",
                "references": [
                        {
                                "title": "Krawetz, N. (2007). A Picture's Worth: Digital Image Analysis and Forensics. Hacker Factor.",
                                "url": "https://fotoforensics.com/tutorial-ela.php"
                        },
                        {
                                "title": "Krawetz, N. (2012). A Picture's Worth — More on ELA. Black Hat USA.",
                                "url": "https://www.hackerfactor.com/papers/bh-usa-07-krawetz-wp.pdf"
                        },
                        {
                                "title": "Farid, H. (2009). Image Forgery Detection. IEEE Signal Processing Magazine.",
                                "url": "https://doi.org/10.1109/MSP.2008.931079"
                        },
                        {
                                "title": "Popescu, A.C. & Farid, H. (2005). Exposing Digital Forgeries by Detecting Traces of Resampling. IEEE TSP.",
                                "url": "https://doi.org/10.1109/TSP.2004.839932"
                        }
                ]
        },
        "vi": {
                "name": "Phân tích mức lỗi (ELA)",
                "description": "Phương pháp phân tích mức lỗi (Error Level Analysis) lưu lại ảnh ở chất lượng JPEG đã biết và so sánh mức lỗi giữa ảnh gốc và ảnh tái nén. Ảnh AI tạo ra mẫu lỗi đồng nhất bất thường, trong khi ảnh thật có biến đổi nén khác nhau theo vùng.",
                "algorithm": "Phân tích sai biệt nén JPEG lại (JPEG Re-compression Differential)",
                "mechanism": "Quy trình phân tích ELA:\n\n1. **Tái nén ảnh**: Ảnh được lưu lại ở mức chất lượng JPEG cố định (thường 95%).\n\n2. **Tính sai biệt**: So sánh pixel-by-pixel giữa ảnh gốc và ảnh tái nén, tạo bản đồ sai biệt tuyệt đối.\n\n3. **Phân tích mẫu lỗi**: Trong ảnh JPEG chưa chỉnh sửa, toàn bộ ảnh đã trải qua cùng mức nén, nên mức lỗi tương đối đồng nhất. Vùng bị thao tác hoặc AI tạo có mức lỗi khác biệt vì đã trải qua quá trình nén khác.\n\n4. **Đánh giá tính đồng nhất**: Ảnh AI thường cho thấy mức lỗi đồng nhất bất thường trên toàn ảnh vì tất cả pixel đều được sinh ra, không phải chụp.",
                "parameters": "Mức chất lượng tái nén: 95%, Không gian màu: YCbCr, Kích thước khối DCT: 8x8\nPhân tích: sai biệt tuyệt đối pixel, phương sai mức lỗi theo vùng\nNgưỡng: adaptive dựa trên phân phối lỗi toàn cục",
                "accuracy": "Cao - 88-94% cho ảnh JPEG. Hiệu quả giảm đáng kể với ảnh PNG hoặc ảnh đã được nén nhiều lần.",
                "source": "Krawetz, N. (2007) — A Picture's Worth: Digital Image Analysis and Forensics. Hacker Factor Solutions.",
                "useCase": "Phát hiện thao tác cục bộ (vùng bị cắt dán, chỉnh sửa), AI inpainting, và vùng có lịch sử nén không nhất quán. Phổ biến trong phân tích pháp y ảnh số và kiểm chứng nội dung.",
                "strengths": "• Trực quan, dễ hiểu cho người dùng không chuyên\n• Phát hiện tốt thao tác cục bộ và ghép nối\n• Chi phí tính toán thấp, phân tích nhanh\n• Hiệu quả đặc biệt với ảnh JPEG một lần nén",
                "limitations": "• Chỉ hiệu quả với ảnh JPEG, không áp dụng được cho PNG/WebP\n• Ảnh JPEG bị nén nhiều lần làm nhiễu kết quả\n• Ảnh resize hoặc crop tạo ra dương tính giả\n• Không phân biệt được AI và ảnh thật đã qua xử lý hậu kỳ nặng",
                "references": [
                        {
                                "title": "Krawetz, N. (2007). A Picture's Worth: Digital Image Analysis and Forensics. Hacker Factor.",
                                "url": "https://fotoforensics.com/tutorial-ela.php"
                        },
                        {
                                "title": "Krawetz, N. (2012). A Picture's Worth — More on ELA. Black Hat USA.",
                                "url": "https://www.hackerfactor.com/papers/bh-usa-07-krawetz-wp.pdf"
                        },
                        {
                                "title": "Farid, H. (2009). Image Forgery Detection. IEEE Signal Processing Magazine.",
                                "url": "https://doi.org/10.1109/MSP.2008.931079"
                        },
                        {
                                "title": "Popescu, A.C. & Farid, H. (2005). Exposing Digital Forgeries by Detecting Traces of Resampling. IEEE TSP.",
                                "url": "https://doi.org/10.1109/TSP.2004.839932"
                        }
                ]
        },
        "zh": {
                "useCase": "检测局部操纵和AI修补",
                "mechanism": "以固定质量重压缩图像并计算差异。",
                "accuracy": "高 - 88-94%",
                "name": "误差级别分析 (ELA)",
                "source": "Krawetz (2007)",
                "algorithm": "JPEG重压缩差异",
                "parameters": "质量: 95, 色彩空间: YCbCr, 块: 8x8",
                "description": "以已知JPEG质量重新保存图像并比较误差级别。AI生成图像显示均匀误差模式。"
        },
        "ja": {
                "useCase": "局所操作とAIインペインティングの検出",
                "mechanism": "固定品質で再圧縮し差分を計算。",
                "accuracy": "高 - 88-94%",
                "name": "エラーレベル分析 (ELA)",
                "source": "Krawetz (2007)",
                "algorithm": "JPEG再圧縮差分",
                "parameters": "品質: 95, 色空間: YCbCr, ブロック: 8x8",
                "description": "既知のJPEG品質で再保存しエラーレベルを比較。AI画像は均一なパターンを示す。"
        },
        "ko": {
                "useCase": "로컬 조작 및 AI 인페인팅 감지",
                "mechanism": "고정 품질로 재압축하여 차이를 계산합니다.",
                "accuracy": "높음 - 88-94%",
                "name": "오류 수준 분석 (ELA)",
                "source": "Krawetz (2007)",
                "algorithm": "JPEG 재압축 차분",
                "parameters": "품질: 95, 색상 공간: YCbCr, 블록: 8x8",
                "description": "알려진 JPEG 품질로 이미지를 재저장하고 오류 수준을 비교합니다."
        },
        "es": {
                "useCase": "Detectar manipulaciones locales",
                "mechanism": "Recomprime a calidad fija y calcula la diferencia.",
                "accuracy": "Alto - 88-94%",
                "name": "Analisis de nivel de error (ELA)",
                "source": "Krawetz (2007)",
                "algorithm": "Diferencial de recompresion JPEG",
                "parameters": "Calidad: 95, Espacio: YCbCr, Bloque: 8x8",
                "description": "Reguarda la imagen con calidad JPEG conocida y compara niveles de error."
        },
    },
    "entropy": {
        "en": {
                "useCase": "Detecting AI-generated smooth regions, texture anomalies, and information-theoretic irregularities",
                "mechanism": "Computes Shannon entropy for overlapping image blocks and builds an entropy heatmap. AI-generated images often show unnaturally uniform entropy distributions compared to the natural variation found in authentic photographs.",
                "accuracy": "Medium - 70-80% as complementary signal to other methods",
                "name": "Entropy Analysis",
                "source": "Shannon, C.E. (1948) - A Mathematical Theory of Communication; applied to image forensics",
                "algorithm": "Shannon Entropy + Local Block Entropy Map",
                "parameters": "Block size: 16x16, Overlap: 75%, Channels: grayscale + per-channel, Metrics: local entropy, entropy variance, min/max ratio",
                "description": "Measures information entropy across image blocks to detect regions with abnormal randomness or uniformity, common in AI-generated content.",
                "references": [
                        {
                                "url": "https://doi.org/10.1002/j.1538-7305.1948.tb01338.x",
                                "title": "Shannon, C.E. (1948). A Mathematical Theory of Communication. Bell System Technical Journal."
                        },
                        {
                                "url": "https://doi.org/10.1109/TIFS.2006.873602",
                                "title": "Lyu, S. & Farid, H. (2006). Steganalysis Using Higher-Order Image Statistics. IEEE TIFS."
                        }
                ],
                "strengths": "• Information-theoretic foundation\n• Reveals unnaturally smooth AI regions\n• Works on any image format\n• Provides spatial entropy map for localization",
                "limitations": "• Simple textures naturally have low entropy\n• Heavy compression reduces entropy variation\n• Studio/controlled photos may appear uniform\n• Standalone accuracy is moderate"
        },
        "vi": {
                "useCase": "Phát hiện vùng mượt AI, bất thường kết cấu",
                "mechanism": "Tính entropy Shannon cho các khối chồng lấn và xây dựng bản đồ nhiệt.",
                "accuracy": "Trung bình - 70-80%",
                "name": "Phân tích Entropy",
                "source": "Shannon, C.E. (1948)",
                "algorithm": "Entropy Shannon + Bản đồ Entropy khối",
                "parameters": "Kích thước khối: 16x16, Chồng lấn: 75%",
                "description": "Đo entropy thông tin trên các khối ảnh để phát hiện vùng có tính ngẫu nhiên bất thường, phổ biến trong nội dung AI.",
                "references": [
                        {
                                "url": "https://doi.org/10.1002/j.1538-7305.1948.tb01338.x",
                                "title": "Shannon, C.E. (1948). A Mathematical Theory of Communication. Bell System Technical Journal."
                        },
                        {
                                "url": "https://doi.org/10.1109/TIFS.2006.873602",
                                "title": "Lyu, S. & Farid, H. (2006). Steganalysis Using Higher-Order Image Statistics. IEEE TIFS."
                        }
                ],
                "strengths": "• Nền tảng lý thuyết thông tin\n• Tiết lộ vùng AI mượt bất thường\n• Hoạt động trên mọi định dạng ảnh\n• Cung cấp bản đồ entropy không gian để định vị",
                "limitations": "• Kết cấu đơn giản tự nhiên có entropy thấp\n• Nén nặng giảm biến thiên entropy\n• Ảnh studio/kiểm soát có thể trông đồng nhất\n• Độ chính xác đơn lẻ trung bình"
        },
        "zh": {
                "useCase": "检测AI生成的平滑区域",
                "mechanism": "计算重叠块的Shannon熵。",
                "accuracy": "中 - 70-80%",
                "name": "熵分析",
                "source": "Shannon (1948)",
                "algorithm": "Shannon熵 + 块熵图",
                "parameters": "块: 16x16, 重叠: 75%",
                "description": "测量图像块的信息熵以检测异常。"
        },
        "ja": {
                "useCase": "AI平滑領域の検出",
                "mechanism": "重複ブロックのシャノンエントロピーを計算。",
                "accuracy": "中 - 70-80%",
                "name": "エントロピー分析",
                "source": "Shannon (1948)",
                "algorithm": "シャノンエントロピー + ブロックマップ",
                "parameters": "ブロック: 16x16, オーバーラップ: 75%",
                "description": "画像ブロックの情報エントロピーを測定。"
        },
        "ko": {
                "useCase": "AI 평활 영역 감지",
                "mechanism": "겹치는 블록의 섀넌 엔트로피를 계산합니다.",
                "accuracy": "중간 - 70-80%",
                "name": "엔트로피 분석",
                "source": "Shannon (1948)",
                "algorithm": "섀넌 엔트로피 + 블록 맵",
                "parameters": "블록: 16x16, 오버랩: 75%",
                "description": "이미지 블록의 정보 엔트로피를 측정합니다."
        },
        "es": {
                "useCase": "Detectar regiones suavizadas por IA",
                "mechanism": "Calcula entropia de Shannon en bloques superpuestos.",
                "accuracy": "Medio - 70-80%",
                "name": "Analisis de entropia",
                "source": "Shannon (1948)",
                "algorithm": "Entropia de Shannon + Mapa de bloques",
                "parameters": "Bloque: 16x16, Superposicion: 75%",
                "description": "Mide la entropia de informacion en bloques de imagen."
        },
    },
    "face_landmark": {
        "en": {
                "useCase": "Detecting AI-generated or manipulated faces through geometric inconsistency analysis",
                "mechanism": "Detects faces and extracts 68 facial landmarks using a pre-trained shape predictor. Applies Procrustes analysis to normalize face geometry, then measures deviations from expected anatomical proportions. AI-generated faces often show subtle asymmetries and impossible geometric relationships between facial features.",
                "accuracy": "Moderate-High - 78-88% on images containing clear faces",
                "name": "Face Landmark Consistency",
                "source": "Yang et al. (2019) - Exposing Deep Fakes Using Inconsistent Head Poses, ICASSP",
                "algorithm": "68-Point Face Mesh + Procrustes Analysis",
                "parameters": "Landmarks: 68 points, Face detector: HOG/CNN, Normalization: Procrustes alignment, Metrics: inter-ocular distance ratio, symmetry score, golden ratio deviation",
                "description": "Detects inconsistencies in facial landmark positions using 68-point face mesh. AI-generated faces often have subtle geometric anomalies in eye, nose, and mouth alignment.",
                "strengths": "• Highly effective for face-specific deepfake detection\n• Based on well-understood anatomical constraints\n• Can detect subtle geometric anomalies\n• Works well with high-resolution face images",
                "limitations": "• Only applicable to images containing faces\n• Requires frontal or near-frontal face orientation\n• Performance drops with occlusions or extreme poses\n• Modern generators increasingly produce anatomically correct faces",
                "references": [
                        {
                                "title": "Yang, X. et al. (2019). Exposing Deep Fakes Using Inconsistent Head Poses. ICASSP.",
                                "url": "https://doi.org/10.1109/ICASSP.2019.8683164"
                        },
                        {
                                "title": "Matern, F. et al. (2019). Exploiting Visual Artifacts to Expose Deepfakes and Face Manipulations. WACV.",
                                "url": "https://doi.org/10.1109/WACVW.2019.00020"
                        }
                ]
        },
        "vi": {
                "useCase": "Phát hiện khuôn mặt AI tạo hoặc bị thao túng qua phân tích sự không nhất quán hình học",
                "mechanism": "Phát hiện khuôn mặt và trích xuất 68 điểm mốc khuôn mặt bằng bộ dự đoán hình dạng đã huấn luyện. Áp dụng phân tích Procrustes để chuẩn hóa hình học khuôn mặt, sau đó đo độ lệch so với tỷ lệ giải phẫu mong đợi.",
                "accuracy": "Trung bình-Cao - 78-88% trên ảnh chứa khuôn mặt rõ ràng",
                "name": "Tính nhất quán đặc điểm khuôn mặt",
                "source": "Yang et al. (2019) - Vạch trần Deep Fakes qua tư thế đầu không nhất quán, ICASSP",
                "algorithm": "Lưới khuôn mặt 68 điểm + Phân tích Procrustes",
                "parameters": "Điểm mốc: 68 điểm, Phát hiện khuôn mặt: HOG/CNN, Chuẩn hóa: căn chỉnh Procrustes, Chỉ số: tỷ lệ khoảng cách liên mắt, điểm đối xứng",
                "description": "Phát hiện bất nhất quán vị trí đặc điểm khuôn mặt dùng lưới 68 điểm. Khuôn mặt AI thường có bất thường hình học tinh tế trong căn chỉnh mắt, mũi, miệng.",
                "strengths": "• Hiệu quả cao cho phát hiện deepfake khuôn mặt\n• Dựa trên ràng buộc giải phẫu được hiểu rõ\n• Phát hiện bất thường hình học tinh vi\n• Hoạt động tốt với ảnh khuôn mặt độ phân giải cao",
                "limitations": "• Chỉ áp dụng cho ảnh chứa khuôn mặt\n• Cần hướng khuôn mặt chính diện hoặc gần chính diện\n• Hiệu suất giảm khi bị che khuất hoặc góc cực đoan\n• Các bộ tạo hiện đại ngày càng tạo khuôn mặt chính xác giải phẫu",
                "references": [
                        {
                                "title": "Yang, X. et al. (2019). Exposing Deep Fakes Using Inconsistent Head Poses. ICASSP.",
                                "url": "https://doi.org/10.1109/ICASSP.2019.8683164"
                        },
                        {
                                "title": "Matern, F. et al. (2019). Exploiting Visual Artifacts to Expose Deepfakes and Face Manipulations. WACV.",
                                "url": "https://doi.org/10.1109/WACVW.2019.00020"
                        }
                ]
        },
        "zh": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Face Landmark Consistency",
                "source": "",
                "algorithm": "68-Point Face Mesh + Procrustes Analysis",
                "parameters": "",
                "description": "Detects inconsistencies in facial landmark positions using 68-point face mesh. AI-generated faces often have subtle geometric anomalies in eye, nose, and mouth alignment.",
                "references": [
                        {
                                "title": "Yang, X. et al. (2019). Exposing Deep Fakes Using Inconsistent Head Poses. ICASSP.",
                                "url": "https://doi.org/10.1109/ICASSP.2019.8683164"
                        },
                        {
                                "title": "Matern, F. et al. (2019). Exploiting Visual Artifacts to Expose Deepfakes and Face Manipulations. WACV.",
                                "url": "https://doi.org/10.1109/WACVW.2019.00020"
                        }
                ]
        },
        "ja": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Face Landmark Consistency",
                "source": "",
                "algorithm": "68-Point Face Mesh + Procrustes Analysis",
                "parameters": "",
                "description": "Detects inconsistencies in facial landmark positions using 68-point face mesh. AI-generated faces often have subtle geometric anomalies in eye, nose, and mouth alignment.",
                "references": [
                        {
                                "title": "Yang, X. et al. (2019). Exposing Deep Fakes Using Inconsistent Head Poses. ICASSP.",
                                "url": "https://doi.org/10.1109/ICASSP.2019.8683164"
                        },
                        {
                                "title": "Matern, F. et al. (2019). Exploiting Visual Artifacts to Expose Deepfakes and Face Manipulations. WACV.",
                                "url": "https://doi.org/10.1109/WACVW.2019.00020"
                        }
                ]
        },
        "ko": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Face Landmark Consistency",
                "source": "",
                "algorithm": "68-Point Face Mesh + Procrustes Analysis",
                "parameters": "",
                "description": "Detects inconsistencies in facial landmark positions using 68-point face mesh. AI-generated faces often have subtle geometric anomalies in eye, nose, and mouth alignment.",
                "references": [
                        {
                                "title": "Yang, X. et al. (2019). Exposing Deep Fakes Using Inconsistent Head Poses. ICASSP.",
                                "url": "https://doi.org/10.1109/ICASSP.2019.8683164"
                        },
                        {
                                "title": "Matern, F. et al. (2019). Exploiting Visual Artifacts to Expose Deepfakes and Face Manipulations. WACV.",
                                "url": "https://doi.org/10.1109/WACVW.2019.00020"
                        }
                ]
        },
        "es": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Face Landmark Consistency",
                "source": "",
                "algorithm": "68-Point Face Mesh + Procrustes Analysis",
                "parameters": "",
                "description": "Detects inconsistencies in facial landmark positions using 68-point face mesh. AI-generated faces often have subtle geometric anomalies in eye, nose, and mouth alignment.",
                "references": [
                        {
                                "title": "Yang, X. et al. (2019). Exposing Deep Fakes Using Inconsistent Head Poses. ICASSP.",
                                "url": "https://doi.org/10.1109/ICASSP.2019.8683164"
                        },
                        {
                                "title": "Matern, F. et al. (2019). Exploiting Visual Artifacts to Expose Deepfakes and Face Manipulations. WACV.",
                                "url": "https://doi.org/10.1109/WACVW.2019.00020"
                        }
                ]
        },
    },
    "fourier_ring": {
        "en": {
                "useCase": "Detecting GAN upsampling artifacts invisible to the human eye but present in frequency domain",
                "mechanism": "Computes the 2D Fast Fourier Transform and converts to polar coordinates to create a radial power spectral density profile. GAN-based upsampling operations (transposed convolution, pixel shuffle) create characteristic periodic ring patterns in the frequency domain that appear as peaks in the radial profile.",
                "accuracy": "High - 85-93% for GAN-generated images with upsampling artifacts",
                "name": "Fourier Ring Pattern Detection",
                "source": "Dzanic et al. (2020) - Fourier Spectrum Discrepancies in Deep Network Generated Images, NeurIPS Workshop",
                "algorithm": "2D FFT Radial Profile + Peak Detection",
                "parameters": "FFT size: image dimensions, Radial bins: 256, Peak detection: scipy find_peaks, Min peak prominence: 2σ above mean",
                "description": "Detects periodic ring patterns in 2D Fourier spectrum caused by GAN upsampling operations. These spectral anomalies are invisible to human eyes but computationally detectable.",
                "strengths": "• Very reliable for GAN-based generators\n• Detects artifacts invisible to humans\n• Mathematically well-founded\n• Fast computation via FFT",
                "limitations": "• Less effective for diffusion models\n• JPEG compression can mask spectral artifacts\n• Small images reduce frequency resolution\n• May produce false positives on regularly textured images",
                "references": [
                        {
                                "title": "Dzanic, T. et al. (2020). Fourier Spectrum Discrepancies in Deep Network Generated Images. NeurIPS Workshop.",
                                "url": "https://arxiv.org/abs/1911.06465"
                        },
                        {
                                "title": "Frank, J. et al. (2020). Leveraging Frequency Analysis for Deep Fake Image Recognition. ICML.",
                                "url": "https://arxiv.org/abs/2003.08685"
                        }
                ]
        },
        "vi": {
                "useCase": "Phát hiện hiện vật upsampling GAN không thể nhìn thấy bằng mắt nhưng có trong miền tần số",
                "mechanism": "Tính toán biến đổi Fourier nhanh 2D và chuyển sang tọa độ cực để tạo hồ sơ mật độ phổ công suất theo bán kính. Các phép upsampling GAN (chuyển vị tích chập, xáo trộn pixel) tạo mẫu vòng tuần hoàn đặc trưng trong miền tần số xuất hiện dưới dạng đỉnh trong hồ sơ bán kính.",
                "accuracy": "Cao - 85-93% cho ảnh GAN có hiện vật upsampling",
                "name": "Phát hiện mẫu vòng Fourier",
                "source": "Dzanic et al. (2020) - Sự khác biệt phổ Fourier trong ảnh tạo bởi mạng sâu, NeurIPS Workshop",
                "algorithm": "Profile hướng tâm FFT 2D + Phát hiện đỉnh",
                "parameters": "Kích thước FFT: kích thước ảnh, Bins bán kính: 256, Phát hiện đỉnh: scipy find_peaks, Độ nổi bật đỉnh tối thiểu: 2σ trên trung bình",
                "description": "Phát hiện mẫu vòng tuần hoàn trong phổ Fourier 2D do phép upsampling GAN. Các bất thường phổ này mắt thường không thấy nhưng máy tính phát hiện được.",
                "strengths": "• Rất đáng tin cậy cho bộ tạo dựa trên GAN\n• Phát hiện hiện vật mắt thường không thấy\n• Nền tảng toán học vững chắc\n• Tính toán nhanh qua FFT",
                "limitations": "• Kém hiệu quả với mô hình khuếch tán\n• Nén JPEG có thể che giấu hiện vật phổ\n• Ảnh nhỏ giảm độ phân giải tần số\n• Có thể tạo dương tính giả trên ảnh có kết cấu đều",
                "references": [
                        {
                                "title": "Dzanic, T. et al. (2020). Fourier Spectrum Discrepancies in Deep Network Generated Images. NeurIPS Workshop.",
                                "url": "https://arxiv.org/abs/1911.06465"
                        },
                        {
                                "title": "Frank, J. et al. (2020). Leveraging Frequency Analysis for Deep Fake Image Recognition. ICML.",
                                "url": "https://arxiv.org/abs/2003.08685"
                        }
                ]
        },
        "zh": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Fourier Ring Pattern Detection",
                "source": "",
                "algorithm": "2D FFT Radial Profile + Peak Detection",
                "parameters": "",
                "description": "Detects periodic ring patterns in 2D Fourier spectrum caused by GAN upsampling operations. These spectral anomalies are invisible to human eyes but computationally detectable.",
                "references": [
                        {
                                "title": "Dzanic, T. et al. (2020). Fourier Spectrum Discrepancies in Deep Network Generated Images. NeurIPS Workshop.",
                                "url": "https://arxiv.org/abs/1911.06465"
                        },
                        {
                                "title": "Frank, J. et al. (2020). Leveraging Frequency Analysis for Deep Fake Image Recognition. ICML.",
                                "url": "https://arxiv.org/abs/2003.08685"
                        }
                ]
        },
        "ja": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Fourier Ring Pattern Detection",
                "source": "",
                "algorithm": "2D FFT Radial Profile + Peak Detection",
                "parameters": "",
                "description": "Detects periodic ring patterns in 2D Fourier spectrum caused by GAN upsampling operations. These spectral anomalies are invisible to human eyes but computationally detectable.",
                "references": [
                        {
                                "title": "Dzanic, T. et al. (2020). Fourier Spectrum Discrepancies in Deep Network Generated Images. NeurIPS Workshop.",
                                "url": "https://arxiv.org/abs/1911.06465"
                        },
                        {
                                "title": "Frank, J. et al. (2020). Leveraging Frequency Analysis for Deep Fake Image Recognition. ICML.",
                                "url": "https://arxiv.org/abs/2003.08685"
                        }
                ]
        },
        "ko": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Fourier Ring Pattern Detection",
                "source": "",
                "algorithm": "2D FFT Radial Profile + Peak Detection",
                "parameters": "",
                "description": "Detects periodic ring patterns in 2D Fourier spectrum caused by GAN upsampling operations. These spectral anomalies are invisible to human eyes but computationally detectable.",
                "references": [
                        {
                                "title": "Dzanic, T. et al. (2020). Fourier Spectrum Discrepancies in Deep Network Generated Images. NeurIPS Workshop.",
                                "url": "https://arxiv.org/abs/1911.06465"
                        },
                        {
                                "title": "Frank, J. et al. (2020). Leveraging Frequency Analysis for Deep Fake Image Recognition. ICML.",
                                "url": "https://arxiv.org/abs/2003.08685"
                        }
                ]
        },
        "es": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Fourier Ring Pattern Detection",
                "source": "",
                "algorithm": "2D FFT Radial Profile + Peak Detection",
                "parameters": "",
                "description": "Detects periodic ring patterns in 2D Fourier spectrum caused by GAN upsampling operations. These spectral anomalies are invisible to human eyes but computationally detectable.",
                "references": [
                        {
                                "title": "Dzanic, T. et al. (2020). Fourier Spectrum Discrepancies in Deep Network Generated Images. NeurIPS Workshop.",
                                "url": "https://arxiv.org/abs/1911.06465"
                        },
                        {
                                "title": "Frank, J. et al. (2020). Leveraging Frequency Analysis for Deep Fake Image Recognition. ICML.",
                                "url": "https://arxiv.org/abs/2003.08685"
                        }
                ]
        },
    },
    "frequency_band": {
        "en": {
                "useCase": "Analyzing frequency energy distribution anomalies in AI-generated images",
                "mechanism": "Decomposes the image into low, mid, and high frequency sub-bands using Butterworth bandpass filters. Computes energy distribution across bands and compares ratios. AI generators typically produce images with anomalous energy concentration in specific frequency bands due to their architecture limitations.",
                "accuracy": "Moderate-High - 75-85% as complementary frequency analysis",
                "name": "Frequency Band Analysis",
                "source": "Frank et al. (2020) - Leveraging Frequency Analysis for Deep Fake Image Recognition, ICML",
                "algorithm": "Multi-band Butterworth Filter Decomposition",
                "parameters": "Filter type: Butterworth order 4, Bands: low (0-0.1π), mid (0.1π-0.4π), high (0.4π-π), Metrics: band energy ratio, spectral centroid",
                "description": "Decomposes image into multiple frequency sub-bands using filter banks. AI-generated images show anomalous energy distribution across bands due to upsampling artifacts.",
                "strengths": "• Captures frequency-domain signatures of different AI models\n• Complements spatial domain analysis\n• Adjustable band parameters for different generators\n• Relatively robust to spatial domain manipulations",
                "limitations": "• Requires careful band parameter tuning\n• JPEG compression affects high-frequency analysis\n• Less distinctive for high-quality diffusion outputs\n• Performance varies with image content type",
                "references": [
                        {
                                "title": "Frank, J. et al. (2020). Leveraging Frequency Analysis for Deep Fake Image Recognition. ICML.",
                                "url": "https://arxiv.org/abs/2003.08685"
                        },
                        {
                                "title": "Durall, R. et al. (2020). Watch Your Up-Convolution: CNN Based Generative Deep Neural Networks Are Failing to Reproduce Spectral Distributions. CVPR.",
                                "url": "https://arxiv.org/abs/1911.00686"
                        }
                ]
        },
        "vi": {
                "useCase": "Phân tích bất thường phân bố năng lượng tần số trong ảnh AI",
                "mechanism": "Phân tách ảnh thành các dải tần thấp, trung và cao bằng bộ lọc thông dải Butterworth. Tính phân bố năng lượng qua các dải và so sánh tỷ lệ. Bộ tạo AI thường tạo ảnh có tập trung năng lượng bất thường ở các dải tần cụ thể.",
                "accuracy": "Trung bình-Cao - 75-85% như phân tích tần số bổ sung",
                "name": "Phân tích dải tần số",
                "source": "Frank et al. (2020) - Tận dụng phân tích tần số cho nhận dạng ảnh Deep Fake, ICML",
                "algorithm": "Phân rã bộ lọc Butterworth đa dải",
                "parameters": "Loại bộ lọc: Butterworth bậc 4, Dải: thấp (0-0.1π), trung (0.1π-0.4π), cao (0.4π-π), Chỉ số: tỷ lệ năng lượng dải, trọng tâm phổ",
                "description": "Phân rã ảnh thành nhiều dải tần con bằng bộ lọc. Ảnh AI cho thấy phân bố năng lượng bất thường giữa các dải do hiện vật upsampling.",
                "strengths": "• Nắm bắt dấu vân tần số của các mô hình AI khác nhau\n• Bổ sung cho phân tích miền không gian\n• Tham số dải điều chỉnh được cho từng bộ tạo\n• Tương đối bền vững với thao tác miền không gian",
                "limitations": "• Cần điều chỉnh tham số dải cẩn thận\n• Nén JPEG ảnh hưởng phân tích tần cao\n• Ít đặc trưng cho đầu ra khuếch tán chất lượng cao\n• Hiệu suất thay đổi theo loại nội dung ảnh",
                "references": [
                        {
                                "title": "Frank, J. et al. (2020). Leveraging Frequency Analysis for Deep Fake Image Recognition. ICML.",
                                "url": "https://arxiv.org/abs/2003.08685"
                        },
                        {
                                "title": "Durall, R. et al. (2020). Watch Your Up-Convolution: CNN Based Generative Deep Neural Networks Are Failing to Reproduce Spectral Distributions. CVPR.",
                                "url": "https://arxiv.org/abs/1911.00686"
                        }
                ]
        },
        "zh": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Frequency Band Analysis",
                "source": "",
                "algorithm": "Multi-band Butterworth Filter Decomposition",
                "parameters": "",
                "description": "Decomposes image into multiple frequency sub-bands using filter banks. AI-generated images show anomalous energy distribution across bands due to upsampling artifacts.",
                "references": [
                        {
                                "title": "Frank, J. et al. (2020). Leveraging Frequency Analysis for Deep Fake Image Recognition. ICML.",
                                "url": "https://arxiv.org/abs/2003.08685"
                        },
                        {
                                "title": "Durall, R. et al. (2020). Watch Your Up-Convolution: CNN Based Generative Deep Neural Networks Are Failing to Reproduce Spectral Distributions. CVPR.",
                                "url": "https://arxiv.org/abs/1911.00686"
                        }
                ]
        },
        "ja": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Frequency Band Analysis",
                "source": "",
                "algorithm": "Multi-band Butterworth Filter Decomposition",
                "parameters": "",
                "description": "Decomposes image into multiple frequency sub-bands using filter banks. AI-generated images show anomalous energy distribution across bands due to upsampling artifacts.",
                "references": [
                        {
                                "title": "Frank, J. et al. (2020). Leveraging Frequency Analysis for Deep Fake Image Recognition. ICML.",
                                "url": "https://arxiv.org/abs/2003.08685"
                        },
                        {
                                "title": "Durall, R. et al. (2020). Watch Your Up-Convolution: CNN Based Generative Deep Neural Networks Are Failing to Reproduce Spectral Distributions. CVPR.",
                                "url": "https://arxiv.org/abs/1911.00686"
                        }
                ]
        },
        "ko": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Frequency Band Analysis",
                "source": "",
                "algorithm": "Multi-band Butterworth Filter Decomposition",
                "parameters": "",
                "description": "Decomposes image into multiple frequency sub-bands using filter banks. AI-generated images show anomalous energy distribution across bands due to upsampling artifacts.",
                "references": [
                        {
                                "title": "Frank, J. et al. (2020). Leveraging Frequency Analysis for Deep Fake Image Recognition. ICML.",
                                "url": "https://arxiv.org/abs/2003.08685"
                        },
                        {
                                "title": "Durall, R. et al. (2020). Watch Your Up-Convolution: CNN Based Generative Deep Neural Networks Are Failing to Reproduce Spectral Distributions. CVPR.",
                                "url": "https://arxiv.org/abs/1911.00686"
                        }
                ]
        },
        "es": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Frequency Band Analysis",
                "source": "",
                "algorithm": "Multi-band Butterworth Filter Decomposition",
                "parameters": "",
                "description": "Decomposes image into multiple frequency sub-bands using filter banks. AI-generated images show anomalous energy distribution across bands due to upsampling artifacts.",
                "references": [
                        {
                                "title": "Frank, J. et al. (2020). Leveraging Frequency Analysis for Deep Fake Image Recognition. ICML.",
                                "url": "https://arxiv.org/abs/2003.08685"
                        },
                        {
                                "title": "Durall, R. et al. (2020). Watch Your Up-Convolution: CNN Based Generative Deep Neural Networks Are Failing to Reproduce Spectral Distributions. CVPR.",
                                "url": "https://arxiv.org/abs/1911.00686"
                        }
                ]
        },
    },
    "gan_fingerprint": {
        "en": {
                "name": "GAN Fingerprint Detection",
                "description": "Identifies unique spectral fingerprints left by Generative Adversarial Networks. Each GAN architecture produces characteristic frequency-domain patterns in generated images that serve as reliable forensic identifiers.",
                "algorithm": "GAN Architecture Fingerprint Classifier (Spectral Feature Extraction + Multi-class SVM)",
                "mechanism": "The detection process:\n\n1. **Spectral feature extraction**: Computes the 2D FFT power spectrum and extracts azimuthally-averaged frequency profiles unique to each GAN architecture.\n\n2. **Architecture-specific patterns**: Different GAN architectures (StyleGAN, ProGAN, BigGAN, CycleGAN) produce distinct spectral fingerprints due to their specific upsampling and normalization layers.\n\n3. **Fingerprint classification**: A multi-class SVM classifier trained on spectral features identifies both the presence of GAN artifacts and the specific architecture.\n\n4. **Cross-model validation**: Results are cross-validated against a database of known GAN spectral signatures.",
                "parameters": "FFT: 256x256 power spectrum\nFeature extraction: azimuthal averaging + radial profiles\nClassifier: Multi-class SVM with RBF kernel\nKnown architectures: StyleGAN1/2/3, ProGAN, BigGAN, CycleGAN, StarGAN, DCGAN",
                "accuracy": "Very High - 92-98% for known GAN architectures. Accuracy decreases for novel or fine-tuned architectures.",
                "source": "Marra et al. (2019) - Do GANs Leave Artificial Fingerprints?, Yu et al. (2019) - Attributing Fake Images to GANs",
                "useCase": "Identifying GAN-generated images and attributing them to specific AI model architectures. Critical for deepfake detection and content provenance.",
                "strengths": "• Extremely high accuracy for known GAN families\n• Can attribute images to specific GAN architectures\n• Robust against common image transformations\n• Works without requiring the original model",
                "limitations": "• Less effective for novel/unknown GAN architectures\n• Fine-tuned models may alter fingerprints\n• Diffusion models have different fingerprint characteristics\n• Heavy post-processing can degrade fingerprints",
                "references": [
                        {
                                "title": "Marra, F. et al. (2019). Do GANs Leave Artificial Fingerprints? IEEE MIPR.",
                                "url": "https://doi.org/10.1109/MIPR.2019.00083"
                        },
                        {
                                "title": "Yu, N. et al. (2019). Attributing Fake Images to GANs: Learning and Analyzing GAN Fingerprints. ICCV.",
                                "url": "https://arxiv.org/abs/1811.08180"
                        },
                        {
                                "title": "Frank, J. et al. (2020). Leveraging Frequency Analysis for Deep Fake Image Recognition. ICML.",
                                "url": "https://arxiv.org/abs/2003.08685"
                        },
                        {
                                "title": "Gragnaniello, D. et al. (2021). Are GAN Generated Images Easy to Detect? IEEE MMSP.",
                                "url": "https://arxiv.org/abs/2104.02617"
                        }
                ]
        },
        "vi": {
                "name": "Phát hiện vân GAN",
                "description": "Xác định dấu vân tay phổ đặc trưng do mạng đối kháng sinh tạo (GAN) để lại. Mỗi kiến trúc GAN tạo ra mẫu miền tần số riêng biệt trong ảnh sinh, đóng vai trò như định danh pháp y đáng tin cậy.",
                "algorithm": "Bộ phân loại vân kiến trúc GAN (Trích xuất đặc trưng phổ + SVM đa lớp)",
                "mechanism": "Quy trình phát hiện:\n\n1. **Trích xuất đặc trưng phổ**: Tính phổ công suất FFT 2D và trích xuất profile tần số trung bình azimuthal đặc trưng cho từng kiến trúc GAN.\n\n2. **Mẫu theo kiến trúc**: Các kiến trúc GAN khác nhau (StyleGAN, ProGAN, BigGAN, CycleGAN) tạo vân phổ riêng biệt do các lớp upsampling và chuẩn hóa đặc thù.\n\n3. **Phân loại vân**: Bộ phân loại SVM đa lớp được huấn luyện trên đặc trưng phổ để nhận dạng.\n\n4. **Xác nhận chéo**: Kết quả được xác nhận với cơ sở dữ liệu chữ ký phổ GAN đã biết.",
                "parameters": "FFT: phổ công suất 256x256\nTrích xuất: trung bình azimuthal + profile hướng tâm\nBộ phân loại: SVM đa lớp, kernel RBF\nKiến trúc đã biết: StyleGAN1/2/3, ProGAN, BigGAN, CycleGAN, StarGAN, DCGAN",
                "accuracy": "Rất cao - 92-98% cho kiến trúc GAN đã biết. Độ chính xác giảm với kiến trúc mới.",
                "source": "Marra et al. (2019), Yu et al. (2019) - Attributing Fake Images to GANs",
                "useCase": "Nhận dạng ảnh GAN và quy kết cho kiến trúc mô hình AI cụ thể. Quan trọng cho phát hiện deepfake.",
                "strengths": "• Độ chính xác cực cao cho họ GAN đã biết\n• Có thể quy kết ảnh cho kiến trúc GAN cụ thể\n• Bền vững trước các biến đổi ảnh phổ biến\n• Hoạt động không cần mô hình gốc",
                "limitations": "• Kém hiệu quả với kiến trúc GAN mới/chưa biết\n• Mô hình tinh chỉnh có thể thay đổi vân\n• Mô hình Diffusion có đặc trưng vân khác\n• Hậu xử lý nặng có thể làm suy giảm vân",
                "references": [
                        {
                                "title": "Marra, F. et al. (2019). Do GANs Leave Artificial Fingerprints? IEEE MIPR.",
                                "url": "https://doi.org/10.1109/MIPR.2019.00083"
                        },
                        {
                                "title": "Yu, N. et al. (2019). Attributing Fake Images to GANs. ICCV.",
                                "url": "https://arxiv.org/abs/1811.08180"
                        },
                        {
                                "title": "Frank, J. et al. (2020). Leveraging Frequency Analysis for Deep Fake Image Recognition. ICML.",
                                "url": "https://arxiv.org/abs/2003.08685"
                        },
                        {
                                "title": "Gragnaniello, D. et al. (2021). Are GAN Generated Images Easy to Detect? IEEE MMSP.",
                                "url": "https://arxiv.org/abs/2104.02617"
                        }
                ]
        },
        "zh": {
                "useCase": "识别GAN生成图像",
                "mechanism": "从频域提取GAN特有的频谱特征。",
                "accuracy": "极高 - 92-98%",
                "name": "GAN指纹检测",
                "source": "Marra et al. (2019)",
                "algorithm": "GAN架构指纹分类器",
                "parameters": "FFT: 256x256, 分类器: 多类SVM",
                "description": "识别GAN网络留下的独特指纹。"
        },
        "ja": {
                "useCase": "GAN画像の識別",
                "mechanism": "周波数ドメインからGAN固有の特徴を抽出。",
                "accuracy": "極めて高い - 92-98%",
                "name": "GANフィンガープリント検出",
                "source": "Marra et al. (2019)",
                "algorithm": "GANアーキテクチャ指紋分類器",
                "parameters": "FFT: 256x256, 分類器: マルチクラスSVM",
                "description": "GANが残す固有フィンガープリントを識別。"
        },
        "ko": {
                "useCase": "GAN 이미지 식별",
                "mechanism": "주파수 도메인에서 GAN 고유 특징을 추출합니다.",
                "accuracy": "매우 높음 - 92-98%",
                "name": "GAN 핑거프린트 감지",
                "source": "Marra et al. (2019)",
                "algorithm": "GAN 아키텍처 지문 분류기",
                "parameters": "FFT: 256x256, 분류기: 다중 클래스 SVM",
                "description": "GAN이 남기는 고유 핑거프린트를 식별합니다."
        },
        "es": {
                "useCase": "Identificar imagenes GAN",
                "mechanism": "Extrae caracteristicas espectrales unicas de cada GAN.",
                "accuracy": "Muy alto - 92-98%",
                "name": "Deteccion de huella GAN",
                "source": "Marra et al. (2019)",
                "algorithm": "Clasificador de huella de arquitectura GAN",
                "parameters": "FFT: 256x256, Clasificador: SVM multiclase",
                "description": "Identifica huellas unicas dejadas por redes GAN."
        },
    },
    "gradient": {
        "en": {
                "name": "Gradient Micro-Texture",
                "description": "Examines smooth regions for natural micro-texture from camera sensors. AI images lack sensor-level noise in gradients, producing unnaturally clean smooth areas.",
                "algorithm": "Gradient Smoothness and Micro-Texture Analysis",
                "mechanism": "Analyzes image gradient fields to detect unnaturally smooth regions lacking micro-texture. AI images produce suspiciously clean gradient transitions especially in backgrounds.",
                "parameters": "Gradient operator: Scharr, Window: 16x16 sliding, Metrics: gradient entropy, smoothness ratio",
                "accuracy": "Moderate - 70-80%, higher for diffusion model outputs",
                "source": "Nataraj et al. (2019) Detecting GAN generated Fake Images using Co-occurrence Matrices",
                "useCase": "Identifying AI-generated smooth gradients lacking natural micro-texture",
                "strengths": "• Detection vùng gradient quá sạch đặc trưng AI\n• Chi phí tính toán thấp\n• Hoạt động tốt với ảnh có vùng mượt lớn",
                "limitations": "• Images studio chụp tốt có thể tạo dương tính giả\n• Hiệu quả giảm sau khi thêm nhiễu\n• Phụ thuộc vào nội dung Images",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TIFS.2012.2190402",
                                "title": "Fridrich, J. & Kodovsky, J. (2012). Rich Models for Steganalysis of Digital Images. IEEE TIFS."
                        },
                        {
                                "url": "https://doi.org/10.1016/j.diin.2019.04.001",
                                "title": "Tanaka, K. et al. (2019). Distinguishing Computer Graphics from Natural Images. Digital Investigation."
                        }
                ]
        },
        "vi": {
                "name": "Vi kết cấu Gradient",
                "description": "Kiểm tra vùng mượt để tìm vi kết cấu tự nhiên từ cảm biến. Ảnh AI thiếu nhiễu cảm biến trong gradient, tạo vùng mượt sạch bất thường.",
                "algorithm": "Phân tích vi kết cấu vùng gradient",
                "mechanism": "Phân tích các vùng gradient mượt để tìm vi kết cấu cảm biến. Ảnh camera thật luôn chứa nhiễu vi mô từ cảm biến ngay cả trong vùng mượt nhất, trong khi ảnh AI tạo ra vùng bằng phẳng hoàn hảo.",
                "parameters": "Kích thước khối: 16x16, Ngưỡng mượt: adaptive, Chỉ số: phương sai vi kết cấu, entropy cục bộ",
                "accuracy": "Trung bình - 70-80%",
                "source": "Fridrich & Kodovsky (2012) - Rich Models for Steganalysis; ứng dụng pháp y",
                "useCase": "Phát hiện ảnh AI qua vùng gradient quá sạch, thiếu nhiễu cảm biến",
                "strengths": "• Phát hiện vùng gradient quá sạch đặc trưng AI\n• Chi phí tính toán thấp\n• Hoạt động tốt với ảnh có vùng mượt lớn",
                "limitations": "• Ảnh studio chụp tốt có thể tạo dương tính giả\n• Hiệu quả giảm sau khi thêm nhiễu\n• Phụ thuộc vào nội dung ảnh",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TIFS.2012.2190402",
                                "title": "Fridrich, J. & Kodovsky, J. (2012). Rich Models for Steganalysis of Digital Images. IEEE TIFS."
                        },
                        {
                                "url": "https://doi.org/10.1016/j.diin.2019.04.001",
                                "title": "Tanaka, K. et al. (2019). Distinguishing Computer Graphics from Natural Images. Digital Investigation."
                        }
                ]
        },
        "zh": {
                "name": "Gradient Micro-Texture",
                "description": "Examines smooth regions for natural micro-texture from camera sensors. AI images lack sensor-level noise in gradients, producing unnaturally clean smooth areas.",
                "algorithm": "Gradient Smoothness and Micro-Texture Analysis",
                "mechanism": "Analyzes image gradient fields to detect unnaturally smooth regions lacking micro-texture. AI images produce suspiciously clean gradient transitions especially in backgrounds.",
                "parameters": "Gradient operator: Scharr, Window: 16x16 sliding, Metrics: gradient entropy, smoothness ratio",
                "accuracy": "Moderate - 70-80%, higher for diffusion model outputs",
                "source": "Nataraj et al. (2019) Detecting GAN generated Fake Images using Co-occurrence Matrices",
                "useCase": "Identifying AI-generated smooth gradients lacking natural micro-texture"
        },
        "ja": {
                "name": "Gradient Micro-Texture",
                "description": "Examines smooth regions for natural micro-texture from camera sensors. AI images lack sensor-level noise in gradients, producing unnaturally clean smooth areas.",
                "algorithm": "Gradient Smoothness and Micro-Texture Analysis",
                "mechanism": "Analyzes image gradient fields to detect unnaturally smooth regions lacking micro-texture. AI images produce suspiciously clean gradient transitions especially in backgrounds.",
                "parameters": "Gradient operator: Scharr, Window: 16x16 sliding, Metrics: gradient entropy, smoothness ratio",
                "accuracy": "Moderate - 70-80%, higher for diffusion model outputs",
                "source": "Nataraj et al. (2019) Detecting GAN generated Fake Images using Co-occurrence Matrices",
                "useCase": "Identifying AI-generated smooth gradients lacking natural micro-texture"
        },
        "ko": {
                "name": "Gradient Micro-Texture",
                "description": "Examines smooth regions for natural micro-texture from camera sensors. AI images lack sensor-level noise in gradients, producing unnaturally clean smooth areas.",
                "algorithm": "Gradient Smoothness and Micro-Texture Analysis",
                "mechanism": "Analyzes image gradient fields to detect unnaturally smooth regions lacking micro-texture. AI images produce suspiciously clean gradient transitions especially in backgrounds.",
                "parameters": "Gradient operator: Scharr, Window: 16x16 sliding, Metrics: gradient entropy, smoothness ratio",
                "accuracy": "Moderate - 70-80%, higher for diffusion model outputs",
                "source": "Nataraj et al. (2019) Detecting GAN generated Fake Images using Co-occurrence Matrices",
                "useCase": "Identifying AI-generated smooth gradients lacking natural micro-texture"
        },
        "es": {
                "name": "Micro-textura de gradiente",
                "description": "Examina regiones suaves en busca de micro-textura natural de los sensores de camara.",
                "algorithm": "Gradient Smoothness and Micro-Texture Analysis",
                "mechanism": "Analyzes image gradient fields to detect unnaturally smooth regions lacking micro-texture. AI images produce suspiciously clean gradient transitions especially in backgrounds.",
                "parameters": "Gradient operator: Scharr, Window: 16x16 sliding, Metrics: gradient entropy, smoothness ratio",
                "accuracy": "Moderate - 70-80%, higher for diffusion model outputs",
                "source": "Nataraj et al. (2019) Detecting GAN generated Fake Images using Co-occurrence Matrices",
                "useCase": "Identifying AI-generated smooth gradients lacking natural micro-texture"
        },
    },
    "gram_matrix": {
        "en": {
                "useCase": "Detecting AI-generated texture and style patterns through neural feature correlation analysis",
                "mechanism": "Extracts feature maps from multiple layers of a pre-trained VGG-19 network. Computes Gram matrices (inner products of feature maps) to capture style and texture correlations. AI-generated images produce characteristic Gram matrix patterns that differ from the natural texture correlations found in real photographs.",
                "accuracy": "Moderate - 73-83% for style-based detection",
                "name": "Gram Matrix Texture Analysis",
                "source": "Gatys et al. (2016) - Image Style Transfer Using CNNs, CVPR; adapted for forensics",
                "algorithm": "VGG-19 Feature Extraction + Gram Matrix Comparison",
                "parameters": "Backbone: VGG-19, Layers: conv1_1 through conv5_1, Gram matrix: F^T × F normalized, Comparison: Frobenius norm distance",
                "description": "Computes Gram matrix from CNN feature maps to capture style and texture correlations. AI images produce distinctive Gram matrix patterns different from natural photographs.",
                "strengths": "• Captures deep texture correlations\n• Effective across different AI architectures\n• Multi-scale analysis through multiple layers\n• Well-established theoretical foundation",
                "limitations": "• Computationally expensive (requires CNN forward pass)\n• Sensitive to image resolution changes\n• Style transfer images may create false positives\n• Requires pre-trained model weights",
                "references": [
                        {
                                "title": "Gatys, L.A. et al. (2016). Image Style Transfer Using Convolutional Neural Networks. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2016.265"
                        },
                        {
                                "title": "Liu, Z. et al. (2020). Global Texture Enhancement for Fake Face Detection in the Wild. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR42600.2020.00808"
                        }
                ]
        },
        "vi": {
                "useCase": "Phát hiện mẫu kết cấu và phong cách AI qua phân tích tương quan đặc trưng thần kinh",
                "mechanism": "Trích xuất bản đồ đặc trưng từ nhiều tầng mạng VGG-19 đã huấn luyện. Tính ma trận Gram (tích trong của bản đồ đặc trưng) để nắm bắt tương quan phong cách và kết cấu. Ảnh AI tạo ra mẫu ma trận Gram đặc trưng khác với tương quan kết cấu tự nhiên.",
                "accuracy": "Trung bình - 73-83% cho phát hiện dựa trên phong cách",
                "name": "Phân tích kết cấu ma trận Gram",
                "source": "Gatys et al. (2016) - Chuyển phong cách ảnh sử dụng CNN, CVPR; ứng dụng cho pháp y",
                "algorithm": "Trích xuất đặc trưng VGG-19 + So sánh ma trận Gram",
                "parameters": "Backbone: VGG-19, Tầng: conv1_1 đến conv5_1, Ma trận Gram: F^T × F chuẩn hóa, So sánh: khoảng cách chuẩn Frobenius",
                "description": "Tính ma trận Gram từ bản đồ đặc trưng CNN để nắm bắt tương quan phong cách và kết cấu. Ảnh AI tạo mẫu ma trận Gram khác biệt so với ảnh tự nhiên.",
                "strengths": "• Nắm bắt tương quan kết cấu sâu\n• Hiệu quả trên nhiều kiến trúc AI\n• Phân tích đa tỷ lệ qua nhiều tầng\n• Nền tảng lý thuyết vững chắc",
                "limitations": "• Tốn tài nguyên tính toán (cần forward pass CNN)\n• Nhạy cảm với thay đổi độ phân giải\n• Ảnh chuyển phong cách có thể tạo dương tính giả\n• Cần trọng số mô hình đã huấn luyện",
                "references": [
                        {
                                "title": "Gatys, L.A. et al. (2016). Image Style Transfer Using Convolutional Neural Networks. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2016.265"
                        },
                        {
                                "title": "Liu, Z. et al. (2020). Global Texture Enhancement for Fake Face Detection in the Wild. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR42600.2020.00808"
                        }
                ]
        },
        "zh": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Gram Matrix Texture Analysis",
                "source": "",
                "algorithm": "VGG-19 Feature Extraction + Gram Matrix Comparison",
                "parameters": "",
                "description": "Computes Gram matrix from CNN feature maps to capture style and texture correlations. AI images produce distinctive Gram matrix patterns different from natural photographs.",
                "references": [
                        {
                                "title": "Gatys, L.A. et al. (2016). Image Style Transfer Using Convolutional Neural Networks. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2016.265"
                        },
                        {
                                "title": "Liu, Z. et al. (2020). Global Texture Enhancement for Fake Face Detection in the Wild. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR42600.2020.00808"
                        }
                ]
        },
        "ja": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Gram Matrix Texture Analysis",
                "source": "",
                "algorithm": "VGG-19 Feature Extraction + Gram Matrix Comparison",
                "parameters": "",
                "description": "Computes Gram matrix from CNN feature maps to capture style and texture correlations. AI images produce distinctive Gram matrix patterns different from natural photographs.",
                "references": [
                        {
                                "title": "Gatys, L.A. et al. (2016). Image Style Transfer Using Convolutional Neural Networks. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2016.265"
                        },
                        {
                                "title": "Liu, Z. et al. (2020). Global Texture Enhancement for Fake Face Detection in the Wild. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR42600.2020.00808"
                        }
                ]
        },
        "ko": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Gram Matrix Texture Analysis",
                "source": "",
                "algorithm": "VGG-19 Feature Extraction + Gram Matrix Comparison",
                "parameters": "",
                "description": "Computes Gram matrix from CNN feature maps to capture style and texture correlations. AI images produce distinctive Gram matrix patterns different from natural photographs.",
                "references": [
                        {
                                "title": "Gatys, L.A. et al. (2016). Image Style Transfer Using Convolutional Neural Networks. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2016.265"
                        },
                        {
                                "title": "Liu, Z. et al. (2020). Global Texture Enhancement for Fake Face Detection in the Wild. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR42600.2020.00808"
                        }
                ]
        },
        "es": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Gram Matrix Texture Analysis",
                "source": "",
                "algorithm": "VGG-19 Feature Extraction + Gram Matrix Comparison",
                "parameters": "",
                "description": "Computes Gram matrix from CNN feature maps to capture style and texture correlations. AI images produce distinctive Gram matrix patterns different from natural photographs.",
                "references": [
                        {
                                "title": "Gatys, L.A. et al. (2016). Image Style Transfer Using Convolutional Neural Networks. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2016.265"
                        },
                        {
                                "title": "Liu, Z. et al. (2020). Global Texture Enhancement for Fake Face Detection in the Wild. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR42600.2020.00808"
                        }
                ]
        },
    },
    "histogram": {
        "en": {
                "useCase": "Preliminary screening for AI-generated content and post-processing detection",
                "mechanism": "Computes per-channel histograms (R, G, B, Luminance) and analyzes for gaps, spikes, periodicity, and smoothness metrics. Natural images have characteristic histogram shapes that differ from AI-generated content.",
                "accuracy": "Medium - 70-82% as standalone method, higher when combined with other signals",
                "name": "Histogram Analysis",
                "source": "Popescu & Farid (2005) - Statistical Tools for Digital Forensics",
                "algorithm": "Multi-channel Histogram Distribution Analysis",
                "parameters": "Bins: 256, Channels: R/G/B/L, Metrics: kurtosis, skewness, entropy, gap count, periodicity index",
                "description": "Analyzes color and luminance histogram distributions for statistical anomalies. AI-generated images often show unnaturally smooth or periodic histogram patterns.",
                "references": [
                        {
                                "url": "https://doi.org/10.1007/978-3-540-30114-1_10",
                                "title": "Popescu, A.C. & Farid, H. (2005). Statistical Tools for Digital Forensics. Information Hiding."
                        },
                        {
                                "url": "https://doi.org/10.1109/ICIP.2019.8803661",
                                "title": "McCloskey, S. & Albright, M. (2019). Detecting GAN-generated Imagery using Saturation Cues. IEEE ICIP."
                        }
                ],
                "strengths": "• Very fast computation\n• Effective preliminary screening tool\n• Detects common AI histogram patterns\n• Works across all image formats",
                "limitations": "• Low standalone detection rate\n• Post-processing easily alters histograms\n• Natural images can have unusual histograms\n• Color-corrected images produce false positives"
        },
        "vi": {
                "useCase": "Sàng lọc sơ bộ nội dung AI và phát hiện hậu xử lý",
                "mechanism": "Tính histogram từng kênh R, G, B, L và phân tích khoảng trống, đỉnh, tính chu kỳ.",
                "accuracy": "Trung bình - 70-82%",
                "name": "Phân tích Histogram",
                "source": "Popescu & Farid (2005)",
                "algorithm": "Phân tích phân phối Histogram đa kênh",
                "parameters": "Bins: 256, Kênh: R/G/B/L, Chỉ số: kurtosis, skewness, entropy",
                "description": "Phân tích phân phối histogram màu và độ sáng. Ảnh AI thường có histogram mượt bất thường hoặc có tính chu kỳ.",
                "references": [
                        {
                                "url": "https://doi.org/10.1007/978-3-540-30114-1_10",
                                "title": "Popescu, A.C. & Farid, H. (2005). Statistical Tools for Digital Forensics. Information Hiding."
                        },
                        {
                                "url": "https://doi.org/10.1109/ICIP.2019.8803661",
                                "title": "McCloskey, S. & Albright, M. (2019). Detecting GAN-generated Imagery using Saturation Cues. IEEE ICIP."
                        }
                ],
                "strengths": "• Tính toán rất nhanh\n• Công cụ sàng lọc sơ bộ hiệu quả\n• Phát hiện mẫu histogram AI phổ biến\n• Hoạt động trên mọi định dạng ảnh",
                "limitations": "• Tỷ lệ phát hiện đơn lẻ thấp\n• Hậu xử lý dễ dàng thay đổi histogram\n• Ảnh tự nhiên có thể có histogram bất thường\n• Ảnh đã chỉnh màu tạo dương tính giả"
        },
        "zh": {
                "useCase": "初步筛选AI内容",
                "mechanism": "计算RGB各通道直方图并分析异常。",
                "accuracy": "中 - 70-82%",
                "name": "直方图分析",
                "source": "Popescu & Farid (2005)",
                "algorithm": "多通道直方图分布分析",
                "parameters": "Bins: 256, 通道: R/G/B/L",
                "description": "分析颜色直方图分布的统计异常。"
        },
        "ja": {
                "useCase": "AIコンテンツの予備スクリーニング",
                "mechanism": "RGB各チャネルのヒストグラムを分析。",
                "accuracy": "中 - 70-82%",
                "name": "ヒストグラム分析",
                "source": "Popescu & Farid (2005)",
                "algorithm": "マルチチャネルヒストグラム分析",
                "parameters": "ビン: 256, チャネル: R/G/B/L",
                "description": "色ヒストグラム分布の統計的異常を分析。"
        },
        "ko": {
                "useCase": "AI 콘텐츠 사전 스크리닝",
                "mechanism": "RGB 각 채널 히스토그램을 분석합니다.",
                "accuracy": "중간 - 70-82%",
                "name": "히스토그램 분석",
                "source": "Popescu & Farid (2005)",
                "algorithm": "다채널 히스토그램 분석",
                "parameters": "빈: 256, 채널: R/G/B/L",
                "description": "색상 히스토그램 분포의 통계적 이상을 분석합니다."
        },
        "es": {
                "useCase": "Cribado preliminar de contenido IA",
                "mechanism": "Calcula histogramas por canal RGB.",
                "accuracy": "Medio - 70-82%",
                "name": "Analisis de histograma",
                "source": "Popescu & Farid (2005)",
                "algorithm": "Analisis multicanal de histograma",
                "parameters": "Bins: 256, Canales: R/G/B/L",
                "description": "Analiza distribuciones de histograma de color para anomalias."
        },
    },
    "jpeg_ghost": {
        "en": {
                "useCase": "Detecting image tampering via re-saving, quality inconsistencies, and spliced JPEG regions",
                "mechanism": "Re-compresses the image at multiple quality factors and measures the difference map for each. Regions that were previously compressed at a specific quality show minimal difference (ghost) at that quality level, revealing manipulation.",
                "accuracy": "Medium-High - 78-88% for double-compressed JPEG images",
                "name": "JPEG Ghost Analysis",
                "source": "Farid, H. (2009) - Exposing Digital Forgeries from JPEG Ghosts",
                "algorithm": "Double JPEG Compression Detection",
                "parameters": "Quality range: 50-99, Step: 1, Block size: 8x8, Detection threshold: adaptive per-image",
                "description": "Detects traces of previous JPEG compressions (ghosts) that reveal re-saving or manipulation. AI-generated images may have inconsistent compression histories.",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TIFS.2008.2012215",
                                "title": "Farid, H. (2009). Exposing Digital Forgeries from JPEG Ghosts. IEEE TIFS."
                        },
                        {
                                "url": "https://doi.org/10.1016/j.sigpro.2009.03.025",
                                "title": "Li, W. et al. (2009). Passive Detection of Doctored JPEG Image via Block Artifact Grid Extraction. Signal Processing."
                        }
                ],
                "strengths": "• Localizes tampered regions specifically\n• Strong evidence of re-compression\n• Can estimate original quality factor\n• Well-proven forensic methodology",
                "limitations": "• Only works on JPEG images\n• Computationally intensive (multiple re-compressions)\n• Same-quality re-compression is undetectable\n• AI-generated JPEGs without tampering won't show ghosts"
        },
        "vi": {
                "useCase": "Phát hiện giả mạo qua lưu lại và vùng JPEG ghép",
                "mechanism": "Nén lại ảnh ở nhiều hệ số chất lượng và đo bản đồ sai biệt cho mỗi mức.",
                "accuracy": "Trung bình-Cao - 78-88%",
                "name": "Phân tích JPEG Ghost",
                "source": "Farid, H. (2009)",
                "algorithm": "Phát hiện nén JPEG kép",
                "parameters": "Phạm vi chất lượng: 50-99, Bước: 1, Kích thước khối: 8x8",
                "description": "Phát hiện dấu vết nén JPEG trước đó. Ảnh AI có thể có lịch sử nén không nhất quán.",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TIFS.2008.2012215",
                                "title": "Farid, H. (2009). Exposing Digital Forgeries from JPEG Ghosts. IEEE TIFS."
                        },
                        {
                                "url": "https://doi.org/10.1016/j.sigpro.2009.03.025",
                                "title": "Li, W. et al. (2009). Passive Detection of Doctored JPEG Image via Block Artifact Grid Extraction. Signal Processing."
                        }
                ],
                "strengths": "• Định vị cụ thể vùng bị chỉnh sửa\n• Bằng chứng mạnh về nén lại\n• Có thể ước lượng hệ số chất lượng gốc\n• Phương pháp pháp y đã được chứng minh",
                "limitations": "• Chỉ hoạt động trên ảnh JPEG\n• Tốn tài nguyên tính toán (nén lại nhiều lần)\n• Nén lại cùng chất lượng không phát hiện được\n• JPEG AI không bị chỉnh sửa sẽ không có ghost"
        },
        "zh": {
                "useCase": "检测篡改和拼接",
                "mechanism": "以多种质量因子重压缩并测量差异图。",
                "accuracy": "中高 - 78-88%",
                "name": "JPEG幽灵分析",
                "source": "Farid (2009)",
                "algorithm": "双重JPEG压缩检测",
                "parameters": "质量范围: 50-99, 块: 8x8",
                "description": "检测先前JPEG压缩的痕迹。"
        },
        "ja": {
                "useCase": "改ざんとスプライスの検出",
                "mechanism": "複数品質で再圧縮し差分マップを測定。",
                "accuracy": "中-高 - 78-88%",
                "name": "JPEGゴースト分析",
                "source": "Farid (2009)",
                "algorithm": "二重JPEG圧縮検出",
                "parameters": "品質範囲: 50-99, ブロック: 8x8",
                "description": "以前のJPEG圧縮の痕跡を検出。"
        },
        "ko": {
                "useCase": "변조 및 접합 감지",
                "mechanism": "여러 품질로 재압축하여 차이 맵을 측정합니다.",
                "accuracy": "중-높음 - 78-88%",
                "name": "JPEG 고스트 분석",
                "source": "Farid (2009)",
                "algorithm": "이중 JPEG 압축 감지",
                "parameters": "품질 범위: 50-99, 블록: 8x8",
                "description": "이전 JPEG 압축의 흔적을 감지합니다."
        },
        "es": {
                "useCase": "Detectar manipulacion y empalme",
                "mechanism": "Recomprime a multiples factores de calidad.",
                "accuracy": "Medio-Alto - 78-88%",
                "name": "Analisis de fantasma JPEG",
                "source": "Farid (2009)",
                "algorithm": "Deteccion de doble compresion JPEG",
                "parameters": "Rango de calidad: 50-99, Bloque: 8x8",
                "description": "Detecta rastros de compresiones JPEG anteriores."
        },
    },
    "lighting": {
        "en": {
                "useCase": "Verifying physical plausibility of lighting and shadow configurations in images",
                "mechanism": "Estimates light source direction using spherical harmonics decomposition on detected surfaces and objects. Compares estimated lighting vectors across different image regions. AI-generated images often contain physically impossible lighting configurations where shadow directions contradict the apparent light source position.",
                "accuracy": "Moderate - 70-80% on images with clear lighting cues",
                "name": "Illumination Consistency Analysis",
                "source": "Johnson & Farid (2005) - Exposing Digital Forgeries by Detecting Inconsistencies in Lighting, ACM Workshop",
                "algorithm": "Spherical Harmonics Light Direction Estimation",
                "parameters": "Harmonics: order 2 (9 coefficients), Surface normal estimation: shape-from-shading, Light probes: face/object regions, Consistency metric: angular deviation",
                "description": "Estimates light source direction and consistency across image regions. AI images often have physically impossible lighting configurations with inconsistent shadow directions.",
                "strengths": "• Based on physics of light propagation\n• Detects physically impossible scenes\n• Effective for composite image detection\n• Works on both indoor and outdoor scenes",
                "limitations": "• Requires identifiable surfaces for normal estimation\n• Complex scenes with multiple light sources are challenging\n• Diffuse lighting reduces detection accuracy\n• Modern AI models improving at lighting consistency",
                "references": [
                        {
                                "title": "Johnson, M.K. & Farid, H. (2005). Exposing Digital Forgeries by Detecting Inconsistencies in Lighting. ACM Workshop MMS.",
                                "url": "https://doi.org/10.1145/1073170.1073171"
                        },
                        {
                                "title": "Kee, E. et al. (2013). Exposing Digital Photo Manipulation with Inconsistent Shadows. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2501636"
                        }
                ]
        },
        "vi": {
                "useCase": "Xác minh tính hợp lý vật lý của cấu hình chiếu sáng và bóng đổ trong ảnh",
                "mechanism": "Ước lượng hướng nguồn sáng bằng phân tách hài cầu trên các bề mặt và vật thể phát hiện được. So sánh vector chiếu sáng ước lượng qua các vùng ảnh khác nhau. Ảnh AI thường chứa cấu hình chiếu sáng bất khả thi về mặt vật lý.",
                "accuracy": "Trung bình - 70-80% trên ảnh có tín hiệu chiếu sáng rõ ràng",
                "name": "Phân tích nhất quán chiếu sáng",
                "source": "Johnson & Farid (2005) - Vạch trần giả mạo số qua phát hiện sự không nhất quán chiếu sáng, ACM Workshop",
                "algorithm": "Ước lượng hướng sáng Harmonics cầu",
                "parameters": "Hài: bậc 2 (9 hệ số), Ước lượng pháp tuyến bề mặt: shape-from-shading, Đầu dò ánh sáng: vùng khuôn mặt/vật thể, Chỉ số nhất quán: độ lệch góc",
                "description": "Ước lượng hướng nguồn sáng và tính nhất quán giữa các vùng ảnh. Ảnh AI thường có cấu hình chiếu sáng bất khả thi vật lý với hướng đổ bóng mâu thuẫn.",
                "strengths": "• Dựa trên vật lý truyền ánh sáng\n• Phát hiện cảnh bất khả thi vật lý\n• Hiệu quả cho phát hiện ảnh ghép\n• Hoạt động trên cả cảnh trong nhà và ngoài trời",
                "limitations": "• Cần bề mặt nhận dạng được để ước lượng pháp tuyến\n• Cảnh phức tạp với nhiều nguồn sáng là thách thức\n• Ánh sáng khuếch tán giảm độ chính xác phát hiện\n• Mô hình AI hiện đại đang cải thiện tính nhất quán chiếu sáng",
                "references": [
                        {
                                "title": "Johnson, M.K. & Farid, H. (2005). Exposing Digital Forgeries by Detecting Inconsistencies in Lighting. ACM Workshop MMS.",
                                "url": "https://doi.org/10.1145/1073170.1073171"
                        },
                        {
                                "title": "Kee, E. et al. (2013). Exposing Digital Photo Manipulation with Inconsistent Shadows. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2501636"
                        }
                ]
        },
        "zh": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Illumination Consistency Analysis",
                "source": "",
                "algorithm": "Spherical Harmonics Light Direction Estimation",
                "parameters": "",
                "description": "Estimates light source direction and consistency across image regions. AI images often have physically impossible lighting configurations with inconsistent shadow directions.",
                "references": [
                        {
                                "title": "Johnson, M.K. & Farid, H. (2005). Exposing Digital Forgeries by Detecting Inconsistencies in Lighting. ACM Workshop MMS.",
                                "url": "https://doi.org/10.1145/1073170.1073171"
                        },
                        {
                                "title": "Kee, E. et al. (2013). Exposing Digital Photo Manipulation with Inconsistent Shadows. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2501636"
                        }
                ]
        },
        "ja": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Illumination Consistency Analysis",
                "source": "",
                "algorithm": "Spherical Harmonics Light Direction Estimation",
                "parameters": "",
                "description": "Estimates light source direction and consistency across image regions. AI images often have physically impossible lighting configurations with inconsistent shadow directions.",
                "references": [
                        {
                                "title": "Johnson, M.K. & Farid, H. (2005). Exposing Digital Forgeries by Detecting Inconsistencies in Lighting. ACM Workshop MMS.",
                                "url": "https://doi.org/10.1145/1073170.1073171"
                        },
                        {
                                "title": "Kee, E. et al. (2013). Exposing Digital Photo Manipulation with Inconsistent Shadows. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2501636"
                        }
                ]
        },
        "ko": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Illumination Consistency Analysis",
                "source": "",
                "algorithm": "Spherical Harmonics Light Direction Estimation",
                "parameters": "",
                "description": "Estimates light source direction and consistency across image regions. AI images often have physically impossible lighting configurations with inconsistent shadow directions.",
                "references": [
                        {
                                "title": "Johnson, M.K. & Farid, H. (2005). Exposing Digital Forgeries by Detecting Inconsistencies in Lighting. ACM Workshop MMS.",
                                "url": "https://doi.org/10.1145/1073170.1073171"
                        },
                        {
                                "title": "Kee, E. et al. (2013). Exposing Digital Photo Manipulation with Inconsistent Shadows. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2501636"
                        }
                ]
        },
        "es": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Illumination Consistency Analysis",
                "source": "",
                "algorithm": "Spherical Harmonics Light Direction Estimation",
                "parameters": "",
                "description": "Estimates light source direction and consistency across image regions. AI images often have physically impossible lighting configurations with inconsistent shadow directions.",
                "references": [
                        {
                                "title": "Johnson, M.K. & Farid, H. (2005). Exposing Digital Forgeries by Detecting Inconsistencies in Lighting. ACM Workshop MMS.",
                                "url": "https://doi.org/10.1145/1073170.1073171"
                        },
                        {
                                "title": "Kee, E. et al. (2013). Exposing Digital Photo Manipulation with Inconsistent Shadows. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2501636"
                        }
                ]
        },
    },
    "metadata": {
        "en": {
                "name": "Metadata Analysis",
                "description": "Comprehensive examination of EXIF, XMP, and IPTC data embedded in image files to detect signs of AI generation tools. Analyzes camera make/model, GPS coordinates, processing software, creation timestamps, and file structure to verify image authenticity.",
                "algorithm": "Multi-layer EXIF / XMP / IPTC Parser",
                "mechanism": "The metadata analysis system operates in multiple stages:\n\n1. **Data Extraction**: Reads all EXIF (Exchangeable Image File Format), XMP (Extensible Metadata Platform), and IPTC (International Press Telecommunications Council) metadata fields embedded in the image.\n\n2. **Camera Verification**: Examines Make, Model, LensModel fields to verify the capture device. AI images typically lack or contain fabricated camera information.\n\n3. **Software Detection**: Identifies Software, CreatorTool, HistorySoftwareAgent tags containing AI tool names such as 'Stable Diffusion', 'DALL-E', 'Midjourney', 'Adobe Firefly'.\n\n4. **Timestamp Validation**: Cross-references DateTimeOriginal, DateTimeDigitized, ModifyDate to detect temporal anomalies.\n\n5. **GPS Analysis**: Checks GPSLatitude, GPSLongitude — AI images rarely contain authentic GPS coordinates.",
                "parameters": "Primary EXIF fields: Make, Model, Software, GPSLatitude, GPSLongitude, DateTimeOriginal, ColorSpace, ExifVersion, XMP:CreatorTool, XMP:History, IPTC:DigitalSourceType\n\nDetected AI tools: Stable Diffusion, DALL-E, Midjourney, Adobe Firefly, ComfyUI, Automatic1111, InvokeAI\n\nMetadata standards: EXIF 2.32 (JEITA CP-3451), Adobe XMP 2.0, IPTC PMD 2024.1",
                "accuracy": "High - 85-95% when metadata is present and unstripped. However, many social media platforms (Facebook, Twitter, Instagram) automatically strip metadata on upload, reducing effectiveness.",
                "source": "JEITA CP-3451 (Exif Standard 2.32), Adobe XMP Specification Parts 1-3 (ISO 16684), IPTC Photo Metadata Standard 2024.1, C2PA Technical Specification",
                "useCase": "First-pass triage: quickly identifies images with AI software tags, missing authentic camera metadata, or inconsistent metadata. This is the first step in the analysis pipeline due to its speed and low computational cost.",
                "strengths": "• Extremely fast analysis time (< 10ms per image)\n• No pixel decoding required, only reads file headers\n• High accuracy when metadata is intact\n• Can identify specific AI tools through software tags\n• Compliant with international standards (EXIF, XMP, IPTC, C2PA)",
                "limitations": "• Metadata can be easily stripped or forged\n• Many social media platforms auto-strip metadata on upload\n• Cannot detect AI images that have had metadata removed\n• Depends on whether AI tools embed software tags",
                "references": [
                        {
                                "title": "JEITA CP-3451C — Exchangeable Image File Format (Exif) Version 2.32",
                                "url": "https://www.cipa.jp/std/documents/download_e.html?DC-008-Translation-2023-E"
                        },
                        {
                                "title": "Adobe XMP Specification Part 1: Data Model, Serialization, and Core Properties",
                                "url": "https://developer.adobe.com/xmp/docs/"
                        },
                        {
                                "title": "IPTC Photo Metadata Standard 2024.1",
                                "url": "https://iptc.org/standards/photo-metadata/"
                        },
                        {
                                "title": "C2PA Technical Specification — Coalition for Content Provenance and Authenticity",
                                "url": "https://c2pa.org/specifications/specifications/2.0/specs/C2PA_Specification.html"
                        },
                        {
                                "title": "Kee, E. & Farid, H. (2011). A Perceptual Metric for Photo Retouching. PNAS.",
                                "url": "https://doi.org/10.1073/pnas.1110747108"
                        },
                        {
                                "title": "Gloe, T. & Böhme, R. (2010). The Dresden Image Database for Benchmarking Digital Image Forensics. ACM SAC.",
                                "url": "https://doi.org/10.1145/1774088.1774427"
                        }
                ]
        },
        "vi": {
                "name": "Phân tích Metadata",
                "description": "Kiểm tra toàn diện dữ liệu EXIF, XMP và IPTC nhúng trong file ảnh để tìm dấu hiệu của công cụ tạo ảnh AI. Phân tích nhãn hiệu/model máy ảnh, tọa độ GPS, phần mềm xử lý, dấu thời gian tạo, và cấu trúc file để xác định nguồn gốc xác thực của ảnh.",
                "algorithm": "Bộ phân tích đa tầng EXIF / XMP / IPTC",
                "mechanism": "Hệ thống phân tích metadata hoạt động theo nhiều giai đoạn:\n\n1. **Trích xuất dữ liệu**: Đọc tất cả trường metadata EXIF (Exchangeable Image File Format), XMP (Extensible Metadata Platform) và IPTC (International Press Telecommunications Council) nhúng trong ảnh.\n\n2. **Phân tích camera**: Kiểm tra các trường Make, Model, LensModel để xác minh thiết bị chụp. Ảnh AI thường không có hoặc có thông tin camera giả mạo.\n\n3. **Kiểm tra phần mềm**: Phát hiện các thẻ Software, CreatorTool, HistorySoftwareAgent chứa tên công cụ AI như 'Stable Diffusion', 'DALL-E', 'Midjourney', 'Adobe Firefly'.\n\n4. **Xác minh thời gian**: So sánh DateTimeOriginal, DateTimeDigitized, ModifyDate để tìm bất thường thời gian.\n\n5. **Phân tích GPS**: Kiểm tra GPSLatitude, GPSLongitude — ảnh AI hiếm khi có tọa độ GPS xác thực.",
                "parameters": "Các trường EXIF chính: Make, Model, Software, GPSLatitude, GPSLongitude, DateTimeOriginal, ColorSpace, ExifVersion, XMP:CreatorTool, XMP:History, IPTC:DigitalSourceType\n\nCác công cụ AI được phát hiện: Stable Diffusion, DALL-E, Midjourney, Adobe Firefly, ComfyUI, Automatic1111, InvokeAI\n\nTiêu chuẩn metadata: EXIF 2.32 (JEITA CP-3451), Adobe XMP 2.0, IPTC PMD 2024.1",
                "accuracy": "Cao - 85-95% khi metadata có sẵn và chưa bị xóa. Tuy nhiên, nhiều nền tảng mạng xã hội (Facebook, Twitter, Instagram) tự động xóa metadata khi tải lên, làm giảm hiệu quả phương pháp này.",
                "source": "JEITA CP-3451 (Exif Standard 2.32), Adobe XMP Specification Part 1-3 (ISO 16684), IPTC Photo Metadata Standard 2024.1, C2PA (Coalition for Content Provenance and Authenticity) Technical Specification",
                "useCase": "Sàng lọc nhanh ban đầu: xác định ảnh có thẻ phần mềm AI, thiếu metadata camera xác thực, hoặc có metadata không nhất quán. Đây là bước đầu tiên trong quy trình phân tích vì nhanh chóng và chi phí tính toán thấp.",
                "strengths": "• Tốc độ phân tích cực nhanh (< 10ms mỗi ảnh)\n• Không cần giải mã pixel, chỉ đọc header file\n• Độ chính xác cao khi metadata còn nguyên vẹn\n• Có thể phát hiện công cụ AI cụ thể qua thẻ phần mềm\n• Tuân thủ các tiêu chuẩn quốc tế (EXIF, XMP, IPTC, C2PA)",
                "limitations": "• Metadata có thể bị xóa hoặc giả mạo dễ dàng\n• Nhiều mạng xã hội tự động strip metadata khi upload\n• Không phát hiện được ảnh AI đã được xóa metadata\n• Phụ thuộc vào việc công cụ AI có ghi thẻ phần mềm hay không",
                "references": [
                        {
                                "title": "JEITA CP-3451C — Exchangeable Image File Format (Exif) Version 2.32",
                                "url": "https://www.cipa.jp/std/documents/download_e.html?DC-008-Translation-2023-E"
                        },
                        {
                                "title": "Adobe XMP Specification Part 1: Data Model, Serialization, and Core Properties",
                                "url": "https://developer.adobe.com/xmp/docs/"
                        },
                        {
                                "title": "IPTC Photo Metadata Standard 2024.1",
                                "url": "https://iptc.org/standards/photo-metadata/"
                        },
                        {
                                "title": "C2PA Technical Specification — Coalition for Content Provenance and Authenticity",
                                "url": "https://c2pa.org/specifications/specifications/2.0/specs/C2PA_Specification.html"
                        },
                        {
                                "title": "Kee, E. & Farid, H. (2011). A Perceptual Metric for Photo Retouching. Proceedings of the National Academy of Sciences.",
                                "url": "https://doi.org/10.1073/pnas.1110747108"
                        },
                        {
                                "title": "Gloe, T. & Böhme, R. (2010). The Dresden Image Database for Benchmarking Digital Image Forensics. ACM SAC.",
                                "url": "https://doi.org/10.1145/1774088.1774427"
                        }
                ]
        },
        "zh": {
                "name": "Metadata Analysis",
                "description": "Examines EXIF data, file naming patterns, and resolution for signs of AI generation tools. Checks for camera make/model, GPS data, and software markers like Stable Diffusion or DALL-E.",
                "algorithm": "EXIF / XMP / IPTC Parser",
                "mechanism": "Parses embedded metadata fields including camera make/model, GPS coordinates, software tags, creation timestamps, and file structure. AI-generated images typically lack authentic camera metadata or contain telltale software signatures.",
                "parameters": "Fields analyzed: Make, Model, Software, GPS, DateTimeOriginal, ColorSpace, ExifVersion, XMP:CreatorTool",
                "accuracy": "High - 85-95% when metadata is present and unstripped",
                "source": "JEITA CP-3451 (Exif 2.32), Adobe XMP Specification, IPTC Photo Metadata Standard",
                "useCase": "First-pass triage: quickly identifies images with AI software tags or missing camera metadata"
        },
        "ja": {
                "name": "Metadata Analysis",
                "description": "Examines EXIF data, file naming patterns, and resolution for signs of AI generation tools. Checks for camera make/model, GPS data, and software markers like Stable Diffusion or DALL-E.",
                "algorithm": "EXIF / XMP / IPTC Parser",
                "mechanism": "Parses embedded metadata fields including camera make/model, GPS coordinates, software tags, creation timestamps, and file structure. AI-generated images typically lack authentic camera metadata or contain telltale software signatures.",
                "parameters": "Fields analyzed: Make, Model, Software, GPS, DateTimeOriginal, ColorSpace, ExifVersion, XMP:CreatorTool",
                "accuracy": "High - 85-95% when metadata is present and unstripped",
                "source": "JEITA CP-3451 (Exif 2.32), Adobe XMP Specification, IPTC Photo Metadata Standard",
                "useCase": "First-pass triage: quickly identifies images with AI software tags or missing camera metadata"
        },
        "ko": {
                "name": "Metadata Analysis",
                "description": "Examines EXIF data, file naming patterns, and resolution for signs of AI generation tools. Checks for camera make/model, GPS data, and software markers like Stable Diffusion or DALL-E.",
                "algorithm": "EXIF / XMP / IPTC Parser",
                "mechanism": "Parses embedded metadata fields including camera make/model, GPS coordinates, software tags, creation timestamps, and file structure. AI-generated images typically lack authentic camera metadata or contain telltale software signatures.",
                "parameters": "Fields analyzed: Make, Model, Software, GPS, DateTimeOriginal, ColorSpace, ExifVersion, XMP:CreatorTool",
                "accuracy": "High - 85-95% when metadata is present and unstripped",
                "source": "JEITA CP-3451 (Exif 2.32), Adobe XMP Specification, IPTC Photo Metadata Standard",
                "useCase": "First-pass triage: quickly identifies images with AI software tags or missing camera metadata"
        },
        "es": {
                "name": "Analisis de metadatos",
                "description": "Examina datos EXIF, patrones de nombres de archivo y resolucion en busca de signos de herramientas de generacion de IA.",
                "algorithm": "EXIF / XMP / IPTC Parser",
                "mechanism": "Parses embedded metadata fields including camera make/model, GPS coordinates, software tags, creation timestamps, and file structure. AI-generated images typically lack authentic camera metadata or contain telltale software signatures.",
                "parameters": "Fields analyzed: Make, Model, Software, GPS, DateTimeOriginal, ColorSpace, ExifVersion, XMP:CreatorTool",
                "accuracy": "High - 85-95% when metadata is present and unstripped",
                "source": "JEITA CP-3451 (Exif 2.32), Adobe XMP Specification, IPTC Photo Metadata Standard",
                "useCase": "First-pass triage: quickly identifies images with AI software tags or missing camera metadata"
        },
    },
    "noise": {
        "en": {
                "name": "Noise Residual Analysis",
                "description": "Examines high-frequency noise patterns by applying Wiener deconvolution. Real cameras produce characteristic sensor noise that varies across the image, while AI generates unnaturally uniform noise patterns.",
                "algorithm": "Wiener Filter Noise Residual Extraction",
                "mechanism": "The analysis process:\n\n1. **Noise extraction**: Applies Wiener deconvolution filter to separate the noise component from image content.\n\n2. **Local variance mapping**: Computes local noise variance across overlapping blocks to create a noise variance heatmap.\n\n3. **Uniformity analysis**: Real camera noise varies due to sensor manufacturing imperfections (Photo Response Non-Uniformity). AI images lack this variation.\n\n4. **Statistical profiling**: Analyzes noise distribution statistics (kurtosis, skewness) against known camera noise models.",
                "parameters": "Filter: Wiener deconvolution, Window: 5x5\nBlock size: 16x16 with 50% overlap\nNoise model: Gaussian + Poisson (heteroscedastic)\nMetrics: local variance, kurtosis, skewness",
                "accuracy": "High - 82-92%. Most effective when comparing against known camera noise profiles.",
                "source": "Chen et al. (2008) - Determining Image Origin and Integrity Using Sensor Noise, IEEE TIFS",
                "useCase": "Detecting AI images through abnormally uniform noise patterns. Also used for camera source identification and tampering detection.",
                "strengths": "• Robust against content manipulation\n• Camera-specific noise is extremely difficult to forge\n• Works across different image formats\n• Can identify specific camera models",
                "limitations": "• Effectiveness reduced by heavy denoising or compression\n• Requires sufficient image resolution\n• Some AI models now add synthetic noise to evade detection\n• Social media compression degrades noise patterns",
                "references": [
                        {
                                "title": "Chen, M. et al. (2008). Determining Image Origin and Integrity Using Sensor Noise. IEEE TIFS.",
                                "url": "https://doi.org/10.1109/TIFS.2007.916285"
                        },
                        {
                                "title": "Lukas, J., Fridrich, J. & Goljan, M. (2006). Digital Camera Identification from Sensor Pattern Noise. IEEE TIFS.",
                                "url": "https://doi.org/10.1109/TIFS.2006.873602"
                        },
                        {
                                "title": "Cozzolino, D. & Verdoliva, L. (2020). Noiseprint: A CNN-Based Camera Model Fingerprint. IEEE TIFS.",
                                "url": "https://doi.org/10.1109/TIFS.2019.2916364"
                        }
                ]
        },
        "vi": {
                "name": "Nhiễu dư tần cao",
                "description": "Kiểm tra mẫu nhiễu tần cao bằng giải mã Wiener. Máy ảnh thật tạo nhiễu cảm biến đặc trưng biến đổi trên toàn ảnh, trong khi AI tạo nhiễu đồng nhất bất thường.",
                "algorithm": "Trích xuất nhiễu dư bằng bộ lọc Wiener",
                "mechanism": "Áp dụng giải tích chập ngược Wiener để trích xuất thành phần nhiễu tần cao. Ảnh camera thật tạo ra nhiễu cảm biến đặc trưng biến đổi theo vùng, trong khi ảnh AI có mẫu nhiễu đồng nhất hoặc thiếu nhiễu.",
                "parameters": "Bộ lọc: Wiener, Kích thước cửa sổ: 5x5, Phân tích: phương sai nhiễu cục bộ, tính nhất quán",
                "accuracy": "Cao - 82-92%",
                "source": "Chen et al. (2008) - Determining Image Origin and Integrity Using Sensor Noise",
                "useCase": "Phát hiện ảnh AI qua mẫu nhiễu đồng nhất bất thường",
                "strengths": "• Độ chính xác cao (82-92%)\n• Dựa trên đặc tính vật lý cảm biến camera\n• Phát hiện tốt nhiễu tổng hợp đồng nhất\n• Bền vững với nhiều loại nội dung ảnh",
                "limitations": "• Ảnh đã khử nhiễu có thể tạo dương tính giả\n• Nén JPEG nặng phá hủy mẫu nhiễu\n• Cảnh thiếu sáng có nhiễu tự nhiên cao gây nhiễu\n• Một số AI mới đang cải thiện mô phỏng nhiễu"
        },
        "zh": {
                "name": "Noise Residual",
                "description": "Examines high-frequency noise patterns by applying Wiener deconvolution. Real cameras produce characteristic sensor noise that varies across the image, while AI generates unnaturally uniform noise.",
                "algorithm": "High-Frequency Noise Residual Analysis (Wiener Filter)",
                "mechanism": "Extracts the noise residual by applying a Wiener denoising filter. Real photos contain spatially varying sensor noise following Poisson-Gaussian distribution. AI images produce unnaturally uniform noise residuals.",
                "parameters": "Wiener filter: sigma=3, Block size: 8x8, Analysis: noise variance map",
                "accuracy": "High - 80-90% for distinguishing natural vs synthetic noise",
                "source": "Fridrich and Kodovsky (2012), IEEE TIFS",
                "useCase": "Detecting absence of authentic sensor noise patterns in AI-generated images"
        },
        "ja": {
                "name": "Noise Residual",
                "description": "Examines high-frequency noise patterns by applying Wiener deconvolution. Real cameras produce characteristic sensor noise that varies across the image, while AI generates unnaturally uniform noise.",
                "algorithm": "High-Frequency Noise Residual Analysis (Wiener Filter)",
                "mechanism": "Extracts the noise residual by applying a Wiener denoising filter. Real photos contain spatially varying sensor noise following Poisson-Gaussian distribution. AI images produce unnaturally uniform noise residuals.",
                "parameters": "Wiener filter: sigma=3, Block size: 8x8, Analysis: noise variance map",
                "accuracy": "High - 80-90% for distinguishing natural vs synthetic noise",
                "source": "Fridrich and Kodovsky (2012), IEEE TIFS",
                "useCase": "Detecting absence of authentic sensor noise patterns in AI-generated images"
        },
        "ko": {
                "name": "Noise Residual",
                "description": "Examines high-frequency noise patterns by applying Wiener deconvolution. Real cameras produce characteristic sensor noise that varies across the image, while AI generates unnaturally uniform noise.",
                "algorithm": "High-Frequency Noise Residual Analysis (Wiener Filter)",
                "mechanism": "Extracts the noise residual by applying a Wiener denoising filter. Real photos contain spatially varying sensor noise following Poisson-Gaussian distribution. AI images produce unnaturally uniform noise residuals.",
                "parameters": "Wiener filter: sigma=3, Block size: 8x8, Analysis: noise variance map",
                "accuracy": "High - 80-90% for distinguishing natural vs synthetic noise",
                "source": "Fridrich and Kodovsky (2012), IEEE TIFS",
                "useCase": "Detecting absence of authentic sensor noise patterns in AI-generated images"
        },
        "es": {
                "name": "Residuo de ruido",
                "description": "Examina patrones de ruido de alta frecuencia aplicando deconvolucion de Wiener.",
                "algorithm": "High-Frequency Noise Residual Analysis (Wiener Filter)",
                "mechanism": "Extracts the noise residual by applying a Wiener denoising filter. Real photos contain spatially varying sensor noise following Poisson-Gaussian distribution. AI images produce unnaturally uniform noise residuals.",
                "parameters": "Wiener filter: sigma=3, Block size: 8x8, Analysis: noise variance map",
                "accuracy": "High - 80-90% for distinguishing natural vs synthetic noise",
                "source": "Fridrich and Kodovsky (2012), IEEE TIFS",
                "useCase": "Detecting absence of authentic sensor noise patterns in AI-generated images"
        },
    },
    "noiseprint": {
        "en": {
                "useCase": "Camera model identification, source attribution, and AI content verification",
                "mechanism": "Uses a deep neural network (DnCNN) to extract the noise residual of an image, which contains the camera-specific noise pattern. Authentic photos have consistent noise signatures from the imaging sensor, while AI-generated images show synthetic or absent noise patterns.",
                "accuracy": "High - 87-95% for distinguishing camera images from AI-generated content",
                "name": "Noise Print Analysis",
                "source": "Cozzolino & Verdoliva (2020) - Noiseprint: A CNN-Based Camera Model Fingerprint",
                "algorithm": "DnCNN-based Noise Residual Extraction",
                "parameters": "Network: DnCNN-17 layers, Patch size: 64x64, Stride: 32, Correlation metric: normalized cross-correlation",
                "description": "Extracts and analyzes the camera sensor noise pattern (noiseprint) embedded in images. AI-generated images lack authentic sensor noise signatures.",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TIFS.2019.2916364",
                                "title": "Cozzolino, D. & Verdoliva, L. (2020). Noiseprint: A CNN-Based Camera Model Fingerprint. IEEE TIFS."
                        },
                        {
                                "url": "https://doi.org/10.1109/LSP.2020.3008855",
                                "title": "Mandelli, S. et al. (2020). CNN-Based Fast Source Device Identification. IEEE SPL."
                        }
                ],
                "strengths": "• Very high accuracy for camera vs AI distinction\n• Captures camera-specific noise fingerprint\n• Deep learning enhances noise extraction\n• Robust to moderate post-processing",
                "limitations": "• Requires trained DnCNN model\n• Heavy denoising destroys noise patterns\n• Social media compression degrades accuracy\n• New camera models may not be in training data"
        },
        "vi": {
                "useCase": "Nhận dạng model camera, quy kết nguồn, xác minh nội dung AI",
                "mechanism": "Dùng mạng nơ-ron sâu DnCNN trích xuất dư nhiễu chứa mẫu nhiễu đặc trưng camera.",
                "accuracy": "Cao - 87-95%",
                "name": "Phân tích Noise Print",
                "source": "Cozzolino & Verdoliva (2020)",
                "algorithm": "Trích dư nhiễu dựa DnCNN",
                "parameters": "Mạng: DnCNN-17 lớp, Kích thước patch: 64x64, Stride: 32",
                "description": "Trích xuất và phân tích mẫu nhiễu cảm biến camera. Ảnh AI thiếu dấu nhiễu cảm biến xác thực.",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TIFS.2019.2916364",
                                "title": "Cozzolino, D. & Verdoliva, L. (2020). Noiseprint: A CNN-Based Camera Model Fingerprint. IEEE TIFS."
                        },
                        {
                                "url": "https://doi.org/10.1109/LSP.2020.3008855",
                                "title": "Mandelli, S. et al. (2020). CNN-Based Fast Source Device Identification. IEEE SPL."
                        }
                ],
                "strengths": "• Độ chính xác rất cao phân biệt camera vs AI\n• Nắm bắt dấu vân nhiễu đặc trưng camera\n• Học sâu tăng cường trích xuất nhiễu\n• Bền vững với hậu xử lý vừa phải",
                "limitations": "• Cần mô hình DnCNN đã huấn luyện\n• Khử nhiễu nặng phá hủy mẫu nhiễu\n• Nén mạng xã hội giảm độ chính xác\n• Model camera mới có thể không có trong dữ liệu huấn luyện"
        },
        "zh": {
                "useCase": "相机识别和AI内容验证",
                "mechanism": "使用深度网络提取噪声残差。",
                "accuracy": "高 - 87-95%",
                "name": "噪声印记分析",
                "source": "Cozzolino & Verdoliva (2020)",
                "algorithm": "基于DnCNN的噪声提取",
                "parameters": "网络: DnCNN-17层, patch: 64x64",
                "description": "提取并分析相机传感器噪声模式。"
        },
        "ja": {
                "useCase": "カメラ識別とAI検証",
                "mechanism": "深層ネットワークでノイズ残差を抽出。",
                "accuracy": "高 - 87-95%",
                "name": "ノイズプリント分析",
                "source": "Cozzolino & Verdoliva (2020)",
                "algorithm": "DnCNNベースノイズ抽出",
                "parameters": "ネットワーク: DnCNN-17層, パッチ: 64x64",
                "description": "カメラセンサーノイズパターンを分析。"
        },
        "ko": {
                "useCase": "카메라 식별 및 AI 검증",
                "mechanism": "딥러닝으로 노이즈 잔차를 추출합니다.",
                "accuracy": "높음 - 87-95%",
                "name": "노이즈 프린트 분석",
                "source": "Cozzolino & Verdoliva (2020)",
                "algorithm": "DnCNN 기반 노이즈 추출",
                "parameters": "네트워크: DnCNN-17층, 패치: 64x64",
                "description": "카메라 센서 노이즈 패턴을 분석합니다."
        },
        "es": {
                "useCase": "Identificacion de camara y verificacion IA",
                "mechanism": "Usa red neuronal profunda para extraer residuos de ruido.",
                "accuracy": "Alto - 87-95%",
                "name": "Analisis de huella de ruido",
                "source": "Cozzolino & Verdoliva (2020)",
                "algorithm": "Extraccion de ruido basada en DnCNN",
                "parameters": "Red: DnCNN-17 capas, Parche: 64x64",
                "description": "Analiza patrones de ruido del sensor de la camara."
        },
    },
    "patchforensics": {
        "en": {
                "useCase": "Localizing manipulated regions and creating manipulation probability heatmaps",
                "mechanism": "Divides the image into overlapping patches and classifies each independently using a lightweight CNN. Creates a spatial probability map showing manipulation likelihood per region. Aggregates patch-level predictions for an overall assessment. Effective at localizing manipulated regions within an image.",
                "accuracy": "Moderate-High - 80-88% for detecting local manipulations",
                "name": "Patch-based Forensics (CNN)",
                "source": "Chai et al. (2020) - What Makes Fake Images Detectable? Understanding Properties that Generalize, ECCV",
                "algorithm": "Sliding Window CNN Patch Classifier",
                "parameters": "Patch size: 128x128, Stride: 64, CNN: custom lightweight (4 conv layers), Aggregation: mean + max pooling of patch scores",
                "description": "Uses CNN classifiers on small image patches to detect local manipulations. Each patch is independently classified, creating a manipulation probability map.",
                "strengths": "• Provides spatial localization of manipulations\n• Lightweight and fast inference\n• Generalizes across different manipulation types\n• Can detect partial image manipulations",
                "limitations": "• Small patch size may miss global inconsistencies\n• Boundary effects between patches\n• Performance depends on training data diversity\n• May struggle with full-image generation (no local boundaries)",
                "references": [
                        {
                                "title": "Chai, L. et al. (2020). What Makes Fake Images Detectable? Understanding Properties that Generalize. ECCV.",
                                "url": "https://arxiv.org/abs/2008.10588"
                        },
                        {
                                "title": "Wang, S.Y. et al. (2020). CNN-Generated Images Are Surprisingly Easy to Spot...For Now. CVPR.",
                                "url": "https://arxiv.org/abs/1912.11035"
                        }
                ]
        },
        "vi": {
                "useCase": "Định vị vùng bị thao túng và tạo bản đồ nhiệt xác suất thao túng",
                "mechanism": "Chia ảnh thành các mảnh chồng lấp và phân loại từng mảnh độc lập bằng CNN nhẹ. Tạo bản đồ xác suất không gian cho mức thao túng từng vùng. Tổng hợp dự đoán mức mảnh cho đánh giá tổng thể.",
                "accuracy": "Trung bình-Cao - 80-88% cho phát hiện thao túng cục bộ",
                "name": "Pháp y dựa trên mảng (CNN)",
                "source": "Chai et al. (2020) - Điều gì khiến ảnh giả phát hiện được? Hiểu thuộc tính tổng quát hóa, ECCV",
                "algorithm": "Bộ phân loại mảng CNN cửa sổ trượt",
                "parameters": "Kích thước mảnh: 128x128, Bước: 64, CNN: nhẹ tùy chỉnh (4 tầng conv), Tổng hợp: mean + max pooling điểm mảnh",
                "description": "Dùng bộ phân loại CNN trên mảng nhỏ để phát hiện thao tác cục bộ. Mỗi mảng được phân loại độc lập, tạo bản đồ xác suất giả mạo.",
                "strengths": "• Cung cấp định vị không gian của thao túng\n• Nhẹ và suy luận nhanh\n• Tổng quát hóa trên nhiều loại thao túng\n• Phát hiện được thao túng ảnh một phần",
                "limitations": "• Kích thước mảnh nhỏ có thể bỏ sót sự không nhất quán toàn cục\n• Hiệu ứng biên giữa các mảnh\n• Hiệu suất phụ thuộc đa dạng dữ liệu huấn luyện\n• Khó khăn với ảnh AI toàn phần (không có ranh giới cục bộ)",
                "references": [
                        {
                                "title": "Chai, L. et al. (2020). What Makes Fake Images Detectable? Understanding Properties that Generalize. ECCV.",
                                "url": "https://arxiv.org/abs/2008.10588"
                        },
                        {
                                "title": "Wang, S.Y. et al. (2020). CNN-Generated Images Are Surprisingly Easy to Spot...For Now. CVPR.",
                                "url": "https://arxiv.org/abs/1912.11035"
                        }
                ]
        },
        "zh": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Patch-based Forensics (CNN)",
                "source": "",
                "algorithm": "Sliding Window CNN Patch Classifier",
                "parameters": "",
                "description": "Uses CNN classifiers on small image patches to detect local manipulations. Each patch is independently classified, creating a manipulation probability map.",
                "references": [
                        {
                                "title": "Chai, L. et al. (2020). What Makes Fake Images Detectable? Understanding Properties that Generalize. ECCV.",
                                "url": "https://arxiv.org/abs/2008.10588"
                        },
                        {
                                "title": "Wang, S.Y. et al. (2020). CNN-Generated Images Are Surprisingly Easy to Spot...For Now. CVPR.",
                                "url": "https://arxiv.org/abs/1912.11035"
                        }
                ]
        },
        "ja": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Patch-based Forensics (CNN)",
                "source": "",
                "algorithm": "Sliding Window CNN Patch Classifier",
                "parameters": "",
                "description": "Uses CNN classifiers on small image patches to detect local manipulations. Each patch is independently classified, creating a manipulation probability map.",
                "references": [
                        {
                                "title": "Chai, L. et al. (2020). What Makes Fake Images Detectable? Understanding Properties that Generalize. ECCV.",
                                "url": "https://arxiv.org/abs/2008.10588"
                        },
                        {
                                "title": "Wang, S.Y. et al. (2020). CNN-Generated Images Are Surprisingly Easy to Spot...For Now. CVPR.",
                                "url": "https://arxiv.org/abs/1912.11035"
                        }
                ]
        },
        "ko": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Patch-based Forensics (CNN)",
                "source": "",
                "algorithm": "Sliding Window CNN Patch Classifier",
                "parameters": "",
                "description": "Uses CNN classifiers on small image patches to detect local manipulations. Each patch is independently classified, creating a manipulation probability map.",
                "references": [
                        {
                                "title": "Chai, L. et al. (2020). What Makes Fake Images Detectable? Understanding Properties that Generalize. ECCV.",
                                "url": "https://arxiv.org/abs/2008.10588"
                        },
                        {
                                "title": "Wang, S.Y. et al. (2020). CNN-Generated Images Are Surprisingly Easy to Spot...For Now. CVPR.",
                                "url": "https://arxiv.org/abs/1912.11035"
                        }
                ]
        },
        "es": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Patch-based Forensics (CNN)",
                "source": "",
                "algorithm": "Sliding Window CNN Patch Classifier",
                "parameters": "",
                "description": "Uses CNN classifiers on small image patches to detect local manipulations. Each patch is independently classified, creating a manipulation probability map.",
                "references": [
                        {
                                "title": "Chai, L. et al. (2020). What Makes Fake Images Detectable? Understanding Properties that Generalize. ECCV.",
                                "url": "https://arxiv.org/abs/2008.10588"
                        },
                        {
                                "title": "Wang, S.Y. et al. (2020). CNN-Generated Images Are Surprisingly Easy to Spot...For Now. CVPR.",
                                "url": "https://arxiv.org/abs/1912.11035"
                        }
                ]
        },
    },
    "perspective": {
        "en": {
                "useCase": "Detecting geometric inconsistencies and impossible perspectives in AI-generated architectural/scene images",
                "mechanism": "Detects straight lines using Hough Transform and estimates vanishing points from line intersections. Verifies geometric consistency by checking that parallel lines in 3D converge to consistent vanishing points. AI-generated scenes often violate projective geometry rules, creating physically impossible perspectives.",
                "accuracy": "Moderate - 68-78% on images with clear geometric structures",
                "name": "Perspective Geometry Analysis",
                "source": "Farid (2009) - Image Forgery Detection, IEEE Signal Processing Magazine",
                "algorithm": "Hough Transform + Vanishing Point Estimation",
                "parameters": "Line detection: Progressive Probabilistic Hough Transform, Min line length: 50px, Vanishing point: RANSAC estimation, Consistency threshold: 5° angular deviation",
                "description": "Checks geometric consistency of parallel lines, vanishing points, and depth cues. AI-generated scenes often contain perspective distortions that violate projective geometry rules.",
                "strengths": "• Based on projective geometry principles\n• Effective for architectural and urban scenes\n• Detects physically impossible configurations\n• Can identify subtle perspective errors",
                "limitations": "• Requires images with clear linear structures\n• Ineffective for natural scenes without straight lines\n• Curved surfaces may create false positives\n• Wide-angle lens distortion complicates analysis",
                "references": [
                        {
                                "title": "Farid, H. (2009). Image Forgery Detection. IEEE Signal Processing Magazine.",
                                "url": "https://doi.org/10.1109/MSP.2008.931079"
                        },
                        {
                                "title": "Conotter, V. et al. (2014). Physiologically-Based Detection of Computer Generated Faces in Video. IEEE ICIP.",
                                "url": "https://doi.org/10.1109/ICIP.2014.7025339"
                        }
                ]
        },
        "vi": {
                "useCase": "Phát hiện sự không nhất quán hình học và phối cảnh bất khả thi trong ảnh AI kiến trúc/cảnh quan",
                "mechanism": "Phát hiện đường thẳng bằng biến đổi Hough và ước lượng điểm hội tụ từ giao điểm. Xác minh tính nhất quán hình học bằng kiểm tra các đường song song trong 3D hội tụ đến điểm hội tụ nhất quán. Cảnh AI thường vi phạm quy tắc hình học phối cảnh.",
                "accuracy": "Trung bình - 68-78% trên ảnh có cấu trúc hình học rõ ràng",
                "name": "Phân tích hình học phối cảnh",
                "source": "Farid (2009) - Phát hiện giả mạo ảnh, IEEE Signal Processing Magazine",
                "algorithm": "Biến đổi Hough + Ước lượng điểm tụ",
                "parameters": "Phát hiện đường: Biến đổi Hough xác suất, Chiều dài tối thiểu: 50px, Điểm hội tụ: ước lượng RANSAC, Ngưỡng nhất quán: lệch góc 5°",
                "description": "Kiểm tra tính nhất quán hình học đường song song, điểm tụ và tín hiệu chiều sâu. Cảnh AI thường chứa méo phối cảnh vi phạm quy tắc hình học chiếu.",
                "strengths": "• Dựa trên nguyên lý hình học phối cảnh\n• Hiệu quả cho cảnh kiến trúc và đô thị\n• Phát hiện cấu hình bất khả thi vật lý\n• Nhận diện lỗi phối cảnh tinh vi",
                "limitations": "• Cần ảnh có cấu trúc tuyến tính rõ ràng\n• Không hiệu quả cho cảnh tự nhiên không có đường thẳng\n• Bề mặt cong có thể tạo dương tính giả\n• Méo ống kính góc rộng làm phức tạp phân tích",
                "references": [
                        {
                                "title": "Farid, H. (2009). Image Forgery Detection. IEEE Signal Processing Magazine.",
                                "url": "https://doi.org/10.1109/MSP.2008.931079"
                        },
                        {
                                "title": "Conotter, V. et al. (2014). Physiologically-Based Detection of Computer Generated Faces in Video. IEEE ICIP.",
                                "url": "https://doi.org/10.1109/ICIP.2014.7025339"
                        }
                ]
        },
        "zh": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Perspective Geometry Analysis",
                "source": "",
                "algorithm": "Hough Transform + Vanishing Point Estimation",
                "parameters": "",
                "description": "Checks geometric consistency of parallel lines, vanishing points, and depth cues. AI-generated scenes often contain perspective distortions that violate projective geometry rules.",
                "references": [
                        {
                                "title": "Farid, H. (2009). Image Forgery Detection. IEEE Signal Processing Magazine.",
                                "url": "https://doi.org/10.1109/MSP.2008.931079"
                        },
                        {
                                "title": "Conotter, V. et al. (2014). Physiologically-Based Detection of Computer Generated Faces in Video. IEEE ICIP.",
                                "url": "https://doi.org/10.1109/ICIP.2014.7025339"
                        }
                ]
        },
        "ja": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Perspective Geometry Analysis",
                "source": "",
                "algorithm": "Hough Transform + Vanishing Point Estimation",
                "parameters": "",
                "description": "Checks geometric consistency of parallel lines, vanishing points, and depth cues. AI-generated scenes often contain perspective distortions that violate projective geometry rules.",
                "references": [
                        {
                                "title": "Farid, H. (2009). Image Forgery Detection. IEEE Signal Processing Magazine.",
                                "url": "https://doi.org/10.1109/MSP.2008.931079"
                        },
                        {
                                "title": "Conotter, V. et al. (2014). Physiologically-Based Detection of Computer Generated Faces in Video. IEEE ICIP.",
                                "url": "https://doi.org/10.1109/ICIP.2014.7025339"
                        }
                ]
        },
        "ko": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Perspective Geometry Analysis",
                "source": "",
                "algorithm": "Hough Transform + Vanishing Point Estimation",
                "parameters": "",
                "description": "Checks geometric consistency of parallel lines, vanishing points, and depth cues. AI-generated scenes often contain perspective distortions that violate projective geometry rules.",
                "references": [
                        {
                                "title": "Farid, H. (2009). Image Forgery Detection. IEEE Signal Processing Magazine.",
                                "url": "https://doi.org/10.1109/MSP.2008.931079"
                        },
                        {
                                "title": "Conotter, V. et al. (2014). Physiologically-Based Detection of Computer Generated Faces in Video. IEEE ICIP.",
                                "url": "https://doi.org/10.1109/ICIP.2014.7025339"
                        }
                ]
        },
        "es": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Perspective Geometry Analysis",
                "source": "",
                "algorithm": "Hough Transform + Vanishing Point Estimation",
                "parameters": "",
                "description": "Checks geometric consistency of parallel lines, vanishing points, and depth cues. AI-generated scenes often contain perspective distortions that violate projective geometry rules.",
                "references": [
                        {
                                "title": "Farid, H. (2009). Image Forgery Detection. IEEE Signal Processing Magazine.",
                                "url": "https://doi.org/10.1109/MSP.2008.931079"
                        },
                        {
                                "title": "Conotter, V. et al. (2014). Physiologically-Based Detection of Computer Generated Faces in Video. IEEE ICIP.",
                                "url": "https://doi.org/10.1109/ICIP.2014.7025339"
                        }
                ]
        },
    },
    "prnu": {
        "en": {
                "name": "Sensor Pattern Noise (PRNU)",
                "description": "Detects Photo Response Non-Uniformity - a unique fingerprint left by each camera sensor. AI images lack this hardware-based identifier, making it a strong forensic signal.",
                "algorithm": "Photo Response Non-Uniformity (PRNU) Sensor Noise Fingerprint",
                "mechanism": "Extracts unique sensor noise fingerprint from the image. Every camera sensor has unique fixed-pattern noise. AI-generated images lack any authentic PRNU pattern.",
                "parameters": "Denoising: BM3D / wavelet, Correlation: normalized cross-correlation, Threshold: Neyman-Pearson",
                "accuracy": "Low in browser - 55-65% without reference sensor",
                "source": "Lukas et al. (2006), SPIE Image and Video Communications",
                "useCase": "Detecting absence of physical sensor noise fingerprint in AI-generated images",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TIFS.2006.873602",
                                "title": "Lukas, J. et al. (2006). Digital Camera Identification from Sensor Pattern Noise. IEEE TIFS."
                        },
                        {
                                "url": "https://doi.org/10.1109/TIFS.2007.916285",
                                "title": "Chen, M. et al. (2008). Determining Image Origin and Integrity Using Sensor Noise. IEEE TIFS."
                        },
                        {
                                "url": "https://doi.org/10.1117/12.838230",
                                "title": "Goljan, M. et al. (2009). Large Scale Test of Sensor Fingerprint Camera Identification. SPIE."
                        }
                ],
                "strengths": "• Based on unique hardware sensor property\n• Extremely difficult to forge sensor noise\n• Well-established forensic standard\n• Can identify specific camera unit",
                "limitations": "• Browser implementation has reduced accuracy\n• Requires reference sensor fingerprint for best results\n• Heavy processing/compression destroys PRNU\n• Large flat images provide better estimates"
        },
        "vi": {
                "name": "Nhiễu mẫu cảm biến (PRNU)",
                "description": "Phát hiện PRNU — dấu vân tay duy nhất từ mỗi cảm biến máy ảnh. Ảnh AI thiếu định danh phần cứng này, khiến đây là tín hiệu pháp y mạnh.",
                "algorithm": "Trích xuất nhiễu phản hồi ảnh không đồng nhất (PRNU)",
                "mechanism": "Trích xuất dấu vân tay nhiễu cảm biến PRNU bằng cách lấy trung bình nhiều ảnh từ cùng camera. So sánh PRNU trích xuất với mẫu tham chiếu để xác minh nguồn gốc thiết bị.",
                "parameters": "Phương pháp: trích xuất Wiener, Kích thước tham chiếu: ≥50 ảnh, Chỉ số: tương quan chéo chuẩn hóa",
                "accuracy": "Cao - 85-95% khi có mẫu PRNU tham chiếu",
                "source": "Lukáš et al. (2006) - Digital Camera Identification from Sensor Pattern Noise",
                "useCase": "Xác minh nguồn gốc thiết bị camera và phát hiện ảnh AI thiếu dấu vân tay phần cứng",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TIFS.2006.873602",
                                "title": "Lukas, J. et al. (2006). Digital Camera Identification from Sensor Pattern Noise. IEEE TIFS."
                        },
                        {
                                "url": "https://doi.org/10.1109/TIFS.2007.916285",
                                "title": "Chen, M. et al. (2008). Determining Image Origin and Integrity Using Sensor Noise. IEEE TIFS."
                        },
                        {
                                "url": "https://doi.org/10.1117/12.838230",
                                "title": "Goljan, M. et al. (2009). Large Scale Test of Sensor Fingerprint Camera Identification. SPIE."
                        }
                ],
                "strengths": "• Dựa trên thuộc tính phần cứng cảm biến duy nhất\n• Cực kỳ khó giả mạo nhiễu cảm biến\n• Tiêu chuẩn pháp y được thiết lập\n• Có thể nhận dạng đơn vị camera cụ thể",
                "limitations": "• Triển khai trình duyệt có độ chính xác giảm\n• Cần dấu vân cảm biến tham chiếu cho kết quả tốt nhất\n• Xử lý/nén nặng phá hủy PRNU\n• Ảnh phẳng lớn cho ước lượng tốt hơn"
        },
        "zh": {
                "name": "Sensor Pattern Noise (PRNU)",
                "description": "Detects Photo Response Non-Uniformity - a unique fingerprint left by each camera sensor. AI images lack this hardware-based identifier, making it a strong forensic signal.",
                "algorithm": "Photo Response Non-Uniformity (PRNU) Sensor Noise Fingerprint",
                "mechanism": "Extracts unique sensor noise fingerprint from the image. Every camera sensor has unique fixed-pattern noise. AI-generated images lack any authentic PRNU pattern.",
                "parameters": "Denoising: BM3D / wavelet, Correlation: normalized cross-correlation, Threshold: Neyman-Pearson",
                "accuracy": "Low in browser - 55-65% without reference sensor",
                "source": "Lukas et al. (2006), SPIE Image and Video Communications",
                "useCase": "Detecting absence of physical sensor noise fingerprint in AI-generated images"
        },
        "ja": {
                "name": "Sensor Pattern Noise (PRNU)",
                "description": "Detects Photo Response Non-Uniformity - a unique fingerprint left by each camera sensor. AI images lack this hardware-based identifier, making it a strong forensic signal.",
                "algorithm": "Photo Response Non-Uniformity (PRNU) Sensor Noise Fingerprint",
                "mechanism": "Extracts unique sensor noise fingerprint from the image. Every camera sensor has unique fixed-pattern noise. AI-generated images lack any authentic PRNU pattern.",
                "parameters": "Denoising: BM3D / wavelet, Correlation: normalized cross-correlation, Threshold: Neyman-Pearson",
                "accuracy": "Low in browser - 55-65% without reference sensor",
                "source": "Lukas et al. (2006), SPIE Image and Video Communications",
                "useCase": "Detecting absence of physical sensor noise fingerprint in AI-generated images"
        },
        "ko": {
                "name": "Sensor Pattern Noise (PRNU)",
                "description": "Detects Photo Response Non-Uniformity - a unique fingerprint left by each camera sensor. AI images lack this hardware-based identifier, making it a strong forensic signal.",
                "algorithm": "Photo Response Non-Uniformity (PRNU) Sensor Noise Fingerprint",
                "mechanism": "Extracts unique sensor noise fingerprint from the image. Every camera sensor has unique fixed-pattern noise. AI-generated images lack any authentic PRNU pattern.",
                "parameters": "Denoising: BM3D / wavelet, Correlation: normalized cross-correlation, Threshold: Neyman-Pearson",
                "accuracy": "Low in browser - 55-65% without reference sensor",
                "source": "Lukas et al. (2006), SPIE Image and Video Communications",
                "useCase": "Detecting absence of physical sensor noise fingerprint in AI-generated images"
        },
        "es": {
                "name": "Ruido de patron del sensor (PRNU)",
                "description": "Detecta la No-Uniformidad de Respuesta Fotografica, una huella unica dejada por cada sensor de camara.",
                "algorithm": "Photo Response Non-Uniformity (PRNU) Sensor Noise Fingerprint",
                "mechanism": "Extracts unique sensor noise fingerprint from the image. Every camera sensor has unique fixed-pattern noise. AI-generated images lack any authentic PRNU pattern.",
                "parameters": "Denoising: BM3D / wavelet, Correlation: normalized cross-correlation, Threshold: Neyman-Pearson",
                "accuracy": "Low in browser - 55-65% without reference sensor",
                "source": "Lukas et al. (2006), SPIE Image and Video Communications",
                "useCase": "Detecting absence of physical sensor noise fingerprint in AI-generated images"
        },
    },
    "reconstruction": {
        "en": {
                "name": "Multi-scale Reconstruction",
                "description": "Decomposes the image at multiple scales and measures reconstruction error uniformity. AI images show unnaturally uniform errors, while real photos have natural variation.",
                "algorithm": "Multi-Scale Reconstruction Error Analysis",
                "mechanism": "Downscales and reconstructs the image at multiple resolution levels, measuring reconstruction error at each scale. AI images show uniform error, while real photos exhibit natural scale-dependent variation.",
                "parameters": "Scales: [0.5, 0.25, 0.125], Interpolation: bicubic, Metric: MSE + SSIM per scale",
                "accuracy": "Moderate-High - 75-85% across diverse image types",
                "source": "Popescu and Farid (2005), resampling detection",
                "useCase": "Identifying images generated at fixed resolution without natural multi-scale optical properties",
                "strengths": "• Analysis đa tỷ lệ toàn diện\n• Detection tốt tính đồng nhất bất thường của ảnh AI\n• Ít phụ thuộc vào định dạng ảnh\n• Kết hợp tốt với các phương pháp khác",
                "limitations": "• Images thật qua xử lý hậu kỳ mạnh có thể tạo dương tính giả\n• Hiệu quả giảm với Images kích thước nhỏ\n• Độ nhạy phụ thuộc vào số mức phân rã",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TCOM.1983.1095851",
                                "title": "Burt, P.J. & Adelson, E.H. (1983). The Laplacian Pyramid as a Compact Image Code. IEEE Trans. Comm."
                        },
                        {
                                "url": "https://doi.org/10.1109/MSP.2008.931079",
                                "title": "Farid, H. (2009). Image Forgery Detection. IEEE Signal Processing Magazine."
                        },
                        {
                                "url": "https://arxiv.org/abs/1912.11035",
                                "title": "Wang, S.Y. et al. (2020). CNN-generated images are surprisingly easy to spot...for now. CVPR."
                        }
                ]
        },
        "vi": {
                "name": "Tái tạo đa tỷ lệ",
                "description": "Phân tích ảnh ở nhiều tỷ lệ và đo độ đồng nhất của lỗi tái tạo. Ảnh AI có lỗi đồng nhất bất thường, trong khi ảnh thật có biến đổi tự nhiên.",
                "algorithm": "Phân rã kim tự tháp đa tỷ lệ",
                "mechanism": "Xây dựng kim tự tháp Gaussian/Laplacian đa mức và đo sai số tái tạo tại mỗi mức. Ảnh thật có sai số biến đổi tự nhiên, trong khi ảnh AI cho thấy sự đồng nhất bất thường.",
                "parameters": "Số mức: 4-6, Kim tự tháp: Gaussian + Laplacian, Chỉ số: phương sai sai số theo mức",
                "accuracy": "Trung bình-Cao - 78-88%",
                "source": "Burt & Adelson (1983) - The Laplacian Pyramid; ứng dụng pháp y",
                "useCase": "Phát hiện tính đồng nhất bất thường trong cấu trúc đa tỷ lệ của ảnh AI",
                "strengths": "• Phân tích đa tỷ lệ toàn diện\n• Phát hiện tốt tính đồng nhất bất thường của ảnh AI\n• Ít phụ thuộc vào định dạng ảnh\n• Kết hợp tốt với các phương pháp khác",
                "limitations": "• Ảnh thật qua xử lý hậu kỳ mạnh có thể tạo dương tính giả\n• Hiệu quả giảm với ảnh kích thước nhỏ\n• Độ nhạy phụ thuộc vào số mức phân rã",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TCOM.1983.1095851",
                                "title": "Burt, P.J. & Adelson, E.H. (1983). The Laplacian Pyramid as a Compact Image Code. IEEE Trans. Comm."
                        },
                        {
                                "url": "https://doi.org/10.1109/MSP.2008.931079",
                                "title": "Farid, H. (2009). Image Forgery Detection. IEEE Signal Processing Magazine."
                        },
                        {
                                "url": "https://arxiv.org/abs/1912.11035",
                                "title": "Wang, S.Y. et al. (2020). CNN-generated images are surprisingly easy to spot...for now. CVPR."
                        }
                ]
        },
        "zh": {
                "name": "Multi-scale Reconstruction",
                "description": "Decomposes the image at multiple scales and measures reconstruction error uniformity. AI images show unnaturally uniform errors, while real photos have natural variation.",
                "algorithm": "Multi-Scale Reconstruction Error Analysis",
                "mechanism": "Downscales and reconstructs the image at multiple resolution levels, measuring reconstruction error at each scale. AI images show uniform error, while real photos exhibit natural scale-dependent variation.",
                "parameters": "Scales: [0.5, 0.25, 0.125], Interpolation: bicubic, Metric: MSE + SSIM per scale",
                "accuracy": "Moderate-High - 75-85% across diverse image types",
                "source": "Popescu and Farid (2005), resampling detection",
                "useCase": "Identifying images generated at fixed resolution without natural multi-scale optical properties"
        },
        "ja": {
                "name": "Multi-scale Reconstruction",
                "description": "Decomposes the image at multiple scales and measures reconstruction error uniformity. AI images show unnaturally uniform errors, while real photos have natural variation.",
                "algorithm": "Multi-Scale Reconstruction Error Analysis",
                "mechanism": "Downscales and reconstructs the image at multiple resolution levels, measuring reconstruction error at each scale. AI images show uniform error, while real photos exhibit natural scale-dependent variation.",
                "parameters": "Scales: [0.5, 0.25, 0.125], Interpolation: bicubic, Metric: MSE + SSIM per scale",
                "accuracy": "Moderate-High - 75-85% across diverse image types",
                "source": "Popescu and Farid (2005), resampling detection",
                "useCase": "Identifying images generated at fixed resolution without natural multi-scale optical properties"
        },
        "ko": {
                "name": "Multi-scale Reconstruction",
                "description": "Decomposes the image at multiple scales and measures reconstruction error uniformity. AI images show unnaturally uniform errors, while real photos have natural variation.",
                "algorithm": "Multi-Scale Reconstruction Error Analysis",
                "mechanism": "Downscales and reconstructs the image at multiple resolution levels, measuring reconstruction error at each scale. AI images show uniform error, while real photos exhibit natural scale-dependent variation.",
                "parameters": "Scales: [0.5, 0.25, 0.125], Interpolation: bicubic, Metric: MSE + SSIM per scale",
                "accuracy": "Moderate-High - 75-85% across diverse image types",
                "source": "Popescu and Farid (2005), resampling detection",
                "useCase": "Identifying images generated at fixed resolution without natural multi-scale optical properties"
        },
        "es": {
                "name": "Reconstruccion multiescala",
                "description": "Descompone la imagen en multiples escalas y mide la uniformidad del error de reconstruccion.",
                "algorithm": "Multi-Scale Reconstruction Error Analysis",
                "mechanism": "Downscales and reconstructs the image at multiple resolution levels, measuring reconstruction error at each scale. AI images show uniform error, while real photos exhibit natural scale-dependent variation.",
                "parameters": "Scales: [0.5, 0.25, 0.125], Interpolation: bicubic, Metric: MSE + SSIM per scale",
                "accuracy": "Moderate-High - 75-85% across diverse image types",
                "source": "Popescu and Farid (2005), resampling detection",
                "useCase": "Identifying images generated at fixed resolution without natural multi-scale optical properties"
        },
    },
    "reflection": {
        "en": {
                "useCase": "Detecting physically impossible reflections in AI-generated images, especially in eyes and glossy surfaces",
                "mechanism": "Analyzes specular highlights and reflections in eyes, glasses, metallic surfaces, and water for physical consistency. Checks that reflection geometry matches the scene's light source positions and object arrangements. AI models frequently generate physically impossible reflections that violate optical laws.",
                "accuracy": "Moderate - 70-82% on images with visible reflective surfaces",
                "name": "Reflection Consistency Analysis",
                "source": "O'Brien & Farid (2012) - Exposing Photo Manipulation with Inconsistent Reflections, ACM TOMM",
                "algorithm": "Specular Highlight Analysis + Reflection Symmetry Check",
                "parameters": "Detection: specular highlight segmentation, Eye reflection: corneal reflection analysis, Surface: BRDF consistency check, Symmetry: bilateral reflection matching",
                "description": "Examines reflections in eyes, glasses, and surfaces for physical accuracy. AI models frequently generate physically impossible or inconsistent reflections.",
                "strengths": "• Based on physical optics laws\n• Very effective for face/portrait analysis\n• Eye reflections are strong authenticity indicators\n• Detects subtle physical impossibilities",
                "limitations": "• Requires visible reflective surfaces\n• Low-resolution images reduce detection ability\n• Complex scenes with multiple reflections are challenging\n• Not applicable to matte/diffuse surfaces",
                "references": [
                        {
                                "title": "O'Brien, J.F. & Farid, H. (2012). Exposing Photo Manipulation with Inconsistent Reflections. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2382653.2382656"
                        },
                        {
                                "title": "Hu, S. et al. (2021). Exposing GAN-generated Faces Using Inconsistent Corneal Specular Highlights. ICASSP.",
                                "url": "https://doi.org/10.1109/ICASSP39728.2021.9414582"
                        }
                ]
        },
        "vi": {
                "useCase": "Phát hiện phản xạ bất khả thi vật lý trong ảnh AI, đặc biệt trong mắt và bề mặt bóng",
                "mechanism": "Phân tích điểm sáng phản chiếu và phản xạ trong mắt, kính, bề mặt kim loại và nước về tính nhất quán vật lý. Kiểm tra hình học phản xạ khớp với vị trí nguồn sáng và bố trí vật thể trong cảnh.",
                "accuracy": "Trung bình - 70-82% trên ảnh có bề mặt phản xạ rõ ràng",
                "name": "Phân tích nhất quán phản chiếu",
                "source": "O'Brien & Farid (2012) - Vạch trần thao túng ảnh với phản xạ không nhất quán, ACM TOMM",
                "algorithm": "Phân tích vùng sáng chói + Kiểm tra đối xứng phản chiếu",
                "parameters": "Phát hiện: phân đoạn điểm sáng, Phản xạ mắt: phân tích phản xạ giác mạc, Bề mặt: kiểm tra nhất quán BRDF, Đối xứng: so khớp phản xạ hai bên",
                "description": "Kiểm tra phản chiếu trong mắt, kính và bề mặt. Mô hình AI thường tạo phản chiếu bất khả thi hoặc không nhất quán về mặt vật lý.",
                "strengths": "• Dựa trên quy luật quang học vật lý\n• Rất hiệu quả cho phân tích khuôn mặt/chân dung\n• Phản xạ mắt là chỉ báo xác thực mạnh\n• Phát hiện sự bất khả thi vật lý tinh vi",
                "limitations": "• Cần bề mặt phản xạ rõ ràng\n• Ảnh độ phân giải thấp giảm khả năng phát hiện\n• Cảnh phức tạp với nhiều phản xạ là thách thức\n• Không áp dụng cho bề mặt mờ/khuếch tán",
                "references": [
                        {
                                "title": "O'Brien, J.F. & Farid, H. (2012). Exposing Photo Manipulation with Inconsistent Reflections. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2382653.2382656"
                        },
                        {
                                "title": "Hu, S. et al. (2021). Exposing GAN-generated Faces Using Inconsistent Corneal Specular Highlights. ICASSP.",
                                "url": "https://doi.org/10.1109/ICASSP39728.2021.9414582"
                        }
                ]
        },
        "zh": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Reflection Consistency Analysis",
                "source": "",
                "algorithm": "Specular Highlight Analysis + Reflection Symmetry Check",
                "parameters": "",
                "description": "Examines reflections in eyes, glasses, and surfaces for physical accuracy. AI models frequently generate physically impossible or inconsistent reflections.",
                "references": [
                        {
                                "title": "O'Brien, J.F. & Farid, H. (2012). Exposing Photo Manipulation with Inconsistent Reflections. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2382653.2382656"
                        },
                        {
                                "title": "Hu, S. et al. (2021). Exposing GAN-generated Faces Using Inconsistent Corneal Specular Highlights. ICASSP.",
                                "url": "https://doi.org/10.1109/ICASSP39728.2021.9414582"
                        }
                ]
        },
        "ja": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Reflection Consistency Analysis",
                "source": "",
                "algorithm": "Specular Highlight Analysis + Reflection Symmetry Check",
                "parameters": "",
                "description": "Examines reflections in eyes, glasses, and surfaces for physical accuracy. AI models frequently generate physically impossible or inconsistent reflections.",
                "references": [
                        {
                                "title": "O'Brien, J.F. & Farid, H. (2012). Exposing Photo Manipulation with Inconsistent Reflections. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2382653.2382656"
                        },
                        {
                                "title": "Hu, S. et al. (2021). Exposing GAN-generated Faces Using Inconsistent Corneal Specular Highlights. ICASSP.",
                                "url": "https://doi.org/10.1109/ICASSP39728.2021.9414582"
                        }
                ]
        },
        "ko": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Reflection Consistency Analysis",
                "source": "",
                "algorithm": "Specular Highlight Analysis + Reflection Symmetry Check",
                "parameters": "",
                "description": "Examines reflections in eyes, glasses, and surfaces for physical accuracy. AI models frequently generate physically impossible or inconsistent reflections.",
                "references": [
                        {
                                "title": "O'Brien, J.F. & Farid, H. (2012). Exposing Photo Manipulation with Inconsistent Reflections. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2382653.2382656"
                        },
                        {
                                "title": "Hu, S. et al. (2021). Exposing GAN-generated Faces Using Inconsistent Corneal Specular Highlights. ICASSP.",
                                "url": "https://doi.org/10.1109/ICASSP39728.2021.9414582"
                        }
                ]
        },
        "es": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Reflection Consistency Analysis",
                "source": "",
                "algorithm": "Specular Highlight Analysis + Reflection Symmetry Check",
                "parameters": "",
                "description": "Examines reflections in eyes, glasses, and surfaces for physical accuracy. AI models frequently generate physically impossible or inconsistent reflections.",
                "references": [
                        {
                                "title": "O'Brien, J.F. & Farid, H. (2012). Exposing Photo Manipulation with Inconsistent Reflections. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2382653.2382656"
                        },
                        {
                                "title": "Hu, S. et al. (2021). Exposing GAN-generated Faces Using Inconsistent Corneal Specular Highlights. ICASSP.",
                                "url": "https://doi.org/10.1109/ICASSP39728.2021.9414582"
                        }
                ]
        },
    },
    "resnet_classifier": {
        "en": {
                "useCase": "Binary classification of real vs. AI-generated images using deep learning features",
                "mechanism": "Uses a ResNet-50 backbone pre-trained on ImageNet, replacing the final classification layer with a binary real/AI classifier. Global Average Pooling aggregates spatial features before the fully connected layer. Transfer learning enables robust feature extraction from limited forensic training data.",
                "accuracy": "High - 88-95% on in-distribution AI generators",
                "name": "ResNet Binary Classifier",
                "source": "Wang et al. (2020) - CNN-generated Images Are Surprisingly Easy to Spot For Now, CVPR",
                "algorithm": "ResNet-50 + Global Average Pooling + FC Layer",
                "parameters": "Backbone: ResNet-50, Pre-training: ImageNet, FC output: 2 (real/AI), Input: 224x224, Optimizer: Adam, Learning rate: 1e-4",
                "description": "Fine-tuned ResNet-50 deep neural network trained on large-scale real vs. AI-generated image datasets. Uses transfer learning from ImageNet for robust feature extraction.",
                "strengths": "• Strong baseline with high accuracy\n• Benefits from ImageNet pre-training\n• Captures both low-level and high-level features\n• Well-studied architecture with known properties",
                "limitations": "• Generalization to unseen generators is limited\n• Requires retraining for new AI model types\n• Black-box nature limits interpretability\n• Vulnerable to adversarial attacks",
                "references": [
                        {
                                "title": "Wang, S.Y. et al. (2020). CNN-Generated Images Are Surprisingly Easy to Spot...For Now. CVPR.",
                                "url": "https://arxiv.org/abs/1912.11035"
                        },
                        {
                                "title": "He, K. et al. (2016). Deep Residual Learning for Image Recognition. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2016.90"
                        }
                ]
        },
        "vi": {
                "useCase": "Phân loại nhị phân ảnh thật vs AI bằng đặc trưng học sâu",
                "mechanism": "Sử dụng backbone ResNet-50 đã huấn luyện trên ImageNet, thay tầng phân loại cuối bằng bộ phân loại nhị phân thật/AI. Global Average Pooling tổng hợp đặc trưng không gian trước tầng kết nối đầy đủ. Học chuyển giao cho phép trích xuất đặc trưng mạnh mẽ.",
                "accuracy": "Cao - 88-95% trên bộ tạo AI trong phân phối",
                "name": "Bộ phân loại nhị phân ResNet",
                "source": "Wang et al. (2020) - Ảnh tạo bởi CNN dễ phát hiện một cách bất ngờ, CVPR",
                "algorithm": "ResNet-50 + Pooling trung bình toàn cục + Lớp kết nối",
                "parameters": "Backbone: ResNet-50, Tiền huấn luyện: ImageNet, Đầu ra FC: 2 (thật/AI), Đầu vào: 224x224, Tối ưu: Adam, Tốc độ học: 1e-4",
                "description": "Mạng nơ-ron sâu ResNet-50 tinh chỉnh trên tập dữ liệu ảnh thật vs. AI quy mô lớn. Dùng học chuyển giao từ ImageNet để trích xuất đặc trưng bền vững.",
                "strengths": "• Baseline mạnh với độ chính xác cao\n• Hưởng lợi từ tiền huấn luyện ImageNet\n• Nắm bắt cả đặc trưng mức thấp và cao\n• Kiến trúc được nghiên cứu kỹ",
                "limitations": "• Tổng quát hóa sang bộ tạo chưa biết bị hạn chế\n• Cần huấn luyện lại cho loại mô hình AI mới\n• Bản chất hộp đen hạn chế khả năng giải thích\n• Dễ bị tấn công đối kháng",
                "references": [
                        {
                                "title": "Wang, S.Y. et al. (2020). CNN-Generated Images Are Surprisingly Easy to Spot...For Now. CVPR.",
                                "url": "https://arxiv.org/abs/1912.11035"
                        },
                        {
                                "title": "He, K. et al. (2016). Deep Residual Learning for Image Recognition. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2016.90"
                        }
                ]
        },
        "zh": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "ResNet Binary Classifier",
                "source": "",
                "algorithm": "ResNet-50 + Global Average Pooling + FC Layer",
                "parameters": "",
                "description": "Fine-tuned ResNet-50 deep neural network trained on large-scale real vs. AI-generated image datasets. Uses transfer learning from ImageNet for robust feature extraction.",
                "references": [
                        {
                                "title": "Wang, S.Y. et al. (2020). CNN-Generated Images Are Surprisingly Easy to Spot...For Now. CVPR.",
                                "url": "https://arxiv.org/abs/1912.11035"
                        },
                        {
                                "title": "He, K. et al. (2016). Deep Residual Learning for Image Recognition. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2016.90"
                        }
                ]
        },
        "ja": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "ResNet Binary Classifier",
                "source": "",
                "algorithm": "ResNet-50 + Global Average Pooling + FC Layer",
                "parameters": "",
                "description": "Fine-tuned ResNet-50 deep neural network trained on large-scale real vs. AI-generated image datasets. Uses transfer learning from ImageNet for robust feature extraction.",
                "references": [
                        {
                                "title": "Wang, S.Y. et al. (2020). CNN-Generated Images Are Surprisingly Easy to Spot...For Now. CVPR.",
                                "url": "https://arxiv.org/abs/1912.11035"
                        },
                        {
                                "title": "He, K. et al. (2016). Deep Residual Learning for Image Recognition. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2016.90"
                        }
                ]
        },
        "ko": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "ResNet Binary Classifier",
                "source": "",
                "algorithm": "ResNet-50 + Global Average Pooling + FC Layer",
                "parameters": "",
                "description": "Fine-tuned ResNet-50 deep neural network trained on large-scale real vs. AI-generated image datasets. Uses transfer learning from ImageNet for robust feature extraction.",
                "references": [
                        {
                                "title": "Wang, S.Y. et al. (2020). CNN-Generated Images Are Surprisingly Easy to Spot...For Now. CVPR.",
                                "url": "https://arxiv.org/abs/1912.11035"
                        },
                        {
                                "title": "He, K. et al. (2016). Deep Residual Learning for Image Recognition. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2016.90"
                        }
                ]
        },
        "es": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "ResNet Binary Classifier",
                "source": "",
                "algorithm": "ResNet-50 + Global Average Pooling + FC Layer",
                "parameters": "",
                "description": "Fine-tuned ResNet-50 deep neural network trained on large-scale real vs. AI-generated image datasets. Uses transfer learning from ImageNet for robust feature extraction.",
                "references": [
                        {
                                "title": "Wang, S.Y. et al. (2020). CNN-Generated Images Are Surprisingly Easy to Spot...For Now. CVPR.",
                                "url": "https://arxiv.org/abs/1912.11035"
                        },
                        {
                                "title": "He, K. et al. (2016). Deep Residual Learning for Image Recognition. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2016.90"
                        }
                ]
        },
    },
    "shadow": {
        "en": {
                "useCase": "Verifying shadow consistency to detect AI generation or image compositing",
                "mechanism": "Detects shadow edges and estimates shadow direction vectors using gradient analysis. Checks that all shadows in the scene are consistent with a single (or known) light source configuration. AI images frequently produce shadows cast in contradictory directions or with inconsistent softness/hardness.",
                "accuracy": "Moderate - 68-78% on images with clearly visible shadows",
                "name": "Shadow Consistency Analysis",
                "source": "Kee et al. (2013) - Exposing Digital Forgeries from Cast Shadows, ACM TOMM",
                "algorithm": "Shadow Edge Detection + Vanishing Point Analysis",
                "parameters": "Shadow detection: chromaticity-based segmentation, Direction estimation: Radon transform on shadow boundaries, Consistency: pairwise angular comparison, Softness: penumbra width analysis",
                "description": "Analyzes shadow geometry, direction, and softness for physical plausibility. AI models struggle to maintain consistent shadow casting from a single light source.",
                "strengths": "• Physics-based approach with strong theoretical basis\n• Effective for outdoor scenes with clear shadows\n• Complements lighting analysis methods\n• Can detect both AI and manual manipulation",
                "limitations": "• Requires clearly visible shadow regions\n• Overcast/indoor scenes with soft lighting are difficult\n• Multiple light sources complicate analysis\n• Transparent or translucent objects create complex shadows",
                "references": [
                        {
                                "title": "Kee, E. et al. (2013). Exposing Digital Photo Manipulation with Inconsistent Shadows. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2501636"
                        },
                        {
                                "title": "Zhang, W. et al. (2009). Detecting Image Splicing by Illumination Color Estimation. IWDW.",
                                "url": "https://doi.org/10.1007/978-3-642-04438-0_15"
                        }
                ]
        },
        "vi": {
                "useCase": "Xác minh tính nhất quán bóng đổ để phát hiện AI hoặc ghép ảnh",
                "mechanism": "Phát hiện cạnh bóng đổ và ước lượng vector hướng bóng bằng phân tích gradient. Kiểm tra tất cả bóng đổ trong cảnh nhất quán với cấu hình nguồn sáng đơn (hoặc đã biết). Ảnh AI thường tạo bóng đổ theo hướng mâu thuẫn.",
                "accuracy": "Trung bình - 68-78% trên ảnh có bóng đổ rõ ràng",
                "name": "Phân tích nhất quán đổ bóng",
                "source": "Kee et al. (2013) - Vạch trần giả mạo số từ bóng đổ, ACM TOMM",
                "algorithm": "Phát hiện cạnh bóng + Phân tích điểm tụ",
                "parameters": "Phát hiện bóng: phân đoạn dựa trên sắc độ, Ước lượng hướng: biến đổi Radon trên ranh giới bóng, Nhất quán: so sánh góc theo cặp, Độ mềm: phân tích chiều rộng bán bóng",
                "description": "Phân tích hình học, hướng và độ mềm bóng đổ. Mô hình AI gặp khó khăn duy trì bóng đổ nhất quán từ một nguồn sáng duy nhất.",
                "strengths": "• Phương pháp dựa trên vật lý với cơ sở lý thuyết vững\n• Hiệu quả cho cảnh ngoài trời với bóng rõ\n• Bổ sung phương pháp phân tích chiếu sáng\n• Phát hiện cả thao túng AI và thủ công",
                "limitations": "• Cần vùng bóng đổ rõ ràng\n• Cảnh nhiều mây/trong nhà với ánh sáng mềm khó phân tích\n• Nhiều nguồn sáng làm phức tạp phân tích\n• Vật thể trong suốt/bán trong suốt tạo bóng phức tạp",
                "references": [
                        {
                                "title": "Kee, E. et al. (2013). Exposing Digital Photo Manipulation with Inconsistent Shadows. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2501636"
                        },
                        {
                                "title": "Zhang, W. et al. (2009). Detecting Image Splicing by Illumination Color Estimation. IWDW.",
                                "url": "https://doi.org/10.1007/978-3-642-04438-0_15"
                        }
                ]
        },
        "zh": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Shadow Consistency Analysis",
                "source": "",
                "algorithm": "Shadow Edge Detection + Vanishing Point Analysis",
                "parameters": "",
                "description": "Analyzes shadow geometry, direction, and softness for physical plausibility. AI models struggle to maintain consistent shadow casting from a single light source.",
                "references": [
                        {
                                "title": "Kee, E. et al. (2013). Exposing Digital Photo Manipulation with Inconsistent Shadows. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2501636"
                        },
                        {
                                "title": "Zhang, W. et al. (2009). Detecting Image Splicing by Illumination Color Estimation. IWDW.",
                                "url": "https://doi.org/10.1007/978-3-642-04438-0_15"
                        }
                ]
        },
        "ja": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Shadow Consistency Analysis",
                "source": "",
                "algorithm": "Shadow Edge Detection + Vanishing Point Analysis",
                "parameters": "",
                "description": "Analyzes shadow geometry, direction, and softness for physical plausibility. AI models struggle to maintain consistent shadow casting from a single light source.",
                "references": [
                        {
                                "title": "Kee, E. et al. (2013). Exposing Digital Photo Manipulation with Inconsistent Shadows. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2501636"
                        },
                        {
                                "title": "Zhang, W. et al. (2009). Detecting Image Splicing by Illumination Color Estimation. IWDW.",
                                "url": "https://doi.org/10.1007/978-3-642-04438-0_15"
                        }
                ]
        },
        "ko": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Shadow Consistency Analysis",
                "source": "",
                "algorithm": "Shadow Edge Detection + Vanishing Point Analysis",
                "parameters": "",
                "description": "Analyzes shadow geometry, direction, and softness for physical plausibility. AI models struggle to maintain consistent shadow casting from a single light source.",
                "references": [
                        {
                                "title": "Kee, E. et al. (2013). Exposing Digital Photo Manipulation with Inconsistent Shadows. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2501636"
                        },
                        {
                                "title": "Zhang, W. et al. (2009). Detecting Image Splicing by Illumination Color Estimation. IWDW.",
                                "url": "https://doi.org/10.1007/978-3-642-04438-0_15"
                        }
                ]
        },
        "es": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Shadow Consistency Analysis",
                "source": "",
                "algorithm": "Shadow Edge Detection + Vanishing Point Analysis",
                "parameters": "",
                "description": "Analyzes shadow geometry, direction, and softness for physical plausibility. AI models struggle to maintain consistent shadow casting from a single light source.",
                "references": [
                        {
                                "title": "Kee, E. et al. (2013). Exposing Digital Photo Manipulation with Inconsistent Shadows. ACM TOMM.",
                                "url": "https://doi.org/10.1145/2501636"
                        },
                        {
                                "title": "Zhang, W. et al. (2009). Detecting Image Splicing by Illumination Color Estimation. IWDW.",
                                "url": "https://doi.org/10.1007/978-3-642-04438-0_15"
                        }
                ]
        },
    },
    "spectral": {
        "en": {
                "name": "Spectral Nyquist Analysis",
                "description": "Analyzes the frequency spectrum at Nyquist boundaries to detect upsampling artifacts. AI models often produce anomalous spectral peaks at these frequencies that are absent in real photographs, caused by upsampling operations in neural network architectures.",
                "algorithm": "2D Fast Fourier Transform (FFT) Nyquist Boundary Analysis",
                "mechanism": "The analysis process involves several stages:\n\n1. **2D FFT Transform**: Converts the image from spatial domain to frequency domain using 2D Fast Fourier Transform.\n\n2. **High-frequency spectrum analysis**: Examines spectral energy around the Nyquist frequency (f/2). Neural network image generators (GANs, Diffusion models) use upsampling layers (bilinear, nearest-neighbor, transposed convolution) that create characteristic frequency artifacts.\n\n3. **Periodic peak detection**: Identifies periodic energy peaks in the frequency spectrum — a hallmark signature of upsampling in decoder/generator architectures.\n\n4. **Spectral comparison**: Compares the frequency energy distribution against natural spectral models. Camera images have natural high-frequency rolloff due to optics, while AI images show abnormal energy distributions.",
                "parameters": "Transform: 2D FFT (radix-2), Analysis region: Nyquist band ±10%, Metrics: high/low frequency energy ratio, periodic peak coefficient, spectral gradient\n\nAnalysis size: full image + 256x256 blocks\nNormalization: logarithmic spectrum, azimuthal averaging",
                "accuracy": "High - 80-90% for AI images with upsampling artifacts. Particularly effective for GAN-generated images (StyleGAN, ProGAN) due to heavy use of upsampling layers.",
                "source": "Zhang et al. (2019) - Detecting and Simulating Artifacts in GAN Fake Images, Durall et al. (2020) - Watch your Up-Convolution",
                "useCase": "Detection of frequency artifacts from generative networks and upsampling. Especially effective with GAN images and AI-upscaled images.",
                "strengths": "• Effectively detects GAN-specific upsampling artifacts\n• Content-independent analysis\n• Difficult to forge as it relates to fundamental frequency characteristics\n• Works well with uncompressed or lightly compressed images",
                "limitations": "• Effectiveness decreases with heavy JPEG compression\n• Some newer Diffusion models produce fewer spectral artifacts\n• Real images that have been resized may produce false positives\n• Not effective with small images (< 256x256)",
                "references": [
                        {
                                "title": "Zhang, X. et al. (2019). Detecting and Simulating Artifacts in GAN Fake Images. IEEE WIFS.",
                                "url": "https://doi.org/10.1109/WIFS47025.2019.9035107"
                        },
                        {
                                "title": "Durall, R. et al. (2020). Watch your Up-Convolution: CNN Based Generative Deep Neural Networks are Failing to Reproduce Spectral Distributions. CVPR.",
                                "url": "https://arxiv.org/abs/2003.01826"
                        },
                        {
                                "title": "Frank, J. et al. (2020). Leveraging Frequency Analysis for Deep Fake Image Recognition. ICML.",
                                "url": "https://arxiv.org/abs/2003.08685"
                        },
                        {
                                "title": "Dzanic, T. et al. (2020). Fourier Spectrum Discrepancies in Deep Network Generated Images. NeurIPS.",
                                "url": "https://arxiv.org/abs/1911.06465"
                        }
                ]
        },
        "vi": {
                "name": "Phân tích phổ Nyquist",
                "description": "Phân tích phổ tần số tại biên Nyquist để phát hiện lỗi upsampling. Mô hình AI thường tạo đỉnh phổ bất thường tại các tần số Nyquist mà ảnh chụp thật không có, do quá trình upsampling trong kiến trúc mạng nơ-ron.",
                "algorithm": "Phân tích biên Nyquist bằng biến đổi Fourier nhanh (FFT) 2D",
                "mechanism": "Quy trình phân tích gồm các bước:\n\n1. **Biến đổi FFT 2D**: Chuyển ảnh từ miền không gian sang miền tần số bằng biến đổi Fourier nhanh 2D.\n\n2. **Phân tích phổ tần số cao**: Kiểm tra năng lượng phổ quanh tần số Nyquist (f/2). Mạng nơ-ron sinh ảnh (GAN, Diffusion) sử dụng các lớp upsampling (bilinear, nearest-neighbor, transposed convolution) tạo ra hiện vật tần số đặc trưng.\n\n3. **Phát hiện đỉnh chu kỳ**: Tìm các đỉnh năng lượng tuần hoàn trong phổ tần — dấu hiệu đặc trưng của upsampling trong decoder/generator.\n\n4. **So sánh phổ**: Đối chiếu phân bố năng lượng tần số với mô hình phổ tự nhiên. Ảnh camera có suy giảm tần số cao tự nhiên do quang học, trong khi ảnh AI có phân bố năng lượng bất thường.",
                "parameters": "Biến đổi: FFT 2D (radix-2), Vùng phân tích: dải tần Nyquist ±10%, Chỉ số: tỷ lệ năng lượng cao/thấp tần, hệ số đỉnh chu kỳ, gradient phổ\n\nKích thước phân tích: toàn ảnh + khối 256x256\nChuẩn hóa: phổ logarit, trung bình azimuthal",
                "accuracy": "Cao - 80-90% cho ảnh AI có hiện vật upsampling. Hiệu quả đặc biệt với ảnh từ GAN (StyleGAN, ProGAN) do sử dụng nhiều lớp upsampling.",
                "source": "Zhang et al. (2019) - Detecting and Simulating Artifacts in GAN Fake Images, Durall et al. (2020) - Watch your Up-Convolution: CNN Based Generative Deep Neural Networks are Failing to Reproduce Spectral Distributions",
                "useCase": "Phát hiện hiện vật tần số từ mạng sinh ảnh và upsampling. Đặc biệt hiệu quả với ảnh GAN và ảnh đã được phóng đại bằng AI.",
                "strengths": "• Phát hiện hiệu quả hiện vật upsampling đặc trưng của GAN\n• Phân tích không phụ thuộc vào nội dung ảnh\n• Khó giả mạo vì liên quan đến đặc tính tần số cơ bản\n• Hoạt động tốt với ảnh chưa nén hoặc nén nhẹ",
                "limitations": "• Hiệu quả giảm khi ảnh bị nén JPEG mạnh\n• Một số mô hình Diffusion mới ít tạo hiện vật phổ\n• Ảnh thật bị resize cũng có thể tạo dương tính giả\n• Không hiệu quả với ảnh kích thước nhỏ (< 256x256)",
                "references": [
                        {
                                "title": "Zhang, X. et al. (2019). Detecting and Simulating Artifacts in GAN Fake Images. IEEE WIFS.",
                                "url": "https://doi.org/10.1109/WIFS47025.2019.9035107"
                        },
                        {
                                "title": "Durall, R. et al. (2020). Watch your Up-Convolution: CNN Based Generative Deep Neural Networks are Failing to Reproduce Spectral Distributions. CVPR.",
                                "url": "https://arxiv.org/abs/2003.01826"
                        },
                        {
                                "title": "Frank, J. et al. (2020). Leveraging Frequency Analysis for Deep Fake Image Recognition. ICML.",
                                "url": "https://arxiv.org/abs/2003.08685"
                        },
                        {
                                "title": "Dzanic, T. et al. (2020). Fourier Spectrum Discrepancies in Deep Network Generated Images. NeurIPS.",
                                "url": "https://arxiv.org/abs/1911.06465"
                        }
                ]
        },
        "zh": {
                "name": "Spectral Nyquist Analysis",
                "description": "Analyzes the frequency spectrum at Nyquist boundaries to detect upsampling artifacts. AI models often produce spectral peaks at these frequencies that are absent in real photos.",
                "algorithm": "Nyquist Frequency Spectral Analysis (2D FFT)",
                "mechanism": "Applies 2D Fast Fourier Transform to convert the image from spatial domain to frequency domain. AI-generated images exhibit characteristic spectral peaks at Nyquist frequency boundaries due to upsampling operations in generative models.",
                "parameters": "FFT size: adaptive, Window: Hann, Analysis: radial power spectrum, peak detection at f/2",
                "accuracy": "High - 80-90% for GAN-generated images with upsampling artifacts",
                "source": "Durall et al. (2020) Watch your Up-Convolution, CVPR 2020",
                "useCase": "Detecting GAN/diffusion model artifacts from upsampling layers"
        },
        "ja": {
                "name": "Spectral Nyquist Analysis",
                "description": "Analyzes the frequency spectrum at Nyquist boundaries to detect upsampling artifacts. AI models often produce spectral peaks at these frequencies that are absent in real photos.",
                "algorithm": "Nyquist Frequency Spectral Analysis (2D FFT)",
                "mechanism": "Applies 2D Fast Fourier Transform to convert the image from spatial domain to frequency domain. AI-generated images exhibit characteristic spectral peaks at Nyquist frequency boundaries due to upsampling operations in generative models.",
                "parameters": "FFT size: adaptive, Window: Hann, Analysis: radial power spectrum, peak detection at f/2",
                "accuracy": "High - 80-90% for GAN-generated images with upsampling artifacts",
                "source": "Durall et al. (2020) Watch your Up-Convolution, CVPR 2020",
                "useCase": "Detecting GAN/diffusion model artifacts from upsampling layers"
        },
        "ko": {
                "name": "Spectral Nyquist Analysis",
                "description": "Analyzes the frequency spectrum at Nyquist boundaries to detect upsampling artifacts. AI models often produce spectral peaks at these frequencies that are absent in real photos.",
                "algorithm": "Nyquist Frequency Spectral Analysis (2D FFT)",
                "mechanism": "Applies 2D Fast Fourier Transform to convert the image from spatial domain to frequency domain. AI-generated images exhibit characteristic spectral peaks at Nyquist frequency boundaries due to upsampling operations in generative models.",
                "parameters": "FFT size: adaptive, Window: Hann, Analysis: radial power spectrum, peak detection at f/2",
                "accuracy": "High - 80-90% for GAN-generated images with upsampling artifacts",
                "source": "Durall et al. (2020) Watch your Up-Convolution, CVPR 2020",
                "useCase": "Detecting GAN/diffusion model artifacts from upsampling layers"
        },
        "es": {
                "name": "Analisis espectral de Nyquist",
                "description": "Analiza el espectro de frecuencia en los limites de Nyquist para detectar artefactos de sobremuestreo.",
                "algorithm": "Nyquist Frequency Spectral Analysis (2D FFT)",
                "mechanism": "Applies 2D Fast Fourier Transform to convert the image from spatial domain to frequency domain. AI-generated images exhibit characteristic spectral peaks at Nyquist frequency boundaries due to upsampling operations in generative models.",
                "parameters": "FFT size: adaptive, Window: Hann, Analysis: radial power spectrum, peak detection at f/2",
                "accuracy": "High - 80-90% for GAN-generated images with upsampling artifacts",
                "source": "Durall et al. (2020) Watch your Up-Convolution, CVPR 2020",
                "useCase": "Detecting GAN/diffusion model artifacts from upsampling layers"
        },
    },
    "splicing": {
        "en": {
                "useCase": "Detecting composited images, background replacements, and multi-source image assembly",
                "mechanism": "Analyzes transition boundaries between potential spliced regions for unnatural edges, noise level discontinuities, and illumination direction inconsistencies. Uses sliding window approach to segment and compare local image statistics.",
                "accuracy": "Medium - 75-85% depending on splicing quality and post-processing applied",
                "name": "Splicing Detection",
                "source": "Hsu & Chang (2006) - Detecting Image Splicing Using Geometry Invariants and Camera Characteristics",
                "algorithm": "Boundary Artifact Analysis + Noise Inconsistency Map",
                "parameters": "Window size: 64x64, Overlap: 50%, Noise model: Gaussian, Boundary detection: Canny edge with adaptive threshold",
                "description": "Identifies regions spliced from different sources by analyzing boundary inconsistencies, noise levels, and illumination differences across image regions.",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/ICME.2006.262447",
                                "title": "Hsu, Y.F. & Chang, S.F. (2006). Detecting Image Splicing Using Geometry Invariants and Camera Characteristics Consistency. IEEE ICME."
                        },
                        {
                                "url": "https://doi.org/10.1109/ChinaSIP.2013.6625374",
                                "title": "Dong, J. et al. (2013). CASIA Image Tampering Detection Evaluation Database. IEEE ChinaSIP."
                        }
                ],
                "strengths": "• Detects composite images from multiple sources\n• Analyzes both noise and illumination consistency\n• Can localize spliced boundaries\n• Effective for manual image manipulation",
                "limitations": "• Skilled compositing can minimize boundary artifacts\n• Uniform backgrounds reduce detection capability\n• Heavy blur/feathering masks splice boundaries\n• Full-image AI generation has no splice boundaries"
        },
        "vi": {
                "useCase": "Phát hiện ảnh ghép, thay nền và lắp ráp đa nguồn",
                "mechanism": "Phân tích biên chuyển tiếp giữa vùng ghép, phát hiện gián đoạn mức nhiễu và hướng chiếu sáng.",
                "accuracy": "Trung bình - 75-85%",
                "name": "Phát hiện ghép nối",
                "source": "Hsu & Chang (2006)",
                "algorithm": "Phân tích hiện vật biên + Bản đồ nhiễu",
                "parameters": "Kích thước cửa sổ: 64x64, Chồng lấn: 50%, Mô hình nhiễu: Gaussian",
                "description": "Xác định vùng ghép từ nguồn khác bằng phân tích biên, mức nhiễu và chiếu sáng không nhất quán.",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/ICME.2006.262447",
                                "title": "Hsu, Y.F. & Chang, S.F. (2006). Detecting Image Splicing Using Geometry Invariants and Camera Characteristics Consistency. IEEE ICME."
                        },
                        {
                                "url": "https://doi.org/10.1109/ChinaSIP.2013.6625374",
                                "title": "Dong, J. et al. (2013). CASIA Image Tampering Detection Evaluation Database. IEEE ChinaSIP."
                        }
                ],
                "strengths": "• Phát hiện ảnh ghép từ nhiều nguồn\n• Phân tích cả tính nhất quán nhiễu và chiếu sáng\n• Có thể định vị ranh giới ghép\n• Hiệu quả cho thao túng ảnh thủ công",
                "limitations": "• Ghép ảnh khéo có thể giảm thiểu hiện vật ranh giới\n• Nền đồng nhất giảm khả năng phát hiện\n• Làm mờ/feather nặng che ranh giới ghép\n• AI tạo toàn ảnh không có ranh giới ghép"
        },
        "zh": {
                "useCase": "检测合成图像",
                "mechanism": "分析过渡边界的噪声和光照不一致。",
                "accuracy": "中 - 75-85%",
                "name": "拼接检测",
                "source": "Hsu & Chang (2006)",
                "algorithm": "边界伪影分析",
                "parameters": "窗口: 64x64, 重叠: 50%",
                "description": "通过分析边界不一致性识别拼接区域。"
        },
        "ja": {
                "useCase": "合成画像の検出",
                "mechanism": "ノイズと照明の不整合を分析。",
                "accuracy": "中 - 75-85%",
                "name": "スプライシング検出",
                "source": "Hsu & Chang (2006)",
                "algorithm": "境界アーティファクト分析",
                "parameters": "ウィンドウ: 64x64, オーバーラップ: 50%",
                "description": "境界の不整合を分析しスプライス領域を特定。"
        },
        "ko": {
                "useCase": "합성 이미지 감지",
                "mechanism": "노이즈와 조명 불일치를 분석합니다.",
                "accuracy": "중간 - 75-85%",
                "name": "접합 감지",
                "source": "Hsu & Chang (2006)",
                "algorithm": "경계 아티팩트 분석",
                "parameters": "윈도우: 64x64, 오버랩: 50%",
                "description": "경계 불일치를 분석하여 접합 영역을 식별합니다."
        },
        "es": {
                "useCase": "Detectar imagenes compuestas",
                "mechanism": "Analiza inconsistencias de ruido e iluminacion.",
                "accuracy": "Medio - 75-85%",
                "name": "Deteccion de empalme",
                "source": "Hsu & Chang (2006)",
                "algorithm": "Analisis de artefactos de borde",
                "parameters": "Ventana: 64x64, Superposicion: 50%",
                "description": "Identifica regiones empalmadas analizando inconsistencias de bordes."
        },
    },
    "srm_filter": {
        "en": {
                "useCase": "Detecting AI generation artifacts through noise residual analysis using steganalysis techniques",
                "mechanism": "Applies 30 hand-crafted high-pass filters from the Spatial Rich Model to extract noise residuals at different scales and orientations. These residuals capture subtle statistical regularities in the noise domain. A Truncated Linear Unit (TLU) activation constrains residual values, enhancing discrimination between natural sensor noise and synthetic noise patterns.",
                "accuracy": "High - 83-91% for detecting synthetic noise patterns",
                "name": "SRM Filter Analysis",
                "source": "Fridrich & Kodovský (2012) - Rich Models for Steganalysis of Digital Images, IEEE TIFS",
                "algorithm": "30 SRM High-Pass Filters + Truncated Linear Unit",
                "parameters": "Filters: 30 SRM kernels (1st, 2nd, 3rd order), Truncation: T=3, Feature extraction: co-occurrence matrices, Histogram bins: 2T+1=7 per dimension",
                "description": "Applies Spatial Rich Model (SRM) high-pass filters to extract noise residuals. Originally developed for steganalysis, these 30 hand-crafted filters effectively detect AI generation artifacts.",
                "strengths": "• Captures diverse noise patterns with 30 specialized filters\n• Originally proven effective in steganalysis\n• Multi-scale and multi-directional analysis\n• Works well on high-quality images",
                "limitations": "• Computationally intensive with 30 filter passes\n• Heavy compression destroys subtle noise patterns\n• Requires sufficient image resolution\n• Performance varies across different AI architectures",
                "references": [
                        {
                                "title": "Fridrich, J. & Kodovský, J. (2012). Rich Models for Steganalysis of Digital Images. IEEE TIFS.",
                                "url": "https://doi.org/10.1109/TIFS.2012.2190402"
                        },
                        {
                                "title": "Zhou, P. et al. (2018). Learning Rich Features for Image Manipulation Detection. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2018.00116"
                        }
                ]
        },
        "vi": {
                "useCase": "Phát hiện hiện vật AI qua phân tích dư nhiễu sử dụng kỹ thuật phân tích ẩn mã",
                "mechanism": "Áp dụng 30 bộ lọc thông cao thủ công từ Spatial Rich Model để trích xuất dư nhiễu ở nhiều tỷ lệ và hướng. Các dư lượng này nắm bắt các quy luật thống kê tinh vi trong miền nhiễu. Đơn vị tuyến tính cắt (TLU) ràng buộc giá trị dư, tăng cường phân biệt giữa nhiễu cảm biến tự nhiên và nhiễu tổng hợp.",
                "accuracy": "Cao - 83-91% phát hiện mẫu nhiễu tổng hợp",
                "name": "Phân tích bộ lọc SRM",
                "source": "Fridrich & Kodovský (2012) - Mô hình phong phú cho phân tích ẩn mã ảnh số, IEEE TIFS",
                "algorithm": "30 bộ lọc thông cao SRM + Đơn vị tuyến tính cắt",
                "parameters": "Bộ lọc: 30 kernel SRM (bậc 1, 2, 3), Cắt: T=3, Trích xuất đặc trưng: ma trận đồng xuất hiện, Bins histogram: 2T+1=7 mỗi chiều",
                "description": "Áp dụng bộ lọc thông cao Spatial Rich Model (SRM) để trích xuất dư nhiễu. Được phát triển cho phân tích ẩn mã, 30 bộ lọc thủ công này phát hiện hiệu quả hiện vật sinh AI.",
                "strengths": "• Nắm bắt mẫu nhiễu đa dạng với 30 bộ lọc chuyên dụng\n• Đã chứng minh hiệu quả trong phân tích ẩn mã\n• Phân tích đa tỷ lệ và đa hướng\n• Hoạt động tốt trên ảnh chất lượng cao",
                "limitations": "• Tốn tài nguyên tính toán với 30 lần lọc\n• Nén nặng phá hủy mẫu nhiễu tinh vi\n• Cần độ phân giải ảnh đủ lớn\n• Hiệu suất thay đổi theo kiến trúc AI",
                "references": [
                        {
                                "title": "Fridrich, J. & Kodovský, J. (2012). Rich Models for Steganalysis of Digital Images. IEEE TIFS.",
                                "url": "https://doi.org/10.1109/TIFS.2012.2190402"
                        },
                        {
                                "title": "Zhou, P. et al. (2018). Learning Rich Features for Image Manipulation Detection. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2018.00116"
                        }
                ]
        },
        "zh": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "SRM Filter Analysis",
                "source": "",
                "algorithm": "30 SRM High-Pass Filters + Truncated Linear Unit",
                "parameters": "",
                "description": "Applies Spatial Rich Model (SRM) high-pass filters to extract noise residuals. Originally developed for steganalysis, these 30 hand-crafted filters effectively detect AI generation artifacts.",
                "references": [
                        {
                                "title": "Fridrich, J. & Kodovský, J. (2012). Rich Models for Steganalysis of Digital Images. IEEE TIFS.",
                                "url": "https://doi.org/10.1109/TIFS.2012.2190402"
                        },
                        {
                                "title": "Zhou, P. et al. (2018). Learning Rich Features for Image Manipulation Detection. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2018.00116"
                        }
                ]
        },
        "ja": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "SRM Filter Analysis",
                "source": "",
                "algorithm": "30 SRM High-Pass Filters + Truncated Linear Unit",
                "parameters": "",
                "description": "Applies Spatial Rich Model (SRM) high-pass filters to extract noise residuals. Originally developed for steganalysis, these 30 hand-crafted filters effectively detect AI generation artifacts.",
                "references": [
                        {
                                "title": "Fridrich, J. & Kodovský, J. (2012). Rich Models for Steganalysis of Digital Images. IEEE TIFS.",
                                "url": "https://doi.org/10.1109/TIFS.2012.2190402"
                        },
                        {
                                "title": "Zhou, P. et al. (2018). Learning Rich Features for Image Manipulation Detection. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2018.00116"
                        }
                ]
        },
        "ko": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "SRM Filter Analysis",
                "source": "",
                "algorithm": "30 SRM High-Pass Filters + Truncated Linear Unit",
                "parameters": "",
                "description": "Applies Spatial Rich Model (SRM) high-pass filters to extract noise residuals. Originally developed for steganalysis, these 30 hand-crafted filters effectively detect AI generation artifacts.",
                "references": [
                        {
                                "title": "Fridrich, J. & Kodovský, J. (2012). Rich Models for Steganalysis of Digital Images. IEEE TIFS.",
                                "url": "https://doi.org/10.1109/TIFS.2012.2190402"
                        },
                        {
                                "title": "Zhou, P. et al. (2018). Learning Rich Features for Image Manipulation Detection. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2018.00116"
                        }
                ]
        },
        "es": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "SRM Filter Analysis",
                "source": "",
                "algorithm": "30 SRM High-Pass Filters + Truncated Linear Unit",
                "parameters": "",
                "description": "Applies Spatial Rich Model (SRM) high-pass filters to extract noise residuals. Originally developed for steganalysis, these 30 hand-crafted filters effectively detect AI generation artifacts.",
                "references": [
                        {
                                "title": "Fridrich, J. & Kodovský, J. (2012). Rich Models for Steganalysis of Digital Images. IEEE TIFS.",
                                "url": "https://doi.org/10.1109/TIFS.2012.2190402"
                        },
                        {
                                "title": "Zhou, P. et al. (2018). Learning Rich Features for Image Manipulation Detection. CVPR.",
                                "url": "https://doi.org/10.1109/CVPR.2018.00116"
                        }
                ]
        },
    },
    "texture": {
        "en": {
                "name": "Texture Consistency",
                "description": "Measures texture detail variation across image regions. Real photos have naturally varying textures, while AI tends to produce unnaturally consistent texture patterns.",
                "algorithm": "Gray-Level Co-occurrence Matrix (GLCM) Texture Analysis",
                "mechanism": "Computes GLCM texture features across multiple orientations and distances. AI images produce more uniform texture statistics, while real photos show natural spatial variation.",
                "parameters": "Distances: [1, 2, 4], Angles: [0, 45, 90, 135 degrees], Features: contrast, correlation, energy, homogeneity",
                "accuracy": "Moderate - 70-80% for detecting texture uniformity anomalies",
                "source": "Haralick et al. (1973), adapted by Qian et al. (2020)",
                "useCase": "Identifying AI-typical uniform texture patterns",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TPAMI.2002.1017623",
                                "title": "Ojala, T. et al. (2002). Multiresolution Gray-Scale and Rotation Invariant Texture Classification. IEEE TPAMI."
                        },
                        {
                                "url": "https://doi.org/10.1109/CVPR42600.2020.00808",
                                "title": "Liu, Z. et al. (2020). Global Texture Enhancement for Fake Face Detection in the Wild. CVPR."
                        }
                ],
                "strengths": "• Multi-directional texture analysis through GLCM\n• Captures spatial relationships between pixels\n• Effective for detecting uniform AI textures\n• Well-established in image analysis literature",
                "limitations": "• Uniform real surfaces (walls, sky) create false positives\n• Sensitive to image resolution changes\n• Computation increases with number of distance/angle pairs\n• Post-processing can normalize texture features"
        },
        "vi": {
                "name": "Tính nhất quán kết cấu",
                "description": "Đo biến đổi chi tiết kết cấu giữa các vùng ảnh. Ảnh thật có kết cấu biến đổi tự nhiên, trong khi AI tạo mẫu kết cấu đồng nhất bất thường.",
                "algorithm": "Phân tích tính nhất quán kết cấu đa vùng",
                "mechanism": "Trích xuất đặc trưng kết cấu từ nhiều vùng ảnh và so sánh tính biến đổi. Ảnh thật có kết cấu biến đổi tự nhiên theo vùng, trong khi ảnh AI tạo mẫu kết cấu quá đồng nhất.",
                "parameters": "Kích thước khối: 32x32, Đặc trưng: LBP + GLCM, Chỉ số: phương sai kết cấu liên vùng",
                "accuracy": "Trung bình - 70-80%",
                "source": "Ojala et al. (2002) - Multiresolution Gray-Scale and Rotation Invariant Texture Classification",
                "useCase": "Phát hiện tính đồng nhất kết cấu bất thường trong ảnh AI",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TPAMI.2002.1017623",
                                "title": "Ojala, T. et al. (2002). Multiresolution Gray-Scale and Rotation Invariant Texture Classification. IEEE TPAMI."
                        },
                        {
                                "url": "https://doi.org/10.1109/CVPR42600.2020.00808",
                                "title": "Liu, Z. et al. (2020). Global Texture Enhancement for Fake Face Detection in the Wild. CVPR."
                        }
                ],
                "strengths": "• Phân tích kết cấu đa hướng qua GLCM\n• Nắm bắt quan hệ không gian giữa pixel\n• Hiệu quả phát hiện kết cấu AI đồng nhất\n• Được thiết lập trong tài liệu phân tích ảnh",
                "limitations": "• Bề mặt thật đồng nhất (tường, trời) tạo dương tính giả\n• Nhạy cảm với thay đổi độ phân giải\n• Tính toán tăng với số cặp khoảng cách/góc\n• Hậu xử lý có thể chuẩn hóa đặc trưng kết cấu"
        },
        "zh": {
                "name": "Texture Consistency",
                "description": "Measures texture detail variation across image regions. Real photos have naturally varying textures, while AI tends to produce unnaturally consistent texture patterns.",
                "algorithm": "Gray-Level Co-occurrence Matrix (GLCM) Texture Analysis",
                "mechanism": "Computes GLCM texture features across multiple orientations and distances. AI images produce more uniform texture statistics, while real photos show natural spatial variation.",
                "parameters": "Distances: [1, 2, 4], Angles: [0, 45, 90, 135 degrees], Features: contrast, correlation, energy, homogeneity",
                "accuracy": "Moderate - 70-80% for detecting texture uniformity anomalies",
                "source": "Haralick et al. (1973), adapted by Qian et al. (2020)",
                "useCase": "Identifying AI-typical uniform texture patterns"
        },
        "ja": {
                "name": "Texture Consistency",
                "description": "Measures texture detail variation across image regions. Real photos have naturally varying textures, while AI tends to produce unnaturally consistent texture patterns.",
                "algorithm": "Gray-Level Co-occurrence Matrix (GLCM) Texture Analysis",
                "mechanism": "Computes GLCM texture features across multiple orientations and distances. AI images produce more uniform texture statistics, while real photos show natural spatial variation.",
                "parameters": "Distances: [1, 2, 4], Angles: [0, 45, 90, 135 degrees], Features: contrast, correlation, energy, homogeneity",
                "accuracy": "Moderate - 70-80% for detecting texture uniformity anomalies",
                "source": "Haralick et al. (1973), adapted by Qian et al. (2020)",
                "useCase": "Identifying AI-typical uniform texture patterns"
        },
        "ko": {
                "name": "Texture Consistency",
                "description": "Measures texture detail variation across image regions. Real photos have naturally varying textures, while AI tends to produce unnaturally consistent texture patterns.",
                "algorithm": "Gray-Level Co-occurrence Matrix (GLCM) Texture Analysis",
                "mechanism": "Computes GLCM texture features across multiple orientations and distances. AI images produce more uniform texture statistics, while real photos show natural spatial variation.",
                "parameters": "Distances: [1, 2, 4], Angles: [0, 45, 90, 135 degrees], Features: contrast, correlation, energy, homogeneity",
                "accuracy": "Moderate - 70-80% for detecting texture uniformity anomalies",
                "source": "Haralick et al. (1973), adapted by Qian et al. (2020)",
                "useCase": "Identifying AI-typical uniform texture patterns"
        },
        "es": {
                "name": "Consistencia de textura",
                "description": "Mide la variacion de detalle de textura entre regiones de la imagen.",
                "algorithm": "Gray-Level Co-occurrence Matrix (GLCM) Texture Analysis",
                "mechanism": "Computes GLCM texture features across multiple orientations and distances. AI images produce more uniform texture statistics, while real photos show natural spatial variation.",
                "parameters": "Distances: [1, 2, 4], Angles: [0, 45, 90, 135 degrees], Features: contrast, correlation, energy, homogeneity",
                "accuracy": "Moderate - 70-80% for detecting texture uniformity anomalies",
                "source": "Haralick et al. (1973), adapted by Qian et al. (2020)",
                "useCase": "Identifying AI-typical uniform texture patterns"
        },
    },
    "upscaling": {
        "en": {
                "useCase": "Detecting AI-upscaled images, resolution manipulation, and super-resolution processing",
                "mechanism": "Analyzes the frequency spectrum for periodic patterns introduced by interpolation algorithms and AI super-resolution models. Detects the characteristic ringing artifacts, aliasing patterns, and hallucinated high-frequency details produced by upscaling operations.",
                "accuracy": "Medium-High - 80-90% for upscaled images with detectable interpolation artifacts",
                "name": "Upscaling Detection",
                "source": "Popescu & Farid (2005) - Exposing Digital Forgeries by Detecting Traces of Resampling",
                "algorithm": "Resampling Detection + Periodic Pattern Analysis",
                "parameters": "Analysis: 2D FFT periodicity, Interpolation kernels: bilinear/bicubic/Lanczos, AI upscaler signatures: ESRGAN/Real-ESRGAN/SwinIR patterns",
                "description": "Detects super-resolution and upscaling artifacts in images. AI upscalers introduce periodic patterns and hallucinated details detectable through frequency analysis.",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TSP.2004.839932",
                                "title": "Popescu, A.C. & Farid, H. (2005). Exposing Digital Forgeries by Detecting Traces of Resampling. IEEE TSP."
                        },
                        {
                                "url": "https://doi.org/10.1109/CBMI.2005.1490103",
                                "title": "Gallagher, A.C. (2005). Detection of Linear and Cubic Interpolation in JPEG Compressed Images. IEEE ICIVR."
                        }
                ],
                "strengths": "• Detects both traditional and AI upscaling\n• Frequency analysis reveals interpolation patterns\n• Can identify specific upscaling algorithms\n• Effective for detecting resolution manipulation",
                "limitations": "• Advanced AI upscalers minimize detectable artifacts\n• Original high-resolution images show no patterns\n• JPEG compression can mask interpolation artifacts\n• Very slight upscaling is harder to detect"
        },
        "vi": {
                "useCase": "Phát hiện ảnh AI upscale, thao tác độ phân giải",
                "mechanism": "Phân tích phổ tần số tìm mẫu chu kỳ từ thuật toán nội suy và mô hình AI siêu phân giải.",
                "accuracy": "Trung bình-Cao - 80-90%",
                "name": "Phát hiện Upscaling",
                "source": "Popescu & Farid (2005)",
                "algorithm": "Phát hiện tái lấy mẫu + Phân tích mẫu chu kỳ",
                "parameters": "Phân tích: FFT 2D, Nhân nội suy: bilinear/bicubic/Lanczos",
                "description": "Phát hiện hiện vật phóng đại và siêu phân giải. AI upscaler tạo mẫu chu kỳ và chi tiết ảo phát hiện qua phân tích tần số.",
                "references": [
                        {
                                "url": "https://doi.org/10.1109/TSP.2004.839932",
                                "title": "Popescu, A.C. & Farid, H. (2005). Exposing Digital Forgeries by Detecting Traces of Resampling. IEEE TSP."
                        },
                        {
                                "url": "https://doi.org/10.1109/CBMI.2005.1490103",
                                "title": "Gallagher, A.C. (2005). Detection of Linear and Cubic Interpolation in JPEG Compressed Images. IEEE ICIVR."
                        }
                ],
                "strengths": "• Phát hiện cả upscaling truyền thống và AI\n• Phân tích tần số tiết lộ mẫu nội suy\n• Nhận dạng thuật toán upscaling cụ thể\n• Hiệu quả phát hiện thao túng độ phân giải",
                "limitations": "• AI upscaler tiên tiến giảm thiểu hiện vật phát hiện được\n• Ảnh gốc độ phân giải cao không có mẫu\n• Nén JPEG có thể che hiện vật nội suy\n• Upscaling rất nhẹ khó phát hiện hơn"
        },
        "zh": {
                "useCase": "检测AI放大图像",
                "mechanism": "分析频谱中的周期模式。",
                "accuracy": "中高 - 80-90%",
                "name": "放大检测",
                "source": "Popescu & Farid (2005)",
                "algorithm": "重采样检测 + 周期模式分析",
                "parameters": "分析: 2D FFT",
                "description": "检测超分辨率和放大伪影。"
        },
        "ja": {
                "useCase": "AI拡大画像の検出",
                "mechanism": "周波数スペクトルの周期パターンを分析。",
                "accuracy": "中-高 - 80-90%",
                "name": "アップスケーリング検出",
                "source": "Popescu & Farid (2005)",
                "algorithm": "リサンプリング検出",
                "parameters": "分析: 2D FFT",
                "description": "超解像とアップスケーリングアーティファクトを検出。"
        },
        "ko": {
                "useCase": "AI 확대 이미지 감지",
                "mechanism": "주파수 스펙트럼의 주기 패턴을 분석합니다.",
                "accuracy": "중-높음 - 80-90%",
                "name": "업스케일링 감지",
                "source": "Popescu & Farid (2005)",
                "algorithm": "리샘플링 감지",
                "parameters": "분석: 2D FFT",
                "description": "초해상도 및 업스케일링 아티팩트를 감지합니다."
        },
        "es": {
                "useCase": "Detectar imagenes escaladas por IA",
                "mechanism": "Analiza patrones periodicos en el espectro de frecuencia.",
                "accuracy": "Medio-Alto - 80-90%",
                "name": "Deteccion de escalado",
                "source": "Popescu & Farid (2005)",
                "algorithm": "Deteccion de remuestreo",
                "parameters": "Analisis: FFT 2D",
                "description": "Detecta artefactos de superresolucion y escalado."
        },
    },
    "vit_detection": {
        "en": {
                "useCase": "Detecting AI-generated content using global attention patterns that capture both local and long-range artifacts",
                "mechanism": "Divides the image into 16x16 patches and processes them through a Vision Transformer encoder with multi-head self-attention. The attention mechanism captures long-range dependencies and global patterns across the entire image. The [CLS] token output feeds into a classification head for real/AI determination.",
                "accuracy": "High - 88-94% with strong cross-generator generalization",
                "name": "Vision Transformer (ViT) Detection",
                "source": "Dosovitskiy et al. (2021) - An Image is Worth 16x16 Words, ICLR; adapted for forensics by Cocchi et al. (2023)",
                "algorithm": "ViT-Base/16 + Attention Map Analysis",
                "parameters": "Patch size: 16x16, Hidden dim: 768, Attention heads: 12, Layers: 12, Input: 224x224, Classification: MLP head on [CLS] token",
                "description": "Uses Vision Transformer architecture to capture long-range dependencies in images. ViT excels at detecting subtle global patterns that CNNs may miss in AI-generated content.",
                "strengths": "• Captures global image context through self-attention\n• Excellent cross-generator generalization\n• Attention maps provide interpretability\n• Scales well with larger datasets",
                "limitations": "• Requires significant computational resources\n• Large model size and memory footprint\n• Needs large training datasets for optimal performance\n• Patch-based approach may miss sub-patch artifacts",
                "references": [
                        {
                                "title": "Dosovitskiy, A. et al. (2021). An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale. ICLR.",
                                "url": "https://arxiv.org/abs/2010.11929"
                        },
                        {
                                "title": "Cocchi, F. et al. (2023). Unveiling the Impact of Image Transformations on Deepfake Detection. Image and Vision Computing.",
                                "url": "https://doi.org/10.1016/j.imavis.2023.104811"
                        }
                ]
        },
        "vi": {
                "useCase": "Phát hiện nội dung AI sử dụng mẫu chú ý toàn cục nắm bắt hiện vật cục bộ và tầm xa",
                "mechanism": "Chia ảnh thành các mảnh 16x16 và xử lý qua bộ mã hóa Vision Transformer với cơ chế tự chú ý đa đầu. Cơ chế chú ý nắm bắt phụ thuộc tầm xa và mẫu toàn cục trên toàn ảnh. Đầu ra token [CLS] đưa vào đầu phân loại để xác định thật/AI.",
                "accuracy": "Cao - 88-94% với tổng quát hóa tốt giữa các bộ tạo",
                "name": "Phát hiện bằng Vision Transformer (ViT)",
                "source": "Dosovitskiy et al. (2021) - Một ảnh đáng giá 16x16 từ, ICLR; ứng dụng pháp y bởi Cocchi et al. (2023)",
                "algorithm": "ViT-Base/16 + Phân tích bản đồ attention",
                "parameters": "Kích thước mảnh: 16x16, Chiều ẩn: 768, Đầu chú ý: 12, Tầng: 12, Đầu vào: 224x224, Phân loại: đầu MLP trên token [CLS]",
                "description": "Sử dụng kiến trúc Vision Transformer để nắm bắt phụ thuộc tầm xa trong ảnh. ViT vượt trội phát hiện mẫu toàn cục tinh tế mà CNN có thể bỏ sót.",
                "strengths": "• Nắm bắt ngữ cảnh ảnh toàn cục qua tự chú ý\n• Tổng quát hóa xuất sắc giữa các bộ tạo\n• Bản đồ chú ý cung cấp khả năng giải thích\n• Mở rộng tốt với tập dữ liệu lớn hơn",
                "limitations": "• Yêu cầu tài nguyên tính toán đáng kể\n• Kích thước mô hình lớn và chiếm nhiều bộ nhớ\n• Cần tập dữ liệu huấn luyện lớn cho hiệu suất tối ưu\n• Phương pháp dựa trên mảnh có thể bỏ sót hiện vật dưới mảnh",
                "references": [
                        {
                                "title": "Dosovitskiy, A. et al. (2021). An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale. ICLR.",
                                "url": "https://arxiv.org/abs/2010.11929"
                        },
                        {
                                "title": "Cocchi, F. et al. (2023). Unveiling the Impact of Image Transformations on Deepfake Detection. Image and Vision Computing.",
                                "url": "https://doi.org/10.1016/j.imavis.2023.104811"
                        }
                ]
        },
        "zh": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Vision Transformer (ViT) Detection",
                "source": "",
                "algorithm": "ViT-Base/16 + Attention Map Analysis",
                "parameters": "",
                "description": "Uses Vision Transformer architecture to capture long-range dependencies in images. ViT excels at detecting subtle global patterns that CNNs may miss in AI-generated content.",
                "references": [
                        {
                                "title": "Dosovitskiy, A. et al. (2021). An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale. ICLR.",
                                "url": "https://arxiv.org/abs/2010.11929"
                        },
                        {
                                "title": "Cocchi, F. et al. (2023). Unveiling the Impact of Image Transformations on Deepfake Detection. Image and Vision Computing.",
                                "url": "https://doi.org/10.1016/j.imavis.2023.104811"
                        }
                ]
        },
        "ja": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Vision Transformer (ViT) Detection",
                "source": "",
                "algorithm": "ViT-Base/16 + Attention Map Analysis",
                "parameters": "",
                "description": "Uses Vision Transformer architecture to capture long-range dependencies in images. ViT excels at detecting subtle global patterns that CNNs may miss in AI-generated content.",
                "references": [
                        {
                                "title": "Dosovitskiy, A. et al. (2021). An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale. ICLR.",
                                "url": "https://arxiv.org/abs/2010.11929"
                        },
                        {
                                "title": "Cocchi, F. et al. (2023). Unveiling the Impact of Image Transformations on Deepfake Detection. Image and Vision Computing.",
                                "url": "https://doi.org/10.1016/j.imavis.2023.104811"
                        }
                ]
        },
        "ko": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Vision Transformer (ViT) Detection",
                "source": "",
                "algorithm": "ViT-Base/16 + Attention Map Analysis",
                "parameters": "",
                "description": "Uses Vision Transformer architecture to capture long-range dependencies in images. ViT excels at detecting subtle global patterns that CNNs may miss in AI-generated content.",
                "references": [
                        {
                                "title": "Dosovitskiy, A. et al. (2021). An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale. ICLR.",
                                "url": "https://arxiv.org/abs/2010.11929"
                        },
                        {
                                "title": "Cocchi, F. et al. (2023). Unveiling the Impact of Image Transformations on Deepfake Detection. Image and Vision Computing.",
                                "url": "https://doi.org/10.1016/j.imavis.2023.104811"
                        }
                ]
        },
        "es": {
                "useCase": "",
                "mechanism": "",
                "accuracy": "",
                "name": "Vision Transformer (ViT) Detection",
                "source": "",
                "algorithm": "ViT-Base/16 + Attention Map Analysis",
                "parameters": "",
                "description": "Uses Vision Transformer architecture to capture long-range dependencies in images. ViT excels at detecting subtle global patterns that CNNs may miss in AI-generated content.",
                "references": [
                        {
                                "title": "Dosovitskiy, A. et al. (2021). An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale. ICLR.",
                                "url": "https://arxiv.org/abs/2010.11929"
                        },
                        {
                                "title": "Cocchi, F. et al. (2023). Unveiling the Impact of Image Transformations on Deepfake Detection. Image and Vision Computing.",
                                "url": "https://doi.org/10.1016/j.imavis.2023.104811"
                        }
                ]
        },
    },
    "wavelet": {
        "en": {
                "useCase": "Detecting AI-generated textures, frequency domain manipulation, and model-specific artifacts",
                "mechanism": "Applies multi-level DWT decomposition and analyzes statistical properties of detail coefficients (LH, HL, HH sub-bands). AI-generated images exhibit different energy distributions and coefficient correlations in wavelet domain.",
                "accuracy": "High - 85-92% for detecting GAN and diffusion model outputs",
                "name": "Wavelet Analysis",
                "source": "Li et al. (2018) - Wavelet-based Image Forensics Using Statistical Moments",
                "algorithm": "Discrete Wavelet Transform (DWT) + Sub-band Statistics",
                "parameters": "Wavelet: Daubechies-4, Levels: 3-5, Sub-bands: LH/HL/HH, Metrics: energy, variance, kurtosis per sub-band",
                "description": "Decomposes the image using wavelet transforms to analyze frequency sub-bands. AI models leave characteristic patterns in high-frequency wavelet coefficients.",
                "references": [
                        {
                                "url": "https://doi.org/10.23919/APSIPA.2018.8659748",
                                "title": "Li, H. et al. (2018). Can Forensic Detectors Identify GAN Generated Images? APSIPA ASC."
                        },
                        {
                                "url": "https://doi.org/10.1109/34.192463",
                                "title": "Mallat, S. (1989). A Theory for Multiresolution Signal Decomposition. IEEE TPAMI."
                        }
                ],
                "strengths": "• Multi-scale frequency analysis\n• High accuracy for GAN and diffusion models\n• Captures energy distribution anomalies\n• Well-established signal processing technique",
                "limitations": "• Requires sufficient image resolution\n• Heavy JPEG compression affects wavelet coefficients\n• Computational cost increases with decomposition levels\n• Performance varies across different AI architectures"
        },
        "vi": {
                "useCase": "Phát hiện kết cấu AI, thao tác miền tần số",
                "mechanism": "Phân rã DWT đa mức và phân tích thuộc tính thống kê của hệ số chi tiết LH, HL, HH.",
                "accuracy": "Cao - 85-92%",
                "name": "Phân tích Wavelet",
                "source": "Li et al. (2018)",
                "algorithm": "DWT + Thống kê dải con",
                "parameters": "Wavelet: Daubechies-4, Mức: 3-5, Dải con: LH/HL/HH",
                "description": "Phân rã ảnh bằng biến đổi wavelet để phân tích dải tần con. Mô hình AI để lại mẫu đặc trưng trong hệ số wavelet tần cao.",
                "references": [
                        {
                                "url": "https://doi.org/10.23919/APSIPA.2018.8659748",
                                "title": "Li, H. et al. (2018). Can Forensic Detectors Identify GAN Generated Images? APSIPA ASC."
                        },
                        {
                                "url": "https://doi.org/10.1109/34.192463",
                                "title": "Mallat, S. (1989). A Theory for Multiresolution Signal Decomposition. IEEE TPAMI."
                        }
                ],
                "strengths": "• Phân tích tần số đa tỷ lệ\n• Độ chính xác cao cho mô hình GAN và khuếch tán\n• Nắm bắt bất thường phân bố năng lượng\n• Kỹ thuật xử lý tín hiệu được thiết lập",
                "limitations": "• Cần độ phân giải ảnh đủ lớn\n• Nén JPEG nặng ảnh hưởng hệ số wavelet\n• Chi phí tính toán tăng với cấp phân tách\n• Hiệu suất thay đổi theo kiến trúc AI"
        },
        "zh": {
                "useCase": "检测AI纹理和频域操纵",
                "mechanism": "多级DWT分解分析细节系数。",
                "accuracy": "高 - 85-92%",
                "name": "小波分析",
                "source": "Li et al. (2018)",
                "algorithm": "DWT + 子带统计",
                "parameters": "小波: Daubechies-4, 级别: 3-5",
                "description": "用小波变换分解图像分析频率子带。"
        },
        "ja": {
                "useCase": "AIテクスチャ検出",
                "mechanism": "多レベルDWT分解で詳細係数を分析。",
                "accuracy": "高 - 85-92%",
                "name": "ウェーブレット分析",
                "source": "Li et al. (2018)",
                "algorithm": "DWT + サブバンド統計",
                "parameters": "ウェーブレット: Daubechies-4, レベル: 3-5",
                "description": "ウェーブレット変換で周波数サブバンドを分析。"
        },
        "ko": {
                "useCase": "AI 텍스처 감지",
                "mechanism": "다중 레벨 DWT 분해로 상세 계수를 분석합니다.",
                "accuracy": "높음 - 85-92%",
                "name": "웨이블릿 분석",
                "source": "Li et al. (2018)",
                "algorithm": "DWT + 서브밴드 통계",
                "parameters": "웨이블릿: Daubechies-4, 레벨: 3-5",
                "description": "웨이블릿 변환으로 주파수 서브밴드를 분석합니다."
        },
        "es": {
                "useCase": "Detectar texturas IA",
                "mechanism": "Descomposicion DWT multinivel.",
                "accuracy": "Alto - 85-92%",
                "name": "Analisis wavelet",
                "source": "Li et al. (2018)",
                "algorithm": "DWT + Estadisticas de subbanda",
                "parameters": "Wavelet: Daubechies-4, Niveles: 3-5",
                "description": "Descompone la imagen con transformada wavelet para analizar subbandas."
        },
    },
};

export const ALL_METHOD_SLUGS = Object.keys(METHOD_PAGE_DATA);
