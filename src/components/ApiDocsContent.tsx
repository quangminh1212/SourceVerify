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

    return (
        <div className="flex-1 min-w-0 py-10 sm:py-14 lg:py-16 flex justify-center">
            <div className="w-full max-w-4xl px-8 sm:px-12 lg:px-16">

                {/* Overview */}
                <div id="overview" className="mb-12 scroll-mt-20 animate-fade-in-up">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-[1.1] text-[--color-text-primary] mb-3">
                        SourceVerify <span className="gradient-text">API</span>
                    </h1>
                    <p className="text-sm sm:text-base leading-[1.8] text-[--color-text-secondary]">
                        Integrate AI-generated content detection into your applications with a simple REST API.
                    </p>
                </div>

                {/* Authentication */}
                <div id="auth" className="mb-12 scroll-mt-20 animate-fade-in-up">
                    <h2 className="text-lg font-bold text-[--color-text-primary] mb-4 pb-2 border-b border-[--color-border-subtle]">Authentication</h2>
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

                {/* Rate Limits */}
                <div id="rate-limits" className="mb-12 scroll-mt-20 animate-fade-in-up">
                    <h2 className="text-lg font-bold text-[--color-text-primary] mb-4 pb-2 border-b border-[--color-border-subtle]">Rate Limits</h2>
                    <table className="api-table">
                        <thead><tr><th>Plan</th><th>Requests / min</th><th>Daily Limit</th></tr></thead>
                        <tbody>
                            <tr><td>Free</td><td>10</td><td>100</td></tr>
                            <tr><td>Pro</td><td>60</td><td>5,000</td></tr>
                            <tr><td>Enterprise</td><td>300</td><td>Unlimited</td></tr>
                        </tbody>
                    </table>
                    <p className="text-xs text-[--color-text-muted] mt-3">Exceeding the rate limit will return a <code>429 Too Many Requests</code> response.</p>
                </div>

                {/* Endpoint */}
                <div id="endpoint" className="mb-12 scroll-mt-20 animate-fade-in-up">
                    <h2 className="text-lg font-bold text-[--color-text-primary] mb-4 pb-2 border-b border-[--color-border-subtle]">Endpoint</h2>
                    <div className="api-endpoint-card">
                        <div className="api-method">POST</div>
                        <code className="api-url">/api/v1/analyze</code>
                    </div>

                    <div id="headers" className="mt-5 scroll-mt-20">
                        <h3 className="text-sm font-semibold text-[--color-text-primary] mb-2">Headers</h3>
                        <table className="api-table">
                            <thead><tr><th>Header</th><th>Required</th><th>Description</th></tr></thead>
                            <tbody>
                                <tr><td><code>X-API-Key</code></td><td>Yes</td><td>Your API key</td></tr>
                                <tr><td><code>Content-Type</code></td><td>No</td><td><code>multipart/form-data</code> or <code>application/json</code></td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div id="request-body" className="mt-5 scroll-mt-20">
                        <h3 className="text-sm font-semibold text-[--color-text-primary] mb-2">Request Body</h3>
                        <table className="api-table">
                            <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
                            <tbody>
                                <tr><td><code>image</code></td><td>File / Base64</td><td>Image to analyze (max 10MB)</td></tr>
                                <tr><td><code>fileName</code></td><td>String</td><td>Optional filename (JSON requests)</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Response */}
                <div id="response" className="mb-12 scroll-mt-20 animate-fade-in-up">
                    <h2 className="text-lg font-bold text-[--color-text-primary] mb-4 pb-2 border-b border-[--color-border-subtle]">Response</h2>
                    <pre className="api-response-example">{JSON.stringify({
                        success: true,
                        data: {
                            verdict: "ai",
                            confidence: 87,
                            aiScore: 78,
                            signals: [{ name: "Noise Residual", score: 82 }],
                            processingTimeMs: 245,
                        },
                    }, null, 2)}</pre>

                    <div id="verdict-values" className="mt-5 scroll-mt-20">
                        <h3 className="text-sm font-semibold text-[--color-text-primary] mb-2">Verdict Values</h3>
                        <table className="api-table">
                            <thead><tr><th>Value</th><th>Meaning</th><th>Score</th></tr></thead>
                            <tbody>
                                <tr><td><code className="verdict-ai">&quot;ai&quot;</code></td><td>Likely AI-generated</td><td>&ge; 55</td></tr>
                                <tr><td><code className="verdict-real">&quot;real&quot;</code></td><td>Likely authentic</td><td>&le; 40</td></tr>
                                <tr><td><code className="verdict-unc">&quot;uncertain&quot;</code></td><td>Inconclusive</td><td>41–54</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Error Codes */}
                <div id="error-codes" className="mb-12 scroll-mt-20 animate-fade-in-up">
                    <h2 className="text-lg font-bold text-[--color-text-primary] mb-4 pb-2 border-b border-[--color-border-subtle]">Error Codes</h2>
                    <table className="api-table">
                        <thead><tr><th>Status</th><th>Code</th><th>Description</th></tr></thead>
                        <tbody>
                            <tr><td><code>400</code></td><td>INVALID_IMAGE</td><td>Image is invalid or corrupted</td></tr>
                            <tr><td><code>401</code></td><td>UNAUTHORIZED</td><td>Missing or invalid API key</td></tr>
                            <tr><td><code>413</code></td><td>FILE_TOO_LARGE</td><td>Image exceeds 10MB limit</td></tr>
                            <tr><td><code>429</code></td><td>RATE_LIMITED</td><td>Too many requests</td></tr>
                            <tr><td><code>500</code></td><td>INTERNAL_ERROR</td><td>Server error</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* Code Examples */}
                <div id="examples" className="mb-12 scroll-mt-20 animate-fade-in-up">
                    <h2 className="text-lg font-bold text-[--color-text-primary] mb-4 pb-2 border-b border-[--color-border-subtle]">Examples</h2>
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

                {/* Test Result */}
                {testResult && (
                    <div className="mb-12 animate-fade-in-up">
                        <h2 className="text-lg font-bold text-[--color-text-primary] mb-4 pb-2 border-b border-[--color-border-subtle]">Test Result</h2>
                        <pre className="api-response-example">{testResult}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}
