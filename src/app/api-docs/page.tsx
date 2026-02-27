"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API_BASE = typeof window !== "undefined" ? window.location.origin : "";
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
    const [activeTab, setActiveTab] = useState<"curl" | "python" | "javascript" | "go">("curl");
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
        // Restore from localStorage
        const saved = localStorage.getItem("sv_user");
        if (saved) {
            try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
        }

        // Load Google Identity Services
        if (!GOOGLE_CLIENT_ID) return;
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).google) {
                const google = (window as unknown as Record<string, { initialize: (config: unknown) => void; renderButton: (el: HTMLElement | null, config: unknown) => void }>).google;
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
            // Create a simple test image (1x1 red pixel PNG)
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
        curl: `# Upload image file
curl -X POST ${API_BASE}/api/v1/analyze \\
  -H "X-API-Key: ${apiKey}" \\
  -F "image=@photo.jpg"

# Or with base64 JSON
curl -X POST ${API_BASE}/api/v1/analyze \\
  -H "X-API-Key: ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"image": "data:image/jpeg;base64,...", "fileName": "photo.jpg"}'`,

        python: `import requests

API_KEY = "${apiKey}"
API_URL = "${API_BASE}/api/v1/analyze"

# Method 1: Upload file
with open("photo.jpg", "rb") as f:
    response = requests.post(
        API_URL,
        headers={"X-API-Key": API_KEY},
        files={"image": ("photo.jpg", f, "image/jpeg")}
    )

result = response.json()
print(f"Verdict: {result['data']['verdict']}")
print(f"AI Score: {result['data']['aiScore']}")
print(f"Confidence: {result['data']['confidence']}%")

# Method 2: Base64
import base64
with open("photo.jpg", "rb") as f:
    b64 = base64.b64encode(f.read()).decode()

response = requests.post(
    API_URL,
    headers={"X-API-Key": API_KEY, "Content-Type": "application/json"},
    json={"image": f"data:image/jpeg;base64,{b64}", "fileName": "photo.jpg"}
)`,

        javascript: `// Node.js / Browser
const API_KEY = "${apiKey}";
const API_URL = "${API_BASE}/api/v1/analyze";

// Method 1: FormData (Browser)
const formData = new FormData();
formData.append("image", fileInput.files[0]);

const response = await fetch(API_URL, {
  method: "POST",
  headers: { "X-API-Key": API_KEY },
  body: formData,
});
const result = await response.json();
console.log("Verdict:", result.data.verdict);
console.log("AI Score:", result.data.aiScore);

// Method 2: Node.js with fs
const fs = require("fs");
const image = fs.readFileSync("photo.jpg").toString("base64");

const res = await fetch(API_URL, {
  method: "POST",
  headers: {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    image: \`data:image/jpeg;base64,\${image}\`,
    fileName: "photo.jpg",
  }),
});`,

        go: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "mime/multipart"
    "net/http"
    "os"
)

func main() {
    apiKey := "${apiKey}"
    apiURL := "${API_BASE}/api/v1/analyze"

    // Open file
    file, _ := os.Open("photo.jpg")
    defer file.Close()

    // Create multipart form
    body := &bytes.Buffer{}
    writer := multipart.NewWriter(body)
    part, _ := writer.CreateFormFile("image", "photo.jpg")
    io.Copy(part, file)
    writer.Close()

    // Send request
    req, _ := http.NewRequest("POST", apiURL, body)
    req.Header.Set("X-API-Key", apiKey)
    req.Header.Set("Content-Type", writer.FormDataContentType())

    resp, _ := http.DefaultClient.Do(req)
    defer resp.Body.Close()

    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Printf("Result: %+v\\n", result)
}`,
    };

    return (
        <>
            <Header active="/api-docs" />
            <main className="api-docs-page">
                {/* Hero */}
                <section className="api-hero">
                    <div className="api-hero-badge">API v1</div>
                    <h1>SourceVerify API</h1>
                    <p className="api-hero-desc">
                        Integrate AI-generated content detection into your applications.
                        Analyze images programmatically with our powerful multi-signal detection engine.
                    </p>
                </section>

                <div className="api-docs-container">
                    {/* Auth Section */}
                    <section className="api-section" id="authentication">
                        <h2>🔐 Authentication</h2>
                        <p>Sign in with Google to get your personal API key. Each user receives a unique key for tracking usage.</p>

                        {user ? (
                            <div className="api-user-card">
                                <div className="api-user-info">
                                    {user.picture && <img src={user.picture} alt="" className="api-user-avatar" />}
                                    <div>
                                        <div className="api-user-name">{user.name}</div>
                                        <div className="api-user-email">{user.email}</div>
                                        <div className="api-user-usage">API calls: {user.usageCount}</div>
                                    </div>
                                </div>
                                <div className="api-key-box">
                                    <label>Your API Key</label>
                                    <div className="api-key-row">
                                        <code className="api-key-value">{user.apiKey}</code>
                                        <button onClick={copyKey} className="api-copy-btn">
                                            {copied ? "✓ Copied" : "📋 Copy"}
                                        </button>
                                    </div>
                                </div>
                                <div className="api-user-actions">
                                    <button onClick={testApi} className="api-test-btn" disabled={testing}>
                                        {testing ? "⏳ Testing..." : "🧪 Test API"}
                                    </button>
                                    <button onClick={logout} className="api-logout-btn">Sign Out</button>
                                </div>
                            </div>
                        ) : (
                            <div className="api-signin-card">
                                <div id="google-signin-btn"></div>
                                {!GOOGLE_CLIENT_ID && (
                                    <p className="api-note">
                                        ⚠️ Google Client ID not configured. Set <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in your environment.
                                    </p>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Endpoint */}
                    <section className="api-section" id="endpoint">
                        <h2>📡 Endpoint</h2>
                        <div className="api-endpoint-card">
                            <div className="api-method">POST</div>
                            <code className="api-url">/api/v1/analyze</code>
                        </div>

                        <h3>Headers</h3>
                        <table className="api-table">
                            <thead><tr><th>Header</th><th>Required</th><th>Description</th></tr></thead>
                            <tbody>
                                <tr><td><code>X-API-Key</code></td><td>✅</td><td>Your API key</td></tr>
                                <tr><td><code>Content-Type</code></td><td>❌</td><td><code>multipart/form-data</code> or <code>application/json</code></td></tr>
                            </tbody>
                        </table>

                        <h3>Request Body</h3>
                        <table className="api-table">
                            <thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
                            <tbody>
                                <tr><td><code>image</code></td><td>File / Base64</td><td>Image to analyze (max 10MB, JPEG/PNG/WebP)</td></tr>
                                <tr><td><code>fileName</code></td><td>String</td><td>Optional filename (for JSON requests)</td></tr>
                            </tbody>
                        </table>
                    </section>

                    {/* Response */}
                    <section className="api-section" id="response">
                        <h2>📦 Response</h2>
                        <pre className="api-response-example">{JSON.stringify({
                            success: true,
                            data: {
                                verdict: "ai",
                                confidence: 87,
                                aiScore: 78,
                                signals: [
                                    { name: "Noise Residual", score: 82, weight: 3.5 },
                                    { name: "Spectral Nyquist", score: 75, weight: 3.0 },
                                    { name: "Edge Coherence", score: 70, weight: 1.5 },
                                ],
                                processingTimeMs: 245,
                                imageInfo: { width: 1024, height: 768, format: "JPEG" },
                            },
                            meta: { apiVersion: "v1", timestamp: "2026-02-27T12:00:00Z" },
                        }, null, 2)}</pre>

                        <h3>Verdict Values</h3>
                        <table className="api-table">
                            <thead><tr><th>Value</th><th>Meaning</th><th>AI Score Range</th></tr></thead>
                            <tbody>
                                <tr><td><code className="verdict-ai">&quot;ai&quot;</code></td><td>Likely AI-generated</td><td>≥ 55</td></tr>
                                <tr><td><code className="verdict-real">&quot;real&quot;</code></td><td>Likely authentic</td><td>≤ 40</td></tr>
                                <tr><td><code className="verdict-unc">&quot;uncertain&quot;</code></td><td>Inconclusive</td><td>41-54</td></tr>
                            </tbody>
                        </table>

                        <h3>Error Responses</h3>
                        <table className="api-table">
                            <thead><tr><th>Code</th><th>Meaning</th></tr></thead>
                            <tbody>
                                <tr><td>401</td><td>Missing API key</td></tr>
                                <tr><td>403</td><td>Invalid API key</td></tr>
                                <tr><td>413</td><td>Image too large (&gt;10MB)</td></tr>
                                <tr><td>500</td><td>Analysis failed</td></tr>
                            </tbody>
                        </table>
                    </section>

                    {/* Code Examples */}
                    <section className="api-section" id="examples">
                        <h2>💻 Code Examples</h2>
                        <div className="api-tabs">
                            {(["curl", "python", "javascript", "go"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    className={`api-tab ${activeTab === tab ? "active" : ""}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab === "curl" ? "cURL" : tab === "python" ? "Python" : tab === "javascript" ? "JavaScript" : "Go"}
                                </button>
                            ))}
                        </div>
                        <pre className="api-code-block">{codeExamples[activeTab]}</pre>
                    </section>

                    {/* Test Result */}
                    {testResult && (
                        <section className="api-section" id="test-result">
                            <h2>🧪 Test Result</h2>
                            <pre className="api-response-example">{testResult}</pre>
                        </section>
                    )}

                    {/* Rate Limits */}
                    <section className="api-section" id="limits">
                        <h2>⚡ Rate Limits & Info</h2>
                        <table className="api-table">
                            <thead><tr><th>Limit</th><th>Value</th></tr></thead>
                            <tbody>
                                <tr><td>Max image size</td><td>10 MB</td></tr>
                                <tr><td>Supported formats</td><td>JPEG, PNG, WebP, BMP, GIF</td></tr>
                                <tr><td>Processing time</td><td>~200-500ms per image</td></tr>
                                <tr><td>Signals analyzed</td><td>6 core signals (server-side)</td></tr>
                            </tbody>
                        </table>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
