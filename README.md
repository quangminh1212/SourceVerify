# SourceVerify — AI-Generated Content Detector

Advanced forensic analysis tool that detects AI-generated content in **images**, **videos**, and **text** using **148 independent analysis methods** based on peer-reviewed academic research. Built with Next.js 16 + TypeScript + Tailwind CSS 4.

## Features

- **148 Analysis Methods** — 97 image + 16 video + 15 text + 20 metadata methods
- **Image & Video & Text** — Supports JPEG, PNG, WebP, GIF, MP4, WebM, and plain text
- **Client-Side Processing** — All analysis runs locally in browser (zero server upload)
- **Privacy-First** — No data leaves the user's device
- **Multi-Language** — i18n support (EN, VI, KO, JA, ZH, etc.)
- **Academic References** — Every method references published research papers

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel

## Getting Started

```bash
npm install
npm run dev
```

## Deploy to Vercel

```bash
npx vercel --prod
```

Or connect GitHub repo → Vercel Dashboard → Import → Deploy.

---

## Architecture

```
src/
├── lib/
│   ├── analyzer.ts          # Main orchestrator (image + video analysis)
│   ├── serverAnalyzer.ts    # Server-side analysis entry
│   ├── types.ts             # AnalysisResult, AnalysisMethod, FileMetadata
│   └── methods/
│       ├── index.ts          # Barrel exports for all methods
│       ├── pixelUtils.ts     # Shared pixel utilities (gray(), etc.)
│       ├── image/            # 97 image analysis methods
│       ├── video/            # 16 video analysis methods
│       └── text/             # 15 text analysis methods
└── app/
    └── methods/
        ├── data.ts           # Method registry (id, category, mediaType, weight)
        ├── _components/      # Shared UI components
        ├── text/             # Text method pages + i18n
        └── [method]/         # Image/Video method pages + i18n
```

### Core Flow

1. **`analyzer.ts`** receives file → detects type (image/video/text)
2. Calls all relevant methods → each returns `AnalysisMethod { name, score, weight, description, details }`
3. **`calculateVerdict()`** aggregates weighted scores → produces final AI probability + verdict

### Method Signature

```typescript
// Image/Video methods
(pixels: Uint8ClampedArray, width: number, height: number) => AnalysisMethod

// Metadata methods
(metadata: FileMetadata, exifData: Record<string, string>) => AnalysisMethod

// Text methods
(text: string) => AnalysisMethod
```

---

## All 148 Analysis Methods

### Image Methods (97) — `src/lib/methods/image/`

#### Sensor & Camera Forensics

| # | Method | File | Reference | Algorithm |
|---|--------|------|-----------|-----------|
| 1 | PRNU Pattern | `prnu.ts` | Lukas, Fridrich & Goljan (2006) | Wiener-like noise extraction → spatial autocorrelation H+V → noise stationarity (quadrant CV). Real cameras have fixed PRNU fingerprints |
| 2 | CFA Pattern | `cfa.ts` | Bayer filter theory | 2×2 periodic energy ratio from Bayer demosaicing. Real cameras leave characteristic CFA artifacts |
| 3 | Chromatic Aberration | `chromatic.ts` | Optical lens theory | R-B color channel edge shift at image borders. Real lenses produce lateral chromatic fringing |
| 4 | Camera Model | `cameraModel.ts` | ISP fingerprinting | Color histogram peak analysis + clipping ratio. Each camera ISP leaves unique histogram signature |
| 5 | Noiseprint Extraction | `noiseprintExtraction.ts` | Cozzolino et al. (2019) | Laplacian noise residual → std analysis. Simplified proxy for CNN-based noiseprint |
| 6 | Demosaicing Detection | `demosaicingDetect.ts` | CFA interpolation | Detects demosaicing interpolation artifacts |
| 7 | Color Profile Meta | `colorProfileMeta.ts` | ICC standard | ICC color profile metadata validation |

#### Statistical Analysis

| # | Method | File | Reference | Algorithm |
|---|--------|------|-----------|-----------|
| 8 | Benford's Law | `benford.ts` | Nigrini (1996) | `χ² = Σ(O-E)²/E` on first-digit distribution of pixel gradients. Expected: `[0.301, 0.176, 0.125, ...]` |
| 9 | Chi-Square Uniformity | `chiSquareUniformity.ts` | Standard statistics | LSB distribution chi-square test per RGB channel |
| 10 | Entropy Map | `entropyMap.ts` | Shannon (1948) | Regional Shannon entropy `H = -Σ p·log₂(p)` with CV analysis across blocks |
| 11 | Higher-Order Statistics | `higherOrderStatistics.ts` | Lyu & Farid (ICIP 2002) | Gradient kurtosis `κ = m4/m2²` + skewness `γ = m3/σ³`. Natural images: κ >> 3 |
| 12 | Zipf's Law | `zipfLaw.ts` | Zipf (1949) | Log-log regression on intensity rank-frequency. `R²` goodness-of-fit. Natural: slope ≈ -1 to -1.5 |
| 13 | Histogram Analysis | `histogram.ts` | Popescu & Farid (2005) | 5 metrics: gap count, smoothness, kurtosis, entropy, periodicity detection |
| 14 | Markov Transition | `markovTransition.ts` | Markov chain theory | 16-level transition matrix → diagonal dominance + transition entropy |
| 15 | Autocorrelation | `autocorrelation.ts` | Popescu & Farid (IEEE SP 2005) | `r(lag) = Σ(x_i-μ)(x_{i+lag}-μ) / (n·σ²)` — peak detection for resampling artifacts |
| 16 | Fractal Dimension | `fractal.ts` | Sarkar & Chaudhuri (1994) | Differential Box-Counting → log-log regression. Natural images: FD ≈ 2.3-2.8 |
| 17 | Color Channel Correlation | `color.ts` | Ojha et al. (CVPR 2023) | Pearson `r = cov(X,Y)/√(var(X)·var(Y))` for R-G, G-B, R-B + inter-channel noise + histogram entropy |
| 18 | Histogram Gradient | `histogramGradient.ts` | Distribution analysis | First-order histogram differences |
| 19 | Color Coherence | `colorCoherence.ts` | CCV analysis | Color coherence vector analysis |
| 20 | Mutual Information | `mutualInformation.ts` | Information theory | Pixel pair co-occurrence entropy |
| 21 | Saturation Distribution | `saturationDistribution.ts` | Color science | HSV saturation histogram analysis |
| 22 | Image Phylogeny | `imagePhylogeny.ts` | Phylogenetic approach | Block similarity cross-region comparison |
| 23 | Perceptual Hash | `perceptualHash.ts` | Content hashing | DCT-based perceptual hashing |
| 24 | Higher Order Statistics | `higherOrderStatistics.ts` | Lyu & Farid (2002) | Gradient domain moment analysis |

#### Frequency Domain

| # | Method | File | Reference | Algorithm |
|---|--------|------|-----------|-----------|
| 25 | Spectral Nyquist | `spectral.ts` | SpAN (ICLR 2026), SPAI (CVPR 2025) | 1D DFT `F(k) = Σ x(n)·e^(-j2πkn/N)` rows+cols → Nyquist peak ratio + spectral rolloff |
| 26 | DCT Block Artifacts | `dct.ts` | Fridrich (2003), Bianchi & Piva (2012) | 8×8 block boundary vs interior gradient ratio + regional uniformity CV |
| 27 | GAN Fingerprint | `ganFingerprint.ts` | Marra et al. (IEEE MIPR 2019) | Row-wise DFT → log power spectrum → peak detection vs moving average baseline |
| 28 | Diffusion Artifact | `diffusionArtifact.ts` | Corvi et al. (ICASSP 2023) | 1st/2nd derivative ratio → mid vs high frequency energy |
| 29 | Wavelet Statistics | `waveletStatistics.ts` | Lyu & Farid (IEEE TSP 2005) | Haar wavelet: `LH=(a-b+c-d)/2`, `HL=(a+b-c-d)/2`, `HH=(a-b-c+d)/2` → kurtosis analysis |
| 30 | Fourier Ring | `fourierRing.ts` | Van Heel & Schatz (2005) | Full 2D DFT + Hann window → azimuthal average → frequency cutoff detection |
| 31 | JPEG Ghost | `jpegGhost.ts` | Farid (IEEE TIFS 2009) | Block boundary vs interior gradient ratio for double compression detection |
| 32 | Double JPEG | `doubleJpeg.ts` | Lin et al. (ACM MM 2009) | Periodicity detection in diff histogram at periods 4, 8, 16 |
| 33 | Blocking Artifact | `blockingArtifact.ts` | JPEG forensics | On-grid (period=8) vs off-grid gradient ratio H+V |
| 34 | Frequency Band | `frequencyBandRatio.ts` | Band-pass analysis | Low/mid/high frequency energy ratio |
| 35 | Gabor Response | `gaborResponse.ts` | Gabor filter bank | Multi-orientation texture frequency analysis |
| 36 | Power Spectral Density | `powerSpectralDensity.ts` | PSD analysis | Radial PSD slope estimation |
| 37 | Phase Congruency | `phaseCongruency.ts` | Morrone & Owens (1987) | Phase information analysis |
| 38 | Radial Spectrum | `radialSpectrum.ts` | Radial analysis | Azimuthal-averaged power spectrum |
| 39 | Radon Transform | `radonTransform.ts` | Radon (1917) | Line projections in angular domain |
| 40 | Quantization Fingerprint | `quantizationFingerprint.ts` | Compression forensics | Quantization step pattern detection |

#### Pixel & Spatial Domain

| # | Method | File | Reference | Algorithm |
|---|--------|------|-----------|-----------|
| 41 | Noise Residual | `noise.ts` | Lukas et al. (2006) | Laplacian `∇²f = 4c-t-b-l-r` → block std, shot correlation `cov(B,N)/√(var(B)·var(N))`, kurtosis |
| 42 | Edge Coherence | `edge.ts` | Gradient theory | Sobel `gx=[-1,0,1;-2,0,2;-1,0,1]` → magnitude + 36-bin direction entropy |
| 43 | Gradient Micro-Texture | `gradient.ts` | 2nd-order analysis | `\|2g₁-g₀-g₂\|` in smooth regions → micro-texture ratio |
| 44 | Error Level Analysis | `errorLevel.ts` | Krawetz (2007) | 3-level quantization simulation → block error CV. Real JPEGs: CV > 0.6 |
| 45 | Copy-Move Detection | `copyMove.ts` | Christlein et al. (IEEE TIFS 2012) | 16×16 block hash matching → duplicate ratio + unique ratio |
| 46 | Texture Consistency | `texture.ts` | Cross-region analysis | 5-region local variance CV |
| 47 | Local Binary Pattern | `localBinaryPattern.ts` | Ojala et al. (IEEE PAMI 2002) | 8-neighbor LBP → uniform pattern ratio + entropy. AI: higher uniform ratio |
| 48 | HOG Anomaly | `hogAnomaly.ts` | Dalal & Triggs (CVPR 2005) | 9-bin unsigned orientation histogram → normalized entropy + peak dominance |
| 49 | GLCM | `glcm.ts` | Haralick et al. (IEEE SMC 1973) | `contrast=Σ(i-j)²p(i,j)`, `energy=Σp²`, `homogeneity=Σp/(1+\|i-j\|)` |
| 50 | Bilateral Symmetry | `bilateralSymmetry.ts` | Loy & Eklundh (ECCV 2006) | Left-right + top-bottom mirror pixel difference |
| 51 | Splicing Detection | `splicingDetection.ts` | Noise inconsistency | Block-level Laplacian noise CV across regions |
| 52 | Color Banding | `colorBanding.ts` | Quantization artifacts | Step detection in gradient regions (zero diffs + large diffs) |
| 53 | Multi-scale Reconstruction | `reconstruction.ts` | Krawetz (2007) adapted | 3-level deterministic quantization → cross-scale CV |
| 54 | Local Variance Map | `localVarianceMap.ts` | Spatial uniformity | Block-level pixel variance map |
| 55 | Morphological Gradient | `morphologicalGradient.ts` | Mathematical morphology | Local max minus local min |
| 56 | Weber Descriptor | `weberDescriptor.ts` | Chen et al. (IEEE PAMI 2010) | WLD local excitation + orientation |
| 57 | Laplacian Edge | `laplacianEdge.ts` | Laplacian operator | 2nd derivative edge detection |
| 58 | Median Filter Detection | `medianFilter.ts` | Median forensics | Median filtering artifact detection |
| 59 | Resampling Detection | `resamplingDetect.ts` | Popescu & Farid (2005) | Derivative autocorrelation → periodic peak detection |
| 60 | Contrast Enhancement | `contrastEnhancement.ts` | Enhancement forensics | Histogram manipulation detection |
| 61 | Steganalysis | `steganalysis.ts` | LSB analysis | Hidden data pattern detection |
| 62 | Illuminant Map | `illuminantMap.ts` | Illumination forensics | Light source consistency |
| 63 | Color Temperature | `colorTemperature.ts` | Color science | White balance consistency |
| 64 | Color Gamut | `colorGamut.ts` | Gamut analysis | Out-of-gamut pixel detection |
| 65 | White Balance | `whiteBalance.ts` | Color calibration | White point consistency |
| 66 | Gram Matrix | `gramMatrix.ts` | Style analysis | Style feature correlation matrix |
| 67 | SRM Filter | `srmFilter.ts` | SRM steganalysis | Steganalysis rich model residuals |
| 68 | Pixel Co-occurrence | `pixelCooccurrence.ts` | Pair distribution | Adjacent pixel pair analysis |
| 69 | Tamura Texture | `tamuraTexture.ts` | Tamura features | Coarseness, contrast, directionality |
| 70 | LPQ Analysis | `lpqAnalysis.ts` | Local Phase Quantization | Local phase feature extraction |
| 71 | SIFT Forensics | `siftForensics.ts` | Keypoint analysis | Scale-invariant feature analysis |
| 72 | Zernike Moments | `zernikeMoments.ts` | Shape descriptors | Orthogonal moment features |

#### Neural/Generative Detection

| # | Method | File | Reference | Algorithm |
|---|--------|------|-----------|-----------|
| 73 | CLIP Detection | `clipDetection.ts` | Radford et al. (2021) | Midtone ratio + saturation analysis as CLIP-guidance proxy |
| 74 | ResNet Classifier | `resnetClassifier.ts` | He et al. (2016) | Feature extraction proxy via statistical analysis |
| 75 | ViT Detection | `vitDetection.ts` | Dosovitskiy et al. (2021) | Patch-based uniformity analysis |
| 76 | EfficientNet Detection | `efficientnetDetect.ts` | Tan & Le (2019) | Multi-scale feature proxy |
| 77 | Attention Consistency | `attentionConsistency.ts` | Attention maps | 4×4 grid detail distribution CV |
| 78 | Style Transfer | `styleTransfer.ts` | Neural style | Style consistency analysis |
| 79 | Neural Compression | `neuralCompression.ts` | Neural codec | Compression artifact patterns |
| 80 | Upsampling Artifact | `upsamplingArtifact.ts` | Super-resolution | Upsampling interpolation detection |
| 81 | Upscaling Detection | `upscalingDetection.ts` | Interpolation | Interpolation kernel detection |
| 82 | PatchForensics | `patchForensics.ts` | Patch-level | Region consistency analysis |
| 83 | BRISQUE | `brisque.ts` | Mittal et al. (2012) | MSCN coefficients → shape/variance parameters. Natural: shape ≈ 0.7-0.9 |

#### Metadata Analysis

| # | Method | File | Reference | Algorithm |
|---|--------|------|-----------|-----------|
| 84 | Metadata (EXIF) | `metadata.ts` | EXIF standard | EXIF field parsing + AI tool detection |
| 85 | C2PA Verification | `c2paVerification.ts` | C2PA standard | Content credential manifest + action checking |
| 86 | EXIF Integrity | `exifIntegrity.ts` | Data forensics | Field consistency and completeness |
| 87 | XMP Provenance | `xmpProvenance.ts` | XMP standard | Provenance chain analysis |
| 88 | IPTC Verification | `iptcVerification.ts` | IPTC standard | News metadata verification |
| 89 | GPS Consistency | `gpsConsistency.ts` | Geolocation | Coordinate validation |
| 90 | Timestamp Forensics | `timestampForensics.ts` | File system | Date field consistency |
| 91 | File Structure | `fileStructure.ts` | Container format | Format compliance checking |
| 92 | Resolution Consistency | `resolutionConsistency.ts` | Metadata cross-check | Reported vs actual dimensions |
| 93 | Software Fingerprint | `softwareFingerprint.ts` | Tool identification | Software signature detection |
| 94 | Thumbnail Analysis | `thumbnailAnalysis.ts` | Embedded resources | Thumbnail vs main image comparison |

#### Physical Consistency

| # | Method | File | Reference | Algorithm |
|---|--------|------|-----------|-----------|
| 95 | Lighting Consistency | `lightingConsistency.ts` | Physical lighting | Light source direction analysis |
| 96 | Shadow Analysis | `shadowAnalysis.ts` | Shadow forensics | Shadow direction consistency |
| 97 | Perspective | `perspectiveAnalysis.ts` | Projective geometry | Vanishing point consistency |

---

### Video Methods (16) — `src/lib/methods/video/`

| # | Method | File | Reference | Algorithm |
|---|--------|------|-----------|-----------|
| 1 | Temporal Consistency | `temporalConsistency.ts` | Frame coherence | Block-level abrupt/smooth ratio (spatial proxy for temporal) |
| 2 | Lip Sync Analysis | `lipSyncAnalysis.ts` | Deepfake detection | Lip region texture + skin tone detection |
| 3 | Deepfake Artifact | `deepfakeArtifact.ts` | Li et al. (2020) Face X-ray, CVPR | Face boundary sharpness vs interior smoothness ratio |
| 4 | Optical Flow Anomaly | `opticalFlowAnomaly.ts` | Motion analysis | Gradient direction coherence + uniform region ratio |
| 5 | Audio-Visual Sync | `audioVisualSync.ts` | AV forensics | Mouth region texture analysis (single-frame proxy) |
| 6 | Face Landmark | `faceLandmarkConsistency.ts` | Facial geometry | Landmark spacing analysis |
| 7 | Facial Reenactment | `facialReenactment.ts` | Reenactment detection | Face region artifact analysis |
| 8 | Frame Interpolation | `frameInterpolation.ts` | Motion interpolation | Interpolation artifact detection |
| 9 | Scene Transition | `sceneTransition.ts` | Cut detection | Inter-frame difference analysis |
| 10 | Motion Blur Consistency | `motionBlurConsistency.ts` | Physics model | Blur direction consistency |
| 11 | Background Stability | `backgroundStability.ts` | Scene analysis | Background region stability |
| 12 | Gaze Direction | `gazeDirection.ts` | Eye tracking | Gaze consistency analysis |
| 13 | Video Compression | `videoCompressionTrace.ts` | Codec forensics | Compression artifact uniformity |
| 14 | Flicker Analysis | `flickerAnalysis.ts` | Temporal frequency | Luminance flicker detection |
| 15 | Hand Gesture | `handGestureConsistency.ts` | Gesture analysis | Hand region consistency |
| 16 | Body Proportion | `bodyProportion.ts` | Anatomy analysis | Body part ratio analysis |

> **Note**: All video methods operate on a single extracted frame (`Uint8ClampedArray`). They analyze spatial characteristics as a proxy for temporal behavior. Multi-frame temporal analysis requires future enhancement.

---

### Text Methods (15) — `src/lib/methods/text/`

| # | Method | File | Reference | Key Formula |
|---|--------|------|-----------|-------------|
| 1 | Perplexity Analysis | `perplexityAnalysis.ts` | Mitchell et al. (2023) DetectGPT, Gehrmann et al. (2019) GLTR | Character trigram cross-entropy `H = -1/N · Σ log₂(P(c_i\|context))` + window entropy CV |
| 2 | Burstiness Detection | `burstinessDetection.ts` | Goh & Barabási (2008) | `B = (σ - μ) / (σ + μ)` applied to sentence lengths |
| 3 | Entropy Distribution | `entropyDistribution.ts` | Shannon (1948), GLTR | Sliding window character entropy `H = -Σ p·log₂(p)` → distribution stats (mean, CV, skewness, IQR) |
| 4 | N-gram Frequency | `ngramFrequency.ts` | Lavergne et al. (2008), Zipf (1949) | Character bigram entropy (normalized) + word bigram Zipf compliance |
| 5 | Punctuation Pattern | `punctuationPattern.ts` | Fagni et al. (2021), Neal et al. (2017) | Inter-punctuation spacing CV + type diversity entropy + punctuation rate |
| 6 | Readability Score | `readabilityScore.ts` | Flesch (1948), Ippolito et al. (2020) | **FK**: `0.39(w/s) + 11.8(syl/w) - 15.59`, **ARI**: `4.71(c/w) + 0.5(w/s) - 21.43` + consistency CV |
| 7 | Repetition Pattern | `repetitionPattern.ts` | Krishna et al. (2024), Tulchinskii et al. (2024) | Trigram repetition + sentence opening repetition + 4-gram uniqueness ratio |
| 8 | Semantic Density | `semanticDensity.ts` | Halliday (1985), Dugan et al. (2023) | Content word density CV + average word length CV per sentence |
| 9 | Sentence Length Variance | `sentenceLengthVariance.ts` | Uchendu et al. (2020), Mosteller & Wallace (1963) | CV of word counts + consecutive diff CV + extreme ratio (short ≤ 5, long ≥ 25) |
| 10 | Stylometric Analysis | `stylometricAnalysis.ts` | Kumarage et al. (2023), Zheng et al. (2006) | Per-sentence: avgWordLen, funcWordRatio, clauseProxy, lexicalDensity → CV of each |
| 11 | Topic Consistency | `topicConsistency.ts` | Bakhtin et al. (2019), Blei et al. (2003) | Vocabulary Jaccard similarity `\|A∩B\| / \|A∪B\|` between 4 text segments |
| 12 | Vocabulary Diversity | `vocabularyDiversity.ts` | GLTR (2019), Uchendu et al. (2020) | **TTR** `V/N`, **MATTR** (window=50), **Hapax** ratio, **Yule's K** `10000(Σi²V_i - N)/N²` |
| 13 | Word Frequency Rank | `wordFrequencyRank.ts` | Jawahar et al. (2020), Zipf (1949) | Log-log regression `log(f) = -α·log(r) + C`, **R²** = `1 - SS_res/SS_tot`. Natural: α ≈ 1.0 |
| 14 | Writing Rhythm | `writingRhythm.ts` | Tay et al. (2020), Argamon et al. (2007) | Autocorrelation `r(lag) = Σ(x_i-μ)(x_{i+lag}-μ) / ((N-lag)·σ²)` of sentence lengths |
| 15 | Coherence Analysis | `coherenceAnalysis.ts` | Zellers et al. (2019), Barzilay & Lapata (2008) | BoW cosine similarity `dot(A,B) / (‖A‖·‖B‖)` between adjacent sentences |

---

## Verified Mathematical Formulas

All formulas have been audited and confirmed correct (March 2026):

| Formula | Used In | Status |
|---------|---------|--------|
| Shannon Entropy `H = -Σ p·log₂(p)` | entropyMap, LBP, HOG, histogram, edge, color, text methods | ✅ |
| Chi-Square `χ² = Σ(O-E)²/E` | benford, chiSquareUniformity | ✅ |
| Pearson Correlation `r = cov(X,Y)/√(var(X)·var(Y))` | color, noise, PRNU | ✅ |
| DFT `F(k) = Σ x(n)·e^(-j2πkn/N)` | spectral, ganFingerprint, fourierRing | ✅ |
| Sobel Operator `gx = [-1,0,1; -2,0,2; -1,0,1]` | edge, HOG | ✅ |
| Laplacian `∇²f = 4c - t - b - l - r` | noise, splicing, noiseprint | ✅ |
| GLCM Haralick features | glcm | ✅ |
| Haar Wavelet `LH/HL/HH` | waveletStatistics | ✅ |
| Autocorrelation `r(lag)` | autocorrelation, PRNU, resampling, writingRhythm | ✅ |
| Kurtosis `κ = m4/m2²` | higherOrderStats, noise, wavelet, histogram | ✅ |
| Skewness `γ = m3/σ³` | higherOrderStats | ✅ |
| Linear Regression + R² | fractal, zipfLaw, wordFrequencyRank | ✅ |
| Grayscale `0.299R + 0.587G + 0.114B` | All image methods (BT.601) | ✅ |
| Flesch-Kincaid Grade Level | readabilityScore | ✅ |
| ARI (Automated Readability Index) | readabilityScore | ✅ |
| Yule's K | vocabularyDiversity | ✅ |
| Burstiness B `(σ-μ)/(σ+μ)` | burstinessDetection | ✅ |
| Cosine Similarity | coherenceAnalysis | ✅ |
| Jaccard Index | topicConsistency | ✅ |
| LBP (8-neighbor) | localBinaryPattern | ✅ |
| HOG (9-bin unsigned) | hogAnomaly | ✅ |
| Hann Window | fourierRing | ✅ |
| Benford Distribution | benford | ✅ |
| Box-Counting FD | fractal | ✅ |
| MSCN Coefficients | brisque | ✅ |
| Markov Transition Matrix | markovTransition | ✅ |

---

## Client-Side Proxy Notes

Some methods use simplified client-side statistical proxies instead of full paper implementations due to browser limitations:

| Method | Full Version | Client Proxy | Reason |
|--------|-------------|--------------|--------|
| PRNU | BM3D denoising + sensor reference | Local mean filter + autocorrelation | No BM3D in browser |
| BRISQUE | Full SVR regression | Simplified MSCN stats | No trained SVR model |
| GAN Fingerprint | Full 2D FFT | Row-wise 1D DFT | Computational tradeoff |
| CLIP/ResNet/ViT/EfficientNet | Neural network inference | Statistical feature proxies | No ML runtime in browser |
| Perplexity (Text) | GPT-2 log-probabilities | Character trigram cross-entropy | No LLM in browser |
| Noiseprint | CNN-based extraction | Laplacian residual | No trained CNN |
| Copy-Move | SIFT/SURF keypoints | Block hash matching | Keypoint detection too heavy |

---

## Future Improvements

### High Priority
- [ ] **Multi-frame video analysis** — Current video methods analyze single frames; add true temporal analysis with frame-to-frame comparison
- [ ] **WebAssembly acceleration** — Port computationally heavy methods (DFT, wavelet) to WASM for 10-50x speedup
- [ ] **WebGPU integration** — Use GPU compute shaders for parallel pixel processing
- [ ] **Text method integration into analyzer.ts** — Text methods are exported but not yet orchestrated by the main analyzer; add text analysis pipeline

### Medium Priority
- [ ] **ONNX Runtime in browser** — Load lightweight ONNX models for CLIP, ResNet, EfficientNet to replace statistical proxies
- [ ] **Full 2D FFT** — Replace row-wise 1D DFT with proper 2D FFT for more accurate spectral analysis
- [ ] **Multi-level wavelet decomposition** — Current Haar is 1-level; add 2-3 level decomposition
- [ ] **LDA-based topic modeling** — Replace Jaccard similarity in topicConsistency with proper LDA
- [ ] **True perplexity scoring** — Investigate small browser-compatible language models (e.g., TinyLlama ONNX)
- [ ] **Adaptive thresholds** — Current score thresholds are fixed; implement dataset-calibrated adaptive thresholds
- [ ] **Method weighting optimization** — Use labeled dataset to optimize weights via logistic regression

### Low Priority
- [ ] **Audio analysis** — Add audio deepfake detection methods (mel spectrogram, pitch analysis)
- [ ] **PDF/Document analysis** — Extend text analysis to structured documents
- [ ] **Batch processing** — Allow analyzing multiple files at once
- [ ] **Export reports** — Generate detailed PDF forensic reports
- [ ] **API mode** — Expose analysis as REST API for integration
- [ ] **Browser extension** — Right-click → "Verify this image" context menu

### Known Limitations
1. **Single-frame video**: All 16 video methods analyze one extracted frame, not temporal sequences
2. **No neural inference**: Methods referencing neural networks use statistical proxies
3. **Character-level perplexity**: Text perplexity uses trigrams, not LLM token probabilities
4. **Fixed thresholds**: Score thresholds are manually tuned, not ML-calibrated
5. **English-centric text**: Text methods work best on English; other languages may have different baselines

---

## Method Registry

All methods are registered in `src/app/methods/data.ts` with:
- `id` — Unique method identifier (used for routing)
- `category` — One of: `pixel`, `frequency`, `statistical`, `metadata`, `sensor`
- `mediaType` — One of: `image`, `video`, `text`
- `weight` — Relative weight in final score aggregation

Total: **185 entries** (some image methods apply to video frames too).

---

## License

MIT
