# SourceVerify — Method Template Guide

Tài liệu mẫu chuẩn cho tất cả các phương pháp phân tích (methods) trong dự án SourceVerify.
Mỗi method cần **đầy đủ 4 thành phần** mới được coi là hoàn chỉnh.

---

## 🏗️ Tổng quan kiến trúc Method

Mỗi method trong dự án bao gồm **4 thành phần bắt buộc**:

| # | Thành phần | Đường dẫn | Mô tả |
|---|-----------|-----------|-------|
| 1 | **Logic phân tích (lib)** | `src/lib/methods/{mediaType}/{methodFile}.ts` | Hàm analyze chính, xử lý dữ liệu, trả về `AnalysisMethod` |
| 2 | **Trang chi tiết (app/page)** | `src/app/methods/{mediaType}/{methodId}/page.tsx` | Page component hiển thị chi tiết method |
| 3 | **Dữ liệu i18n** | `src/app/methods/{mediaType}/{methodId}/i18n/{locale}.json` | Bản dịch đa ngôn ngữ cho method detail page |
| 4 | **Đăng ký method** | `src/app/methods/data.ts` + `src/lib/methods/index.ts` + `src/app/methods/methodsI18n.ts` | Khai báo method trong hệ thống |

---

## 📁 Cấu trúc thư mục mẫu (Metadata Analysis)

```
src/
├── lib/methods/image/metadata.ts              ← Logic phân tích
├── app/methods/
│   ├── data.ts                                ← Đăng ký method (METHODS array)
│   ├── methodsI18n.ts                         ← Import i18n cho listing page
│   ├── _components/MethodDetail.tsx            ← Component dùng chung
│   └── image/metadata/
│       ├── page.tsx                            ← Page component
│       └── i18n/
│           ├── en.json                        ← Tiếng Anh (BẮT BUỘC)
│           ├── vi.json                        ← Tiếng Việt (BẮT BUỘC)
│           ├── zh.json                        ← Tiếng Trung
│           ├── ja.json                        ← Tiếng Nhật
│           ├── ko.json                        ← Tiếng Hàn
│           └── es.json                        ← Tiếng Tây Ban Nha
```

---

## 1️⃣ Logic phân tích — `src/lib/methods/{mediaType}/{file}.ts`

### Mẫu chuẩn (metadata.ts):

```typescript
/**
 * Signal X: {Method Name}
 * {Mô tả ngắn về phương pháp}
 */

import type { AnalysisMethod, FileMetadata } from "../../types";

// Constants nếu cần
const BASIC_FILE_INFO_KEYS = ["File Name", "File Size", "MIME Type"];

export function analyze{MethodName}(
    // Tùy mediaType: metadata, exifData, imageData, text, videoFrames...
    metadata: FileMetadata,
    exifData: Record<string, string>
): AnalysisMethod {
    let score = 50;           // 0-100: 0=real, 100=AI
    let description = "";
    let details = "";

    // === LOGIC PHÂN TÍCH ===

    // Bước 1: Kiểm tra bằng chứng rõ ràng
    // Bước 2: Phân tích chi tiết
    // Bước 3: Đánh giá tổng hợp

    // === XÁC ĐỊNH descriptionKey ===
    const descriptionKey = score >= 90 ? "signal.{method}.aiDetected"
        : score <= 20 ? "signal.{method}.realDetected"
            : "signal.{method}.inconclusive";

    return {
        name: "{Method Display Name}",
        nameKey: "signal.{methodKey}",       // i18n key cho tên
        category: "metadata",                // pixel | frequency | statistical | metadata | sensor
        score,                               // 0-100
        weight: 1.5,                         // Trọng số (0.02 - 1.5)
        description,
        descriptionKey,
        icon: "◎",                           // Icon đại diện
        details,                             // Chi tiết kỹ thuật
    };
}
```

### Quy tắc cho file lib:
- **Import type**: Luôn dùng `import type { AnalysisMethod }` từ `../../types`
- **Score range**: `0` = chắc chắn thật, `50` = không xác định, `100` = chắc chắn AI
- **Category**: Chỉ dùng 1 trong 5 giá trị: `pixel`, `frequency`, `statistical`, `metadata`, `sensor`
- **Weight**: Từ `0.02` (thấp) đến `1.5` (cao) — thể hiện tầm quan trọng
- **Export**: Tên hàm bắt đầu bằng `analyze` + tên method (camelCase)
- **Barrel export**: Phải thêm vào `src/lib/methods/index.ts`

---

## 2️⃣ Trang chi tiết — `src/app/methods/{mediaType}/{methodId}/page.tsx`

### Mẫu chuẩn HOÀN CHỈNH (6 ngôn ngữ — mẫu metadata):

```tsx
"use client";
import MethodDetail from "../../_components/MethodDetail";
import en from "./i18n/en.json";
import vi from "./i18n/vi.json";
import zh from "./i18n/zh.json";
import ja from "./i18n/ja.json";
import ko from "./i18n/ko.json";
import es from "./i18n/es.json";

const i18n = { en, vi, zh, ja, ko, es };

export default function Page() {
    return <MethodDetail methodId="{method_id}" translations={i18n} />;
}
```

### Mẫu TỐI THIỂU (2 ngôn ngữ — mẫu method mới):

```tsx
"use client";
import MethodDetail from "../../_components/MethodDetail";
import en from "./i18n/en.json";
import vi from "./i18n/vi.json";

const i18n = { en, vi };

export default function Page() {
    return <MethodDetail methodId="{method_id}" translations={i18n} />;
}
```

### Quy tắc:
- `methodId` **phải khớp chính xác** với `id` trong `data.ts` METHODS array
- Tối thiểu cần `en.json` và `vi.json`
- Hoàn chỉnh cần thêm `zh.json`, `ja.json`, `ko.json`, `es.json`

---

## 3️⃣ Dữ liệu i18n — `i18n/{locale}.json`

### Mẫu chuẩn HOÀN CHỈNH (en.json — mẫu metadata):

```json
{
    "name": "Metadata Analysis",
    "description": "Comprehensive examination of EXIF, XMP, and IPTC data embedded in image files to detect signs of AI generation tools.",
    "algorithm": "Multi-layer EXIF / XMP / IPTC Parser",
    "mechanism": "The metadata analysis system operates in multiple stages:\n\n1. **Data Extraction**: ...\n\n2. **Camera Verification**: ...\n\n3. **Software Detection**: ...",
    "parameters": "Primary EXIF fields: Make, Model, Software...\n\nDetected AI tools: Stable Diffusion, DALL-E...\n\nMetadata standards: EXIF 2.32...",
    "accuracy": "High - 85-95% when metadata is present and unstripped.",
    "source": "JEITA CP-3451 (Exif Standard 2.32), Adobe XMP Specification...",
    "useCase": "First-pass triage: quickly identifies images with AI software tags...",
    "strengths": "• Extremely fast analysis time (<10ms per image)\n• No pixel decoding required\n• High accuracy when metadata is intact\n• Can identify specific AI tools\n• Compliant with international standards",
    "limitations": "• Metadata can be easily stripped or forged\n• Many social media platforms auto-strip metadata\n• Cannot detect AI images without metadata\n• Depends on AI tools embedding software tags",
    "references": [
        {"title": "Paper/Standard Title", "url": "https://..."},
        {"title": "Another Reference", "url": "https://..."}
    ]
}
```

### Các trường bắt buộc và tùy chọn:

| Trường | Bắt buộc | Mô tả | Hiển thị |
|--------|---------|-------|----------|
| `name` | ✅ | Tên method (tiếng Anh cho en.json) | Tiêu đề + listing |
| `description` | ✅ | Mô tả tổng quan (2-3 câu) | Dưới tiêu đề |
| `algorithm` | ✅ | Tên thuật toán/model sử dụng | Section "Algorithm / Model" |
| `mechanism` | ✅ | Cách hoạt động chi tiết, dùng `\n` cho xuống dòng, `**text**` cho bold | Section "How it works" |
| `parameters` | ✅ | Thông số kỹ thuật, ngưỡng, trường dữ liệu | Section "Technical Parameters" |
| `accuracy` | ✅ | Độ chính xác và độ tin cậy | Section "Accuracy & Reliability" |
| `source` | ✅ | Tham chiếu học thuật | Section "Academic Reference" |
| `useCase` | ✅ | Trường hợp sử dụng thực tế | Section "Use Case" |
| `strengths` | ⭐ | Ưu điểm, dùng `•` làm bullet | Section "Strengths" |
| `limitations` | ⭐ | Hạn chế, dùng `•` làm bullet | Section "Limitations" |
| `references` | ⭐ | Mảng `{title, url}` cho citation links | Section "References & Citations" |

> ⭐ = Khuyến nghị mạnh, nên có để method đầy đủ như mẫu

### ⚠️ Quy tắc quan trọng cho i18n:
- **en.json**: NỘI DUNG PHẢI HOÀN TOÀN BẰNG TIẾNG ANH (không trộn tiếng Việt!)
- **vi.json**: Nội dung hoàn toàn bằng tiếng Việt
- **Formatting**: Dùng `\n` cho line break, `\n\n` cho paragraph, `**text**` cho bold, `• ` cho bullet
- **References**: Mảng objects `{title: string, url?: string}`

---

## 4️⃣ Đăng ký method — 3 file cần cập nhật

### 4a. `src/app/methods/data.ts` — METHODS array:

```typescript
{ id: "metadata", category: "metadata" as Category, mediaType: "image" as MediaType, weight: 0.07, year: 2003 },
```

| Field | Mô tả |
|-------|-------|
| `id` | ID duy nhất, dùng snake_case, khớp với methodId trong page.tsx |
| `category` | `pixel` \| `frequency` \| `statistical` \| `metadata` \| `sensor` |
| `mediaType` | `image` \| `video` \| `text` |
| `weight` | Trọng số trên trang listing (0.02 - 0.07) |
| `year` | Năm xuất bản/phát minh nghiên cứu gốc |

### 4b. `src/lib/methods/index.ts` — Barrel export:

```typescript
export { analyzeMetadata } from "./image/metadata";
```

### 4c. `src/app/methods/methodsI18n.ts` — Import cho listing page:

```typescript
// Import
import metadata_en from "./image/metadata/i18n/en.json";
import metadata_vi from "./image/metadata/i18n/vi.json";

// Thêm vào buildMap en
["metadata", metadata_en],

// Thêm vào buildMap vi
["metadata", metadata_vi],
```

**Hoặc** nếu method mới chưa import trực tiếp, thêm vào fallback objects:
- `VIDEO_V3_METHODS` — cho video methods mới
- `TEXT_V3_METHODS` — cho text methods mới  
- `NEW_METHODS_FALLBACK` — cho image/video methods mới

---

## 🔍 Checklist kiểm tra Method hoàn chỉnh

### ✅ Đầy đủ (như metadata — mẫu chuẩn):
- [ ] `src/lib/methods/{type}/{file}.ts` — Logic phân tích
- [ ] `src/app/methods/{type}/{id}/page.tsx` — Trang chi tiết
- [ ] `src/app/methods/{type}/{id}/i18n/en.json` — i18n tiếng Anh (nội dung tiếng Anh chất lượng cao)
- [ ] `src/app/methods/{type}/{id}/i18n/vi.json` — i18n tiếng Việt (nội dung tiếng Việt chất lượng cao)
- [ ] `src/app/methods/{type}/{id}/i18n/zh.json` — i18n tiếng Trung
- [ ] `src/app/methods/{type}/{id}/i18n/ja.json` — i18n tiếng Nhật
- [ ] `src/app/methods/{type}/{id}/i18n/ko.json` — i18n tiếng Hàn
- [ ] `src/app/methods/{type}/{id}/i18n/es.json` — i18n tiếng Tây Ban Nha
- [ ] `data.ts` METHODS array — Đã đăng ký
- [ ] `index.ts` barrel export — Đã export
- [ ] `methodsI18n.ts` — Đã import cho listing page
- [ ] en.json có `references` với title + url
- [ ] en.json các trường `mechanism`, `parameters` có nội dung chi tiết
- [ ] en.json hoàn toàn bằng tiếng Anh (không trộn tiếng Việt)

---

## ⚠️ Các lỗi thường gặp ở method MỚI

### Lỗi 1: en.json trộn tiếng Việt
```json
// ❌ SAI (trộn tiếng Việt trong file EN)
{
    "name": "Tần suất trạng từ",
    "mechanism": "Analyzes tần suất trạng từ patterns..."
}

// ✅ ĐÚNG
{
    "name": "Adverb Frequency",
    "mechanism": "Analyzes adverb usage frequency patterns..."
}
```

### Lỗi 2: Nội dung generic/template
```json
// ❌ SAI (quá generic)
{
    "algorithm": "Tần suất trạng từ Analysis Algorithm",
    "mechanism": "Analyzes patterns to detect AI-generated content.",
    "parameters": "Analysis type: statistical, Media: text"
}

// ✅ ĐÚNG (cụ thể, chuyên sâu)
{
    "algorithm": "Statistical Adverb Distribution Analyzer",
    "mechanism": "1. **Tokenization**: Splits text into tokens and POS tags...\n2. **Adverb Extraction**: Identifies adverbs...",
    "parameters": "POS tags tracked: RB, RBR, RBS\nBaseline frequency: 4-8% of total words\nThreshold: >12% suggests AI generation"
}
```

### Lỗi 3: Thiếu references
```json
// ❌ SAI
{
    "source": "Research-based statistical analysis method"
}

// ✅ ĐÚNG
{
    "source": "Guo et al. (2023). How Close is ChatGPT to Human Experts? NeurIPS.",
    "references": [
        {"title": "Guo et al. (2023). How Close is ChatGPT to Human Experts?", "url": "https://arxiv.org/abs/2301.07597"}
    ]
}
```

### Lỗi 4: page.tsx chỉ có 2 ngôn ngữ
```tsx
// Tối thiểu chấp nhận được nhưng CHƯA hoàn chỉnh
const i18n = { en, vi };

// Hoàn chỉnh (như mẫu metadata)
const i18n = { en, vi, zh, ja, ko, es };
```

---

## 📊 Thống kê hiện tại

| Media Type | Tổng methods | Có page + i18n | Có đủ 6 ngôn ngữ |
|-----------|-------------|---------------|------------------|
| Image | ~167 | ~167 | ~80 (batch đầu) |
| Video | ~120 | ~120 | ~30 (batch đầu) |
| Text | ~100 | ~100 | 0 |

> **Lưu ý**: Phần lớn method mới (v3-v6) có page + i18n nhưng chỉ en/vi và nội dung en.json chất lượng thấp (trộn tiếng Việt, generic).
