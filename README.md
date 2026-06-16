# SourceVerify — AI-Generated Content Detector

Advanced forensic analysis tool with **500 analysis method implementations** across image, video, and text — the largest client-side AI detection method library. A curated paper-faithful runtime core drives the default analysis; all other methods remain browsable for research and traceability. Built with Next.js 16 + TypeScript + Tailwind CSS 4.

## Features

- **500 Analysis Methods** — 186 image + 165 video + 149 text detection methods, with 700 detail pages and full i18n
- **Curated Runtime Core** — Default analysis is restricted to ~38 paper-faithful methods (32 image + 6 text); all other methods remain browsable
- **Image & Video & Text** — Supports JPEG, PNG, WebP, GIF, MP4, WebM, and plain text
- **Client-Side Processing** — All analysis runs locally in browser (zero server upload)
- **Privacy-First** — No data leaves the user's device
- **Multi-Language** — Full i18n in 6 languages (EN, VI, ZH, JA, KO, ES) for all 700 method detail pages
- **Academic References** — Every method links to cited papers, standards, or algorithms; benchmark accuracy report included

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
│   ├── analyzer.ts          # Main orchestrator with paper-faithful runtime filtering
│   ├── serverAnalyzer.ts    # Server-side analysis entry
│   ├── types.ts             # Shared types + verified runtime allowlist (~38 methods)
│   └── methods/
│       ├── index.ts          # Barrel exports (502 exports)
│       ├── pixelUtils.ts     # Shared pixel utilities (gray(), etc.)
│       ├── image/            # 186 image method implementations
│       ├── video/            # 165 video method implementations (single-frame proxy)
│       └── text/             # 149 text method implementations
└── app/
    └── methods/
        ├── data.ts           # Full method registry (697 entries)
        ├── _components/      # Shared UI components (MethodDetail, etc.)
        ├── image/            # 258 image method pages + i18n (6 languages each)
        ├── video/            # 228 video method pages + i18n (6 languages each)
        └── text/             # 214 text method pages + i18n (6 languages each)
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

<!-- METHOD_ACCURACY_REPORT:START -->
## Method Accuracy Benchmark

Generated on **2026-06-16T10:20:02.514Z** by `npm run benchmark:methods`.

### Benchmark Rules

- `strict accuracy`: correct / total evaluated, and `score = 50` counts as incorrect because the method stayed uncertain.
- `classified accuracy`: correct / classified, excluding `score = 50` outputs.
- `coverage`: classified / evaluated. Higher coverage means the method avoided the neutral `50` score more often.
- Image and video-frame benchmarks use a balanced local dataset of **60 real** + **60 AI** images, resized to max **320px** for repeatability.
- Only the **paper-faithful runtime subset** is reported below; proxy/simplified methods are excluded from the final tables.
- Dedicated video-only methods remain excluded by default until they are re-implemented faithfully from source papers.
- Any video-compatible numbers here therefore represent only the vetted frame-based subset, not full temporal/audio video detection.
- Text methods are measured on a **synthetic local corpus** of human-like vs AI-like paragraphs because the repository currently has no labeled local text corpus.
- Server-side API benchmarking uses **neutral file names** (`sample-0001.jpg`) to avoid filename label leakage inside `Metadata Analysis`.

### Coverage Summary

| Group | Methods | Corpus | Notes |
|---|---:|---|---|
| Image runtime methods | 26 | balanced local image set | vetted paper-faithful subset only |
| Video runtime methods | 0 | balanced local image set | dedicated video subset currently disabled by fidelity gate |
| Text runtime methods | 6 | synthetic balanced text set | provisional accuracy only |
| Server API signals | 8 | balanced local image set | includes final verdict + internal signals |

### Top-Level Findings

- Best image method strict accuracy: **SRM Filter Response** at **79.2%**.
- Best video runtime method strict accuracy: **n/a** at **n/a**.
- Best text method strict accuracy: **Punctuation Pattern** at **50.0%**.
- Server analyzer final verdict strict accuracy: **96.7%** with **100.0%** coverage.

<details>
<summary>Image Methods (26)</summary>

| Method | ID | Strict Acc | Classified Acc | Coverage | Score Gap | Errors | Avg ms | Status |
|---|---|---:|---:|---:|---:|---:|---:|---|
| SRM Filter Response | `image/srmFilter` | 79.2% | 79.2% | 100.0% | 9.8 | 0 | 0.1 | ok |
| Histogram Gradient | `image/histogramGradient` | 53.3% | 54.2% | 98.3% | 6.2 | 0 | 1.3 | ok |
| CFA Pattern Detection | `image/cfa` | 50.8% | 50.8% | 100.0% | 0.9 | 0 | 0.3 | ok |
| Double JPEG Detection | `image/doubleJpeg` | 50.8% | 50.8% | 100.0% | -4.9 | 0 | 1.6 | ok |
| Steganalysis Detection | `image/steganalysisDetect` | 50.8% | 50.8% | 100.0% | 5.8 | 0 | 0.4 | ok |
| Color Profile Metadata | `image/colorProfileMeta` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.1 | ok |
| EXIF Integrity Validation | `image/exifIntegrity` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.1 | ok |
| GPS Consistency Analysis | `image/gpsConsistency` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.1 | ok |
| IPTC Data Verification | `image/iptcVerification` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.1 | ok |
| Pixel Co-occurrence | `image/pixelCooccurrence` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 6.1 | ok |
| Timestamp Forensics | `image/timestampForensics` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.1 | ok |
| Histogram Analysis | `image/histogram` | 50.0% | 62.5% | 80.0% | 1.7 | 0 | 1.5 | ok |
| Resolution Consistency | `image/resolutionConsistency` | 50.0% | 84.5% | 59.2% | 17.3 | 0 | 0.1 | ok |
| Autocorrelation Regularity | `image/autocorrelation` | 49.2% | 49.2% | 100.0% | -1.0 | 0 | 3.8 | ok |
| DCT Block Artifacts | `image/dct` | 49.2% | 70.2% | 70.0% | 4.5 | 0 | 1.0 | ok |
| Laplacian Edge Sharpness | `image/laplacianEdge` | 48.3% | 51.8% | 93.3% | 1.5 | 0 | 12.7 | ok |
| Perceptual Hash Analysis | `image/perceptualHash` | 47.5% | 55.9% | 85.0% | 3.8 | 0 | 0.2 | ok |
| Resampling Detection | `image/resamplingDetect` | 44.2% | 44.2% | 100.0% | -3.4 | 0 | 5.7 | ok |
| Median Filtering Detection | `image/medianFilter` | 41.7% | 52.6% | 79.2% | -1.6 | 0 | 3.3 | ok |
| Mutual Information | `image/mutualInfo` | 37.5% | 37.5% | 100.0% | -5.1 | 0 | 2.4 | ok |
| Benford's Law | `image/benford` | 33.3% | 33.3% | 100.0% | -18.2 | 0 | 2.4 | ok |
| Tamura Texture Features | `image/tamura` | 31.7% | 33.9% | 93.3% | -2.2 | 0 | 12.1 | ok |
| Color Coherence Vector | `image/colorCoherence` | 30.8% | 38.9% | 79.2% | -7.2 | 0 | 3.3 | ok |
| Local Phase Quantization | `image/lpq` | 17.5% | 42.9% | 40.8% | -1.5 | 0 | 3.6 | ok |
| Chi-Square Uniformity | `image/chiSquareUniformity` | 13.3% | 13.3% | 100.0% | -27.3 | 0 | 0.4 | ok |
| Blocking Artifact Grid Analysis | `image/blockingArtifact` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.4 | ok |

</details>

<details>
<summary>Video Methods (0)</summary>

| Method | ID | Strict Acc | Classified Acc | Coverage | Score Gap | Errors | Avg ms | Status |
|---|---|---:|---:|---:|---:|---:|---:|---|

</details>

<details>
<summary>Text Methods (6)</summary>

| Method | ID | Strict Acc | Classified Acc | Coverage | Score Gap | Errors | Avg ms | Status |
|---|---|---:|---:|---:|---:|---:|---:|---|
| Punctuation Pattern | `text/punctuationPattern` | 50.0% | 50.0% | 100.0% | -5.5 | 0 | 0.0 | ok |
| Repetition Pattern | `text/repetitionPattern` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.1 | ok |
| Word Length Distribution | `text/wordLengthDist` | 45.8% | 45.8% | 100.0% | -6.0 | 0 | 0.0 | ok |
| Readability Score | `text/readabilityScore` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |
| Sentence Length Variance | `text/sentenceLengthVariance` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |
| Type-Token Ratio | `text/typeTokenRatio` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.1 | ok |

</details>

<details>
<summary>Server Analyzer Verdict + Signals (8)</summary>

| Method | ID | Strict Acc | Classified Acc | Coverage | Score Gap | Errors | Avg ms | Status |
|---|---|---:|---:|---:|---:|---:|---:|---|
| Server Analyzer Verdict | `server/verdict` | 96.7% | 96.7% | 100.0% | 36.9 | 0 | 120.0 | ok |
| Noise Residual | `server/noise-residual` | 82.5% | 82.5% | 100.0% | 23.1 | 0 | 120.0 | ok |
| Compression Density | `server/compression-density` | 75.0% | 90.0% | 83.3% | 43.3 | 0 | 120.0 | ok |
| Spectral Nyquist | `server/spectral-nyquist` | 51.7% | 52.5% | 98.3% | -1.4 | 0 | 120.0 | ok |
| Gradient Micro-Texture | `server/gradient-micro-texture` | 50.0% | 50.4% | 99.2% | 0.4 | 0 | 120.0 | ok |
| Edge Coherence | `server/edge-coherence` | 45.8% | 61.1% | 75.0% | 5.2 | 0 | 120.0 | ok |
| Color Correlation | `server/color-correlation` | 28.3% | 32.1% | 88.3% | -7.7 | 0 | 120.0 | ok |
| Metadata Analysis | `server/metadata-analysis` | 0.0% | n/a | 0.0% | 0.0 | 0 | 120.0 | ok |

</details>

### Caveats

- Image/video numbers are only as representative as the local benchmark images currently present in this repository.
- Video-specific methods are intentionally excluded from the default runtime report until their implementations match the cited papers more closely.
- Text results are **provisional** because the benchmark corpus is synthetic and intentionally balanced.
- `Metadata Analysis` in the server pipeline is effectively a file-name heuristic, so its accuracy changes drastically if filenames contain source hints.

<!-- METHOD_ACCURACY_REPORT:END -->

## All 500 Analysis Method Implementations

> Full method index with IDs: see [`docs/METHOD_INDEX.md`](docs/METHOD_INDEX.md)  
> Benchmark accuracy for every method: see the auto-generated [Method Accuracy Benchmark](#method-accuracy-benchmark) above

### Image Methods (186) — `src/lib/methods/image/`

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

### Video Methods (165) — `src/lib/methods/video/`

165 video analysis methods covering deepfake detection, facial analysis, body/gesture analysis, temporal coherence, audio-visual sync, and codec forensics. Key methods include:

| Category | Example Methods | Count |
|----------|----------------|------:|
| Facial analysis | Lip Sync, Face Landmark, Face X-Ray, Iris Detail, Facial Symmetry, Teeth Consistency | ~40 |
| Body & gesture | Body Proportion, Finger Geometry, Gait Analysis, Shoulder Alignment, Hand Gesture | ~10 |
| Temporal coherence | Temporal Consistency, Frame Interpolation, Flicker, Inter-Frame Forgery, Frame Drop | ~20 |
| Audio-visual | Audio-Visual Sync, Audio Spectral, Phoneme Correlation, Speech Cadence, Voice F0 | ~10 |
| Scene & physics | Background Stability, Depth Consistency, Bokeh, Lens Distortion, Reflection Physics | ~15 |
| Texture & skin | Skin Texture, Skin Pore, Cheek Texture, Forehead Texture, Skin Color Drift | ~15 |
| Codec/compression | Video Codec Analysis, QP Analysis, B-Frame Consistency, Video Compression Trace | ~10 |
| Other | Motion Vector, Edge Ringing, Watermark, Stabilization Artifact, etc. | ~45 |

> Full list: see `docs/METHOD_INDEX.md` (V-001 to V-165)

> **Note**: All video methods operate on a single extracted frame (`Uint8ClampedArray`). They analyze spatial characteristics as a proxy for temporal behavior. Multi-frame temporal analysis requires future enhancement.

---

### Text Methods (149) — `src/lib/methods/text/`

149 text analysis methods covering statistical linguistics, stylometry, AI-specific detection, and discourse analysis. Key methods include:

| Category | Example Methods | Count |
|----------|----------------|------:|
| Statistical NLP | Perplexity, Entropy Distribution, N-gram Frequency, Zipf Deviation, Token Predictability | ~20 |
| Stylometric | Stylometric Analysis, Writing Rhythm, Vocabulary Diversity, Sentence Length Variance | ~15 |
| AI-specific detectors | Binoculars, Fast-DetectGPT, Ghostbuster, RADAR, DNA-GPT, PHD Detection | ~15 |
| Lexical analysis | Vocabulary Richness, Hapax Legomena, Lexical Density, Type-Token Ratio, Word Rarity | ~15 |
| Syntax & grammar | POS Tag Analysis, Clause Depth, Syntactic Complexity, Mean Dependency Parse | ~10 |
| Discourse & coherence | Coherence Analysis, Topic Consistency, Semantic Coherence Graph, Discourse Markers | ~10 |
| Pragmatic & rhetorical | Hedging Language, Rhetorical Device, Analogy/Simile, Emotional Arc | ~10 |
| Punctuation & formatting | Punctuation Pattern, Comma Frequency, Semicolon Usage, List Enumeration | ~10 |
| Human-like signals | First Person Usage, Contraction Usage, Filler Words, Colloquial Expression, Typo Error | ~15 |
| Other | Text Compression Ratio, Text DNA Watermark, Readability Score, etc. | ~29 |

> Full list: see `docs/METHOD_INDEX.md` (T-001 to T-149)

#### Core Text Methods (original 15 with detailed formulas)

| # | Method | Reference | Key Formula |
|---|--------|-----------|-------------|
| 1 | Perplexity Analysis | Mitchell et al. (2023) DetectGPT, GLTR (2019) | Character trigram cross-entropy `H = -1/N · Σ log₂(P(c_i\|context))` |
| 2 | Burstiness Detection | Goh & Barabási (2008) | `B = (σ - μ) / (σ + μ)` on sentence lengths |
| 3 | Entropy Distribution | Shannon (1948), GLTR | Sliding window character entropy `H = -Σ p·log₂(p)` |
| 4 | N-gram Frequency | Lavergne et al. (2008), Zipf (1949) | Character bigram entropy + word bigram Zipf compliance |
| 5 | Punctuation Pattern | Fagni et al. (2021), Neal et al. (2017) | Inter-punctuation spacing CV + type diversity entropy |
| 6 | Readability Score | Flesch (1948), Ippolito et al. (2020) | FK + ARI readability indices + consistency CV |
| 7 | Repetition Pattern | Krishna et al. (2024), Tulchinskii et al. (2024) | Trigram repetition + 4-gram uniqueness ratio |
| 8 | Semantic Density | Halliday (1985), Dugan et al. (2023) | Content word density CV per sentence |
| 9 | Sentence Length Variance | Uchendu et al. (2020), Mosteller & Wallace (1963) | CV of word counts + extreme ratio |
| 10 | Stylometric Analysis | Kumarage et al. (2023), Zheng et al. (2006) | Per-sentence feature CV analysis |
| 11 | Topic Consistency | Bakhtin et al. (2019), Blei et al. (2003) | Vocabulary Jaccard similarity between segments |
| 12 | Vocabulary Diversity | GLTR (2019), Uchendu et al. (2020) | TTR, MATTR, Hapax ratio, Yule's K |
| 13 | Word Frequency Rank | Jawahar et al. (2020), Zipf (1949) | Log-log regression R² for Zipf compliance |
| 14 | Writing Rhythm | Tay et al. (2020), Argamon et al. (2007) | Sentence length autocorrelation |
| 15 | Coherence Analysis | Zellers et al. (2019), Barzilay & Lapata (2008) | BoW cosine similarity between adjacent sentences |

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
1. **Single-frame video**: All 165 video methods analyze one extracted frame, not temporal sequences
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

Total: **697 registry entries** (255 image + 228 video + 214 text).  
Runtime implementations: **500** (186 image + 165 video + 149 text).  
Paper-faithful runtime core: **~38** (32 image + 6 text + 0 video-only).

---

## License

MIT
