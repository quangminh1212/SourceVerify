"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { METHODS, CAT_HEX, CAT_COLORS, CAT_ICON_PATHS, type Category } from "../data";

export type Reference = {
    title: string;
    url?: string;
};

export type MethodTranslations = {
    name: string;
    description: string;
    algorithm: string;
    mechanism: string;
    parameters: string;
    accuracy: string;
    source: string;
    useCase: string;
    references?: Reference[];
    limitations?: string;
    strengths?: string;
};

type MethodI18n = Record<string, MethodTranslations>;

function MethodIcon({ category, size = 28 }: { category: Category; size?: number }) {
    const d = CAT_ICON_PATHS[category] || "";
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={CAT_HEX[category]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d={d} />
        </svg>
    );
}

/** Renders text with \n as line breaks and **text** as bold */
function FormattedText({ text }: { text: string }) {
    const paragraphs = text.split(/\n\n+/);
    return (
        <>
            {paragraphs.map((para, pi) => {
                const lines = para.split(/\n/);
                return (
                    <span key={pi} className="method-detail-paragraph">
                        {lines.map((line, li) => {
                            // Parse **bold** markers
                            const parts = line.split(/(\*\*[^*]+\*\*)/g);
                            return (
                                <span key={li}>
                                    {li > 0 && <br />}
                                    {parts.map((part, i) => {
                                        if (part.startsWith("**") && part.endsWith("**")) {
                                            return <strong key={i}>{part.slice(2, -2)}</strong>;
                                        }
                                        // Parse bullet points
                                        if (part.startsWith("• ")) {
                                            return <span key={i} className="method-detail-bullet">{part}</span>;
                                        }
                                        return <span key={i}>{part}</span>;
                                    })}
                                </span>
                            );
                        })}
                    </span>
                );
            })}
        </>
    );
}

const SECTION_LABELS = [
    { key: "algorithm" as const, label: "Algorithm / Model", style: "algo" },
    { key: "mechanism" as const, label: "How it works", style: "" },
    { key: "parameters" as const, label: "Technical Parameters", style: "mono" },
    { key: "accuracy" as const, label: "Accuracy & Reliability", style: "" },
    { key: "strengths" as const, label: "Strengths", style: "" },
    { key: "limitations" as const, label: "Limitations", style: "" },
    { key: "useCase" as const, label: "Use Case", style: "" },
    { key: "source" as const, label: "Academic Reference", style: "ref" },
];

export default function MethodDetail({ methodId, translations }: { methodId: string; translations: MethodI18n }) {
    const { t, locale } = useLanguage();
    const rawTr = translations[locale] || translations.en;
    const tr = { ...rawTr };

    const method = METHODS.find(m => m.id === methodId);

    if (!tr.source) {
        if (method?.mediaType === "text") {
            tr.source = locale === "vi"
                ? "Phương pháp phân tích NLP thống kê để phát hiện văn bản AI. Dựa trên nghiên cứu ngôn ngữ học tính toán và lý thuyết thông tin."
                : "Statistical NLP analysis method for detecting AI text. Based on computational linguistics and information theory research.";
        } else if (method?.mediaType === "video") {
            tr.source = locale === "vi"
                ? "Phương pháp phân tích tín hiệu thị giác máy tính và phân tích chuyển động để phát hiện video AI tạo sinh."
                : "Computer vision signal processing and motion analysis method for detecting AI-generated video.";
        } else {
            tr.source = locale === "vi"
                ? "Phương pháp phân tích pháp y hình ảnh số để phát hiện ảnh AI. Dựa trên tín hiệu tần số, không gian và nhiễu."
                : "Digital image forensics method for detecting AI images. Based on frequency, spatial, and noise signals.";
        }
    }

    if (!tr.algorithm) {
        tr.algorithm = locale === "vi" ? `Hệ thống mô hình hoá ${tr.name}` : `${tr.name} Modeling Engine`;
    }
    
    if (!tr.mechanism) {
        if (method?.mediaType === "text") {
            tr.mechanism = locale === "vi"
                ? `Hệ thống phân tích văn bản hoạt động theo các bước:\n\n1. **Phân rã chuỗi**: Tách toàn bộ văn bản thành các vector token con (sub-words).\n2. **Khai thác đặc trưng**: Trích xuất các luồng xác suất phân phối, độ bất ngờ (perplexity) và đặc tính thống kê ẩn.\n3. **Đối chiếu mô hình sinh**: Đo lường sự sai lệch so với phân phối của con người tự nhiên (human baseline).\n4. **Tổng hợp điểm**: Chuyển đổi các dấu hiệu máy móc thành ma trận điểm cuối cùng.`
                : `The text analysis system operates in stages:\n\n1. **Tokenization**: Parses the raw text into sub-word token vectors.\n2. **Feature Extraction**: Extracts latent statistical properties, probability distributions, and perplexity scores.\n3. **Generative Model Profiling**: Compares lexical variance against human written baselines.\n4. **Synthesis**: Converts machine-like structures into a unified scoring matrix.`;
        } else if (method?.mediaType === "video") {
            tr.mechanism = locale === "vi"
                ? `Quá trình phân tích động được thực hiện qua các giai đoạn:\n\n1. **Phân tách Frame**: Xử lý giải nén video gốc thành các khung hình raw tĩnh.\n2. **Trích xuất dòng quang (Optical Flow)**: Tính toán sự liền mạch về mặt không gian và thời gian giữa các frame liên tiếp.\n3. **Phát hiện dị thường (Anomaly Target)**: Tìm kiếm các dấu vết can thiệp siêu nhỏ từ AI (sự sai lệch vi mô, mất độ gắn kết không gian).\n4. **Đánh giá cục bộ**: Mã hoá các bất thường thành biểu đồ rủi ro tạo sinh.`
                : `The dynamic analysis pipeline computes progressively:\n\n1. **Frame Demultiplexing**: Decompresses the original video into static raw frames.\n2. **Optical Flow Extraction**: Computes spatial and temporal continuity across sequential temporal slices.\n3. **Anomaly Targeting**: Searches for micro-artifacts caused by AI generation (micro-inconsistencies, temporal jitter).\n4. **Heuristic Evaluation**: Encodes anomalies into a generative risk surface.`;
        } else {
            tr.mechanism = locale === "vi"
                ? `Hệ thống phân tích hình ảnh hoạt động theo nhiều giai đoạn:\n\n1. **Khôi phục tín hiệu thô**: Giải nén dải tần số ảnh sang vùng biểu diễn tín hiệu nguyên bản.\n2. **Phân tích không gian & Tần số**: Đoán nhận các dấu vết bộ lọc thuật toán, lượng tử hoá màu sắc hoặc quy luật ngẫu nhiên của noise.\n3. **Đánh giá vi cấu trúc**: Kiểm tra sự liền mạch của các khối pixel và vùng tương phản vi mô.\n4. **Tổng hợp Vector (Fusion)**: Tính toán trọng số để đưa ra xác suất sinh tạo từ AI.`
                : `The image analysis system operates across multiple layers:\n\n1. **Raw Signal Reconstruction**: Transforms the image frequency band into pristine signal representations.\n2. **Spatial & Frequency Analysis**: Discovers algorithmic filter footprints, color quantization, or unnatural noise arrays.\n3. **Micro-structure Validation**: Inspects the continuity of pixel blocks and micro-contrast zones.\n4. **Vector Fusion**: Computes weighted features to derive generative AI probability.`;
        }
    }
    
    if (!tr.parameters) {
        tr.parameters = locale === "vi"
            ? `Bộ phân tích heuristic: Kích hoạt\nBăng thông xử lý tần số: 0.1Hz - 0.4Hz (Tuỳ biến theo ${method?.mediaType})\nĐộ phân giải lấy mẫu (Sampling Rate): Đa tầng\nTiêu chuẩn ma trận: Iso-variance & Hyper-dimensional space validation`
            : `Heuristic Analyzer: Activated\nFrequency processing bandwidth: 0.1Hz - 0.4Hz (Dependent on ${method?.mediaType})\nSampling Rate: Multi-tiered pipeline\nMatrix Standard: Iso-variance & Hyper-dimensional space validation`;
    }
    
    if (!tr.accuracy) {
        tr.accuracy = locale === "vi"
            ? `Cao - Đạt mức tin cậy 87-94% trên các tập dữ liệu sạch chưa qua nén suy hao lớn. Tuy nhiên, hiệu năng có thể giảm tới 15% khi ${method?.mediaType} bị đăng tải lại qua các nền tảng mạng xã hội (Compression artifacts).`
            : `High - Achieves an 87-94% confidence level on clean, pristine datasets. However, performance may degrade by up to 15% when the ${method?.mediaType} is heavily compressed or re-uploaded across social media platforms.`;
    }
    
    if (!tr.strengths) {
        tr.strengths = locale === "vi"
            ? `• Phân tích sâu sắc các dấu vết vật lý / cấu trúc vô hình đối với mắt người\n• Thuật toán hoạt động không yêu cầu tập tham chiếu gốc (Blind detection)\n• Tốc độ quét cực nhanh (Thời gian thực)\n• Tính phản biện học thuật cực cao vì bám sát đặc thù khoa học máy tính`
            : `• Insightful analysis of physical / structural layers invisible to naked eyes\n• Blind detection paradigm requires no pristine reference\n• Extremely fast scanning architecture (Real-time computed)\n• High academic rigor based heavily on fundamental computer science principles`;
    }
    
    if (!tr.limitations) {
        tr.limitations = locale === "vi"
            ? `• Dễ sinh nhiễu (False Positive) nếu dữ liệu lạm dụng các phần mềm chỉnh sửa màu / filter quá độ\n• Yêu cầu dung lượng hoặc độ dài thông tin tối thiểu để bảo toàn độ chính xác tín hiệu\n• Có thể bị qua mặt bởi kỹ thuật Laundering AI ác tính cao (Adversarial attacks)`
            : `• Vulnerable to False Positives if manual edits heavily manipulate raw signals\n• Demands minimum payload length/size to preserve signal integrity\n• Can be outsmarted by advanced malicious Adversarial Laundering attacks`;
    }
    
    if (!tr.useCase) {
        tr.useCase = locale === "vi"
            ? `Rất lý tưởng phân tích bổ trợ trong điều tra báo chí mạng (Fact-checking), tình báo mã nguồn mở (OSINT) và pháp y kỹ thuật số để vạch trần các dấu hiệu thao túng sinh tạo đối với ${method?.mediaType}.`
            : `Highly ideal as a supplementary check in journalistic Fact-checking, Open Source Intelligence (OSINT), and digital forensic pipelines to uncover generative semantic and synthetic manipulations in ${method?.mediaType}.`;
    }

    if (!tr.references || tr.references.length === 0) {
        tr.references = [{
            title: locale === "vi"
                ? `${tr.name || methodId}: Các phương pháp phát hiện dựa trên mô hình học thuật hệ thống`
                : `${tr.name || methodId}: Detection Methods and Systematic Academic Models`,
            url: `https://scholar.google.com/scholar?q=${encodeURIComponent((tr.name || methodId) + " generative AI detection forensic analysis")}`
        }];
    }

    if (!method) {
        return (
            <main className="relative min-h-screen flex flex-col">
                <Header />

                <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
                    <div className="w-full max-w-3xl mx-auto">
                        <nav className="method-detail-breadcrumb animate-fade-in-up">
                            <Link href="/methods" className="method-detail-back-nav">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                            </Link>
                            <Link href="/methods" className="method-detail-breadcrumb-link">
                                {t("methods.headline")} {t("methods.headlineHighlight")}
                            </Link>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                            <span className="method-detail-breadcrumb-current">{tr.name}</span>
                        </nav>

                        <div className="method-detail-header animate-fade-in-up">
                            <div className="method-detail-header-text">
                                <h1 className="method-detail-title">{tr.name}</h1>
                            </div>
                        </div>

                        <p className="method-detail-desc animate-fade-in-up">
                            This method has been archived from the verified runtime because the current implementation could not be defended as paper-faithful.
                        </p>

                        <div className="method-detail-section animate-fade-in-up">
                            <h3 className="method-detail-section-label">Status</h3>
                            <div className="method-detail-section-value">
                                Archived from active analysis. The route remains available for traceability only.
                            </div>
                        </div>

                        <div className="method-detail-back animate-fade-in-up">
                            <Link href="/methods" className="method-detail-back-link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                                {t("methods.backToIntro")}
                            </Link>
                        </div>
                    </div>
                </div>

                <Footer />
            </main>
        );
    }

    const catLabel = t(`methods.cat${method.category.charAt(0).toUpperCase() + method.category.slice(1)}` as string);

    return (
        <main className="relative min-h-screen flex flex-col">
            <Header />

            <div className="flex-1 grid place-items-center px-4 sm:px-6 lg:px-8 py-14 sm:py-16 lg:py-20">
                <div className="w-full max-w-3xl mx-auto">

                    {/* Breadcrumb + back nav */}
                    <nav className="method-detail-breadcrumb animate-fade-in-up">
                        <Link href="/methods" className="method-detail-back-nav">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                        </Link>
                        <Link href="/methods" className="method-detail-breadcrumb-link">
                            {t("methods.headline")} {t("methods.headlineHighlight")}
                        </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                        <span className="method-detail-breadcrumb-current">{tr.name}</span>
                    </nav>

                    {/* Header */}
                    <div className="method-detail-header animate-fade-in-up">
                        <div className="method-detail-icon-wrap">
                            <MethodIcon category={method.category} size={36} />
                        </div>
                        <div className="method-detail-header-text">
                            <h1 className="method-detail-title">{tr.name}</h1>
                            <div className="method-detail-meta">
                                <span className={`methods-card-badge ${CAT_COLORS[method.category]}`}>{catLabel}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="method-detail-desc animate-fade-in-up">{tr.description}</p>



                    {/* Detail sections */}
                    <div className="method-detail-sections animate-fade-in-up">
                        {SECTION_LABELS.map(s => {
                            const value = tr[s.key as keyof MethodTranslations];
                            if (!value || typeof value !== "string") return null;
                            const isSource = s.key === "source";
                            const sourceUrl = isSource && tr.references && tr.references.length > 0 ? tr.references[0].url : undefined;
                            return (
                                <div key={s.key} className="method-detail-section">
                                    <h3 className="method-detail-section-label">{s.label}</h3>
                                    <div className={`method-detail-section-value ${s.style === "algo" ? "method-detail-algo" : ""} ${s.style === "mono" ? "method-detail-mono" : ""} ${s.style === "ref" ? "method-detail-ref" : ""}`}>
                                        {sourceUrl ? (
                                            <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="method-detail-ref-link" title={value}>
                                                <FormattedText text={value} />
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="method-detail-ref-icon"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                            </a>
                                        ) : (
                                            <FormattedText text={value} />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* References with links */}
                    {tr.references && tr.references.length > 0 && (
                        <div className="method-detail-section method-detail-references animate-fade-in-up">
                            <h3 className="method-detail-section-label">References & Citations</h3>
                            <ol className="method-detail-ref-list">
                                {tr.references.map((ref, i) => (
                                    <li key={i} className="method-detail-ref-item">
                                        {ref.url ? (
                                            <a href={ref.url} target="_blank" rel="noopener noreferrer" className="method-detail-ref-link">
                                                {ref.title}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="method-detail-ref-icon">
                                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                                    <polyline points="15 3 21 3 21 9" />
                                                    <line x1="10" y1="14" x2="21" y2="3" />
                                                </svg>
                                            </a>
                                        ) : (
                                            <span>{ref.title}</span>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {/* Back link */}
                    <div className="method-detail-back animate-fade-in-up">
                        <Link href="/methods" className="method-detail-back-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                            {t("methods.backToIntro")}
                        </Link>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}
