$basePath = "C:\Dev\SourceVerify\src\app\methods"

# Helper to create method folder with i18n files and page.tsx
function New-Method {
    param([string]$id, [hashtable]$en, [hashtable]$vi)
    
    $dir = Join-Path $basePath $id
    $i18nDir = Join-Path $dir "i18n"
    New-Item -ItemType Directory -Path $i18nDir -Force | Out-Null

    # Build references array
    $refTitle = $en.source
    $refs = @(@{title=$refTitle; url=""})
    $refsJson = ($refs | ConvertTo-Json -Compress)
    if (-not $refsJson.StartsWith("[")) { $refsJson = "[$refsJson]" }

    # EN JSON
    $enObj = @{
        name = $en.name
        description = $en.description
        algorithm = $en.algorithm
        mechanism = $en.mechanism
        parameters = $en.parameters
        accuracy = $en.accuracy
        source = $en.source
        useCase = $en.useCase
        references = $refs
    }
    $enObj | ConvertTo-Json -Depth 3 | Set-Content (Join-Path $i18nDir "en.json") -Encoding UTF8

    # VI JSON
    $viRefs = @(@{title=$vi.source; url=""})
    $viObj = @{
        name = $vi.name
        description = $vi.description
        algorithm = $vi.algorithm
        mechanism = $vi.mechanism
        parameters = $vi.parameters
        accuracy = $vi.accuracy
        source = $vi.source
        useCase = $vi.useCase
        references = $viRefs
    }
    $viObj | ConvertTo-Json -Depth 3 | Set-Content (Join-Path $i18nDir "vi.json") -Encoding UTF8

    # Other languages (copy en)
    foreach ($lang in @("zh","ja","ko","es")) {
        $enObj | ConvertTo-Json -Depth 3 | Set-Content (Join-Path $i18nDir "$lang.json") -Encoding UTF8
    }

    # page.tsx
    $pageTsx = @"
"use client";
import MethodDetail from "../_components/MethodDetail";
import en from "./i18n/en.json";
import vi from "./i18n/vi.json";
import zh from "./i18n/zh.json";
import ja from "./i18n/ja.json";
import ko from "./i18n/ko.json";
import es from "./i18n/es.json";

const i18n = { en, vi, zh, ja, ko, es };

export default function Page() {
    return <MethodDetail methodId="$id" translations={i18n} />;
}
"@
    Set-Content (Join-Path $dir "page.tsx") $pageTsx -Encoding UTF8
    Write-Output "Created: $id"
}

# ========================
# 1. Median Filter Detection
# ========================
New-Method -id "median_filter" -en @{
    name="Median Filtering Detection"
    description="Detects traces of median filtering applied to suppress JPEG artifacts and hide tampering evidence."
    algorithm="Median Filtered Image Forensics via First-Digit Analysis"
    mechanism="Analyzes pixel value distributions to detect the smoothing artifacts characteristic of median filtering. Median filtering removes high-frequency noise but leaves detectable traces in the histogram and pixel co-occurrence matrices."
    parameters="Window sizes: 3x3, 5x5, 7x7; Feature: histogram bin analysis, pixel autocorrelation, streak analysis"
    accuracy="High - 82-94%"
    source="Kirchner, M. & Fridrich, J. (2010) - On Detection of Median Filtering in Digital Images, SPIE Electronic Imaging"
    useCase="Detecting anti-forensic median filtering used to conceal image manipulation or AI generation traces"
} -vi @{
    name="Phat hien loc trung vi"
    description="Phat hien dau vet loc trung vi duoc ap dung de che giau bang chung chinh sua anh."
    algorithm="Phap y anh loc trung vi qua phan tich chu so dau"
    mechanism="Phan tich phan bo gia tri pixel de phat hien hien vat dac trung cua loc trung vi."
    parameters="Cua so: 3x3, 5x5, 7x7; Dac trung: phan tich bin histogram"
    accuracy="Cao - 82-94%"
    source="Kirchner & Fridrich (2010), SPIE Electronic Imaging"
    useCase="Phat hien loc chong phap y de che giau chinh sua hoac dau vet AI"
}

# ========================
# 2. Resampling Detection
# ========================
New-Method -id "resampling" -en @{
    name="Resampling Detection"
    description="Detects interpolation artifacts from image scaling, rotation, or skewing operations."
    algorithm="Periodic Correlation Detection in Resampled Signals"
    mechanism="Analyzes periodic correlations introduced by resampling operations. When an image is scaled or rotated, interpolation creates detectable periodic patterns in pixel derivatives."
    parameters="Analysis: EM algorithm, Radon transform projection, Derivative filter: [-1, 1], Spectrum: 64-point DFT"
    accuracy="High - 85-95%"
    source="Popescu, A.C. & Farid, H. (2005) - Exposing Digital Forgeries by Detecting Traces of Resampling, IEEE TSP"
    useCase="Detecting geometric transformations applied during image splicing or composition"
} -vi @{
    name="Phat hien tai lay mau"
    description="Phat hien hien vat noi suy tu cac thao tac co gian, xoay hoac nghieng anh."
    algorithm="Phat hien tuong quan tuan hoan trong tin hieu tai lay mau"
    mechanism="Phan tich tuong quan tuan hoan do tai lay mau tao ra."
    parameters="Thuat toan EM, chieu Radon, Bo loc dao ham: [-1, 1], Pho: DFT 64 diem"
    accuracy="Cao - 85-95%"
    source="Popescu & Farid (2005), IEEE TSP"
    useCase="Phat hien bien doi hinh hoc trong ghep anh"
}

# ========================
# 3. Contrast Enhancement Detection
# ========================
New-Method -id "contrast_enhancement" -en @{
    name="Contrast Enhancement Detection"
    description="Detects histogram manipulation artifacts from contrast adjustments like levels, curves, or gamma correction."
    algorithm="Peak-Gap Artifact Detection in Pixel Value Histograms"
    mechanism="Contrast enhancement operations create characteristic peak-gap patterns in the pixel intensity histogram."
    parameters="Histogram bins: 256, Gap threshold: adaptive, Peak detection: local maxima, Smoothing: Gaussian"
    accuracy="High - 80-92%"
    source="Stamm, M.C. & Liu, K.J.R. (2008) - Forensic Detection of Image Manipulation Using Statistical Intrinsic Fingerprints, IEEE ICME"
    useCase="Detecting brightness/contrast adjustments used to unify appearance in composited images"
} -vi @{
    name="Phat hien tang cuong tuong phan"
    description="Phat hien hien vat tu dieu chinh tuong phan nhu levels, curves hoac gamma."
    algorithm="Phat hien hien vat dinh-khoang trong histogram gia tri pixel"
    mechanism="Tang cuong tuong phan tao mau dinh-khoang dac trung trong histogram cuong do pixel."
    parameters="Bin histogram: 256, Nguong khoang: thich ung, Phat hien dinh: cuc dai cuc bo"
    accuracy="Cao - 80-92%"
    source="Stamm & Liu (2008), IEEE ICME"
    useCase="Phat hien dieu chinh sang/tuong phan trong anh ghep"
}

# ========================
# 4. BRISQUE
# ========================
New-Method -id "brisque" -en @{
    name="Blind Image Quality Assessment (BRISQUE)"
    description="Uses natural scene statistics to evaluate image quality and detect distortions indicating AI generation."
    algorithm="Blind/Referenceless Image Spatial Quality Evaluator"
    mechanism="Computes locally normalized luminance coefficients and fits them to a generalized Gaussian distribution."
    parameters="Patch size: 7x7, MSCN coefficients, GGD fitting, Features: 36-dimensional, SVR model"
    accuracy="Medium-High - 78-90%"
    source="Mittal, A. et al. (2012) - No-Reference Image Quality Assessment in the Spatial Domain, IEEE TIP"
    useCase="Evaluating naturalness of images to flag AI-generated or heavily processed content"
} -vi @{
    name="Danh gia chat luong anh mu (BRISQUE)"
    description="Su dung thong ke canh tu nhien de danh gia chat luong anh va phat hien bien dang do AI tao."
    algorithm="Danh gia chat luong khong gian anh khong tham chieu"
    mechanism="Tinh he so do sang chuan hoa cuc bo va khop voi phan bo Gaussian tong quat."
    parameters="Vung: 7x7, He so MSCN, Khop GGD, Dac trung: 36 chieu"
    accuracy="Trung binh-Cao - 78-90%"
    source="Mittal et al. (2012), IEEE TIP"
    useCase="Danh gia tinh tu nhien cua anh de gan co noi dung AI"
}

# ========================
# 5. Demosaicing
# ========================
New-Method -id "demosaicing" -en @{
    name="Demosaicing Artifact Analysis"
    description="Analyzes color filter array demosaicing artifacts to verify camera origin and detect synthetic images."
    algorithm="CFA Interpolation Pattern Consistency Check"
    mechanism="Real camera images exhibit specific demosaicing patterns from Bayer CFA interpolation."
    parameters="CFA pattern: RGGB, Interpolation: bilinear/AHD/VNG, Correlation window: 5x5"
    accuracy="High - 83-93%"
    source="Popescu, A.C. & Farid, H. (2005) - Exposing Digital Forgeries by Detecting Traces of Demosaicing, ACM IHMMSec"
    useCase="Verifying camera sensor origin by checking CFA demosaicing traces in images"
} -vi @{
    name="Phan tich hien vat khu mosaic"
    description="Phan tich hien vat khu mosaic CFA de xac minh nguon goc camera va phat hien anh tong hop."
    algorithm="Kiem tra tinh nhat quan mau noi suy CFA"
    mechanism="Anh camera that co mau khu mosaic dac trung tu noi suy CFA Bayer."
    parameters="Mau CFA: RGGB, Noi suy: bilinear/AHD/VNG, Cua so: 5x5"
    accuracy="Cao - 83-93%"
    source="Popescu & Farid (2005), ACM IHMMSec"
    useCase="Xac minh nguon goc cam bien camera qua dau vet khu mosaic"
}

# ========================
# 6. Steganalysis
# ========================
New-Method -id "steganalysis" -en @{
    name="Steganalysis (Hidden Data Detection)"
    description="Detects hidden data embedded in images through steganographic techniques."
    algorithm="Rich Model Steganalysis with Spatial Domain Features"
    mechanism="Extracts high-dimensional feature sets from spatial residuals using multiple filter kernels."
    parameters="Feature dimension: 34671 (full SRM), Filters: 30 linear + nonlinear, Quantization: T=1,2,3"
    accuracy="High - 80-95%"
    source="Fridrich, J. & Kodovsky, J. (2012) - Rich Models for Steganalysis of Digital Images, IEEE TIFS"
    useCase="Detecting hidden payloads in images that may indicate tamper concealment"
} -vi @{
    name="Phan tich giau tin"
    description="Phat hien du lieu an duoc nhung trong anh qua ky thuat giau tin."
    algorithm="Phan tich giau tin mo hinh phong phu voi dac trung khong gian"
    mechanism="Trich xuat tap dac trung da chieu tu phan du khong gian su dung nhieu bo loc."
    parameters="Chieu dac trung: 34671 (SRM day du), Bo loc: 30, Luong tu: T=1,2,3"
    accuracy="Cao - 80-95%"
    source="Fridrich & Kodovsky (2012), IEEE TIFS"
    useCase="Phat hien payload an trong anh co the chi ra ro ri du lieu"
}

# ========================
# 7. Thumbnail Analysis
# ========================
New-Method -id "thumbnail_analysis" -en @{
    name="Thumbnail Consistency Analysis"
    description="Compares embedded EXIF thumbnail with the main image to detect post-capture modifications."
    algorithm="Embedded Thumbnail vs Main Image Structural Comparison"
    mechanism="JPEG files often contain embedded thumbnails generated at capture time. When the main image is later edited, the thumbnail may remain unchanged."
    parameters="Comparison: SSIM, Histogram correlation, Pixel hash, Thumbnail source: EXIF APP1"
    accuracy="Medium-High - 75-90%"
    source="Kee, E. & Farid, H. (2011) - Digital Image Authentication from Thumbnails, SPIE Electronic Imaging"
    useCase="Detecting image editing by comparing original thumbnail with potentially modified main image"
} -vi @{
    name="Phan tich nhat quan thumbnail"
    description="So sanh thumbnail EXIF nhung voi anh chinh de phat hien chinh sua sau chup."
    algorithm="So sanh cau truc thumbnail nhung voi anh chinh"
    mechanism="File JPEG thuong chua thumbnail nhung tao luc chup. Khi anh chinh bi sua, thumbnail co the giu nguyen."
    parameters="So sanh: SSIM, Tuong quan histogram, Hash pixel, Nguon: EXIF APP1"
    accuracy="Trung binh-Cao - 75-90%"
    source="Kee & Farid (2011), SPIE Electronic Imaging"
    useCase="Phat hien chinh sua anh qua so sanh thumbnail goc voi anh chinh"
}

# ========================
# 8. Perceptual Hash
# ========================
New-Method -id "perceptual_hash" -en @{
    name="Perceptual Hash Analysis"
    description="Uses perceptual hashing algorithms to detect near-duplicate images and identify localized manipulations."
    algorithm="Multi-Scale Perceptual Hashing with DCT and Gradient Features"
    mechanism="Computes compact perceptual hash fingerprints (pHash, dHash) that capture the essential visual structure."
    parameters="Hash types: pHash (DCT-based), dHash (gradient), aHash (average), Hash size: 64-bit"
    accuracy="Medium - 70-85%"
    source="Zauner, C. (2010) - Implementation and Benchmarking of Perceptual Image Hash Functions, TU Graz"
    useCase="Near-duplicate detection and localized manipulation identification through hash comparison"
} -vi @{
    name="Phan tich hash nhan thuc"
    description="Su dung thuat toan hash nhan thuc de phat hien anh gan giong va xac dinh chinh sua cuc bo."
    algorithm="Hash nhan thuc da ty le voi DCT va gradient"
    mechanism="Tinh van tay hash nhan thuc (pHash, dHash) nam bat cau truc thi giac."
    parameters="Loai hash: pHash (DCT), dHash (gradient), aHash (trung binh), Kich thuoc: 64-bit"
    accuracy="Trung binh - 70-85%"
    source="Zauner (2010), TU Graz"
    useCase="Phat hien anh gan giong va xac dinh chinh sua cuc bo"
}

# ========================
# 9. Illuminant Map
# ========================
New-Method -id "illuminant_map" -en @{
    name="Illuminant Map Analysis"
    description="Detects inconsistent illumination sources across image regions by estimating local color temperature maps."
    algorithm="Physics-Based Illuminant Estimation for Forgery Detection"
    mechanism="Estimates local illuminant color using inverse-intensity chromaticity and generalized grayworld algorithms."
    parameters="Estimation: IIC + GGW, Superpixel: SLIC (k=200), Distance: angular, Clustering: k-means"
    accuracy="Medium-High - 75-88%"
    source="Riess, C. & Angelopoulou, E. (2010) - Scene Illumination as an Indicator of Image Manipulation, IEEE WIFS"
    useCase="Detecting spliced regions by identifying inconsistent lighting conditions"
} -vi @{
    name="Phan tich ban do chieu sang"
    description="Phat hien nguon chieu sang khong nhat quan giua cac vung anh."
    algorithm="Uoc luong nguon sang dua vat ly cho phat hien gia mao"
    mechanism="Uoc luong mau nguon sang cuc bo su dung IIC va thuat toan grayworld."
    parameters="Uoc luong: IIC + GGW, Sieu pixel: SLIC (k=200), Khoang cach: goc"
    accuracy="Trung binh-Cao - 75-88%"
    source="Riess & Angelopoulou (2010), IEEE WIFS"
    useCase="Phat hien vung ghep qua dieu kien chieu sang khong nhat quan"
}

# ========================
# 10. Radon Transform
# ========================
New-Method -id "radon_transform" -en @{
    name="Radon Transform Analysis"
    description="Uses the Radon transform to detect directional artifacts and periodic patterns indicating manipulation."
    algorithm="Radon Domain Feature Extraction for Forgery Detection"
    mechanism="Projects image content along multiple angles using the Radon transform, creating a sinogram."
    parameters="Angles: 0-179 deg (1 deg step), Projection: line integral, Feature: sinogram variance"
    accuracy="Medium-High - 76-88%"
    source="Mahdian, B. & Saic, S. (2008) - Blind Authentication Using Periodic Properties of Interpolation, IEEE TIFS"
    useCase="Detecting geometric manipulation and resampling through directional artifact analysis"
} -vi @{
    name="Phan tich bien doi Radon"
    description="Dung bien doi Radon de phat hien hien vat huong va mau tuan hoan chi ra thao tung anh."
    algorithm="Trich xuat dac trung mien Radon cho phat hien gia mao"
    mechanism="Chieu noi dung anh theo nhieu goc su dung bien doi Radon."
    parameters="Goc: 0-179 do (buoc 1 do), Chieu: tich phan duong, Dac trung: phuong sai sinogram"
    accuracy="Trung binh-Cao - 76-88%"
    source="Mahdian & Saic (2008), IEEE TIFS"
    useCase="Phat hien thao tung hinh hoc va tai lay mau qua phan tich hien vat huong"
}

Write-Output "Done creating methods 1-10"
