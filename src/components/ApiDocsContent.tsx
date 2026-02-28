"use client";

import { useState } from "react";

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
                    <div className="animate-fade-in-up" style={{ paddingTop: '24px' }}>
                        {/* Hero Section */}
                        <div style={{ marginBottom: '48px' }}>
                            <div>
                                <div className="flex items-center gap-3" style={{ marginBottom: '24px' }}>
                                    <span className="text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: 'var(--color-accent-blue)' }}>Getting Started</span>
                                    <span className="text-[10px] font-mono" style={{ color: 'var(--color-text-muted)' }}>v1.0</span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)', lineHeight: '1.3', marginBottom: '24px' }}>
                                    SourceVerify <span className="gradient-text">API</span>
                                </h1>
                                <p className="text-sm max-w-2xl" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8', marginBottom: '32px' }}>
                                    Integrate AI-generated content detection into your applications with a simple REST API. Analyze images in milliseconds with industry-leading accuracy.
                                </p>

                                {/* Base URL inline */}
                                <div className="flex items-center gap-2 text-xs" style={{ marginBottom: '32px' }}>
                                    <span className="font-mono" style={{ color: 'var(--color-text-muted)' }}>BASE URL</span>
                                    <code className="font-mono" style={{ color: 'var(--color-accent-blue)' }}>{apiDocsUrl}</code>
                                </div>

                                <div className="flex items-center gap-4 flex-wrap">
                                    <button
                                        onClick={() => onSectionChange?.("auth")}
                                        className="text-xs font-semibold transition-all duration-200"
                                        style={{ color: 'var(--color-accent-blue)', background: 'none', border: 'none', outline: 'none' }}
                                    >
                                        Get API Key →
                                    </button>
                                    <button
                                        onClick={() => onSectionChange?.("examples")}
                                        className="text-xs font-semibold transition-all duration-200"
                                        style={{ color: 'var(--color-text-secondary)', background: 'none', border: 'none', outline: 'none' }}
                                    >
                                        View Examples
                                    </button>
                                    <div className="flex items-center gap-2 ml-auto text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--color-accent-green)' }} />
                                        All systems operational
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ marginTop: '24px', marginBottom: '48px', borderTop: '1px solid var(--color-border-subtle)' }} />

                        {/* Features */}
                        <h2 className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>Key Features</h2>
                        <div className="grid gap-12 sm:grid-cols-3">
                            <div>
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-5" style={{ background: 'rgba(66, 133, 244, 0.08)' }}>
                                    <svg className="w-4 h-4" style={{ color: 'var(--color-accent-blue)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                                </div>
                                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Image Analysis</h3>
                                <p className="text-xs" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>Detect AI-generated images with advanced multi-signal analysis and deep learning models.</p>
                            </div>
                            <div>
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-5" style={{ background: 'rgba(52, 168, 83, 0.08)' }}>
                                    <svg className="w-4 h-4" style={{ color: 'var(--color-accent-green)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></svg>
                                </div>
                                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Fast & Reliable</h3>
                                <p className="text-xs" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>Average response time under 500ms with 99.9% uptime guarantee and global CDN.</p>
                            </div>
                            <div>
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-5" style={{ background: 'rgba(251, 188, 4, 0.08)' }}>
                                    <svg className="w-4 h-4" style={{ color: 'var(--color-accent-amber)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                                </div>
                                <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>REST API</h3>
                                <p className="text-xs" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8' }}>Simple HTTP endpoints with JSON responses. Easy to integrate with any language.</p>
                            </div>
                        </div>
                    </div>
                );

            case "auth":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5]" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border-subtle)' }}>Authentication</h2>
                        <p className="text-sm mb-8 leading-[3]" style={{ color: 'var(--color-text-secondary)' }}>All API requests require an API key sent via the <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--color-bg-tertiary)' }}>X-API-Key</code> header.</p>
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
                                    <label>API Key</label>
                                    <div className="api-key-row">
                                        <code className="api-key-value">{user.apiKey}</code>
                                        <button onClick={onCopyKey} className="api-copy-btn">
                                            {copied ? "Copied" : "Copy"}
                                        </button>
                                    </div>
                                </div>
                                <div className="api-user-actions">
                                    <button onClick={onTestApi} className="api-test-btn" disabled={testing}>
                                        {testing ? "Testing..." : "Test API"}
                                    </button>
                                    <button onClick={onLogout} className="api-logout-btn">Sign Out</button>
                                </div>
                                {testResult && (
                                    <div className="mt-6">
                                        <h3 className="text-sm font-semibold text-white mb-2">Test Result</h3>
                                        <pre className="api-response-example">{testResult}</pre>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="api-signin-card">
                                <p className="text-sm mb-2 leading-[3]" style={{ color: 'var(--color-text-secondary)' }}>Sign in with Google to get your API key.</p>
                                <div id="google-signin-btn"></div>
                                {!googleClientId && (
                                    <p className="api-note">
                                        Google Client ID not configured. Set <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in your environment.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                );

            case "rate-limits":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5]" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border-subtle)' }}>Rate Limits</h2>
                        <p className="text-sm mb-8 leading-[3]" style={{ color: 'var(--color-text-secondary)' }}>API rate limits vary by plan. Exceeding them returns <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--color-bg-tertiary)' }}>429 Too Many Requests</code>.</p>
                        <table className="api-table">
                            <thead><tr><th>Plan</th><th>Requests / min</th><th>Daily Limit</th><th>Max File Size</th></tr></thead>
                            <tbody>
                                <tr><td>Free</td><td>10</td><td>100</td><td>5 MB</td></tr>
                                <tr><td>Pro</td><td>60</td><td>5,000</td><td>10 MB</td></tr>
                                <tr><td>Enterprise</td><td>300</td><td>Unlimited</td><td>25 MB</td></tr>
                            </tbody>
                        </table>
                        <h3 className="text-sm font-semibold mb-4 leading-[3]" style={{ color: 'var(--color-text-primary)', marginTop: '32px' }}>Rate Limit Headers</h3>
                        <p className="text-xs mb-4 leading-[3]" style={{ color: 'var(--color-text-secondary)' }}>Each response includes headers to track your usage:</p>
                        <table className="api-table">
                            <thead><tr><th>Header</th><th>Description</th></tr></thead>
                            <tbody>
                                <tr><td><code>X-RateLimit-Limit</code></td><td>Max requests per minute</td></tr>
                                <tr><td><code>X-RateLimit-Remaining</code></td><td>Remaining requests in current window</td></tr>
                                <tr><td><code>X-RateLimit-Reset</code></td><td>Unix timestamp when the window resets</td></tr>
                            </tbody>
                        </table>
                    </div>
                );

            case "endpoint":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5]" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border-subtle)' }}>Analyze Image</h2>
                        <p className="text-sm mb-8 leading-[3]" style={{ color: 'var(--color-text-secondary)' }}>Upload an image file to analyze whether it was AI-generated or authentic.</p>
                        <div className="api-endpoint-card">
                            <div className="api-method">POST</div>
                            <code className="api-url">/api/analyze</code>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3]" style={{ color: 'var(--color-text-primary)' }}>Headers</h3>
                            <table className="api-table">
                                <thead><tr><th>Header</th><th>Required</th><th>Description</th></tr></thead>
                                <tbody>
                                    <tr><td><code>X-API-Key</code></td><td>Yes</td><td>Your API key</td></tr>
                                    <tr><td><code>Content-Type</code></td><td>No</td><td><code>multipart/form-data</code> or <code>application/json</code></td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3]" style={{ color: 'var(--color-text-primary)' }}>Request Body</h3>
                            <table className="api-table">
                                <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
                                <tbody>
                                    <tr><td><code>image</code></td><td>File / Base64</td><td>Image to analyze (max 10MB)</td></tr>
                                    <tr><td><code>fileName</code></td><td>String</td><td>Optional filename (JSON requests)</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3]" style={{ color: 'var(--color-text-primary)' }}>Example Request</h3>
                            <pre className="api-code-block">{codeExamples.curl}</pre>
                        </div>
                    </div>
                );

            case "url-analysis":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5]" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border-subtle)' }}>Analyze by URL</h2>
                        <p className="text-sm mb-8 leading-[3]" style={{ color: 'var(--color-text-secondary)' }}>Analyze an image by providing its public URL instead of uploading a file.</p>
                        <div className="api-endpoint-card">
                            <div className="api-method">POST</div>
                            <code className="api-url">/api/analyze-url</code>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3]" style={{ color: 'var(--color-text-primary)' }}>Request Body</h3>
                            <table className="api-table">
                                <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
                                <tbody>
                                    <tr><td><code>url</code></td><td>String</td><td>Public URL of the image to analyze</td></tr>
                                    <tr><td><code>followRedirects</code></td><td>Boolean</td><td>Follow redirects (default: true)</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3]" style={{ color: 'var(--color-text-primary)' }}>Example Request</h3>
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
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5]" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border-subtle)' }}>Batch Analysis</h2>
                        <p className="text-sm mb-8 leading-[3]" style={{ color: 'var(--color-text-secondary)' }}>Analyze up to 10 images in a single request. Results are returned in the same order as the input.</p>
                        <div className="api-endpoint-card">
                            <div className="api-method">POST</div>
                            <code className="api-url">/api/analyze-batch</code>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3]" style={{ color: 'var(--color-text-primary)' }}>Request Body</h3>
                            <table className="api-table">
                                <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
                                <tbody>
                                    <tr><td><code>images</code></td><td>File[]</td><td>Up to 10 image files</td></tr>
                                    <tr><td><code>urls</code></td><td>String[]</td><td>Array of image URLs (alternative)</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3]" style={{ color: 'var(--color-text-primary)' }}>Example Response</h3>
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
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5]" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border-subtle)' }}>Analysis History</h2>
                        <p className="text-sm mb-8 leading-[3]" style={{ color: 'var(--color-text-secondary)' }}>Retrieve your past analysis results with pagination and filtering support.</p>
                        <div className="api-endpoint-card">
                            <div className="api-method api-method-get">GET</div>
                            <code className="api-url">/api/history</code>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3]" style={{ color: 'var(--color-text-primary)' }}>Query Parameters</h3>
                            <table className="api-table">
                                <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
                                <tbody>
                                    <tr><td><code>page</code></td><td>Number</td><td>Page number (default: 1)</td></tr>
                                    <tr><td><code>limit</code></td><td>Number</td><td>Results per page (default: 20, max: 100)</td></tr>
                                    <tr><td><code>verdict</code></td><td>String</td><td>Filter by verdict: ai, real, uncertain</td></tr>
                                    <tr><td><code>from</code></td><td>ISO Date</td><td>Start date filter</td></tr>
                                    <tr><td><code>to</code></td><td>ISO Date</td><td>End date filter</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3]" style={{ color: 'var(--color-text-primary)' }}>Example Response</h3>
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
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5]" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border-subtle)' }}>Response Format</h2>
                        <p className="text-sm mb-8 leading-[3]" style={{ color: 'var(--color-text-secondary)' }}>All endpoints return JSON with a consistent structure.</p>
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
                            <h3 className="text-sm font-semibold mb-4 leading-[3]" style={{ color: 'var(--color-text-primary)' }}>Response Fields</h3>
                            <table className="api-table">
                                <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
                                <tbody>
                                    <tr><td><code>success</code></td><td>Boolean</td><td>Whether the request was successful</td></tr>
                                    <tr><td><code>data.verdict</code></td><td>String</td><td>Detection result: ai, real, or uncertain</td></tr>
                                    <tr><td><code>data.confidence</code></td><td>Number</td><td>Confidence level (0–100)</td></tr>
                                    <tr><td><code>data.aiScore</code></td><td>Number</td><td>AI likelihood score (0–100)</td></tr>
                                    <tr><td><code>data.signals</code></td><td>Array</td><td>Individual analysis signal results</td></tr>
                                    <tr><td><code>data.processingTimeMs</code></td><td>Number</td><td>Processing time in milliseconds</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case "verdict-values":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5]" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border-subtle)' }}>Verdict Values</h2>
                        <p className="text-sm mb-8 leading-[3]" style={{ color: 'var(--color-text-secondary)' }}>The <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--color-bg-tertiary)' }}>verdict</code> field indicates the classification result.</p>
                        <table className="api-table">
                            <thead><tr><th>Value</th><th>Meaning</th><th>Score Range</th></tr></thead>
                            <tbody>
                                <tr><td><code className="verdict-ai">&quot;ai&quot;</code></td><td>Likely AI-generated</td><td>&ge; 55</td></tr>
                                <tr><td><code className="verdict-real">&quot;real&quot;</code></td><td>Likely authentic</td><td>&le; 40</td></tr>
                                <tr><td><code className="verdict-unc">&quot;uncertain&quot;</code></td><td>Inconclusive</td><td>41–54</td></tr>
                            </tbody>
                        </table>
                        <div className="mt-8 p-6 rounded-lg border" style={{ borderColor: 'var(--color-border-subtle)', background: 'var(--color-bg-secondary)' }}>
                            <h3 className="text-sm font-semibold mb-4 leading-[3]" style={{ color: 'var(--color-text-primary)' }}>💡 Best Practice</h3>
                            <p className="text-xs leading-[3]" style={{ color: 'var(--color-text-secondary)' }}>For production use, treat &quot;uncertain&quot; results as requiring human review. Consider using the confidence score alongside the verdict for nuanced decision-making.</p>
                        </div>
                    </div>
                );

            case "error-codes":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5]" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border-subtle)' }}>Error Codes</h2>
                        <p className="text-sm mb-8 leading-[3]" style={{ color: 'var(--color-text-secondary)' }}>When an error occurs, the API returns an appropriate HTTP status code with details.</p>
                        <table className="api-table">
                            <thead><tr><th>Status</th><th>Code</th><th>Description</th></tr></thead>
                            <tbody>
                                <tr><td><code>400</code></td><td>INVALID_IMAGE</td><td>Image is invalid or corrupted</td></tr>
                                <tr><td><code>400</code></td><td>INVALID_URL</td><td>URL is not a valid image URL</td></tr>
                                <tr><td><code>401</code></td><td>UNAUTHORIZED</td><td>Missing or invalid API key</td></tr>
                                <tr><td><code>403</code></td><td>FORBIDDEN</td><td>API key does not have required permissions</td></tr>
                                <tr><td><code>413</code></td><td>FILE_TOO_LARGE</td><td>Image exceeds size limit</td></tr>
                                <tr><td><code>429</code></td><td>RATE_LIMITED</td><td>Too many requests</td></tr>
                                <tr><td><code>500</code></td><td>INTERNAL_ERROR</td><td>Server error</td></tr>
                            </tbody>
                        </table>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3]" style={{ color: 'var(--color-text-primary)' }}>Error Response Format</h3>
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
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5]" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border-subtle)' }}>Webhooks</h2>
                        <p className="text-sm mb-8 leading-[3]" style={{ color: 'var(--color-text-secondary)' }}>Receive real-time notifications when an analysis completes. Register a webhook URL to get POST requests with results.</p>
                        <div className="api-endpoint-card">
                            <div className="api-method">POST</div>
                            <code className="api-url">/api/webhooks</code>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3]" style={{ color: 'var(--color-text-primary)' }}>Register Webhook</h3>
                            <table className="api-table">
                                <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
                                <tbody>
                                    <tr><td><code>url</code></td><td>String</td><td>Your webhook endpoint URL (HTTPS required)</td></tr>
                                    <tr><td><code>events</code></td><td>String[]</td><td>Events to subscribe: analysis.complete, analysis.failed</td></tr>
                                    <tr><td><code>secret</code></td><td>String</td><td>Signing secret for verifying webhook payloads</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-10">
                            <h3 className="text-sm font-semibold mb-4 leading-[3]" style={{ color: 'var(--color-text-primary)' }}>Webhook Payload</h3>
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


            case "examples":
                return (
                    <div className="animate-fade-in-up leading-[3]">
                        <h2 className="text-xl font-bold mb-8 pb-3 border-b leading-[2.5]" style={{ color: 'var(--color-text-primary)', borderColor: 'var(--color-border-subtle)' }}>Code Examples</h2>
                        <p className="text-sm mb-8 leading-[3]" style={{ color: 'var(--color-text-secondary)' }}>Quick start examples in 12 programming languages.</p>
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
        <div className="api-docs-content flex-1 min-w-0 flex justify-center" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
            <div className="w-full max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
                {renderSection()}
            </div>
        </div>
    );
}
