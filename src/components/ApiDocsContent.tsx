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
}: ApiDocsContentProps) {
    const [activeTab, setActiveTab] = useState<string>("curl");
    const apiKey = user?.apiKey || "YOUR_API_KEY";

    const codeExamples: Record<string, string> = {
        curl: `curl -X POST ${apiDocsUrl}/api/v1/analyze \\
  -H "X-API-Key: ${apiKey}" \\
  -F "image=@photo.jpg"`,

        python: `import requests

response = requests.post(
    "${apiDocsUrl}/api/v1/analyze",
    headers={"X-API-Key": "${apiKey}"},
    files={"image": open("photo.jpg", "rb")}
)
print(response.json())`,

        javascript: `const formData = new FormData();
formData.append("image", fileInput.files[0]);

const res = await fetch("${apiDocsUrl}/api/v1/analyze", {
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

req, _ := http.NewRequest("POST", "${apiDocsUrl}/api/v1/analyze", body)
req.Header.Set("X-API-Key", "${apiKey}")
req.Header.Set("Content-Type", writer.FormDataContentType())
resp, _ := http.DefaultClient.Do(req)`,

        ruby: `require 'net/http'
require 'uri'

uri = URI("${apiDocsUrl}/api/v1/analyze")
req = Net::HTTP::Post.new(uri)
req["X-API-Key"] = "${apiKey}"
form = [["image", File.open("photo.jpg")]]
req.set_form(form, "multipart/form-data")
res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |h| h.request(req) }
puts res.body`,

        php: `$ch = curl_init("${apiDocsUrl}/api/v1/analyze");
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
    .uri(URI.create("${apiDocsUrl}/api/v1/analyze"))
    .header("X-API-Key", "${apiKey}")
    .header("Content-Type", body.contentType())
    .POST(body)
    .build();
HttpResponse<String> res = client.send(request, BodyHandlers.ofString());`,

        csharp: `using var client = new HttpClient();
client.DefaultRequestHeaders.Add("X-API-Key", "${apiKey}");
using var content = new MultipartFormDataContent();
content.Add(new StreamContent(File.OpenRead("photo.jpg")), "image", "photo.jpg");
var res = await client.PostAsync("${apiDocsUrl}/api/v1/analyze", content);
var json = await res.Content.ReadAsStringAsync();`,

        rust: `let form = reqwest::multipart::Form::new()
    .file("image", "photo.jpg").await?;
let res = reqwest::Client::new()
    .post("${apiDocsUrl}/api/v1/analyze")
    .header("X-API-Key", "${apiKey}")
    .multipart(form)
    .send().await?
    .json::<serde_json::Value>().await?;`,

        kotlin: `val file = File("photo.jpg")
val body = MultipartBody.Builder().setType(MultipartBody.FORM)
    .addFormDataPart("image", file.name, file.asRequestBody())
    .build()
val request = Request.Builder()
    .url("${apiDocsUrl}/api/v1/analyze")
    .addHeader("X-API-Key", "${apiKey}")
    .post(body).build()
val response = OkHttpClient().newCall(request).execute()`,

        swift: `var request = URLRequest(url: URL(string: "${apiDocsUrl}/api/v1/analyze")!)
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
    Uri.parse('${apiDocsUrl}/api/v1/analyze'));
request.headers['X-API-Key'] = '${apiKey}';
request.files.add(await http.MultipartFile.fromPath('image', 'photo.jpg'));
var response = await request.send();
print(await response.stream.bytesToString());`,
    };

    const renderSection = () => {
        switch (activeSection) {
            case "overview":
                return (
                    <div className="animate-fade-in-up">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary] mb-5">
                            SourceVerify <span className="gradient-text">API</span>
                        </h1>
                        <p className="text-sm sm:text-base leading-[1.8] text-[--color-text-secondary] mb-8">
                            Integrate AI-generated content detection into your applications with a simple REST API.
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="p-5 rounded-xl border border-[--color-border-subtle] bg-[--color-bg-subtle]">
                                <div className="text-2xl mb-2">🔍</div>
                                <h3 className="text-sm font-semibold text-[--color-text-primary] mb-1">Image Analysis</h3>
                                <p className="text-xs text-[--color-text-muted]">Detect AI-generated images with advanced signal analysis</p>
                            </div>
                            <div className="p-5 rounded-xl border border-[--color-border-subtle] bg-[--color-bg-subtle]">
                                <div className="text-2xl mb-2">⚡</div>
                                <h3 className="text-sm font-semibold text-[--color-text-primary] mb-1">Fast & Reliable</h3>
                                <p className="text-xs text-[--color-text-muted]">Average response time under 500ms with 99.9% uptime</p>
                            </div>
                            <div className="p-5 rounded-xl border border-[--color-border-subtle] bg-[--color-bg-subtle]">
                                <div className="text-2xl mb-2">🔗</div>
                                <h3 className="text-sm font-semibold text-[--color-text-primary] mb-1">REST API</h3>
                                <p className="text-xs text-[--color-text-muted]">Simple HTTP endpoints with JSON responses and SDKs</p>
                            </div>
                        </div>
                    </div>
                );

            case "auth":
                return (
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-bold text-[--color-text-primary] mb-6 pb-3 border-b border-[--color-border-subtle]">Authentication</h2>
                        <p className="text-sm text-[--color-text-secondary] mb-6">All API requests require an API key sent via the <code className="text-xs bg-[--color-bg-subtle] px-1.5 py-0.5 rounded">X-API-Key</code> header.</p>
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
                                        <h3 className="text-sm font-semibold text-[--color-text-primary] mb-2">Test Result</h3>
                                        <pre className="api-response-example">{testResult}</pre>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="api-signin-card">
                                <p className="text-sm text-[--color-text-secondary] mb-2">Sign in with Google to get your API key.</p>
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
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-bold text-[--color-text-primary] mb-6 pb-3 border-b border-[--color-border-subtle]">Rate Limits</h2>
                        <p className="text-sm text-[--color-text-secondary] mb-6">API rate limits vary by plan. Exceeding them returns <code className="text-xs bg-[--color-bg-subtle] px-1.5 py-0.5 rounded">429 Too Many Requests</code>.</p>
                        <table className="api-table">
                            <thead><tr><th>Plan</th><th>Requests / min</th><th>Daily Limit</th><th>Max File Size</th></tr></thead>
                            <tbody>
                                <tr><td>Free</td><td>10</td><td>100</td><td>5 MB</td></tr>
                                <tr><td>Pro</td><td>60</td><td>5,000</td><td>10 MB</td></tr>
                                <tr><td>Enterprise</td><td>300</td><td>Unlimited</td><td>25 MB</td></tr>
                            </tbody>
                        </table>
                        <div className="mt-6 p-4 rounded-lg border border-[--color-border-subtle] bg-[--color-bg-subtle]">
                            <h3 className="text-sm font-semibold text-[--color-text-primary] mb-2">Rate Limit Headers</h3>
                            <p className="text-xs text-[--color-text-muted] mb-3">Each response includes headers to track your usage:</p>
                            <table className="api-table">
                                <thead><tr><th>Header</th><th>Description</th></tr></thead>
                                <tbody>
                                    <tr><td><code>X-RateLimit-Limit</code></td><td>Max requests per minute</td></tr>
                                    <tr><td><code>X-RateLimit-Remaining</code></td><td>Remaining requests in current window</td></tr>
                                    <tr><td><code>X-RateLimit-Reset</code></td><td>Unix timestamp when the window resets</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case "endpoint":
                return (
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-bold text-[--color-text-primary] mb-6 pb-3 border-b border-[--color-border-subtle]">Analyze Image</h2>
                        <p className="text-sm text-[--color-text-secondary] mb-6">Upload an image file to analyze whether it was AI-generated or authentic.</p>
                        <div className="api-endpoint-card">
                            <div className="api-method">POST</div>
                            <code className="api-url">/api/v1/analyze</code>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-[--color-text-primary] mb-3">Headers</h3>
                            <table className="api-table">
                                <thead><tr><th>Header</th><th>Required</th><th>Description</th></tr></thead>
                                <tbody>
                                    <tr><td><code>X-API-Key</code></td><td>Yes</td><td>Your API key</td></tr>
                                    <tr><td><code>Content-Type</code></td><td>No</td><td><code>multipart/form-data</code> or <code>application/json</code></td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-[--color-text-primary] mb-3">Request Body</h3>
                            <table className="api-table">
                                <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
                                <tbody>
                                    <tr><td><code>image</code></td><td>File / Base64</td><td>Image to analyze (max 10MB)</td></tr>
                                    <tr><td><code>fileName</code></td><td>String</td><td>Optional filename (JSON requests)</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-[--color-text-primary] mb-3">Example Request</h3>
                            <pre className="api-code-block">{codeExamples.curl}</pre>
                        </div>
                    </div>
                );

            case "url-analysis":
                return (
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-bold text-[--color-text-primary] mb-6 pb-3 border-b border-[--color-border-subtle]">Analyze by URL</h2>
                        <p className="text-sm text-[--color-text-secondary] mb-6">Analyze an image by providing its public URL instead of uploading a file.</p>
                        <div className="api-endpoint-card">
                            <div className="api-method">POST</div>
                            <code className="api-url">/api/v1/analyze-url</code>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-[--color-text-primary] mb-3">Request Body</h3>
                            <table className="api-table">
                                <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
                                <tbody>
                                    <tr><td><code>url</code></td><td>String</td><td>Public URL of the image to analyze</td></tr>
                                    <tr><td><code>followRedirects</code></td><td>Boolean</td><td>Follow redirects (default: true)</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-[--color-text-primary] mb-3">Example Request</h3>
                            <pre className="api-code-block">{`curl -X POST ${apiDocsUrl}/api/v1/analyze-url \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/photo.jpg"}'`}</pre>
                        </div>
                    </div>
                );

            case "batch-analysis":
                return (
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-bold text-[--color-text-primary] mb-6 pb-3 border-b border-[--color-border-subtle]">Batch Analysis</h2>
                        <p className="text-sm text-[--color-text-secondary] mb-6">Analyze up to 10 images in a single request. Results are returned in the same order as the input.</p>
                        <div className="api-endpoint-card">
                            <div className="api-method">POST</div>
                            <code className="api-url">/api/v1/analyze-batch</code>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-[--color-text-primary] mb-3">Request Body</h3>
                            <table className="api-table">
                                <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
                                <tbody>
                                    <tr><td><code>images</code></td><td>File[]</td><td>Up to 10 image files</td></tr>
                                    <tr><td><code>urls</code></td><td>String[]</td><td>Array of image URLs (alternative)</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-[--color-text-primary] mb-3">Example Response</h3>
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
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-bold text-[--color-text-primary] mb-6 pb-3 border-b border-[--color-border-subtle]">Analysis History</h2>
                        <p className="text-sm text-[--color-text-secondary] mb-6">Retrieve your past analysis results with pagination and filtering support.</p>
                        <div className="api-endpoint-card">
                            <div className="api-method api-method-get">GET</div>
                            <code className="api-url">/api/v1/history</code>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-[--color-text-primary] mb-3">Query Parameters</h3>
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
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-[--color-text-primary] mb-3">Example Response</h3>
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
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-bold text-[--color-text-primary] mb-6 pb-3 border-b border-[--color-border-subtle]">Response Format</h2>
                        <p className="text-sm text-[--color-text-secondary] mb-6">All endpoints return JSON with a consistent structure.</p>
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
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-[--color-text-primary] mb-3">Response Fields</h3>
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
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-bold text-[--color-text-primary] mb-6 pb-3 border-b border-[--color-border-subtle]">Verdict Values</h2>
                        <p className="text-sm text-[--color-text-secondary] mb-6">The <code className="text-xs bg-[--color-bg-subtle] px-1.5 py-0.5 rounded">verdict</code> field indicates the classification result.</p>
                        <table className="api-table">
                            <thead><tr><th>Value</th><th>Meaning</th><th>Score Range</th></tr></thead>
                            <tbody>
                                <tr><td><code className="verdict-ai">&quot;ai&quot;</code></td><td>Likely AI-generated</td><td>&ge; 55</td></tr>
                                <tr><td><code className="verdict-real">&quot;real&quot;</code></td><td>Likely authentic</td><td>&le; 40</td></tr>
                                <tr><td><code className="verdict-unc">&quot;uncertain&quot;</code></td><td>Inconclusive</td><td>41–54</td></tr>
                            </tbody>
                        </table>
                        <div className="mt-8 p-4 rounded-lg border border-[--color-border-subtle] bg-[--color-bg-subtle]">
                            <h3 className="text-sm font-semibold text-[--color-text-primary] mb-2">💡 Best Practice</h3>
                            <p className="text-xs text-[--color-text-muted]">For production use, treat &quot;uncertain&quot; results as requiring human review. Consider using the confidence score alongside the verdict for nuanced decision-making.</p>
                        </div>
                    </div>
                );

            case "error-codes":
                return (
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-bold text-[--color-text-primary] mb-6 pb-3 border-b border-[--color-border-subtle]">Error Codes</h2>
                        <p className="text-sm text-[--color-text-secondary] mb-6">When an error occurs, the API returns an appropriate HTTP status code with details.</p>
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
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-[--color-text-primary] mb-3">Error Response Format</h3>
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
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-bold text-[--color-text-primary] mb-6 pb-3 border-b border-[--color-border-subtle]">Webhooks</h2>
                        <p className="text-sm text-[--color-text-secondary] mb-6">Receive real-time notifications when an analysis completes. Register a webhook URL to get POST requests with results.</p>
                        <div className="api-endpoint-card">
                            <div className="api-method">POST</div>
                            <code className="api-url">/api/v1/webhooks</code>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-[--color-text-primary] mb-3">Register Webhook</h3>
                            <table className="api-table">
                                <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
                                <tbody>
                                    <tr><td><code>url</code></td><td>String</td><td>Your webhook endpoint URL (HTTPS required)</td></tr>
                                    <tr><td><code>events</code></td><td>String[]</td><td>Events to subscribe: analysis.complete, analysis.failed</td></tr>
                                    <tr><td><code>secret</code></td><td>String</td><td>Signing secret for verifying webhook payloads</td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-[--color-text-primary] mb-3">Webhook Payload</h3>
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

            case "sdks":
                return (
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-bold text-[--color-text-primary] mb-6 pb-3 border-b border-[--color-border-subtle]">SDKs & Libraries</h2>
                        <p className="text-sm text-[--color-text-secondary] mb-6">Official and community SDKs for popular languages.</p>
                        <table className="api-table">
                            <thead><tr><th>Language</th><th>Package</th><th>Install</th></tr></thead>
                            <tbody>
                                <tr><td>Python</td><td><code>sourceverify</code></td><td><code>pip install sourceverify</code></td></tr>
                                <tr><td>JavaScript</td><td><code>@sourceverify/sdk</code></td><td><code>npm install @sourceverify/sdk</code></td></tr>
                                <tr><td>Go</td><td><code>sourceverify-go</code></td><td><code>go get github.com/sourceverify/sourceverify-go</code></td></tr>
                                <tr><td>Ruby</td><td><code>sourceverify</code></td><td><code>gem install sourceverify</code></td></tr>
                                <tr><td>PHP</td><td><code>sourceverify/sdk</code></td><td><code>composer require sourceverify/sdk</code></td></tr>
                                <tr><td>Java</td><td><code>sourceverify-java</code></td><td><code>Maven / Gradle</code></td></tr>
                            </tbody>
                        </table>
                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-[--color-text-primary] mb-3">Python SDK Example</h3>
                            <pre className="api-code-block">{`from sourceverify import SourceVerify

client = SourceVerify(api_key="${apiKey}")

# Analyze a local file
result = client.analyze("photo.jpg")
print(result.verdict)     # "ai" | "real" | "uncertain"
print(result.confidence)  # 0-100

# Analyze by URL
result = client.analyze_url("https://example.com/photo.jpg")

# Batch analysis
results = client.analyze_batch(["img1.jpg", "img2.jpg", "img3.jpg"])`}</pre>
                        </div>
                    </div>
                );

            case "examples":
                return (
                    <div className="animate-fade-in-up">
                        <h2 className="text-xl font-bold text-[--color-text-primary] mb-6 pb-3 border-b border-[--color-border-subtle]">Code Examples</h2>
                        <p className="text-sm text-[--color-text-secondary] mb-6">Quick start examples in 12 programming languages.</p>
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
        <div className="flex-1 min-w-0 py-10 sm:py-14 lg:py-16">
            <div className="w-full max-w-6xl px-8 sm:px-12 lg:px-16">
                {renderSection()}
            </div>
        </div>
    );
}
