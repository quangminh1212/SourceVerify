"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API_DOCS_URL = "https://sourceverify.app";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

interface UserInfo {
    apiKey: string;
    email: string;
    name: string;
    picture: string;
    usageCount: number;
}

export default function ApiDocsPage() {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("curl");
    const [testResult, setTestResult] = useState<string>("");
    const [testing, setTesting] = useState(false);

    const handleGoogleCallback = useCallback(async (response: { credential: string }) => {
        try {
            const res = await fetch("/api/v1/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: response.credential }),
            });
            const data = await res.json();
            if (data.success) {
                setUser(data.data);
                localStorage.setItem("sv_user", JSON.stringify(data.data));
            }
        } catch (e) {
            console.error("Auth error:", e);
        }
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem("sv_user");
        if (saved) {
            try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
        }

        if (!GOOGLE_CLIENT_ID) return;
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).google) {
                const google = (window as unknown as Record<string, Record<string, { initialize: (c: unknown) => void; renderButton: (e: HTMLElement | null, c: unknown) => void }>>).google;
                if (google?.accounts?.id) {
                    google.accounts.id.initialize({
                        client_id: GOOGLE_CLIENT_ID,
                        callback: handleGoogleCallback,
                    });
                    const btnEl = document.getElementById("google-signin-btn");
                    if (btnEl) {
                        google.accounts.id.renderButton(btnEl, {
                            theme: "filled_black",
                            size: "large",
                            text: "signin_with",
                            shape: "rectangular",
                            width: 280,
                        });
                    }
                }
            }
        };
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
    }, [handleGoogleCallback]);

    const copyKey = () => {
        if (user?.apiKey) {
            navigator.clipboard.writeText(user.apiKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("sv_user");
    };

    const testApi = async () => {
        if (!user?.apiKey) return;
        setTesting(true);
        setTestResult("Analyzing...");
        try {
            const canvas = document.createElement("canvas");
            canvas.width = 100; canvas.height = 100;
            const ctx = canvas.getContext("2d")!;
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(0, 0, 100, 100);
            const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), "image/png"));
            const formData = new FormData();
            formData.append("image", blob, "test.png");

            const res = await fetch("/api/v1/analyze", {
                method: "POST",
                headers: { "X-API-Key": user.apiKey },
                body: formData,
            });
            const data = await res.json();
            setTestResult(JSON.stringify(data, null, 2));
        } catch (e) {
            setTestResult(`Error: ${e instanceof Error ? e.message : "Unknown"}`);
        }
        setTesting(false);
    };

    const apiKey = user?.apiKey || "YOUR_API_KEY";

    const codeExamples: Record<string, string> = {
        curl: `curl -X POST ${API_DOCS_URL}/api/v1/analyze \\
  -H "X-API-Key: ${apiKey}" \\
  -F "image=@photo.jpg"`,

        python: `import requests

response = requests.post(
    "${API_DOCS_URL}/api/v1/analyze",
    headers={"X-API-Key": "${apiKey}"},
    files={"image": open("photo.jpg", "rb")}
)
print(response.json())`,

        javascript: `const formData = new FormData();
formData.append("image", fileInput.files[0]);

const res = await fetch("${API_DOCS_URL}/api/v1/analyze", {
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

req, _ := http.NewRequest("POST", "${API_DOCS_URL}/api/v1/analyze", body)
req.Header.Set("X-API-Key", "${apiKey}")
req.Header.Set("Content-Type", writer.FormDataContentType())
resp, _ := http.DefaultClient.Do(req)`,

        ruby: `require 'net/http'
require 'uri'

uri = URI("${API_DOCS_URL}/api/v1/analyze")
req = Net::HTTP::Post.new(uri)
req["X-API-Key"] = "${apiKey}"
form = [["image", File.open("photo.jpg")]]
req.set_form(form, "multipart/form-data")
res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |h| h.request(req) }
puts res.body`,

        php: `$ch = curl_init("${API_DOCS_URL}/api/v1/analyze");
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
    .uri(URI.create("${API_DOCS_URL}/api/v1/analyze"))
    .header("X-API-Key", "${apiKey}")
    .header("Content-Type", body.contentType())
    .POST(body)
    .build();
HttpResponse<String> res = client.send(request, BodyHandlers.ofString());`,

        csharp: `using var client = new HttpClient();
client.DefaultRequestHeaders.Add("X-API-Key", "${apiKey}");
using var content = new MultipartFormDataContent();
content.Add(new StreamContent(File.OpenRead("photo.jpg")), "image", "photo.jpg");
var res = await client.PostAsync("${API_DOCS_URL}/api/v1/analyze", content);
var json = await res.Content.ReadAsStringAsync();`,

        rust: `let form = reqwest::multipart::Form::new()
    .file("image", "photo.jpg").await?;
let res = reqwest::Client::new()
    .post("${API_DOCS_URL}/api/v1/analyze")
    .header("X-API-Key", "${apiKey}")
    .multipart(form)
    .send().await?
    .json::<serde_json::Value>().await?;`,

        kotlin: `val file = File("photo.jpg")
val body = MultipartBody.Builder().setType(MultipartBody.FORM)
    .addFormDataPart("image", file.name, file.asRequestBody())
    .build()
val request = Request.Builder()
    .url("${API_DOCS_URL}/api/v1/analyze")
    .addHeader("X-API-Key", "${apiKey}")
    .post(body).build()
val response = OkHttpClient().newCall(request).execute()`,

        swift: `var request = URLRequest(url: URL(string: "${API_DOCS_URL}/api/v1/analyze")!)
request.httpMethod = "POST"
request.setValue("${apiKey}", forHTTPHeaderField: "X-API-Key")
let boundary = UUID().uuidString
request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
var data = Data()
data.append("--\(boundary)\r\nContent-Disposition: form-data; name=\"image\"; filename=\"photo.jpg\"\r\n\r\n".data(using: .utf8)!)
data.append(try! Data(contentsOf: URL(fileURLWithPath: "photo.jpg")))
data.append("\r\n--\(boundary)--\r\n".data(using: .utf8)!)
request.httpBody = data
let (responseData, _) = try await URLSession.shared.upload(for: request, from: data)`,

        dart: `import 'package:http/http.dart' as http;

var request = http.MultipartRequest('POST',
    Uri.parse('${API_DOCS_URL}/api/v1/analyze'));
request.headers['X-API-Key'] = '${apiKey}';
request.files.add(await http.MultipartFile.fromPath('image', 'photo.jpg'));
var response = await request.send();
print(await response.stream.bytesToString());`,
    };

    return (
        <main className="relative min-h-screen flex flex-col">
            <Header />

            <div className="flex-1 flex">
                {/* Sidebar */}
                <aside className="api-docs-sidebar">
                    <nav className="sticky top-16 py-6 px-4">
                        <p className="text-[11px] font-bold text-[--color-text-muted] uppercase tracking-widest mb-4">API Reference</p>
                        <div className="space-y-0.5">
                            {[
                                { id: "overview", label: "Overview", indent: false },
                                { id: "auth", label: "Authentication", indent: false },
                                { id: "endpoint", label: "Endpoint", indent: false },
                                { id: "headers", label: "Headers", indent: true },
                                { id: "request-body", label: "Request Body", indent: true },
                                { id: "response", label: "Response", indent: false },
                                { id: "verdict-values", label: "Verdict Values", indent: true },
                                { id: "examples", label: "Examples", indent: false },
                            ].map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className={`api-sidebar-link ${item.indent ? "api-sidebar-sub" : ""}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                                    }}
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </nav>
                </aside>

                {/* Content */}
                <div className="flex-1 min-w-0 py-10 sm:py-14 lg:py-16">
                    <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">

                        {/* Overview */}
                        <div id="overview" className="mb-12 scroll-mt-20 animate-fade-in-up">
                            <div className="subpage-badge">API v1</div>
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
                                            <button onClick={copyKey} className="api-copy-btn">
                                                {copied ? "Copied" : "Copy"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="api-user-actions">
                                        <button onClick={testApi} className="api-test-btn" disabled={testing}>
                                            {testing ? "Testing..." : "Test API"}
                                        </button>
                                        <button onClick={logout} className="api-logout-btn">Sign Out</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="api-signin-card">
                                    <p className="text-sm text-[--color-text-secondary] mb-2">Sign in with Google to get your API key.</p>
                                    <div id="google-signin-btn"></div>
                                    {!GOOGLE_CLIENT_ID && (
                                        <p className="api-note">
                                            Google Client ID not configured. Set <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in your environment.
                                        </p>
                                    )}
                                </div>
                            )}
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
            </div>

            <Footer />
        </main>
    );
}
