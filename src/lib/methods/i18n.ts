/**
 * Method Translations — All analysis method i18n keys
 * Tách riêng khỏi file i18n chung (en.json, vi.json)
 * Mỗi method tự quản lý tên và mô tả của mình
 */

export type MethodTranslations = Record<string, Record<string, string>>;

export const methodTranslations: MethodTranslations = {
    en: {
        // === Original 13 Methods ===
        "signal.metadataAnalysis": "Metadata Analysis",
        "signal.metadata.inconclusive": "Metadata analysis inconclusive",
        "signal.metadata.aiDetected": "AI generation software detected in file metadata",
        "signal.metadata.cameraDetected": "Real camera signature detected in metadata",
        "signal.metadata.namingPattern": "File naming pattern suggests AI generation",
        "signal.metadata.aiResolution": "Resolution matches common AI output dimensions",

        "signal.spectralNyquist": "Spectral Nyquist Analysis",
        "signal.spectral.ai": "Spectral peaks at Nyquist frequencies detected — characteristic of AI upsampling artifacts",
        "signal.spectral.real": "Spectral distribution is smooth — consistent with natural photography",

        "signal.multiScaleReconstruction": "Multi-scale Reconstruction",
        "signal.reconstruction.ai": "Reconstruction errors are unnaturally uniform — typical of AI-generated content",
        "signal.reconstruction.real": "Reconstruction shows natural variation — consistent with real photography",

        "signal.noiseResidual": "Noise Residual",
        "signal.noiseUniformity": "Noise Uniformity",
        "signal.noise.ai": "Noise pattern is unusually uniform — common in AI-generated images",
        "signal.noise.real": "Noise varies naturally across the image — consistent with real photography",
        "signal.noise.error": "Insufficient data for noise analysis",

        "signal.edgeCoherence": "Edge Coherence",
        "signal.edge.ai": "Edge patterns are unusually smooth — may indicate AI generation",
        "signal.edge.real": "Edge patterns show natural variation — consistent with real content",

        "signal.gradientSmoothness": "Gradient Micro-Texture",
        "signal.gradient.ai": "Smooth regions lack natural micro-texture — AI images miss sensor-level noise",
        "signal.gradient.real": "Smooth regions contain natural micro-texture from camera sensor",

        "signal.benfordsLaw": "Benford's Law",
        "signal.benford.ai": "Pixel gradients deviate from Benford's Law — characteristic of AI generation",
        "signal.benford.real": "Pixel gradients follow natural statistical distribution",

        "signal.chromaticAberration": "Chromatic Aberration",
        "signal.chromatic.ai": "No chromatic aberration — real camera lenses produce color fringing",
        "signal.chromatic.real": "Chromatic aberration present — consistent with real camera optics",

        "signal.textureConsistency": "Texture Consistency",
        "signal.texture.ai": "Texture detail is unusually consistent across regions — may indicate AI",
        "signal.texture.real": "Texture detail varies naturally across the image",

        "signal.cfaPattern": "CFA Pattern Detection",
        "signal.cfa.ai": "No Bayer CFA demosaicing pattern found — real cameras leave this fingerprint",
        "signal.cfa.real": "CFA demosaicing artifacts present — characteristic of real camera sensors",

        "signal.videoProperties": "Video Properties",
        "signal.video.analysis": "Video analysis",
        "signal.video.short": "Very short video — common in AI video generation",
        "signal.video.long": "Long video — less likely to be fully AI-generated",

        "signal.dctBlock": "DCT Block Artifacts",
        "signal.dct.ai": "No or uniform JPEG block artifacts — AI images lack natural compression fingerprints",
        "signal.dct.real": "Natural JPEG block artifacts present — consistent with real camera compression",
        "signal.dct.error": "Image too small for DCT analysis",

        "signal.colorCorrelation": "Color Channel Correlation",
        "signal.colorDistribution": "Color Distribution",
        "signal.frequencyAnalysis": "Frequency Analysis",
        "signal.compressionAnalysis": "Compression Analysis",
        "signal.symmetryPatterns": "Symmetry Patterns",
        "signal.color.ai": "Color channel correlations are abnormal — AI generates color channels differently than natural light",
        "signal.color.real": "Color channels correlate naturally — consistent with camera sensor and optics",
        "signal.color.error": "Insufficient data for color channel analysis",

        "signal.prnuPattern": "Sensor Pattern Noise",
        "signal.prnu.ai": "No consistent sensor pattern noise detected — AI images lack camera PRNU fingerprint",
        "signal.prnu.real": "Sensor pattern noise detected — consistent with real camera PRNU fingerprint",
        "signal.prnu.error": "Insufficient data for PRNU analysis",

        // === Spatial Domain (6) ===
        "signal.localBinaryPattern": "Local Binary Pattern",
        "signal.lbp.ai": "LBP texture patterns lack diversity — characteristic of AI-generated surfaces",
        "signal.lbp.real": "LBP texture shows natural diversity — consistent with real photography",

        "signal.hogAnomaly": "HOG Anomaly",
        "signal.hog.ai": "Gradient orientations are unusually uniform — typical of AI generation",
        "signal.hog.real": "Gradient orientations show natural variation — consistent with real scenes",

        "signal.glcmTexture": "GLCM Texture",
        "signal.glcm.ai": "GLCM features indicate overly smooth texture — typical of AI generation",
        "signal.glcm.real": "GLCM texture features are consistent with natural image characteristics",

        "signal.localVarianceMap": "Local Variance Map",
        "signal.localVariance.ai": "Local variance is unusually uniform — AI images lack natural variance variation",
        "signal.localVariance.real": "Local variance varies naturally across the image — consistent with real capture",
        "signal.localVariance.error": "Insufficient data for local variance analysis",

        "signal.morphGradient": "Morphological Gradient",
        "signal.morph.ai": "Morphological gradients are too narrow — AI images lack micro-detail transitions",
        "signal.morph.real": "Morphological gradients show natural range — consistent with real camera capture",
        "signal.morph.error": "Insufficient data for morphological analysis",

        "signal.weberDescriptor": "Weber Descriptor",
        "signal.weber.ai": "Weber excitation is unusually low — AI images lack natural intensity transitions",
        "signal.weber.real": "Weber excitation shows natural variation — consistent with real image detail",
        "signal.weber.error": "Insufficient data for Weber analysis",

        // === Frequency Domain (6) ===
        "signal.waveletStats": "Wavelet Statistics",
        "signal.wavelet.ai": "Wavelet coefficients show Gaussian distribution — AI images lack natural heavy-tailed statistics",
        "signal.wavelet.real": "Wavelet coefficients show natural heavy-tailed distribution — consistent with real images",

        "signal.gaborResponse": "Gabor Response",
        "signal.gabor.ai": "Gabor filter shows isotropic response — AI images lack directional texture variation",
        "signal.gabor.real": "Gabor filter response shows natural directional variation in texture",
        "signal.gabor.error": "Insufficient data for Gabor analysis",

        "signal.psdSlope": "PSD Slope Analysis",
        "signal.psd.ai": "Power spectral density deviates from natural 1/f² law — potential AI generation",
        "signal.psd.real": "Power spectral density follows natural 1/f² power law — consistent with real images",

        "signal.phaseCongruency": "Phase Congruency",
        "signal.phase.ai": "Phase congruency is overly uniform — AI images have artificial edge structure",
        "signal.phase.real": "Phase congruency varies naturally — consistent with real scene geometry",
        "signal.phase.error": "Insufficient data for phase congruency analysis",

        "signal.radialSpectrum": "Radial Spectrum",
        "signal.radial.ai": "Radial power spectrum shows atypical frequency distribution — potential AI signature",
        "signal.radial.real": "Radial power spectrum shows natural frequency falloff — consistent with camera optics",
        "signal.radial.error": "Insufficient data for radial spectrum analysis",

        "signal.freqBandRatio": "Frequency Band Ratio",
        "signal.freqBand.ai": "High-frequency energy is unusually low — AI images lack fine detail",
        "signal.freqBand.real": "Frequency band distribution is natural — consistent with real camera capture",

        // === Statistical (6) ===
        "signal.entropyMap": "Entropy Map",
        "signal.entropy.ai": "Entropy distribution is too uniform — AI images lack natural information variation",
        "signal.entropy.real": "Entropy distribution varies naturally — consistent with real scene content",
        "signal.entropy.error": "Insufficient data for entropy analysis",

        "signal.higherOrderStats": "Higher-Order Statistics",
        "signal.hos.ai": "Gradient statistics are too Gaussian — natural images have heavier-tailed distributions",
        "signal.hos.real": "Gradient statistics show natural heavy-tailed distribution",
        "signal.hos.error": "Insufficient data for HOS analysis",

        "signal.zipfLaw": "Zipf's Law",
        "signal.zipf.ai": "Intensity distribution deviates from Zipf's law — potential AI generation artifact",
        "signal.zipf.real": "Intensity distribution follows natural Zipf-like pattern",
        "signal.zipf.error": "Insufficient data for Zipf analysis",

        "signal.chiSquareUniformity": "Chi-Square Uniformity",
        "signal.chiSquare.ai": "LSB distribution shows statistical anomaly — potential AI generation artifact",
        "signal.chiSquare.real": "LSB distribution appears statistically natural",
        "signal.chiSquare.error": "Insufficient data for chi-square test",

        "signal.markovTransition": "Markov Transition",
        "signal.markov.ai": "Pixel transitions show abnormal smoothness — AI images have over-correlated pixels",
        "signal.markov.real": "Pixel transition patterns appear natural — consistent with real image content",
        "signal.markov.error": "Insufficient data for Markov analysis",

        "signal.saturationDist": "Saturation Distribution",
        "signal.saturation.ai": "Saturation profile is abnormal — AI images exhibit biased color saturation",
        "signal.saturation.real": "Saturation distribution is natural — consistent with real photography",
        "signal.saturation.error": "Insufficient data for saturation analysis",

        // === Compression (4) ===
        "signal.jpegGhost": "JPEG Ghost Detection",
        "signal.jpegGhost.ai": "No JPEG block boundaries detected — image may not originate from camera compression",
        "signal.jpegGhost.real": "JPEG block boundary artifacts present — consistent with camera compression pipeline",
        "signal.jpegGhost.error": "Image too small for JPEG ghost analysis",

        "signal.quantFingerprint": "Quantization Fingerprint",
        "signal.quant.ai": "No JPEG quantization patterns — image appears to bypass standard compression",
        "signal.quant.real": "JPEG quantization patterns present — consistent with standard camera pipeline",
        "signal.quant.error": "Image too small for quantization analysis",

        "signal.errorLevel": "Error Level Analysis",
        "signal.ela.ai": "Error levels are unusually uniform — AI images lack compression-induced variation",
        "signal.ela.real": "Error levels vary naturally — consistent with real camera compression",
        "signal.ela.error": "Insufficient data for ELA",

        "signal.colorBanding": "Color Banding",
        "signal.banding.ai": "Significant color banding detected — AI generation or heavy post-processing artifact",
        "signal.banding.real": "Smooth gradients without banding — consistent with high-quality capture",

        // === Generative (3) ===
        "signal.ganFingerprint": "GAN Fingerprint",
        "signal.gan.ai": "Spectral peaks detected — characteristic fingerprint of GAN-based generation",
        "signal.gan.real": "No GAN spectral fingerprint detected — frequency spectrum appears natural",

        "signal.upsamplingArtifact": "Upsampling Artifacts",
        "signal.upsampling.ai": "Checkerboard upsampling artifacts detected — common in neural network generation",
        "signal.upsampling.real": "No upsampling artifacts found — image pixel structure appears natural",

        "signal.diffusionArtifact": "Diffusion Artifacts",
        "signal.diffusion.ai": "Mid-frequency smoothing with sharp edges detected — pattern consistent with diffusion models",
        "signal.diffusion.real": "No diffusion model artifacts detected — frequency structure appears natural",

        // === Geometric (3) ===
        "signal.perspectiveConsistency": "Perspective Consistency",
        "signal.perspective.ai": "Edge direction distribution suggests inconsistent perspective geometry",
        "signal.perspective.real": "Edge directions show consistent perspective structure — natural scene geometry",
        "signal.perspective.error": "Not enough strong edges for perspective analysis",

        "signal.lightingConsistency": "Lighting Consistency",
        "signal.lighting.ai": "Lighting direction varies significantly across regions — physically inconsistent",
        "signal.lighting.real": "Lighting direction is consistent across regions — natural illumination pattern",
        "signal.lighting.error": "Not enough regions for lighting analysis",

        "signal.shadowConsistency": "Shadow Consistency",
        "signal.shadow.ai": "Shadow distribution appears physically inconsistent — potential AI generation",
        "signal.shadow.real": "Shadow distribution is physically plausible — natural lighting and shadow patterns",
        "signal.shadow.error": "Not enough data for shadow analysis",

        // === Advanced Color (2) ===
        "signal.colorGamut": "Color Gamut Analysis",
        "signal.gamut.ai": "Color gamut shows unnatural vibrancy — AI images often exceed natural camera gamut",
        "signal.gamut.real": "Color gamut falls within natural range — consistent with camera sensor response",

        "signal.whiteBalance": "White Balance Consistency",
        "signal.wb.ai": "White balance is suspiciously uniform — real scenes have subtle WB variation from mixed lighting",
        "signal.wb.real": "White balance varies naturally across regions — consistent with real-world illumination",
        "signal.wb.error": "Not enough regions for white balance analysis",

        // === Advanced Forensic (4) — v7 ===
        "signal.copyMove": "Copy-Move Detection",
        "signal.copyMove.ai": "High block similarity — repeated micro-patterns suggest AI generation or copy-move forgery",
        "signal.copyMove.real": "Low block repetition — unique block patterns consistent with real photography",
        "signal.copyMove.error": "Image too small for copy-move analysis",

        "signal.doubleJpeg": "Double JPEG Detection",
        "signal.doubleJpeg.ai": "Periodic DCT artifacts suggest double compression — image may be edited or AI-generated",
        "signal.doubleJpeg.real": "Single compression pattern — consistent with direct camera output",
        "signal.doubleJpeg.error": "Image too small for double JPEG analysis",

        "signal.autocorrelation": "Autocorrelation Regularity",
        "signal.autocorr.ai": "Periodic autocorrelation peaks detected — suggests resampling or AI upsampling artifacts",
        "signal.autocorr.real": "Smooth autocorrelation decay — consistent with natural image structure",
        "signal.autocorr.error": "Image too small for autocorrelation analysis",

        "signal.pixelCooccurrence": "Pixel Co-occurrence",
        "signal.cooccurrence.ai": "Co-occurrence statistics show low entropy — AI images have overly smooth gradient transitions",
        "signal.cooccurrence.real": "Co-occurrence entropy is natural — consistent with real image noise and texture",
        "signal.cooccurrence.error": "Image too small for co-occurrence analysis",

        // === Perceptual Texture (4) — v7 ===
        "signal.tamuraTexture": "Tamura Texture Features",
        "signal.tamura.ai": "Tamura features show unnatural texture — low coarseness and isotropic gradients typical of AI",
        "signal.tamura.real": "Tamura features indicate natural texture — coarseness and directionality consistent with real capture",
        "signal.tamura.error": "Image too small for Tamura analysis",

        "signal.lpq": "Local Phase Quantization",
        "signal.lpq.ai": "LPQ distribution is concentrated — AI images show limited phase diversity in local textures",
        "signal.lpq.real": "LPQ distribution is diverse — natural phase variation consistent with real camera capture",
        "signal.lpq.error": "Image too small for LPQ analysis",

        "signal.fractalDimension": "Fractal Dimension",
        "signal.fractal.ai": "Fractal dimension deviates from natural range — AI images often lack natural fractal complexity",
        "signal.fractal.real": "Fractal dimension falls within natural range (~2.3-2.7) — consistent with real photography",
        "signal.fractal.error": "Image too small for fractal analysis",

        "signal.bilateralSymmetry": "Bilateral Symmetry",
        "signal.symmetry2.ai": "Unusually high bilateral symmetry — AI-generated images often exhibit unnatural mirror symmetry",
        "signal.symmetry2.real": "Natural asymmetry detected — real scenes rarely exhibit perfect bilateral symmetry",
        "signal.symmetry2.error": "Image too small for symmetry analysis",

        // === Histogram & Info Theory (4) — v7 ===
        "signal.histogramGradient": "Histogram Gradient",
        "signal.histGrad.ai": "Histogram shows unnatural smoothness or gaps — AI images have atypical intensity distributions",
        "signal.histGrad.real": "Histogram gradient is natural — consistent with camera-captured intensity distribution",
        "signal.histGrad.error": "Image too small for histogram gradient analysis",

        "signal.colorCoherence": "Color Coherence Vector",
        "signal.ccv.ai": "Color coherence is unnaturally high — AI images have overly uniform color regions",
        "signal.ccv.real": "Color coherence is natural — incoherent color scatter consistent with real scene complexity",
        "signal.ccv.error": "Image too small for CCV analysis",

        "signal.mutualInfo": "Mutual Information",
        "signal.mi.ai": "Channel mutual information is abnormal — AI images exhibit atypical inter-channel dependencies",
        "signal.mi.real": "Channel mutual information is natural — consistent with real-world color correlation",
        "signal.mi.error": "Image too small for mutual information analysis",

        "signal.laplacianEdge": "Laplacian Edge Sharpness",
        "signal.laplacian.ai": "Laplacian response is unusually low — AI images have suppressed high-frequency edge detail",
        "signal.laplacian.real": "Laplacian edge response is natural — consistent with camera sensor sharpness and noise",
        "signal.laplacian.error": "Image too small for Laplacian edge analysis",

        // === Method Categories ===
        "methods.catSpatial": "Spatial Analysis",
        "methods.catCompression": "Compression",
        "methods.catGenerative": "Generative Detection",
        "methods.catGeometric": "Geometric Analysis",
        "methods.catColor": "Color Analysis",
        "methods.catForensic": "Advanced Forensic",
        "methods.catPerceptual": "Perceptual Texture",
    },
    vi: {
        // === Original 13 Methods ===
        "signal.metadataAnalysis": "Phân tích Metadata",
        "signal.metadata.inconclusive": "Phân tích metadata chưa có kết luận",
        "signal.metadata.aiDetected": "Phát hiện phần mềm tạo AI trong metadata",
        "signal.metadata.cameraDetected": "Phát hiện chữ ký máy ảnh thật trong metadata",
        "signal.metadata.namingPattern": "Cách đặt tên file gợi ý nội dung do AI tạo",
        "signal.metadata.aiResolution": "Độ phân giải trùng với kích thước AI phổ biến",

        "signal.spectralNyquist": "Phân tích phổ Nyquist",
        "signal.spectral.ai": "Phát hiện đỉnh phổ tại tần Nyquist — đặc trưng lỗi upsampling AI",
        "signal.spectral.real": "Phân bố phổ mượt mà — phù hợp ảnh chụp tự nhiên",

        "signal.multiScaleReconstruction": "Tái tạo đa tỷ lệ",
        "signal.reconstruction.ai": "Lỗi tái tạo đồng nhất bất thường — đặc trưng nội dung AI",
        "signal.reconstruction.real": "Tái tạo có biến đổi tự nhiên — phù hợp ảnh chụp thật",

        "signal.noiseResidual": "Nhiễu dư tần cao",
        "signal.noiseUniformity": "Độ đồng nhất nhiễu",
        "signal.noise.ai": "Mẫu nhiễu đồng nhất bất thường — phổ biến ở ảnh AI",
        "signal.noise.real": "Nhiễu biến đổi tự nhiên — phù hợp với ảnh chụp thật",
        "signal.noise.error": "Không đủ dữ liệu phân tích nhiễu",

        "signal.edgeCoherence": "Tính nhất quán cạnh",
        "signal.edge.ai": "Mẫu cạnh mượt bất thường — có thể là ảnh AI",
        "signal.edge.real": "Mẫu cạnh có biến đổi tự nhiên — phù hợp nội dung thật",

        "signal.gradientSmoothness": "Vi kết cấu Gradient",
        "signal.gradient.ai": "Vùng mượt thiếu vi kết cấu tự nhiên — ảnh AI thiếu nhiễu cảm biến",
        "signal.gradient.real": "Vùng mượt có vi kết cấu tự nhiên từ cảm biến máy ảnh",

        "signal.benfordsLaw": "Luật Benford",
        "signal.benford.ai": "Gradient pixel lệch khỏi Luật Benford — đặc trưng ảnh AI",
        "signal.benford.real": "Gradient pixel tuân theo phân bố thống kê tự nhiên",

        "signal.chromaticAberration": "Quang sai sắc",
        "signal.chromatic.ai": "Không có quang sai sắc — ống kính thật tạo viền màu",
        "signal.chromatic.real": "Có quang sai sắc — phù hợp quang học máy ảnh thật",

        "signal.textureConsistency": "Tính nhất quán kết cấu",
        "signal.texture.ai": "Kết cấu đồng nhất bất thường giữa các vùng — có thể là AI",
        "signal.texture.real": "Kết cấu biến đổi tự nhiên trên toàn ảnh",

        "signal.cfaPattern": "Mẫu cảm biến CFA",
        "signal.cfa.ai": "Không tìm thấy mẫu CFA Bayer — máy ảnh thật để lại dấu vân này",
        "signal.cfa.real": "Có lỗi demosaicing CFA — đặc trưng cảm biến máy ảnh thật",

        "signal.videoProperties": "Thuộc tính video",
        "signal.video.analysis": "Phân tích video",
        "signal.video.short": "Video rất ngắn — phổ biến ở video AI",
        "signal.video.long": "Video dài — ít khả năng hoàn toàn do AI tạo",

        "signal.dctBlock": "Dấu vân DCT",
        "signal.dct.ai": "Không có hoặc dấu vân JPEG đồng nhất — ảnh AI thiếu dấu vân nén tự nhiên",
        "signal.dct.real": "Dấu vân JPEG tự nhiên — phù hợp nén ảnh từ máy ảnh thật",
        "signal.dct.error": "Ảnh quá nhỏ để phân tích DCT",

        "signal.colorCorrelation": "Tương quan kênh màu",
        "signal.colorDistribution": "Phân bố màu sắc",
        "signal.frequencyAnalysis": "Phân tích tần số",
        "signal.compressionAnalysis": "Phân tích nén",
        "signal.symmetryPatterns": "Mẫu đối xứng",
        "signal.color.ai": "Tương quan kênh màu bất thường — AI tạo kênh màu khác ánh sáng tự nhiên",
        "signal.color.real": "Kênh màu tương quan tự nhiên — phù hợp cảm biến và quang học máy ảnh",
        "signal.color.error": "Không đủ dữ liệu phân tích tương quan màu",

        "signal.prnuPattern": "Nhiễu mẫu cảm biến",
        "signal.prnu.ai": "Không phát hiện nhiễu cảm biến nhất quán — ảnh AI thiếu dấu vân PRNU",
        "signal.prnu.real": "Phát hiện nhiễu mẫu cảm biến — phù hợp dấu vân PRNU máy ảnh thật",
        "signal.prnu.error": "Không đủ dữ liệu phân tích PRNU",

        // === Spatial Domain (6) ===
        "signal.localBinaryPattern": "Mẫu nhị phân cục bộ (LBP)",
        "signal.lbp.ai": "Mẫu kết cấu LBP thiếu đa dạng — đặc trưng bề mặt AI",
        "signal.lbp.real": "Kết cấu LBP đa dạng tự nhiên — phù hợp ảnh thật",

        "signal.hogAnomaly": "Bất thường HOG",
        "signal.hog.ai": "Hướng gradient đồng nhất bất thường — đặc trưng ảnh AI",
        "signal.hog.real": "Hướng gradient biến đổi tự nhiên — phù hợp cảnh thật",

        "signal.glcmTexture": "Kết cấu GLCM",
        "signal.glcm.ai": "Đặc trưng GLCM cho thấy kết cấu quá mượt — đặc trưng AI",
        "signal.glcm.real": "Đặc trưng GLCM phù hợp ảnh tự nhiên",

        "signal.localVarianceMap": "Bản đồ phương sai cục bộ",
        "signal.localVariance.ai": "Phương sai cục bộ đồng nhất bất thường — ảnh AI thiếu biến đổi tự nhiên",
        "signal.localVariance.real": "Phương sai cục bộ biến đổi tự nhiên — phù hợp ảnh thật",
        "signal.localVariance.error": "Không đủ dữ liệu phân tích phương sai cục bộ",

        "signal.morphGradient": "Gradient hình thái học",
        "signal.morph.ai": "Gradient hình thái quá hẹp — ảnh AI thiếu chi tiết chuyển tiếp vi mô",
        "signal.morph.real": "Gradient hình thái có phạm vi tự nhiên — phù hợp ảnh thật",
        "signal.morph.error": "Không đủ dữ liệu phân tích hình thái học",

        "signal.weberDescriptor": "Bộ mô tả Weber",
        "signal.weber.ai": "Kích thích Weber thấp bất thường — ảnh AI thiếu chuyển tiếp cường độ tự nhiên",
        "signal.weber.real": "Kích thích Weber biến đổi tự nhiên — phù hợp chi tiết ảnh thật",
        "signal.weber.error": "Không đủ dữ liệu phân tích Weber",

        // === Frequency Domain (6) ===
        "signal.waveletStats": "Thống kê Wavelet",
        "signal.wavelet.ai": "Hệ số wavelet phân bố Gaussian — ảnh AI thiếu phân bố đuôi nặng tự nhiên",
        "signal.wavelet.real": "Hệ số wavelet phân bố đuôi nặng tự nhiên — phù hợp ảnh thật",

        "signal.gaborResponse": "Đáp ứng Gabor",
        "signal.gabor.ai": "Bộ lọc Gabor cho đáp ứng đẳng hướng — ảnh AI thiếu biến đổi kết cấu theo hướng",
        "signal.gabor.real": "Đáp ứng Gabor cho thấy biến đổi hướng tự nhiên trong kết cấu",
        "signal.gabor.error": "Không đủ dữ liệu phân tích Gabor",

        "signal.psdSlope": "Phân tích độ dốc PSD",
        "signal.psd.ai": "Mật độ phổ công suất lệch khỏi quy luật 1/f² tự nhiên — có thể là AI",
        "signal.psd.real": "Mật độ phổ công suất tuân theo quy luật 1/f² — phù hợp ảnh thật",

        "signal.phaseCongruency": "Tính nhất quán pha",
        "signal.phase.ai": "Tính nhất quán pha quá đồng nhất — ảnh AI có cấu trúc cạnh nhân tạo",
        "signal.phase.real": "Tính nhất quán pha biến đổi tự nhiên — phù hợp hình học cảnh thật",
        "signal.phase.error": "Không đủ dữ liệu phân tích tính nhất quán pha",

        "signal.radialSpectrum": "Phổ hướng tâm",
        "signal.radial.ai": "Phổ công suất hướng tâm phân bố tần số bất thường — có thể là dấu hiệu AI",
        "signal.radial.real": "Phổ hướng tâm suy giảm tần số tự nhiên — phù hợp quang học máy ảnh",
        "signal.radial.error": "Không đủ dữ liệu phân tích phổ hướng tâm",

        "signal.freqBandRatio": "Tỷ lệ dải tần",
        "signal.freqBand.ai": "Năng lượng tần số cao thấp bất thường — ảnh AI thiếu chi tiết tinh",
        "signal.freqBand.real": "Phân bố dải tần tự nhiên — phù hợp ảnh chụp thật",

        // === Statistical (6) ===
        "signal.entropyMap": "Bản đồ entropy",
        "signal.entropy.ai": "Phân bố entropy quá đồng nhất — ảnh AI thiếu biến đổi thông tin tự nhiên",
        "signal.entropy.real": "Phân bố entropy biến đổi tự nhiên — phù hợp nội dung cảnh thật",
        "signal.entropy.error": "Không đủ dữ liệu phân tích entropy",

        "signal.higherOrderStats": "Thống kê bậc cao",
        "signal.hos.ai": "Thống kê gradient quá Gaussian — ảnh tự nhiên có phân bố đuôi nặng hơn",
        "signal.hos.real": "Thống kê gradient phân bố đuôi nặng tự nhiên",
        "signal.hos.error": "Không đủ dữ liệu phân tích HOS",

        "signal.zipfLaw": "Luật Zipf",
        "signal.zipf.ai": "Phân bố cường độ lệch khỏi luật Zipf — có thể là lỗi tạo AI",
        "signal.zipf.real": "Phân bố cường độ tuân theo mẫu Zipf tự nhiên",
        "signal.zipf.error": "Không đủ dữ liệu phân tích Zipf",

        "signal.chiSquareUniformity": "Đồng nhất Chi-Square",
        "signal.chiSquare.ai": "Phân bố LSB có bất thường thống kê — có thể là lỗi tạo AI",
        "signal.chiSquare.real": "Phân bố LSB có vẻ tự nhiên về mặt thống kê",
        "signal.chiSquare.error": "Không đủ dữ liệu kiểm tra chi-square",

        "signal.markovTransition": "Chuyển tiếp Markov",
        "signal.markov.ai": "Chuyển tiếp pixel mượt bất thường — ảnh AI có pixel tương quan quá mức",
        "signal.markov.real": "Mẫu chuyển tiếp pixel tự nhiên — phù hợp nội dung ảnh thật",
        "signal.markov.error": "Không đủ dữ liệu phân tích Markov",

        "signal.saturationDist": "Phân bố độ bão hòa",
        "signal.saturation.ai": "Hồ sơ bão hòa bất thường — ảnh AI có xu hướng bão hòa màu thiên lệch",
        "signal.saturation.real": "Phân bố bão hòa tự nhiên — phù hợp ảnh chụp thật",
        "signal.saturation.error": "Không đủ dữ liệu phân tích bão hòa",

        // === Compression (4) ===
        "signal.jpegGhost": "Phát hiện bóng JPEG",
        "signal.jpegGhost.ai": "Không phát hiện ranh giới block JPEG — ảnh có thể không từ nén máy ảnh",
        "signal.jpegGhost.real": "Có lỗi ranh giới block JPEG — phù hợp pipeline nén máy ảnh",
        "signal.jpegGhost.error": "Ảnh quá nhỏ để phân tích bóng JPEG",

        "signal.quantFingerprint": "Dấu vân lượng tử hóa",
        "signal.quant.ai": "Không có mẫu lượng tử hóa JPEG — ảnh bỏ qua nén tiêu chuẩn",
        "signal.quant.real": "Có mẫu lượng tử hóa JPEG — phù hợp pipeline máy ảnh tiêu chuẩn",
        "signal.quant.error": "Ảnh quá nhỏ để phân tích lượng tử hóa",

        "signal.errorLevel": "Phân tích mức lỗi (ELA)",
        "signal.ela.ai": "Mức lỗi đồng nhất bất thường — ảnh AI thiếu biến đổi do nén",
        "signal.ela.real": "Mức lỗi biến đổi tự nhiên — phù hợp nén ảnh thật",
        "signal.ela.error": "Không đủ dữ liệu cho ELA",

        "signal.colorBanding": "Vạch màu (Banding)",
        "signal.banding.ai": "Phát hiện vạch màu rõ rệt — lỗi tạo AI hoặc hậu xử lý nặng",
        "signal.banding.real": "Gradient mượt không có vạch — phù hợp chụp chất lượng cao",

        // === Generative (3) ===
        "signal.ganFingerprint": "Dấu vân GAN",
        "signal.gan.ai": "Phát hiện đỉnh phổ — dấu vân đặc trưng của tạo ảnh GAN",
        "signal.gan.real": "Không có dấu vân phổ GAN — phổ tần số có vẻ tự nhiên",

        "signal.upsamplingArtifact": "Lỗi upsampling",
        "signal.upsampling.ai": "Phát hiện lỗi bàn cờ upsampling — phổ biến trong tạo ảnh mạng nơron",
        "signal.upsampling.real": "Không có lỗi upsampling — cấu trúc pixel ảnh có vẻ tự nhiên",

        "signal.diffusionArtifact": "Lỗi mô hình khuếch tán",
        "signal.diffusion.ai": "Phát hiện làm mượt trung tần với cạnh sắc — mẫu phù hợp mô hình khuếch tán",
        "signal.diffusion.real": "Không có lỗi mô hình khuếch tán — cấu trúc tần số có vẻ tự nhiên",

        // === Geometric (3) ===
        "signal.perspectiveConsistency": "Tính nhất quán phối cảnh",
        "signal.perspective.ai": "Phân bố hướng cạnh gợi ý hình học phối cảnh không nhất quán",
        "signal.perspective.real": "Hướng cạnh cho thấy cấu trúc phối cảnh nhất quán — hình học cảnh tự nhiên",
        "signal.perspective.error": "Không đủ cạnh mạnh để phân tích phối cảnh",

        "signal.lightingConsistency": "Tính nhất quán ánh sáng",
        "signal.lighting.ai": "Hướng ánh sáng biến đổi đáng kể giữa các vùng — không nhất quán vật lý",
        "signal.lighting.real": "Hướng ánh sáng nhất quán giữa các vùng — mẫu chiếu sáng tự nhiên",
        "signal.lighting.error": "Không đủ vùng để phân tích ánh sáng",

        "signal.shadowConsistency": "Tính nhất quán bóng đổ",
        "signal.shadow.ai": "Phân bố bóng đổ có vẻ không nhất quán vật lý — có thể là AI",
        "signal.shadow.real": "Phân bố bóng đổ hợp lý về vật lý — mẫu ánh sáng và bóng tự nhiên",
        "signal.shadow.error": "Không đủ dữ liệu phân tích bóng đổ",

        // === Advanced Color (2) ===
        "signal.colorGamut": "Phân tích gam màu",
        "signal.gamut.ai": "Gam màu cho thấy độ sống động bất thường — ảnh AI thường vượt gam máy ảnh",
        "signal.gamut.real": "Gam màu nằm trong phạm vi tự nhiên — phù hợp đáp ứng cảm biến",

        "signal.whiteBalance": "Tính nhất quán cân bằng trắng",
        "signal.wb.ai": "Cân bằng trắng đồng nhất đáng ngờ — cảnh thật có biến đổi WB tinh tế từ ánh sáng hỗn hợp",
        "signal.wb.real": "Cân bằng trắng biến đổi tự nhiên — phù hợp chiếu sáng thế giới thực",
        "signal.wb.error": "Không đủ vùng phân tích cân bằng trắng",

        // === Advanced Forensic (4) — v7 ===
        "signal.copyMove": "Phát hiện sao chép-di chuyển",
        "signal.copyMove.ai": "Độ tương đồng block cao — mẫu vi mô lặp lại gợi ý AI hoặc giả mạo sao chép",
        "signal.copyMove.real": "Ít lặp block — mẫu block duy nhất phù hợp ảnh thật",
        "signal.copyMove.error": "Ảnh quá nhỏ để phân tích sao chép-di chuyển",

        "signal.doubleJpeg": "Phát hiện nén JPEG kép",
        "signal.doubleJpeg.ai": "Lỗi DCT tuần hoàn gợi ý nén kép — ảnh có thể đã chỉnh sửa hoặc AI",
        "signal.doubleJpeg.real": "Mẫu nén đơn — phù hợp đầu ra trực tiếp từ máy ảnh",
        "signal.doubleJpeg.error": "Ảnh quá nhỏ để phân tích JPEG kép",

        "signal.autocorrelation": "Tính đều đặn tự tương quan",
        "signal.autocorr.ai": "Phát hiện đỉnh tự tương quan tuần hoàn — gợi ý lỗi resampling hoặc upsampling AI",
        "signal.autocorr.real": "Suy giảm tự tương quan mượt — phù hợp cấu trúc ảnh tự nhiên",
        "signal.autocorr.error": "Ảnh quá nhỏ để phân tích tự tương quan",

        "signal.pixelCooccurrence": "Đồng xuất hiện pixel",
        "signal.cooccurrence.ai": "Thống kê đồng xuất hiện entropy thấp — ảnh AI có gradient chuyển tiếp quá mượt",
        "signal.cooccurrence.real": "Entropy đồng xuất hiện tự nhiên — phù hợp nhiễu và kết cấu ảnh thật",
        "signal.cooccurrence.error": "Ảnh quá nhỏ để phân tích đồng xuất hiện",

        // === Perceptual Texture (4) — v7 ===
        "signal.tamuraTexture": "Đặc trưng kết cấu Tamura",
        "signal.tamura.ai": "Đặc trưng Tamura cho thấy kết cấu bất thường — độ thô thấp và gradient đẳng hướng đặc trưng AI",
        "signal.tamura.real": "Đặc trưng Tamura cho thấy kết cấu tự nhiên — độ thô và hướng phù hợp ảnh thật",
        "signal.tamura.error": "Ảnh quá nhỏ để phân tích Tamura",

        "signal.lpq": "Lượng tử hóa pha cục bộ",
        "signal.lpq.ai": "Phân bố LPQ tập trung — ảnh AI có đa dạng pha hạn chế trong kết cấu cục bộ",
        "signal.lpq.real": "Phân bố LPQ đa dạng — biến đổi pha tự nhiên phù hợp ảnh thật",
        "signal.lpq.error": "Ảnh quá nhỏ để phân tích LPQ",

        "signal.fractalDimension": "Chiều fractal",
        "signal.fractal.ai": "Chiều fractal lệch khỏi phạm vi tự nhiên — ảnh AI thường thiếu độ phức tạp fractal",
        "signal.fractal.real": "Chiều fractal nằm trong phạm vi tự nhiên (~2.3-2.7) — phù hợp ảnh thật",
        "signal.fractal.error": "Ảnh quá nhỏ để phân tích fractal",

        "signal.bilateralSymmetry": "Đối xứng hai bên",
        "signal.symmetry2.ai": "Đối xứng hai bên cao bất thường — ảnh AI thường có đối xứng gương bất tự nhiên",
        "signal.symmetry2.real": "Bất đối xứng tự nhiên — cảnh thật hiếm khi có đối xứng hai bên hoàn hảo",
        "signal.symmetry2.error": "Ảnh quá nhỏ để phân tích đối xứng",

        // === Histogram & Info Theory (4) — v7 ===
        "signal.histogramGradient": "Gradient histogram",
        "signal.histGrad.ai": "Histogram cho thấy độ mượt hoặc khoảng trống bất thường — ảnh AI có phân bố cường độ bất thường",
        "signal.histGrad.real": "Gradient histogram tự nhiên — phù hợp phân bố cường độ ảnh chụp",
        "signal.histGrad.error": "Ảnh quá nhỏ để phân tích gradient histogram",

        "signal.colorCoherence": "Vector kết hợp màu",
        "signal.ccv.ai": "Kết hợp màu cao bất thường — ảnh AI có vùng màu đồng nhất quá mức",
        "signal.ccv.real": "Kết hợp màu tự nhiên — phân tán màu phù hợp độ phức tạp cảnh thật",
        "signal.ccv.error": "Ảnh quá nhỏ để phân tích CCV",

        "signal.mutualInfo": "Thông tin tương hỗ",
        "signal.mi.ai": "Thông tin tương hỗ kênh bất thường — ảnh AI có phụ thuộc liên kênh bất thường",
        "signal.mi.real": "Thông tin tương hỗ kênh tự nhiên — phù hợp tương quan màu thế giới thực",
        "signal.mi.error": "Ảnh quá nhỏ để phân tích thông tin tương hỗ",

        "signal.laplacianEdge": "Độ sắc cạnh Laplacian",
        "signal.laplacian.ai": "Đáp ứng Laplacian thấp bất thường — ảnh AI triệt tiêu chi tiết cạnh tần cao",
        "signal.laplacian.real": "Đáp ứng cạnh Laplacian tự nhiên — phù hợp độ sắc cảm biến và nhiễu",
        "signal.laplacian.error": "Ảnh quá nhỏ để phân tích cạnh Laplacian",

        // === Method Categories ===
        "methods.catSpatial": "Phân tích không gian",
        "methods.catCompression": "Phân tích nén",
        "methods.catGenerative": "Phát hiện mô hình sinh",
        "methods.catGeometric": "Phân tích hình học",
        "methods.catColor": "Phân tích màu sắc",
        "methods.catForensic": "Pháp y nâng cao",
        "methods.catPerceptual": "Kết cấu nhận thức",
    },
};
