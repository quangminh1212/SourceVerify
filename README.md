# SourceVerify — AI-Generated Content Detector

Advanced forensic analysis tool with a curated, paper-faithful runtime core for **images** and **text**. Methods that could not be defended as paper-faithful in the current browser architecture are archived from active runtime exposure. Built with Next.js 16 + TypeScript + Tailwind CSS 4.

## Features

- **Curated Runtime Core** — Active detectors are restricted to the subset that is currently defensible against the cited descriptor/statistic or metadata-check literature
- **Archived Experimental Routes** — Legacy method pages remain reachable for traceability, but non-verified methods are no longer active in analysis runtime
- **Image & Video & Text** — Supports JPEG, PNG, WebP, GIF, MP4, WebM, and plain text
- **Client-Side Processing** — All analysis runs locally in browser (zero server upload)
- **Privacy-First** — No data leaves the user's device
- **Multi-Language** — i18n support (EN, VI, KO, JA, ZH, etc.)
- **Academic References** — Active runtime methods are limited to the verified core; archived routes preserve historical references for traceability

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
│   ├── types.ts             # Shared types + verified runtime allowlist
│   └── methods/
│       ├── index.ts          # Barrel exports for all method implementations
│       ├── pixelUtils.ts     # Shared pixel utilities (gray(), etc.)
│       ├── image/            # Image method implementations
│       ├── video/            # Archived/experimental video method implementations
│       └── text/             # Text method implementations
└── app/
    └── methods/
        ├── data.ts           # Active method registry filtered by verified allowlist
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

<!-- METHOD_ACCURACY_REPORT:START -->
## Method Accuracy Benchmark

Generated on **2026-03-12T09:28:02.570Z** by `npm run benchmark:methods`.

### Benchmark Rules

- `strict accuracy`: correct / total evaluated, and `score = 50` counts as incorrect because the method stayed uncertain.
- `classified accuracy`: correct / classified, excluding `score = 50` outputs.
- `coverage`: classified / evaluated. Higher coverage means the method avoided the neutral `50` score more often.
- Image and video-frame benchmarks use a balanced local dataset of **120 real** + **120 AI** images, resized to max **320px** for repeatability.
- Video methods are measured as **single-frame proxy accuracy** because the repository currently has no labeled local video dataset.
- Text methods are measured on a **synthetic local corpus** of human-like vs AI-like paragraphs because the repository currently has no labeled local text corpus.
- Server-side API benchmarking uses **neutral file names** (`sample-0001.jpg`) to avoid filename label leakage inside `Metadata Analysis`.

### Coverage Summary

| Group | Methods | Corpus | Notes |
|---|---:|---|---|
| Image runtime methods | 186 | balanced local image set | direct pixel benchmark |
| Video runtime methods | 165 | balanced local image set | frame proxy only, no temporal ground truth |
| Text runtime methods | 149 | synthetic balanced text set | provisional accuracy only |
| Server API signals | 7 | balanced local image set | includes final verdict + internal signals |

### Top-Level Findings

- Best image method strict accuracy: **Moiré Pattern** at **82.5%**.
- Best video frame-proxy method strict accuracy: **Lip Sync Analysis** at **89.6%**.
- Best text method strict accuracy: **First Person Usage** at **100.0%**.
- Server analyzer final verdict strict accuracy: **52.5%** with **73.8%** coverage.

<details>
<summary>Image Methods (186)</summary>

| Method | ID | Strict Acc | Classified Acc | Coverage | Score Gap | Errors | Avg ms | Status |
|---|---|---:|---:|---:|---:|---:|---:|---|
| Moiré Pattern | `image/moirePattern` | 82.5% | 82.5% | 100.0% | 17.8 | 0 | 0.1 | ok |
| Isolated Pixel | `image/isolatedPixel` | 81.7% | 81.7% | 100.0% | 11.5 | 0 | 0.4 | ok |
| SRM Filter Response | `image/srmFilter` | 77.5% | 77.5% | 100.0% | 8.3 | 0 | 0.1 | ok |
| Anti-aliasing Consistency | `image/antiAliasingConsistency` | 69.6% | 69.6% | 100.0% | 8.8 | 0 | 0.3 | ok |
| Image Complexity | `image/imageComplexity` | 68.8% | 68.8% | 100.0% | 2.2 | 0 | 0.2 | ok |
| Wiener Filter Residual | `image/wienerResidual` | 67.5% | 67.5% | 100.0% | 3.2 | 0 | 0.1 | ok |
| Noise Residual | `image/noise` | 67.5% | 67.8% | 99.6% | 11.8 | 0 | 2.5 | ok |
| Bloom Artifact | `image/bloomArtifact` | 66.3% | 66.3% | 100.0% | 7.5 | 0 | 0.1 | ok |
| Reflection Consistency | `image/reflectionConsistency` | 65.4% | 65.4% | 100.0% | 6.4 | 0 | 0.2 | ok |
| Pixel Bit Plane | `image/pixelBitPlane` | 62.5% | 69.1% | 90.4% | 8.5 | 0 | 0.1 | ok |
| Hot Pixel Detection | `image/hotPixelDetection` | 60.4% | 60.4% | 100.0% | 3.4 | 0 | 0.4 | ok |
| Local Entropy | `image/localEntropy` | 60.4% | 60.4% | 100.0% | 1.7 | 0 | 1.3 | ok |
| Spatial Rich Model | `image/spatialRichModel` | 59.6% | 59.6% | 100.0% | 2.5 | 0 | 0.2 | ok |
| JPEG Coefficient Distribution | `image/jpegCoefficientDist` | 58.8% | 58.8% | 100.0% | 5.2 | 0 | 0.1 | ok |
| Aperture Diffraction | `image/apertureDiffraction` | 57.9% | 57.9% | 100.0% | 2.9 | 0 | 0.1 | ok |
| EfficientNet Feature Analysis | `image/efficientnetDetect` | 57.1% | 57.1% | 100.0% | 2.8 | 0 | 1.8 | ok |
| Patch Similarity Matrix | `image/patchSimilarityMatrix` | 57.1% | 57.1% | 100.0% | 3.0 | 0 | 0.1 | ok |
| Color Gamut Analysis | `image/colorGamut` | 56.3% | 56.3% | 100.0% | 1.1 | 0 | 0.6 | ok |
| Color Moment Statistics | `image/colorMomentStatistics` | 56.3% | 56.3% | 100.0% | 4.3 | 0 | 3.5 | ok |
| Texture Consistency | `image/texture` | 55.8% | 55.8% | 100.0% | 10.4 | 0 | 0.2 | ok |
| Illuminant Map Analysis | `image/illuminantMap` | 55.4% | 55.4% | 100.0% | 0.7 | 0 | 0.2 | ok |
| Cross Gradient | `image/crossGradient` | 54.6% | 54.6% | 100.0% | 9.0 | 0 | 0.1 | ok |
| Lens Distortion | `image/lensDistortionImage` | 54.6% | 54.6% | 100.0% | 1.8 | 0 | 0.1 | ok |
| DCT Block Artifacts | `image/dct` | 54.6% | 71.6% | 76.3% | 5.9 | 0 | 0.6 | ok |
| Laplacian Variance | `image/laplacianVariance` | 54.2% | 54.2% | 100.0% | 7.8 | 0 | 0.1 | ok |
| Skin Texture Frequency | `image/skinTextureFreq` | 54.2% | 54.2% | 100.0% | 0.2 | 0 | 0.1 | ok |
| Color Channel Noise | `image/colorChannelNoise` | 53.8% | 53.8% | 100.0% | 2.9 | 0 | 0.1 | ok |
| ResNet Feature Analysis | `image/resnetClassifier` | 52.9% | 52.9% | 100.0% | 1.0 | 0 | 0.3 | ok |
| Texture Periodicity | `image/texturePeriodicity` | 52.9% | 52.9% | 100.0% | 0.8 | 0 | 0.3 | ok |
| CFA Pattern Detection | `image/cfa` | 52.5% | 52.5% | 100.0% | 0.6 | 0 | 0.3 | ok |
| Tone Mapping Detection | `image/toneMapping` | 52.5% | 52.5% | 100.0% | 1.1 | 0 | 0.3 | ok |
| Gradient Micro-Texture | `image/gradient` | 52.5% | 55.3% | 95.0% | 2.5 | 0 | 1.0 | ok |
| Micro Texture | `image/microTextureAnalysis` | 52.1% | 52.1% | 100.0% | -2.8 | 0 | 0.1 | ok |
| Richardson-Lucy Deconv | `image/richardsonLucy` | 52.1% | 52.1% | 100.0% | 1.1 | 0 | 0.0 | ok |
| Gram Matrix Analysis | `image/gramMatrix` | 51.7% | 51.7% | 100.0% | 2.8 | 0 | 0.1 | ok |
| Histogram Gradient | `image/histogramGradient` | 51.7% | 53.2% | 97.1% | 6.0 | 0 | 1.1 | ok |
| Gradient Orientation Hist | `image/gradOrientHist` | 51.7% | 79.0% | 65.4% | 9.9 | 0 | 0.3 | ok |
| Steganalysis Detection | `image/steganalysisDetect` | 51.2% | 51.2% | 100.0% | 6.3 | 0 | 0.4 | ok |
| Color Temperature Consistency | `image/colorTemperature` | 50.8% | 50.8% | 100.0% | 2.3 | 0 | 0.2 | ok |
| Double JPEG Detection | `image/doubleJpeg` | 50.8% | 50.8% | 100.0% | -4.6 | 0 | 1.5 | ok |
| Patch-level Forensics | `image/patchForensics` | 50.8% | 50.8% | 100.0% | 0.7 | 0 | 0.3 | ok |
| Attention Map Consistency | `image/attentionConsistency` | 50.4% | 50.4% | 100.0% | 0.3 | 0 | 0.2 | ok |
| Chromatic Aberration | `image/chromatic` | 50.4% | 50.4% | 100.0% | -6.8 | 0 | 0.1 | ok |
| Color Coherence Vector | `image/colorCoherence` | 50.4% | 57.9% | 87.1% | 0.7 | 0 | 1.8 | ok |
| Camera Model Identification | `image/cameraModel` | 50.0% | 50.0% | 100.0% | 7.0 | 0 | 0.3 | ok |
| Color Profile Metadata | `image/colorProfileMeta` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Contrast Enhancement Detection | `image/contrastEnhancement` | 50.0% | 50.0% | 100.0% | 0.6 | 0 | 0.9 | ok |
| DCT Energy Compaction | `image/dctEnergyCompact` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| EXIF Integrity Validation | `image/exifIntegrity` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Fractal Dimension | `image/fractal` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 2.5 | ok |
| GPS Consistency Analysis | `image/gpsConsistency` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| IPTC Data Verification | `image/iptcVerification` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Pixel Co-occurrence | `image/pixelCooccurrence` | 50.0% | 50.0% | 100.0% | -0.8 | 0 | 5.3 | ok |
| Posterization | `image/posterizationDetect` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.1 | ok |
| Sensor Pattern Noise | `image/prnu` | 50.0% | 50.0% | 100.0% | -5.3 | 0 | 24.6 | ok |
| SIFT Keypoint Forensics | `image/siftForensics` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.8 | ok |
| Spectral Nyquist Analysis | `image/spectral` | 50.0% | 50.0% | 100.0% | -1.6 | 0 | 227.9 | ok |
| Spectral Decay Rate | `image/spectralDecayRate` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 6.5 | ok |
| Structural Complexity | `image/structuralComplexity` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.2 | ok |
| Style Transfer Detection | `image/styleTransfer` | 50.0% | 50.0% | 100.0% | 3.6 | 0 | 0.5 | ok |
| Thumbnail Consistency Analysis | `image/thumbnailAnalysis` | 50.0% | 50.0% | 100.0% | 0.2 | 0 | 0.2 | ok |
| Timestamp Forensics | `image/timestampForensics` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Upscaling Detection | `image/upscalingDetection` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.7 | ok |
| Splicing Detection | `image/splicingDetection` | 50.0% | 50.8% | 98.3% | 1.6 | 0 | 0.4 | ok |
| Histogram Analysis | `image/histogram` | 50.0% | 64.5% | 77.5% | 2.4 | 0 | 1.5 | ok |
| Autocorrelation Regularity | `image/autocorrelation` | 49.6% | 49.6% | 100.0% | -0.6 | 0 | 3.2 | ok |
| Dynamic Range | `image/dynamicRangeAnalysis` | 49.6% | 49.6% | 100.0% | -2.7 | 0 | 0.1 | ok |
| Edge Density Map | `image/edgeDensityMap` | 49.6% | 49.6% | 100.0% | -4.6 | 0 | 0.5 | ok |
| Neural Compression Artifact Detection | `image/neuralCompression` | 49.6% | 49.6% | 100.0% | -3.1 | 0 | 0.3 | ok |
| Perceptual Hash Analysis | `image/perceptualHash` | 49.6% | 57.8% | 85.8% | 5.0 | 0 | 0.2 | ok |
| Second Order Gradient | `image/secondOrderGrad` | 48.8% | 48.8% | 100.0% | 4.9 | 0 | 0.1 | ok |
| Census Transform Analysis | `image/censusTransform` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Contourlet Transform Analysis | `image/contourletAnalysis` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Convolutional Trace Analysis | `image/convolutionalTrace` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Curvelet Transform Analysis | `image/curveletTransform` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Discrete Cosine Energy Profile | `image/discreteCosineEnergy` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Gabor Phase Congruency | `image/gaborPhase` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Gabor Wavelet Filter Bank | `image/gaborWaveletBank` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Gradient Divergence Field | `image/gradientDivergence` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Gradient-Weighted Activation Map | `image/gradientWeightedCam` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Harris Corner Response | `image/harrisCorner` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Hessian Matrix Analysis | `image/hessianMatrix` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Laplacian Pyramid Residual | `image/laplacianPyramid` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Log-Gabor Filter Analysis | `image/logGaborFilter` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Hu Moment Invariants | `image/momentInvariants` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Multiscale Entropy Analysis | `image/multiscaleEntropy` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| NIQE Quality Score | `image/niqeScore` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Pixel Value Differencing | `image/pixelValueDiff` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Run Length Matrix Analysis | `image/runLengthMatrix` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Shearlet Transform Analysis | `image/shearletAnalysis` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Sparse Representation Analysis | `image/sparseRepresentation` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| SSIM Map Analysis | `image/ssimMap` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Steerable Pyramid Decomposition | `image/steerablePyramid` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.4 | ok |
| SVD Decomposition Analysis | `image/svdDecomposition` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.2 | ok |
| Total Variation Norm Analysis | `image/totalVariation` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.3 | ok |
| Wavelet Packet Decomposition | `image/waveletPacket` | 48.3% | 48.3% | 100.0% | 1.5 | 0 | 0.3 | ok |
| Brightness Gradient | `image/brightnessGradient` | 48.3% | 49.2% | 98.3% | 6.0 | 0 | 0.0 | ok |
| Bilateral Symmetry | `image/bilateralSymmetry` | 47.9% | 47.9% | 100.0% | 5.3 | 0 | 0.7 | ok |
| BRISQUE Quality Assessment | `image/brisque` | 47.9% | 47.9% | 100.0% | 4.3 | 0 | 1.8 | ok |
| RGB Correlation | `image/rgbCorrelation` | 47.9% | 47.9% | 100.0% | -6.4 | 0 | 0.1 | ok |
| Demosaicing Artifact Analysis | `image/demosaicingDetect` | 47.9% | 56.9% | 84.2% | 5.3 | 0 | 0.1 | ok |
| Noiseprint Extraction | `image/noiseprintExtraction` | 47.5% | 47.5% | 100.0% | 1.4 | 0 | 0.9 | ok |
| ViT Token Analysis | `image/vitDetection` | 47.5% | 47.5% | 100.0% | 1.1 | 0 | 0.3 | ok |
| Scharr Gradient | `image/scharrGradient` | 47.5% | 48.7% | 97.5% | 6.4 | 0 | 0.2 | ok |
| Laplacian Edge Sharpness | `image/laplacianEdge` | 46.7% | 50.0% | 93.3% | 1.6 | 0 | 11.6 | ok |
| Error Level Analysis | `image/errorLevel` | 46.7% | 51.4% | 90.8% | 3.2 | 0 | 0.2 | ok |
| Chroma Subsampling | `image/chromaSubsampling` | 46.7% | 54.6% | 85.4% | 2.4 | 0 | 0.2 | ok |
| Gabor Energy Dist | `image/gaborEnergy` | 45.8% | 52.9% | 86.7% | 1.7 | 0 | 0.2 | ok |
| Pixel Symmetry | `image/pixelSymmetry` | 45.4% | 45.4% | 100.0% | -0.2 | 0 | 0.1 | ok |
| Contour Smoothness | `image/contourSmooth` | 45.4% | 88.6% | 51.2% | 10.8 | 0 | 0.1 | ok |
| Resampling Detection | `image/resamplingDetect` | 44.6% | 44.6% | 100.0% | -3.2 | 0 | 5.1 | ok |
| Color Channel Correlation | `image/color` | 44.2% | 45.3% | 97.5% | -6.1 | 0 | 1.0 | ok |
| Noise Granularity | `image/noiseGranularity` | 43.8% | 43.8% | 100.0% | 0.1 | 0 | 0.2 | ok |
| Edge Coherence | `image/edge` | 43.8% | 52.5% | 83.3% | 0.5 | 0 | 47.2 | ok |
| Luma Gradient Angle | `image/lumaGradientAngle` | 43.8% | 63.6% | 68.8% | 8.7 | 0 | 0.3 | ok |
| CLIP Embedding Analysis | `image/clipDetection` | 43.3% | 43.3% | 100.0% | -7.8 | 0 | 1.0 | ok |
| Median Filtering Detection | `image/medianFilter` | 42.1% | 53.4% | 78.8% | -1.7 | 0 | 3.1 | ok |
| Zernike Moment Analysis | `image/zernikeMoments` | 41.3% | 44.8% | 92.1% | -3.6 | 0 | 0.4 | ok |
| Contrast Map | `image/contrastMap` | 41.3% | 46.0% | 89.6% | 1.8 | 0 | 0.3 | ok |
| Depth Map Consistency | `image/depthMapConsistency` | 40.4% | 40.4% | 100.0% | -1.1 | 0 | 0.4 | ok |
| Co-occurrence Entropy | `image/coocEntropy` | 40.4% | 55.1% | 73.3% | 2.7 | 0 | 0.1 | ok |
| Sub-band Deviation | `image/subBandDev` | 39.6% | 43.8% | 90.4% | -4.8 | 0 | 0.1 | ok |
| Spatial Coherence | `image/spatialCoherence` | 39.6% | 81.2% | 48.8% | 6.3 | 0 | 0.8 | ok |
| Mutual Information | `image/mutualInfo` | 39.2% | 39.2% | 100.0% | -4.4 | 0 | 2.3 | ok |
| Radon Transform Analysis | `image/radonTransform` | 38.8% | 38.8% | 100.0% | -6.8 | 0 | 0.6 | ok |
| Noise Floor Level | `image/noiseFloorLevel` | 38.3% | 38.3% | 100.0% | -1.2 | 0 | 0.1 | ok |
| Gamma Distortion | `image/gammaDistortion` | 38.3% | 49.5% | 77.5% | 0.8 | 0 | 0.2 | ok |
| Mean Shift Cluster | `image/meanShiftCluster` | 37.5% | 37.5% | 100.0% | -4.3 | 0 | 0.1 | ok |
| Saturation Distribution | `image/saturationDistribution` | 36.7% | 47.1% | 77.9% | -1.6 | 0 | 4.0 | ok |
| Linear Pattern | `image/linearPatternDetect` | 36.3% | 36.3% | 100.0% | -8.9 | 0 | 0.6 | ok |
| Sobel Magnitude Dist | `image/sobelMagnitude` | 36.3% | 43.7% | 82.9% | -0.2 | 0 | 0.4 | ok |
| Mid-Frequency Energy | `image/midFreqEnergy` | 36.3% | 48.9% | 74.2% | -0.5 | 0 | 0.0 | ok |
| Flat Region Ratio | `image/flatRegionRatio` | 35.8% | 35.8% | 100.0% | -2.9 | 0 | 0.2 | ok |
| Image Phylogeny Analysis | `image/imagePhylogeny` | 35.8% | 35.8% | 100.0% | -7.6 | 0 | 0.2 | ok |
| Maximal Gradient Flow | `image/maximalGradFlow` | 35.4% | 41.3% | 85.8% | -1.0 | 0 | 0.7 | ok |
| Copy-Move Detection | `image/copyMove` | 33.3% | 33.3% | 100.0% | -11.5 | 0 | 9.7 | ok |
| Channel Independence | `image/channelIndependence` | 32.9% | 32.9% | 100.0% | -4.2 | 0 | 0.1 | ok |
| Benford's Law | `image/benford` | 32.5% | 32.5% | 100.0% | -18.6 | 0 | 2.1 | ok |
| Tamura Texture Features | `image/tamura` | 32.5% | 34.8% | 93.3% | -1.7 | 0 | 12.0 | ok |
| Vignette Analysis | `image/vignetteAnalysis` | 32.1% | 48.4% | 66.3% | 0.1 | 0 | 0.1 | ok |
| Intensity Kurtosis | `image/intensityKurtosis` | 29.2% | 80.5% | 36.3% | 5.5 | 0 | 1.0 | ok |
| Canny Edge Density | `image/cannyDensity` | 28.7% | 73.4% | 39.2% | 2.3 | 0 | 0.2 | ok |
| Box Filter Residual | `image/boxFilterResidual` | 28.7% | 85.2% | 33.8% | 2.4 | 0 | 0.1 | ok |
| White Balance Consistency | `image/whiteBalance` | 27.1% | 38.5% | 70.4% | -4.6 | 0 | 0.2 | ok |
| Hue Consistency | `image/hueConsistency` | 26.7% | 40.5% | 65.8% | -2.8 | 0 | 0.2 | ok |
| Laws Texture Energy | `image/lawsTextureE` | 25.4% | 62.9% | 40.4% | 0.4 | 0 | 0.1 | ok |
| Gradient Magnitude | `image/gradientMagnitudeHist` | 24.6% | 46.1% | 53.3% | 0.1 | 0 | 0.3 | ok |
| Color Entropy | `image/colorEntropy` | 21.7% | 40.0% | 54.2% | -3.5 | 0 | 0.2 | ok |
| Local Phase Quantization | `image/lpq` | 21.3% | 46.4% | 45.8% | -1.2 | 0 | 3.4 | ok |
| Kirsch Edge Response | `image/kirschEdge` | 18.3% | 81.5% | 22.5% | 1.0 | 0 | 0.1 | ok |
| Chi-Square Uniformity | `image/chiSquareUniformity` | 12.5% | 12.5% | 100.0% | -28.0 | 0 | 0.4 | ok |
| Difference Histogram | `image/differenceHistogram` | 12.1% | 19.6% | 61.7% | -8.3 | 0 | 0.1 | ok |
| Blocking Artifact Grid Analysis | `image/blockingArtifact` | 0.0% | 0.0% | 0.8% | -0.3 | 0 | 0.3 | ok |
| C2PA Content Credentials | `image/c2paVerification` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |
| Resolution Consistency | `image/resolutionConsistency` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |
| XMP Provenance Analysis | `image/xmpProvenance` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |
| import_failed | `image/colorBanding` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/diffusionArtifact` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/entropyMap` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| analyzeFileStructure | `image/fileStructure` | n/a | n/a | n/a | n/a | 240 | 0.1 | runtime_errors: Cannot read properties of undefined (reading 'toLowerCase') |
| import_failed | `image/fourierRing` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/frequencyBandRatio` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/gaborResponse` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/ganFingerprint` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/glcm` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/higherOrderStatistics` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/hogAnomaly` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/jpegGhost` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/lightingConsistency` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/localBinaryPattern` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/localVarianceMap` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/markovTransition` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/metadata` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\constants' imported from C:\Dev\ |
| import_failed | `image/morphologicalGradient` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/perspectiveConsistency` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/phaseCongruency` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/powerSpectralDensity` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/quantizationFingerprint` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/radialSpectrum` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| analyzeMultiscaleReconstruction | `image/reconstruction` | n/a | n/a | n/a | n/a | 240 | 0.1 | runtime_errors: ctx.getImageData is not a function |
| import_failed | `image/shadowConsistency` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| analyzeSoftwareFingerprint | `image/softwareFingerprint` | n/a | n/a | n/a | n/a | 240 | 0.1 | runtime_errors: Cannot read properties of undefined (reading 'toLowerCase') |
| import_failed | `image/upsamplingArtifact` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/waveletStatistics` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/weberDescriptor` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |
| import_failed | `image/zipfLaw` | n/a | n/a | n/a | n/a | 240 | n/a | import_error: Cannot find module 'C:\Dev\SourceVerify\src\lib\methods\pixelUtils' imported fro |

</details>

<details>
<summary>Video Methods - Frame Proxy (165)</summary>

| Method | ID | Strict Acc | Classified Acc | Coverage | Score Gap | Errors | Avg ms | Status |
|---|---|---:|---:|---:|---:|---:|---:|---|
| Lip Sync Analysis | `video/lipSyncAnalysis` | 89.6% | 89.6% | 100.0% | 14.6 | 0 | 0.1 | ok |
| Audio-Visual Sync | `video/audioVisualSync` | 78.8% | 78.8% | 100.0% | 9.9 | 0 | 0.1 | ok |
| Neck Transition | `video/neckTransition` | 77.5% | 77.5% | 100.0% | 7.0 | 0 | 0.1 | ok |
| Clothing Fold Physics | `video/clothingFold` | 74.6% | 74.6% | 100.0% | 6.9 | 0 | 0.1 | ok |
| Video Sharpness | `video/videoSharpness` | 74.2% | 74.2% | 100.0% | 4.6 | 0 | 0.2 | ok |
| Motion Blur Direction | `video/motionBlurDir` | 73.3% | 73.3% | 100.0% | 9.2 | 0 | 0.2 | ok |
| Texture Flow | `video/textureFlowAnalysis` | 73.3% | 73.3% | 100.0% | 5.1 | 0 | 0.2 | ok |
| Motion Vector Analysis | `video/motionVectorAnalysis` | 72.9% | 72.9% | 100.0% | 4.7 | 0 | 0.1 | ok |
| Bokeh Naturalness | `video/bokehNaturalness` | 70.8% | 70.8% | 100.0% | 2.4 | 0 | 0.1 | ok |
| Phoneme Correlation | `video/phonemeCorrelation` | 70.8% | 70.8% | 100.0% | 12.2 | 0 | 0.0 | ok |
| Depth Consistency | `video/depthConsistency` | 70.0% | 70.0% | 100.0% | 2.8 | 0 | 0.2 | ok |
| Scene Transition | `video/sceneTransition` | 69.6% | 69.6% | 100.0% | 11.3 | 0 | 0.2 | ok |
| Iris Detail | `video/irisDetail` | 66.3% | 66.3% | 100.0% | 6.9 | 0 | 0.0 | ok |
| Skin Texture Realism | `video/skinTextureRealism` | 65.0% | 65.0% | 100.0% | 9.4 | 0 | 0.1 | ok |
| Face Illumination | `video/faceIllumination` | 63.3% | 63.3% | 100.0% | 8.4 | 0 | 0.1 | ok |
| Spatial Frequency Temporal | `video/spatialFreqTemporal` | 62.9% | 62.9% | 100.0% | 2.7 | 0 | 0.4 | ok |
| Eyebrow Naturalness | `video/eyebrowNaturalness` | 62.5% | 62.5% | 100.0% | -2.5 | 0 | 0.1 | ok |
| Micro-Expression Analysis | `video/microExpressionAnalysis` | 62.5% | 62.5% | 100.0% | -0.6 | 0 | 0.1 | ok |
| Audio Spectral | `video/audioSpectral` | 62.1% | 62.1% | 100.0% | 3.4 | 0 | 0.1 | ok |
| Temporal Coherence | `video/temporalCoherenceMap` | 61.3% | 61.3% | 100.0% | 5.1 | 0 | 0.1 | ok |
| Eye Reflection Consistency | `video/eyeReflectionConsistency` | 60.8% | 60.8% | 100.0% | 9.6 | 0 | 0.3 | ok |
| Color Histogram Shift | `video/colorHistShift` | 58.3% | 58.3% | 100.0% | 6.3 | 0 | 0.1 | ok |
| Frame Edge Energy | `video/frameEdgeEnergy` | 57.9% | 57.9% | 100.0% | 5.7 | 0 | 0.0 | ok |
| Scene Geometry | `video/sceneGeometryConsistency` | 57.5% | 57.5% | 100.0% | 2.0 | 0 | 0.1 | ok |
| Specular Highlight | `video/specularHighlight` | 57.5% | 57.5% | 100.0% | 3.6 | 0 | 0.1 | ok |
| Neck Skin | `video/neckSkinConsistency` | 56.7% | 56.7% | 100.0% | 8.5 | 0 | 0.0 | ok |
| Nostril Darkness | `video/nostrildarkness` | 56.7% | 56.7% | 100.0% | 2.9 | 0 | 0.0 | ok |
| Nose Geometry | `video/noseGeometry` | 55.8% | 55.8% | 100.0% | -0.5 | 0 | 0.2 | ok |
| Video Saturation | `video/videoSaturation` | 54.6% | 54.6% | 100.0% | -1.9 | 0 | 0.4 | ok |
| Head Pose Estimation | `video/headPoseEstimation` | 52.5% | 52.5% | 100.0% | 2.5 | 0 | 0.1 | ok |
| Video Global Illum | `video/videoGlobalIllum` | 52.5% | 52.5% | 100.0% | 7.3 | 0 | 0.2 | ok |
| Body Proportion | `video/bodyProportion` | 51.7% | 51.7% | 100.0% | 6.2 | 0 | 0.1 | ok |
| Color Bleeding | `video/colorBleeding` | 51.7% | 51.7% | 100.0% | 0.5 | 0 | 0.1 | ok |
| Face Landmark Consistency | `video/faceLandmarkConsistency` | 51.7% | 51.7% | 100.0% | 1.6 | 0 | 0.1 | ok |
| Optical Flow Anomaly | `video/opticalFlowAnomaly` | 51.7% | 51.7% | 100.0% | -0.1 | 0 | 0.7 | ok |
| Face Mask Edge | `video/faceMaskEdge` | 51.2% | 51.2% | 100.0% | 5.6 | 0 | 0.1 | ok |
| Facial Boundary Frequency | `video/facialBoundaryFreq` | 51.2% | 51.2% | 100.0% | 4.5 | 0 | 0.1 | ok |
| Audio Noise Floor | `video/audioNoiseFloor` | 50.8% | 50.8% | 100.0% | 0.8 | 0 | 0.0 | ok |
| Background Freq Map | `video/backgroundFreqMap` | 50.4% | 50.4% | 100.0% | 1.8 | 0 | 0.1 | ok |
| Facial Wrinkle Consistency | `video/facialWrinkle` | 50.4% | 50.4% | 100.0% | 3.9 | 0 | 0.4 | ok |
| Frame Interpolation | `video/frameInterpolation` | 50.4% | 51.5% | 97.9% | 1.7 | 0 | 1.0 | ok |
| Breathing Pattern | `video/breathingPattern` | 50.0% | 50.0% | 100.0% | 9.0 | 0 | 0.0 | ok |
| Chroma Bleed | `video/chromaBleed` | 50.0% | 50.0% | 100.0% | -0.2 | 0 | 0.1 | ok |
| Clothing Consistency | `video/clothingConsistency` | 50.0% | 50.0% | 100.0% | 1.5 | 0 | 0.1 | ok |
| Contour Continuity | `video/contourContinuity` | 50.0% | 50.0% | 100.0% | 6.9 | 0 | 0.2 | ok |
| Face X-Ray Boundary | `video/faceXray` | 50.0% | 50.0% | 100.0% | 6.1 | 0 | 0.1 | ok |
| Gait Analysis | `video/gaitAnalysis` | 50.0% | 50.0% | 100.0% | 6.1 | 0 | 0.0 | ok |
| Hair Dynamics | `video/hairDynamics` | 50.0% | 50.0% | 100.0% | 5.6 | 0 | 0.1 | ok |
| Inter-Frame Forgery | `video/interFrameForgery` | 50.0% | 50.0% | 100.0% | -3.6 | 0 | 1.1 | ok |
| Motion Blur Consistency | `video/motionBlurConsistency` | 50.0% | 50.0% | 100.0% | 0.1 | 0 | 0.5 | ok |
| Temporal Color Histogram | `video/temporalColorHistogram` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.1 | ok |
| Temporal Gradient | `video/temporalGradient` | 50.0% | 50.0% | 100.0% | 0.5 | 0 | 0.0 | ok |
| Video Codec Analysis | `video/videoCodecAnalysis` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.2 | ok |
| Video Compression Trace | `video/videoCompressionTrace` | 50.0% | 50.0% | 100.0% | 0.3 | 0 | 0.2 | ok |
| Frame Rate Consistency | `video/videoFrameRateConsistency` | 50.0% | 50.0% | 100.0% | 0.4 | 0 | 0.0 | ok |
| Video Grain | `video/videoGrainAnalysis` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.1 | ok |
| Video Hash Analysis | `video/videoHashAnalysis` | 50.0% | 50.0% | 100.0% | -1.8 | 0 | 0.1 | ok |
| Video Luma Range | `video/videoLumaRange` | 50.0% | 50.0% | 100.0% | -0.4 | 0 | 0.1 | ok |
| Video Noise Pattern | `video/videoNoisePattern` | 50.0% | 50.0% | 100.0% | 5.3 | 0 | 0.6 | ok |
| Ear Consistency | `video/earConsistency` | 49.6% | 49.6% | 100.0% | -1.0 | 0 | 0.1 | ok |
| Hair Detail Analysis | `video/hairDetailAnalysis` | 49.6% | 49.6% | 100.0% | -2.7 | 0 | 0.1 | ok |
| Micro Expression V2 | `video/microExpressionV2` | 49.6% | 49.6% | 100.0% | -0.8 | 0 | 0.2 | ok |
| Speech Cadence | `video/speechCadence` | 49.6% | 49.6% | 100.0% | 6.4 | 0 | 0.1 | ok |
| Chin-Jaw Detail | `video/chinJawDetail` | 49.2% | 49.2% | 100.0% | 3.6 | 0 | 0.0 | ok |
| Deepfake Artifact | `video/deepfakeArtifact` | 49.2% | 49.2% | 100.0% | -2.1 | 0 | 0.1 | ok |
| Flicker Analysis | `video/flickerAnalysis` | 49.2% | 49.2% | 100.0% | -3.5 | 0 | 0.3 | ok |
| Hand Gesture Consistency | `video/handGestureConsistency` | 49.2% | 49.2% | 100.0% | -0.8 | 0 | 0.2 | ok |
| Heartbeat Detection | `video/heartbeatDetection` | 49.2% | 49.2% | 100.0% | -1.7 | 0 | 0.1 | ok |
| Reflection Physics | `video/reflectionPhysics` | 49.2% | 49.2% | 100.0% | 0.6 | 0 | 0.1 | ok |
| Shadow Consistency Video | `video/shadowConsistencyVideo` | 49.2% | 49.2% | 100.0% | 2.2 | 0 | 0.2 | ok |
| Pupil Dynamics | `video/pupilDynamics` | 48.8% | 48.8% | 100.0% | 0.4 | 0 | 0.0 | ok |
| Reflection Consistency Video | `video/reflectionConsistencyVideo` | 48.8% | 48.8% | 100.0% | -1.3 | 0 | 0.2 | ok |
| Video Blockiness | `video/videoBlockiness` | 48.8% | 48.8% | 100.0% | -0.3 | 0 | 0.1 | ok |
| Audio Formant Analysis | `video/audioFormant` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Audio-Visual Delay | `video/audioVisualDelay` | 48.3% | 48.3% | 100.0% | 6.3 | 0 | 0.0 | ok |
| Background Object Physics | `video/backgroundObjectPhysics` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| B-Frame Consistency Analysis | `video/bframeConsistency` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Color Quantization | `video/colorQuantization` | 48.3% | 48.3% | 100.0% | -3.2 | 0 | 0.1 | ok |
| Face 3D Reconstruction | `video/face3dReconstruction` | 48.3% | 48.3% | 100.0% | 3.7 | 0 | 0.1 | ok |
| Facial Action Timing Analysis | `video/facialActionTiming` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Facial Aging Consistency | `video/facialAgingConsistency` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Facial Reenactment | `video/facialReenactment` | 48.3% | 48.3% | 100.0% | -0.8 | 0 | 0.2 | ok |
| FACS Action Unit Analysis | `video/facsAnalysis` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.2 | ok |
| Gaze Vergence Analysis | `video/gazeVergence` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Hand Finger Count Analysis | `video/handFingerCount` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Head Nod/Shake Pattern | `video/headNodShake` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Head Pose V2 | `video/headPoseV2` | 48.3% | 48.3% | 100.0% | -2.3 | 0 | 0.1 | ok |
| Identity Switching Detection | `video/identitySwitch` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Intra-frame Prediction Analysis | `video/intraPrediction` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Lip Reading Accuracy Score | `video/lipReadingScore` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Micro-Tremor Detection | `video/microTremor` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Motion Estimation Residual | `video/motionEstimationRes` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Phoneme-Viseme Mapping | `video/phonemeVisemeMap` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Pixel Jitter | `video/pixelJitter` | 48.3% | 48.3% | 100.0% | -0.9 | 0 | 0.1 | ok |
| Pupillary Unrest Index | `video/pupillaryUnrest` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.2 | ok |
| Quantization Parameter Analysis | `video/qpAnalysis` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.2 | ok |
| Eye Saccade Analysis | `video/saccadeAnalysis` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.2 | ok |
| Scene Cut Anomaly Detection | `video/sceneCutAnomaly` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.2 | ok |
| Skin Specular Reflection | `video/skinSpecularReflection` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Stabilization Artifact | `video/stabilizationArtifact` | 48.3% | 48.3% | 100.0% | 2.9 | 0 | 0.0 | ok |
| Temporal Face Embedding Drift | `video/temporalFaceEmbedding` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Temporal Frequency Anomaly | `video/temporalFrequencyAnomaly` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Video Denoising Trace | `video/videoDenoisingTrace` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Saturation Map | `video/videoSaturationMap` | 48.3% | 48.3% | 100.0% | 0.7 | 0 | 0.2 | ok |
| Video Spectral Coherence | `video/videoSpectralCoherence` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Voice Fundamental Frequency | `video/voiceF0Analysis` | 48.3% | 48.3% | 100.0% | -0.1 | 0 | 0.1 | ok |
| Skin Micro Motion | `video/skinMicroMotion` | 48.3% | 48.9% | 98.8% | -1.8 | 0 | 0.0 | ok |
| Background Complexity | `video/backgroundComplexity` | 47.9% | 47.9% | 100.0% | 1.1 | 0 | 0.1 | ok |
| Expression Naturalness | `video/expressionNaturalness` | 47.9% | 47.9% | 100.0% | -4.0 | 0 | 44.0 | ok |
| Edge Sharpness Var | `video/edgeSharpnessVar` | 47.5% | 77.6% | 61.3% | 8.6 | 0 | 0.2 | ok |
| Accessory Consistency | `video/accessoryConsistency` | 47.1% | 47.1% | 100.0% | 0.9 | 0 | 0.0 | ok |
| Eye Contact Consistency | `video/eyeContactConsistency` | 47.1% | 47.1% | 100.0% | -2.8 | 0 | 0.0 | ok |
| Nose Shadow | `video/noseShadow` | 47.1% | 47.1% | 100.0% | -0.5 | 0 | 0.0 | ok |
| Clothing Edge Blend | `video/clothingEdgeBlend` | 46.7% | 46.7% | 100.0% | 2.0 | 0 | 0.0 | ok |
| Ear Symmetry Analysis | `video/earSymmetryAnalysis` | 46.7% | 46.7% | 100.0% | -0.5 | 0 | 0.2 | ok |
| Pixel Repetition | `video/pixelRepetitionVideo` | 46.7% | 46.7% | 100.0% | -6.5 | 0 | 0.1 | ok |
| Temporal Jitter | `video/temporalJitter` | 46.7% | 46.7% | 100.0% | -4.9 | 0 | 0.1 | ok |
| Video Artifact Grid | `video/videoArtifactGrid` | 46.7% | 46.7% | 100.0% | -0.9 | 0 | 0.1 | ok |
| Body Movement Fluidity | `video/bodyMovementFluidity` | 46.3% | 46.3% | 100.0% | -0.5 | 0 | 0.1 | ok |
| Skin Color Drift | `video/skinColorDrift` | 46.3% | 48.1% | 96.3% | -4.4 | 0 | 0.0 | ok |
| Resolution Map | `video/videoResolutionMap` | 46.3% | 49.3% | 93.8% | 3.1 | 0 | 0.4 | ok |
| Edge Antialiasing | `video/edgeAntiAliasingVideo` | 45.8% | 45.8% | 100.0% | -0.5 | 0 | 0.1 | ok |
| Lip Texture Detail | `video/lipTextureDetail` | 45.8% | 45.8% | 100.0% | 1.9 | 0 | 0.0 | ok |
| Background Perspective | `video/backgroundPerspective` | 45.8% | 66.7% | 68.8% | 11.0 | 0 | 0.1 | ok |
| Blink Rate Analysis | `video/blinkRateAnalysis` | 45.4% | 45.4% | 100.0% | 1.0 | 0 | 1.0 | ok |
| Shoulder Alignment | `video/shoulderAlignment` | 45.0% | 45.0% | 100.0% | -3.6 | 0 | 0.1 | ok |
| Temporal Noise Pattern | `video/temporalNoise` | 45.0% | 45.0% | 100.0% | -9.3 | 0 | 0.1 | ok |
| Inter-Frame Blend | `video/interFrameBlend` | 44.6% | 44.6% | 100.0% | 2.7 | 0 | 0.1 | ok |
| Pupil Dilation | `video/pupilDilation` | 44.6% | 44.6% | 100.0% | -1.8 | 0 | 0.1 | ok |
| Facial Muscle Physics | `video/facialMusclePhysics` | 43.8% | 46.9% | 93.3% | 6.6 | 0 | 0.1 | ok |
| Facial Symmetry | `video/facialSymmetryVideo` | 43.3% | 47.9% | 90.4% | 3.3 | 0 | 0.0 | ok |
| Skin Pore Simulation | `video/skinPoreSimulation` | 42.1% | 42.1% | 100.0% | -9.5 | 0 | 0.0 | ok |
| Temporal Consistency | `video/temporalConsistency` | 42.1% | 42.1% | 100.0% | -1.6 | 0 | 0.1 | ok |
| Video Noise Consistency | `video/videoNoiseConsistency` | 42.1% | 42.1% | 100.0% | -3.5 | 0 | 1.2 | ok |
| Watermark Detection | `video/watermarkDetection` | 42.1% | 51.3% | 82.1% | 0.4 | 0 | 0.1 | ok |
| Blood Flow rPPG | `video/bloodFlowRPPG` | 41.7% | 41.7% | 100.0% | -2.9 | 0 | 0.0 | ok |
| Face Skin Smoothness | `video/faceSkinSmoothV` | 41.3% | 41.3% | 100.0% | -2.9 | 0 | 0.0 | ok |
| Frame Drop Detection | `video/frameDropDetection` | 40.8% | 40.8% | 100.0% | -1.5 | 0 | 0.3 | ok |
| Ear Detail | `video/earDetailConsistency` | 40.4% | 55.1% | 73.3% | 3.2 | 0 | 0.0 | ok |
| Color Balance | `video/videoColorBalance` | 40.0% | 40.0% | 100.0% | -6.2 | 0 | 0.1 | ok |
| Lens Distortion | `video/lensDistortionVideo` | 39.2% | 48.5% | 80.8% | -1.5 | 0 | 0.1 | ok |
| Face Alignment | `video/faceAlignment` | 38.3% | 38.3% | 100.0% | -3.5 | 0 | 0.2 | ok |
| Face Boundary Blend | `video/faceBoundaryBlend` | 37.9% | 37.9% | 100.0% | -2.2 | 0 | 0.0 | ok |
| Edge Ringing | `video/edgeRinging` | 37.5% | 37.5% | 100.0% | -1.7 | 0 | 0.2 | ok |
| Gaze Direction | `video/gazeDirection` | 37.5% | 37.5% | 100.0% | -5.1 | 0 | 0.1 | ok |
| Face Blend Boundary | `video/faceBlendBound` | 35.8% | 35.8% | 100.0% | -1.2 | 0 | 0.1 | ok |
| Forehead Texture | `video/foreheadTexture` | 35.0% | 35.0% | 100.0% | -5.6 | 0 | 0.1 | ok |
| Background Stability | `video/backgroundStability` | 34.6% | 34.6% | 100.0% | -6.8 | 0 | 0.2 | ok |
| Skin Texture Temporal | `video/skinTextureTemporal` | 34.2% | 34.2% | 100.0% | -13.2 | 0 | 0.1 | ok |
| Object Boundary | `video/objectBoundary` | 34.2% | 81.2% | 42.1% | 2.5 | 0 | 0.2 | ok |
| Finger Geometry | `video/fingerGeometry` | 32.5% | 32.5% | 100.0% | -4.0 | 0 | 0.3 | ok |
| Forehead Wrinkle | `video/foreheadWrinkle` | 31.3% | 31.3% | 100.0% | -17.4 | 0 | 0.0 | ok |
| Frame Energy Distribution | `video/frameEnergy` | 30.4% | 54.5% | 55.8% | 0.7 | 0 | 0.4 | ok |
| Color Temporal Shift | `video/colorTemporalShift` | 29.6% | 29.6% | 100.0% | -9.3 | 0 | 0.5 | ok |
| Video Freq Spectrum | `video/videoFreqSpectrum` | 29.6% | 46.1% | 64.2% | -1.4 | 0 | 0.0 | ok |
| Spectral Flicker | `video/spectralFlicker` | 27.1% | 27.1% | 100.0% | -4.6 | 0 | 0.0 | ok |
| Cheek Texture | `video/cheekTexture` | 27.1% | 33.0% | 82.1% | -2.0 | 0 | 0.0 | ok |
| Facial Pore Texture | `video/facialPoreTexture` | 22.1% | 22.1% | 100.0% | -6.7 | 0 | 0.0 | ok |
| Tongue Consistency | `video/tongueConsistency` | 21.7% | 21.7% | 100.0% | -8.4 | 0 | 0.0 | ok |
| Jawline Consistency | `video/jawlineConsistency` | 20.0% | 20.0% | 100.0% | -7.4 | 0 | 1.5 | ok |
| Face Warping Artifact | `video/faceWarpingArtifact` | 19.2% | 19.2% | 100.0% | -9.3 | 0 | 0.1 | ok |
| Teeth Consistency | `video/teethConsistency` | 16.3% | 32.0% | 50.8% | -4.0 | 0 | 0.5 | ok |
| Contrast Temporal | `video/contrastTemporal` | 15.8% | 25.7% | 61.7% | -3.3 | 0 | 0.5 | ok |
| Hair Strand Consistency | `video/hairStrandConsistency` | 14.6% | 14.6% | 100.0% | -15.5 | 0 | 0.0 | ok |
| Shadow Temporal Consistency | `video/shadowTemporal` | 6.3% | 44.1% | 14.2% | -0.8 | 0 | 0.8 | ok |

</details>

<details>
<summary>Text Methods (149)</summary>

| Method | ID | Strict Acc | Classified Acc | Coverage | Score Gap | Errors | Avg ms | Status |
|---|---|---:|---:|---:|---:|---:|---:|---|
| First Person Usage | `text/firstPersonUsage` | 100.0% | 100.0% | 100.0% | 23.0 | 0 | 0.0 | ok |
| Pronoun Usage | `text/pronounUsagePattern` | 100.0% | 100.0% | 100.0% | 40.3 | 0 | 0.0 | ok |
| Word Specificity | `text/wordSpecificityIndex` | 95.8% | 95.8% | 100.0% | 13.8 | 0 | 0.0 | ok |
| Avg Word Length | `text/averageWordLength` | 95.8% | 100.0% | 95.8% | 19.5 | 0 | 0.0 | ok |
| Argument Density Score | `text/argumentDensity` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Binoculars Detection | `text/binocularsDetect` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Causal Reasoning Analysis | `text/causalReasoning` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Coh-Metrix Cohesion Index | `text/cohMetrixIndex` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Contextual Embedding Variance | `text/contextualEmbeddingVar` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Cross-Entropy Variance | `text/crossEntropyVariance` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Discourse Relation Depth | `text/discourseRelationDepth` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| DNA-GPT Uniqueness Test | `text/dnaGptUniqueness` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Entity Grounding Analysis | `text/entityGrounding` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Fast-DetectGPT | `text/fastDetectgpt` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Ghostbuster Detection | `text/ghostbusterDetect` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Information-Theoretic Profile | `text/informationTheoreticProfile` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Likelihood Divergence | `text/likelihoodDivergence` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Local Coherence Model | `text/localCoherenceModel` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Maximum Softmax Probability | `text/maxSoftmaxProb` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| PHD Detection Method | `text/phdDetection` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Pragmatic Adequacy Score | `text/pragmaticAdequacy` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| RADAR AI Text Detection | `text/radarDetect` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Rank Probability Analysis | `text/rankProbability` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Register Variation Analysis | `text/registerVariation` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Semantic Coherence Graph | `text/semanticCoherenceGraph` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Syntactic Tree Depth Distribution | `text/syntacticTreeDepth` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Text Fingerprint Analysis | `text/textFingerprint` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Topic Model Divergence | `text/topicModelDivergence` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Vocabulary Age Profile | `text/vocabularyAge` | 79.2% | 79.2% | 100.0% | 12.5 | 0 | 0.0 | ok |
| Analogy Simile | `text/analogySimile` | 75.0% | 75.0% | 100.0% | 13.5 | 0 | 0.0 | ok |
| List Enumeration | `text/listEnumerationPattern` | 70.8% | 70.8% | 100.0% | 10.8 | 0 | 0.0 | ok |
| Transition Smooth | `text/transitionSmooth` | 70.8% | 70.8% | 100.0% | 15.0 | 0 | 0.0 | ok |
| Conclusion Indicator | `text/conclusionIndicator` | 66.7% | 66.7% | 100.0% | 10.0 | 0 | 0.0 | ok |
| Conclusion Pattern | `text/conclusionPattern` | 66.7% | 66.7% | 100.0% | 5.3 | 0 | 0.0 | ok |
| Conjunction Pair | `text/conjunctionPair` | 66.7% | 66.7% | 100.0% | 6.8 | 0 | 0.0 | ok |
| Mean Dependency Depth | `text/meanDepParse` | 66.7% | 66.7% | 100.0% | 5.7 | 0 | 0.0 | ok |
| Ambiguity Tolerance | `text/ambiguityTolerance` | 62.5% | 62.5% | 100.0% | 7.3 | 0 | 0.0 | ok |
| Contraction Usage | `text/contractionUsage` | 62.5% | 62.5% | 100.0% | 4.0 | 0 | 0.0 | ok |
| Dialogue Pattern | `text/dialoguePattern` | 62.5% | 62.5% | 100.0% | 5.0 | 0 | 0.0 | ok |
| Personal Experience | `text/personalExperience` | 62.5% | 62.5% | 100.0% | 8.5 | 0 | 0.0 | ok |
| Semicolon Usage | `text/semicolonUsage` | 62.5% | 62.5% | 100.0% | 5.5 | 0 | 0.0 | ok |
| Micro Repetition | `text/textRepetitionMicro` | 62.5% | 62.5% | 100.0% | 4.0 | 0 | 0.0 | ok |
| Colloquial Expression | `text/colloquialExpression` | 58.3% | 58.3% | 100.0% | 3.3 | 0 | 0.0 | ok |
| Filler Word Usage | `text/fillerWordUsage` | 58.3% | 58.3% | 100.0% | 3.3 | 0 | 0.0 | ok |
| Hedging Language | `text/hedgingLanguage` | 58.3% | 58.3% | 100.0% | 1.4 | 0 | 0.1 | ok |
| Preposition Pattern | `text/prepositionPattern` | 58.3% | 58.3% | 100.0% | 3.3 | 0 | 0.0 | ok |
| Anaphora Resolution | `text/anaphoraResolution` | 54.2% | 54.2% | 100.0% | 2.3 | 0 | 0.0 | ok |
| Lexical Density | `text/lexicalDensity` | 54.2% | 54.2% | 100.0% | 1.3 | 0 | 0.0 | ok |
| Quotation Usage | `text/quotationUsage` | 54.2% | 54.2% | 100.0% | 2.1 | 0 | 0.0 | ok |
| Referential Density | `text/referentialDensity` | 54.2% | 54.2% | 100.0% | 0.8 | 0 | 0.0 | ok |
| Superlative Usage | `text/superlativeUsage` | 54.2% | 72.2% | 75.0% | 9.9 | 0 | 0.0 | ok |
| Abstract-Concrete Ratio | `text/abstractConcrete` | 50.0% | 50.0% | 100.0% | 2.0 | 0 | 0.0 | ok |
| Acronym Usage | `text/acronymUsage` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Adverb Frequency | `text/adverbFrequency` | 50.0% | 50.0% | 100.0% | -1.3 | 0 | 0.0 | ok |
| Argument Structure | `text/argumentStructure` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Comma Frequency | `text/commaFrequency` | 50.0% | 50.0% | 100.0% | -7.9 | 0 | 0.0 | ok |
| Contraction Detect | `text/contractionDetect` | 50.0% | 50.0% | 100.0% | 0.3 | 0 | 0.0 | ok |
| Cultural Reference | `text/culturalReference` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Curie Detection | `text/curieDetect` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Definition Pattern | `text/definitionPattern` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Emotional Arc | `text/emotionalArc` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Emotional Tone Variance | `text/emotionalTone` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Emphasis Pattern | `text/emphasisPattern` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Entropy Distribution | `text/entropyDistribution` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.1 | ok |
| Entropy Per Word | `text/entropyPerWord` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Exclamation Pattern | `text/exclamationPattern` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Function Word Distribution | `text/functionWordDistribution` | 50.0% | 50.0% | 100.0% | -1.7 | 0 | 0.1 | ok |
| Genre Conformity | `text/genreConformity` | 50.0% | 50.0% | 100.0% | -7.0 | 0 | 0.0 | ok |
| Hapax Legomena | `text/hapaxLegomena` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Idiom Detection | `text/idiomDetection` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Information Density | `text/informationDensity` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Instructional Tone | `text/instructionalTone` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Metaphor Density | `text/metaphorDensity` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Named Entity Consistency | `text/namedEntityConsistency` | 50.0% | 50.0% | 100.0% | -3.5 | 0 | 0.0 | ok |
| N-gram Frequency | `text/ngramFrequency` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.1 | ok |
| Number Usage | `text/numberUsage` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Parenthetical Usage | `text/parentheticalUsage` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Perplexity Analysis | `text/perplexityAnalysis` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.3 | ok |
| POS Tag Distribution | `text/posTagAnalysis` | 50.0% | 50.0% | 100.0% | -2.5 | 0 | 0.1 | ok |
| Punctuation Pattern | `text/punctuationPattern` | 50.0% | 50.0% | 100.0% | -5.5 | 0 | 0.0 | ok |
| Qualifier Density | `text/qualifierDensity` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Question Frequency | `text/questionFrequency` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Question Density | `text/questionMarkDensity` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Redundancy Detection | `text/redundancyDetection` | 50.0% | 50.0% | 100.0% | -2.3 | 0 | 0.0 | ok |
| Repetition Pattern | `text/repetitionPattern` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.1 | ok |
| Repetitive Phrase | `text/repetitivePhrase` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Rhetorical Device | `text/rhetoricalDevice` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Sentence Connectivity | `text/sentenceConnectivity` | 50.0% | 50.0% | 100.0% | -3.5 | 0 | 0.0 | ok |
| Sentence Fragment | `text/sentenceFragmentUsage` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Sentence Start Variety | `text/sentenceStartVariety` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Sentiment Variance | `text/sentimentVariance` | 50.0% | 50.0% | 100.0% | -4.0 | 0 | 0.0 | ok |
| Text Coherence Score | `text/textCoherence` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Text Compression Ratio | `text/textCompressionRatio` | 50.0% | 50.0% | 100.0% | 8.0 | 0 | 0.8 | ok |
| Text Formality | `text/textFormality` | 50.0% | 50.0% | 100.0% | 1.0 | 0 | 0.0 | ok |
| Token Predictability | `text/tokenPredictability` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.1 | ok |
| Topic Consistency | `text/topicConsistency` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Transition Quality | `text/transitionQuality` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Vocabulary Diversity | `text/vocabularyDiversity` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.1 | ok |
| Vocabulary Richness | `text/vocabularyRichness` | 50.0% | 50.0% | 100.0% | 0.3 | 0 | 0.0 | ok |
| Word Frequency Rank | `text/wordFrequencyRank` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Word Rarity Score | `text/wordRarityScore` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Zipf Deviation | `text/zipfDeviation` | 50.0% | 50.0% | 100.0% | 0.0 | 0 | 0.0 | ok |
| Semantic Density | `text/semanticDensity` | 50.0% | 100.0% | 50.0% | 20.7 | 0 | 0.0 | ok |
| Abstractness | `text/abstractnessIndex` | 45.8% | 45.8% | 100.0% | -2.4 | 0 | 0.0 | ok |
| Evidence Citation | `text/evidenceCitation` | 45.8% | 45.8% | 100.0% | -2.5 | 0 | 0.0 | ok |
| Topic Depth | `text/topicDepthAnalysis` | 45.8% | 45.8% | 100.0% | -2.3 | 0 | 0.1 | ok |
| Vocabulary Growth Rate | `text/vocabularyGrowthRate` | 45.8% | 45.8% | 100.0% | -1.3 | 0 | 0.0 | ok |
| Word Length Distribution | `text/wordLengthDist` | 45.8% | 45.8% | 100.0% | -6.0 | 0 | 0.0 | ok |
| Passive-Active Mix | `text/passiveActiveMix` | 45.8% | 57.9% | 79.2% | 4.0 | 0 | 0.0 | ok |
| Negation Pattern | `text/negationPattern` | 45.8% | 100.0% | 45.8% | 9.8 | 0 | 0.0 | ok |
| Conjunction Density | `text/conjunctionDensity` | 41.7% | 43.5% | 95.8% | -6.3 | 0 | 0.0 | ok |
| Comparative Structure | `text/comparativeStructure` | 37.5% | 37.5% | 100.0% | -2.8 | 0 | 0.0 | ok |
| Lexical Chain Repetition | `text/lexicalChainRepetition` | 37.5% | 37.5% | 100.0% | -3.5 | 0 | 0.0 | ok |
| Narrative Structure | `text/narrativeStructure` | 37.5% | 37.5% | 100.0% | -6.3 | 0 | 0.0 | ok |
| Typo Error Pattern | `text/typoErrorPattern` | 37.5% | 37.5% | 100.0% | -8.0 | 0 | 0.1 | ok |
| Sentence Entropy | `text/sentenceEntropy` | 37.5% | 42.9% | 87.5% | -4.5 | 0 | 0.0 | ok |
| Text Burstiness v2 | `text/textBurstiness2` | 37.5% | 45.0% | 83.3% | -3.0 | 0 | 0.0 | ok |
| Conditional Usage | `text/conditionalUsage` | 33.3% | 33.3% | 100.0% | -3.8 | 0 | 0.0 | ok |
| Modal Verb Frequency | `text/modalVerbFrequency` | 33.3% | 33.3% | 100.0% | -7.7 | 0 | 0.0 | ok |
| Quantifier Usage | `text/quantifierUsage` | 33.3% | 33.3% | 100.0% | -5.0 | 0 | 0.0 | ok |
| Text DNA Watermark | `text/textDNAWatermark` | 33.3% | 33.3% | 100.0% | -5.3 | 0 | 0.1 | ok |
| Logical Connector | `text/logicalConnector` | 25.0% | 25.0% | 100.0% | -5.7 | 0 | 0.0 | ok |
| Sentence Rhythm | `text/sentenceRhythm` | 25.0% | 46.2% | 54.2% | -1.3 | 0 | 0.0 | ok |
| Definite Article | `text/definiteArticle` | 20.8% | 20.8% | 100.0% | -21.3 | 0 | 0.0 | ok |
| Verb Tense | `text/verbTenseConsistency` | 20.8% | 20.8% | 100.0% | -10.7 | 0 | 0.0 | ok |
| Intrinsic Dimension | `text/intrinsicDimension` | 20.8% | 29.4% | 70.8% | -3.5 | 0 | 0.0 | ok |
| Log-Likelihood Rank | `text/logLikelihoodRank` | 16.7% | 25.0% | 66.7% | -4.0 | 0 | 0.0 | ok |
| Clause Balance | `text/clauseBalance` | 8.3% | 12.5% | 66.7% | -19.0 | 0 | 0.0 | ok |
| Subordinate Clause | `text/subordinateClause` | 8.3% | 66.7% | 12.5% | 1.3 | 0 | 0.0 | ok |
| Lexical Sophistication | `text/lexicalSophistication` | 0.0% | 0.0% | 100.0% | -15.3 | 0 | 0.0 | ok |
| Vocabulary Complexity | `text/vocabComplexity` | 0.0% | 0.0% | 100.0% | -18.5 | 0 | 0.0 | ok |
| Technical Jargon | `text/technicalJargon` | 0.0% | 0.0% | 62.5% | -10.0 | 0 | 0.0 | ok |
| Coherence Analysis | `text/coherenceAnalysis` | 0.0% | 0.0% | 50.0% | -8.8 | 0 | 0.0 | ok |
| Topic Shift Analysis | `text/topicShiftAnalysis` | 0.0% | 0.0% | 50.0% | -20.0 | 0 | 0.0 | ok |
| Burstiness Detection | `text/burstinessDetection` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |
| Clause Depth | `text/clauseDepthAnalysis` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |
| Collocation Strength | `text/collocationStrength` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.1 | ok |
| Coreference Chain | `text/coreferenceChain` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |
| Discourse Markers | `text/discourseMarkers` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |
| Paragraph Structure | `text/paragraphStructure` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |
| Passive Voice Frequency | `text/passiveVoiceFrequency` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |
| Readability Score | `text/readabilityScore` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |
| Sentence Length Variance | `text/sentenceLengthVariance` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |
| Sentence Opener Diversity | `text/sentenceOpener` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |
| Stylometric Analysis | `text/stylometricAnalysis` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |
| Syntactic Complexity | `text/syntacticComplexity` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |
| Temporal Expression | `text/temporalExpression` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |
| Type-Token Ratio | `text/typeTokenRatio` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.1 | ok |
| Writing Rhythm | `text/writingRhythm` | 0.0% | n/a | 0.0% | 0.0 | 0 | 0.0 | ok |

</details>

<details>
<summary>Server Analyzer Verdict + Signals (7)</summary>

| Method | ID | Strict Acc | Classified Acc | Coverage | Score Gap | Errors | Avg ms | Status |
|---|---|---:|---:|---:|---:|---:|---:|---|
| Server Analyzer Verdict | `server/verdict` | 52.5% | 71.2% | 73.8% | 19.4 | 0 | 131.9 | ok |
| Noise Residual | `server/noise-residual` | 80.4% | 80.4% | 100.0% | 22.7 | 0 | 131.9 | ok |
| Spectral Nyquist | `server/spectral-nyquist` | 52.5% | 53.8% | 97.5% | -0.3 | 0 | 131.9 | ok |
| Gradient Micro-Texture | `server/gradient-micro-texture` | 50.4% | 50.6% | 99.6% | -0.6 | 0 | 131.9 | ok |
| Edge Coherence | `server/edge-coherence` | 45.8% | 60.8% | 75.4% | 4.3 | 0 | 131.9 | ok |
| Color Correlation | `server/color-correlation` | 31.7% | 37.4% | 84.6% | -5.4 | 0 | 131.9 | ok |
| Metadata Analysis | `server/metadata-analysis` | 0.0% | n/a | 0.0% | 0.0 | 0 | 131.9 | ok |

</details>

### Caveats

- Image/video numbers are only as representative as the local benchmark images currently present in this repository.
- Video results are **not** full video accuracy; they only measure how each frame-based method separates AI vs real on still frames.
- Text results are **provisional** because the benchmark corpus is synthetic and intentionally balanced.
- `Metadata Analysis` in the server pipeline is effectively a file-name heuristic, so its accuracy changes drastically if filenames contain source hints.

<!-- METHOD_ACCURACY_REPORT:END -->

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
