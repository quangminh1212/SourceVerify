"use client";

import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { getMethodTranslation } from "@/app/methods/methodsI18n";

interface UserInfo {
    apiKey: string;
    email: string;
    name: string;
    picture: string;
    usageCount: number;
}

interface ApiDocsContentProps {
    activeSection: string;
    user: UserInfo | null;
    copied: boolean;
    testing: boolean;
    testResult: string;
    onCopyKey: () => void;
    onTestApi: () => void;
    onLogout: () => void;
    googleClientId: string;
    apiDocsUrl: string;
    onSectionChange?: (section: string) => void;
}

export default function ApiDocsContent({
    activeSection,
    user,
    copied,
    testing,
    testResult,
    onCopyKey,
    onTestApi,
    onLogout,
    googleClientId,
    apiDocsUrl,
    onSectionChange,
}: ApiDocsContentProps) {
    const [activeTab, setActiveTab] = useState<string>("curl");
    const { t, locale } = useLanguage();
    const apiKey = user?.apiKey || "YOUR_API_KEY";

    const codeExamples: Record<string, string> = {
        curl: `curl -X POST ${apiDocsUrl}/api/analyze \\
  -H "X-API-Key: ${apiKey}" \\
  -F "image=@photo.jpg"`,

        python: `import requests

response = requests.post(
    "${apiDocsUrl}/api/analyze",
    headers={"X-API-Key": "${apiKey}"},
    files={"image": open("photo.jpg", "rb")}
)
print(response.json())`,

        javascript: `const formData = new FormData();
formData.append("image", fileInput.files[0]);

const res = await fetch("${apiDocsUrl}/api/analyze", {
  method: "POST",
  headers: { "X-API-Key": "${apiKey}" },
  body: formData,
});
console.log(await res.json());`,

        go: `file, _ := os.Open("photo.jpg")
body := &bytes.Buffer{}
writer := multipart.NewWriter(body)
part, _ := writer.CreateFormFile("image", "photo.jpg")
io.Copy(part, file)
writer.Close()

req, _ := http.NewRequest("POST", "${apiDocsUrl}/api/analyze", body)
req.Header.Set("X-API-Key", "${apiKey}")
req.Header.Set("Content-Type", writer.FormDataContentType())
resp, _ := http.DefaultClient.Do(req)`,

        ruby: `require 'net/http'
require 'uri'

uri = URI("${apiDocsUrl}/api/analyze")
req = Net::HTTP::Post.new(uri)
req["X-API-Key"] = "${apiKey}"
form = [["image", File.open("photo.jpg")]]
req.set_form(form, "multipart/form-data")
res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |h| h.request(req) }
puts res.body`,

        php: `$ch = curl_init("${apiDocsUrl}/api/analyze");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["X-API-Key: ${apiKey}"],
    CURLOPT_POSTFIELDS => [
        "image" => new CURLFile("photo.jpg")
    ]
]);
$response = json_decode(curl_exec($ch));
curl_close($ch);`,

        java: `HttpClient client = HttpClient.newHttpClient();
MultipartBodyPublisher body = MultipartBodyPublisher.newBuilder()
    .addFile("image", Path.of("photo.jpg"))
    .build();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("${apiDocsUrl}/api/analyze"))
    .header("X-API-Key", "${apiKey}")
    .header("Content-Type", body.contentType())
    .POST(body)
    .build();
HttpResponse<String> res = client.send(request, BodyHandlers.ofString());`,

        csharp: `using var client = new HttpClient();
client.DefaultRequestHeaders.Add("X-API-Key", "${apiKey}");
using var content = new MultipartFormDataContent();
content.Add(new StreamContent(File.OpenRead("photo.jpg")), "image", "photo.jpg");
var res = await client.PostAsync("${apiDocsUrl}/api/analyze", content);
var json = await res.Content.ReadAsStringAsync();`,

        rust: `let form = reqwest::multipart::Form::new()
    .file("image", "photo.jpg").await?;
let res = reqwest::Client::new()
    .post("${apiDocsUrl}/api/analyze")
    .header("X-API-Key", "${apiKey}")
    .multipart(form)
    .send().await?
    .json::<serde_json::Value>().await?;`,

        kotlin: `val file = File("photo.jpg")
val body = MultipartBody.Builder().setType(MultipartBody.FORM)
    .addFormDataPart("image", file.name, file.asRequestBody())
    .build()
val request = Request.Builder()
    .url("${apiDocsUrl}/api/analyze")
    .addHeader("X-API-Key", "${apiKey}")
    .post(body).build()
val response = OkHttpClient().newCall(request).execute()`,

        swift: `var request = URLRequest(url: URL(string: "${apiDocsUrl}/api/analyze")!)
request.httpMethod = "POST"
request.setValue("${apiKey}", forHTTPHeaderField: "X-API-Key")
let boundary = UUID().uuidString
request.setValue("multipart/form-data; boundary=\\(boundary)", forHTTPHeaderField: "Content-Type")
var data = Data()
data.append("--\\(boundary)\\r\\nContent-Disposition: form-data; name=\\"image\\"; filename=\\"photo.jpg\\"\\r\\n\\r\\n".data(using: .utf8)!)
data.append(try! Data(contentsOf: URL(fileURLWithPath: "photo.jpg")))
data.append("\\r\\n--\\(boundary)--\\r\\n".data(using: .utf8)!)
request.httpBody = data
let (responseData, _) = try await URLSession.shared.upload(for: request, from: data)`,

        dart: `import 'package:http/http.dart' as http;

var request = http.MultipartRequest('POST',
    Uri.parse('${apiDocsUrl}/api/analyze'));
request.headers['X-API-Key'] = '${apiKey}';
request.files.add(await http.MultipartFile.fromPath('image', 'photo.jpg'));
var response = await request.send();
print(await response.stream.bytesToString());`,
    };

    const renderSection = () => {
        switch (activeSection) {
            case "overview":
                return (
                    <div className="animate-fade-in-up api-overview-wrapper">
                        {/* Hero Section */}
                        <div className="api-hero">
                            <div>
                                <div className="flex items-center gap-3 api-hero-badges">
                                    <span className="text-[10px] uppercase tracking-[0.15em] font-semibold api-badge-label">{t("api.overview.badge")}</span>
                                    <span className="text-[10px] font-mono api-badge-version">v1.0</span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight api-hero-title">
                                    SourceVerify <span className="gradient-text">API</span>
                                </h1>
                                <p className="text-sm max-w-2xl api-hero-desc">
                                    {t("api.overview.desc")}
                                </p>

                                {/* Base URL inline */}
                                <div className="flex items-center gap-2 text-xs api-base-url-row">
                                    <span className="font-mono api-text-muted">BASE URL</span>
                                    <code className="font-mono api-text-blue">{apiDocsUrl}</code>
                                </div>

                                <div className="flex items-center gap-4 flex-wrap">
                                    <button
                                        onClick={() => onSectionChange?.("auth")}
                                        className="api-link-btn text-xs font-semibold transition-all duration-200"
                                    >
                                        {t("api.overview.getApiKey")}
                                    </button>
                                    <button
                                        onClick={() => onSectionChange?.("examples")}
                                        className="api-link-btn-secondary text-xs font-semibold transition-all duration-200"
                                    >
                                        {t("api.overview.viewExamples")}
                                    </button>
                                    <div className="flex items-center gap-2 ml-auto text-xs api-text-muted">
                                        <span className="w-1.5 h-1.5 rounded-full animate-pulse api-status-dot" />
                                        {t("api.overview.status")}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="api-divider" />

                        {/* Features */}
                        <h2 className="text-xs uppercase tracking-wider font-semibold api-features-title">{t("api.overview.keyFeatures")}</h2>
                        <div className="grid gap-12 sm:grid-cols-3">
                            <div>
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-5 api-feature-icon-blue">
                                    <svg className="w-4 h-4 api-icon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                                </div>
                                <h3 className="text-sm font-semibold mb-3 api-feature-title">{t("api.overview.feature1.title")}</h3>
                                <p className="text-xs api-feature-desc">{t("api.overview.feature1.desc")}</p>
                            </div>
                            <div>
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-5 api-feature-icon-green">
                                    <svg className="w-4 h-4 api-icon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>
                                </div>
                                <h3 className="text-sm font-semibold mb-3 api-feature-title">{t("api.overview.feature2.title")}</h3>
                                <p className="text-xs api-feature-desc">{t("api.overview.feature2.desc")}</p>
                            </div>
                            <div>
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-5 api-feature-icon-amber">
                                    <svg className="w-4 h-4 api-icon-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                                </div>
                                <h3 className="text-sm font-semibold mb-3 api-feature-title">{t("api.overview.feature3.title")}</h3>
                                <p className="text-xs api-feature-desc">{t("api.overview.feature3.desc")}</p>
                            </div>
                        </div>
                    </div>
                );

            case "auth":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5] api-section-header">{t("api.auth.title")}</h2>
                        <p className="text-sm mb-8 leading-[3] api-section-desc">{t("api.auth.desc", { code: "X-API-Key" })} </p>
                        {user ? (
                            <div className="api-user-card">
                                <div className="api-user-info">
                                    {user.picture && <img src={user.picture} alt="" className="api-user-avatar" referrerPolicy="no-referrer" />}
                                    <div>
                                        <div className="api-user-name">{user.name}</div>
                                        <div className="api-user-email">{user.email}</div>
                                    </div>
                                </div>
                                <div className="api-key-box">
                                    <label>{t("api.auth.apiKeyLabel")}</label>
                                    <div className="api-key-row">
                                        <code className="api-key-value">{user.apiKey}</code>
                                        <button onClick={onCopyKey} className="api-copy-btn">
                                            {copied ? t("api.auth.copied") : t("api.auth.copy")}
                                        </button>
                                    </div>
                                </div>
                                <div className="api-user-actions">
                                    <button onClick={onTestApi} className="api-test-btn" disabled={testing}>
                                        {testing ? t("api.auth.testing") : t("api.auth.testApi")}
                                    </button>
                                    <button onClick={onLogout} className="api-logout-btn">{t("api.auth.signOut")}</button>
                                </div>
                                {testResult && (
                                    <div className="mt-6">
                                        <h3 className="text-sm font-semibold text-white mb-2">{t("api.auth.testResult")}</h3>
                                        <pre className="api-response-example">{testResult}</pre>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="api-signin-card">
                                <p className="text-sm mb-2 leading-[3] api-section-desc">{t("api.auth.signInPrompt")}</p>
                                <div id="google-signin-btn"></div>
                                {!googleClientId && (
                                    <p className="api-note">
                                        {t("api.auth.noClientId", { code: "NEXT_PUBLIC_GOOGLE_CLIENT_ID" })}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                );

            case "rate-limits":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5] api-section-header">{t("api.rateLimits.title")}</h2>
                        <p className="text-sm mb-8 leading-[3] api-section-desc">{t("api.rateLimits.desc", { code: "429 Too Many Requests" })}</p>
                        <table className="api-table">
                            <thead><tr><th>{t("api.rateLimits.plan")}</th><th>{t("api.rateLimits.requestsPerMin")}</th><th>{t("api.rateLimits.dailyLimit")}</th><th>{t("api.rateLimits.maxFileSize")}</th></tr></thead>
                            <tbody>
                                <tr><td>{t("api.rateLimits.free")}</td><td>10</td><td>100</td><td>5 MB</td></tr>
                                <tr><td>{t("api.rateLimits.pro")}</td><td>60</td><td>5,000</td><td>10 MB</td></tr>
                                <tr><td>{t("api.rateLimits.enterprise")}</td><td>300</td><td>{t("api.rateLimits.unlimited")}</td><td>25 MB</td></tr>
                            </tbody>
                        </table>
                        <h3 className="text-sm font-semibold mb-4 leading-[3] api-section-subtitle api-rate-header-mt">{t("api.rateLimits.headersTitle")}</h3>
                        <p className="text-xs mb-4 leading-[3] api-section-desc">{t("api.rateLimits.headersDesc")}</p>
                        <table className="api-table">
                            <thead><tr><th>{t("api.rateLimits.header")}</th><th>{t("api.rateLimits.headerDesc")}</th></tr></thead>
                            <tbody>
                                <tr><td><code>X-RateLimit-Limit</code></td><td>{t("api.rateLimits.limitDesc")}</td></tr>
                                <tr><td><code>X-RateLimit-Remaining</code></td><td>{t("api.rateLimits.remainingDesc")}</td></tr>
                                <tr><td><code>X-RateLimit-Reset</code></td><td>{t("api.rateLimits.resetDesc")}</td></tr>
                            </tbody>
                        </table>
                    </div>
                );

            case "endpoint":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5] api-section-header">{t("api.endpoint.title")}</h2>
                        <p className="text-sm mb-8 leading-[3] api-section-desc">{t("api.endpoint.desc")}</p>
                        <div className="api-endpoint-card">
                            <div className="api-method">POST</div>
                            <code className="api-url">/api/analyze</code>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3] api-section-subtitle">{t("api.endpoint.headers")}</h3>
                            <table className="api-table">
                                <thead><tr><th>{t("api.endpoint.header")}</th><th>{t("api.endpoint.required")}</th><th>{t("api.endpoint.description")}</th></tr></thead>
                                <tbody>
                                    <tr><td><code>X-API-Key</code></td><td>{t("api.endpoint.yes")}</td><td>{t("api.endpoint.yourApiKey")}</td></tr>
                                    <tr><td><code>Content-Type</code></td><td>{t("api.endpoint.no")}</td><td><code>multipart/form-data</code> or <code>application/json</code></td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3] api-section-subtitle">{t("api.endpoint.requestBody")}</h3>
                            <table className="api-table">
                                <thead><tr><th>{t("api.endpoint.field")}</th><th>{t("api.endpoint.type")}</th><th>{t("api.endpoint.description")}</th></tr></thead>
                                <tbody>
                                    <tr><td><code>image</code></td><td>File / Base64</td><td>{t("api.endpoint.imageDesc")}</td></tr>
                                    <tr><td><code>fileName</code></td><td>String</td><td>{t("api.endpoint.filenameDesc")}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3] api-section-subtitle">{t("api.endpoint.exampleRequest")}</h3>
                            <pre className="api-code-block">{codeExamples.curl}</pre>
                        </div>
                    </div>
                );

            case "url-analysis":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5] api-section-header">{t("api.urlAnalysis.title")}</h2>
                        <p className="text-sm mb-8 leading-[3] api-section-desc">{t("api.urlAnalysis.desc")}</p>
                        <div className="api-endpoint-card">
                            <div className="api-method">POST</div>
                            <code className="api-url">/api/analyze-url</code>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3] api-section-subtitle">{t("api.endpoint.requestBody")}</h3>
                            <table className="api-table">
                                <thead><tr><th>{t("api.endpoint.field")}</th><th>{t("api.endpoint.type")}</th><th>{t("api.endpoint.description")}</th></tr></thead>
                                <tbody>
                                    <tr><td><code>url</code></td><td>String</td><td>{t("api.urlAnalysis.urlDesc")}</td></tr>
                                    <tr><td><code>followRedirects</code></td><td>Boolean</td><td>{t("api.urlAnalysis.followRedirects")}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3] api-section-subtitle">{t("api.urlAnalysis.exampleRequest")}</h3>
                            <pre className="api-code-block">{`curl -X POST ${apiDocsUrl}/api/analyze-url \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/photo.jpg"}'`}</pre>
                        </div>
                    </div>
                );

            case "batch-analysis":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5] api-section-header">{t("api.batch.title")}</h2>
                        <p className="text-sm mb-8 leading-[3] api-section-desc">{t("api.batch.desc")}</p>
                        <div className="api-endpoint-card">
                            <div className="api-method">POST</div>
                            <code className="api-url">/api/analyze-batch</code>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3] api-section-subtitle">{t("api.endpoint.requestBody")}</h3>
                            <table className="api-table">
                                <thead><tr><th>{t("api.endpoint.field")}</th><th>{t("api.endpoint.type")}</th><th>{t("api.endpoint.description")}</th></tr></thead>
                                <tbody>
                                    <tr><td><code>images</code></td><td>File[]</td><td>{t("api.batch.imagesDesc")}</td></tr>
                                    <tr><td><code>urls</code></td><td>String[]</td><td>{t("api.batch.urlsDesc")}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3] api-section-subtitle">{t("api.batch.exampleResponse")}</h3>
                            <pre className="api-response-example">{JSON.stringify({
                                success: true,
                                data: {
                                    results: [
                                        { index: 0, verdict: "ai", confidence: 87, aiScore: 78 },
                                        { index: 1, verdict: "real", confidence: 92, aiScore: 15 },
                                        { index: 2, verdict: "uncertain", confidence: 45, aiScore: 48 },
                                    ],
                                    totalProcessingTimeMs: 720,
                                },
                            }, null, 2)}</pre>
                        </div>
                    </div>
                );

            case "analysis-history":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5] api-section-header">{t("api.history.title")}</h2>
                        <p className="text-sm mb-8 leading-[3] api-section-desc">{t("api.history.desc")}</p>
                        <div className="api-endpoint-card">
                            <div className="api-method api-method-get">GET</div>
                            <code className="api-url">/api/history</code>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3] api-section-subtitle">{t("api.history.queryParams")}</h3>
                            <table className="api-table">
                                <thead><tr><th>{t("api.history.parameter")}</th><th>{t("api.endpoint.type")}</th><th>{t("api.endpoint.description")}</th></tr></thead>
                                <tbody>
                                    <tr><td><code>page</code></td><td>Number</td><td>{t("api.history.pageDesc")}</td></tr>
                                    <tr><td><code>limit</code></td><td>Number</td><td>{t("api.history.limitDesc")}</td></tr>
                                    <tr><td><code>verdict</code></td><td>String</td><td>{t("api.history.verdictDesc")}</td></tr>
                                    <tr><td><code>from</code></td><td>ISO Date</td><td>{t("api.history.fromDesc")}</td></tr>
                                    <tr><td><code>to</code></td><td>ISO Date</td><td>{t("api.history.toDesc")}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3] api-section-subtitle">{t("api.examples.exampleResponse")}</h3>
                            <pre className="api-response-example">{JSON.stringify({
                                success: true,
                                data: {
                                    results: [
                                        { id: "an_abc123", verdict: "ai", confidence: 87, createdAt: "2026-02-27T10:30:00Z" },
                                        { id: "an_def456", verdict: "real", confidence: 92, createdAt: "2026-02-27T09:15:00Z" },
                                    ],
                                    pagination: { page: 1, limit: 20, total: 42, totalPages: 3 },
                                },
                            }, null, 2)}</pre>
                        </div>
                    </div>
                );

            case "response":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5] api-section-header">{t("api.response.title")}</h2>
                        <p className="text-sm mb-8 leading-[3] api-section-desc">{t("api.response.desc")}</p>
                        <pre className="api-response-example">{JSON.stringify({
                            success: true,
                            data: {
                                verdict: "ai",
                                confidence: 87,
                                aiScore: 78,
                                signals: [{ name: "Noise Residual", score: 82 }, { name: "DCT Analysis", score: 74 }],
                                processingTimeMs: 245,
                            },
                        }, null, 2)}</pre>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3] api-section-subtitle">{t("api.response.fields")}</h3>
                            <table className="api-table">
                                <thead><tr><th>{t("api.endpoint.field")}</th><th>{t("api.endpoint.type")}</th><th>{t("api.endpoint.description")}</th></tr></thead>
                                <tbody>
                                    <tr><td><code>success</code></td><td>Boolean</td><td>{t("api.response.successDesc")}</td></tr>
                                    <tr><td><code>data.verdict</code></td><td>String</td><td>{t("api.response.verdictDesc")}</td></tr>
                                    <tr><td><code>data.confidence</code></td><td>Number</td><td>{t("api.response.confidenceDesc")}</td></tr>
                                    <tr><td><code>data.aiScore</code></td><td>Number</td><td>{t("api.response.aiScoreDesc")}</td></tr>
                                    <tr><td><code>data.signals</code></td><td>Array</td><td>{t("api.response.signalsDesc")}</td></tr>
                                    <tr><td><code>data.processingTimeMs</code></td><td>Number</td><td>{t("api.response.timeDesc")}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case "verdict-values":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5] api-section-header">{t("api.verdict.title")}</h2>
                        <p className="text-sm mb-8 leading-[3] api-section-desc">{t("api.verdict.desc", { code: "verdict" })}</p>
                        <table className="api-table">
                            <thead><tr><th>{t("api.verdict.value")}</th><th>{t("api.verdict.meaning")}</th><th>{t("api.verdict.scoreRange")}</th></tr></thead>
                            <tbody>
                                <tr><td><code className="verdict-ai">&quot;ai&quot;</code></td><td>{t("api.verdict.aiMeaning")}</td><td>&ge; 55</td></tr>
                                <tr><td><code className="verdict-real">&quot;real&quot;</code></td><td>{t("api.verdict.realMeaning")}</td><td>&le; 40</td></tr>
                                <tr><td><code className="verdict-unc">&quot;uncertain&quot;</code></td><td>{t("api.verdict.uncertainMeaning")}</td><td>41–54</td></tr>
                            </tbody>
                        </table>
                        <div className="mt-8 p-6 rounded-lg border api-callout-box">
                            <h3 className="text-sm font-semibold mb-4 leading-[3] api-section-subtitle">{t("api.verdict.bestPractice")}</h3>
                            <p className="text-xs leading-[3] api-section-desc">{t("api.verdict.bestPracticeDesc")}</p>
                        </div>
                    </div>
                );

            case "error-codes":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5] api-section-header">{t("api.errors.title")}</h2>
                        <p className="text-sm mb-8 leading-[3] api-section-desc">{t("api.errors.desc")}</p>
                        <table className="api-table">
                            <thead><tr><th>{t("api.errors.status")}</th><th>{t("api.errors.code")}</th><th>{t("api.errors.description")}</th></tr></thead>
                            <tbody>
                                <tr><td><code>400</code></td><td>INVALID_IMAGE</td><td>{t("api.errors.invalidImage")}</td></tr>
                                <tr><td><code>400</code></td><td>INVALID_URL</td><td>{t("api.errors.invalidUrl")}</td></tr>
                                <tr><td><code>401</code></td><td>UNAUTHORIZED</td><td>{t("api.errors.unauthorized")}</td></tr>
                                <tr><td><code>403</code></td><td>FORBIDDEN</td><td>{t("api.errors.forbidden")}</td></tr>
                                <tr><td><code>413</code></td><td>FILE_TOO_LARGE</td><td>{t("api.errors.tooLarge")}</td></tr>
                                <tr><td><code>429</code></td><td>RATE_LIMITED</td><td>{t("api.errors.rateLimited")}</td></tr>
                                <tr><td><code>500</code></td><td>INTERNAL_ERROR</td><td>{t("api.errors.internal")}</td></tr>
                            </tbody>
                        </table>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3] api-section-subtitle">{t("api.errors.responseFormat")}</h3>
                            <pre className="api-response-example">{JSON.stringify({
                                success: false,
                                error: {
                                    code: "RATE_LIMITED",
                                    message: "Rate limit exceeded. Please retry after 60 seconds.",
                                    retryAfter: 60,
                                },
                            }, null, 2)}</pre>
                        </div>
                    </div>
                );

            case "webhooks":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5] api-section-header">{t("api.webhooks.title")}</h2>
                        <p className="text-sm mb-8 leading-[3] api-section-desc">{t("api.webhooks.desc")}</p>
                        <div className="api-endpoint-card">
                            <div className="api-method">POST</div>
                            <code className="api-url">/api/webhooks</code>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3] api-section-subtitle">{t("api.webhooks.register")}</h3>
                            <table className="api-table">
                                <thead><tr><th>{t("api.endpoint.field")}</th><th>{t("api.endpoint.type")}</th><th>{t("api.endpoint.description")}</th></tr></thead>
                                <tbody>
                                    <tr><td><code>url</code></td><td>String</td><td>{t("api.webhooks.urlDesc")}</td></tr>
                                    <tr><td><code>events</code></td><td>String[]</td><td>{t("api.webhooks.eventsDesc")}</td></tr>
                                    <tr><td><code>secret</code></td><td>String</td><td>{t("api.webhooks.secretDesc")}</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3] api-section-subtitle">{t("api.webhooks.payload")}</h3>
                            <pre className="api-response-example">{JSON.stringify({
                                event: "analysis.complete",
                                data: {
                                    id: "an_abc123",
                                    verdict: "ai",
                                    confidence: 87,
                                    aiScore: 78,
                                    processingTimeMs: 245,
                                },
                                timestamp: "2026-02-27T10:30:00Z",
                            }, null, 2)}</pre>
                        </div>
                    </div>
                );


            case "analysis-methods": {
                const methods = [
                    { id: "metadata", icon: "📋", cat: "metadata", weight: 2.5, nameKey: "api.methods.metadata.name", descKey: "api.methods.metadata.desc" },
                    { id: "spectral", icon: "📊", cat: "frequency", weight: 4.0, nameKey: "api.methods.spectral.name", descKey: "api.methods.spectral.desc" },
                    { id: "reconstruction", icon: "🔬", cat: "frequency", weight: 4.0, nameKey: "api.methods.reconstruction.name", descKey: "api.methods.reconstruction.desc" },
                    { id: "noise", icon: "◫", cat: "pixel", weight: 3.5, nameKey: "api.methods.noise.name", descKey: "api.methods.noise.desc" },
                    { id: "edge", icon: "⬡", cat: "pixel", weight: 3.0, nameKey: "api.methods.edge.name", descKey: "api.methods.edge.desc" },
                    { id: "gradient", icon: "▤", cat: "pixel", weight: 3.5, nameKey: "api.methods.gradient.name", descKey: "api.methods.gradient.desc" },
                    { id: "benford", icon: "📈", cat: "statistical", weight: 3.0, nameKey: "api.methods.benford.name", descKey: "api.methods.benford.desc" },
                    { id: "chromatic", icon: "🌈", cat: "sensor", weight: 3.0, nameKey: "api.methods.chromatic.name", descKey: "api.methods.chromatic.desc" },
                    { id: "texture", icon: "🧩", cat: "pixel", weight: 3.0, nameKey: "api.methods.texture.name", descKey: "api.methods.texture.desc" },
                    { id: "cfa", icon: "⊞", cat: "sensor", weight: 3.5, nameKey: "api.methods.cfa.name", descKey: "api.methods.cfa.desc" },
                    { id: "dct", icon: "▦", cat: "frequency", weight: 3.5, nameKey: "api.methods.dct.name", descKey: "api.methods.dct.desc" },
                    { id: "color", icon: "◈", cat: "pixel", weight: 3.0, nameKey: "api.methods.color.name", descKey: "api.methods.color.desc" },
                    { id: "prnu", icon: "⊕", cat: "sensor", weight: 4.0, nameKey: "api.methods.prnu.name", descKey: "api.methods.prnu.desc" },
                ];
                const catLabel: Record<string, string> = {
                    pixel: t("api.methods.catPixel"),
                    frequency: t("api.methods.catFrequency"),
                    statistical: t("api.methods.catStatistical"),
                    metadata: t("api.methods.catMetadata"),
                    sensor: t("api.methods.catSensor"),
                };
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5] api-section-header">{t("api.methods.title")}</h2>
                        <p className="text-sm mb-8 leading-[3] api-section-desc">{t("api.methods.desc")}</p>

                        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 mb-10 api-methods-grid">
                            {methods.map((m) => (
                                <div key={m.id} className="api-method-card">
                                    <div className="api-method-card-header">
                                        <div className="api-method-card-title">
                                            <span className={`api-method-icon ${m.cat}`}>{m.icon}</span>
                                            {getMethodTranslation(m.id, locale).name}
                                        </div>
                                        <label className="api-toggle">
                                            <input type="checkbox" defaultChecked aria-label={getMethodTranslation(m.id, locale).name} />
                                            <span className="api-toggle-slider" />
                                        </label>
                                    </div>
                                    <p className="api-method-card-desc">{getMethodTranslation(m.id, locale).description}</p>
                                    <div className="api-method-card-meta">
                                        <span className={`api-method-badge cat-${m.cat}`}>{catLabel[m.cat]}</span>
                                        <span className="api-method-weight">{t("api.methods.weight")}: {m.weight}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3] api-section-subtitle">{t("api.methods.usage")}</h3>
                            <p className="text-xs mb-4 leading-[3] api-section-desc">{t("api.methods.usageDesc")}</p>
                            <pre className="api-code-block">{`curl -X POST ${apiDocsUrl}/api/analyze \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "image": "<base64>",
    "signals": ["noise", "spectral", "prnu", "dct"]
  }'

# ${t("api.methods.allSignals")}:
# "signals": ["metadata", "spectral", "reconstruction",
#   "noise", "edge", "gradient", "benford", "chromatic",
#   "texture", "cfa", "dct", "color", "prnu"]`}</pre>
                        </div>
                    </div>
                );
            }

            case "examples":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5] api-section-header">{t("api.examples.title")}</h2>
                        <p className="text-sm mb-8 leading-[3] api-section-desc">{t("api.examples.desc")}</p>
                        <div className="api-tabs">
                            {Object.entries({
                                curl: "cURL", python: "Python", javascript: "JS", go: "Go",
                                ruby: "Ruby", php: "PHP", java: "Java", csharp: "C#",
                                rust: "Rust", kotlin: "Kotlin", swift: "Swift", dart: "Dart",
                            }).map(([key, label]) => (
                                <button
                                    key={key}
                                    className={`api-tab ${activeTab === key ? "active" : ""}`}
                                    onClick={() => setActiveTab(key)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <pre className="api-code-block">{codeExamples[activeTab]}</pre>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="api-docs-content flex-1 min-w-0 flex justify-center">
            <div className="w-full max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
                {renderSection()}
            </div>
        </div>
    );
}
